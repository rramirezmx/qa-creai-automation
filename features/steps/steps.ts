import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect, devices } from '@playwright/test';
import { CustomWorld } from '../support/world';

const COOKIE_BUTTON_ID = '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll';

// --- SETUP Y NAVEGACIÓN (INCLUYE COOKIES) ---

Given('que inicio el monitoreo de errores en consola', async function (this: CustomWorld) {
  console.log('\n[INICIO] Monitoreo de errores JS/Consola activo.');
});

Given('navego al sitio {string}', async function (this: CustomWorld, url: string) {
  console.log(`\n[ACCIÓN] Navegando a: ${url}`);
  this.response = await this.page.goto(url);
  await this.page.waitForLoadState('domcontentloaded');

  // *** MANEJO DE COOKIES ***
  try {
    const cookieButton = this.page.locator(COOKIE_BUTTON_ID);
    // Espera hasta 5s para que el banner aparezca
    await cookieButton.waitFor({ state: 'visible', timeout: 5000 });
    
    if (await cookieButton.isVisible()) {
        await cookieButton.click();
        console.log('[ACCIÓN] ✔ Cookies aceptadas exitosamente.');
    }
  } catch (error) {
    console.log('[ACCIÓN] Banner de cookies no detectado o ya aceptado. Continuando...');
  }
});

// --- ESCENARIO 1: CARGA Y CONSOLA ---

Then('el sitio carga exitosamente y retorna estado HTTP {int}', async function (this: CustomWorld, status: number) {
  try {
    expect(this.response).not.toBeNull();
    expect(this.response?.status()).toBe(status);
    console.log(`[Resultado ✔]: Estado HTTP ${status} retornado correctamente.`);
  } catch (e) {
    console.error(`[Resultado ✖]: Fallo en la carga. Esperado ${status}, obtenido ${this.response?.status()}.`);
    throw e;
  }
});

Then('no hay errores visibles en consola', async function (this: CustomWorld) {
  if (this.consoleErrors.length > 0) {
    console.error(`[Resultado ✖]: Se encontraron ${this.consoleErrors.length} errores críticos en consola:`, this.consoleErrors);
    throw new Error(`Fallo de Consola: Se encontraron ${this.consoleErrors.length} errores críticos.`);
  } else {
    console.log('[Resultado ✔]: La consola de JavaScript está limpia (0 errores reportados).');
  }
});

// --- ESCENARIO 2: ELEMENTOS VISUALES ---

Then('validar que el el logo de la marca está visible', async function (this: CustomWorld) {
  // Se opta por validar que exista una imagen llamada *Logo.svg como la mejor estrategia de localización
  const logo = this.page.locator('img[src*="Logo.svg"]').first();
  
  try {
    await expect(logo).toBeVisible({ timeout: 5000 });
    console.log('[Resultado ✔]: Logo de la marca (img[src*="Logo.svg"]) es visible.');
  } catch (e) {
    console.error('[Resultado ✖]: Falló al verificar la visibilidad del logo (img[src*="Logo.svg"]).');
    throw e;
  }
});

Then('validar que exista un botón de contacto', async function (this: CustomWorld) {
  // Buscamos el elemento <a> con los atributos location="navbar" y trigger="contact_cta"
  const cta = this.page.locator('a[location="navbar"][trigger="contact_cta"]').first();
  
  try {
    // Validamos que sea visible
    await expect(cta).toBeVisible({ timeout: 5000 });
    console.log('[Resultado ✔]: Botón de Contacto/CTA (a[trigger="contact_cta"]) es visible.');
  } catch (e) {
    console.error('[Resultado ✖]: Falló al verificar la visibilidad del botón de contacto usando el selector de atributos.');
    throw e;
  }
});

Then('verificar que al menos 3 secciones visibles carguen correctamente', async function (this: CustomWorld, dataTable: DataTable) {
  const sections = dataTable.hashes(); 
  
  for (const row of sections) {
    const element = this.page.locator(row.selector).first();
    try {
        await expect(element).toBeVisible({ timeout: 5000 });
        console.log(`[Resultado ✔]: Sección '${row.descripcion}' es visible.`);
    } catch (e) {
        console.error(`[Resultado ✖]: Falló al encontrar la sección '${row.descripcion}' con selector '${row.selector}'.`);
        throw e;
    }
  }
});

// --- ESCENARIO 3: NAVEGACIÓN ---

When('hago click sobre el link {string}', async function (this: CustomWorld, linkText: string) {
  const link = this.page.getByRole('link', { name: linkText, exact: false }).first();
  await expect(link).toBeVisible();
  await link.click();
  console.log(`[ACCIÓN] Clic en el link: "${linkText}".`);
});

Then('verificar que redirige correctamente al url {string}', async function (this: CustomWorld, urlParcial: string) {
  const currentUrl = this.page.url();
  
  try {
    // Se valida que la url contenga el texto pasado como parámetro
    expect(currentUrl.toLowerCase()).toContain(urlParcial.toLowerCase());
    console.log("[Resultado ✔]: Redirección exitosa. URL y contenido clave " + urlParcial.toLowerCase() + " cargados.");

  } catch (e) {
    console.error(`[Resultado ✖]: Falló la redirección o el contenido clave. ...`);
    throw e;
  }
});

// --- ESCENARIO 4: MOBILE VIEWPORT ---

Given('simular una prueba con viewport móvil {string}', async function (this: CustomWorld, deviceName: string) {
  await this.page.close();
  await this.context.close();

  const device = devices[deviceName];
  if (!device) throw new Error(`Dispositivo ${deviceName} no encontrado.`);

  // Abrimos nuevo contexto SIN bypass SSL
  this.context = await this.browser.newContext({ ...device });
  this.page = await this.context.newPage();
  
  // Reactivamos listeners
  this.page.on('console', msg => {
    if (msg.type() === 'error') this.consoleErrors.push(msg.text());
  });
});