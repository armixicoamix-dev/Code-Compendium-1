import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import JSZip from "jszip";
import {
  Home, Play, Download, Code2, Eye, BookOpen, Terminal,
  RefreshCw, Copy, Check, Globe, ChevronDown, ChevronUp,
  Search, X, Zap, ZapOff, Monitor, Smartphone, Tablet,
  FileCode, FileText, Coffee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WEB_DOCS, type DocSection } from "@/data/web-curriculum";

interface ConsoleEntry {
  method: "log" | "warn" | "error" | "info";
  args: string[];
  id: number;
}

type EditorTab = "html" | "css" | "js";
type MainTab = "editor" | "preview" | "docs";
type DocCategory = "all" | "html" | "css" | "js";
type DocLevel = "all" | "beginner" | "intermediate" | "advanced";
type PreviewWidth = "full" | "mobile" | "tablet";

const DEFAULT_HTML = `<div class="container">
  <header class="header">
    <h1>🚀 Мой проект</h1>
    <p class="tagline">Интерактивный HTML/CSS/JS редактор</p>
  </header>

  <div class="cards">
    <div class="card" onclick="this.classList.toggle('active')">
      <div class="card-icon">✨</div>
      <h2>HTML</h2>
      <p>Структура и содержимое страницы</p>
    </div>
    <div class="card" onclick="this.classList.toggle('active')">
      <div class="card-icon">🎨</div>
      <h2>CSS</h2>
      <p>Стили и оформление</p>
    </div>
    <div class="card" onclick="this.classList.toggle('active')">
      <div class="card-icon">⚡</div>
      <h2>JavaScript</h2>
      <p>Поведение и интерактивность</p>
    </div>
  </div>

  <div class="counter-section">
    <button id="dec" class="btn btn-red">−</button>
    <span id="count" class="counter">0</span>
    <button id="inc" class="btn btn-green">+</button>
  </div>
</div>`;

const DEFAULT_CSS = `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #0f0f1a, #1a0f2e);
  color: #e8eaed;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.container {
  max-width: 700px;
  width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.4rem;
}

.tagline {
  color: rgba(255,255,255,0.5);
  font-size: 1rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-align: center;
}

.card:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(99,102,241,0.5);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(99,102,241,0.2);
}

.card.active {
  background: rgba(99,102,241,0.2);
  border-color: #6366f1;
  transform: scale(1.05);
}

.card-icon { font-size: 2rem; margin-bottom: 0.8rem; }
.card h2 { font-size: 1.1rem; margin-bottom: 0.4rem; color: #e8eaed; }
.card p { font-size: 0.85rem; color: rgba(255,255,255,0.5); }

.counter-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 1.5rem;
}

.counter {
  font-size: 3rem;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
  min-width: 3ch;
  text-align: center;
  transition: color 0.3s;
}

.btn {
  width: 52px; height: 52px;
  border: none; border-radius: 50%;
  font-size: 1.5rem; cursor: pointer;
  transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.btn:active { transform: scale(0.9); }
.btn-green { background: #22c55e; color: white; box-shadow: 0 4px 12px rgba(34,197,94,0.4); }
.btn-red   { background: #ef4444; color: white; box-shadow: 0 4px 12px rgba(239,68,68,0.4); }`;

const DEFAULT_JS = `// Счётчик
const countEl = document.getElementById('count');
let count = 0;
function update() {
  countEl.textContent = count;
  countEl.style.color = count > 0 ? '#22c55e' : count < 0 ? '#ef4444' : '#e8eaed';
}
document.getElementById('inc').addEventListener('click', () => { count++; update(); console.log('count:', count); });
document.getElementById('dec').addEventListener('click', () => { count--; update(); console.log('count:', count); });

console.log('🚀 Playground готов!');
console.log('📌 Нажимай на карточки и кнопки счётчика');`;

function buildPreviewDoc(html: string, css: string, js: string): string {
  return `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*,*::before,*::after{box-sizing:border-box}</style><style>${css}</style></head><body>${html}<script>(function(){var m=['log','warn','error','info'];m.forEach(function(k){var o=console[k].bind(console);console[k]=function(){var a=Array.prototype.slice.call(arguments).map(function(x){try{return typeof x==='object'?JSON.stringify(x,null,2):String(x)}catch(e){return String(x)}});window.parent.postMessage({type:'console',method:k,args:a},'*');o.apply(console,arguments)}});window.addEventListener('error',function(e){window.parent.postMessage({type:'console',method:'error',args:[(e.message||'Error')+(e.lineno?' (line '+e.lineno+')':'')]},'*')});window.addEventListener('unhandledrejection',function(e){window.parent.postMessage({type:'console',method:'error',args:['UnhandledRejection: '+(e.reason?.message||e.reason)]},'*')})})();<\/script><script>try{${js.replace(/<\/script>/gi,'<\\/script>')}}catch(e){window.parent.postMessage({type:'console',method:'error',args:[e.message]},'*')}<\/script></body></html>`;
}

const LEVEL_LABEL: Record<string, string> = {
  beginner: "Начинающий",
  intermediate: "Средний",
  advanced: "Продвинутый",
};

const LEVEL_COLOR: Record<string, string> = {
  beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/25",
  advanced: "text-rose-400 bg-rose-500/10 border-rose-500/25",
};

const CAT_ICON: Record<string, React.ReactNode> = {
  html: <FileCode className="h-3.5 w-3.5" />,
  css: <FileText className="h-3.5 w-3.5" />,
  js: <Coffee className="h-3.5 w-3.5" />,
};

const CAT_COLOR: Record<string, string> = {
  html: "text-orange-400",
  css: "text-blue-400",
  js: "text-yellow-400",
};

export function HtmlPlayground({ onHome }: { onHome: () => void }) {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [editorTab, setEditorTab] = useState<EditorTab>("html");
  const [mainTab, setMainTab] = useState<MainTab>("editor");
  const [previewSrc, setPreviewSrc] = useState("");
  const [console_, setConsole] = useState<ConsoleEntry[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [docCategory, setDocCategory] = useState<DocCategory>("all");
  const [docLevel, setDocLevel] = useState<DocLevel>("all");
  const [docSearch, setDocSearch] = useState("");
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [copied, setCopied] = useState<EditorTab | null>(null);
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("full");
  const [showConsole, setShowConsole] = useState(true);
  const idRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const refreshPreview = useCallback(() => {
    setConsole([]);
    setPreviewSrc(buildPreviewDoc(html, css, js));
  }, [html, css, js]);

  // Auto-refresh debounce — 200ms for near-real-time feel
  useEffect(() => {
    if (!autoRefresh) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(refreshPreview, 200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [html, css, js, autoRefresh, refreshPreview]);

  // Initial render
  useEffect(() => { refreshPreview(); }, []); // eslint-disable-line

  // Listen for iframe console messages
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "console") {
        setConsole(prev => [...prev.slice(-149), {
          method: e.data.method as ConsoleEntry["method"],
          args: e.data.args as string[],
          id: ++idRef.current,
        }]);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Scroll console to bottom
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [console_]);

  // Download as ZIP
  const downloadZip = useCallback(async () => {
    const zip = new JSZip();
    const fullHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Мой проект</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${html}
  <script src="script.js"><\/script>
</body>
</html>`;
    zip.file("index.html", fullHtml);
    zip.file("style.css", css);
    zip.file("script.js", js);
    zip.file("README.txt",
      "═══════════════════════════════════════════════════════════\n" +
      "  Проект создан в NaniStitch — Code Mentor Playground\n" +
      "═══════════════════════════════════════════════════════════\n\n" +
      "ФАЙЛЫ ПРОЕКТА:\n" +
      "  index.html — HTML-разметка (структура страницы)\n" +
      "  style.css  — CSS-стили (внешний вид и расположение)\n" +
      "  script.js  — JavaScript-код (интерактивность)\n\n" +
      "КАК ЗАПУСТИТЬ:\n" +
      "  Откройте index.html в любом браузере (Chrome, Firefox, Safari).\n" +
      "  Для редактирования используйте VS Code или любой текстовый редактор.\n\n" +
      "───────────────────────────────────────────────────────────\n" +
      "  ПАМЯТКА: HTML/CSS/JS — основы веб-разработки\n" +
      "───────────────────────────────────────────────────────────\n\n" +
      "HTML — СТРУКТУРА:\n" +
      "  <tag>контент</tag>     — элемент с открывающим и закрывающим тегом\n" +
      "  <tag />                — самозакрывающийся тег\n" +
      "  id=\"name\"              — уникальный идентификатор (только один на странице)\n" +
      "  class=\"name\"           — класс (можно у многих элементов)\n\n" +
      "  Основные теги:\n" +
      "  <h1>...<h6>  — заголовки (h1 самый большой)\n" +
      "  <p>          — параграф текста\n" +
      "  <div>        — блок-контейнер\n" +
      "  <span>       — строчный контейнер\n" +
      "  <a href=\"\">  — ссылка\n" +
      "  <img src=\"\" alt=\"\"> — изображение\n" +
      "  <button>     — кнопка\n" +
      "  <input>      — поле ввода\n" +
      "  <ul><li>     — список\n\n" +
      "CSS — СТИЛИ:\n" +
      "  selector { свойство: значение; }\n\n" +
      "  Селекторы:\n" +
      "  p            — по тегу\n" +
      "  .class-name  — по классу\n" +
      "  #id-name     — по id\n\n" +
      "  Основные свойства:\n" +
      "  color, background-color  — цвет текста и фона\n" +
      "  font-size, font-weight   — размер и жирность шрифта\n" +
      "  margin, padding          — внешний и внутренний отступ\n" +
      "  border                   — граница\n" +
      "  display: flex            — flexbox-раскладка\n" +
      "  width, height            — размеры\n\n" +
      "JAVASCRIPT — ЛОГИКА:\n" +
      "  // Получить элемент:\n" +
      "  const el = document.getElementById('myId');\n" +
      "  const el = document.querySelector('.my-class');\n\n" +
      "  // Изменить текст:\n" +
      "  el.textContent = 'Новый текст';\n\n" +
      "  // Изменить стиль:\n" +
      "  el.style.color = 'red';\n\n" +
      "  // Обработать клик:\n" +
      "  el.addEventListener('click', function() {\n" +
      "    console.log('Клик!');\n" +
      "  });\n\n" +
      "  // Счётчик:\n" +
      "  let count = 0;\n" +
      "  btn.addEventListener('click', () => {\n" +
      "    count++;\n" +
      "    counter.textContent = count;\n" +
      "  });\n\n" +
      "  // Читать значение input:\n" +
      "  const value = input.value;\n\n" +
      "───────────────────────────────────────────────────────────\n" +
      "  Учись дальше на: NaniStitch Code Mentor\n" +
      "───────────────────────────────────────────────────────────\n"
    );
    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "web-project.zip";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [html, css, js]);

  const copyCode = useCallback(async (tab: EditorTab) => {
    const code = tab === "html" ? html : tab === "css" ? css : js;
    try { await navigator.clipboard.writeText(code); } catch { /* ignore */ }
    setCopied(tab); setTimeout(() => setCopied(null), 2000);
  }, [html, css, js]);

  const loadExample = useCallback((s: DocSection) => {
    if (s.html !== undefined) setHtml(s.html);
    if (s.css !== undefined) setCss(s.css);
    if (s.js !== undefined) setJs(s.js);
    setMainTab("editor");
    setEditorTab(s.category === "js" ? "js" : s.category === "css" ? "css" : "html");
  }, []);

  const filteredDocs = useMemo(() => WEB_DOCS.filter(s => {
    if (docCategory !== "all" && s.category !== docCategory) return false;
    if (docLevel !== "all" && s.level !== docLevel) return false;
    if (docSearch) {
      const q = docSearch.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q);
    }
    return true;
  }), [docCategory, docLevel, docSearch]);

  const currentCode = editorTab === "html" ? html : editorTab === "css" ? css : js;
  const setCurrentCode = editorTab === "html" ? setHtml : editorTab === "css" ? setCss : setJs;

  const consoleColor: Record<string, string> = {
    log: "text-emerald-300", warn: "text-amber-300",
    error: "text-rose-400", info: "text-sky-300",
  };

  const PREVIEW_WIDTHS: Record<PreviewWidth, string> = {
    full: "100%", mobile: "390px", tablet: "768px",
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/60 bg-card/80 backdrop-blur-sm flex-shrink-0">
        <Button variant="ghost" size="icon" onClick={onHome} className="h-8 w-8 flex-shrink-0">
          <Home className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1.5 mr-2">
          <Globe className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="font-bold text-sm hidden sm:inline">HTML/CSS/JS Редактор</span>
          <span className="font-bold text-sm sm:hidden">Редактор</span>
        </div>

        {/* Main tabs — desktop */}
        <div className="hidden md:flex items-center gap-1 bg-muted/40 rounded-lg p-0.5">
          {(["editor", "preview", "docs"] as MainTab[]).map(t => (
            <button
              key={t}
              onClick={() => setMainTab(t)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                mainTab === t
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "editor" && <Code2 className="h-3.5 w-3.5" />}
              {t === "preview" && <Eye className="h-3.5 w-3.5" />}
              {t === "docs" && <BookOpen className="h-3.5 w-3.5" />}
              {t === "editor" ? "Редактор" : t === "preview" ? "Предпросмотр" : "Методичка"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Auto-refresh toggle */}
          <button
            onClick={() => setAutoRefresh(v => !v)}
            title={autoRefresh ? "Авто-обновление вкл" : "Авто-обновление выкл"}
            className={`h-7 w-7 rounded flex items-center justify-center transition-colors ${
              autoRefresh ? "text-emerald-400 hover:bg-emerald-500/10" : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            {autoRefresh ? <Zap className="h-3.5 w-3.5" /> : <ZapOff className="h-3.5 w-3.5" />}
          </button>

          {/* Run */}
          <Button size="sm" variant="outline" onClick={refreshPreview} className="h-7 px-2.5 text-xs gap-1.5 hidden sm:flex">
            <Play className="h-3 w-3" /> Запустить
          </Button>

          {/* ZIP Download */}
          <Button size="sm" onClick={downloadZip} className="h-7 px-2.5 text-xs gap-1.5">
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">Скачать ZIP</span>
            <span className="sm:hidden">ZIP</span>
          </Button>
        </div>
      </div>

      {/* ── Mobile bottom tabs ── */}
      <div className="md:hidden flex border-b border-border/60 bg-card/60 flex-shrink-0">
        {(["editor", "preview", "docs"] as MainTab[]).map(t => (
          <button
            key={t}
            onClick={() => setMainTab(t)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
              mainTab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            {t === "editor" && <Code2 className="h-4 w-4" />}
            {t === "preview" && <Eye className="h-4 w-4" />}
            {t === "docs" && <BookOpen className="h-4 w-4" />}
            {t === "editor" ? "Код" : t === "preview" ? "Вид" : "Справка"}
          </button>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-hidden flex">

        {/* ═══ EDITOR VIEW ═══ */}
        {(mainTab === "editor" || (mainTab !== "docs" && mainTab !== "preview")) && (
          <div className={`${mainTab === "editor" ? "flex" : "hidden md:flex"} flex-col w-full md:w-1/2 border-r border-border/60`}>
            {/* Editor tabs */}
            <div className="flex items-center gap-0 border-b border-border/60 bg-card/40 flex-shrink-0">
              {(["html", "css", "js"] as EditorTab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setEditorTab(t)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                    editorTab === t
                      ? `border-primary ${CAT_COLOR[t]}`
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {CAT_ICON[t]}
                  {t.toUpperCase()}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-1 px-2">
                <button
                  onClick={() => copyCode(editorTab)}
                  title="Копировать код"
                  className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied === editorTab
                    ? <Check className="h-3.5 w-3.5 text-emerald-400" />
                    : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Code editor */}
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute inset-0 flex">
                {/* Line numbers */}
                <div
                  className="select-none text-right text-muted-foreground/40 py-3 pl-2 pr-2 font-mono text-xs leading-5 bg-card/20 border-r border-border/40 overflow-hidden"
                  style={{ minWidth: "2.5rem" }}
                  aria-hidden
                >
                  {currentCode.split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                {/* Textarea */}
                <textarea
                  value={currentCode}
                  onChange={e => setCurrentCode(e.target.value)}
                  spellCheck={false}
                  className="flex-1 bg-transparent text-foreground font-mono text-xs leading-5 p-3 resize-none outline-none border-none overflow-auto"
                  onKeyDown={e => {
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const ta = e.currentTarget;
                      const start = ta.selectionStart;
                      const end = ta.selectionEnd;
                      const newVal = ta.value.slice(0, start) + "  " + ta.value.slice(end);
                      setCurrentCode(newVal);
                      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 2; });
                    }
                  }}
                  style={{ caretColor: "white" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ═══ PREVIEW VIEW ═══ */}
        <div className={`${mainTab === "preview" ? "flex" : mainTab === "editor" ? "hidden md:flex" : "hidden"} flex-col flex-1 min-w-0`}>
          {/* Preview toolbar */}
          <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/60 bg-card/40 flex-shrink-0">
            <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Предпросмотр</span>
            {/* Width buttons */}
            <div className="flex items-center gap-0.5 ml-auto">
              {([
                ["full", <Monitor className="h-3 w-3" />, "Полный"],
                ["tablet", <Tablet className="h-3 w-3" />, "Планшет"],
                ["mobile", <Smartphone className="h-3 w-3" />, "Телефон"],
              ] as [PreviewWidth, React.ReactNode, string][]).map(([w, icon, label]) => (
                <button
                  key={w}
                  onClick={() => setPreviewWidth(w)}
                  title={label}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                    previewWidth === w
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {icon}
                  <span className="hidden lg:inline">{label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowConsole(v => !v)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                showConsole ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Terminal className="h-3 w-3" />
              <span className="hidden sm:inline">Консоль</span>
              {console_.length > 0 && (
                <span className="bg-primary text-white text-[9px] px-1 rounded-full">{console_.length}</span>
              )}
            </button>
          </div>

          {/* iframe + console */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 bg-white overflow-auto flex justify-center">
              <iframe
                srcDoc={previewSrc}
                sandbox="allow-scripts allow-forms allow-popups allow-modals"
                title="HTML Preview"
                className="border-none"
                style={{
                  width: PREVIEW_WIDTHS[previewWidth],
                  height: "100%",
                  maxWidth: "100%",
                  display: "block",
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            {/* Console panel */}
            {showConsole && (
              <div className="border-t border-border/60 bg-card/80 flex flex-col" style={{ height: "160px" }}>
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/40 flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Terminal className="h-3.5 w-3.5" />
                    <span>Консоль JavaScript</span>
                    {console_.length > 0 && (
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{console_.length}</span>
                    )}
                  </div>
                  <button
                    onClick={() => setConsole([])}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> Очистить
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto font-mono text-xs px-3 py-2 space-y-0.5">
                  {console_.length === 0 ? (
                    <div className="text-muted-foreground/50 text-xs">
                      Вывод console.log(), предупреждения и ошибки появятся здесь
                    </div>
                  ) : (
                    console_.map(entry => (
                      <div key={entry.id} className={`flex items-start gap-1.5 ${consoleColor[entry.method]}`}>
                        <span className="opacity-50 flex-shrink-0">
                          {entry.method === "error" ? "✕" : entry.method === "warn" ? "△" : entry.method === "info" ? "ℹ" : "›"}
                        </span>
                        <span className="break-all leading-5">{entry.args.join(" ")}</span>
                      </div>
                    ))
                  )}
                  <div ref={consoleEndRef} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ DOCS VIEW ═══ */}
        {mainTab === "docs" && (
          <div className="flex flex-col w-full overflow-hidden">
            {/* Docs toolbar */}
            <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-border/60 bg-card/40 flex-shrink-0">
              {/* Category filter */}
              <div className="flex items-center gap-0.5 bg-muted/40 rounded-lg p-0.5">
                {(["all", "html", "css", "js"] as DocCategory[]).map(c => (
                  <button
                    key={c}
                    onClick={() => setDocCategory(c)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      docCategory === c ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c === "all" ? "Все" : c.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Level filter */}
              <div className="flex items-center gap-0.5 bg-muted/40 rounded-lg p-0.5">
                {(["all", "beginner", "intermediate", "advanced"] as DocLevel[]).map(l => (
                  <button
                    key={l}
                    onClick={() => setDocLevel(l)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                      docLevel === l ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l === "all" ? "Все" : l === "beginner" ? "Начало" : l === "intermediate" ? "Средний" : "Проф"}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="flex items-center gap-1.5 flex-1 min-w-[150px] bg-muted/30 border border-border/50 rounded-lg px-2 py-1">
                <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  value={docSearch}
                  onChange={e => setDocSearch(e.target.value)}
                  placeholder="Поиск по методичке..."
                  className="bg-transparent text-xs outline-none flex-1 placeholder:text-muted-foreground"
                />
                {docSearch && (
                  <button onClick={() => setDocSearch("")}>
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>

              <span className="text-xs text-muted-foreground ml-auto">{filteredDocs.length} разделов</span>
            </div>

            {/* Docs list */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
              {filteredDocs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">Ничего не найдено</div>
              )}
              {filteredDocs.map(section => {
                const isOpen = expandedDoc === section.id;
                return (
                  <div
                    key={section.id}
                    className="border border-border/50 rounded-xl overflow-hidden bg-card/50"
                  >
                    {/* Section header */}
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                      onClick={() => setExpandedDoc(isOpen ? null : section.id)}
                    >
                      <span className={`text-xs font-semibold uppercase ${CAT_COLOR[section.category]}`}>
                        {section.category.toUpperCase()}
                      </span>
                      <span className="font-semibold text-sm flex-1">{section.title}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${LEVEL_COLOR[section.level]}`}>
                        {LEVEL_LABEL[section.level]}
                      </span>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                    </button>

                    {/* Section body */}
                    {isOpen && (
                      <div className="border-t border-border/40">
                        <div className="px-4 py-4 space-y-4">
                          {/* Body text — code-block aware renderer */}
                          <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
                            {(() => {
                              const lines = section.body.split("\n");
                              const els: React.ReactNode[] = [];
                              let inCode = false;
                              let codeLines: string[] = [];
                              lines.forEach((line, i) => {
                                if (line.startsWith("```")) {
                                  if (!inCode) { inCode = true; codeLines = []; }
                                  else {
                                    els.push(
                                      <pre key={`code-${i}`} className="bg-black/40 rounded-lg p-3 overflow-x-auto text-xs font-mono text-emerald-300 my-2 leading-relaxed">
                                        <code>{codeLines.join("\n")}</code>
                                      </pre>
                                    );
                                    inCode = false; codeLines = [];
                                  }
                                  return;
                                }
                                if (inCode) { codeLines.push(line); return; }
                                if (line.startsWith("━") || (line.trim() === "" && els.length > 0)) {
                                  els.push(<div key={i} className="h-2" />);
                                  return;
                                }
                                if (line.startsWith("**") && line.endsWith("**")) {
                                  els.push(<p key={i} className="font-semibold text-foreground mt-3 mb-1">{line.slice(2, -2)}</p>);
                                  return;
                                }
                                if (line.startsWith("• ")) {
                                  els.push(<li key={i} className="ml-4 list-disc">{formatBold(line.slice(2))}</li>);
                                  return;
                                }
                                if (/^[❌✅💡🔍👂➕🚀🐛📦🎨🌈🔄🔢🧹📋✏️🔢🧹━]/.test(line) && line.length < 90) {
                                  els.push(<p key={i} className="font-semibold text-foreground mt-3">{line}</p>);
                                  return;
                                }
                                if (line.trim() === "") return;
                                els.push(<p key={i} className="leading-relaxed">{formatBold(line)}</p>);
                              });
                              return els;
                            })()}
                          </div>

                          {/* Tips */}
                          {section.tips.length > 0 && (
                            <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-3">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2">💡 Советы</div>
                              <ul className="space-y-1">
                                {section.tips.map((tip, i) => (
                                  <li key={i} className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                                    <span className="text-amber-400 flex-shrink-0">→</span>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Load example button */}
                          {(section.html !== undefined || section.css !== undefined || section.js !== undefined) && (
                            <Button
                              size="sm"
                              onClick={() => loadExample(section)}
                              className="h-7 text-xs gap-1.5"
                            >
                              <Code2 className="h-3 w-3" />
                              Загрузить пример в редактор
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} className="text-foreground font-semibold">{p.slice(2, -2)}</strong>
      : p
  );
}
