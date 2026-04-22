import Anthropic from '@anthropic-ai/sdk';
import type { Response } from 'express';
import * as ps from '../automation/partsource';
import { findAlternativeVendors, parseAvailability } from '../automation/vendors';
import { browser } from '../automation/browser';
import type { ChatMessage, Part, VendorAlternative } from '../types';

const client = new Anthropic();

const TOOLS: Anthropic.Tool[] = [
  // ── Existing tools ──────────────────────────────────────────────────────────
  {
    name: 'search_parts',
    description:
      'Search for parts on PartsSource.com. Automatically flags any backordered or low-stock results.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Part name, description, or part number' },
        page: { type: 'number', description: 'Results page number (default 1)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_part_details',
    description: 'Get full details for a specific part URL including real-time availability.',
    input_schema: {
      type: 'object' as const,
      properties: {
        part_url: { type: 'string', description: 'Full product page URL' },
      },
      required: ['part_url'],
    },
  },
  {
    name: 'add_to_cart',
    description: 'Add a part to the shopping cart.',
    input_schema: {
      type: 'object' as const,
      properties: {
        part_url: { type: 'string', description: 'Product page URL' },
        quantity: { type: 'number', description: 'Quantity to add' },
      },
      required: ['part_url', 'quantity'],
    },
  },
  {
    name: 'view_cart',
    description: 'View all items in the cart.',
    input_schema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'view_orders',
    description: 'View recent orders, optionally filtered by status.',
    input_schema: {
      type: 'object' as const,
      properties: {
        status_filter: { type: 'string', description: 'e.g. "pending", "shipped", "delivered"' },
      },
    },
  },
  {
    name: 'place_order',
    description: 'Place the order for all cart items. Only call after explicit user confirmation.',
    input_schema: {
      type: 'object' as const,
      properties: {
        confirmed: { type: 'boolean', description: 'Must be true — user confirmed the order' },
      },
      required: ['confirmed'],
    },
  },

  // ── Backorder / predictive tools ────────────────────────────────────────────
  {
    name: 'check_backorder_status',
    description:
      'Check whether a specific part is on backorder or has a high risk of going on backorder. Returns a risk score (0–100) and reason.',
    input_schema: {
      type: 'object' as const,
      properties: {
        part_url: { type: 'string', description: 'Full product page URL to check' },
        part_number: { type: 'string', description: 'Part number (for context)' },
        description: { type: 'string', description: 'Part description (for context)' },
      },
      required: ['part_url'],
    },
  },
  {
    name: 'find_alternative_vendors',
    description:
      'Search Grainger, MSC Direct, and Motion Industries for in-stock alternatives to a backordered or at-risk part.',
    input_schema: {
      type: 'object' as const,
      properties: {
        part_number: { type: 'string', description: 'Original part number to find alternatives for' },
        description: { type: 'string', description: 'Part description / keyword' },
        manufacturer: { type: 'string', description: 'Original manufacturer name' },
      },
      required: ['description'],
    },
  },
  {
    name: 'generate_backorder_email',
    description:
      'Draft a professional procurement email alerting the recipient about backordered parts and listing in-stock alternatives. Returns a complete email draft.',
    input_schema: {
      type: 'object' as const,
      properties: {
        recipient_name: { type: 'string', description: 'Name of the email recipient' },
        recipient_email: { type: 'string', description: 'Email address of recipient' },
        backordered_parts: {
          type: 'array',
          description: 'List of backordered parts',
          items: {
            type: 'object',
            properties: {
              partNumber: { type: 'string' },
              description: { type: 'string' },
              manufacturer: { type: 'string' },
              availability: { type: 'string' },
              riskReason: { type: 'string' },
            },
          },
        },
        alternatives: {
          type: 'array',
          description: 'In-stock alternatives from other vendors',
          items: {
            type: 'object',
            properties: {
              vendor: { type: 'string' },
              partNumber: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'string' },
              availability: { type: 'string' },
              url: { type: 'string' },
            },
          },
        },
        sender_name: { type: 'string', description: 'Name to sign the email with' },
        urgency: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Urgency level of the alert',
        },
      },
      required: ['backordered_parts', 'alternatives'],
    },
  },
];

const SYSTEM_PROMPT = `You are an AI procurement assistant for PartsSource.com — an industrial B2B parts marketplace.
You help procurement teams search for parts, manage orders, and proactively manage supply chain risk.

## Backorder Intelligence
- When searching for parts, ALWAYS check the availability of each result using parseAvailability logic.
- If any part has a risk score ≥ 50, proactively call check_backorder_status for those parts.
- If a part is backordered or high-risk, IMMEDIATELY call find_alternative_vendors to find in-stock options.
- After finding alternatives, offer to generate a backorder alert email.
- Present risk scores visually: 🟢 Low (0–30), 🟡 Moderate (31–60), 🟠 High (61–85), 🔴 Critical (86–100).

## Response format
- Be concise and professional.
- Use markdown tables or bullet lists for part results.
- Always show risk scores alongside availability when presenting parts.
- For email drafts, present the full email body clearly.
- If the user is not logged in, tell them to log in first.
- Always confirm before placing an order.`;

// ── Tool executor ─────────────────────────────────────────────────────────────

async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  try {
    switch (name) {

      case 'search_parts': {
        const result = await ps.searchParts(input.query as string, (input.page as number) ?? 1);
        if (!result.success) return `Search failed: ${result.error}`;
        const parts = result.data ?? [];
        if (parts.length === 0) return `No results found for "${input.query as string}"`;

        const rows = parts.map((p, i) => {
          const { riskScore, riskReason } = parseAvailability(p.availability);
          const riskEmoji = riskScore >= 86 ? '🔴' : riskScore >= 61 ? '🟠' : riskScore >= 31 ? '🟡' : '🟢';
          return `${i + 1}. **${p.description}**\n   Part#: \`${p.partNumber || 'N/A'}\` | Mfr: ${p.manufacturer || 'N/A'} | Price: ${p.price}\n   Availability: ${p.availability} ${riskEmoji} Risk: ${riskScore}/100 (${riskReason})\n   URL: ${p.url}`;
        }).join('\n\n');

        const highRisk = parts.filter((p) => parseAvailability(p.availability).riskScore >= 61);
        const warning = highRisk.length > 0
          ? `\n\n⚠️ **${highRisk.length} part(s) have high backorder risk.** I can search for alternatives — just ask.`
          : '';

        return `Found ${parts.length} results:\n\n${rows}${warning}`;
      }

      case 'get_part_details': {
        const result = await ps.getPartDetails(input.part_url as string);
        if (!result.success) return `Could not fetch part: ${result.error}`;
        const p = result.data!;
        const { riskScore, riskReason, isBackordered } = parseAvailability(p.availability);
        const riskEmoji = riskScore >= 86 ? '🔴' : riskScore >= 61 ? '🟠' : riskScore >= 31 ? '🟡' : '🟢';
        return [
          `**${p.description}**`,
          `Part #: \`${p.partNumber}\` | Manufacturer: ${p.manufacturer}`,
          `Price: ${p.price}`,
          `Availability: ${p.availability} ${riskEmoji} Backorder Risk: ${riskScore}/100`,
          `Risk Reason: ${riskReason}`,
          isBackordered ? `\n🚨 **This part is on backorder.** Use \`find_alternative_vendors\` to locate in-stock options.` : '',
          p.leadTime ? `Lead Time: ${p.leadTime}` : '',
        ].filter(Boolean).join('\n');
      }

      case 'add_to_cart': {
        const result = await ps.addToCart(input.part_url as string, (input.quantity as number) ?? 1);
        if (!result.success) return `Add to cart failed: ${result.error}`;
        return result.data!.message;
      }

      case 'view_cart': {
        const result = await ps.viewCart();
        if (!result.success) return `Could not load cart: ${result.error}`;
        const cart = result.data!;
        if (cart.items.length === 0) return 'Your cart is empty.';
        const lines = cart.items.map((item) =>
          `- ${item.part.description} × ${item.quantity} = ${item.lineTotal || item.part.price}`,
        );
        return `**Cart (${cart.itemCount} item${cart.itemCount !== 1 ? 's' : ''}):**\n${lines.join('\n')}\n\n**Subtotal:** ${cart.subtotal}`;
      }

      case 'view_orders': {
        const result = await ps.viewOrders(input.status_filter as string | undefined);
        if (!result.success) return `Could not load orders: ${result.error}`;
        const orders = result.data ?? [];
        if (orders.length === 0) return 'No orders found.';
        return orders.map((o) => `- Order **${o.orderNumber}** | ${o.date} | ${o.status} | ${o.total}`).join('\n');
      }

      case 'place_order': {
        if (!input.confirmed) return 'Order not confirmed.';
        const result = await ps.placeOrder();
        if (!result.success) return `Order failed: ${result.error}`;
        return `✅ Order placed! Confirmation: **${result.data!.confirmationNumber}**`;
      }

      case 'check_backorder_status': {
        const result = await ps.getPartDetails(input.part_url as string);
        if (!result.success) return `Could not check availability: ${result.error}`;
        const p = result.data!;
        const { riskScore, riskReason, isBackordered } = parseAvailability(p.availability);
        const riskEmoji = riskScore >= 86 ? '🔴' : riskScore >= 61 ? '🟠' : riskScore >= 31 ? '🟡' : '🟢';

        return JSON.stringify({
          partNumber: p.partNumber || (input.part_number as string) || '',
          description: p.description || (input.description as string) || '',
          manufacturer: p.manufacturer,
          availability: p.availability,
          price: p.price,
          isBackordered,
          riskScore,
          riskReason,
          riskEmoji,
          url: input.part_url as string,
          summary: isBackordered
            ? `🔴 BACKORDERED: ${p.description} (Part# ${p.partNumber}) — ${riskReason}`
            : `${riskEmoji} Risk ${riskScore}/100: ${p.description} — ${riskReason}`,
        });
      }

      case 'find_alternative_vendors': {
        const result = await findAlternativeVendors(
          (input.part_number as string) || '',
          (input.description as string) || '',
          (input.manufacturer as string) || '',
        );
        if (!result.success) return `Vendor search failed: ${result.error}`;
        const alts = result.data ?? [];

        if (alts.length === 0) {
          return 'No in-stock alternatives found at Grainger, MSC Direct, or Motion Industries for this query.';
        }

        const rows = alts.map((a, i) =>
          `${i + 1}. ${a.vendorLogo} **${a.vendor}** — ${a.description}\n   Part#: \`${a.partNumber || 'N/A'}\` | Mfr: ${a.manufacturer || 'N/A'} | Price: ${a.price}\n   Stock: ✅ ${a.availability}\n   [View →](${a.url})`,
        ).join('\n\n');

        return `Found **${alts.length} in-stock alternative(s)**:\n\n${rows}\n\nWould you like me to draft a backorder alert email with these options?`;
      }

      case 'generate_backorder_email': {
        const backordered = (input.backordered_parts as Array<Record<string, string>>) ?? [];
        const alternatives = (input.alternatives as Array<Record<string, string>>) ?? [];
        const recipientName = (input.recipient_name as string) || 'Procurement Team';
        const recipientEmail = (input.recipient_email as string) || '';
        const senderName = (input.sender_name as string) || 'PartsSource AI';
        const urgency = (input.urgency as string) || 'medium';

        const urgencyLine =
          urgency === 'high'
            ? '🚨 URGENT ACTION REQUIRED'
            : urgency === 'medium'
            ? '⚠️ ACTION REQUIRED'
            : 'ℹ️ FOR YOUR INFORMATION';

        const backoreredList = backordered
          .map((p) => `  • Part #${p.partNumber || 'N/A'} — ${p.description} (${p.manufacturer || 'N/A'})\n    Status: ${p.availability || 'Backordered'} | Risk: ${p.riskReason || 'On backorder'}`)
          .join('\n');

        const altList = alternatives
          .map((a, i) => `  ${i + 1}. ${a.vendor} — ${a.description}\n     Part #: ${a.partNumber || 'N/A'} | Price: ${a.price} | Stock: ${a.availability}\n     Link: ${a.url}`)
          .join('\n\n');

        const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const subject = `${urgencyLine}: Backorder Alert — ${backordered.length} Part(s) Require Attention`;

        const body = `Subject: ${subject}
To: ${recipientEmail || '[recipient@company.com]'}
Date: ${today}

Dear ${recipientName},

${urgencyLine}

This is an automated alert from your PartsSource AI procurement system regarding ${backordered.length} part(s) that are currently on backorder or at high risk of backorder.

────────────────────────────────────────
BACKORDERED / AT-RISK PARTS
────────────────────────────────────────

${backoreredList || '  • No parts specified'}

These parts require immediate sourcing action to avoid production or maintenance delays.

────────────────────────────────────────
IN-STOCK ALTERNATIVES (Other Vendors)
────────────────────────────────────────

The following alternatives are currently available and can serve as drop-in replacements:

${altList || '  No alternatives found — please contact your supplier directly.'}

────────────────────────────────────────
RECOMMENDED ACTIONS
────────────────────────────────────────

  1. Review the alternatives above and confirm technical compatibility.
  2. Place orders with alternative vendors immediately to prevent delays.
  3. Contact PartsSource for an updated ETA on the backordered parts.
  4. Update your reorder points to prevent future stockouts on these items.

If you have any questions or need further assistance, please don't hesitate to reach out.

Best regards,
${senderName}
PartsSource AI Procurement System
Generated: ${today}`;

        return JSON.stringify({ subject, body, to: recipientEmail });
      }

      default:
        return `Unknown tool: ${name}`;
    }
  } catch (err) {
    return `Tool error: ${err instanceof Error ? err.message : String(err)}`;
  }
}

// ── Streaming agent loop ──────────────────────────────────────────────────────

export async function runAgentStream(
  userMessage: string,
  history: ChatMessage[],
  res: Response,
): Promise<void> {
  const send = (type: string, payload: unknown) =>
    res.write(`data: ${JSON.stringify({ type, payload })}\n\n`);

  if (!browser.isLoggedIn()) {
    send('text', 'You are not logged in to PartsSource. Please log in first using the Login tab.');
    send('done', null);
    return;
  }

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user', content: userMessage },
  ];

  try {
    let loopMessages = messages;

    while (true) {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages: loopMessages,
      });

      for (const block of response.content) {
        if (block.type === 'text') send('text', block.text);
      }

      if (response.stop_reason === 'end_turn') break;

      if (response.stop_reason === 'tool_use') {
        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        for (const block of response.content) {
          if (block.type !== 'tool_use') continue;

          send('tool_call', { name: block.name, input: block.input });
          const output = await executeTool(block.name, block.input as Record<string, unknown>);

          // Parse special structured payloads and forward them as typed events
          if (block.name === 'generate_backorder_email') {
            try {
              const parsed = JSON.parse(output) as { subject: string; body: string; to: string };
              send('email_draft', parsed);
            } catch { /* fall through to plain tool_result */ }
          }

          if (block.name === 'check_backorder_status') {
            try {
              const parsed = JSON.parse(output);
              send('backorder_alert', parsed);
            } catch { /* ignore */ }
          }

          send('tool_result', { name: block.name, output });
          toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: output });
        }

        loopMessages = [
          ...loopMessages,
          { role: 'assistant', content: response.content },
          { role: 'user', content: toolResults },
        ];
        continue;
      }

      break;
    }
  } catch (err) {
    send('error', err instanceof Error ? err.message : String(err));
  }

  send('done', null);
}
