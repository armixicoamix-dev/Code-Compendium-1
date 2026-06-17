/**
 * ExerciseWriteFlask — write exercise for "flask-web" language exercises.
 *
 * Left panel  : Python/Flask editor  +  Pyodide runner
 * Right panel : HTML/CSS/JS editors  +  live preview
 *
 * Bridge: JS code in the preview iframe that calls fetch('/api/...') has its
 * requests intercepted, routed to Pyodide (Flask test_client), and responded
 * back — all in-browser, no real server needed.
 */
import {
  useState, useCallback, useRef, useEffect, useMemo,
} from "react";
import { WriteFromScratchExercise } from "@/data/curriculum";
import { HintBox } from "@/components/HintBox";
import { ExplanationBox } from "@/components/ExplanationBox";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, XCircle, ArrowRight, PenTool, Info, Sparkles,
  Play, Loader2, AlertTriangle, Terminal, ChevronDown, ChevronUp,
} from "lucide-react";

// ── Pyodide singleton (shared with PythonRunner.tsx) ────────────────────────

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
    _pyodideSingleton?: PyodideInterface;
    _pyodideLoading?: Promise<PyodideInterface>;
    _flaskCached?: boolean;
    /** Shared across PythonRunner + ExerciseWriteFlask to avoid double install races */
    _flaskEnsurePromise?: Promise<void>;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  runPython: (code: string) => unknown;
  loadPackage: (pkg: string | string[]) => Promise<void>;
}

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/";

async function getPyodide(): Promise<PyodideInterface> {
  if (window._pyodideSingleton) return window._pyodideSingleton;
  if (window._pyodideLoading) return window._pyodideLoading;
  window._pyodideLoading = (async () => {
    await new Promise<void>((res, rej) => {
      const src = `${PYODIDE_CDN}pyodide.js`;
      if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => res();
      s.onerror = () => rej(new Error("Не удалось загрузить Pyodide"));
      document.head.appendChild(s);
    });
    const py = await window.loadPyodide!({ indexURL: PYODIDE_CDN });
    window._pyodideSingleton = py;
    return py;
  })();
  return window._pyodideLoading;
}

const FLASK_RUN_PATCH = `
from flask import Flask as _FC
def _browser_run(self, *a, **kw):
    rules = [str(r) for r in self.url_map.iter_rules() if r.rule != '/static/<path:filename>']
    print("✓ Flask-приложение готово. Маршруты:", ", ".join(rules) if rules else "нет")
    print("  (В браузере сервер не запускается — это нормально для упражнений)")
_FC.run = _browser_run
del _FC, _browser_run
`;

async function ensureFlask(py: PyodideInterface): Promise<void> {
  if (window._flaskEnsurePromise) return window._flaskEnsurePromise;
  window._flaskEnsurePromise = (async () => {
    await py.loadPackage(["micropip", "markupsafe"]);
    if (!window._flaskCached) {
      const base = window.location.origin + "/wheels/";
      const wheels = [
        "jinja2-3.1.4-py3-none-any.whl",
        "click-8.1.7-py3-none-any.whl",
        "itsdangerous-2.2.0-py3-none-any.whl",
        "blinker-1.8.2-py3-none-any.whl",
        "werkzeug-3.0.3-py3-none-any.whl",
        "flask-3.0.3-py3-none-any.whl",
      ].map((f) => `'${base}${f}'`).join(", ");
      await py.runPythonAsync(
        `import micropip\nawait micropip.install([${wheels}], keep_going=True)`,
      );
      window._flaskCached = true;
    }
    await py.runPythonAsync(FLASK_RUN_PATCH);
  })();
  return window._flaskEnsurePromise;
}

// ── Preview document with Flask fetch-bridge injected ───────────────────────

/**
 * Builds the preview HTML. The JS fetch-bridge intercepts relative-URL fetch()
 * calls and routes them to the parent frame (Pyodide Flask test_client).
 */
function buildFlaskPreviewDoc(html: string, css: string, js: string): string {
  const bridge = String.raw`(function(){
var _p={},_id=0;
var _origFetch=window.fetch;
window.fetch=function(url,opts){
  var s=typeof url==='string'?url:String(url);
  if(!s.startsWith('/')||s.startsWith('//')){return _origFetch.apply(this,arguments);}
  return new Promise(function(res,rej){
    var id=++_id;
    _p[id]={res:res,rej:rej};
    setTimeout(function(){
      if(_p[id]){delete _p[id];rej(new Error('Flask bridge timeout (5s)'));}
    },5000);
    window.parent.postMessage({
      __fb:1,id:id,
      url:s,
      method:(opts&&opts.method||'GET').toUpperCase(),
      body:opts&&opts.body||null
    },'*');
  });
};
window.addEventListener('message',function(e){
  var d=e.data;if(!d||!d.__fr)return;
  var p=_p[d.id];if(!p)return;
  delete _p[d.id];
  if(d.err){p.rej(new Error(d.err));}
  else{
    p.res(new Response(d.body,{
      status:d.status,
      headers:{'Content-Type':d.ct||'application/json'}
    }));
  }
});
})();`;

  const safeJs = js.replace(/<\/script>/gi, "<\\/script>");
  const safeCss = css;
  return [
    `<!DOCTYPE html><html lang="ru"><head>`,
    `<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">`,
    `<style>*,*::before,*::after{box-sizing:border-box}</style>`,
    `<style>${safeCss}</style>`,
    `</head><body>${html}`,
    `<script>${bridge}<\/script>`,
    `<script>(function(){var m=['log','warn','error','info'];m.forEach(function(k){`,
    `var o=console[k].bind(console);console[k]=function(){`,
    `var a=Array.prototype.slice.call(arguments).map(function(x){`,
    `try{return typeof x==='object'?JSON.stringify(x,null,2):String(x)}catch(e){return String(x)}});`,
    `window.parent.postMessage({type:'console',method:k,args:a},'*');o.apply(console,arguments)}});`,
    `window.addEventListener('error',function(e){`,
    `window.parent.postMessage({type:'console',method:'error',args:[(e.message||'Error')+(e.lineno?' (line '+e.lineno+')':'')]},'*')});`,
    `})();<\/script>`,
    `<script>try{${safeJs}}catch(e){window.parent.postMessage({type:'console',method:'error',args:[e.message]},'*')}<\/script>`,
    `</body></html>`,
  ].join("");
}

// ── Types / helpers ──────────────────────────────────────────────────────────

type WebTab = "html" | "css" | "js";

const WEB_TABS: { id: WebTab; label: string; color: string; placeholder: string }[] = [
  { id: "html", label: "HTML", color: "#f97316", placeholder: "<!-- HTML шаблон -->" },
  { id: "css",  label: "CSS",  color: "#3b82f6", placeholder: "/* Стили */" },
  { id: "js",   label: "JS",   color: "#eab308", placeholder: "// fetch('/api/...') и DOM" },
];

interface WebCode { html: string; css: string; js: string; py: string }

function serializeAll(c: WebCode): string {
  return JSON.stringify(c);
}
function deserializeAll(s?: string): WebCode {
  try {
    const v = JSON.parse(s ?? "{}");
    return { html: v.html ?? "", css: v.css ?? "", js: v.js ?? "", py: v.py ?? "" };
  } catch {
    return { html: "", css: "", js: "", py: "" };
  }
}

// ── Smart multi-strategy keyword matcher (Flask version) ─────────────────────
function normalizeCodeFlask(s: string): string {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, " ")     // strip CSS block comments
    .replace(/#[^\n]*/g, "")               // strip Python line comments (careful: also strips CSS #hex - acceptable)
    .replace(/\s*([:;{},>~+])\s*/g, "$1")  // CSS whitespace
    .replace(/[ \t]+/g, " ")
    .replace(/\r\n?/g, "\n")
    .toLowerCase()
    .trim();
}

function smartMatchFlask(combined: string, kw: string): boolean {
  // 1. Direct exact match
  if (combined.includes(kw)) return true;

  // 2. Case-insensitive (HTML, CSS, Python keywords are often case-insensitive in spirit)
  const lcCode = combined.toLowerCase();
  const lcKw   = kw.toLowerCase();
  if (lcCode.includes(lcKw)) return true;

  // 3. Full normalisation (removes comments, normalises whitespace around CSS syntax)
  const normCode = normalizeCodeFlask(combined);
  const normKw   = normalizeCodeFlask(kw);
  if (normCode.includes(normKw)) return true;

  // 4. Quote variations: 'x' ↔ "x" (Python and JS both use both)
  const kwSingle = kw.replace(/"/g, "'");
  const kwDouble = kw.replace(/'/g, '"');
  if (kwSingle !== kw && (combined.includes(kwSingle) || lcCode.includes(kwSingle.toLowerCase()))) return true;
  if (kwDouble !== kw && (combined.includes(kwDouble) || lcCode.includes(kwDouble.toLowerCase()))) return true;

  // 5. Optional trailing semicolon (CSS/JS)
  if (kw.endsWith(";")) {
    const kwNoSemi = kw.slice(0, -1);
    if (combined.includes(kwNoSemi) || lcCode.includes(kwNoSemi.toLowerCase())) return true;
    const normNoSemi = normalizeCodeFlask(kwNoSemi);
    if (normCode.includes(normNoSemi)) return true;
  }

  // 6. Open HTML tag matching: <div> → matches <div class="...">
  if (/^<[a-z][a-z0-9]*>$/i.test(kw)) {
    const tagName = kw.slice(1, -1);
    if (new RegExp(`<${tagName}[\\s>/]`, "i").test(combined)) return true;
  }

  // 7. Python: check for import variants
  //    "from flask import Flask" → match "from flask import Flask, jsonify"
  if (kw.toLowerCase().startsWith("from ") || kw.toLowerCase().startsWith("import ")) {
    const kwBase = lcKw.replace(/,.*$/, "").trim();
    if (lcCode.includes(kwBase)) return true;
  }

  // 8. Flask decorator shorthand: "@app.route" matches "@app.route('/api/...')"
  if (kw.startsWith("@")) {
    const kwBase = kw.split("(")[0];
    if (combined.includes(kwBase) || lcCode.includes(kwBase.toLowerCase())) return true;
  }

  // 9. CSS property bare name check
  if (/^[a-z-]+$/.test(kw) && kw.length > 3) {
    if (new RegExp(`(?:^|[{;\\n])\\s*${lcKw}\\s*:`, "i").test(combined)) return true;
  }

  // 10. JSON method: "JSON.stringify" matches both .stringify and json.stringify (case-insensitive)
  if (kw.includes(".")) {
    const kwParts = kw.split(".");
    const allParts = kwParts.every((p) => lcCode.includes(p.toLowerCase()));
    if (allParts && lcCode.includes(kwParts[kwParts.length - 1].toLowerCase())) return true;
  }

  return false;
}

function gradeFlask(c: WebCode, ex: WriteFromScratchExercise) {
  const combined = [c.html, c.css, c.js, c.py].join("\n");
  const nonEmpty = combined
    .split("\n")
    .filter((l) => {
      const t = l.trim();
      return t && !t.startsWith("//") && !t.startsWith("#") && !t.startsWith("/*") && !t.startsWith("*") && t !== "*/" && t !== "{" && t !== "}";
    })
    .length;
  const hits   = ex.required.filter((kw) => smartMatchFlask(combined, kw));
  const missing = ex.required.filter((kw) => !smartMatchFlask(combined, kw));
  return { earned: hits.length, maxScore: ex.required.length, nonEmpty, missing };
}

// ── Component ────────────────────────────────────────────────────────────────

export function ExerciseWriteFlask({
  exercise,
  onComplete,
  initialCode,
  onInputChange,
}: {
  exercise: WriteFromScratchExercise;
  onComplete: (score: number, max: number, meta: { hintsRevealed: number; input?: string }) => void;
  initialCode?: string;
  onInputChange?: (code: string) => void;
}) {
  const init = deserializeAll(initialCode);
  const [py,  setPy]  = useState(init.py);
  const [html, setHtml] = useState(init.html);
  const [css,  setCss]  = useState(init.css);
  const [js,   setJs]   = useState(init.js);
  const [webTab, setWebTab] = useState<WebTab>("html");

  const [previewSrc, setPreviewSrc] = useState("");
  const [checked, setChecked]     = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);

  // Python runner state
  const [pyStatus, setPyStatus] = useState<"idle" | "loading" | "running" | "ok" | "error">("idle");
  const [pyOutput, setPyOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  // Flask bridge state
  const [bridgeStatus, setBridgeStatus] = useState<"idle" | "calling" | "ok" | "error">("idle");
  const [bridgeLog,    setBridgeLog]    = useState<string[]>([]);

  const previewRef = useRef<HTMLIFrameElement>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pyRef      = useRef(py); // keep latest for async bridge handler

  useEffect(() => { pyRef.current = py; }, [py]);

  // ── Auto-refresh preview ──
  const refresh = useCallback(() => {
    setPreviewSrc(buildFlaskPreviewDoc(html, css, js));
  }, [html, css, js]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(refresh, 200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [html, css, js, refresh]);

  useEffect(() => { refresh(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Flask fetch-bridge message handler ──
  useEffect(() => {
    const handler = async (e: MessageEvent) => {
      if (!e.data?.__fb) return;
      const { id, url, method, body } = e.data as {
        id: number; url: string; method: string; body: string | null;
      };

      setBridgeStatus("calling");
      setBridgeLog((prev) => [...prev.slice(-19), `→ ${method} ${url}`]);

      try {
        const pyodide = await getPyodide();
        await ensureFlask(pyodide);

        // Safely build the Pyodide call by escaping user's Python code
        const code = pyRef.current;
        const escaped = JSON.stringify(code);
        const urlE   = JSON.stringify(url);
        const bodyE  = JSON.stringify(body ?? "null");
        const methE  = JSON.stringify(method.toLowerCase());

        const resultStr = await pyodide.runPythonAsync(`
import sys, io, json as _json, hashlib as _hlib

# Namespace cache lives in Pyodide globals (persists across runPythonAsync calls).
# This keeps in-memory state (e.g. todos=[]) alive between fetch requests
# as long as the Python code hasn't changed.
try:
    _flask_ns_cache
except NameError:
    _flask_ns_cache = {}

_stdout_save, _stderr_save = sys.stdout, sys.stderr
_buf = io.StringIO()
sys.stdout = sys.stderr = _buf
_result = None
try:
    _code_hash = _hlib.md5(${escaped}.encode('utf-8')).hexdigest()
    if _code_hash not in _flask_ns_cache:
        _fresh_ns = {}
        exec(${escaped}, _fresh_ns)
        _flask_ns_cache[_code_hash] = _fresh_ns
        # Keep cache small: drop entries beyond 5 versions
        if len(_flask_ns_cache) > 5:
            oldest = next(iter(_flask_ns_cache))
            del _flask_ns_cache[oldest]
    _ns = _flask_ns_cache[_code_hash]
    _app = _ns.get('app')
    if _app is None:
        raise Exception("Переменная 'app' не найдена. Создай: app = Flask(__name__)")
    _method = ${methE}
    _kw = {}
    _raw_body = ${bodyE}
    if _raw_body and _raw_body != 'null':
        try:
            _kw['json'] = _json.loads(_raw_body)
        except Exception:
            _kw['data'] = _raw_body
    with _app.test_client() as _c:
        _resp = getattr(_c, _method)(${urlE}, follow_redirects=True, **_kw)
        _status = _resp.status_code
        _body_txt = _resp.get_data(as_text=True)
        _ct = _resp.content_type or 'application/json'
    _print_out = _buf.getvalue()
    _result = _json.dumps({'ok': True, 'status': _status, 'body': _body_txt, 'ct': _ct, 'stdout': _print_out})
except Exception as _e:
    _print_out = _buf.getvalue()
    _result = _json.dumps({'ok': False, 'error': str(_e), 'stdout': _print_out})
finally:
    sys.stdout, sys.stderr = _stdout_save, _stderr_save
_result
`) as string;

        const parsed = JSON.parse(resultStr);
        // Show Python print() output from route handlers in the log
        if (parsed.stdout?.trim()) {
          for (const line of parsed.stdout.trim().split("\n").slice(0, 3)) {
            setBridgeLog((prev) => [...prev.slice(-19), `📤 ${line}`]);
          }
        }
        if (parsed.ok) {
          setBridgeLog((prev) => [...prev.slice(-19), `← ${parsed.status} ${url}`]);
          setBridgeStatus("ok");
          previewRef.current?.contentWindow?.postMessage(
            { __fr: 1, id, status: parsed.status, body: parsed.body, ct: parsed.ct },
            "*",
          );
        } else {
          setBridgeLog((prev) => [...prev.slice(-19), `✗ ${url}: ${parsed.error}`]);
          setBridgeStatus("error");
          previewRef.current?.contentWindow?.postMessage(
            { __fr: 1, id, status: 500, body: parsed.error, ct: "text/plain", err: parsed.error },
            "*",
          );
        }
      } catch (err) {
        const msg = String(err);
        setBridgeLog((prev) => [...prev.slice(-19), `✗ bridge error: ${msg}`]);
        setBridgeStatus("error");
        previewRef.current?.contentWindow?.postMessage(
          { __fr: 1, id, status: 500, body: msg, ct: "text/plain", err: msg },
          "*",
        );
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []); // runs once — always reads latest py via pyRef

  // ── Python runner ──
  const runPython = useCallback(async () => {
    setPyStatus("loading");
    setShowOutput(true);
    setPyOutput("");
    try {
      const pyodide = await getPyodide();
      setPyStatus("running");
      await ensureFlask(pyodide);

      const code = pyRef.current;
      const escaped = JSON.stringify(code);

      const out = await pyodide.runPythonAsync(`
import sys, io
_buf = io.StringIO()
_err = io.StringIO()
sys.stdout, sys.stderr = _buf, _err
try:
    exec(${escaped})
except Exception as _e:
    import traceback; traceback.print_exc(file=_err)
finally:
    sys.stdout, sys.stderr = sys.__stdout__, sys.__stderr__
_buf.getvalue() + _err.getvalue()
`) as string;
      setPyOutput(out || "(нет вывода)");
      setPyStatus("ok");
      // Force preview refresh so the bridge can use new Python code
      refresh();
    } catch (err) {
      setPyOutput(String(err));
      setPyStatus("error");
    }
  }, [refresh]);

  // ── State change helpers ──
  const setCode = (tab: WebTab, val: string) => {
    if (tab === "html") setHtml(val);
    else if (tab === "css") setCss(val);
    else setJs(val);
    const nH = tab === "html" ? val : html;
    const nC = tab === "css"  ? val : css;
    const nJ = tab === "js"   ? val : js;
    onInputChange?.(serializeAll({ html: nH, css: nC, js: nJ, py }));
    if (checked) setChecked(false);
  };

  const setPyCode = (val: string) => {
    setPy(val);
    onInputChange?.(serializeAll({ html, css, js, py: val }));
    if (checked) setChecked(false);
  };

  // ── Grading ──
  const current: WebCode = { html, css, js, py };
  const result = useMemo(
    () => (checked ? gradeFlask(current, exercise) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checked],
  );

  const onCheck = () => setChecked(true);
  const onNext  = () => {
    const r = gradeFlask(current, exercise);
    onComplete(r.earned, r.maxScore, {
      hintsRevealed,
      input: serializeAll(current),
    });
  };

  const scoreColor = !result ? ""
    : result.earned === result.maxScore
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : result.earned >= Math.ceil(result.maxScore / 2)
        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
        : "bg-rose-500/10 text-rose-400 border-rose-500/30";

  const currentWebCode = webTab === "html" ? html : webTab === "css" ? css : js;
  const currentWebTab  = WEB_TABS.find((t) => t.id === webTab)!;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-purple-500/15 text-purple-400 grid place-items-center flex-shrink-0">
          <PenTool className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-purple-400 mb-1">
            Напиши с нуля — Flask + HTML · CSS · JS
          </div>
          <h3 className="text-xl font-semibold leading-tight">{exercise.title}</h3>
        </div>
      </div>

      {/* Task description */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
          {exercise.task}
        </p>

        {exercise.required.length > 0 && (
          <div className="pt-3 border-t border-border/50">
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-purple-400" />
              В решении должно быть:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {exercise.required.map((kw) => (
                <code
                  key={kw}
                  className={`px-2 py-0.5 rounded text-xs border font-mono transition-colors ${
                    checked && result
                      ? result.missing.includes(kw)
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                  }`}
                >
                  {kw}
                </code>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground flex items-start gap-2">
          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
          Python-код запускается кнопкой «Запустить Flask». JS fetch('/api/...') в превью
          автоматически вызывает Python-маршруты через мост Pyodide.
        </div>
      </div>

      {/* Main editor grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* ── Left: Python/Flask editor ── */}
        <div className="rounded-xl border border-border overflow-hidden flex flex-col" style={{ minHeight: 400 }}>
          <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-blue-400">🐍 app.py — Flask</span>
            </div>
            <button
              onClick={runPython}
              disabled={pyStatus === "loading" || pyStatus === "running"}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium transition-colors"
            >
              {(pyStatus === "loading" || pyStatus === "running") ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              {pyStatus === "loading" ? "Загрузка..." : pyStatus === "running" ? "Запуск..." : "Запустить Flask"}
            </button>
          </div>

          <textarea
            value={py}
            onChange={(e) => setPyCode(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder={"from flask import Flask, jsonify\n\napp = Flask(__name__)\ntodos = []\n\n@app.route('/api/todos')\ndef get_todos():\n    return jsonify(todos)"}
            className="flex-1 bg-[#0d1117] text-[#e6edf3] font-mono text-sm p-4 resize-none outline-none w-full"
            style={{ minHeight: 240, tabSize: 4 }}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const ta = e.currentTarget;
                const s = ta.selectionStart;
                const end = ta.selectionEnd;
                const nv = py.slice(0, s) + "    " + py.slice(end);
                setPyCode(nv);
                requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 4; });
              }
            }}
          />

          {/* Python output */}
          {(showOutput || pyOutput) && (
            <div className="border-t border-border">
              <button
                type="button"
                onClick={() => setShowOutput((v) => !v)}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors text-left"
              >
                <Terminal className="h-3 w-3 text-blue-400" />
                Вывод Python
                {pyStatus === "ok" && <span className="ml-auto text-emerald-400">✓</span>}
                {pyStatus === "error" && <AlertTriangle className="ml-auto h-3 w-3 text-rose-400" />}
                {showOutput ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
              </button>
              {showOutput && pyOutput && (
                <pre className="bg-[#0d1117] text-[#e6edf3] text-xs font-mono p-3 max-h-40 overflow-auto border-t border-border">
                  {pyOutput}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* ── Right: HTML/CSS/JS + Preview ── */}
        <div className="space-y-3">
          {/* Web code editors */}
          <div className="rounded-xl border border-border overflow-hidden flex flex-col" style={{ minHeight: 240 }}>
            <div className="flex bg-muted/30 border-b border-border">
              {WEB_TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setWebTab(t.id)}
                  className={`flex-1 px-3 py-2 text-sm font-mono font-semibold transition-colors border-b-2 ${
                    webTab === t.id
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground border-transparent"
                  }`}
                  style={{ borderBottomColor: webTab === t.id ? t.color : "transparent" }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <textarea
              value={currentWebCode}
              onChange={(e) => setCode(webTab, e.target.value)}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              placeholder={currentWebTab.placeholder}
              className="flex-1 bg-[#0d1117] text-[#e6edf3] font-mono text-sm p-4 resize-none outline-none w-full"
              style={{ minHeight: 200, tabSize: 2 }}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const ta = e.currentTarget;
                  const s = ta.selectionStart;
                  const end = ta.selectionEnd;
                  const nv = currentWebCode.slice(0, s) + "  " + currentWebCode.slice(end);
                  setCode(webTab, nv);
                  requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 2; });
                }
              }}
            />
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-border overflow-hidden flex flex-col" style={{ minHeight: 200 }}>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Живой предпросмотр
              {bridgeStatus === "calling" && (
                <span className="ml-auto text-amber-400 flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Flask обрабатывает...
                </span>
              )}
              {bridgeStatus === "ok" && (
                <span className="ml-auto text-emerald-400">✓ Flask ответил</span>
              )}
              {bridgeStatus === "error" && (
                <span className="ml-auto text-rose-400">✗ ошибка Flask</span>
              )}
            </div>
            <iframe
              ref={previewRef}
              srcDoc={previewSrc}
              sandbox="allow-scripts"
              className="flex-1 w-full bg-white"
              style={{ minHeight: 170, border: "none" }}
              title="flask-preview"
            />
          </div>

          {/* Bridge log */}
          {bridgeLog.length > 0 && (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="px-3 py-1.5 bg-muted/20 border-b border-border text-xs text-muted-foreground flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-purple-400" />
                Лог запросов fetch ↔ Flask
              </div>
              <div className="bg-[#0d1117] p-3 max-h-28 overflow-auto">
                {bridgeLog.map((l, i) => (
                  <div key={i} className={`text-xs font-mono ${l.startsWith("✗") ? "text-rose-400" : l.startsWith("←") ? "text-emerald-400" : "text-blue-300"}`}>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hints */}
      <HintBox hints={exercise.hints} label="Подсказки" onHintReveal={(n) => setHintsRevealed(n)} />

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button onClick={onCheck} data-testid="button-check-write">Проверить</Button>
        {checked && result && (
          <>
            <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-md border ${scoreColor}`}>
              {result.earned === result.maxScore
                ? <CheckCircle2 className="h-4 w-4" />
                : <XCircle className="h-4 w-4" />
              }
              {result.earned} / {result.maxScore} ключевых слов
            </div>
            <Button onClick={onCheck} variant="outline" size="sm">Перепроверить</Button>
            <Button onClick={onNext} data-testid="button-next-write">
              Дальше <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {checked && result && result.missing.length > 0 && (
        <div className="rounded-xl border bg-muted/20 px-4 py-3 text-sm">
          <div className="text-xs text-muted-foreground mb-2">Не найдено в коде:</div>
          <div className="flex flex-wrap gap-1.5">
            {result.missing.map((kw) => (
              <code key={kw} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-xs border border-rose-500/20 font-mono">
                {kw}
              </code>
            ))}
          </div>
        </div>
      )}

      {checked && exercise.explanation && <ExplanationBox explanation={exercise.explanation} />}
    </div>
  );
}
