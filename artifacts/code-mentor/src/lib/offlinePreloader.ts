/**
 * offlinePreloader.ts
 *
 * Warms up all offline caches by actually loading and running Pyodide + Flask.
 * After this completes every GET the app ever makes is in the SW cache,
 * so the app works 100% offline: exercises, grading, Python playground, Flask.
 */

const PYODIDE_VERSION = "0.25.0";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// ── Shared with PythonRunner.tsx (same window globals) ────────────────────
declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideHandle>;
    _pyodideSingleton?: PyodideHandle;
    _pyodideLoading?: Promise<PyodideHandle>;
    /** Set to true once flask has been installed in any tab load */
    _flaskCached?: boolean;
    /** Shared promise used by ensureFlask in PythonRunner + ExerciseWriteFlask */
    _flaskEnsurePromise?: Promise<void>;
  }
}

export interface PyodideHandle {
  runPythonAsync: (code: string) => Promise<unknown>;
  runPython: (code: string) => unknown;
  loadPackage: (pkg: string | string[]) => Promise<void>;
}

export type PreloadStep =
  | "idle"
  | "app"
  | "pyodide"
  | "micropip"
  | "flask"
  | "done"
  | "error";

export interface PreloadProgress {
  step: PreloadStep;
  label: string;
  pct: number;
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
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(s);
  });
}

/** Cache the current page's static assets (JS bundles, CSS) */
async function cacheAppShell(): Promise<void> {
  if (!("caches" in window)) return;
  const cache = await caches.open("code-mentor-app-v4");
  const urls: string[] = [
    window.location.origin + "/",
    window.location.origin + "/index.html",
    window.location.origin + "/manifest.json",
  ];
  // Grab currently loaded scripts and stylesheets
  document.querySelectorAll<HTMLScriptElement>("script[src]").forEach((el) => {
    if (el.src.startsWith(window.location.origin)) urls.push(el.src);
  });
  document.querySelectorAll<HTMLLinkElement>("link[rel=stylesheet]").forEach((el) => {
    if (el.href.startsWith(window.location.origin)) urls.push(el.href);
  });
  await Promise.allSettled(
    [...new Set(urls)].map((url) =>
      fetch(url, { cache: "no-cache" })
        .then((r) => { if (r.ok) cache.put(url, r.clone()); })
        .catch(() => {})
    )
  );
}

/** Load (or reuse) the Pyodide singleton. All fetches go through SW → PYODIDE_CACHE. */
async function getPyodide(): Promise<PyodideHandle> {
  if (window._pyodideSingleton) return window._pyodideSingleton;
  if (window._pyodideLoading) return window._pyodideLoading;
  window._pyodideLoading = (async () => {
    await loadScript(`${PYODIDE_CDN}pyodide.js`);
    const py = await window.loadPyodide!({ indexURL: PYODIDE_CDN });
    window._pyodideSingleton = py;
    return py;
  })();
  return window._pyodideLoading;
}

/**
 * Full offline warm-up.
 * onProgress is called with human-readable progress at each stage.
 */
export async function preloadForOffline(
  onProgress: (p: PreloadProgress) => void
): Promise<void> {
  // ── 1. App shell ──────────────────────────────────────────────────────────
  onProgress({ step: "app", label: "Кэширование приложения…", pct: 5 });
  await cacheAppShell();

  // ── 2. Pyodide core (~20 МБ) ─────────────────────────────────────────────
  onProgress({ step: "pyodide", label: "Загрузка Python-движка (≈20 МБ, только раз)…", pct: 15 });
  const pyodide = await getPyodide();

  // ── 3. micropip + Flask ────────────────────────────────────────────────────
  // Create a shared promise BEFORE starting so any concurrent ensureFlask call
  // in PythonRunner/ExerciseWriteFlask will await the same work instead of racing.
  onProgress({ step: "micropip", label: "Загрузка micropip…", pct: 60 });
  if (!window._flaskEnsurePromise) {
    window._flaskEnsurePromise = (async () => {
      await pyodide.loadPackage(["micropip", "markupsafe"]);
      if (!window._flaskCached) {
        const origin = window.location.origin;
        const base = origin + "/wheels/";
        const wheelList = [
          "jinja2-3.1.4-py3-none-any.whl",
          "click-8.1.7-py3-none-any.whl",
          "itsdangerous-2.2.0-py3-none-any.whl",
          "blinker-1.8.2-py3-none-any.whl",
          "werkzeug-3.0.3-py3-none-any.whl",
          "flask-3.0.3-py3-none-any.whl",
        ].map(f => "'" + base + f + "'").join(", ");
        await pyodide.runPythonAsync(
          "import micropip\nawait micropip.install([" + wheelList + "], keep_going=True)"
        );
        window._flaskCached = true;
      }
    })();
  }

  // ── 4. Await Flask install ────────────────────────────────────────────────
  onProgress({ step: "flask", label: "Установка Flask и зависимостей…", pct: 75 });
  await window._flaskEnsurePromise;

  // ── 5. Done ───────────────────────────────────────────────────────────────
  onProgress({ step: "done", label: "Готово! Всё работает офлайн ✓", pct: 100 });
}
