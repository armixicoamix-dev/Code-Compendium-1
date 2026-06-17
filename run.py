"""
╔══════════════════════════════════════════════════════════════╗
║           Code Mentor — Запуск проекта                       ║
╠══════════════════════════════════════════════════════════════╣
║  Использование:  python run.py                               ║
║  Требования:     Node.js 18+  (https://nodejs.org)           ║
╚══════════════════════════════════════════════════════════════╝
"""

import subprocess
import sys
import os
import platform
import time
import shutil
import signal
import webbrowser
import threading

# ── Цвета в терминале ─────────────────────────────────────────
WIN = platform.system() == "Windows"

def c(text, code):
    if WIN:
        return text
    return f"\033[{code}m{text}\033[0m"

def ok(msg):   print(c(f"  ✓  {msg}", "32"))
def info(msg): print(c(f"  →  {msg}", "36"))
def warn(msg): print(c(f"  !  {msg}", "33"))
def err(msg):  print(c(f"  ✗  {msg}", "31"))
def header(msg): print(c(f"\n{'─'*54}\n  {msg}\n{'─'*54}", "1;34"))


# ── Проверка Node.js ───────────────────────────────────────────
def check_node():
    header("Проверка Node.js")
    node = shutil.which("node")
    if not node:
        err("Node.js не найден!")
        print()
        print("  Скачай и установи Node.js (LTS) с сайта:")
        print(c("  https://nodejs.org/en/download", "4;36"))
        print()
        print("  После установки перезапусти этот скрипт.")
        sys.exit(1)

    result = subprocess.run(["node", "--version"], capture_output=True, text=True)
    version = result.stdout.strip()
    major = int(version.lstrip("v").split(".")[0])
    if major < 18:
        err(f"Node.js {version} слишком старый. Нужна версия 18+.")
        print("  Обнови Node.js: https://nodejs.org")
        sys.exit(1)
    ok(f"Node.js {version}")


# ── Установка / проверка pnpm ──────────────────────────────────
def ensure_pnpm():
    header("Проверка pnpm")
    if shutil.which("pnpm"):
        result = subprocess.run(["pnpm", "--version"], capture_output=True, text=True)
        ok(f"pnpm {result.stdout.strip()}")
        return

    warn("pnpm не найден — устанавливаю через npm...")
    ret = subprocess.run(
        ["npm", "install", "-g", "pnpm"],
        capture_output=False,
    ).returncode
    if ret != 0:
        err("Не удалось установить pnpm.")
        print("  Попробуй вручную: npm install -g pnpm")
        sys.exit(1)
    ok("pnpm установлен")


# ── Установка зависимостей ─────────────────────────────────────
def install_deps():
    header("Установка зависимостей")
    info("pnpm install  (первый раз может занять 1-2 минуты)")
    ret = subprocess.run(
        ["pnpm", "install", "--frozen-lockfile"],
        cwd=ROOT,
    ).returncode
    if ret != 0:
        warn("--frozen-lockfile не прошёл, пробую без флага...")
        ret = subprocess.run(["pnpm", "install"], cwd=ROOT).returncode
    if ret != 0:
        err("Ошибка установки зависимостей.")
        sys.exit(1)
    ok("Зависимости установлены")


# ── Запуск серверов ────────────────────────────────────────────
PROCS = []

def start_server(name, cmd, cwd, port, color_code):
    """Запускает сервер в подпроцессе и стримит его вывод с префиксом."""
    prefix = c(f"[{name}]", color_code)

    def _stream(proc):
        for line in iter(proc.stdout.readline, b""):
            try:
                print(f"{prefix} {line.decode('utf-8', errors='replace').rstrip()}")
            except Exception:
                pass

    proc = subprocess.Popen(
        cmd,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        shell=WIN,
    )
    PROCS.append(proc)
    thread = threading.Thread(target=_stream, args=(proc,), daemon=True)
    thread.start()
    return proc


def wait_for_port(port, timeout=60):
    """Ждём пока порт станет доступен (сервер поднялся)."""
    import socket
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=1):
                return True
        except OSError:
            time.sleep(0.5)
    return False


# ── Обработка Ctrl+C ──────────────────────────────────────────
def shutdown(sig=None, frame=None):
    print(c("\n\n  Останавливаю серверы...", "33"))
    for p in PROCS:
        try:
            if WIN:
                p.terminate()
            else:
                os.killpg(os.getpgid(p.pid), signal.SIGTERM)
        except Exception:
            try:
                p.terminate()
            except Exception:
                pass
    print(c("  Готово. До свидания!", "32"))
    sys.exit(0)


# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════

ROOT = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(ROOT, "artifacts", "code-mentor")
API_DIR      = os.path.join(ROOT, "artifacts", "api-server")

FRONTEND_PORT = 3000
API_PORT      = 5000

print(c("""
╔══════════════════════════════════════════════════════════════╗
║              Code Mentor  ·  Запуск проекта                  ║
╚══════════════════════════════════════════════════════════════╝
""", "1;34"))

signal.signal(signal.SIGINT, shutdown)
if not WIN:
    signal.signal(signal.SIGTERM, shutdown)

check_node()
ensure_pnpm()
install_deps()

header("Запуск серверов")

# Фронтенд (React + Vite)
info("Запускаю фронтенд (React + Vite)...")
start_server(
    name="WEB",
    cmd=["pnpm", "--filter", "@workspace/code-mentor", "run", "dev"],
    cwd=ROOT,
    port=FRONTEND_PORT,
    color_code="1;32",
)

# API-сервер (Express)
has_api = os.path.isdir(API_DIR)
if has_api:
    info("Запускаю API-сервер (Express)...")
    start_server(
        name="API",
        cmd=["pnpm", "--filter", "@workspace/api-server", "run", "dev"],
        cwd=ROOT,
        port=API_PORT,
        color_code="1;35",
    )

# Ждём пока фронтенд поднимется
info(f"Жду готовности фронтенда на порту {FRONTEND_PORT}...")
ready = wait_for_port(FRONTEND_PORT, timeout=90)

print()
if ready:
    url = f"http://localhost:{FRONTEND_PORT}"
    print(c(f"""
  ╔═══════════════════════════════════════════╗
  ║  ✓  Сайт запущен!                         ║
  ║                                           ║
  ║  Открывай в браузере:                     ║
  ║  {url:<43}║
  ║                                           ║
  ║  Нажми Ctrl+C чтобы остановить            ║
  ╚═══════════════════════════════════════════╝
""", "1;32"))
    # Открываем браузер автоматически
    time.sleep(1)
    webbrowser.open(url)
else:
    warn("Сервер не ответил за 90 секунд. Проверь вывод выше.")
    print(f"  Попробуй открыть вручную: http://localhost:{FRONTEND_PORT}")

print(c("  Серверы работают. Для остановки нажми Ctrl+C\n", "36"))

# Держим процесс живым
try:
    while True:
        # Проверяем что фронтенд ещё жив
        if PROCS and PROCS[0].poll() is not None:
            err("Фронтенд неожиданно завершился.")
            shutdown()
        time.sleep(2)
except KeyboardInterrupt:
    shutdown()
