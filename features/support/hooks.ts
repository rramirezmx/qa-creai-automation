import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { CustomWorld } from './world';

setDefaultTimeout(60 * 1000);

Before(async function (this: CustomWorld) {

  const headless = process.env.HEADLESS !== 'false'; // default true

  this.consoleErrors = []; 
  this.browser = await chromium.launch({ headless });
  
  this.context = await this.browser.newContext({
    viewport: { width: 1280, height: 720 } 
  });
  
  this.page = await this.context.newPage();

  // Listener of console errors
  this.page.on('console', msg => {
    if (msg.type() === 'error') {
      this.consoleErrors.push(msg.text());
    }
  });
  
  this.page.on('pageerror', exception => {
    this.consoleErrors.push(exception.message);
  });
});

After(async function (this: CustomWorld) {
  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});