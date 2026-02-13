#!/usr/bin/env node
import { Command } from "commander";
import { runScan } from "./commands/scan.js";

const program = new Command();

program
  .name("redact")
  .description("Local-first PDF redaction CLI (v1: text-based PDFs)")
  .version("0.1.0");

program
  .command("scan")
  .argument("<path>", "PDF file")
  .option("--add-term <term...>", "Add custom term(s) to redact")
  .option("--add-terms-file <path>", "File with one custom term per line")
  .description(
    "Scan input and print what would be redacted (no output written)",
  )
  .action(async (p, options) => {
    await runScan(p, options);
  });

program
  .command("run")
  .argument("<path>")
  .description("Run scan → redact → verify")
  .action(() => {
    console.log("Not implemented yet.");
  });
program
  .command("verify")
  .argument("<path>")
  .description("Verify a redacted PDF")
  .action(() => {
    console.log("Not implemented yet.");
  });

await program.parseAsync(process.argv);
