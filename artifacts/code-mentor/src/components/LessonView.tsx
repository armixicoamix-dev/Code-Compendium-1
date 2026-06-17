import { useState, useMemo, useCallback } from "react";
import {
  BookOpen,
  ChevronDown,
  Lightbulb,
  AlertTriangle,
  Target,
  Sparkles,
  Clock,
  CheckCircle2,
  Download,
  Info,
  ArrowRight,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PyCode } from "@/components/PyCode";
import type { LessonSection, RoundLesson } from "@/data/curriculum";
import { renderInline, renderRichText, parseBlocks } from "@/lib/richText";

// ── HTML text helpers ──────────────────────────────────────────────────────────
function inlineToHtml(text: string): string {
  const re = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  return text.replace(re, (_, bold, code) => {
    if (bold !== undefined) return `<strong>${escHtml(bold)}</strong>`;
    if (code !== undefined) return `<code>${escHtml(code)}</code>`;
    return _;
  });
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function blocksToHtml(text: string): string {
  const blocks = parseBlocks(text);
  return blocks
    .map((block) => {
      if (block.kind === "fence") {
        return `<pre class="code-block"><code>${escHtml(block.code)}</code></pre>`;
      }
      if (block.kind === "table") {
        const headerCells = block.header.map((h) => `<th>${inlineToHtml(h)}</th>`).join("");
        const bodyRows = block.rows
          .map((row) => `<tr>${row.map((cell) => `<td>${inlineToHtml(cell)}</td>`).join("")}</tr>`)
          .join("\n");
        return `<table class="md-table">\n<thead><tr>${headerCells}</tr></thead>\n<tbody>\n${bodyRows}\n</tbody>\n</table>`;
      }
      if (block.kind === "divider") {
        return `<hr class="section-divider" />`;
      }
      if (block.kind === "heading") {
        const tag = block.level === 2 ? "h4" : "h5";
        return `<${tag} class="body-heading body-heading-${block.level}">${inlineToHtml(block.text)}</${tag}>`;
      }
      if (block.kind === "bullets") {
        const items = block.items.map((item) => `<li>${inlineToHtml(item)}</li>`).join("\n");
        return `<ul>\n${items}\n</ul>`;
      }
      if (block.kind === "numbered") {
        const items = block.items.map((item) => `<li>${inlineToHtml(item)}</li>`).join("\n");
        return `<ol>\n${items}\n</ol>`;
      }
      const lines = block.lines.map((l) => inlineToHtml(l)).join("<br/>");
      return `<p>${lines}</p>`;
    })
    .join("\n");
}

function sectionToHtml(section: LessonSection, index: number): string {
  let html = `<div class="section">\n`;
  html += `<h3><span class="section-num">${index + 1}</span> ${escHtml(section.heading)}</h3>\n`;
  if (section.tagline) html += `<p class="tagline">${escHtml(section.tagline)}</p>\n`;
  html += blocksToHtml(section.body);
  if (section.code) {
    html += `<pre class="code-block"><code>${escHtml(section.code)}</code></pre>\n`;
  }
  if (section.analogy) {
    html += `<div class="box analogy"><strong>💡 Аналогия.</strong> ${inlineToHtml(section.analogy)}</div>\n`;
  }
  if (section.keyTakeaways && section.keyTakeaways.length > 0) {
    html += `<div class="box takeaways"><strong>✅ Запомнить:</strong><ul>`;
    for (const t of section.keyTakeaways) html += `<li>${inlineToHtml(t)}</li>`;
    html += `</ul></div>\n`;
  }
  if (section.pitfalls && section.pitfalls.length > 0) {
    html += `<div class="box pitfalls"><strong>⚠️ Где обычно ломается:</strong><ul>`;
    for (const t of section.pitfalls) html += `<li>${inlineToHtml(t)}</li>`;
    html += `</ul></div>\n`;
  }
  html += `</div>\n`;
  return html;
}

function lessonToHtml(lesson: RoundLesson): string {
  const sectionsHtml = lesson.sections.map((s, i) => sectionToHtml(s, i)).join("\n");

  const cheatSheetHtml =
    lesson.cheatSheet && lesson.cheatSheet.length > 0
      ? `<div class="cheatsheet">
  <h2>📋 Шпаргалка перед стартом</h2>
  <ol>${lesson.cheatSheet.map((t) => `<li>${inlineToHtml(t)}</li>`).join("\n")}</ol>
</div>`
      : "";

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${escHtml(lesson.title)}</title>
<style>
  :root {
    --bg: #08091a;
    --surface: #0d1025;
    --border: #1a2040;
    --text: #d4daf5;
    --muted: #7a85a8;
    --primary: #4d96ff;
    --accent: #b57af2;
    --green: #5eea9d;
    --red: #f26b6b;
    --amber: #fbb540;
    --code-bg: #04060f;
    --code-text: #d4daf5;
    --kw: #b57af2;
    --fn: #70c7ff;
    --str: #93e07a;
    --num: #fba040;
    --com: #4f5a7a;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.75;
    padding: 2rem 1rem 5rem;
    font-size: 16px;
  }
  .container { max-width: 840px; margin: 0 auto; }
  header {
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border);
  }
  header h1 {
    font-size: clamp(1.6rem, 4vw, 2.2rem);
    font-weight: 800;
    color: #fff;
    margin-bottom: .6rem;
    line-height: 1.2;
  }
  header .summary { color: var(--muted); font-size: 1rem; line-height: 1.65; margin-bottom: .75rem; }
  header .meta { display: flex; flex-wrap: wrap; gap: 1.5rem; font-size: .85rem; color: var(--muted); }
  header .meta span { display: flex; align-items: center; gap: .4rem; }
  .section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.6rem 1.8rem;
    margin-bottom: 1.25rem;
  }
  .section h3 {
    font-size: 1.15rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: .85rem;
    display: flex;
    align-items: center;
    gap: .55rem;
    line-height: 1.3;
  }
  .section-num {
    background: rgba(77,150,255,.18);
    color: var(--primary);
    padding: .15rem .55rem;
    border-radius: 6px;
    font-size: .82rem;
    font-weight: 700;
    flex-shrink: 0;
    border: 1px solid rgba(77,150,255,.25);
  }
  .tagline {
    color: var(--primary);
    font-style: italic;
    font-size: .95rem;
    margin-bottom: .85rem;
    padding: .4rem .75rem;
    background: rgba(77,150,255,.06);
    border-left: 3px solid rgba(77,150,255,.4);
    border-radius: 0 6px 6px 0;
  }
  p { margin: .75rem 0; color: var(--text); line-height: 1.75; }
  ul, ol { margin: .75rem 0 .75rem 1.5rem; }
  li { margin: .4rem 0; line-height: 1.65; }
  strong { color: #fff; }
  code {
    background: rgba(77,150,255,.12);
    color: var(--primary);
    padding: .1rem .4rem;
    border-radius: 4px;
    font-family: 'JetBrains Mono', 'Menlo', monospace;
    font-size: .85em;
    border: 1px solid rgba(77,150,255,.2);
  }
  pre.code-block {
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.2rem 1.4rem;
    margin: 1.1rem 0;
    overflow-x: auto;
    white-space: pre;
    font-family: 'JetBrains Mono', 'Menlo', monospace;
    font-size: 13px;
    line-height: 1.75;
  }
  pre.code-block code { background: none; color: var(--code-text); padding: 0; font-size: inherit; border: none; }
  .box { border-radius: 10px; padding: 1.1rem 1.3rem; margin-top: 1.1rem; }
  .analogy { background: rgba(181,122,242,.07); border: 1px solid rgba(181,122,242,.3); }
  .analogy strong { color: var(--accent); }
  .takeaways { background: rgba(77,150,255,.06); border: 1px solid rgba(77,150,255,.3); }
  .takeaways strong { color: var(--primary); }
  .pitfalls { background: rgba(242,107,107,.06); border: 1px solid rgba(242,107,107,.3); }
  .pitfalls strong { color: var(--red); }
  .box ul { margin-top: .5rem; margin-bottom: 0; }
  .cheatsheet {
    background: rgba(77,150,255,.08);
    border: 1px solid rgba(77,150,255,.35);
    border-radius: 14px;
    padding: 1.6rem 1.8rem;
    margin-top: 1.5rem;
  }
  .cheatsheet h2 { font-size: 1.15rem; font-weight: 700; color: var(--primary); margin-bottom: 1.1rem; }
  .cheatsheet ol { margin-left: 1.25rem; }
  .cheatsheet li { margin: .5rem 0; color: var(--text); }
  .md-table { width: 100%; border-collapse: collapse; margin: .85rem 0; font-size: .9rem; }
  .md-table th { background: rgba(77,150,255,.12); color: #fff; padding: .5rem .75rem; text-align: left; border: 1px solid var(--border); font-weight: 700; }
  .md-table td { padding: .4rem .75rem; border: 1px solid var(--border); color: var(--text); }
  .md-table tr:nth-child(even) td { background: rgba(255,255,255,.025); }
  h4.body-heading-2 { font-size: 1rem; font-weight: 700; color: #fff; margin: 1.4rem 0 .5rem; padding-bottom: .35rem; border-bottom: 1px solid var(--border); }
  h5.body-heading-3 { font-size: .85rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: .05em; margin: 1.1rem 0 .4rem; }
  hr.section-divider { border: none; border-top: 1px solid var(--border); margin: 1.2rem 0; opacity: .5; }
  footer { margin-top: 3rem; text-align: center; color: var(--muted); font-size: .8rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }
  @media (max-width: 640px) {
    body { padding: 1.25rem .875rem 4rem; }
    .section { padding: 1.2rem 1.1rem; }
  }
</style>
</head>
<body>
<div class="container">
<header>
  <h1>${escHtml(lesson.title)}</h1>
  <p class="summary">${escHtml(lesson.summary)}</p>
  <div class="meta">
    <span>⏱ ~${lesson.readingMinutes} мин чтения</span>
    <span>📖 ${lesson.sections.length} разделов</span>
  </div>
</header>

${sectionsHtml}

${cheatSheetHtml}

<footer>Python OOP Тренажёр · Методичка сгенерирована автоматически</footer>
</div>
</body>
</html>`;
}

// ── Section card (improved) ───────────────────────────────────────────────────
function SectionCard({ section, index }: { section: LessonSection; index: number }) {
  return (
    <div className="lesson-section-card p-5 sm:p-7">
      {/* Section header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="h-8 w-8 rounded-lg text-sm font-bold font-mono grid place-items-center flex-shrink-0 border"
          style={{
            background: "linear-gradient(135deg, hsl(217 91% 65% / 0.2), hsl(280 90% 70% / 0.15))",
            borderColor: "hsl(217 91% 65% / 0.3)",
            color: "hsl(217 91% 72%)",
          }}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold leading-snug text-foreground">
            {section.heading}
          </h3>
          {section.tagline && (
            <div className="mt-2 flex items-start gap-2">
              <div className="w-0.5 rounded-full bg-primary/50 flex-shrink-0 self-stretch min-h-[1.2rem]" />
              <p className="text-sm text-primary/85 italic leading-relaxed">{section.tagline}</p>
            </div>
          )}
        </div>
      </div>

      {/* Body text */}
      <div className="text-foreground/85 text-base leading-relaxed pl-0">
        {renderRichText(section.body)}
      </div>

      {/* Code block */}
      {section.code && (
        <div className="mt-5">
          <PyCode code={section.code} />
        </div>
      )}

      {/* Analogy box */}
      {section.analogy && (
        <div className="mt-5 rounded-xl border border-accent/30 bg-accent/6 p-4 flex gap-3">
          <Sparkles className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/85 leading-relaxed">
            <span className="font-bold text-accent">Аналогия. </span>
            {renderInline(section.analogy)}
          </div>
        </div>
      )}

      {/* Key takeaways */}
      {section.keyTakeaways && section.keyTakeaways.length > 0 && (
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/7 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-primary text-sm font-bold mb-3">
            <Target className="h-4 w-4" />
            Запомнить
          </div>
          <ul className="space-y-2">
            {section.keyTakeaways.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-foreground/85 leading-relaxed"
              >
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{renderInline(t)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pitfalls */}
      {section.pitfalls && section.pitfalls.length > 0 && (
        <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/6 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-destructive text-sm font-bold mb-3">
            <AlertTriangle className="h-4 w-4" />
            Типичные ошибки
          </div>
          <ul className="space-y-2">
            {section.pitfalls.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-foreground/85 leading-relaxed"
              >
                <span className="text-destructive flex-shrink-0 mt-0.5 font-bold text-xs leading-5">✗</span>
                <span>{renderInline(t)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Main LessonView ───────────────────────────────────────────────────────────
export function LessonView({
  lesson,
  defaultOpen = true,
}: {
  lesson: RoundLesson;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const totalKeyPoints = useMemo(
    () => lesson.sections.reduce((s, sec) => s + (sec.keyTakeaways?.length ?? 0), 0),
    [lesson],
  );
  const totalPitfalls = useMemo(
    () => lesson.sections.reduce((s, sec) => s + (sec.pitfalls?.length ?? 0), 0),
    [lesson],
  );

  const handleDownload = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const html = lessonToHtml(lesson);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeName = lesson.title
        .toLowerCase()
        .replace(/[^а-яёa-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "");
      a.download = `lesson-${safeName}.html`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [lesson],
  );

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(230 30% 9% / 0.95), hsl(230 30% 7% / 0.95))",
        border: "1px solid hsl(217 91% 65% / 0.35)",
        boxShadow: "0 0 0 1px hsl(217 91% 65% / 0.08), 0 8px 32px -8px hsl(0 0% 0% / 0.5)",
      }}
    >
      {/* Collapsed header / toggle — use div+role for accessibility without nesting buttons */}
      <div className="flex items-start gap-4 p-5 sm:p-6 hover:bg-primary/5 transition-colors">
        {/* Clickable area (everything except the download button) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-start gap-4 flex-1 min-w-0 text-left"
          data-testid="button-toggle-lesson"
        >
          <div
            className="h-12 w-12 rounded-xl grid place-items-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, hsl(217 91% 65% / 0.2), hsl(280 90% 70% / 0.15))",
              border: "1px solid hsl(217 91% 65% / 0.3)",
            }}
          >
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wider text-primary font-bold mb-1.5">
              Методичка перед раундом
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">{lesson.title}</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{lesson.summary}</p>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-full border border-border/40">
                <Clock className="h-3 w-3" />~{lesson.readingMinutes} мин
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-full border border-border/40">
                <Layers className="h-3 w-3" />
                {lesson.sections.length} разделов
              </span>
              {totalKeyPoints > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs text-primary/85 bg-primary/10 px-2.5 py-1 rounded-full border border-primary/25">
                  <Target className="h-3 w-3" />
                  {totalKeyPoints} ключевых
                </span>
              )}
              {totalPitfalls > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs text-destructive/85 bg-destructive/10 px-2.5 py-1 rounded-full border border-destructive/25">
                  <AlertTriangle className="h-3 w-3" />
                  {totalPitfalls} ошибок
                </span>
              )}
            </div>
          </div>
        </button>
        {/* Action buttons — outside the toggle button to avoid nesting */}
        <div className="flex items-center gap-2 flex-shrink-0 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="h-9 px-3 gap-1.5 text-xs touch-target"
            title="Скачать методичку как HTML-файл"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Скачать</span>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-muted/30 transition-colors"
            aria-label={open ? "Свернуть" : "Развернуть"}
          >
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {open && (
        <div
          className="border-t p-4 sm:p-6 space-y-4"
          style={{ borderColor: "hsl(217 91% 65% / 0.2)" }}
        >
          {/* How-to-read banner */}
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <div className="rounded-xl border border-accent/30 bg-accent/6 p-4 flex gap-3 flex-1">
              <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm text-foreground/85 leading-relaxed">
                <span className="font-bold text-accent">Как читать. </span>
                Прочти разделы по порядку, не пропуская примеры кода — все задания раунда
                решаются именно теми приёмами, что описаны здесь. В конце — шпаргалка:
                пробеги её перед стартом, чтобы освежить в памяти.
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-9 gap-2 sm:flex hidden touch-target"
            >
              <Download className="h-4 w-4" />
              Скачать HTML
            </Button>
          </div>

          {/* Section cards */}
          <div className="space-y-4">
            {lesson.sections.map((s, i) => (
              <SectionCard key={i} section={s} index={i} />
            ))}
          </div>

          {/* Cheat sheet */}
          {lesson.cheatSheet && lesson.cheatSheet.length > 0 && (
            <div
              className="rounded-2xl p-5 sm:p-6"
              style={{
                background: "linear-gradient(135deg, hsl(217 91% 65% / 0.1), hsl(280 90% 70% / 0.07))",
                border: "1px solid hsl(217 91% 65% / 0.35)",
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 text-primary font-bold text-base">
                  <Sparkles className="h-5 w-5" />
                  Шпаргалка перед стартом
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="h-8 gap-1.5 text-xs text-primary hover:text-primary"
                >
                  <Download className="h-3.5 w-3.5" />
                  Скачать
                </Button>
              </div>
              <ol className="space-y-2.5">
                {lesson.cheatSheet.map((t, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-foreground/90 leading-relaxed"
                  >
                    <span
                      className="flex-shrink-0 h-6 w-6 rounded-full grid place-items-center text-xs font-bold font-mono"
                      style={{
                        background: "hsl(217 91% 65% / 0.2)",
                        color: "hsl(217 91% 72%)",
                        border: "1px solid hsl(217 91% 65% / 0.3)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span>{renderInline(t)}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Bottom download */}
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            {lesson.title.toLowerCase().includes("fastapi") && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-2 text-xs touch-target border-accent/40 text-accent hover:text-accent hover:bg-accent/10"
              >
                <a href={`${import.meta.env.BASE_URL}app.py`} download="app.py">
                  <Download className="h-4 w-4" />
                  Скачать app.py
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2 text-xs touch-target"
            >
              <Download className="h-4 w-4" />
              Скачать методичку (HTML)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
