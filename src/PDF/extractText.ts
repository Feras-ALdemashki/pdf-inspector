import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

// The final object type that the function will return
export type ExtractTextResult = {
  filePath: string;
  numPages: number;
  totalTextItems: number;
  text: string;
};

// Resolve pdfjs-dist location
const require = createRequire(import.meta.url);
const pdfjsDistRoot = path.dirname(require.resolve("pdfjs-dist/package.json"));

//  must be a URL and must include a trailing slash
const standardFontDataUrl = pathToFileURL(
  path.join(pdfjsDistRoot, "standard_fonts") + path.sep,
).toString();

// Node-friendly StandardFontDataFactory (uses fs instead of fetch/file://)
class NodeStandardFontDataFactory {
  private baseUrl: string | null;

  constructor({ baseUrl }: { baseUrl?: string | null }) {
    this.baseUrl = baseUrl ?? null;
  }

  async fetch({ filename }: { filename: string }): Promise<Uint8Array> {
    if (!this.baseUrl) {
      throw new Error("Missing baseUrl for StandardFontDataFactory.");
    }

    const url = new URL(filename, this.baseUrl);
    if (url.protocol !== "file:") {
      throw new Error(`Unsupported font URL protocol: ${url.protocol}`);
    }

    const buf = await fs.readFile(fileURLToPath(url));
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }
}

// Main function to extract text
export async function extractPdfText(
  filePath: string,
): Promise<ExtractTextResult> {
  const data = new Uint8Array(await fs.readFile(filePath));

  const loadingTask = getDocument({
    data,
    // Keep logs quiet (optional, but helps keep CLI output clean)
    verbosity: 0,

    // Fix standard font loading in Node:
    standardFontDataUrl,
    StandardFontDataFactory: NodeStandardFontDataFactory,
    useWorkerFetch: false,
  });

  const pdf = await loadingTask.promise;

  const numPages = pdf.numPages;
  let totalTextItems = 0;
  const parts: string[] = [];

  try {
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const items = (textContent.items ?? []) as any[];
      totalTextItems += items.length;

      for (const item of items) {
        if (!item || typeof item.str !== "string") continue;
        const s = item.str.trim();
        if (s) parts.push(s);
      }
    }
  } finally {
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
