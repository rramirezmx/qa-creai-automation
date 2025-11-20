import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect, devices } from '@playwright/test';
import { CustomWorld } from '../support/world';

const COOKIE_BUTTON_ID = '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll';

// --- SETUP AND NAVIGATION (INCLUDES COOKIES) ---

Given('I start monitoring for console errors', async function (this: CustomWorld) {
  console.log('\n[START] JS/Console error monitoring active.');
});

Given('I navigate to the site {string}', async function (this: CustomWorld, url: string) {
  console.log(`\n[ACTION] Navigating to: ${url}`);
  this.response = await this.page.goto(url);
  await this.page.waitForLoadState('domcontentloaded');

  // *** COOKIE HANDLING ***
  try {
    const cookieButton = this.page.locator(COOKIE_BUTTON_ID);
    // Wait up to 5s for the banner to appear
    await cookieButton.waitFor({ state: 'visible', timeout: 5000 });
    
    if (await cookieButton.isVisible()) {
        await cookieButton.click();
        console.log('[ACTION] ✔ Cookies accepted successfully.');
    }
  } catch (error) {
    console.log('[ACTION] Cookie banner not detected or already accepted. Continuing...');
  }
});

// --- SCENARIO 1: LOAD AND CONSOLE ---

Then('the site loads successfully and returns HTTP status {int}', async function (this: CustomWorld, status: number) {
  try {
    expect(this.response).not.toBeNull();
    expect(this.response?.status()).toBe(status);
    console.log(`[Result ✔]: HTTP status ${status} returned correctly.`);
  } catch (e) {
    console.error(`[Result ✖]: Load failed. Expected ${status}, got ${this.response?.status()}.`);
    await new Promise(resolve => setTimeout(resolve, 100));
    throw e;
  }
});

Then('there are no visible errors in the console', async function (this: CustomWorld) {
  if (this.consoleErrors.length > 0) {
    console.error(`[Result ✖]: Found ${this.consoleErrors.length} critical errors in console:`, this.consoleErrors);
    throw new Error(`Console Failure: Found ${this.consoleErrors.length} critical errors.`);
  } else {
    console.log('[Result ✔]: JavaScript console is clean (0 errors reported).');
  }
});

// --- SCENARIO 2: VISUAL ELEMENTS ---

Then('validate that the brand logo is visible', async function (this: CustomWorld) {
  // We opt to validate that an image named *Logo.svg exists as the best localization strategy
  const logo = this.page.locator('img[src*="Logo.svg"]').first();
  
  try {
    await expect(logo).toBeVisible({ timeout: 5000 });
    console.log('[Result ✔]: Brand logo (img[src*="Logo.svg"]) is visible.');
  } catch (e) {
    console.error('[Result ✖]: Failed to verify the visibility of the logo (img[src*="Logo.svg"]).');
    await new Promise(resolve => setTimeout(resolve, 100));
    throw e;
  }
});

Then('validate that a contact button exists', async function (this: CustomWorld) {
  // We search for the <a> element with attributes location="navbar" and trigger="contact_cta"
  const cta = this.page.locator('a[location="navbar"][trigger="contact_cta"]').first();
  
  try {
    // Validate that it is visible
    await expect(cta).toBeVisible({ timeout: 5000 });
    console.log('[Result ✔]: Contact/CTA Button (a[trigger="contact_cta"]) is visible.');
  } catch (e) {
    console.error('[Result ✖]: Failed to verify the visibility of the contact button using the attribute selector.');
    await new Promise(resolve => setTimeout(resolve, 100));
    throw e;
  }
});

Then('verify that following sections load correctly', async function (this: CustomWorld, dataTable: DataTable) {
  const sections = dataTable.hashes(); 
  
  for (const row of sections) {
    const element = this.page.locator(row.selector).first();
    try {
        await expect(element).toBeVisible({ timeout: 5000 });
        console.log(`[Result ✔]: Section '${row.description}' is visible.`);
    } catch (e) {
        console.error(`[Result ✖]: Failed to find section '${row.description}' with selector '${row.selector}'.`);
        await new Promise(resolve => setTimeout(resolve, 100));
        throw e;
    }
  }
});

// --- SCENARIO 3: NAVIGATION ---

When('I click on the link {string}', async function (this: CustomWorld, linkText: string) {
  const link = this.page.getByRole('link', { name: linkText, exact: false }).first();
  await expect(link).toBeVisible();
  await link.click();
  console.log(`[ACTION] Clicked on link: "${linkText}".`);
});

Then('verify that it redirects correctly to the url {string}', async function (this: CustomWorld, urlParcial: string) {
  const currentUrl = this.page.url();
  
  try {
    // Validate that the URL contains the text passed as a parameter
    expect(currentUrl.toLowerCase()).toContain(urlParcial.toLowerCase());
    console.log("[Result ✔]: Successful redirection. URL and key content " + urlParcial.toLowerCase() + " loaded.");

  } catch (e) {
    console.error(`[Result ✖]: Redirection or key content failed. ...`);
    await new Promise(resolve => setTimeout(resolve, 100));
    throw e;
  }
});

// --- SCENARIO 4: MOBILE VIEWPORT ---

Given('simulate a test with mobile viewport {string}', async function (this: CustomWorld, deviceName: string) {
  await this.page.close();
  await this.context.close();

  const device = devices[deviceName];
  if (!device) throw new Error(`Device ${deviceName} not found.`);

  // Open new context WITHOUT SSL bypass
  this.context = await this.browser.newContext({ ...device });
  this.page = await this.context.newPage();
  
  // Reactivate listeners
  this.page.on('console', msg => {
    if (msg.type() === 'error') this.consoleErrors.push(msg.text());
  });
});