import { Round, Exercise } from "@/data/curriculum";
import { PerExerciseResult } from "@/components/RoundView";

export interface ReportExercise {
  id: string;
  type: Exercise["type"];
  title: string;
  question?: string;
  userInput?: string | string[];
  correctAnswers?: string[];
  earned: number;
  max: number;
  hintsRevealed: number;
}

export function buildRoundReport(round: Round, perExercise: PerExerciseResult[]): ReportExercise[] {
  const allExercises: Record<string, Exercise> = {};
  const allEx: Exercise[] = [
    ...round.fills,
    ...round.questions,
    ...round.writes,
    ...(round.fillLines ?? []),
  ];
  allEx.forEach((ex) => { allExercises[ex.id] = ex; });

  return perExercise.map((r) => {
    const ex = allExercises[r.id];
    if (!ex) return { id: r.id, type: r.type, title: r.id, earned: r.earned, max: r.max, hintsRevealed: r.hintsRevealed };

    const base = { id: r.id, type: r.type, earned: r.earned, max: r.max, hintsRevealed: r.hintsRevealed, userInput: r.userInput };

    if (ex.type === "question") {
      return { ...base, title: ex.title, question: ex.question, correctAnswers: ex.answers };
    }
    if (ex.type === "fill") {
      return { ...base, title: ex.title, question: ex.description, correctAnswers: ex.answers.map((a) => a[0] ?? "") };
    }
    if (ex.type === "write") {
      return { ...base, title: ex.title, question: ex.task, correctAnswers: ex.required };
    }
    if (ex.type === "fill-lines") {
      return { ...base, title: ex.title, correctAnswers: ex.blanks?.map((b) => b.required?.join(", ") ?? "") ?? [] };
    }
    return { ...base, title: r.id };
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function typeLabel(type: Exercise["type"]): string {
  switch (type) {
    case "fill": return "📝 Заполни пропуски";
    case "question": return "❓ Вопрос с ответом";
    case "write": return "✍️ Напиши с нуля";
    case "fill-lines": return "🧩 Блоки кода";
    default: return type;
  }
}

function renderUserInput(input: string | string[] | undefined, type: Exercise["type"]): string {
  if (input === undefined || input === null) return '<span class="na">—</span>';
  if (type === "fill" || type === "fill-lines") {
    const arr = Array.isArray(input) ? input : [input];
    if (arr.length === 0) return '<span class="na">—</span>';
    return arr.map((v, i) => `<code class="blank">#${i + 1}: ${escapeHtml(v || "—")}</code>`).join(" ");
  }
  if (type === "write") {
    const code = typeof input === "string" ? input : (input as string[]).join("\n");
    return `<pre class="code-block">${escapeHtml(code)}</pre>`;
  }
  const text = Array.isArray(input) ? input.join(", ") : input;
  return `<code class="answer">${escapeHtml(text)}</code>`;
}

export function generateRoundHtml(
  roundTitle: string,
  roundNumber: number,
  exercises: ReportExercise[],
  totalEarned: number,
  totalMax: number,
  durationMs?: number,
): string {
  const pct = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;
  const minutes = durationMs ? Math.max(1, Math.round(durationMs / 60000)) : null;

  const exerciseRows = exercises.map((ex) => {
    const scoreClass = ex.earned === ex.max ? "score-full" : ex.earned >= ex.max / 2 ? "score-partial" : "score-low";
    const correctAnswers = (ex.correctAnswers ?? []).slice(0, 5);
    return `
    <div class="exercise-card">
      <div class="ex-header">
        <span class="ex-type">${typeLabel(ex.type)}</span>
        <span class="ex-score ${scoreClass}">${ex.earned} / ${ex.max}</span>
      </div>
      <div class="ex-title">${escapeHtml(ex.title)}</div>
      ${ex.question ? `<div class="ex-question">${escapeHtml(ex.question)}</div>` : ""}
      <div class="ex-answers">
        <div class="answer-row">
          <span class="answer-label user-label">Твой ответ:</span>
          <span class="answer-value">${renderUserInput(ex.userInput, ex.type)}</span>
        </div>
        ${correctAnswers.length > 0 ? `
        <div class="answer-row">
          <span class="answer-label correct-label">${ex.type === "write" ? "Ключевые конструкции:" : "Правильно:"}</span>
          <span class="answer-value">${correctAnswers.map((a) => `<code class="correct">${escapeHtml(a)}</code>`).join(" ")}</span>
        </div>` : ""}
      </div>
      ${ex.hintsRevealed > 0 ? `<div class="hints-used">💡 Подсказок использовано: ${ex.hintsRevealed}</div>` : ""}
    </div>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Результаты раунда ${roundNumber} — ${escapeHtml(roundTitle)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f1117; color: #e2e8f0; min-height: 100vh; padding: 24px; }
  .container { max-width: 860px; margin: 0 auto; }
  .header { text-align: center; padding: 32px 0 24px; border-bottom: 1px solid #1e293b; margin-bottom: 28px; }
  .header-badge { display: inline-block; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 4px 12px; font-size: 12px; color: #94a3b8; letter-spacing: .05em; text-transform: uppercase; margin-bottom: 12px; }
  h1 { font-size: 28px; font-weight: 700; color: #f1f5f9; margin-bottom: 8px; }
  .summary { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 16px; }
  .summary-chip { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 10px 18px; text-align: center; min-width: 100px; }
  .chip-value { font-size: 22px; font-weight: 700; font-family: monospace; color: #a78bfa; }
  .chip-label { font-size: 11px; color: #64748b; margin-top: 2px; }
  .exercise-card { background: #141a24; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; margin-bottom: 14px; }
  .ex-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .ex-type { font-size: 11px; color: #94a3b8; font-weight: 500; }
  .ex-score { font-family: monospace; font-size: 14px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
  .score-full { background: rgba(52,211,153,.15); color: #34d399; border: 1px solid rgba(52,211,153,.3); }
  .score-partial { background: rgba(251,191,36,.1); color: #fbbf24; border: 1px solid rgba(251,191,36,.3); }
  .score-low { background: rgba(248,113,113,.1); color: #f87171; border: 1px solid rgba(248,113,113,.3); }
  .ex-title { font-size: 15px; font-weight: 600; color: #f1f5f9; margin-bottom: 6px; }
  .ex-question { font-size: 13px; color: #94a3b8; margin-bottom: 12px; line-height: 1.5; }
  .ex-answers { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
  .answer-row { display: flex; gap: 10px; align-items: flex-start; }
  .answer-label { font-size: 11px; font-weight: 600; white-space: nowrap; padding-top: 2px; min-width: 110px; }
  .user-label { color: #818cf8; }
  .correct-label { color: #34d399; }
  .answer-value { font-size: 13px; flex: 1; }
  code.answer, code.blank { background: #1e293b; border: 1px solid #334155; border-radius: 4px; padding: 2px 7px; font-family: monospace; font-size: 12px; color: #e2e8f0; display: inline-block; margin: 1px; }
  code.correct { background: rgba(52,211,153,.1); border: 1px solid rgba(52,211,153,.25); color: #34d399; border-radius: 4px; padding: 2px 7px; font-family: monospace; font-size: 12px; display: inline-block; margin: 1px; }
  pre.code-block { background: #0d1117; border: 1px solid #1e293b; border-radius: 8px; padding: 12px 14px; font-family: monospace; font-size: 12px; color: #c9d1d9; white-space: pre-wrap; word-break: break-word; line-height: 1.6; margin-top: 4px; }
  span.na { color: #475569; font-style: italic; }
  .hints-used { margin-top: 10px; font-size: 11px; color: #92400e; background: rgba(251,191,36,.08); border: 1px solid rgba(251,191,36,.2); border-radius: 6px; padding: 4px 10px; display: inline-block; }
  .footer { text-align: center; padding-top: 24px; border-top: 1px solid #1e293b; margin-top: 8px; font-size: 11px; color: #475569; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="header-badge">Раунд ${roundNumber}</div>
    <h1>${escapeHtml(roundTitle)}</h1>
    <div class="summary">
      <div class="summary-chip"><div class="chip-value">${totalEarned}/${totalMax}</div><div class="chip-label">баллов</div></div>
      <div class="summary-chip"><div class="chip-value">${pct}%</div><div class="chip-label">точность</div></div>
      <div class="summary-chip"><div class="chip-value">${exercises.length}</div><div class="chip-label">заданий</div></div>
      ${minutes !== null ? `<div class="summary-chip"><div class="chip-value">${minutes} мин</div><div class="chip-label">время</div></div>` : ""}
    </div>
  </div>
  ${exerciseRows}
  <div class="footer">Flexible Code Mentor · ${new Date().toLocaleDateString("ru-RU")}</div>
</div>
</body>
</html>`;
}

export interface FinalReportRound {
  round: Round;
  result: PerExerciseResult[];
  earned: number;
  max: number;
  durationMs?: number;
}

export function generateFinalHtml(
  courseLabel: string,
  grade: number,
  rounds: FinalReportRound[],
): string {
  const totalEarned = rounds.reduce((a, r) => a + r.earned, 0);
  const totalMax = rounds.reduce((a, r) => a + r.max, 0);
  const pct = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;

  const roundSections = rounds.map(({ round, result, earned, max }) => {
    const exercises = buildRoundReport(round, result);
    const rPct = max > 0 ? Math.round((earned / max) * 100) : 0;
    const exerciseRows = exercises.map((ex) => {
      const scoreClass = ex.earned === ex.max ? "score-full" : ex.earned >= ex.max / 2 ? "score-partial" : "score-low";
      const correctAnswers = (ex.correctAnswers ?? []).slice(0, 5);
      return `
      <div class="exercise-card">
        <div class="ex-header">
          <span class="ex-type">${typeLabel(ex.type)}</span>
          <span class="ex-score ${scoreClass}">${ex.earned} / ${ex.max}</span>
        </div>
        <div class="ex-title">${escapeHtml(ex.title)}</div>
        ${ex.question ? `<div class="ex-question">${escapeHtml(ex.question)}</div>` : ""}
        <div class="ex-answers">
          <div class="answer-row">
            <span class="answer-label user-label">Твой ответ:</span>
            <span class="answer-value">${renderUserInput(ex.userInput, ex.type)}</span>
          </div>
          ${correctAnswers.length > 0 ? `
          <div class="answer-row">
            <span class="answer-label correct-label">${ex.type === "write" ? "Ключевые конструкции:" : "Правильно:"}</span>
            <span class="answer-value">${correctAnswers.map((a) => `<code class="correct">${escapeHtml(a)}</code>`).join(" ")}</span>
          </div>` : ""}
        </div>
      </div>`;
    }).join("\n");

    return `
    <details class="round-section" open>
      <summary class="round-summary-header">
        <span class="round-num">Раунд ${round.number}</span>
        <span class="round-title-text">${escapeHtml(round.title)}</span>
        <span class="round-score ${rPct >= 90 ? "score-full" : rPct >= 60 ? "score-partial" : "score-low"}">${earned}/${max} · ${rPct}%</span>
      </summary>
      <div class="round-body">${exerciseRows}</div>
    </details>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Итоговые результаты — ${escapeHtml(courseLabel)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f1117; color: #e2e8f0; min-height: 100vh; padding: 24px; }
  .container { max-width: 900px; margin: 0 auto; }
  .header { text-align: center; padding: 36px 0 28px; border-bottom: 1px solid #1e293b; margin-bottom: 32px; }
  .course-label { font-size: 12px; color: #94a3b8; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 10px; }
  h1 { font-size: 32px; font-weight: 800; color: #f1f5f9; margin-bottom: 6px; }
  .grade-badge { display: inline-flex; align-items: baseline; gap: 4px; background: linear-gradient(135deg,#7c3aed,#6366f1); color: white; border-radius: 16px; padding: 10px 28px; margin: 16px 0; }
  .grade-num { font-size: 48px; font-weight: 900; font-family: monospace; line-height: 1; }
  .grade-max { font-size: 20px; opacity: .6; }
  .summary { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 16px; }
  .summary-chip { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 10px 18px; text-align: center; min-width: 100px; }
  .chip-value { font-size: 22px; font-weight: 700; font-family: monospace; color: #a78bfa; }
  .chip-label { font-size: 11px; color: #64748b; margin-top: 2px; }
  .round-section { background: #141a24; border: 1px solid #1e293b; border-radius: 14px; margin-bottom: 16px; overflow: hidden; }
  .round-summary-header { display: flex; align-items: center; gap: 12px; padding: 14px 18px; cursor: pointer; list-style: none; }
  .round-summary-header::-webkit-details-marker { display: none; }
  .round-num { font-size: 11px; font-weight: 700; color: #818cf8; background: rgba(129,140,248,.12); border: 1px solid rgba(129,140,248,.3); border-radius: 6px; padding: 2px 8px; white-space: nowrap; }
  .round-title-text { flex: 1; font-weight: 600; color: #e2e8f0; }
  .round-score { font-family: monospace; font-size: 13px; font-weight: 600; padding: 3px 10px; border-radius: 8px; white-space: nowrap; }
  .round-body { padding: 0 14px 14px; }
  .exercise-card { background: #0f1117; border: 1px solid #1e293b; border-radius: 10px; padding: 14px; margin-top: 10px; }
  .ex-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .ex-type { font-size: 11px; color: #94a3b8; font-weight: 500; }
  .ex-score { font-family: monospace; font-size: 13px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
  .score-full { background: rgba(52,211,153,.15); color: #34d399; border: 1px solid rgba(52,211,153,.3); }
  .score-partial { background: rgba(251,191,36,.1); color: #fbbf24; border: 1px solid rgba(251,191,36,.3); }
  .score-low { background: rgba(248,113,113,.1); color: #f87171; border: 1px solid rgba(248,113,113,.3); }
  .ex-title { font-size: 14px; font-weight: 600; color: #f1f5f9; margin-bottom: 4px; }
  .ex-question { font-size: 12px; color: #94a3b8; margin-bottom: 10px; line-height: 1.5; }
  .ex-answers { display: flex; flex-direction: column; gap: 7px; margin-top: 8px; }
  .answer-row { display: flex; gap: 10px; align-items: flex-start; }
  .answer-label { font-size: 11px; font-weight: 600; white-space: nowrap; padding-top: 2px; min-width: 110px; }
  .user-label { color: #818cf8; }
  .correct-label { color: #34d399; }
  .answer-value { font-size: 12px; flex: 1; }
  code.answer, code.blank { background: #1e293b; border: 1px solid #334155; border-radius: 4px; padding: 2px 6px; font-family: monospace; font-size: 12px; color: #e2e8f0; display: inline-block; margin: 1px; }
  code.correct { background: rgba(52,211,153,.1); border: 1px solid rgba(52,211,153,.25); color: #34d399; border-radius: 4px; padding: 2px 6px; font-family: monospace; font-size: 12px; display: inline-block; margin: 1px; }
  pre.code-block { background: #0d1117; border: 1px solid #1e293b; border-radius: 8px; padding: 10px 12px; font-family: monospace; font-size: 11px; color: #c9d1d9; white-space: pre-wrap; word-break: break-word; line-height: 1.6; }
  span.na { color: #475569; font-style: italic; }
  .footer { text-align: center; padding-top: 24px; border-top: 1px solid #1e293b; margin-top: 8px; font-size: 11px; color: #475569; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="course-label">${escapeHtml(courseLabel)}</div>
    <h1>Итоговые результаты</h1>
    <div class="grade-badge">
      <span class="grade-num">${grade}</span>
      <span class="grade-max">/ 12</span>
    </div>
    <div class="summary">
      <div class="summary-chip"><div class="chip-value">${totalEarned}/${totalMax}</div><div class="chip-label">баллов</div></div>
      <div class="summary-chip"><div class="chip-value">${pct}%</div><div class="chip-label">точность</div></div>
      <div class="summary-chip"><div class="chip-value">${rounds.length}</div><div class="chip-label">раундов</div></div>
    </div>
  </div>
  ${roundSections}
  <div class="footer">Flexible Code Mentor · ${new Date().toLocaleDateString("ru-RU")}</div>
</div>
</body>
</html>`;
}

export function downloadHtml(html: string, filename: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}
