import { chromium, Browser, BrowserContext } from 'playwright';

class BrowserManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private loggedIn = false;

  async init(): Promise<void> {
    if (this.browser) return;
    const headless = process.env.PLAYWRIGHT_HEADLESS !== 'false';
    this.browser = await chromium.launch({ headless });
    this.context = await this.browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
  }

  async getContext(): Promise<BrowserContext> {
    if (!this.context) await this.init();
    return this.context!;
  }

  async newPage() {
    const ctx = await this.getContext();
    return ctx.newPage();
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  setLoggedIn(value: boolean): void {
    this.loggedIn = value;
  }

  async saveCookies(): Promise<string> {
    if (!this.context) return '[]';
    const cookies = await this.context.cookies();
    return JSON.stringify(cookies);
  }

  async loadCookies(cookieJson: string): Promise<void> {
    const ctx = await this.getContext();
    const cookies = JSON.parse(cookieJson);
    await ctx.addCookies(cookies);
  }

  async close(): Promise<void> {
    await this.browser?.close();
    this.browser = null;
    this.context = null;
    this.loggedIn = false;
  }
}

export const browser = new BrowserManager();
