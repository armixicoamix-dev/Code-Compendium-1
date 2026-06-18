#!/usr/bin/env python3
"""
Code Mentor — ULTRA FAST START
Служит предсобранный dist через Flask. Работает без Node.js.

Первый запуск: нужен собранный dist.
  Windows:  set BASE_PATH=/ && pnpm --filter @workspace/code-mentor run build
  Linux/Mac: BASE_PATH=/ pnpm --filter @workspace/code-mentor run build

Затем: python run.py
"""

import os
import sys
import platform
import webbrowser
from pathlib import Path

WIN = platform.system() == "Windows"

def c(text, code):
    return text if WIN else f"\033[{code}m{text}\033[0m"

def ok(msg):   print(c(f"  ✓  {msg}", "32"))
def info(msg): print(c(f"  →  {msg}", "36"))
def err(msg):  print(c(f"  ✗  {msg}", "31"))

# ── Пути ──────────────────────────────────────────────────────
if getattr(sys, "frozen", False):
    ROOT_DIR = Path(sys.executable).parent
else:
    ROOT_DIR = Path(__file__).resolve().parent

DIST_DIR = ROOT_DIR / "artifacts" / "code-mentor" / "dist" / "public"

# ── Проверяем наличие dist ────────────────────────────────────
if not DIST_DIR.exists():
    err("Папка dist не найдена!")
    print()
    print("  Сначала собери проект одной командой:")
    print()
    if WIN:
        print(c("  set BASE_PATH=/ && pnpm --filter @workspace/code-mentor run build", "1;33"))
    else:
        print(c("  BASE_PATH=/ pnpm --filter @workspace/code-mentor run build", "1;33"))
    print()
    print(f"  Ожидаемая папка: {DIST_DIR}")
    sys.exit(1)

ok(f"dist найден: {DIST_DIR}")

# ── Flask ─────────────────────────────────────────────────────
try:
    from flask import Flask, send_from_directory, send_file
except ImportError:
    info("Flask не найден — устанавливаю...")
    import subprocess
    ret = subprocess.run(
        [sys.executable, "-m", "pip", "install", "flask", "--quiet"],
        check=False,
    ).returncode
    if ret != 0:
        err("Не удалось установить Flask. Попробуй вручную: pip install flask")
        sys.exit(1)
    from flask import Flask, send_from_directory, send_file
    ok("Flask установлен")

# ── Приложение ────────────────────────────────────────────────
flask_app = Flask(__name__, static_folder=None)

@flask_app.after_request
def set_headers(response):
    # Обязательно для Pyodide SharedArrayBuffer (офлайн Python)
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
    # Без кэша — чтобы обновления dist сразу отображались
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

@flask_app.route("/", defaults={"path": ""})
@flask_app.route("/<path:path>")
def serve(path):
    # Если это реальный файл — отдаём его
    target = DIST_DIR / path if path else None
    if path and target and target.is_file():
        return send_from_directory(str(DIST_DIR), path)
    # Иначе — SPA: всегда возвращаем index.html
    return send_file(str(DIST_DIR / "index.html"))

# ── Запуск ────────────────────────────────────────────────────
PORT = int(os.environ.get("PORT", 3000))
url  = f"http://localhost:{PORT}"

print(c(f"""
  ╔═══════════════════════════════════════════╗
  ║         Code Mentor  ·  Быстрый старт    ║
  ╚═══════════════════════════════════════════╝
""", "1;34"))

info(f"Открываю браузер: {url}")
webbrowser.open(url)

print(c(f"  Сайт доступен на {url}", "1;32"))
print(c("  Нажми Ctrl+C чтобы остановить\n", "36"))

flask_app.run(
    host="127.0.0.1",
    port=PORT,
    debug=False,
    use_reloader=False,
    threaded=True,
)
