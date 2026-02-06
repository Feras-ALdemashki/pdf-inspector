#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
  .name("redact")
  .description("Local-first PDF redaction CLI (v1: text-based PDFs)")
  .version("0.1.0");

program
  .command("scan")
  .argument("<path>", "PDF file or directory")
  .description(
    "Scan input and print what would be redacted (no output written)",
  )
  .action((path) => {
    console.log(`scan: ${path}`);
    console.log("Not implemented yet.");
    process.exitCode = 0;
  });

program
  .command("run")
  .argument("<path>", "PDF file or directory")
  .option("--out <path>", "Output file or directory")
  .option("--add-term <term...>", "Add custom term(s) to redact")
  .option("--add-terms-file <path>", "File with one custom term per line")
  .option("--dry-run", "Scan only; do not write output")
  .description("Run scan → redact → verify and write outputs")
  .action((path, options) => {
    console.log(`run: ${path}`);
    console.log("options:", options);
    console.log("Not implemented yet.");
    process.exitCode = 0;
  });

program
  .command("verify")
  .argument("<path>", "Redacted PDF file")
  .option("--report <path>", "Write verification report JSON")
  .description("Verify that the output matches v1 guarantees")
  .action((path, options) => {
    console.log(`verify: ${path}`);
    console.log("options:", options);
    console.log("Not implemented yet.");
    process.exitCode = 0;
  });

program.parse();
