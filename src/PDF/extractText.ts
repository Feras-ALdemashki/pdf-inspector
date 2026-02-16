import fs from "node:fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export type ExtractTextResult = {
  filePath: string;
  numPages: number;
  totalTextItems: number;
  text: string;
};

export async function extractPdfText(
  filePath: string,
): Promise<ExtractTextResult> {
  const data = new Uint8Array(await fs.readFile(filePath));

  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;

  const numPages = pdf.numPages;
  let totalTextItems = 0;
  const parts: string[] = [];

  try {
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1 });

      const tc = await page.getTextContent();
      const items = (tc.items ?? []) as any[];
      const styles = (tc.styles ?? {}) as Record<string, any>;

      totalTextItems += items.length;

      for (let i = 0; i < items.length; i++) {
        const it = items[i];

        if (!it || typeof it.str !== "string") continue;

        const s = it.str.trim();
        if (s) parts.push(s);

        //  Coordinates
        const pdfX = it.transform?.[4];
        const pdfY = it.transform?.[5];

        const tx = pdfjsLib.Util.transform(viewport.transform, it.transform);
        const vx = tx[4];
        const vy = tx[5];

        const width =
          (typeof it.width === "number" ? it.width : 0) * viewport.scale;

        //  Font info
        const fontId = it.fontName as string | undefined;
        const style = fontId && styles[fontId] ? styles[fontId] : undefined;

        const fontSize = Math.hypot(tx[2], tx[3]);
        const height = fontSize;

        console.log({
          page: pageNum,
          itemIndex: i,
          text: s,

          pdf: { x: pdfX, y: pdfY },
          viewport: { x: vx, y: vy, width, height },

          font: {
            id: fontId,
            family: style?.fontFamily,
            ascent: style?.ascent,
            descent: style?.descent,
            vertical: style?.vertical,
            estimatedSize: fontSize,
          },

          dir: it.dir,
          hasEOL: it.hasEOL,
        });
      }
    }
  } finally {
    await pdf.destroy();
    await loadingTask.destroy();
  }

  return { filePath, numPages, totalTextItems, text: parts.join("\n") };
}
