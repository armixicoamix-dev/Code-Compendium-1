import { useState, useCallback, useRef, useEffect } from "react";
import {
  Play, Terminal, Loader2, Database, Table2, ChevronRight,
  RotateCcw, History, BookOpen, X, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
    _pyodideSingleton?: PyodideInterface;
    _pyodideLoading?: Promise<PyodideInterface>;
    _sqliteLoadPromise?: Promise<void>;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  runPython: (code: string) => unknown;
  loadPackage: (pkg: string | string[]) => Promise<void>;
}

const PYODIDE_VERSION = "0.25.0";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Cannot load ${src}`));
    document.head.appendChild(s);
  });
}

async function getPyodide(): Promise<PyodideInterface> {
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

async function ensureSqlite(py: PyodideInterface): Promise<void> {
  if (window._sqliteLoadPromise) return window._sqliteLoadPromise;
  window._sqliteLoadPromise = py.loadPackage("sqlite3");
  return window._sqliteLoadPromise;
}

// ── Sample DB bootstrap SQL ──────────────────────────────────────────────────
const BOOTSTRAP_SQL = `
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  age INTEGER,
  city TEXT
);
INSERT INTO users (name, email, age, city) VALUES
  ('Алиса', 'alice@mail.ru', 25, 'Москва'),
  ('Боб', 'bob@mail.ru', 17, 'СПб'),
  ('Вика', 'vika@mail.ru', 32, 'Казань'),
  ('Гриша', 'grisha@mail.ru', 28, 'Москва'),
  ('Даша', 'dasha@mail.ru', 22, 'Новосибирск'),
  ('Егор', 'egor@mail.ru', 19, 'Москва');

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL,
  category TEXT,
  stock INTEGER DEFAULT 0
);
INSERT INTO products (name, price, category, stock) VALUES
  ('Ноутбук', 75000, 'Электроника', 12),
  ('Мышь', 1500, 'Электроника', 200),
  ('Стол', 12000, 'Мебель', 5),
  ('Кресло', 18000, 'Мебель', 8),
  ('Клавиатура', 4500, 'Электроника', 50),
  ('Монитор', 35000, 'Электроника', 20),
  ('Книга Python', 900, 'Книги', 100);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  product_id INTEGER,
  quantity INTEGER DEFAULT 1,
  order_date TEXT DEFAULT '2024-01-15',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
INSERT INTO orders (user_id, product_id, quantity, order_date) VALUES
  (1, 1, 1, '2024-01-10'),
  (1, 2, 2, '2024-01-15'),
  (3, 3, 1, '2024-02-01'),
  (4, 5, 1, '2024-02-10'),
  (2, 7, 3, '2024-03-05'),
  (5, 6, 1, '2024-03-20'),
  (1, 4, 1, '2024-04-01');
`;

// ── Python runner (SQL → results via Pyodide) ────────────────────────────────
const SQL_RUNNER = `
import sqlite3, json as _json, time as _time

def run_sql(db_json, sql):
    db_bytes = bytes(_json.loads(db_json))
    t0 = _time.time()
    
    # Load DB from bytes
    conn = sqlite3.connect(':memory:')
    if db_bytes:
        tmp = sqlite3.connect(':memory:')
        tmp.deserialize(db_bytes)
        tmp.backup(conn)
        tmp.close()
    
    cursor = conn.cursor()
    try:
        cursor.execute(sql)
        conn.commit()
        rows = cursor.fetchall()
        cols = [d[0] for d in cursor.description] if cursor.description else []
        elapsed = round((_time.time() - t0) * 1000, 1)
        
        # Serialize updated DB
        new_db = list(conn.serialize())
        
        return _json.dumps({
            'ok': True,
            'columns': cols,
            'rows': [list(r) for r in rows],
            'rowcount': cursor.rowcount,
            'elapsed': elapsed,
            'db': new_db
        })
    except Exception as e:
        elapsed = round((_time.time() - t0) * 1000, 1)
        return _json.dumps({'ok': False, 'error': str(e), 'elapsed': elapsed})
    finally:
        conn.close()
`;

interface QueryResult {
  columns: string[];
  rows: (string | number | null)[][];
  rowcount: number;
  elapsed: number;
}

interface HistoryEntry {
  sql: string;
  ok: boolean;
  elapsed: number;
}

const SAMPLE_QUERIES = [
  { label: "Все пользователи", sql: "SELECT * FROM users;" },
  { label: "Взрослые (≥18)", sql: "SELECT name, age FROM users\nWHERE age >= 18\nORDER BY age DESC;" },
  { label: "Электроника", sql: "SELECT name, price, stock\nFROM products\nWHERE category = 'Электроника'\nORDER BY price;" },
  { label: "Кол-во по городам", sql: "SELECT city, COUNT(*) as count\nFROM users\nGROUP BY city\nORDER BY count DESC;" },
  { label: "JOIN заказы", sql: "SELECT u.name, p.name as product, o.quantity\nFROM orders o\nJOIN users u ON o.user_id = u.id\nJOIN products p ON o.product_id = p.id;" },
  { label: "Сумма заказов", sql: "SELECT u.name, SUM(p.price * o.quantity) as total\nFROM orders o\nJOIN users u ON o.user_id = u.id\nJOIN products p ON o.product_id = p.id\nGROUP BY u.name\nORDER BY total DESC;" },
  { label: "Таблицы в БД", sql: "SELECT name FROM sqlite_master\nWHERE type='table';" },
];

const SQL_REFERENCE = [
  { title: "SELECT", body: "SELECT col1, col2 FROM table;\nSELECT * FROM table;" },
  { title: "WHERE", body: "SELECT * FROM users WHERE age >= 18;\nSELECT * FROM users WHERE city = 'Москва';" },
  { title: "ORDER BY", body: "SELECT * FROM users ORDER BY age DESC;\nSELECT * FROM users ORDER BY name ASC;" },
  { title: "LIMIT", body: "SELECT * FROM users LIMIT 5;\nSELECT * FROM users LIMIT 5 OFFSET 10;" },
  { title: "GROUP BY", body: "SELECT city, COUNT(*) FROM users GROUP BY city;" },
  { title: "HAVING", body: "SELECT city, COUNT(*) cnt FROM users\nGROUP BY city HAVING cnt > 1;" },
  { title: "JOIN", body: "SELECT u.name, o.quantity\nFROM orders o\nJOIN users u ON o.user_id = u.id;" },
  { title: "INSERT", body: "INSERT INTO users (name, age) VALUES ('Иван', 25);" },
  { title: "UPDATE", body: "UPDATE users SET age = 26 WHERE name = 'Иван';" },
  { title: "DELETE", body: "DELETE FROM users WHERE age < 18;" },
  { title: "IS NULL", body: "SELECT * FROM users WHERE email IS NULL;\nSELECT * FROM users WHERE email IS NOT NULL;" },
  { title: "LIKE", body: "SELECT * FROM users WHERE name LIKE 'А%';\nSELECT * FROM products WHERE name LIKE '%ноутбук%';" },
];

const SCHEMA = [
  { table: "users", cols: ["id", "name", "email", "age", "city"] },
  { table: "products", cols: ["id", "name", "price", "category", "stock"] },
  { table: "orders", cols: ["id", "user_id", "product_id", "quantity", "order_date"] },
];

type Tab = "editor" | "reference";

export function SqlPlayground({ onHome }: { onHome: () => void }) {
  const [sql, setSql] = useState("SELECT * FROM users;");
  const [tab, setTab] = useState<Tab>("editor");
  const [loadState, setLoadState] = useState<"idle" | "loading-py" | "loading-db" | "ready" | "running">("idle");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const pyRef = useRef<PyodideInterface | null>(null);
  const dbRef = useRef<number[] | null>(null);

  // Auto-initialize Pyodide + sample DB on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadState("loading-py");
        const py = await getPyodide();
        if (cancelled) return;
        await ensureSqlite(py);
        if (cancelled) return;
        setLoadState("loading-db");
        await py.runPythonAsync(`
import sqlite3 as _sq3, json as _j
_conn = _sq3.connect(':memory:')
_conn.executescript(${JSON.stringify(BOOTSTRAP_SQL)})
_conn.commit()
`);
        const dbBytes = py.runPython("list(_conn.serialize()); _conn.close()") as number[];
        if (cancelled) return;
        await py.runPythonAsync(SQL_RUNNER);
        pyRef.current = py;
        dbRef.current = Array.isArray(dbBytes) ? dbBytes : [];
        setLoadState("ready");
      } catch (e) {
        if (!cancelled) setError(`Ошибка загрузки: ${e instanceof Error ? e.message : String(e)}`);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const runQuery = useCallback(async () => {
    if (!pyRef.current || loadState !== "ready" || !sql.trim()) return;
    setLoadState("running");
    setResult(null);
    setError(null);
    const py = pyRef.current;
    try {
      const dbJson = JSON.stringify(dbRef.current ?? []);
      const raw = await py.runPythonAsync(
        `run_sql(${JSON.stringify(dbJson)}, ${JSON.stringify(sql)})`
      ) as string;
      const parsed = JSON.parse(raw);
      setElapsed(parsed.elapsed);
      if (parsed.ok) {
        setResult({ columns: parsed.columns, rows: parsed.rows, rowcount: parsed.rowcount, elapsed: parsed.elapsed });
        if (parsed.db && parsed.db.length > 0) dbRef.current = parsed.db;
        setHistory(prev => [{ sql, ok: true, elapsed: parsed.elapsed }, ...prev.slice(0, 29)]);
      } else {
        setError(parsed.error);
        setHistory(prev => [{ sql, ok: false, elapsed: parsed.elapsed }, ...prev.slice(0, 29)]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoadState("ready");
    }
  }, [sql, loadState]);

  const resetDb = useCallback(async () => {
    if (!pyRef.current) return;
    setLoadState("loading-db");
    setResult(null);
    setError(null);
    const py = pyRef.current;
    try {
      await py.runPythonAsync(`
import sqlite3 as _sq3
_conn = _sq3.connect(':memory:')
_conn.executescript(${JSON.stringify(BOOTSTRAP_SQL)})
_conn.commit()
`);
      const dbBytes = py.runPython("list(_conn.serialize()); _conn.close()") as number[];
      dbRef.current = Array.isArray(dbBytes) ? dbBytes : [];
    } catch { /* ignore */ }
    setLoadState("ready");
  }, []);

  const isLoading = loadState !== "ready" && loadState !== "idle";

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60 bg-card/60 flex-shrink-0">
        <button onClick={onHome} className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1.5">
          <ChevronRight className="h-4 w-4 rotate-180" />
          Назад
        </button>
        <div className="h-4 w-px bg-border" />
        <Database className="h-5 w-5 text-cyan-400" />
        <span className="font-semibold text-sm">SQL Playground</span>
        <span className="text-xs text-muted-foreground ml-1">• SQLite в браузере (Pyodide)</span>
        <div className="ml-auto flex items-center gap-2">
          {loadState === "loading-py" && (
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Загрузка Python…
            </span>
          )}
          {loadState === "loading-db" && (
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Создаю тестовую базу…
            </span>
          )}
          {loadState === "ready" && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Готово
            </span>
          )}
          <button
            onClick={() => setShowHistory(v => !v)}
            className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-colors ${showHistory ? "border-cyan-500/40 text-cyan-400 bg-cyan-500/10" : "border-border/50 text-muted-foreground hover:text-foreground"}`}
          >
            <History className="h-3.5 w-3.5" />
            История ({history.length})
          </button>
          <button
            onClick={resetDb}
            disabled={isLoading}
            className="text-xs flex items-center gap-1.5 px-2 py-1 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Сбросить БД
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left sidebar: schema + samples ── */}
        <div className="w-52 border-r border-border/60 flex flex-col bg-card/30 flex-shrink-0 overflow-y-auto">
          {/* Schema */}
          <div className="px-3 py-2 border-b border-border/40">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Структура БД</p>
            {SCHEMA.map(t => (
              <div key={t.table} className="mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 mb-1">
                  <Table2 className="h-3 w-3" />
                  {t.table}
                </div>
                <ul className="space-y-0.5">
                  {t.cols.map(c => (
                    <li key={c} className="text-[11px] text-muted-foreground pl-4 font-mono">{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Sample queries */}
          <div className="px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Примеры</p>
            <div className="space-y-1">
              {SAMPLE_QUERIES.map((q) => (
                <button
                  key={q.label}
                  onClick={() => setSql(q.sql)}
                  className="w-full text-left text-xs px-2 py-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main area ── */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-border/60 bg-card/20">
            {(["editor", "reference"] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${tab === t ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t === "editor" ? <Terminal className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                {t === "editor" ? "Редактор SQL" : "Справочник SQL"}
              </button>
            ))}
          </div>

          {tab === "editor" && (
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* SQL editor */}
              <div className="flex flex-col border-b border-border/60" style={{ minHeight: 180, maxHeight: 320 }}>
                <div className="flex items-center justify-between px-3 py-1.5 bg-card/40 border-b border-border/40">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">SQL Query</span>
                  <Button
                    size="sm"
                    onClick={runQuery}
                    disabled={isLoading || loadState === "idle" || !sql.trim()}
                    className="h-6 px-3 text-xs gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white border-0"
                  >
                    {loadState === "running" ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                    Выполнить
                  </Button>
                </div>
                <textarea
                  value={sql}
                  onChange={(e) => setSql(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  placeholder="SELECT * FROM users;"
                  className="flex-1 bg-[#0d1117] text-[#79c0ff] font-mono text-sm p-4 resize-none outline-none w-full"
                  style={{ tabSize: 2, minHeight: 140 }}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                      e.preventDefault();
                      runQuery();
                    }
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const ta = e.currentTarget;
                      const s = ta.selectionStart;
                      const nv = sql.slice(0, s) + "  " + sql.slice(ta.selectionEnd);
                      setSql(nv);
                      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 2; });
                    }
                  }}
                />
                <div className="flex items-center gap-3 px-3 py-1 bg-card/20 border-t border-border/40">
                  <span className="text-[10px] text-muted-foreground">Ctrl+Enter — выполнить</span>
                  {elapsed !== null && (
                    <span className="text-[10px] text-muted-foreground">• {elapsed}ms</span>
                  )}
                </div>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-auto p-4">
                {loadState === "loading-py" && (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                    <p className="text-sm">Загрузка Python (Pyodide) — первый раз до 10 сек…</p>
                    <p className="text-xs opacity-60">Потом из кэша — мгновенно</p>
                  </div>
                )}
                {loadState === "loading-db" && (
                  <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                    <p className="text-sm">Создаю тестовую базу данных…</p>
                  </div>
                )}
                {error && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                      <span className="text-sm font-semibold text-rose-400">Ошибка SQL</span>
                    </div>
                    <pre className="text-xs font-mono text-rose-300/80 whitespace-pre-wrap">{error}</pre>
                  </div>
                )}
                {result && !error && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>
                        {result.columns.length > 0
                          ? `${result.rows.length} строк, ${result.columns.length} колонок`
                          : `Затронуто строк: ${result.rowcount}`}
                      </span>
                      <span>• {result.elapsed}ms</span>
                    </div>
                    {result.columns.length > 0 && (
                      <div className="overflow-x-auto rounded-xl border border-border/60">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-border/60 bg-muted/30">
                              {result.columns.map((col) => (
                                <th key={col} className="px-3 py-2 text-left font-semibold text-cyan-400 font-mono whitespace-nowrap">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {result.rows.length === 0 && (
                              <tr>
                                <td colSpan={result.columns.length} className="px-3 py-4 text-center text-muted-foreground">
                                  Нет строк
                                </td>
                              </tr>
                            )}
                            {result.rows.map((row, i) => (
                              <tr key={i} className={`border-b border-border/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                                {row.map((cell, j) => (
                                  <td key={j} className="px-3 py-2 font-mono text-foreground/80 whitespace-nowrap">
                                    {cell === null
                                      ? <span className="text-muted-foreground italic">NULL</span>
                                      : String(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {result.columns.length === 0 && result.rowcount >= 0 && (
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
                        ✓ Запрос выполнен успешно. Строк изменено: {result.rowcount}
                      </div>
                    )}
                  </div>
                )}
                {loadState === "ready" && !result && !error && (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                    <Database className="h-10 w-10 text-cyan-400/40" />
                    <p className="text-sm">База готова! Нажми «Выполнить» или выбери пример слева</p>
                    <p className="text-xs opacity-60">Доступны таблицы: users, products, orders</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "reference" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <p className="text-xs text-muted-foreground mb-4">Справочник по основным SQL-командам. Примеры работают с таблицами <code className="font-mono bg-muted/50 px-1 rounded">users</code>, <code className="font-mono bg-muted/50 px-1 rounded">products</code>, <code className="font-mono bg-muted/50 px-1 rounded">orders</code>.</p>
              {SQL_REFERENCE.map((ref) => (
                <div key={ref.title} className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-muted/20">
                    <code className="text-sm font-mono font-bold text-cyan-400">{ref.title}</code>
                    <button
                      onClick={() => { setSql(ref.body); setTab("editor"); }}
                      className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Play className="h-2.5 w-2.5" />
                      В редактор
                    </button>
                  </div>
                  <pre className="px-4 py-3 text-xs font-mono text-emerald-300 overflow-x-auto">
                    {ref.body}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── History panel ── */}
        {showHistory && (
          <div className="w-64 border-l border-border/60 flex flex-col bg-card/30 flex-shrink-0">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/40">
              <span className="text-xs font-semibold">История запросов</span>
              <button onClick={() => setShowHistory(false)}>
                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {history.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">Ещё нет запросов</p>
              )}
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => setSql(h.sql)}
                  className="w-full text-left px-3 py-2.5 border-b border-border/30 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {h.ok
                      ? <CheckCircle2 className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                      : <AlertTriangle className="h-3 w-3 text-rose-400 flex-shrink-0" />}
                    <span className="text-[10px] text-muted-foreground">{h.elapsed}ms</span>
                  </div>
                  <pre className="text-[11px] font-mono text-muted-foreground truncate overflow-hidden">{h.sql.split("\n")[0]}</pre>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
