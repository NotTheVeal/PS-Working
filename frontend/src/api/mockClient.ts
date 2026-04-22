import type { ChatMessage, SSEEvent, BackorderAlertData, EmailDraftData } from '../types';

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_PARTS = [
  {
    index: 1,
    partNumber: 'SKF-6205-2RS1',
    description: 'SKF Deep Groove Ball Bearing 6205-2RS1',
    manufacturer: 'SKF',
    price: '$14.82',
    availability: 'Only 3 left in stock',
    riskScore: 85,
    riskEmoji: '🟠',
    riskReason: 'Critical low stock: only 3 remaining',
    url: 'https://www.partssource.com/product/skf-6205-2rs1',
  },
  {
    index: 2,
    partNumber: 'STR-0238-0',
    description: 'Stryker Ultrasound Probe Cable Assembly',
    manufacturer: 'Stryker',
    price: '$289.00',
    availability: 'Backordered – Ships in 4–6 weeks',
    riskScore: 100,
    riskEmoji: '🔴',
    riskReason: 'Currently on backorder',
    url: 'https://www.partssource.com/product/str-0238-0',
  },
  {
    index: 3,
    partNumber: 'GE-2106480',
    description: 'GE Healthcare Ventilator Flow Sensor',
    manufacturer: 'GE Healthcare',
    price: '$412.50',
    availability: 'In Stock – Ships today',
    riskScore: 5,
    riskEmoji: '🟢',
    riskReason: 'In stock',
    url: 'https://www.partssource.com/product/ge-2106480',
  },
  {
    index: 4,
    partNumber: 'PHI-989803172881',
    description: 'Philips IntelliVue MP70 Power Supply Module',
    manufacturer: 'Philips',
    price: '$1,240.00',
    availability: 'Lead time: 14–18 business days',
    riskScore: 72,
    riskEmoji: '🟠',
    riskReason: 'Long lead time: 14+ days',
    url: 'https://www.partssource.com/product/phi-989803172881',
  },
  {
    index: 5,
    partNumber: 'DRE-4004321',
    description: 'Drager Vapor 2000 Vaporizer O-Ring Kit',
    manufacturer: 'Draeger',
    price: '$38.95',
    availability: '22 in stock',
    riskScore: 12,
    riskEmoji: '🟢',
    riskReason: 'In stock',
    url: 'https://www.partssource.com/product/dre-4004321',
  },
];

const MOCK_ALTERNATIVES = [
  {
    vendor: 'Grainger',
    vendorLogo: '🟡',
    partNumber: '5YE30',
    description: 'SKF 6205-2RSH Deep Groove Ball Bearing (equivalent)',
    manufacturer: 'SKF',
    price: '$16.50',
    availability: '127 In Stock',
    inStock: true,
    url: 'https://www.grainger.com/product/bearing-6205',
  },
  {
    vendor: 'MSC Direct',
    vendorLogo: '🔵',
    partNumber: '02645126',
    description: 'NSK 6205DDU Sealed Deep Groove Ball Bearing',
    manufacturer: 'NSK',
    price: '$13.74',
    availability: 'Ships from 3 locations',
    inStock: true,
    url: 'https://www.mscdirect.com/product/02645126',
  },
  {
    vendor: 'Motion Industries',
    vendorLogo: '🟠',
    partNumber: 'SKF-6205-2RSH',
    description: 'SKF 6205-2RSH Single Row Radial Bearing',
    manufacturer: 'SKF',
    price: '$15.20',
    availability: '45 Available',
    inStock: true,
    url: 'https://www.motionindustries.com/product/skf-6205-2rsh',
  },
];

const MOCK_STRYKER_ALTERNATIVES = [
  {
    vendor: 'Grainger',
    vendorLogo: '🟡',
    partNumber: '5REF-0238',
    description: 'Stryker Compatible Probe Cable (OEM Equivalent)',
    manufacturer: 'Soma Tech',
    price: '$198.00',
    availability: '8 In Stock',
    inStock: true,
    url: 'https://www.grainger.com/product/stryker-probe-alt',
  },
  {
    vendor: 'MSC Direct',
    vendorLogo: '🔵',
    partNumber: 'STR-ALT-0238',
    description: 'Refurbished Stryker Probe Cable Assembly – Tested',
    manufacturer: 'Tri-Imaging Health',
    price: '$165.00',
    availability: '3 Available – Ships same day',
    inStock: true,
    url: 'https://www.mscdirect.com/product/stryker-probe',
  },
];

const MOCK_CART = [
  { description: 'SKF 6205-2RS1 Deep Groove Bearing', quantity: 10, price: '$14.82', lineTotal: '$148.20' },
  { description: 'Drager Vapor 2000 O-Ring Kit', quantity: 2, price: '$38.95', lineTotal: '$77.90' },
];

const MOCK_ORDERS = [
  { orderNumber: 'PS-2024-089142', date: 'Apr 18, 2026', status: 'Shipped', total: '$1,482.00' },
  { orderNumber: 'PS-2024-088771', date: 'Apr 12, 2026', status: 'Delivered', total: '$621.40' },
  { orderNumber: 'PS-2024-087503', date: 'Apr 5, 2026', status: 'Processing', total: '$289.00' },
];

function makeEmailDraft(
  parts: typeof MOCK_PARTS,
  alternatives: typeof MOCK_ALTERNATIVES,
): EmailDraftData {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const backordered = parts.filter((p) => p.riskScore >= 61);
  const subject = `⚠️ ACTION REQUIRED: Backorder Alert — ${backordered.length} Part(s) Require Attention`;

  const backororderedList = backordered
    .map((p) => `  • Part #${p.partNumber} — ${p.description} (${p.manufacturer})\n    Status: ${p.availability} | Risk: ${p.riskReason}`)
    .join('\n');

  const altList = alternatives
    .map((a, i) => `  ${i + 1}. ${a.vendor} — ${a.description}\n     Part #: ${a.partNumber} | Price: ${a.price} | Stock: ${a.availability}\n     Link: ${a.url}`)
    .join('\n\n');

  const body = `Subject: ${subject}
To: procurement@chathamhospital.org
Date: ${today}

Dear Procurement Team,

⚠️ ACTION REQUIRED

This is an automated alert from your PartsSource AI procurement system regarding ${backordered.length} part(s) that are currently on backorder or at high risk of backorder.

────────────────────────────────────────
BACKORDERED / AT-RISK PARTS
────────────────────────────────────────

${backororderedList}

These parts require immediate sourcing action to avoid operational delays.

────────────────────────────────────────
IN-STOCK ALTERNATIVES (Other Vendors)
────────────────────────────────────────

The following alternatives are currently available:

${altList}

────────────────────────────────────────
RECOMMENDED ACTIONS
────────────────────────────────────────

  1. Review the alternatives above and confirm technical compatibility.
  2. Place orders with alternative vendors immediately to prevent delays.
  3. Contact PartsSource for an updated ETA on the backordered parts.
  4. Update reorder points to prevent future stockouts on these items.

Best regards,
PartsSource AI Procurement System
Generated: ${today}`;

  return { subject, body, to: 'procurement@chathamhospital.org' };
}

// ── Simulated streaming ───────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

function matchIntent(msg: string) {
  const m = msg.toLowerCase();
  if (/search|find|look|bearing|valve|probe|sensor|stryker|skf|ge |philips|drager/i.test(m)) return 'search';
  if (/backorder|alternative|other vendor|grainger|msc|motion|in.?stock/i.test(m)) return 'alternatives';
  if (/cart|basket/i.test(m)) return 'cart';
  if (/order|history|placed|shipped|delivered/i.test(m)) return 'orders';
  if (/email|alert|notify|draft|send/i.test(m)) return 'email';
  if (/hello|hi |hey |help|what can/i.test(m)) return 'greeting';
  return 'search'; // default
}

export async function mockChatStream(
  userMessage: string,
  _history: ChatMessage[],
  onEvent: (e: SSEEvent) => void,
): Promise<void> {
  const intent = matchIntent(userMessage);

  const send = (type: SSEEvent['type'], payload: unknown) => onEvent({ type, payload });
  const text = (t: string) => send('text', t);
  const toolCall = (name: string, input: unknown) => send('tool_call', { name, input });
  const toolResult = (name: string, output: string) => send('tool_result', { name, output });

  if (intent === 'greeting') {
    await delay(400);
    text("Hello! I'm your PartsSource AI procurement assistant. I can help you:\n\n- 🔍 **Search** for medical and industrial parts with real-time backorder risk\n- 🚨 **Detect** backorder risks and find in-stock alternatives at Grainger, MSC Direct, and Motion Industries\n- ✉️ **Draft** professional backorder alert emails\n- 🛒 **Manage** your cart and place orders\n\nTry asking me to *search for SKF 6205 bearings* or *check if any parts are on backorder*!");
    send('done', null);
    return;
  }

  if (intent === 'cart') {
    await delay(300);
    toolCall('view_cart', {});
    await delay(800);
    const cartLines = MOCK_CART.map((i) => `- ${i.description} × ${i.quantity} = ${i.lineTotal}`).join('\n');
    toolResult('view_cart', `Cart (2 items):\n${cartLines}\n\nSubtotal: $226.10`);
    await delay(300);
    text(`**Cart (2 items):**\n${cartLines}\n\n**Subtotal:** $226.10\n\nWould you like to proceed to checkout or continue shopping?`);
    send('done', null);
    return;
  }

  if (intent === 'orders') {
    await delay(300);
    toolCall('view_orders', {});
    await delay(900);
    const orderLines = MOCK_ORDERS.map((o) => `- Order **${o.orderNumber}** | ${o.date} | ${o.status} | ${o.total}`).join('\n');
    toolResult('view_orders', orderLines);
    await delay(300);
    text(`**Recent Orders:**\n\n${orderLines}\n\nWould you like details on any of these orders?`);
    send('done', null);
    return;
  }

  if (intent === 'email') {
    await delay(300);
    text("Drafting a backorder alert email with the at-risk parts and in-stock alternatives...\n\n");
    await delay(500);
    toolCall('generate_backorder_email', {
      backordered_parts: MOCK_PARTS.filter((p) => p.riskScore >= 61),
      alternatives: MOCK_ALTERNATIVES,
      recipient_name: 'Procurement Team',
      urgency: 'medium',
    });
    await delay(1200);
    const draft = makeEmailDraft(MOCK_PARTS, MOCK_ALTERNATIVES);
    toolResult('generate_backorder_email', JSON.stringify(draft));
    send('email_draft', draft);
    await delay(300);
    text("✅ Email draft ready! You can open it in your mail app, copy the text, or download as `.eml` to open in Outlook.");
    send('done', null);
    return;
  }

  if (intent === 'alternatives') {
    await delay(300);
    text("Searching alternative vendors for in-stock options...\n\n");
    await delay(400);
    toolCall('find_alternative_vendors', { description: 'SKF 6205 bearing', part_number: 'SKF-6205-2RS1' });
    await delay(1500);
    const altText = MOCK_ALTERNATIVES.map((a, i) =>
      `${i + 1}. ${a.vendorLogo} **${a.vendor}** — ${a.description}\n   Part#: \`${a.partNumber}\` | Price: ${a.price}\n   Stock: ✅ ${a.availability}\n   [View →](${a.url})`
    ).join('\n\n');
    toolResult('find_alternative_vendors', `Found 3 in-stock alternatives:\n\n${altText}`);
    await delay(400);
    text(`Found **3 in-stock alternatives** across Grainger, MSC Direct, and Motion Industries:\n\n${altText}\n\nAll three are confirmed in-stock and can ship immediately. Would you like me to **draft a procurement alert email** with these options for your team?`);
    send('done', null);
    return;
  }

  // ── Search flow (default) ──────────────────────────────────────────────────
  await delay(300);
  text("Searching PartsSource.com and analyzing backorder risk...\n\n");
  await delay(400);

  toolCall('search_parts', { query: userMessage });
  await delay(1800);

  const resultText = MOCK_PARTS.map((p) =>
    `${p.index}. **${p.description}**\n   Part#: \`${p.partNumber}\` | Mfr: ${p.manufacturer} | Price: ${p.price}\n   Availability: ${p.availability} ${p.riskEmoji} Risk: ${p.riskScore}/100 (${p.riskReason})`
  ).join('\n\n');

  toolResult('search_parts', `Found 5 results:\n\n${resultText}\n\n⚠️ 3 parts have high backorder risk.`);
  await delay(400);

  text(`Found **5 results**. Here's the availability analysis:\n\n${resultText}\n\n---\n\n⚠️ **3 parts have elevated backorder risk.** Let me check the two critical ones now.\n\n`);

  await delay(600);

  // Check backorder status for the SKF bearing
  toolCall('check_backorder_status', { part_url: MOCK_PARTS[0].url, description: MOCK_PARTS[0].description });
  await delay(1000);
  const skfAlert: BackorderAlertData = {
    partNumber: MOCK_PARTS[0].partNumber,
    description: MOCK_PARTS[0].description,
    manufacturer: MOCK_PARTS[0].manufacturer,
    availability: MOCK_PARTS[0].availability,
    isBackordered: false,
    riskScore: 85,
    riskReason: 'Critical low stock: only 3 remaining',
    riskEmoji: '🟠',
    url: MOCK_PARTS[0].url,
  };
  toolResult('check_backorder_status', JSON.stringify(skfAlert));
  send('backorder_alert', skfAlert);

  await delay(600);

  // Check backorder status for the Stryker probe
  toolCall('check_backorder_status', { part_url: MOCK_PARTS[1].url, description: MOCK_PARTS[1].description });
  await delay(1000);
  const strykerAlert: BackorderAlertData = {
    partNumber: MOCK_PARTS[1].partNumber,
    description: MOCK_PARTS[1].description,
    manufacturer: MOCK_PARTS[1].manufacturer,
    availability: MOCK_PARTS[1].availability,
    isBackordered: true,
    riskScore: 100,
    riskReason: 'Currently on backorder',
    riskEmoji: '🔴',
    url: MOCK_PARTS[1].url,
  };
  toolResult('check_backorder_status', JSON.stringify(strykerAlert));
  send('backorder_alert', strykerAlert);

  await delay(500);
  text("Now finding in-stock alternatives at other vendors...\n\n");

  // Find alternatives
  toolCall('find_alternative_vendors', { description: 'SKF 6205 bearing', part_number: 'SKF-6205-2RS1', manufacturer: 'SKF' });
  await delay(1600);
  const altText = MOCK_ALTERNATIVES.map((a, i) =>
    `${i + 1}. ${a.vendorLogo} **${a.vendor}** — ${a.description}\n   Part#: \`${a.partNumber}\` | Price: ${a.price} | ✅ ${a.availability}`
  ).join('\n\n');
  toolResult('find_alternative_vendors', altText);

  await delay(400);

  // Draft the email
  toolCall('generate_backorder_email', {
    backordered_parts: [skfAlert, strykerAlert],
    alternatives: [...MOCK_ALTERNATIVES, ...MOCK_STRYKER_ALTERNATIVES],
    urgency: 'high',
  });
  await delay(1000);
  const draft = makeEmailDraft(MOCK_PARTS, [...MOCK_ALTERNATIVES, ...MOCK_STRYKER_ALTERNATIVES]);
  toolResult('generate_backorder_email', JSON.stringify(draft));
  send('email_draft', draft);

  await delay(400);
  text(`**Summary of at-risk parts:**\n\n🔴 **Stryker Probe Cable (STR-0238-0)** — On backorder, 4–6 week lead time. Found **2 in-stock alternatives** at Grainger & MSC Direct starting at **$165**.\n\n🟠 **SKF 6205-2RS1 Bearing** — Only 3 left in stock. Found **3 in-stock alternatives** at Grainger, MSC, and Motion Industries starting at **$13.74**.\n\n✉️ Backorder alert email drafted above — ready to send to your procurement team.`);

  send('done', null);
}
