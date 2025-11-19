import { setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, Response } from '@playwright/test';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  response!: Response | null;
  consoleErrors: string[] = [];

  constructor(options: any) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);