import { Page } from 'playwright';
import { browser } from './browser';
import type { AutomationResult } from '../types';

export interface VendorPart {
  vendor: string;
  vendorLogo: string;
  partNumber: string;
  description: string;
  manufacturer: string;
  price: string;
  availability: string;
  inStock: boolean;
  url: string;
  imageUrl?: string;
}

// ── Availability helpers ──────────────────────────────────────────────────────

export function parseAvailability(text: string): {
  inStock: boolean;
  isBackordered: boolean;
  riskScore: number; // 0–100, higher = more at risk
  riskReason: string;
} {
  const t = text.toLowerCase().trim();

  const backorderedPatterns = [
    /backorder/i, /out of stock/i, /not available/i, /discontinued/i,
    /no longer available/i, /ships in \d+\s*(weeks|months)/i,
    /\d+[-–]\d+\s*weeks?/i, /contact for availability/i,
  ];
  const lowStockPatterns = [/only (\d+) (left|available|remaining)/i, /(\d+) in stock/i];
  const longLeadPatterns = [/ships in (\d+)[–-]?(\d*)\s*day/i, /lead time[:\s]+(\d+)/i];

  if (backorderedPatterns.some((p) => p.test(t))) {
    return { inStock: false, isBackordered: true, riskScore: 100, riskReason: 'Currently on backorder' };
  }

  for (const p of lowStockPatterns) {
    const m = t.match(p);
    if (m) {
      const qty = parseInt(m[1] ?? '0', 10);
      if (qty === 0) return { inStock: false, isBackordered: true, riskScore: 100, riskReason: 'Zero stock' };
      if (qty <= 3) return { inStock: true, isBackordered: false, riskScore: 85, riskReason: `Critical low stock: only ${qty} remaining` };
      if (qty <= 10) return { inStock: true, isBackordered: false, riskScore: 60, riskReason: `Low stock: ${qty} remaining` };
    }
  }

  for (const p of longLeadPatterns) {
    const m = t.match(p);
    if (m) {
      const days = parseInt(m[1] ?? '0', 10);
      if (days >= 14) return { inStock: true, isBackordered: false, riskScore: 70, riskReason: `Long lead time: ${days}+ days` };
      if (days >= 7) return { inStock: true, isBackordered: false, riskScore: 40, riskReason: `Lead time: ${days} days` };
    }
  }

  if (/in stock|available|ships today|same day/i.test(t)) {
    return { inStock: true, isBackordered: false, riskScore: 5, riskReason: 'In stock' };
  }

  // Unknown availability — treat as moderate risk
  return { inStock: true, isBackordered: false, riskScore: 30, riskReason: 'Availability unconfirmed' };
}

// ── Grainger ──────────────────────────────────────────────────────────────────

async function searchGrainger(page: Page, query: string): Promise<VendorPart[]> {
  await page.goto(
    `https://www.grainger.com/search?searchQuery=${encodeURIComponent(query)}`,
    { waitUntil: 'domcontentloaded', timeout: 30000 },
  );

  await page.waitForSelector(
    '[data-testid="search-results"], .search-result, [class*="SearchResult"], [class*="ProductItem"]',
    { timeout: 12000 },
  ).catch(() => {});

  return page.evaluate((): VendorPart[] => {
    const results: VendorPart[] = [];
    const cards = Array.from(
      document.querySelectorAll(
        '[data-testid="product-card"], [class*="ProductItem"], [class*="SearchResultItem"], .search-result',
      ),
    ).slice(0, 5);

    cards.forEach((card, i) => {
      const getText = (sel: string) => (card.querySelector(sel) as HTMLElement)?.innerText?.trim() ?? '';
      const getAttr = (sel: string, attr: string) => (card.querySelector(sel) as HTMLElement)?.getAttribute(attr) ?? '';
      const linkEl = card.querySelector('a[href]') as HTMLAnchorElement | null;

      const description = getText('[class*="title"], [class*="name"], h2, h3, a') || `Item ${i + 1}`;
      const availability = getText('[class*="availability"], [class*="stock"], [class*="fulfillment"]') || '';
      const price = getText('[class*="price"], [class*="Price"]') || 'See site';
      const { inStock } = (window as unknown as { parseAvail?: (t: string) => { inStock: boolean } }).parseAvail?.(availability) ?? { inStock: !availability.toLowerCase().includes('backorder') };

      results.push({
        vendor: 'Grainger',
        vendorLogo: '🟡',
        partNumber: getText('[class*="itemNum"], [class*="item-number"], [class*="sku"]') || '',
        description,
        manufacturer: getText('[class*="brand"], [class*="manufacturer"]') || '',
        price,
        availability: availability || 'Check site',
        inStock: !availability.toLowerCase().includes('backorder') && !availability.toLowerCase().includes('out of stock'),
        url: linkEl ? `https://www.grainger.com${linkEl.getAttribute('href') ?? ''}` : 'https://www.grainger.com',
        imageUrl: (card.querySelector('img') as HTMLImageElement)?.src ?? '',
      });
    });
    return results;
  });
}

// ── MSC Direct ────────────────────────────────────────────────────────────────

async function searchMSC(page: Page, query: string): Promise<VendorPart[]> {
  await page.goto(
    `https://www.mscdirect.com/browse/tn?searchterm=${encodeURIComponent(query)}`,
    { waitUntil: 'domcontentloaded', timeout: 30000 },
  );

  await page.waitForSelector(
    '[id*="product"], .search-result, [class*="product-listing"], [class*="productItem"]',
    { timeout: 12000 },
  ).catch(() => {});

  return page.evaluate((): VendorPart[] => {
    const results: VendorPart[] = [];
    const cards = Array.from(
      document.querySelectorAll('[class*="productItem"], [class*="product-item"], .product, [data-item-type]'),
    ).slice(0, 5);

    cards.forEach((card, i) => {
      const getText = (sel: string) => (card.querySelector(sel) as HTMLElement)?.innerText?.trim() ?? '';
      const linkEl = card.querySelector('a[href]') as HTMLAnchorElement | null;
      const availability = getText('[class*="availability"], [class*="stock"], [class*="inventory"]') || '';

      results.push({
        vendor: 'MSC Direct',
        vendorLogo: '🔵',
        partNumber: getText('[class*="mfr"], [class*="sku"], [class*="itemnum"]') || '',
        description: getText('[class*="description"], [class*="title"], h2, h3, a') || `Item ${i + 1}`,
        manufacturer: getText('[class*="brand"], [class*="manufacturer"]') || '',
        price: getText('[class*="price"], [class*="Price"]') || 'See site',
        availability: availability || 'Check site',
        inStock: !availability.toLowerCase().includes('backorder') && !availability.toLowerCase().includes('out of stock'),
        url: linkEl
          ? linkEl.href.startsWith('http')
            ? linkEl.href
            : `https://www.mscdirect.com${linkEl.getAttribute('href') ?? ''}`
          : 'https://www.mscdirect.com',
        imageUrl: (card.querySelector('img') as HTMLImageElement)?.src ?? '',
      });
    });
    return results;
  });
}

// ── Motion Industries ─────────────────────────────────────────────────────────

async function searchMotion(page: Page, query: string): Promise<VendorPart[]> {
  await page.goto(
    `https://www.motionindustries.com/products/search?q=${encodeURIComponent(query)}`,
    { waitUntil: 'domcontentloaded', timeout: 30000 },
  );

  await page.waitForSelector('[class*="product"], [class*="search-result"]', { timeout: 12000 }).catch(() => {});

  return page.evaluate((): VendorPart[] => {
    const results: VendorPart[] = [];
    const cards = Array.from(
      document.querySelectorAll('[class*="productCard"], [class*="product-card"], [class*="search-result"]'),
    ).slice(0, 5);

    cards.forEach((card, i) => {
      const getText = (sel: string) => (card.querySelector(sel) as HTMLElement)?.innerText?.trim() ?? '';
      const linkEl = card.querySelector('a[href]') as HTMLAnchorElement | null;
      const availability = getText('[class*="availability"], [class*="stock"]') || '';

      results.push({
        vendor: 'Motion Industries',
        vendorLogo: '🟠',
        partNumber: getText('[class*="partNum"], [class*="part-number"]') || '',
        description: getText('[class*="description"], [class*="name"], h2, h3') || `Item ${i + 1}`,
        manufacturer: getText('[class*="brand"], [class*="mfr"]') || '',
        price: getText('[class*="price"]') || 'See site',
        availability: availability || 'Check site',
        inStock: !availability.toLowerCase().includes('backorder') && !availability.toLowerCase().includes('out of stock'),
        url: linkEl ? `https://www.motionindustries.com${linkEl.getAttribute('href') ?? ''}` : 'https://www.motionindustries.com',
        imageUrl: (card.querySelector('img') as HTMLImageElement)?.src ?? '',
      });
    });
    return results;
  });
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function findAlternativeVendors(
  partNumber: string,
  description: string,
  manufacturer: string,
): Promise<AutomationResult<VendorPart[]>> {
  let page = await browser.newPage();
  const results: VendorPart[] = [];
  const query = partNumber || `${manufacturer} ${description}`.trim();

  try {
    // Try Grainger
    try {
      const grainger = await searchGrainger(page, query);
      results.push(...grainger.filter((p) => p.inStock));
    } catch { /* continue */ }
    await page.close();

    // Try MSC Direct
    page = await browser.newPage();
    try {
      const msc = await searchMSC(page, query);
      results.push(...msc.filter((p) => p.inStock));
    } catch { /* continue */ }
    await page.close();

    // Try Motion Industries
    page = await browser.newPage();
    try {
      const motion = await searchMotion(page, query);
      results.push(...motion.filter((p) => p.inStock));
    } catch { /* continue */ }

    return { success: true, data: results };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  } finally {
    await page.close().catch(() => {});
  }
}
