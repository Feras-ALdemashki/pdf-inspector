import fs from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

// The final object type that the function will return
export type ExtractTextResult = {
  filePath: string;
  numPages: number;
  totalTextItems: number;
  text: string;
};

// Main function to extract text
export async function extractPdfText(
  filePath: string,
): Promise<ExtractTextResult> {
  const data = new Uint8Array(await fs.readFile(filePath));
  const loadingTask = getDocument({ data });
  const pdf = await loadingTask.promise;

  const numPages = pdf.numPages;
  let totalTextItems = 0;
  const parts: string[] = [];

  try {
    // Loop through every page and extract text items
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const textContent = await page.getTextContent();

      // Avoid crashing if items is null/undefined
      // Some items can be non-text (e.g. beginMarkedContent)
      const items = (textContent.items ?? []) as any[];

      totalTextItems += items.length;

      for (const item of items) {
        if (!item || typeof item.str !== "string") continue;

        const s = item.str.trim();
        if (s) parts.push(s);
      }
    }
  } finally {
    // Always cleanup to reduce memory usage
    await pdf.destroy();
    await loadingTask.destroy();
  }

  return {
    filePath,
    numPages,
    totalTextItems,
    text: parts.join("\n"),
  };
}
