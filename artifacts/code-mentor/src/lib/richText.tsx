import type { ReactNode } from "react";

/**
 * Renders inline markdown: **bold** and `code`.
 * Safe to use anywhere text content needs light formatting.
 */
export function renderInline(text: string): ReactNode {
  const tokens: { type: "text" | "bold" | "code"; value: string }[] = [];
  const re = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) tokens.push({ type: "text", value: text.slice(last, m.index) });
    if (m[1] !== undefined) tokens.push({ type: "bold", value: m[1] });
    else if (m[2] !== undefined) tokens.push({ type: "code", value: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push({ type: "text", value: text.slice(last) });

  if (tokens.length === 0) return text;

  return (
    <>
      {tokens.map((t, i) => {
        if (t.type === "bold")
          return (
            <strong key={i} className="font-semibold text-foreground">
              {t.value}
            </strong>
          );
        if (t.type === "code")
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 rounded bg-primary/12 border border-primary/25 font-mono text-[0.85em] text-primary"
            >
              {t.value}
            </code>
          );
        return <span key={i}>{t.value}</span>;
      })}
    </>
  );
}

export type RichBlock =
  | { kind: "para"; lines: string[] }
  | { kind: "bullets"; items: string[] }
  | { kind: "numbered"; items: string[] }
  | { kind: "fence"; lang: string; code: string }
  | { kind: "table"; header: string[]; rows: string[][] };

/** Parse a single table row string like "| a | b | c |" into cells */
function parseTableRow(line: string): string[] {
  return line
    .split("|")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
}

/** Check if a line looks like a table separator (|---|---|) */
function isTableSeparator(line: string): boolean {
  return /^\s*\|[\s\-|:]+\|\s*$/.test(line);
}

/** Check if a line looks like a table row */
function isTableRow(line: string): boolean {
  return /^\s*\|.+\|/.test(line);
}

/**
 * Parses markdown text into blocks using a line-by-line scanner.
 * Fixed parser that correctly handles:
 * - Bullet lists starting mid-paragraph
 * - Numbered lists starting mid-paragraph
 * - Tables (|---|---| syntax)
 * - Code fences containing blank lines
 */
export function parseBlocks(text: string): RichBlock[] {
  const blocks: RichBlock[] = [];
  const lines = text.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // ── Code fence: collect until closing ``` ──────────────────────
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const fenceLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        fenceLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      while (fenceLines.length > 0 && fenceLines[0].trim() === "") fenceLines.shift();
      while (fenceLines.length > 0 && fenceLines[fenceLines.length - 1].trim() === "") fenceLines.pop();
      blocks.push({ kind: "fence", lang, code: fenceLines.join("\n") });
      continue;
    }

    // ── Blank line ──────────────────────────────────────────────────
    if (trimmed === "") {
      i++;
      continue;
    }

    // ── Table: collect header + separator + rows ────────────────────
    if (isTableRow(line)) {
      const tableLines: string[] = [];
      while (i < lines.length && (isTableRow(lines[i]) || isTableSeparator(lines[i]))) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        const header = parseTableRow(tableLines[0]);
        // Find separator line index
        const sepIdx = tableLines.findIndex(isTableSeparator);
        const dataLines = sepIdx >= 0
          ? tableLines.filter((_, idx) => idx !== 0 && idx !== sepIdx)
          : tableLines.slice(1);
        const rows = dataLines.map(parseTableRow);
        blocks.push({ kind: "table", header, rows });
        continue;
      }
      // Fall through: treat as para if no valid table
      for (const tl of tableLines) {
        blocks.push({ kind: "para", lines: [tl] });
      }
      continue;
    }

    // ── Bullet list: collect consecutive bullet lines ───────────────
    if (/^\s*[-•*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-•*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-•*]\s+/, ""));
        i++;
      }
      blocks.push({ kind: "bullets", items });
      continue;
    }

    // ── Numbered list: collect consecutive numbered lines ───────────
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ""));
        i++;
      }
      blocks.push({ kind: "numbered", items });
      continue;
    }

    // ── Paragraph: stop at blank line, fence, bullet, numbered, table
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !/^\s*[-•*]\s+/.test(lines[i]) &&
      !/^\s*\d+[.)]\s+/.test(lines[i]) &&
      !isTableRow(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push({ kind: "para", lines: paraLines });
    }
  }

  return blocks;
}

/**
 * Renders a full block of markdown text as React:
 * - Paragraphs separated by blank lines
 * - Bullet lists (lines starting with -, •, *)
 * - Numbered lists (lines starting with 1. or 1))
 * - ```lang code blocks``` rendered with monospace styling
 * - Tables (|header|...|) rendered as styled tables
 * - Inline **bold** and `code` within all text blocks
 */
export function renderRichText(text: string): ReactNode {
  const blocks = parseBlocks(text);
  return (
    <>
      {blocks.map((block, bi) => {
        if (block.kind === "fence") {
          return (
            <pre
              key={bi}
              className="my-3 rounded-lg bg-muted/30 border border-border/50 px-4 py-3 font-mono text-sm text-foreground/90 overflow-x-auto whitespace-pre"
            >
              {block.code}
            </pre>
          );
        }
        if (block.kind === "table") {
          return (
            <div key={bi} className="my-3 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    {block.header.map((h, hi) => (
                      <th
                        key={hi}
                        className="px-3 py-2 text-left font-semibold text-foreground border border-border/50 bg-primary/10"
                      >
                        {renderInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, ri) => (
                    <tr key={ri} className={ri % 2 === 0 ? "bg-muted/10" : ""}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-3 py-1.5 border border-border/40 text-foreground/85">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.kind === "bullets") {
          return (
            <ul key={bi} className="my-2 space-y-1.5 pl-0">
              {block.items.map((item, li) => (
                <li key={li} className="flex items-start gap-2.5 text-foreground/85 leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.kind === "numbered") {
          return (
            <ol key={bi} className="my-2 space-y-1.5 pl-0">
              {block.items.map((item, li) => (
                <li key={li} className="flex items-start gap-2.5 text-foreground/85 leading-relaxed">
                  <span
                    className="flex-shrink-0 h-5 w-5 rounded-full grid place-items-center text-[10px] font-bold font-mono mt-0.5"
                    style={{
                      background: "hsl(217 91% 65% / 0.18)",
                      color: "hsl(217 91% 72%)",
                      border: "1px solid hsl(217 91% 65% / 0.3)",
                    }}
                  >
                    {li + 1}
                  </span>
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={bi} className="my-2 text-foreground/85 leading-relaxed">
            {block.lines.map((l, li) => (
              <span key={li}>
                {renderInline(l)}
                {li < block.lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}
