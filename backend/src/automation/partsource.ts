import { Page } from 'playwright';
import { browser } from './browser';
import type { AutomationResult, Part, Cart, Order } from '../types';

const BASE_URL = 'https://www.partssource.com';

async function withPage<T>(fn: (page: Page) => Promise<T>): Promise<AutomationResult<T>> {
  let page: Page | null = null;
  try {
    page = await browser.newPage();
    const data = await fn(page);
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  } finally {
    await page?.close();
  }
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function login(
  username: string,
  password: string,
): Promise<AutomationResult<{ username: string }>> {
  return withPage(async (page) => {
    await page.goto(`${BASE_URL}/account/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Dismiss any consent / modal overlays
    try {
      await page.click('[id*="cookie"] button, [class*="cookie"] button, .onetrust-accept-btn-handler', {
        timeout: 3000,
      });
    } catch {
      // no overlay
    }

    // Fill email / username
    const emailSel = 'input[name="email"], input[type="email"], input[name="username"], #email, #username';
    await page.waitForSelector(emailSel, { timeout: 15000 });
    await page.fill(emailSel, username);

    // Fill password
    const passSel = 'input[name="password"], input[type="password"], #password';
    await page.fill(passSel, password);

    // Submit
    await page.click('button[type="submit"], input[type="submit"], .login-btn, [data-testid="login-submit"]');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 });

    // Validate success — login page still showing means bad creds
    if (page.url().includes('/login') || page.url().includes('/signin')) {
      const errEl = await page.$('.error, [class*="error"], [class*="alert"]');
      const errText = errEl ? await errEl.innerText() : 'Invalid credentials';
      throw new Error(errText.trim() || 'Login failed');
    }

    browser.setLoggedIn(true);
    return { username };
  });
}

export async function logout(): Promise<AutomationResult> {
  return withPage(async (page) => {
    await page.goto(`${BASE_URL}/account/logout`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    browser.setLoggedIn(false);
    return {};
  });
}

// ── Search ────────────────────────────────────────────────────────────────────

export async function searchParts(
  query: string,
  page_number = 1,
): Promise<AutomationResult<Part[]>> {
  return withPage(async (page) => {
    const url = `${BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page_number}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for results container
    await page.waitForSelector(
      '[data-testid="search-results"], .search-results, .product-list, [class*="ProductList"], [class*="product-grid"]',
      { timeout: 15000 },
    );

    const parts = await page.evaluate((): Part[] => {
      const results: Part[] = [];

      // Try multiple card selectors used by various PartsSource UI versions
      const cards = Array.from(
        document.querySelectorAll(
          '[data-testid="product-card"], .product-card, [class*="ProductCard"], [class*="product-item"], .search-result-item',
        ),
      ).slice(0, 20);

      cards.forEach((card, idx) => {
        const getText = (sel: string) =>
          (card.querySelector(sel) as HTMLElement)?.innerText?.trim() ?? '';
        const getAttr = (sel: string, attr: string) =>
          (card.querySelector(sel) as HTMLElement)?.getAttribute(attr) ?? '';

        const partNumber =
          getText('[data-testid="part-number"], .part-number, [class*="PartNumber"]') ||
          getText('[class*="partNumber"]') ||
          '';

        const description =
          getText('[data-testid="product-name"], .product-name, h2, h3, [class*="ProductName"], [class*="product-title"]') ||
          getText('a[href*="/product"]') ||
          `Part ${idx + 1}`;

        const manufacturer =
          getText('[data-testid="manufacturer"], .manufacturer, [class*="Manufacturer"], [class*="brand"]') || '';

        const price =
          getText('[data-testid="price"], .price, [class*="Price"], [class*="price"]') || 'Contact for price';

        const availability =
          getText('[data-testid="availability"], .availability, [class*="Availability"], [class*="stock"]') ||
          'Check availability';

        const linkEl = card.querySelector('a[href]') as HTMLAnchorElement | null;
        const url = linkEl ? linkEl.href : '';

        const imgEl = card.querySelector('img') as HTMLImageElement | null;
        const imageUrl = imgEl?.src ?? '';

        if (description || partNumber) {
          results.push({
            id: `result-${idx}`,
            partNumber,
            description,
            manufacturer,
            price,
            availability,
            url,
            imageUrl,
          });
        }
      });

      return results;
    });

    if (parts.length === 0) {
      throw new Error(`No results found for "${query}"`);
    }

    return parts;
  });
}

// ── Part Details ──────────────────────────────────────────────────────────────

export async function getPartDetails(partUrl: string): Promise<AutomationResult<Part>> {
  return withPage(async (page) => {
    await page.goto(partUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const part = await page.evaluate((url): Part => {
      const getText = (sel: string) =>
        (document.querySelector(sel) as HTMLElement)?.innerText?.trim() ?? '';

      return {
        id: url,
        partNumber:
          getText('[data-testid="part-number"], .part-number, [class*="partNumber"]') || '',
        description:
          getText('h1, [data-testid="product-title"], .product-title') || document.title,
        manufacturer:
          getText('[data-testid="manufacturer"], .manufacturer, [class*="brand"]') || '',
        price:
          getText('[data-testid="price"], .price, [class*="Price"]') || 'Contact for price',
        availability:
          getText('[data-testid="availability"], .availability, [class*="Availability"]') || '',
        url,
        imageUrl: (document.querySelector('.product-image img, [class*="ProductImage"] img') as HTMLImageElement)?.src ?? '',
        leadTime:
          getText('[data-testid="lead-time"], .lead-time, [class*="leadTime"]') || '',
      };
    }, partUrl);

    return part;
  });
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export async function addToCart(
  partUrl: string,
  quantity: number,
): Promise<AutomationResult<{ message: string }>> {
  return withPage(async (page) => {
    await page.goto(partUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Set quantity if an input is present
    const qtySelectors = [
      'input[name="quantity"]',
      'input[id="quantity"]',
      'input[data-testid="quantity"]',
      '[class*="quantity"] input',
    ];
    for (const sel of qtySelectors) {
      const el = await page.$(sel);
      if (el) {
        await el.fill(String(quantity));
        break;
      }
    }

    // Click add to cart
    await page.click(
      'button[data-testid="add-to-cart"], .add-to-cart, [class*="AddToCart"], button:has-text("Add to Cart"), button:has-text("Add to Order")',
      { timeout: 10000 },
    );

    // Wait for confirmation feedback
    await page.waitForSelector(
      '[class*="confirmation"], [class*="cart-count"], .cart-notification, [data-testid="cart-count"]',
      { timeout: 10000 },
    ).catch(() => {
      // Some sites update silently
    });

    return { message: `Added ${quantity}× to cart` };
  });
}

export async function viewCart(): Promise<AutomationResult<Cart>> {
  return withPage(async (page) => {
    await page.goto(`${BASE_URL}/cart`, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const cart = await page.evaluate((): Cart => {
      const items: Cart['items'] = [];

      const rows = Array.from(
        document.querySelectorAll(
          '[data-testid="cart-item"], .cart-item, [class*="CartItem"], .cart-row',
        ),
      );

      rows.forEach((row) => {
        const getText = (sel: string) =>
          (row.querySelector(sel) as HTMLElement)?.innerText?.trim() ?? '';

        const description =
          getText('.product-name, [class*="ProductName"], h2, h3, a[href*="/product"]') || '';
        const quantity =
          parseInt(
            (row.querySelector('input[name="quantity"], input[type="number"]') as HTMLInputElement)?.value ?? '1',
            10,
          ) || 1;
        const price = getText('[class*="Price"], .price, .item-price') || '';
        const lineTotal = getText('[class*="LineTotal"], .line-total, .subtotal') || '';
        const imageUrl = (row.querySelector('img') as HTMLImageElement)?.src ?? '';
        const url = (row.querySelector('a[href*="/product"]') as HTMLAnchorElement)?.href ?? '';

        if (description) {
          items.push({
            part: {
              id: url,
              partNumber: getText('[class*="partNumber"], .part-number') || '',
              description,
              manufacturer: '',
              price,
              availability: '',
              url,
              imageUrl,
            },
            quantity,
            lineTotal,
          });
        }
      });

      const subtotal =
        (document.querySelector('[class*="Subtotal"], .cart-subtotal, .order-total') as HTMLElement)?.innerText?.trim() ?? '';

      return { items, subtotal, itemCount: items.length };
    });

    return cart;
  });
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function viewOrders(statusFilter?: string): Promise<AutomationResult<Order[]>> {
  return withPage(async (page) => {
    await page.goto(`${BASE_URL}/account/orders`, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const orders = await page.evaluate((filter): Order[] => {
      const results: Order[] = [];

      const rows = Array.from(
        document.querySelectorAll(
          '[data-testid="order-row"], .order-row, [class*="OrderRow"], .order-item',
        ),
      );

      rows.forEach((row) => {
        const getText = (sel: string) =>
          (row.querySelector(sel) as HTMLElement)?.innerText?.trim() ?? '';

        const orderNumber = getText('[class*="orderNumber"], .order-number, [data-testid="order-number"]') || '';
        const date = getText('[class*="date"], .order-date') || '';
        const status = getText('[class*="status"], .order-status, [data-testid="order-status"]') || '';
        const total = getText('[class*="total"], .order-total') || '';

        if (filter && !status.toLowerCase().includes(filter.toLowerCase())) return;

        if (orderNumber || date) {
          results.push({ orderNumber, date, status, total, items: [] });
        }
      });

      return results;
    }, statusFilter ?? '');

    return orders;
  });
}

export async function placeOrder(): Promise<AutomationResult<{ confirmationNumber: string }>> {
  return withPage(async (page) => {
    // Navigate to checkout
    await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Check we have a cart
    const hasItems = await page.$('[data-testid="cart-item"], .cart-item, [class*="CartItem"]');
    if (!hasItems) {
      throw new Error('Cart is empty — add items before placing an order');
    }

    // Click the final "Place Order" / "Submit Order" button
    await page.click(
      'button[data-testid="place-order"], button:has-text("Place Order"), button:has-text("Submit Order"), .place-order-btn',
      { timeout: 10000 },
    );

    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 });

    // Grab confirmation number
    const confirmationNumber = await page.evaluate(() => {
      const el = document.querySelector(
        '[data-testid="confirmation-number"], [class*="confirmationNumber"], .confirmation-number',
      ) as HTMLElement | null;
      return el?.innerText?.trim() ?? 'Order placed';
    });

    return { confirmationNumber };
  });
}
