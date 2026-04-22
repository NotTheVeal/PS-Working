import Anthropic from '@anthropic-ai/sdk';
import type { Response } from 'express';
import * as ps from '../automation/partsource';
import { browser } from '../automation/browser';
import type { ChatMessage } from '../types';

const client = new Anthropic();

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_parts',
    description:
      'Search for parts on PartsSource.com by keyword, description, or part number. Returns a list of matching parts with pricing and availability.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Part name, description, or part number to search for' },
        page: { type: 'number', description: 'Results page number (default 1)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_part_details',
    description: 'Get detailed information about a specific part using its product page URL.',
    input_schema: {
      type: 'object' as const,
      properties: {
        part_url: { type: 'string', description: 'Full URL of the product page' },
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
        part_url: { type: 'string', description: 'Full URL of the product to add' },
        quantity: { type: 'number', description: 'Number of units to add (default 1)' },
      },
      required: ['part_url', 'quantity'],
    },
  },
  {
    name: 'view_cart',
    description: 'View all items currently in the shopping cart with quantities and prices.',
    input_schema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'view_orders',
    description: 'View recent purchase orders from the account order history.',
    input_schema: {
      type: 'object' as const,
      properties: {
        status_filter: {
          type: 'string',
          description: 'Optional status filter, e.g. "pending", "shipped", "delivered"',
        },
      },
    },
  },
  {
    name: 'place_order',
    description:
      'Place an order for all items in the cart. Only call this after the user has explicitly confirmed they want to submit the order.',
    input_schema: {
      type: 'object' as const,
      properties: {
        confirmed: {
          type: 'boolean',
          description: 'Must be true — user has confirmed the order',
        },
      },
      required: ['confirmed'],
    },
  },
];

const SYSTEM_PROMPT = `You are an AI procurement assistant for PartsSource.com — an industrial B2B parts marketplace.
You help users search for industrial and MRO parts, manage their cart, and track orders through browser automation.

Guidelines:
- Be concise and professional.
- When searching, show part numbers, descriptions, prices, and availability clearly.
- Always confirm before placing an order — summarize what's in the cart and ask the user to confirm.
- If the user is not logged in, tell them to log in via the Login tab first.
- Format results in clear markdown tables or bullet lists.
- If automation fails, explain what happened and suggest next steps.`;

async function executeTool(
  name: string,
  input: Record<string, unknown>,
): Promise<string> {
  try {
    switch (name) {
      case 'search_parts': {
        const result = await ps.searchParts(
          input.query as string,
          (input.page as number) ?? 1,
        );
        if (!result.success) return `Search failed: ${result.error}`;
        const parts = result.data ?? [];
        if (parts.length === 0) return 'No parts found.';
        const rows = parts
          .map(
            (p, i) =>
              `${i + 1}. **${p.description}**\n   Part#: ${p.partNumber || 'N/A'} | Mfr: ${p.manufacturer || 'N/A'} | Price: ${p.price} | Stock: ${p.availability}\n   URL: ${p.url}`,
          )
          .join('\n\n');
        return `Found ${parts.length} results:\n\n${rows}`;
      }

      case 'get_part_details': {
        const result = await ps.getPartDetails(input.part_url as string);
        if (!result.success) return `Could not fetch part details: ${result.error}`;
        const p = result.data!;
        return `**${p.description}**\nPart #: ${p.partNumber}\nManufacturer: ${p.manufacturer}\nPrice: ${p.price}\nAvailability: ${p.availability}\nLead Time: ${p.leadTime || 'N/A'}`;
      }

      case 'add_to_cart': {
        const result = await ps.addToCart(
          input.part_url as string,
          (input.quantity as number) ?? 1,
        );
        if (!result.success) return `Add to cart failed: ${result.error}`;
        return result.data!.message;
      }

      case 'view_cart': {
        const result = await ps.viewCart();
        if (!result.success) return `Could not load cart: ${result.error}`;
        const cart = result.data!;
        if (cart.items.length === 0) return 'Your cart is empty.';
        const lines = cart.items.map(
          (item) =>
            `- ${item.part.description} × ${item.quantity} = ${item.lineTotal || item.part.price}`,
        );
        return `**Cart (${cart.itemCount} item${cart.itemCount !== 1 ? 's' : ''}):**\n${lines.join('\n')}\n\n**Subtotal:** ${cart.subtotal}`;
      }

      case 'view_orders': {
        const result = await ps.viewOrders(input.status_filter as string | undefined);
        if (!result.success) return `Could not load orders: ${result.error}`;
        const orders = result.data ?? [];
        if (orders.length === 0) return 'No orders found.';
        const lines = orders.map(
          (o) => `- Order **${o.orderNumber}** | ${o.date} | Status: ${o.status} | Total: ${o.total}`,
        );
        return lines.join('\n');
      }

      case 'place_order': {
        if (!input.confirmed) return 'Order was not confirmed. Please confirm before placing.';
        const result = await ps.placeOrder();
        if (!result.success) return `Order failed: ${result.error}`;
        return `Order placed successfully! Confirmation: **${result.data!.confirmationNumber}**`;
      }

      default:
        return `Unknown tool: ${name}`;
    }
  } catch (err) {
    return `Tool error: ${err instanceof Error ? err.message : String(err)}`;
  }
}

export async function runAgentStream(
  userMessage: string,
  history: ChatMessage[],
  res: Response,
): Promise<void> {
  const sendEvent = (type: string, payload: unknown) => {
    res.write(`data: ${JSON.stringify({ type, payload })}\n\n`);
  };

  if (!browser.isLoggedIn()) {
    sendEvent('text', 'You are not logged in to PartsSource. Please log in first using the Login tab.');
    sendEvent('done', null);
    return;
  }

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user', content: userMessage },
  ];

  try {
    // Agentic loop: keep running until the model stops calling tools
    let loopMessages = messages;
    while (true) {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages: loopMessages,
      });

      // Stream text blocks as they arrive
      for (const block of response.content) {
        if (block.type === 'text') {
          sendEvent('text', block.text);
        }
      }

      if (response.stop_reason === 'end_turn') break;

      if (response.stop_reason === 'tool_use') {
        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        for (const block of response.content) {
          if (block.type === 'tool_use') {
            sendEvent('tool_call', { name: block.name, input: block.input });
            const toolOutput = await executeTool(
              block.name,
              block.input as Record<string, unknown>,
            );
            sendEvent('tool_result', { name: block.name, output: toolOutput });
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: toolOutput,
            });
          }
        }

        // Feed results back and continue
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
    sendEvent('error', err instanceof Error ? err.message : String(err));
  }

  sendEvent('done', null);
}
