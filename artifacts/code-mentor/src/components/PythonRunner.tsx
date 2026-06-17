import { useState, useCallback, useRef } from "react";
import {
  Play,
  Terminal,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
    _pyodideSingleton?: PyodideInterface;
    _pyodideLoading?: Promise<PyodideInterface>;
    /** Shared with ExerciseWriteFlask to avoid double install race */
    _flaskEnsurePromise?: Promise<void>;
    /** Set true once Flask wheels installed in this session */
    _flaskCached?: boolean;
    /** Set true once fastapi/pydantic installed */
    _fastapiCached?: boolean;
    _fastapiEnsurePromise?: Promise<void>;
    prompt: (message?: string, _default?: string) => string | null;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  runPython: (code: string) => unknown;
  loadPackage: (pkg: string | string[]) => Promise<void>;
}

const PYODIDE_VERSION = "0.25.0";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

/** Detect whether the code imports flask (so we can pre-install it) */
function needsFlask(code: string): boolean {
  return /^\s*(from flask\b|import flask\b)/m.test(code);
}

/** Detect whether the code imports fastapi or pydantic */
function needsFastAPI(code: string): boolean {
  return /^\s*(from fastapi\b|import fastapi\b|from pydantic\b|import pydantic\b)/m.test(code);
}

/** Detect whether the code imports sqlite3 */
function needsSqlite(code: string): boolean {
  return /^\s*(import sqlite3\b|from sqlite3\b)/m.test(code);
}

/** Detect whether the code imports sqlalchemy */
function needsSqlAlchemy(code: string): boolean {
  return /^\s*(import sqlalchemy\b|from sqlalchemy\b)/m.test(code);
}

const FASTAPI_RUN_PATCH = `
try:
    import uvicorn as _uvicorn
    def _browser_run(app, *args, **kwargs):
        host = kwargs.get('host', '127.0.0.1')
        port = kwargs.get('port', 8000)
        try:
            from fastapi import FastAPI as _FA
            if isinstance(app, _FA):
                routes = [r.path for r in app.routes if hasattr(r, 'path') and not r.path.startswith('/openapi') and r.path not in ('/', '/docs', '/redoc')]
                print("\\u2713 FastAPI-\\u043f\\u0440\\u0438\\u043b\\u043e\\u0436\\u0435\\u043d\\u0438\\u0435 \\u0441\\u043e\\u0437\\u0434\\u0430\\u043d\\u043e!")
                if routes:
                    print("  \\u041c\\u0430\\u0440\\u0448\\u0440\\u0443\\u0442\\u044b:", ", ".join(routes))
                print(f"  (\\u0412 \\u0431\\u0440\\u0430\\u0443\\u0437\\u0435\\u0440\\u0435 \\u0441\\u0435\\u0440\\u0432\\u0435\\u0440 \\u043d\\u0435 \\u0437\\u0430\\u043f\\u0443\\u0441\\u043a\\u0430\\u0435\\u0442\\u0441\\u044f \\u2014 \\u044d\\u0442\\u043e \\u043d\\u043e\\u0440\\u043c\\u0430\\u043b\\u044c\\u043d\\u043e \\u0434\\u043b\\u044f \\u0443\\u043f\\u0440\\u0430\\u0436\\u043d\\u0435\\u043d\\u0438\\u0439)")
        except Exception:
            print("\\u2713 \\u041f\\u0440\\u0438\\u043b\\u043e\\u0436\\u0435\\u043d\\u0438\\u0435 \\u0441\\u043e\\u0437\\u0434\\u0430\\u043d\\u043e (\\u0437\\u0430\\u043f\\u0443\\u0441\\u043a \\u0441\\u0435\\u0440\\u0432\\u0435\\u0440\\u0430 \\u0432 \\u0431\\u0440\\u0430\\u0443\\u0437\\u0435\\u0440\\u0435 \\u043d\\u0435\\u0432\\u043e\\u0437\\u043c\\u043e\\u0436\\u0435\\u043d)")
    _uvicorn.run = _browser_run
    del _browser_run
except ImportError:
    pass
`;

const FLASK_RUN_PATCH = `
from flask import Flask as _FlaskCls
def _browser_run(self, *args, **kwargs):
    rules = [str(r) for r in self.url_map.iter_rules() if r.rule != '/static/<path:filename>']
    print("\\u2713 Flask-\\u043f\\u0440\\u0438\\u043b\\u043e\\u0436\\u0435\\u043d\\u0438\\u0435 \\u0441\\u043e\\u0437\\u0434\\u0430\\u043d\\u043e, \\u043c\\u0430\\u0440\\u0448\\u0440\\u0443\\u0442\\u044b \\u0437\\u0430\\u0440\\u0435\\u0433\\u0438\\u0441\\u0442\\u0440\\u0438\\u0440\\u043e\\u0432\\u0430\\u043d\\u044b!")
    if rules:
        print("  \\u041c\\u0430\\u0440\\u0448\\u0440\\u0443\\u0442\\u044b:", ", ".join(rules))
    print("  (\\u0417\\u0430\\u043f\\u0443\\u0441\\u043a \\u0441\\u0435\\u0440\\u0432\\u0435\\u0440\\u0430 \\u0432 \\u0431\\u0440\\u0430\\u0443\\u0437\\u0435\\u0440\\u0435 \\u043d\\u0435\\u0432\\u043e\\u0437\\u043c\\u043e\\u0436\\u0435\\u043d \\u2014 \\u044d\\u0442\\u043e \\u043d\\u043e\\u0440\\u043c\\u0430\\u043b\\u044c\\u043d\\u043e \\u0434\\u043b\\u044f \\u0443\\u043f\\u0440\\u0430\\u0436\\u043d\\u0435\\u043d\\u0438\\u0439)")
_FlaskCls.run = _browser_run
del _FlaskCls, _browser_run
`;

/** One-time loadPackage("sqlite3") — sqlite3 is bundled in Pyodide but must be loaded explicitly */
let _sqliteLoadPromise: Promise<void> | null = null;
async function ensureSqlite(pyodide: PyodideInterface): Promise<void> {
  if (_sqliteLoadPromise) return _sqliteLoadPromise;
  _sqliteLoadPromise = pyodide.loadPackage("sqlite3");
  return _sqliteLoadPromise;
}

/** One-time micropip install of sqlalchemy (also loads sqlite3 as dependency) */
let _sqlAlchemyInstallPromise: Promise<void> | null = null;
async function ensureSqlAlchemy(pyodide: PyodideInterface): Promise<void> {
  if (_sqlAlchemyInstallPromise) return _sqlAlchemyInstallPromise;
  _sqlAlchemyInstallPromise = (async () => {
    await pyodide.loadPackage(["micropip", "sqlite3"]);
    await pyodide.runPythonAsync(
      "import micropip; await micropip.install('sqlalchemy', keep_going=True)"
    );
  })();
  return _sqlAlchemyInstallPromise;
}

/** One-time micropip install of flask, shared with ExerciseWriteFlask via window global */
let _flaskInstallPromise: Promise<void> | null = null;
async function ensureFlask(pyodide: PyodideInterface): Promise<void> {
  // Share promise via window so ExerciseWriteFlask and PythonRunner don't race
  if (window._flaskEnsurePromise) return window._flaskEnsurePromise;
  if (_flaskInstallPromise) return _flaskInstallPromise;
  _flaskInstallPromise = (async () => {
    // markupsafe has C extensions — load Pyodide's built-in compiled version first
    await pyodide.loadPackage(["micropip", "markupsafe"]);
    // If the offline preloader already installed Flask, skip re-download
    if (!window._flaskCached) {
      // Use locally-bundled wheel files so Flask installs 100% offline.
      // The wheels are served from public/wheels/ and cached by the service worker.
      const base = window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, "") + "/wheels/";
      const wheelList = [
        "jinja2-3.1.4-py3-none-any.whl",
        "click-8.1.7-py3-none-any.whl",
        "itsdangerous-2.2.0-py3-none-any.whl",
        "blinker-1.8.2-py3-none-any.whl",
        "werkzeug-3.0.3-py3-none-any.whl",
        "flask-3.0.3-py3-none-any.whl",
      ].map(f => "'" + base + f + "'").join(", ");
      const installCode = "import micropip\nawait micropip.install([" + wheelList + "], keep_going=True)";
      await pyodide.runPythonAsync(installCode);
      window._flaskCached = true;
    }
    // Always apply the browser-run monkey-patch for this session
    await pyodide.runPythonAsync(FLASK_RUN_PATCH);
  })();
  window._flaskEnsurePromise = _flaskInstallPromise;
  return _flaskInstallPromise;
}

/** One-time micropip install of fastapi + pydantic */
let _fastapiInstallPromise: Promise<void> | null = null;
async function ensureFastAPI(pyodide: PyodideInterface): Promise<void> {
  if (window._fastapiEnsurePromise) return window._fastapiEnsurePromise;
  if (_fastapiInstallPromise) return _fastapiInstallPromise;
  _fastapiInstallPromise = (async () => {
    await pyodide.loadPackage(["micropip"]);
    if (!window._fastapiCached) {
      await pyodide.runPythonAsync(
        "import micropip\nawait micropip.install(['pydantic', 'fastapi', 'httpx', 'anyio'], keep_going=True)"
      );
      window._fastapiCached = true;
    }
    await pyodide.runPythonAsync(FASTAPI_RUN_PATCH);
  })();
  window._fastapiEnsurePromise = _fastapiInstallPromise;
  return _fastapiInstallPromise;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function getPyodide(): Promise<PyodideInterface> {
  if (window._pyodideSingleton) return window._pyodideSingleton;
  if (window._pyodideLoading) return window._pyodideLoading;
  window._pyodideLoading = (async () => {
    await loadScript(`${PYODIDE_CDN}pyodide.js`);
    const pyodide = await window.loadPyodide!({ indexURL: PYODIDE_CDN });
    window._pyodideSingleton = pyodide;
    return pyodide;
  })();
  return window._pyodideLoading;
}

const INPUT_PATCH = `
import builtins as _builtins
def _patched_input(prompt=""):
    import js as _js
    msg = str(prompt) if prompt else "Введи значение (input):"
    val = _js.prompt(msg)
    if val is None:
        val = ""
    _capture_out.write(str(prompt) + str(val) + "\\n")
    return str(val)
_builtins.input = _patched_input
`;

export interface RunResult {
  success: boolean;
  stdout: string;
  stderr: string;
}

/** Parsed error location extracted from a Python traceback */
interface ErrorLocation {
  /** The last (innermost) line number reported in the traceback */
  line: number;
  /** Column offset — only present for SyntaxError */
  col?: number;
  /** Exception class name, e.g. "NameError", "TypeError" */
  errorType: string;
  /** Human-readable error message after the colon */
  errorMsg: string;
}

/**
 * Parse a Python traceback string to find where the error occurred.
 *
 * Python tracebacks look like:
 *   Traceback (most recent call last):
 *     File "<string>", line 5, in <module>
 *   NameError: name 'x' is not defined
 *
 * SyntaxErrors also include an offset (column):
 *   File "<string>", line 3
 *     y = x +
 *            ^
 *   SyntaxError: invalid syntax (detected at line 3, offset 8)
 */
function parseErrorLocation(stderr: string): ErrorLocation | null {
  if (!stderr) return null;

  // Find all "File ..., line N" mentions — we want the innermost (last) one
  const lineMatches = [...stderr.matchAll(/File\s+"<string>",\s+line\s+(\d+)/g)];
  const lastLineMatch = lineMatches[lineMatches.length - 1];
  const lineNum = lastLineMatch ? parseInt(lastLineMatch[1], 10) : null;

  // Column / offset — present in SyntaxError as "offset N"
  const colMatch = stderr.match(/offset\s+(\d+)/i) ?? stderr.match(/column\s+(\d+)/i);
  const col = colMatch ? parseInt(colMatch[1], 10) : undefined;

  // The last non-blank line is usually "ExceptionType: message"
  const lines = stderr.trim().split("\n").filter((l) => l.trim().length > 0);
  const lastLine = lines[lines.length - 1] ?? "";

  // Try to split "ExceptionType: rest of message"
  const colonIdx = lastLine.indexOf(":");
  let errorType = lastLine;
  let errorMsg = "";
  if (colonIdx > 0) {
    errorType = lastLine.slice(0, colonIdx).trim();
    errorMsg = lastLine.slice(colonIdx + 1).trim();
  }

  // Only return if we found something useful
  if (!lineNum && !errorType) return null;

  return { line: lineNum ?? 0, col, errorType, errorMsg };
}

// ── Russian error guide dictionary ─────────────────────────────────────────
// Each entry: human-readable title, WHY it happens, HOW to fix it
const PYTHON_ERROR_GUIDE: Record<string, { title: string; why: string; fix: string }> = {
  NameError: {
    title: "NameError — имя не определено",
    why: "Python не может найти переменную или функцию с таким именем. Причины: опечатка, переменная не создана до её использования, или создана в другой области видимости (другой функции).",
    fix: "1) Проверь написание имени — регистр важен: `x` и `X` это разные имена. 2) Убедись что переменная объявлена ДО её использования. 3) Если переменная в функции — она не видна снаружи.",
  },
  TypeError: {
    title: "TypeError — неправильный тип данных",
    why: "Операция или функция получила значение неправильного типа. Типичные случаи: сложение строки с числом ('2' + 2), вызов не-функции как функции, передача неправильного числа аргументов.",
    fix: "Узнай тип: print(type(переменная)). Преобразуй явно: int(), str(), float(). Проверь количество аргументов функции.",
  },
  SyntaxError: {
    title: "SyntaxError — синтаксическая ошибка",
    why: "Python не смог разобрать структуру кода. Частые причины: пропущено двоеточие после if/for/def/class, незакрытая скобка или кавычка, неправильная запись выражения.",
    fix: "Смотри на строку ДО указанной — Python часто сообщает следующую. Проверь: ':' после def/if/for/class, все скобки закрыты, строки в кавычках закрыты.",
  },
  IndentationError: {
    title: "IndentationError — ошибка отступа",
    why: "Python определяет блоки кода по отступам. Ошибка возникает при смешивании пробелов и табуляции или несогласованном количестве пробелов в одном блоке.",
    fix: "Используй только пробелы (4 штуки на уровень) или только табуляцию — но не оба. В этом редакторе Tab = 4 пробела. Все строки одного блока должны иметь одинаковый отступ.",
  },
  IndexError: {
    title: "IndexError — индекс за пределами списка",
    why: "Попытка обратиться к элементу списка по индексу, которого нет. Список из N элементов имеет индексы 0..N-1.",
    fix: "Узнай длину: len(список). Максимальный индекс = len-1. Отрицательный индекс -1 это последний элемент. Перед обращением проверяй: if i < len(список).",
  },
  KeyError: {
    title: "KeyError — ключ не найден в словаре",
    why: "Попытка получить значение из словаря по ключу, которого в нём нет.",
    fix: "Вместо dict['key'] используй dict.get('key', значение_по_умолчанию). Или проверяй: if 'key' in dict: ... Для просмотра всех ключей: print(dict.keys()).",
  },
  AttributeError: {
    title: "AttributeError — нет такого атрибута или метода",
    why: "Попытка обратиться к атрибуту или методу, которого нет у объекта. Часто: опечатка в имени метода, переменная оказалась None вместо объекта, или объект не того типа.",
    fix: "Узнай тип: print(type(объект)). Посмотри доступные методы: print(dir(объект)). Проверь что переменная не None перед обращением к её атрибутам.",
  },
  ValueError: {
    title: "ValueError — неподходящее значение",
    why: "Функция получила значение правильного типа, но недопустимого содержания. Например: int('abc') — строка не число; список.index(x) — x не в списке; int('') — пустая строка.",
    fix: "Проверяй входные данные перед конвертацией. Для пользовательского ввода всегда используй try/except ValueError: чтобы обработать неправильный формат.",
  },
  ZeroDivisionError: {
    title: "ZeroDivisionError — деление на ноль",
    why: "Математически деление на ноль не определено. Python сообщает об этом как об ошибке вместо возврата бесконечности.",
    fix: "Всегда проверяй делитель: if b != 0: result = a / b. Или используй try/except ZeroDivisionError:. Для % (остаток) — та же проблема.",
  },
  ImportError: {
    title: "ImportError — ошибка при импорте",
    why: "Python не смог импортировать указанный объект из модуля. Возможно: такого имени нет в модуле, или опечатка в имени.",
    fix: "Проверь написание имени (регистр важен). Посмотри документацию модуля. Убедись что импортируешь то, что реально существует в этом модуле.",
  },
  ModuleNotFoundError: {
    title: "ModuleNotFoundError — модуль не найден",
    why: "Python не знает модуля с таким именем. Либо он не установлен, либо опечатка в названии.",
    fix: "Установи: pip install имя_модуля. Проверь правильность написания. В этом Playground доступны только встроенные модули Python (os, sys, math, re, json, datetime, itertools и др.).",
  },
  RecursionError: {
    title: "RecursionError — бесконечная рекурсия",
    why: "Функция вызывает себя снова и снова, не достигая условия остановки. Python ограничивает глубину рекурсии ~1000 вызовами для защиты от зависания.",
    fix: "Убедись что в рекурсивной функции есть БАЗОВЫЙ СЛУЧАЙ — условие, при котором функция возвращает результат без рекурсивного вызова. Проверь что аргументы в каждом вызове приближают к базовому случаю.",
  },
  UnboundLocalError: {
    title: "UnboundLocalError — переменная используется до присвоения",
    why: "Python видит присвоение переменной внутри функции и считает её локальной. Но ты пытаешься использовать её до присвоения. Часто причина — попытка изменить глобальную переменную без ключевого слова global.",
    fix: "Если нужна глобальная переменная — объяви global имя в начале функции. Лучше: передавай значения как аргументы и возвращай через return — так код чище.",
  },
  StopIteration: {
    title: "StopIteration — итератор исчерпан",
    why: "Вызов next() на итераторе, который уже вернул все свои значения.",
    fix: "Используй цикл for вместо ручного next(). Если next() необходим — оберни в try/except StopIteration: для обработки конца итератора.",
  },
  OverflowError: {
    title: "OverflowError — число слишком большое",
    why: "Результат вычисления вышел за пределы допустимого диапазона чисел с плавающей точкой. (Целые числа int в Python не ограничены, но float — ограничены.)",
    fix: "Используй int вместо float для больших чисел. Для математики с огромными числами изучи модуль decimal.",
  },
  MemoryError: {
    title: "MemoryError — не хватает памяти",
    why: "Программа пытается выделить больше памяти, чем доступно. Часто причина — создание огромного списка или строки.",
    fix: "Используй генераторы вместо списков для обработки большого количества данных (они ленивые). Избегай range(1_000_000_000) или [0]*10**9.",
  },
};

/** Shows a human-readable Russian explanation for a known Python error type */
function ErrorGuide({ errorType }: { errorType: string }) {
  const guide = PYTHON_ERROR_GUIDE[errorType];
  if (!guide) return null;
  return (
    <div className="mt-3 rounded-lg border border-amber-500/30 overflow-hidden">
      <div className="px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-1.5">
        <AlertTriangle className="h-3 w-3 text-amber-400" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
          Что значит эта ошибка и как исправить
        </span>
      </div>
      <div className="px-3 py-3 space-y-2 text-xs" style={{ background: "hsl(35 30% 6%)" }}>
        <div className="font-semibold text-amber-300 text-[13px]">{guide.title}</div>
        <div className="leading-relaxed text-foreground/80">
          <span className="font-semibold text-rose-300/90">Почему: </span>
          {guide.why}
        </div>
        <div className="leading-relaxed text-foreground/80">
          <span className="font-semibold text-emerald-300/90">Как исправить: </span>
          {guide.fix}
        </div>
      </div>
    </div>
  );
}

/** Renders a mini code snippet centred around the error line with gutter and column caret */
function ErrorSourceHighlight({
  code,
  line,
  col,
}: {
  code: string;
  line: number;
  col?: number;
}) {
  if (!line || !code) return null;
  const allLines = code.split("\n");
  // Show ±2 lines around the error for context
  const start = Math.max(0, line - 3);
  const end = Math.min(allLines.length - 1, line + 1);
  const snippet = allLines.slice(start, end + 1);

  return (
    <div className="mt-3 rounded-lg border border-rose-500/30 overflow-hidden">
      <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-rose-400 bg-rose-500/10 border-b border-rose-500/20 flex items-center gap-1.5">
        <MapPin className="h-3 w-3" />
        Место ошибки — строка {line}
        {col != null && `, столбец ${col}`}
      </div>
      <div className="overflow-x-auto">
        <pre
          className="text-xs font-mono p-3 leading-relaxed"
          style={{ background: "hsl(0 40% 6%)" }}
        >
          {snippet.map((src, i) => {
            const lineNo = start + i + 1;
            const isError = lineNo === line;
            return (
              <div
                key={lineNo}
                className={
                  isError
                    ? "bg-rose-500/15 text-rose-200 -mx-3 px-3 rounded"
                    : "text-rose-300/40"
                }
              >
                {/* Line number gutter */}
                <span className="select-none mr-4 text-rose-500/40 text-[10px] w-5 inline-block text-right">
                  {lineNo}
                </span>
                {/* Source line text */}
                <span className={isError ? "text-rose-200" : "text-rose-300/40"}>{src}</span>
                {/* Column caret underneath the error line */}
                {isError && col != null && (
                  <div className="ml-9 text-rose-400 text-[11px]">
                    {"~".repeat(Math.max(0, col - 1))}^
                  </div>
                )}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}

interface PythonRunnerProps {
  code: string;
  onResult?: (r: RunResult) => void;
  compact?: boolean;
}

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "installing"; pkg: "flask" | "sqlite3" | "sqlalchemy" | "fastapi + pydantic" }
  | { kind: "running" }
  | { kind: "done"; result: RunResult };

export function PythonRunner({ code, onResult, compact = false }: PythonRunnerProps) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const abortRef = useRef(false);

  const run = useCallback(async () => {
    if (!code.trim()) return;
    abortRef.current = false;
    setState({ kind: "loading" });

    try {
      const pyodide = await getPyodide();
      if (abortRef.current) return;

      // Auto-load sqlite3 (built into Pyodide but needs explicit loadPackage)
      if (needsSqlite(code) && !needsSqlAlchemy(code)) {
        setState({ kind: "installing", pkg: "sqlite3" });
        await ensureSqlite(pyodide);
        if (abortRef.current) return;
      }

      // Auto-install SQLAlchemy via micropip (also loads sqlite3)
      if (needsSqlAlchemy(code)) {
        setState({ kind: "installing", pkg: "sqlalchemy" });
        await ensureSqlAlchemy(pyodide);
        if (abortRef.current) return;
      }

      // Auto-install Flask via micropip when student code imports it
      if (needsFlask(code)) {
        setState({ kind: "installing", pkg: "flask" });
        await ensureFlask(pyodide);
        if (abortRef.current) return;
      }

      // Auto-install FastAPI + Pydantic via micropip
      if (needsFastAPI(code)) {
        setState({ kind: "installing", pkg: "fastapi + pydantic" });
        await ensureFastAPI(pyodide);
        if (abortRef.current) return;
      }

      setState({ kind: "running" });

      let stdout = "";
      let stderr = "";

      try {
        // Redirect stdout/stderr to in-memory StringIO buffers
        await pyodide.runPythonAsync(`
import sys, io as _io
_capture_out = _io.StringIO()
_capture_err = _io.StringIO()
sys.stdout = _capture_out
sys.stderr = _capture_err
`);

        // Patch input() so student code can use it via browser prompt()
        await pyodide.runPythonAsync(INPUT_PATCH);

        // Run the student's code
        await pyodide.runPythonAsync(code);

        stdout = String(pyodide.runPython("_capture_out.getvalue()") ?? "");
        stderr = String(pyodide.runPython("_capture_err.getvalue()") ?? "");
        await pyodide.runPythonAsync("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");

        const result: RunResult = { success: true, stdout, stderr };
        if (!abortRef.current) {
          setState({ kind: "done", result });
          onResult?.(result);
        }
      } catch (err: unknown) {
        // Restore sys streams even if student code threw
        try {
          await pyodide.runPythonAsync("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");
        } catch {
          // ignore restore error
        }
        // Recover any partial stdout that was printed before the error
        try {
          stdout = String(pyodide.runPython("_capture_out.getvalue()") ?? "");
        } catch {
          // ignore
        }
        const errMsg = err instanceof Error ? err.message : String(err);
        const result: RunResult = { success: false, stdout, stderr: errMsg };
        if (!abortRef.current) {
          setState({ kind: "done", result });
          onResult?.(result);
        }
      }
    } catch (loadErr: unknown) {
      const msg = loadErr instanceof Error ? loadErr.message : String(loadErr);
      const result: RunResult = {
        success: false,
        stdout: "",
        stderr: `Не удалось загрузить Python-движок: ${msg}`,
      };
      if (!abortRef.current) {
        setState({ kind: "done", result });
        onResult?.(result);
      }
    }
  }, [code, onResult]);

  const reset = () => {
    abortRef.current = true;
    setState({ kind: "idle" });
  };

  const isLoading = state.kind === "loading" || state.kind === "installing" || state.kind === "running";
  const isDone = state.kind === "done";
  const result = isDone ? state.result : null;
  const hasOutput = result && (result.stdout.trim() || result.stderr.trim());

  // Parse error location for richer error display (line + column highlight)
  const errorLocation =
    result && !result.success ? parseErrorLocation(result.stderr) : null;

  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        compact ? "" : "border-emerald-500/30 bg-emerald-500/5"
      }`}
    >
      {/* ── Toolbar ── */}
      <div
        className={`flex items-center gap-3 px-4 py-2.5 ${
          compact
            ? "bg-muted/40 border-b"
            : "bg-emerald-500/10 border-b border-emerald-500/20"
        }`}
      >
        <Terminal
          className={`h-4 w-4 flex-shrink-0 ${
            compact ? "text-muted-foreground" : "text-emerald-400"
          }`}
        />
        <span
          className={`text-xs font-semibold ${
            compact ? "text-muted-foreground" : "text-emerald-400"
          } uppercase tracking-wider`}
        >
          Запустить код в Python
        </span>
        <div className="ml-auto flex items-center gap-2">
          {isDone && (
            <button
              type="button"
              onClick={reset}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Сбросить
            </button>
          )}
          <Button
            size="sm"
            variant={compact ? "outline" : "default"}
            onClick={run}
            disabled={isLoading || !code.trim()}
            className={`h-7 px-3 text-xs gap-1.5 ${
              !compact
                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500"
                : ""
            }`}
            data-testid="button-run-python"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            {state.kind === "loading"
              ? "Загрузка Python…"
              : state.kind === "installing"
                ? state.pkg === "flask" ? "Установка Flask…"
                  : state.pkg === "sqlalchemy" ? "Установка SQLAlchemy…"
                  : state.pkg === "fastapi + pydantic" ? "Установка FastAPI…"
                  : "Загрузка sqlite3…"
              : state.kind === "running"
                ? "Выполняется…"
                : "Запустить"}
          </Button>
        </div>
      </div>

      {/* ── Loading hint ── */}
      {state.kind === "loading" && (
        <div className="px-4 py-3 text-xs text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
          Загрузка Python (Pyodide) — первый раз до 10 сек, потом из кэша…
        </div>
      )}

      {/* ── Package install hint ── */}
      {state.kind === "installing" && (
        <div className="px-4 py-3 text-xs text-blue-300/80 flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
          {state.pkg === "flask"
            ? "Устанавливаю Flask в браузере (micropip) — первый раз ~5 сек, потом из кэша…"
            : state.pkg === "sqlalchemy"
              ? "Устанавливаю SQLAlchemy в браузере (micropip) — первый раз ~15 сек…"
              : state.pkg === "fastapi + pydantic"
                ? "Устанавливаю FastAPI + Pydantic (micropip) — первый раз ~10-20 сек, потом из кэша…"
                : "Загружаю sqlite3 (встроен в Pyodide) — пару секунд…"}
        </div>
      )}

      {/* ── Results ── */}
      {isDone && result && (
        <div className="divide-y divide-border/50">
          {hasOutput ? (
            <div className="px-4 py-3 space-y-3">
              {/* stdout */}
              {result.stdout.trim() && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3" />
                    Вывод программы (stdout)
                  </div>
                  <pre className="pyrunner-output pyrunner-output--success">
                    {result.stdout}
                  </pre>
                </div>
              )}

              {/* stderr / error */}
              {result.stderr.trim() && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-rose-400 font-semibold mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3" />
                    {result.success ? "Предупреждения (stderr)" : "Ошибка Python"}
                  </div>

                  {/* Error location badge — line & column */}
                  {errorLocation && errorLocation.line > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold">
                        <MapPin className="h-3 w-3" />
                        Строка {errorLocation.line}
                        {errorLocation.col != null &&
                          `, столбец ${errorLocation.col}`}
                      </span>
                      <span className="text-[11px] text-rose-400 font-mono font-semibold">
                        {errorLocation.errorType}
                      </span>
                      {errorLocation.errorMsg &&
                        errorLocation.errorMsg !== errorLocation.errorType && (
                          <span className="text-[11px] text-rose-300/80">
                            — {errorLocation.errorMsg}
                          </span>
                        )}
                    </div>
                  )}

                  {/* Full traceback */}
                  <pre className="pyrunner-output pyrunner-output--error">
                    {result.stderr}
                  </pre>

                  {/* Inline source highlight showing the erroneous line */}
                  {errorLocation && errorLocation.line > 0 && (
                    <ErrorSourceHighlight
                      code={code}
                      line={errorLocation.line}
                      col={errorLocation.col}
                    />
                  )}

                  {/* Russian explanation: why this error type happens & how to fix */}
                  {errorLocation && (
                    <ErrorGuide errorType={errorLocation.errorType} />
                  )}
                </div>
              )}
            </div>
          ) : result.success ? (
            <div className="px-4 py-3 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Код выполнен без ошибок. Вывода нет (программа ничего не напечатала).
            </div>
          ) : (
            <div className="px-4 py-3 text-xs text-rose-400 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5" />
              Ошибка выполнения
            </div>
          )}

          {/* Status footer */}
          <div
            className={`px-4 py-2 text-[11px] flex items-center gap-2 ${
              result.success ? "text-emerald-500/80" : "text-rose-500/80"
            }`}
          >
            {result.success ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <AlertTriangle className="h-3 w-3" />
            )}
            {result.success
              ? "Код запущен успешно — синтаксических и runtime-ошибок нет"
              : "Код завершился с ошибкой — исправь её по указанной строке и запусти снова"}
          </div>
        </div>
      )}

      {/* ── Idle hint ── */}
      {state.kind === "idle" && (
        <div className="px-4 py-3 text-xs text-muted-foreground">
          Нажми «Запустить» чтобы выполнить твой код прямо здесь в браузере и увидеть вывод.{" "}
          <span className="text-emerald-400/70">
            Если код вызывает input() — браузер покажет диалог ввода. При ошибках будет
            показана строка и столбец.
          </span>
        </div>
      )}
    </div>
  );
}
