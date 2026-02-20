# pdf-inspector

A local-first CLI that scans a PDF from a local file path for sensitive information using a policy-driven set of checks, then prints a report with match types and counts. (V1: text-based PDFs)

![Example CLI report](./docs/cli-report.png)

## Why

PDFs often contain sensitive data. `pdf-inspector` helps you audit a document locally and get a clear summary report before you share it or upload it anywhere.

- Runs locally (no third-party processing)
- Useful for privacy-focused workflows and large files where you prefer to keep data on your machine

## Features

- Scan a local PDF file path
- Detect sensitive information based on a policy (rules that define what should be flagged)
- Generate a report with per-category counts
- Add custom sensitive terms at runtime:
  - Add a single term using `--add-term`
  - Add many terms using `--add-terms-file` (one term per line)

## Requirements

- Node.js (recent LTS recommended)
- npm

## Install (from source)

```bash
git clone https://github.com/Feras-ALdemashki/pdf-inspector.git
cd pdf-inspector
npm install
npm run build
```

## Usage
- Scan a PDF
```bash
npm run start -- scan "./document.pdf"
```
- Add a custom sensitive term
```bash
npm run start -- scan "./document.pdf" --add-term "Special term"
```
- Add custom terms from a file (one term per line)
```bash
npm run start -- scan "./document.pdf" --add-terms-file "./terms.txt"
```
## Policy
pdf-inspector flags sensitive information according to a policy (a set of rules).
- Email
- URL
- ipv4
-  phone (Netherlands phone number)
- IBAN
- Creditcard
Typical policy rules include pattern-based checks (for example, identifiers that match specific formats) plus custom “special terms” added at runtime via --add-term / --add-terms-file.

## Dependencies
Runtime:

- commander — CLI argument parsing

- pdfjs-dist — PDF parsing and text extraction (PDF.js distribution)

- picocolors — terminal colors

- string-width — consistent terminal alignment

Development:

- typescript

- tsx

- @types/node

## Privacy
pdf-inspector is designed to run locally. When scanning a local path, the PDF content is processed on your machine.
## Limitations
V1 focuses on text-based PDFs.
