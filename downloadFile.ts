import { chromium } from 'playwright';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export const downloadFile = async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://datos.produccion.gob.ar/dataset/sepa-precios');
  await page.waitForSelector('#pkg-resources');

  const todayFormatted = formatDate(new Date());
  const todayNoDashes = todayFormatted.replace(/-/g, '');

  console.log(`Fecha de hoy: ${todayFormatted}`);

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

    const downloadDir = path.join(__dirname, 'descargas');
    await fs.promises.mkdir(downloadDir, { recursive: true });
    const filePath = path.join(downloadDir, `${todayNoDashes}.zip`);

    const response = await axios({
      method: 'get',
      url: fullDownloadUrl,
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(filePath);

    let downloadedSize = 0;
    response.data.on('data', (chunk: Buffer) => {
      downloadedSize += chunk.length;
      const downloadedMB = (downloadedSize / (1024 * 1024)).toFixed(2);
      process.stdout.write(`\rDescargando... ${downloadedMB} MB`);
    });

    response.data.pipe(writer);
    writer.on('error', (err) => console.error('Error al descargar el archivo:', err));
  } else {
    console.log(
      'No se encontró ningún botón DESCARGAR para la fecha de hoy o la más cercana disponible.'
    );
  }

  await browser.close();
};
