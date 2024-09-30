import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

// Formatea la fecha en formato yyyy-mm-dd
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export const downloadFile = async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://datos.produccion.gob.ar/dataset/sepa-precios');
  await page.waitForSelector('#pkg-resources');

  const today = new Date();
  const todayFormatted = formatDate(today);
  const todayNoDashes = todayFormatted.replace(/-/g, '');

  console.log(`Fecha de hoy: ${todayFormatted}`);

  // Buscar el botón DESCARGAR en función de la fecha
  const downloadButtonHref: string | null = await page.$$eval(
    '#pkg-resources .pkg-container',
    (containers: HTMLElement[], todayFormatted: string): string | null => {
      let downloadButtonHref: string | null = null;
      let closestDateDiff = Infinity;

      containers.forEach((container) => {
        const paragraph = container.querySelector('p');
        if (paragraph) {
          const text = paragraph.textContent?.trim() ?? '';
          const match = text.match(/(\d{4}-\d{2}-\d{2})/);
          if (match) {
            const dateText = match[0];
            const date = new Date(dateText);
            const today = new Date(todayFormatted);
            const dateDiff = Math.abs(date.getTime() - today.getTime());

            // Comprobar si es la fecha de hoy o la más cercana a hoy
            if (dateText === todayFormatted || dateDiff < closestDateDiff) {
              closestDateDiff = dateDiff;
              const downloadAnchor = container.querySelector(
                '.pkg-actions a:nth-child(2)'
              );
              if (
                downloadAnchor &&
                downloadAnchor.querySelector('button')?.textContent?.includes('DESCARGAR')
              ) {
                downloadButtonHref = downloadAnchor.getAttribute('href');
              }
            }
          }
        }
      });

      return downloadButtonHref;
    },
    todayFormatted
  );

  if (downloadButtonHref) {
    const fullDownloadUrl = downloadButtonHref.startsWith('http')
      ? downloadButtonHref
      : `https://datos.produccion.gob.ar${downloadButtonHref}`;
    console.log(`Descargando archivo desde: ${fullDownloadUrl}`);

    const downloadDir = path.join(__dirname, 'descargas');

    await fs.mkdir(downloadDir, { recursive: true });

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click(`a[href="${downloadButtonHref}"]`),
    ]);

    const filePath = path.join(downloadDir, `${todayNoDashes}.zip`);
    await download.saveAs(filePath);
    console.log(`Archivo descargado en: ${filePath}`);
  } else {
    console.log(
      'No se encontró ningún botón DESCARGAR para la fecha de hoy o la más cercana disponible.'
    );
  }

  await browser.close();
};
