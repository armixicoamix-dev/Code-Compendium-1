import type { Round } from "@/data/curriculum";

// ─────────────────────────────────────────────────────────────────────────────
// Round 1 · PostgreSQL — Введение, psycopg2 и первые запросы
// ─────────────────────────────────────────────────────────────────────────────
const pg1: Round = {
  number: 1,
  title: "PostgreSQL · Введение, psycopg2 и первые запросы",
  level: "Средний",
  intro:
    "PostgreSQL — одна из лучших в мире реляционных баз данных. Бесплатная, надёжная, используется в Spotify, Instagram, GitHub, Notion и тысячах других продуктов.\n\n" +
    "**В этом раунде:**\n" +
    "• PostgreSQL vs SQLite — когда что использовать\n" +
    "• psycopg2 — Python-адаптер для PostgreSQL\n" +
    "• Подключение, cursor modes, первые запросы\n" +
    "• Типы данных PostgreSQL",
  lesson: {
    title: "PostgreSQL: введение и работа через psycopg2",
    summary:
      "Чем PostgreSQL лучше SQLite для продакшн; установка psycopg2; подключение и режимы курсора; типы данных; первые SELECT-запросы.",
    readingMinutes: 22,
    sections: [
      {
        heading: "PostgreSQL vs SQLite — выбор правильного инструмента",
        tagline: "SQLite для разработки и тестов; PostgreSQL для продакшн-приложений",
        body:
          "Оба — реляционные СУБД с поддержкой SQL, но для очень разных задач:\n\n" +
          "| Характеристика | SQLite | PostgreSQL |\n" +
          "|---------------|--------|------------|\n" +
          "| Архитектура | Встроена в приложение, файл .db | Отдельный сервер-процесс |\n" +
          "| Параллельные записи | Одна запись за раз | Тысячи параллельно |\n" +
          "| Типы данных | TEXT, INTEGER, REAL, BLOB | 40+ типов (UUID, JSONB, массивы…) |\n" +
          "| Размер БД | До нескольких ГБ | Терабайты |\n" +
          "| Установка | pip install нет, встроено | Отдельный сервер |\n" +
          "| Подходит для | Прототипы, тесты, мобильные | Веб-приложения, SaaS, API |\n\n" +
          "**Когда SQLite:** скрипты, прототипы, тесты, мобильные приложения, настольные программы.\n\n" +
          "**Когда PostgreSQL:** веб-сервер обрабатывает запросы от многих пользователей; нужны транзакции с гарантиями ACID; требуются сложные типы данных (JSON, массивы); приложение в production.\n\n" +
          "**Хорошая новость:** SQL-синтаксис почти одинаков. Переход с SQLite на PostgreSQL — это в основном изменение соединения и некоторых деталей синтаксиса.\n\n" +
          "**PostgreSQL в Python:**\n" +
          "- `psycopg2` — самый популярный адаптер, написан на C, очень быстрый\n" +
          "- `psycopg3` — новая версия с async поддержкой\n" +
          "- `asyncpg` — для asyncio-приложений\n" +
          "- `SQLAlchemy` — ORM, работает поверх psycopg2",
        keyTakeaways: [
          "SQLite — для прототипов и тестов; PostgreSQL — для продакшн-приложений.",
          "PostgreSQL поддерживает параллельные соединения — SQLite нет.",
          "SQL-синтаксис похож; основное отличие — подключение и типы данных.",
          "psycopg2 — стандартный Python-адаптер для PostgreSQL.",
        ],
      },
      {
        heading: "psycopg2 — подключение и базовый API",
        tagline: "psycopg2 — это мост между Python и PostgreSQL; синтаксис похож на sqlite3",
        body:
          "**Установка:**\n" +
          "```bash\npip install psycopg2-binary  # для разработки (без C компиляции)\npip install psycopg2          # для продакшн\n```\n\n" +
          "**Подключение:**\n" +
          "```python\nimport psycopg2\n\nconn = psycopg2.connect(\n    host='localhost',\n    port=5432,\n    database='mydb',\n    user='postgres',\n    password='yourpassword'\n)\n\n# ИЛИ через строку подключения (DSN):\nconn = psycopg2.connect('postgresql://postgres:password@localhost:5432/mydb')\n```\n\n" +
          "**Ключевые отличия от sqlite3:**\n" +
          "- Плейсхолдер — `%s` (не `?` как в SQLite)\n" +
          "- Нет `AUTOINCREMENT` — вместо него `SERIAL` или `GENERATED ALWAYS AS IDENTITY`\n" +
          "- `conn.autocommit = True` — режим без явных транзакций\n\n" +
          "**Создание курсора:**\n" +
          "```python\ncursor = conn.cursor()                              # обычный курсор (кортежи)\ncursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)  # словари\ncursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)  # обычные dict\n```\n\n" +
          "**Ключевые методы (те же, что sqlite3):**\n" +
          "- `cursor.execute(sql, params)` — выполнить запрос\n" +
          "- `cursor.executemany(sql, list)` — много строк\n" +
          "- `cursor.fetchone()`, `cursor.fetchall()`, `cursor.fetchmany(n)`\n" +
          "- `cursor.rowcount` — затронутые строки\n" +
          "- `conn.commit()`, `conn.rollback()`, `conn.close()`",
        code:
          "import psycopg2\nimport psycopg2.extras\n\n# Подключение (замени параметры на свои)\nconn = psycopg2.connect(\n    host='localhost',\n    database='testdb',\n    user='postgres',\n    password='secret'\n)\n\n# Курсор с именованными столбцами (DictCursor)\ncursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)\n\n# Создать таблицу\ncursor.execute('''\n  CREATE TABLE IF NOT EXISTS users (\n    id    SERIAL PRIMARY KEY,     -- автоинкремент в PostgreSQL\n    name  VARCHAR(100) NOT NULL,\n    email VARCHAR(200) UNIQUE,\n    age   INTEGER,\n    created_at TIMESTAMP DEFAULT NOW()\n  )\n''')\nconn.commit()\n\n# Вставить запись — %s вместо ?\ncursor.execute(\n    'INSERT INTO users (name, email, age) VALUES (%s, %s, %s) RETURNING id',\n    ('Алиса', 'alice@mail.ru', 25)\n)\nnew_id = cursor.fetchone()['id']  # RETURNING id возвращает вставленный id\nconn.commit()\n\n# Прочитать\ncursor.execute('SELECT * FROM users WHERE id = %s', (new_id,))\nrow = cursor.fetchone()\nprint(dict(row))  # {'id': 1, 'name': 'Алиса', ...}\n\ncursor.close()\nconn.close()",
        keyTakeaways: [
          "psycopg2 использует %s как плейсхолдер (не ? как в sqlite3).",
          "DictCursor / RealDictCursor для именованных столбцов вместо row_factory.",
          "RETURNING id после INSERT — получить ID без lastrowid.",
          "SERIAL — автоинкремент в PostgreSQL (аналог INTEGER PRIMARY KEY AUTOINCREMENT в SQLite).",
        ],
        pitfalls: [
          "psycopg2.connect() может бросить OperationalError если сервер недоступен — всегда в try/except.",
          "Плейсхолдер %s, а не %d или %f — psycopg2 сам определяет тип.",
        ],
      },
      {
        heading: "Типы данных PostgreSQL",
        tagline: "PostgreSQL поддерживает 40+ типов данных — намного богаче SQLite",
        body:
          "PostgreSQL — строго типизированная СУБД. Это означает, что нельзя сохранить строку в числовой столбец без явного приведения типа.\n\n" +
          "**Основные типы:**\n\n" +
          "| Тип | Описание | Пример |\n" +
          "|-----|----------|--------|\n" +
          "| `INTEGER` | Целое число (-2 млрд … +2 млрд) | 42 |\n" +
          "| `BIGINT` | Большое целое (-9×10^18 … +9×10^18) | 9000000000 |\n" +
          "| `SERIAL` | Автоинкремент (INTEGER + sequence) | id SERIAL PRIMARY KEY |\n" +
          "| `REAL` / `FLOAT` | Число с плавающей точкой | 3.14 |\n" +
          "| `NUMERIC(p,s)` | Точное число | 123.45 (деньги) |\n" +
          "| `VARCHAR(n)` | Строка до n символов | 'Алиса' |\n" +
          "| `TEXT` | Строка неограниченной длины | Текст поста |\n" +
          "| `BOOLEAN` | Истина/ложь | TRUE, FALSE |\n" +
          "| `DATE` | Дата | '2024-01-15' |\n" +
          "| `TIMESTAMP` | Дата и время | '2024-01-15 14:30:00' |\n" +
          "| `TIMESTAMPTZ` | Дата и время с часовым поясом | '2024-01-15 14:30+03' |\n" +
          "| `UUID` | Уникальный идентификатор | '550e8400-...' |\n" +
          "| `JSONB` | JSON в бинарном формате | {\"key\": \"value\"} |\n" +
          "| `INTEGER[]` | Массив целых чисел | ARRAY[1, 2, 3] |\n\n" +
          "**NUMERIC(p, s)** vs **FLOAT:** для денежных значений всегда используй `NUMERIC(15, 2)` — FLOAT теряет точность при арифметике.\n\n" +
          "**TIMESTAMPTZ** vs **TIMESTAMP:** `TIMESTAMPTZ` хранит время с учётом часового пояса — рекомендуется для большинства приложений.\n\n" +
          "**UUID** — универсальный идентификатор, не угадываемый, безопасен как публичный ID.",
        code:
          "-- Пример таблицы с разными типами данных\nCREATE TABLE products (\n  id          SERIAL PRIMARY KEY,\n  name        VARCHAR(200) NOT NULL,\n  description TEXT,\n  price       NUMERIC(10, 2) NOT NULL,    -- точные деньги\n  discount    REAL DEFAULT 0.0,\n  in_stock    BOOLEAN DEFAULT TRUE,\n  tags        TEXT[],                      -- массив строк\n  metadata    JSONB,                       -- произвольный JSON\n  created_at  TIMESTAMPTZ DEFAULT NOW(),   -- с часовым поясом\n  uuid_id     UUID DEFAULT gen_random_uuid()\n);\n\n-- Вставка с разными типами\nINSERT INTO products (name, price, in_stock, tags, metadata)\nVALUES (\n  'Ноутбук',\n  75000.00,\n  TRUE,\n  ARRAY['электроника', 'компьютеры'],\n  '{\"brand\": \"Lenovo\", \"warranty_years\": 2}'\n);",
        keyTakeaways: [
          "NUMERIC(15,2) для денег — FLOAT теряет точность.",
          "TIMESTAMPTZ вместо TIMESTAMP — всегда храни время с часовым поясом.",
          "TEXT[] — массивы строк прямо в столбце без дополнительной таблицы.",
          "JSONB — индексируемый JSON; лучше JSON для хранения и поиска.",
        ],
        pitfalls: [
          "FLOAT/REAL для денег — 0.1 + 0.2 = 0.30000000000000004. Используй NUMERIC.",
          "VARCHAR(n) в PostgreSQL не даёт прироста скорости по сравнению с TEXT — используй TEXT если нет жёсткого ограничения.",
        ],
      },
      {
        heading: "Работа с переменными окружения и connection pooling",
        tagline: "Никогда не хардкодь пароль в коде — используй переменные окружения",
        body:
          "**Конфигурация через переменные окружения** — стандарт для безопасного хранения паролей к БД:\n" +
          "```python\nimport os\nimport psycopg2\n\nconn = psycopg2.connect(\n    host=os.environ.get('DB_HOST', 'localhost'),\n    port=int(os.environ.get('DB_PORT', 5432)),\n    database=os.environ.get('DB_NAME', 'mydb'),\n    user=os.environ.get('DB_USER', 'postgres'),\n    password=os.environ.get('DB_PASSWORD', '')\n)\n```\n\n" +
          "Или через `DATABASE_URL`:\n" +
          "```python\nconn = psycopg2.connect(os.environ['DATABASE_URL'])\n```\n\n" +
          "**python-dotenv** — загрузить `.env` файл локально:\n" +
          "```bash\npip install python-dotenv\n```\n" +
          "```python\nfrom dotenv import load_dotenv\nload_dotenv()  # читает .env файл\nconn = psycopg2.connect(os.environ['DATABASE_URL'])\n```\n\n" +
          "**Connection Pooling** — при веб-приложении не создавай новое соединение на каждый запрос. Используй пул:\n" +
          "```python\nfrom psycopg2 import pool\n\n# Пул от 2 до 10 соединений\ndb_pool = pool.ThreadedConnectionPool(\n    minconn=2,\n    maxconn=10,\n    dsn=os.environ['DATABASE_URL']\n)\n\n# Взять соединение из пула\nconn = db_pool.getconn()\ntry:\n    # использование\nfinally:\n    db_pool.putconn(conn)  # вернуть в пул\n```",
        code:
          "import os\nimport psycopg2\nimport psycopg2.extras\nfrom contextlib import contextmanager\n\n# Читаем конфиг из переменных окружения\nDB_URL = os.environ.get('DATABASE_URL', 'postgresql://postgres:secret@localhost/testdb')\n\n@contextmanager\ndef get_cursor(dict_cursor=True):\n    \"\"\"Context manager: открывает соединение, commit/rollback, закрывает.\"\"\"\n    conn = psycopg2.connect(DB_URL)\n    factory = psycopg2.extras.RealDictCursor if dict_cursor else None\n    cursor = conn.cursor(cursor_factory=factory)\n    try:\n        yield cursor\n        conn.commit()\n    except Exception:\n        conn.rollback()\n        raise\n    finally:\n        cursor.close()\n        conn.close()\n\n# Использование\nwith get_cursor() as cur:\n    cur.execute('SELECT * FROM users WHERE age > %s', (18,))\n    users = cur.fetchall()\n    for user in users:\n        print(user['name'])",
        keyTakeaways: [
          "Пароль к БД — только через переменные окружения, никогда в коде.",
          "python-dotenv для локального .env файла; в продакшн — настоящие env vars.",
          "Connection pool — переиспользуй соединения вместо создания новых.",
          "Context manager — лучший паттерн для управления соединением.",
        ],
        pitfalls: [
          "Не коммить .env файл в git — добавь в .gitignore.",
          "Не создавай новое соединение на каждый HTTP-запрос в веб-приложении — это очень медленно.",
        ],
      },
    ],
  },
  fills: [
    {
      type: "fill",
      id: "pg1-f1",
      title: "Плейсхолдер в psycopg2",
      description: "Выполни параметризованный запрос с правильным плейсхолдером psycopg2.",
      language: "python",
      code:
        "# psycopg2 использует другой плейсхолдер, чем sqlite3!\nimport psycopg2\n\n# Демонстрируем синтаксис (без реального подключения)\n# В psycopg2 параметры передаются через {{0}} (не ? как в sqlite3)\nquery = 'SELECT * FROM users WHERE name = {{0}} AND age > {{0}}'\nprint(f'Правильный запрос: {query}')\nprint('В sqlite3 используется ?, в psycopg2 используется', '{{0}}')",
      answers: [["%s", "% s"]],
      hints: ["В psycopg2 плейсхолдер — символ процента с буквой s"],
    },
    {
      type: "fill",
      id: "pg1-f2",
      title: "SERIAL — автоинкремент в PostgreSQL",
      description: "Как правильно объявить автоинкрементный первичный ключ в PostgreSQL?",
      language: "python",
      code:
        "# В SQLite: id INTEGER PRIMARY KEY AUTOINCREMENT\n# В PostgreSQL используй другое ключевое слово:\n\ncreate_sql = 'CREATE TABLE users (id {{0}} PRIMARY KEY, name TEXT)'\nprint('PostgreSQL автоинкремент:', create_sql)\n# Результат: CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT)",
      answers: [["SERIAL", "serial", "SERIAL ", "BIGSERIAL", "bigserial"]],
      hints: ["В PostgreSQL автоинкремент — ключевое слово SERIAL"],
    },
  ],
  questions: [
    {
      type: "question",
      id: "pg1-q1",
      title: "psycopg2 vs sqlite3 плейсхолдер",
      question: "Какой плейсхолдер для параметров использует psycopg2 (в отличие от ? в sqlite3)?",
      answers: [
        "%s",
        "процент s",
        "% s",
        "%s плейсхолдер",
        "знак процента s",
        "percent s",
        "format %s",
      ],
      hint: "Это строковый плейсхолдер в стиле Python, но для SQL",
      explanation: "psycopg2 использует %s как плейсхолдер для всех типов данных (числа, строки, даты). Пример: cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,)). В sqlite3 используется ? вместо %s.",
    },
    {
      type: "question",
      id: "pg1-q2",
      title: "SERIAL vs AUTOINCREMENT",
      question: "Как объявить автоинкрементный ID в PostgreSQL?",
      answers: [
        "SERIAL PRIMARY KEY",
        "SERIAL",
        "id SERIAL PRIMARY KEY",
        "serial primary key",
        "GENERATED ALWAYS AS IDENTITY",
        "BIGSERIAL",
        "serial",
      ],
      hint: "В PostgreSQL нет AUTOINCREMENT — используется другое слово",
      explanation: "В PostgreSQL для автоинкремента используется SERIAL (создаёт sequence автоматически). Полная запись: id SERIAL PRIMARY KEY. Современная альтернатива: id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY.",
    },
    {
      type: "question",
      id: "pg1-q3",
      title: "Точный тип для денег",
      question: "Какой тип данных использовать в PostgreSQL для хранения денежных сумм?",
      answers: [
        "NUMERIC",
        "numeric",
        "DECIMAL",
        "decimal",
        "NUMERIC(15,2)",
        "numeric(p,s)",
        "NUMERIC или DECIMAL",
        "точный числовой тип",
      ],
      hint: "FLOAT теряет точность при арифметике — нужен точный тип",
      explanation: "NUMERIC(p, s) или DECIMAL — точный числовой тип без потерь при арифметике. Для денег: NUMERIC(15, 2). FLOAT/REAL теряют точность из-за представления с плавающей точкой — 0.1+0.2 ≠ 0.3.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "pg1-w1",
      title: "Написать connection helper (sqlite3 как симуляция)",
      task:
        "Напиши Python-модуль `db.py` с:\n" +
        "1. Context manager `get_cursor()` — открывает cursor, делает commit при успехе, rollback при ошибке\n" +
        "2. Функцией `execute_query(sql, params=None)` — выполняет запрос и возвращает fetchall()\n" +
        "3. Продемонстрируй: создай таблицу users, вставь 2 записи, прочитай их через get_cursor.\n\n" +
        "📌 Используем sqlite3 (встроен в Python). В реальном проекте тот же паттерн работает с psycopg2 — меняется только строка подключения и `%s` вместо `?`.",
      hints: [
        "import sqlite3; from contextlib import contextmanager",
        "@contextmanager\ndef get_cursor(db=':memory:'):",
        "conn = sqlite3.connect(db); conn.row_factory = sqlite3.Row",
        "try: yield conn.cursor(); conn.commit() except: conn.rollback(); raise\nfinally: conn.close()",
        "execute_query: if params: cur.execute(sql, params) else: cur.execute(sql); return cur.fetchall()",
      ],
      required: ["sqlite3", "contextmanager", "commit", "rollback", "fetchall"],
      minLines: 25,
      language: "python",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 2 · PostgreSQL — DDL: создание таблиц и ограничения
// ─────────────────────────────────────────────────────────────────────────────
const pg2: Round = {
  number: 2,
  title: "PostgreSQL · DDL — таблицы, ограничения и ALTER TABLE",
  level: "Средний",
  intro:
    "DDL (Data Definition Language) — команды для управления СТРУКТУРОЙ базы данных: создание, изменение, удаление таблиц.\n\n" +
    "**В этом раунде:**\n" +
    "• CREATE TABLE с полным набором ограничений\n" +
    "• Ограничения: NOT NULL, UNIQUE, CHECK, DEFAULT\n" +
    "• ALTER TABLE — изменить структуру без пересоздания\n" +
    "• Каскадное удаление и обновление",
  lesson: {
    title: "DDL в PostgreSQL: создание, изменение и удаление структур",
    summary:
      "CREATE TABLE с ограничениями; изменение схемы через ALTER TABLE; каскадные действия; удаление объектов.",
    readingMinutes: 20,
    sections: [
      {
        heading: "CREATE TABLE с ограничениями",
        tagline: "Ограничения — правила корректности данных на уровне базы, не приложения",
        body:
          "**Ограничения (constraints)** — правила, которые база данных применяет автоматически при INSERT и UPDATE. Они гарантируют целостность данных даже если приложение написано неправильно.\n\n" +
          "**Основные ограничения:**\n" +
          "- `NOT NULL` — поле обязательно к заполнению\n" +
          "- `UNIQUE` — значение должно быть уникальным в таблице\n" +
          "- `PRIMARY KEY` — уникальный NOT NULL идентификатор (может быть составным)\n" +
          "- `FOREIGN KEY ... REFERENCES` — ссылочная целостность\n" +
          "- `CHECK (условие)` — произвольное условие на значение\n" +
          "- `DEFAULT значение` — значение по умолчанию если не указано\n\n" +
          "```sql\nCREATE TABLE employees (\n  id          SERIAL PRIMARY KEY,\n  name        VARCHAR(100) NOT NULL,\n  email       VARCHAR(200) UNIQUE NOT NULL,\n  salary      NUMERIC(12, 2) CHECK (salary > 0),\n  department  VARCHAR(50) DEFAULT 'Без отдела',\n  hire_date   DATE DEFAULT CURRENT_DATE,\n  active      BOOLEAN NOT NULL DEFAULT TRUE\n);\n```\n\n" +
          "**Именованные ограничения** (лучше для диагностики ошибок):\n" +
          "```sql\nCREATE TABLE orders (\n  id         SERIAL PRIMARY KEY,\n  amount     NUMERIC(12,2),\n  status     TEXT,\n  CONSTRAINT orders_amount_positive CHECK (amount > 0),\n  CONSTRAINT orders_status_valid    CHECK (status IN ('new','paid','cancelled'))\n);\n```\n" +
          "Когда ограничение нарушается — psycopg2 бросает `IntegrityError` с именем нарушенного ограничения.",
        code:
          "-- Полноценная таблица с ограничениями\nCREATE TABLE users (\n  id            SERIAL PRIMARY KEY,\n  username      VARCHAR(50)  UNIQUE NOT NULL,\n  email         VARCHAR(200) UNIQUE NOT NULL,\n  password_hash TEXT         NOT NULL,\n  full_name     VARCHAR(200),\n  age           INTEGER      CHECK (age >= 0 AND age <= 150),\n  role          TEXT         NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin','moderator')),\n  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,\n  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),\n  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()\n);\n\n-- Таблица постов со связью\nCREATE TABLE posts (\n  id         SERIAL PRIMARY KEY,\n  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,\n  title      VARCHAR(500) NOT NULL,\n  body       TEXT,\n  published  BOOLEAN DEFAULT FALSE,\n  views      INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0),\n  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);",
        keyTakeaways: [
          "Ограничения гарантируют данные на уровне БД — не зависят от логики приложения.",
          "CHECK (условие) — произвольная проверка значения столбца.",
          "DEFAULT NOW() — автоматически вставляет текущее время.",
          "Именованные ограничения (CONSTRAINT name CHECK...) лучше для диагностики.",
        ],
        pitfalls: [
          "CHECK IN ('val1','val2') — лучше, чем ENUM для изменяемых списков значений.",
          "NOT NULL + DEFAULT: столбец необязателен при вставке (есть дефолт), но в таблице всегда заполнен.",
        ],
      },
      {
        heading: "FOREIGN KEY с каскадными действиями",
        tagline: "ON DELETE CASCADE — удали родителя, дочерние записи удалятся автоматически",
        body:
          "Когда удаляешь пользователя, что должно произойти с его постами, заказами, комментариями? PostgreSQL поддерживает несколько стратегий:\n\n" +
          "```sql\nCREATE TABLE posts (\n  id      SERIAL PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE\n  --                                    ↑ удалить посты при удалении пользователя\n);\n```\n\n" +
          "**Варианты ON DELETE:**\n" +
          "- `RESTRICT` (по умолчанию) — запретить удаление пользователя если есть посты\n" +
          "- `CASCADE` — автоматически удалить все посты при удалении пользователя\n" +
          "- `SET NULL` — установить user_id = NULL в постах (поле должно быть nullable)\n" +
          "- `SET DEFAULT` — установить значение по умолчанию\n" +
          "- `NO ACTION` — как RESTRICT, но проверяется в конце транзакции\n\n" +
          "**ON UPDATE CASCADE** — обновить внешний ключ при изменении первичного:\n" +
          "```sql\nFOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE\n```\n\n" +
          "**Когда использовать:**\n" +
          "- `CASCADE` — для зависимых данных (посты пользователя, строки заказа)\n" +
          "- `SET NULL` — для опциональных связей (автор документа может быть анонимен)\n" +
          "- `RESTRICT` — когда удаление нежелательно (нельзя удалить город если есть пользователи)\n\n" +
          "**DEFERRABLE** ограничения — проверяются в конце транзакции, а не при каждом запросе. Нужно для вставки взаимосвязанных записей.",
        code:
          "-- ON DELETE CASCADE: удали пользователя — удалятся его посты и комментарии\nCREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL);\n\nCREATE TABLE posts (\n  id      SERIAL PRIMARY KEY,\n  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,\n  title   TEXT NOT NULL\n);\n\nCREATE TABLE comments (\n  id      SERIAL PRIMARY KEY,\n  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,\n  text    TEXT NOT NULL\n);\n\n-- Теперь при удалении пользователя:\n-- 1. Удалятся все его посты (CASCADE)\n-- 2. Удалятся все комментарии к этим постам (CASCADE)\nDELETE FROM users WHERE id = 1;\n-- ^ одна команда удаляет пользователя + всё его содержимое",
        keyTakeaways: [
          "ON DELETE CASCADE — дочерние записи удаляются вместе с родительскими.",
          "ON DELETE SET NULL — ставит NULL в FK при удалении родителя.",
          "ON DELETE RESTRICT — запрещает удаление если есть дочерние записи.",
          "Каскады работают рекурсивно: удаление пользователя → посты → комментарии.",
        ],
        pitfalls: [
          "CASCADE без обдумывания может удалить много данных неожиданно — используй с умом.",
          "Нет ON DELETE в объявлении FK — по умолчанию RESTRICT (нельзя удалить родителя).",
        ],
      },
      {
        heading: "ALTER TABLE — изменить структуру без пересоздания",
        tagline: "ALTER TABLE позволяет добавлять столбцы и ограничения в существующую таблицу",
        body:
          "**ALTER TABLE** — изменить уже существующую таблицу. Не нужно пересоздавать с нуля.\n\n" +
          "**Добавить столбец:**\n" +
          "```sql\nALTER TABLE users ADD COLUMN phone VARCHAR(20);\nALTER TABLE users ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();\n```\n\n" +
          "**Удалить столбец:**\n" +
          "```sql\nALTER TABLE users DROP COLUMN phone;\n-- Если на столбец есть зависимости:\nALTER TABLE users DROP COLUMN phone CASCADE;\n```\n\n" +
          "**Изменить тип столбца:**\n" +
          "```sql\nALTER TABLE users ALTER COLUMN age TYPE BIGINT;\n```\n\n" +
          "**Добавить/удалить ограничение:**\n" +
          "```sql\nALTER TABLE users ADD CONSTRAINT users_age_check CHECK (age >= 0);\nALTER TABLE users DROP CONSTRAINT users_age_check;\n\nALTER TABLE users ADD UNIQUE (email);\nALTER TABLE users ALTER COLUMN name SET NOT NULL;\nALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';\n```\n\n" +
          "**Переименование:**\n" +
          "```sql\nALTER TABLE users RENAME COLUMN name TO full_name;\nALTER TABLE users RENAME TO app_users;\n```\n\n" +
          "**В PostgreSQL ALTER TABLE блокирует таблицу** на время выполнения. Добавление столбца с DEFAULT требует переписать все строки — на большой таблице это медленно. Для безопасных миграций используй `ADD COLUMN col TYPE DEFAULT NULL` + отдельное UPDATE.",
        code:
          "-- Эволюция схемы через ALTER TABLE\n\n-- 1. Начальная версия\nCREATE TABLE users (\n  id   SERIAL PRIMARY KEY,\n  name TEXT NOT NULL,\n  age  INTEGER\n);\n\n-- 2. Добавить email (следующая версия)\nALTER TABLE users ADD COLUMN email VARCHAR(200);\n\n-- 3. Сделать email уникальным\nALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);\n\n-- 4. Добавить created_at с дефолтом\nALTER TABLE users ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();\n\n-- 5. Переименовать name в full_name\nALTER TABLE users RENAME COLUMN name TO full_name;\n\n-- 6. Проверить итоговую структуру\n\\d users  -- в psql",
        keyTakeaways: [
          "ALTER TABLE ADD COLUMN — добавить новый столбец (со старыми строками NOT NULL + DEFAULT).",
          "ALTER TABLE RENAME COLUMN — безопасное переименование.",
          "DROP COLUMN CASCADE — удалить столбец вместе со всеми зависимостями.",
          "Схема должна эволюционировать через ALTER TABLE, а не пересоздание таблиц с данными.",
        ],
        pitfalls: [
          "ALTER TABLE ADD COLUMN с NOT NULL без DEFAULT на большой таблице — ошибка, нельзя заполнить старые строки.",
          "DROP COLUMN без CASCADE — ошибка если на столбец есть VIEW или другие зависимости.",
        ],
      },
    ],
  },
  fills: [
    {
      type: "fill",
      id: "pg2-f1",
      title: "CHECK ограничение",
      description: "Добавь CHECK ограничение что salary должен быть больше 0.",
      language: "python",
      code:
        "sql = '''\n  CREATE TABLE employees (\n    id     SERIAL PRIMARY KEY,\n    name   TEXT NOT NULL,\n    salary NUMERIC(12,2) {{0}} ({{1}} > 0)\n  )\n'''\nprint(sql)",
      answers: [["CHECK", "check"], ["salary", "salary "]],
      hints: [
        "Ключевое слово для проверки значения — CHECK",
        "Условие проверяет сам столбец salary",
      ],
    },
    {
      type: "fill",
      id: "pg2-f2",
      title: "ON DELETE CASCADE",
      description: "Объяви FOREIGN KEY с каскадным удалением (ON DELETE CASCADE).",
      language: "python",
      code:
        "sql = '''\n  CREATE TABLE posts (\n    id      SERIAL PRIMARY KEY,\n    user_id INTEGER {{0}} users(id) {{1}} CASCADE,\n    title   TEXT\n  )\n'''\nprint(sql)",
      answers: [
        ["REFERENCES", "references", "NOT NULL REFERENCES"],
        ["ON DELETE", "on delete"],
      ],
      hints: [
        "Ключевое слово для внешнего ключа — REFERENCES",
        "Каскадное удаление — ON DELETE CASCADE",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "pg2-q1",
      title: "NOT NULL vs DEFAULT",
      question: "Если столбец объявлен с DEFAULT 'user', нужно ли его указывать при INSERT?",
      answers: [
        "нет",
        "необязательно",
        "не нужно",
        "можно не указывать",
        "нет, будет использован дефолт",
        "default подставится автоматически",
        "no",
      ],
      hint: "DEFAULT означает, что база сама подставит значение если не указано",
      explanation: "Нет. Если столбец имеет DEFAULT, при INSERT его можно не указывать — база автоматически подставит значение по умолчанию. Если же столбец NOT NULL без DEFAULT — придётся указать значение явно.",
    },
    {
      type: "question",
      id: "pg2-q2",
      title: "ON DELETE CASCADE",
      question: "Что произойдёт с постами пользователя если удалить его запись с ON DELETE CASCADE на user_id?",
      answers: [
        "посты удалятся автоматически",
        "каскадное удаление постов",
        "posts будут удалены",
        "все посты пользователя удалятся",
        "дочерние записи удалятся",
        "cascade удалит посты",
        "posts deleted automatically",
      ],
      hint: "CASCADE = цепная реакция удаления",
      explanation: "ON DELETE CASCADE означает: при удалении родительской записи (пользователя) автоматически удаляются все связанные дочерние записи (посты). Это рекурсивно — если у постов есть комментарии с CASCADE, удалятся и они.",
    },
    {
      type: "question",
      id: "pg2-q3",
      title: "ALTER TABLE vs CREATE TABLE",
      question: "Как добавить новый столбец email в существующую таблицу users?",
      answers: [
        "ALTER TABLE users ADD COLUMN email TEXT",
        "ALTER TABLE users ADD COLUMN",
        "alter table add column",
        "ALTER TABLE ADD COLUMN email",
        "через alter table",
        "ADD COLUMN",
      ],
      hint: "Не нужно пересоздавать таблицу — есть команда изменения структуры",
      explanation: "ALTER TABLE users ADD COLUMN email VARCHAR(200); — добавляет новый столбец в существующую таблицу без потери данных. Существующие строки получат значение NULL в новом столбце (если нет DEFAULT).",
    },
  ],
  writes: [
    {
      type: "write",
      id: "pg2-w1",
      title: "Схема интернет-магазина",
      task:
        "Напиши SQL для создания схемы интернет-магазина:\n\n" +
        "Таблицы:\n" +
        "- `categories` (id, name UNIQUE, description)\n" +
        "- `products` (id, category_id FK, name, price CHECK >0, stock CHECK >=0, active)\n" +
        "- `customers` (id, email UNIQUE, full_name, created_at)\n" +
        "- `orders` (id, customer_id FK CASCADE, status CHECK, total, created_at)\n" +
        "- `order_items` (id, order_id FK CASCADE, product_id FK RESTRICT, quantity, price)\n\n" +
        "Все цены — NUMERIC(12,2). Добавь DEFAULT для status, active, created_at.",
      hints: [
        "id SERIAL PRIMARY KEY для каждой таблицы",
        "price NUMERIC(12,2) NOT NULL CHECK (price > 0)",
        "status TEXT DEFAULT 'new' CHECK (status IN ('new','paid','shipped','done'))",
        "REFERENCES customers(id) ON DELETE CASCADE",
        "REFERENCES products(id) ON DELETE RESTRICT",
      ],
      required: ["SERIAL", "CHECK", "REFERENCES", "NOT NULL", "DEFAULT", "CASCADE"],
      minLines: 25,
      language: "python",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 3 · PostgreSQL — Продвинутые запросы: подзапросы и CTE
// ─────────────────────────────────────────────────────────────────────────────
const pg3: Round = {
  number: 3,
  title: "PostgreSQL · Подзапросы, CTE и CASE WHEN",
  level: "Средний",
  intro:
    "Когда простого SELECT не хватает — используй подзапросы и CTE (Common Table Expressions). Это мощные инструменты для сложной аналитики.\n\n" +
    "**В этом раунде:**\n" +
    "• Подзапросы (subqueries) в WHERE и FROM\n" +
    "• WITH ... AS — CTE для читаемых запросов\n" +
    "• CASE WHEN — условная логика в SQL\n" +
    "• COALESCE, NULLIF — работа с NULL",
  lesson: {
    title: "Подзапросы, CTE и условная логика",
    summary:
      "Подзапросы в WHERE/FROM; CTE (WITH) для разбивки сложных запросов; CASE WHEN для условной логики; COALESCE/NULLIF для NULL.",
    readingMinutes: 22,
    sections: [
      {
        heading: "Подзапросы (Subqueries)",
        tagline: "Запрос внутри запроса — результат одного SELECT используется в другом",
        body:
          "**Подзапрос (subquery)** — это SELECT-запрос вложенный в другой запрос. Результат внутреннего запроса используется внешним.\n\n" +
          "**Подзапрос в WHERE:**\n" +
          "```sql\n-- Пользователи которые делали заказы на сумму > средней\nSELECT name FROM users\nWHERE id IN (\n  SELECT user_id FROM orders\n  WHERE amount > (SELECT AVG(amount) FROM orders)\n);\n```\n\n" +
          "**Подзапрос в FROM (derived table / inline view):**\n" +
          "```sql\nSELECT u.name, stats.total\nFROM users u\nJOIN (\n  SELECT user_id, SUM(amount) AS total\n  FROM orders\n  GROUP BY user_id\n) AS stats ON stats.user_id = u.id\nWHERE stats.total > 10000;\n```\n\n" +
          "**EXISTS — есть ли хотя бы одна строка:**\n" +
          "```sql\n-- Пользователи с хотя бы одним заказом\nSELECT name FROM users u\nWHERE EXISTS (\n  SELECT 1 FROM orders WHERE user_id = u.id\n);\n```\n" +
          "EXISTS быстрее IN на больших таблицах — он останавливается как только находит первое совпадение.\n\n" +
          "**Коррелированный подзапрос** — использует столбцы из внешнего запроса:\n" +
          "```sql\nSELECT u.name,\n  (SELECT COUNT(*) FROM orders WHERE user_id = u.id) AS orders_count\nFROM users u;\n```\n" +
          "Медленнее — выполняется для каждой строки внешнего запроса. Лучше заменить на JOIN + GROUP BY.",
        code:
          "-- Топ-покупатели: те, кто потратил больше среднего\nSELECT u.name, stats.total_spent\nFROM users u\nJOIN (\n  SELECT user_id, SUM(amount) AS total_spent\n  FROM orders\n  WHERE status = 'paid'\n  GROUP BY user_id\n) AS stats ON stats.user_id = u.id\nWHERE stats.total_spent > (\n  SELECT AVG(total)\n  FROM (\n    SELECT SUM(amount) AS total\n    FROM orders WHERE status = 'paid'\n    GROUP BY user_id\n  ) AS user_totals\n)\nORDER BY stats.total_spent DESC;",
        keyTakeaways: [
          "Подзапрос в WHERE: WHERE col IN (SELECT ...) или WHERE EXISTS (SELECT 1 ...).",
          "Подзапрос в FROM: как временная таблица, должен иметь псевдоним.",
          "EXISTS быстрее IN для больших таблиц — останавливается на первом совпадении.",
          "Коррелированный подзапрос медленный — замени на JOIN + GROUP BY.",
        ],
      },
      {
        heading: "CTE — WITH ... AS: разбить сложный запрос на шаги",
        tagline: "WITH позволяет назвать подзапрос и использовать его как временную таблицу",
        body:
          "**CTE (Common Table Expression)** — именованный подзапрос, объявленный в начале через `WITH`. Делает сложные запросы читаемыми, разбивая их на логические шаги.\n\n" +
          "**Синтаксис:**\n" +
          "```sql\nWITH имя_cte AS (\n  SELECT ...\n)\nSELECT * FROM имя_cte;\n```\n\n" +
          "**Несколько CTE через запятую:**\n" +
          "```sql\nWITH\n  paid_orders AS (\n    SELECT user_id, SUM(amount) AS total\n    FROM orders\n    WHERE status = 'paid'\n    GROUP BY user_id\n  ),\n  top_buyers AS (\n    SELECT user_id, total\n    FROM paid_orders\n    WHERE total > 10000\n  )\nSELECT u.name, t.total\nFROM users u\nJOIN top_buyers t ON t.user_id = u.id\nORDER BY t.total DESC;\n```\n\n" +
          "**Рекурсивный CTE** — обходить иерархические данные (деревья, орг.структуры):\n" +
          "```sql\nWITH RECURSIVE subordinates AS (\n  SELECT id, name, manager_id FROM employees WHERE id = 1  -- начальник\n  UNION ALL\n  SELECT e.id, e.name, e.manager_id\n  FROM employees e\n  JOIN subordinates s ON e.manager_id = s.id  -- рекурсия!\n)\nSELECT * FROM subordinates;\n```\n\n" +
          "**CTE vs подзапрос:** CTE читаемее и легче отлаживать — каждый шаг можно проверить отдельно. В PostgreSQL 12+ CTE по умолчанию вычисляется как обычный подзапрос (оптимизатор может встроить его).",
        code:
          "-- CTE: читаемый аналитический запрос\nWITH\n  -- Шаг 1: выручка по месяцам\n  monthly_revenue AS (\n    SELECT\n      DATE_TRUNC('month', created_at) AS month,\n      SUM(amount) AS revenue\n    FROM orders\n    WHERE status = 'paid'\n    GROUP BY 1\n  ),\n  -- Шаг 2: средняя выручка за все месяцы\n  avg_revenue AS (\n    SELECT AVG(revenue) AS avg_rev FROM monthly_revenue\n  )\n-- Финальный запрос: месяцы выше средней\nSELECT\n  mr.month,\n  mr.revenue,\n  ROUND(mr.revenue - ar.avg_rev, 2) AS vs_average\nFROM monthly_revenue mr\nCROSS JOIN avg_revenue ar\nWHERE mr.revenue > ar.avg_rev\nORDER BY mr.month;",
        keyTakeaways: [
          "CTE (WITH) разбивает сложный запрос на именованные шаги.",
          "Несколько CTE — через запятую после WITH.",
          "Рекурсивный CTE (WITH RECURSIVE) обходит деревья и графы.",
          "CTE можно ссылаться в других CTE — порядок определяет зависимость.",
        ],
      },
      {
        heading: "CASE WHEN — условная логика в SQL",
        tagline: "IF-ELSE прямо в SELECT, ORDER BY и WHERE",
        body:
          "**CASE WHEN** — оператор условного выражения в SQL. Работает как if/elif/else в Python:\n\n" +
          "```sql\nSELECT\n  name,\n  CASE\n    WHEN age < 18 THEN 'несовершеннолетний'\n    WHEN age < 65 THEN 'взрослый'\n    ELSE 'пенсионный возраст'\n  END AS age_group\nFROM users;\n```\n\n" +
          "**CASE с простым выражением (short form):**\n" +
          "```sql\nSELECT\n  CASE status\n    WHEN 'new'       THEN '🆕 Новый'\n    WHEN 'paid'      THEN '✅ Оплачен'\n    WHEN 'cancelled' THEN '❌ Отменён'\n    ELSE '❓ Неизвестен'\n  END AS status_label\nFROM orders;\n```\n\n" +
          "**CASE в агрегации (conditional aggregation):**\n" +
          "```sql\nSELECT\n  COUNT(*) AS total,\n  COUNT(CASE WHEN status = 'paid' THEN 1 END) AS paid_count,\n  SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid_revenue\nFROM orders;\n```\n" +
          "Это мощный паттерн для «pivot» — получить статистику по нескольким условиям в одном запросе.\n\n" +
          "**COALESCE(expr, default)** — вернуть первое не-NULL значение:\n" +
          "```sql\nSELECT name, COALESCE(phone, email, 'нет контакта') AS contact FROM users;\n```\n\n" +
          "**NULLIF(a, b)** — вернуть NULL если a = b, иначе a:\n" +
          "```sql\nSELECT total / NULLIF(count, 0) AS average;  -- защита от деления на ноль\n```",
        code:
          "-- Аналитика заказов с CASE WHEN и conditional aggregation\nSELECT\n  u.name,\n  COUNT(*) AS total_orders,\n  COUNT(CASE WHEN o.status = 'paid' THEN 1 END) AS paid_orders,\n  COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) AS cancelled_orders,\n  COALESCE(SUM(CASE WHEN o.status = 'paid' THEN o.amount END), 0) AS revenue,\n  CASE\n    WHEN SUM(CASE WHEN o.status='paid' THEN o.amount ELSE 0 END) > 50000 THEN 'VIP'\n    WHEN SUM(CASE WHEN o.status='paid' THEN o.amount ELSE 0 END) > 10000 THEN 'Постоянный'\n    ELSE 'Обычный'\n  END AS customer_tier\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nGROUP BY u.id, u.name\nORDER BY revenue DESC;",
        keyTakeaways: [
          "CASE WHEN ... THEN ... ELSE ... END — условное значение в любом месте запроса.",
          "Conditional aggregation: SUM(CASE WHEN status='paid' THEN amount END).",
          "COALESCE(a, b, c) — первое не-NULL значение из списка.",
          "NULLIF(value, 0) — защита от деления на ноль: вернёт NULL вместо /0.",
        ],
      },
    ],
  },
  fills: [
    {
      type: "fill",
      id: "pg3-f1",
      title: "CTE — именованный подзапрос",
      description: "Напиши начало CTE-запроса, объявив именованный подзапрос monthly_sales.",
      language: "python",
      code:
        "sql = '''\n  {{0}} monthly_sales {{1}} (\n    SELECT DATE_TRUNC('month', created_at) AS month,\n           SUM(amount) AS total\n    FROM orders\n    GROUP BY 1\n  )\n  SELECT * FROM monthly_sales ORDER BY month;\n'''\nprint(sql)",
      answers: [["WITH", "with"], ["AS", "as"]],
      hints: [
        "CTE начинается с ключевого слова WITH",
        "После имени CTE ставится AS",
      ],
    },
    {
      type: "fill",
      id: "pg3-f2",
      title: "CASE WHEN условие",
      description: "Добавь метку категории через CASE WHEN: 'дорогой' если price > 10000, иначе 'доступный'.",
      language: "python",
      code:
        "sql = '''\n  SELECT name, price,\n    {{0}}\n      {{1}} price > 10000 {{2}} 'дорогой'\n      ELSE 'доступный'\n    END AS category\n  FROM products\n'''\nprint(sql)",
      answers: [["CASE", "case"], ["WHEN", "when"], ["THEN", "then"]],
      hints: [
        "Условный оператор — CASE",
        "Условие указывается после WHEN",
        "Результат условия — после THEN",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "pg3-q1",
      title: "CTE vs подзапрос",
      question: "Какое главное преимущество CTE (WITH) перед подзапросом?",
      answers: [
        "читаемость",
        "лучше читаемость",
        "разбивает на шаги",
        "именованный подзапрос",
        "более читаемый код",
        "удобнее отлаживать",
        "can reference by name",
        "можно переиспользовать",
        "named subquery",
      ],
      hint: "CTE можно использовать несколько раз и легко читать шаг за шагом",
      explanation: "CTE (WITH) делает сложные запросы читаемыми — разбивает на именованные шаги. Каждый шаг понятен отдельно. Также CTE можно переиспользовать в одном запросе. Подзапросы быстро становятся нечитаемыми при вложенности.",
    },
    {
      type: "question",
      id: "pg3-q2",
      title: "COALESCE назначение",
      question: "Что делает COALESCE(phone, email, 'нет контакта')?",
      answers: [
        "возвращает первое не null значение",
        "первый не null из списка",
        "заменяет null",
        "returns first non-null",
        "если phone null — берёт email",
        "первое ненулевое значение",
        "null-safe замена значений",
        "если null то следующее",
      ],
      hint: "COALESCE проверяет аргументы слева направо и возвращает...",
      explanation: "COALESCE возвращает первый не-NULL аргумент. COALESCE(phone, email, 'нет контакта') — если phone не NULL, вернёт phone. Если phone NULL — проверит email. Если оба NULL — вернёт строку 'нет контакта'.",
    },
    {
      type: "question",
      id: "pg3-q3",
      title: "EXISTS vs IN",
      question: "Почему EXISTS обычно быстрее IN с подзапросом на больших таблицах?",
      answers: [
        "останавливается при первом совпадении",
        "не читает все строки",
        "short circuit evaluation",
        "exists stops at first match",
        "не нужно читать весь результат подзапроса",
        "ранняя остановка",
        "прерывает поиск при нахождении",
      ],
      hint: "EXISTS проверяет наличие, а не читает все значения",
      explanation: "EXISTS останавливается как только находит первую подходящую строку. IN с подзапросом вынужден прочитать все строки подзапроса и построить полный список значений. При большом подзапросе EXISTS значительно быстрее.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "pg3-w1",
      title: "Аналитический отчёт через CTE",
      task:
        "Напиши SQL для аналитического отчёта магазина используя CTE:\n\n" +
        "1. CTE `order_totals` — сумма заказов по каждому покупателю\n" +
        "2. CTE `customer_tiers` — категория покупателя: VIP (>50k), Постоянный (>10k), Обычный\n" +
        "3. Финальный SELECT — имя, email, сумма, категория\n\n" +
        "Дополнительно: используй CASE WHEN для метки тира покупателя.",
      hints: [
        "WITH order_totals AS (SELECT customer_id, SUM(total) AS total_spent FROM orders GROUP BY customer_id)",
        "WITH customer_tiers AS (SELECT ..., CASE WHEN total_spent > 50000 THEN 'VIP'...)",
        "SELECT c.name, ct.tier FROM customers c JOIN customer_tiers ct ON ct.customer_id = c.id",
      ],
      required: ["WITH", "AS", "CASE", "WHEN", "THEN", "GROUP BY"],
      minLines: 20,
      language: "python",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 4 · PostgreSQL — Индексы и EXPLAIN ANALYZE
// ─────────────────────────────────────────────────────────────────────────────
const pg4: Round = {
  number: 4,
  title: "PostgreSQL · Индексы и EXPLAIN ANALYZE",
  level: "Средний → Сложный",
  intro:
    "Производительность — критична для продакшн-приложений. Научись создавать правильные индексы и читать планы запросов.\n\n" +
    "**В этом раунде:**\n" +
    "• Как работают индексы (B-tree, Hash, GIN, GiST)\n" +
    "• CREATE INDEX — создание эффективных индексов\n" +
    "• EXPLAIN ANALYZE — читать и понимать план запроса\n" +
    "• Частичные и составные индексы",
  lesson: {
    title: "Индексы PostgreSQL и анализ производительности",
    summary:
      "Типы индексов PostgreSQL; создание и выбор стратегии; EXPLAIN ANALYZE для профилирования; частичные индексы; VACUUM и статистика.",
    readingMinutes: 22,
    sections: [
      {
        heading: "Типы индексов в PostgreSQL",
        tagline: "Разные типы индексов для разных задач — B-tree для большинства, GIN для текста и массивов",
        body:
          "PostgreSQL поддерживает несколько типов индексов, каждый оптимизирован для своего типа данных и запросов:\n\n" +
          "**B-tree (по умолчанию)** — универсальный индекс:\n" +
          "- Работает для: `=`, `<`, `>`, `<=`, `>=`, `BETWEEN`, `IN`, `IS NULL`, `ORDER BY`\n" +
          "- Создаётся автоматически для PRIMARY KEY и UNIQUE\n" +
          "- Подходит для 95% случаев\n\n" +
          "**Hash** — только для `=`:\n" +
          "- Быстрее B-tree для проверки точного равенства\n" +
          "- Не поддерживает диапазоны и сортировку\n\n" +
          "**GIN (Generalized Inverted Index)** — для составных значений:\n" +
          "- JSONB, массивы, полнотекстовый поиск (tsvector)\n" +
          "- Поиск: `@>`, `<@`, `&&`, `@@`\n\n" +
          "**GiST (Generalized Search Tree)** — геопространственные данные:\n" +
          "- Геокоординаты, геометрические типы, диапазоны\n" +
          "- Используется в PostGIS\n\n" +
          "**BRIN (Block Range INdex)** — для очень больших таблиц с упорядоченными данными:\n" +
          "- Маленький размер, подходит для временных меток\n\n" +
          "```sql\n-- B-tree (по умолчанию)\nCREATE INDEX idx_email ON users(email);\n\n-- GIN для JSONB\nCREATE INDEX idx_metadata ON products USING GIN(metadata);\n\n-- GIN для полнотекстового поиска\nCREATE INDEX idx_search ON articles USING GIN(to_tsvector('russian', title || ' ' || body));\n```",
        code:
          "-- Создание разных типов индексов\n\n-- B-tree: для сортировки и диапазонов\nCREATE INDEX idx_orders_created ON orders(created_at DESC);\nCREATE INDEX idx_users_age ON users(age);\n\n-- Составной B-tree: для запросов с несколькими условиями\nCREATE INDEX idx_orders_user_status ON orders(user_id, status);\n-- Ускоряет: WHERE user_id = ? AND status = ?\n-- Ускоряет: WHERE user_id = ?  (первый столбец составного индекса)\n\n-- Уникальный индекс\nCREATE UNIQUE INDEX idx_users_email ON users(email);\n\n-- GIN для JSONB-поиска\nCREATE INDEX idx_products_tags ON products USING GIN(tags);\n-- Ускоряет: WHERE tags @> '{\"электроника\"}'",
        keyTakeaways: [
          "B-tree — универсальный индекс, подходит для большинства задач.",
          "GIN — для JSONB, массивов и полнотекстового поиска.",
          "Составной индекс (col1, col2) помогает при WHERE col1=? AND col2=? и WHERE col1=?.",
          "PRIMARY KEY и UNIQUE автоматически создают B-tree индекс.",
        ],
        pitfalls: [
          "Много индексов = медленные INSERT/UPDATE — каждый индекс нужно обновлять.",
          "Индекс на (col1, col2) НЕ ускоряет WHERE col2 = ? без col1 (порядок важен).",
        ],
      },
      {
        heading: "EXPLAIN ANALYZE — понять и оптимизировать запрос",
        tagline: "EXPLAIN ANALYZE выполняет запрос и показывает точный план с реальными временами",
        body:
          "**EXPLAIN** показывает план выполнения запроса.\n" +
          "**EXPLAIN ANALYZE** — выполняет запрос и показывает реальное время и статистику.\n\n" +
          "```sql\nEXPLAIN ANALYZE\nSELECT * FROM orders WHERE user_id = 5;\n```\n\n" +
          "**Что читать в результате:**\n\n" +
          "```\nSeq Scan on orders  (cost=0..1250 rows=1000 width=64)\n                    (actual time=0.1..15.2 rows=50 loops=1)\n```\n\n" +
          "- `Seq Scan` — последовательное сканирование (= нет индекса, медленно)\n" +
          "- `Index Scan` — использует индекс (быстро)\n" +
          "- `Index Only Scan` — все данные из индекса без обращения к таблице (очень быстро)\n" +
          "- `cost=start..total` — оценочная стоимость (не в секундах, в условных единицах)\n" +
          "- `rows=N` — ожидаемое количество строк\n" +
          "- `actual time=start..end` — реальное время в миллисекундах\n\n" +
          "**EXPLAIN (ANALYZE, BUFFERS)** — более детальная информация:\n" +
          "```sql\nEXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)\nSELECT * FROM orders WHERE user_id = 5;\n```\n\n" +
          "**Узкие места:**\n" +
          "- `Seq Scan` на большой таблице — нужен индекс\n" +
          "- `Hash Join` вместо `Index Scan` — JOIN по неиндексированному столбцу\n" +
          "- `actual rows >> rows` — устаревшая статистика, запусти `ANALYZE table_name`",
        code:
          "-- Пример анализа в Python\nimport psycopg2\nimport psycopg2.extras\n\ndef explain_query(conn, sql, params=None):\n    \"\"\"Выполнить EXPLAIN ANALYZE и показать план запроса.\"\"\"\n    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)\n    explain_sql = f'EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) {sql}'\n    cursor.execute(explain_sql, params)\n    plan_rows = cursor.fetchall()\n    print('=== QUERY PLAN ===')\n    for row in plan_rows:\n        print(row['QUERY PLAN'])\n    print('==================')\n\n# Использование:\n# with psycopg2.connect(DATABASE_URL) as conn:\n#     explain_query(conn, 'SELECT * FROM orders WHERE user_id = %s', (5,))\n\n# Ищи в результате:\n# - Seq Scan → добавь индекс\n# - 'actual rows' >> 'rows' → запусти ANALYZE table_name\n# - 'actual time' большое → узкое место",
        keyTakeaways: [
          "EXPLAIN ANALYZE выполняет запрос и показывает реальное время выполнения.",
          "Seq Scan = медленно (нет индекса); Index Scan = быстро.",
          "actual time — реальное время в мс; cost — оценочная стоимость.",
          "ANALYZE table_name обновляет статистику для планировщика запросов.",
        ],
      },
      {
        heading: "Частичные и функциональные индексы",
        tagline: "Индекс только на нужных строках — меньше, быстрее, эффективнее",
        body:
          "**Частичный индекс (Partial Index)** — индекс только по части строк таблицы:\n\n" +
          "```sql\n-- Индекс только на активных заказах\nCREATE INDEX idx_active_orders ON orders(created_at)\nWHERE status NOT IN ('cancelled', 'refunded');\n\n-- Индекс на непрочитанных уведомлениях\nCREATE INDEX idx_unread ON notifications(user_id, created_at)\nWHERE read = FALSE;\n```\n\n" +
          "Зачем? Если 90% заказов отменены, но ты всегда ищешь активные — полный индекс тратит ресурсы на ненужные строки. Частичный — меньше размером, быстрее обновляется.\n\n" +
          "**Функциональный (Expression) индекс:**\n" +
          "```sql\n-- Поиск без учёта регистра (LOWER)\nCREATE INDEX idx_email_lower ON users(LOWER(email));\n-- Теперь ускоряет: WHERE LOWER(email) = 'alice@mail.ru'\n\n-- Индекс на части JSON\nCREATE INDEX idx_city ON users((profile->>'city'));\n-- Ускоряет: WHERE profile->>'city' = 'Москва'\n```\n\n" +
          "**Covering Index (INCLUDE)** — включить дополнительные столбцы в индекс для Index Only Scan:\n" +
          "```sql\nCREATE INDEX idx_orders_user\n  ON orders(user_id)\n  INCLUDE (amount, status);\n-- Запрос только к индексу, без обращения к таблице:\n-- SELECT amount, status FROM orders WHERE user_id = 5\n```",
        code:
          "-- Практические примеры индексов\n\n-- 1. Частичный: ускорить поиск только активных пользователей\nCREATE INDEX idx_active_users\n  ON users(email)\n  WHERE is_active = TRUE;\n\n-- 2. Функциональный: поиск по email без учёта регистра\nCREATE INDEX idx_email_lower ON users(LOWER(email));\n-- Запрос должен использовать ту же функцию:\nSELECT * FROM users WHERE LOWER(email) = LOWER('Alice@Mail.RU');\n\n-- 3. Covering index: все нужные данные в индексе\nCREATE INDEX idx_orders_cover\n  ON orders(user_id, created_at DESC)\n  INCLUDE (amount, status);\n\n-- 4. Многостолбцовый: порядок имеет значение!\nCREATE INDEX idx_user_status_date ON orders(user_id, status, created_at);\n-- Ускоряет запросы вида:\n-- WHERE user_id = ? AND status = ?\n-- WHERE user_id = ?\n-- НЕ ускоряет: WHERE status = ? (нет user_id в начале)",
        keyTakeaways: [
          "Частичный индекс: WHERE в CREATE INDEX — индексирует только подмножество строк.",
          "Функциональный индекс: CREATE INDEX ON table(LOWER(col)) для поиска без регистра.",
          "INCLUDE — покрывающий индекс для Index Only Scan.",
          "Порядок столбцов в составном индексе критичен: (a,b) != (b,a).",
        ],
      },
    ],
  },
  fills: [
    {
      type: "fill",
      id: "pg4-f1",
      title: "Создание составного индекса",
      description: "Создай B-tree индекс по столбцам user_id и status таблицы orders.",
      language: "python",
      code:
        "sql = '{{0}} {{1}} idx_orders_user_status {{2}} orders(user_id, status)'\nprint(sql)\n# CREATE INDEX idx_orders_user_status ON orders(user_id, status)",
      answers: [["CREATE", "create"], ["INDEX", "index"], ["ON", "on"]],
      hints: [
        "CREATE INDEX для создания нового индекса",
        "Тип объекта — INDEX",
        "Указываем таблицу через ON",
      ],
    },
    {
      type: "fill",
      id: "pg4-f2",
      title: "EXPLAIN ANALYZE",
      description: "Напиши команду для анализа производительности SELECT-запроса.",
      language: "python",
      code:
        "sql = '{{0}} {{1}} SELECT * FROM orders WHERE user_id = 5'\nprint(sql)\n# EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 5",
      answers: [["EXPLAIN", "explain"], ["ANALYZE", "analyze"]],
      hints: [
        "EXPLAIN показывает план; добавь ключевое слово для реального выполнения",
        "Второе слово — ANALYZE",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "pg4-q1",
      title: "Seq Scan vs Index Scan",
      question: "Что означает 'Seq Scan' в плане EXPLAIN ANALYZE?",
      answers: [
        "полное сканирование таблицы",
        "sequential scan",
        "читает все строки",
        "нет индекса",
        "медленный обход таблицы",
        "full table scan",
        "последовательное чтение",
        "индекс не используется",
      ],
      hint: "Seq = sequential (последовательный)",
      explanation: "Seq Scan (Sequential Scan) — PostgreSQL читает ВСЕ строки таблицы подряд, без использования индекса. На больших таблицах это медленно. Index Scan означает использование индекса — намного быстрее для поиска конкретных строк.",
    },
    {
      type: "question",
      id: "pg4-q2",
      title: "Частичный индекс",
      question: "В чём преимущество частичного индекса (CREATE INDEX ... WHERE ...)?",
      answers: [
        "меньший размер индексирует только нужные строки",
        "индексирует только часть строк",
        "меньше размер быстрее обновление",
        "partial index only indexes subset",
        "быстрее для условий которые часто используются",
        "не включает ненужные строки",
        "оптимизация для конкретного условия",
      ],
      hint: "Зачем хранить в индексе строки которые никогда не ищешь?",
      explanation: "Частичный индекс меньше по размеру (только нужные строки), быстрее обновляется при INSERT/UPDATE, и использует меньше памяти. Если 90% строк имеют status='cancelled' и ты всегда ищешь только активные — частичный индекс WHERE status='active' будет в 10 раз меньше.",
    },
    {
      type: "question",
      id: "pg4-q3",
      title: "Порядок столбцов в индексе",
      question: "Индекс CREATE INDEX ON orders(user_id, status) ускорит запрос WHERE status = 'paid' без условия на user_id?",
      answers: [
        "нет",
        "не ускорит",
        "нет, нужен индекс только по status",
        "no",
        "нет, порядок столбцов важен",
        "не поможет",
        "нет индекс не используется",
      ],
      hint: "В составном индексе первый столбец — главный",
      explanation: "Нет. Составной индекс (user_id, status) эффективен только если условие начинается с user_id. Запрос WHERE status = 'paid' без user_id не сможет использовать этот индекс (нарушается принцип «leftmost prefix»). Для таких запросов нужен отдельный индекс на status.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "pg4-w1",
      title: "Оптимизация медленных запросов",
      task:
        "Напиши SQL для следующего сценария:\n\n" +
        "1. Создай таблицу `events` (id SERIAL, user_id INT, event_type TEXT, created_at TIMESTAMPTZ, metadata JSONB)\n" +
        "2. Создай нужные индексы для оптимизации следующих запросов:\n" +
        "   - WHERE user_id = ? ORDER BY created_at DESC LIMIT 20\n" +
        "   - WHERE event_type = ? AND created_at > ?\n" +
        "   - WHERE metadata @> '{\"action\": \"purchase\"}'\n" +
        "3. Добавь частичный индекс только на события последних 30 дней\n" +
        "4. Напиши EXPLAIN ANALYZE для одного из запросов",
      hints: [
        "CREATE INDEX ON events(user_id, created_at DESC)",
        "CREATE INDEX ON events(event_type, created_at)",
        "CREATE INDEX ON events USING GIN(metadata)",
        "CREATE INDEX ON events(user_id) WHERE created_at > NOW() - INTERVAL '30 days'",
        "EXPLAIN ANALYZE SELECT ... FROM events WHERE ...",
      ],
      required: ["CREATE INDEX", "USING GIN", "EXPLAIN ANALYZE", "WHERE"],
      minLines: 15,
      language: "python",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 5 · PostgreSQL — SQLAlchemy ORM
// ─────────────────────────────────────────────────────────────────────────────
const pg5: Round = {
  number: 5,
  title: "PostgreSQL · SQLAlchemy — ORM для Python",
  level: "Средний → Сложный",
  intro:
    "ORM (Object-Relational Mapping) — слой абстракции над SQL. Работаешь с таблицами как с Python-классами, а не пишешь SQL вручную.\n\n" +
    "**В этом раунде:**\n" +
    "• Что такое ORM и зачем он нужен\n" +
    "• SQLAlchemy Engine, Session, Base\n" +
    "• Декларативные модели\n" +
    "• Запросы через ORM и Relationships",
  lesson: {
    title: "SQLAlchemy: ORM для профессиональной работы с БД",
    summary:
      "Принципы ORM; Engine и Session; создание моделей; CRUD через ORM; relationship для связей; когда использовать ORM, а когда raw SQL.",
    readingMinutes: 25,
    sections: [
      {
        heading: "Что такое ORM и зачем он нужен",
        tagline: "ORM превращает таблицы в классы — ты работаешь с объектами Python вместо SQL",
        body:
          "**ORM (Object-Relational Mapping)** — технология, которая отображает строки базы данных на объекты Python:\n\n" +
          "```python\n# Без ORM (raw SQL):\ncursor.execute('SELECT id, name, email FROM users WHERE id = %s', (user_id,))\nrow = cursor.fetchone()\nname = row['name']\n\n# С ORM (SQLAlchemy):\nuser = session.get(User, user_id)\nname = user.name  # user — Python-объект!\n```\n\n" +
          "**Преимущества ORM:**\n" +
          "- Меньше SQL-кода, больше Python\n" +
          "- Автоматическая защита от SQL-инъекций\n" +
          "- Легко переключиться между СУБД (PostgreSQL → SQLite для тестов)\n" +
          "- Отношения между таблицами через атрибуты: `user.orders`\n" +
          "- Миграции через Alembic\n\n" +
          "**Недостатки ORM:**\n" +
          "- Сложные аналитические запросы неудобно писать через ORM\n" +
          "- ORM-запросы могут генерировать неэффективный SQL\n" +
          "- Нужно учить API ORM поверх SQL\n\n" +
          "**Правило:** ORM для CRUD-операций (создание, чтение, обновление, удаление). Raw SQL для сложной аналитики и оптимизированных запросов.\n\n" +
          "**SQLAlchemy** — самый популярный Python ORM. Состоит из двух слоёв:\n" +
          "- **Core** — SQL Expression Language, тонкая обёртка над SQL\n" +
          "- **ORM** — полноценный Object-Relational Mapper",
        keyTakeaways: [
          "ORM — Python-объекты вместо SQL-строк; класс = таблица, объект = строка.",
          "SQLAlchemy — стандарт для Python ORM; используется в Flask, FastAPI и других.",
          "ORM хорош для CRUD; для сложной аналитики — raw SQL или SQLAlchemy Core.",
          "Автоматическая защита от SQL-инъекций — большой плюс ORM.",
        ],
      },
      {
        heading: "Engine, Session и декларативные модели",
        tagline: "Engine — соединение, Session — транзакция, Base — базовый класс моделей",
        body:
          "**Engine** — объект соединения с базой данных:\n" +
          "```python\nfrom sqlalchemy import create_engine\n\nengine = create_engine('postgresql://user:pass@localhost/dbname')\n# Для SQLite:\nengine = create_engine('sqlite:///app.db')\n```\n\n" +
          "**Session** — единица работы (Unit of Work). Группирует операции в транзакцию:\n" +
          "```python\nfrom sqlalchemy.orm import sessionmaker\nSession = sessionmaker(bind=engine)\nsession = Session()\n# или через context manager:\nwith Session() as session:\n    ...\n```\n\n" +
          "**Декларативная модель** — класс Python = таблица:\n" +
          "```python\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column\nfrom sqlalchemy import String, Integer, DateTime\nfrom datetime import datetime\n\nclass Base(DeclarativeBase): pass\n\nclass User(Base):\n    __tablename__ = 'users'\n    \n    id: Mapped[int] = mapped_column(primary_key=True)\n    name: Mapped[str] = mapped_column(String(100))\n    email: Mapped[str] = mapped_column(String(200), unique=True)\n    age: Mapped[int | None] = mapped_column(Integer, nullable=True)\n    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)\n```\n\n" +
          "**Создать все таблицы:**\n" +
          "```python\nBase.metadata.create_all(engine)\n```",
        code:
          "from sqlalchemy import create_engine, String, Integer, ForeignKey, TIMESTAMP\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker\nfrom datetime import datetime\n\n# 1. Подключение\nengine = create_engine('sqlite:///demo.db', echo=False)  # echo=True покажет SQL\n\nclass Base(DeclarativeBase):\n    pass\n\n# 2. Модели\nclass User(Base):\n    __tablename__ = 'users'\n    id: Mapped[int] = mapped_column(primary_key=True)\n    name: Mapped[str] = mapped_column(String(100))\n    email: Mapped[str] = mapped_column(String(200), unique=True)\n    orders: Mapped[list['Order']] = relationship(back_populates='user')\n\nclass Order(Base):\n    __tablename__ = 'orders'\n    id: Mapped[int] = mapped_column(primary_key=True)\n    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))\n    amount: Mapped[float]\n    user: Mapped['User'] = relationship(back_populates='orders')\n\n# 3. Создать таблицы\nBase.metadata.create_all(engine)\n\n# 4. Сессия\nSession = sessionmaker(bind=engine)\n\nprint('Таблицы созданы!')",
        keyTakeaways: [
          "create_engine(URL) — один раз при старте приложения.",
          "Session — единица работы; session.commit() / session.rollback() как conn.commit().",
          "Mapped[type] + mapped_column() — современный способ объявления колонок (SQLAlchemy 2.0).",
          "Base.metadata.create_all(engine) — создать все таблицы по моделям.",
        ],
        pitfalls: [
          "Не создавай новый engine для каждого запроса — это очень медленно.",
          "Session не потокобезопасен — для многопоточных приложений используй scoped_session.",
        ],
      },
      {
        heading: "CRUD через SQLAlchemy ORM",
        tagline: "Вместо INSERT/UPDATE/DELETE — методы Python-объектов",
        body:
          "**CREATE (добавить):**\n" +
          "```python\nwith Session() as session:\n    user = User(name='Алиса', email='alice@mail.ru')\n    session.add(user)   # добавить в сессию\n    session.commit()    # сохранить в БД\n    print(user.id)      # id назначен после commit\n```\n\n" +
          "**READ (прочитать):**\n" +
          "```python\nwith Session() as session:\n    # По id:\n    user = session.get(User, 1)\n    \n    # По условию:\n    users = session.execute(\n        select(User).where(User.age > 18).order_by(User.name)\n    ).scalars().all()\n    \n    # Первый элемент:\n    admin = session.execute(\n        select(User).where(User.role == 'admin')\n    ).scalar_one_or_none()\n```\n\n" +
          "**UPDATE (обновить):**\n" +
          "```python\nwith Session() as session:\n    user = session.get(User, 1)\n    user.name = 'Алиса Новое Имя'  # изменить атрибут\n    session.commit()  # ORM сам сгенерирует UPDATE\n```\n\n" +
          "**DELETE (удалить):**\n" +
          "```python\nwith Session() as session:\n    user = session.get(User, 1)\n    session.delete(user)\n    session.commit()\n```\n\n" +
          "**Relationship:** доступ к связанным объектам через атрибут:\n" +
          "```python\nwith Session() as session:\n    user = session.get(User, 1)  # eager loading нужен отдельно\n    for order in user.orders:  # lazy load — запрос к БД при обращении\n        print(order.amount)\n```",
        code:
          "from sqlalchemy import create_engine, String, ForeignKey, select\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker\n\nengine = create_engine('sqlite:///shop.db')\n\nclass Base(DeclarativeBase): pass\n\nclass User(Base):\n    __tablename__ = 'users'\n    id: Mapped[int] = mapped_column(primary_key=True)\n    name: Mapped[str] = mapped_column(String(100))\n    orders: Mapped[list['Order']] = relationship(back_populates='user', lazy='select')\n\nclass Order(Base):\n    __tablename__ = 'orders'\n    id: Mapped[int] = mapped_column(primary_key=True)\n    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))\n    amount: Mapped[float]\n    user: Mapped[User] = relationship(back_populates='orders')\n\nBase.metadata.create_all(engine)\nSession = sessionmaker(bind=engine)\n\n# CREATE\nwith Session() as session:\n    alice = User(name='Алиса')\n    session.add(alice)\n    session.flush()  # назначить id без commit\n    o1 = Order(user_id=alice.id, amount=1500)\n    o2 = Order(user_id=alice.id, amount=2500)\n    session.add_all([o1, o2])\n    session.commit()\n    print('Пользователь создан, id:', alice.id)\n\n# READ\nwith Session() as session:\n    user = session.get(User, 1)\n    print(f'{user.name}: {len(user.orders)} заказов')",
        keyTakeaways: [
          "session.add(obj) + session.commit() — INSERT нового объекта.",
          "session.get(Model, id) — получить объект по первичному ключу.",
          "Изменить атрибут объекта + commit() — автоматически UPDATE.",
          "session.delete(obj) + commit() — DELETE строки.",
        ],
        pitfalls: [
          "Lazy loading в цикле (N+1 проблема) — один запрос на пользователя + N запросов для их orders. Используй joinedload или selectinload.",
          "session.flush() применяет изменения в рамках транзакции; session.commit() сохраняет в БД.",
        ],
      },
    ],
  },
  fills: [
    {
      type: "fill",
      id: "pg5-f1",
      title: "Создание модели SQLAlchemy",
      description: "Объяви модель User с полями id (PK) и name через Mapped и mapped_column.",
      language: "python",
      code:
        "from sqlalchemy.orm import DeclarativeBase, Mapped, {{0}}\nfrom sqlalchemy import String\n\nclass Base(DeclarativeBase): pass\n\nclass User(Base):\n    __tablename__ = 'users'\n    id: {{1}}[int] = mapped_column(primary_key=True)\n    name: Mapped[str] = mapped_column(String(100))\n\nprint('Модель User объявлена!')\nprint('Таблица:', User.__tablename__)",
      answers: [["mapped_column", "mapped_column "], ["Mapped", "Mapped "]],
      hints: [
        "Функция для объявления колонки — mapped_column",
        "Тип-аннотация для колонки модели — Mapped",
      ],
    },
    {
      type: "fill",
      id: "pg5-f2",
      title: "Добавление объекта через сессию",
      description: "Добавь нового пользователя в базу данных через SQLAlchemy session.",
      language: "python",
      code:
        "from sqlalchemy import create_engine, String\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker\n\nengine = create_engine('sqlite://')\nclass Base(DeclarativeBase): pass\nclass User(Base):\n    __tablename__ = 'users'\n    id: Mapped[int] = mapped_column(primary_key=True)\n    name: Mapped[str] = mapped_column(String(100))\nBase.metadata.create_all(engine)\nSession = sessionmaker(bind=engine)\n\nwith Session() as session:\n    user = User(name='Алиса')\n    session.{{0}}(user)   # добавить в сессию\n    session.{{1}}()       # сохранить в БД\n    print('ID:', user.id)",
      answers: [["add", "add "], ["commit", "commit "]],
      hints: [
        "Метод добавления объекта в сессию — add",
        "Метод сохранения изменений — commit",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "pg5-q1",
      title: "Что делает session.commit()?",
      question: "Когда нужно вызывать session.commit() в SQLAlchemy?",
      answers: [
        "для сохранения изменений в базе данных",
        "после add/delete",
        "сохранить изменения",
        "чтобы данные записались",
        "to persist changes",
        "применить транзакцию",
        "зафиксировать транзакцию",
        "чтобы объект попал в бд",
      ],
      hint: "Без commit изменения не сохранятся в БД",
      explanation: "session.commit() завершает текущую транзакцию и сохраняет все изменения (add, delete, обновления атрибутов) в базе данных. Без commit изменения существуют только в памяти сессии и будут потеряны.",
    },
    {
      type: "question",
      id: "pg5-q2",
      title: "Как прочитать объект по id?",
      question: "Как получить пользователя по id=5 через SQLAlchemy ORM?",
      answers: [
        "session.get(User, 5)",
        "session.get",
        "session.get(User, id)",
        "session.query(User).get(5)",
        "session.get(User, 5)",
        "get by primary key",
      ],
      hint: "Специальный метод для получения по первичному ключу",
      explanation: "session.get(User, 5) — получить объект User с id=5. Если строки с таким id нет — вернёт None. Это эффективнее чем SELECT * WHERE id=5 — SQLAlchemy проверяет кэш сессии перед запросом к БД.",
    },
    {
      type: "question",
      id: "pg5-q3",
      title: "N+1 проблема",
      question: "Что такое N+1 проблема в ORM?",
      answers: [
        "один запрос для списка и N запросов для каждого связанного объекта",
        "слишком много запросов к бд",
        "n запросов вместо одного",
        "lazy loading в цикле",
        "один запрос на каждый объект",
        "n дополнительных запросов",
        "лишние запросы при обходе коллекции",
      ],
      hint: "Сколько запросов нужно для получения 100 пользователей и их заказов?",
      explanation: "N+1: 1 запрос для получения N объектов + N отдельных запросов для каждого связанного объекта. Например: 1 запрос для 100 пользователей + 100 запросов для заказов каждого = 101 запрос вместо 1. Решение: joinedload() или selectinload() для eager loading.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "pg5-w1",
      title: "ORM-модели для блога (SQLAlchemy + SQLite)",
      task:
        "Создай SQLAlchemy ORM-модели для блога (с SQLite backend для запуска в браузере):\n\n" +
        "Модели:\n" +
        "- `Author` (id, name, email UNIQUE, bio TEXT nullable)\n" +
        "- `Post` (id, author_id FK, title, body, published BOOL DEFAULT False, created_at)\n\n" +
        "Связи:\n" +
        "- Author → Posts: один ко многим (relationship)\n" +
        "- Post → Author: обратная связь (back_populates)\n\n" +
        "Функции:\n" +
        "- `create_author(session, name, email, bio=None)` → Author\n" +
        "- `create_post(session, author_id, title, body)` → Post\n" +
        "- `get_author_posts(session, author_id)` → list[dict]\n" +
        "- `publish_post(session, post_id)` — установить published=True\n\n" +
        "В конце: создай базу, добавь автора и 2 поста, выведи их.",
      hints: [
        "import sqlalchemy as sa; from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session",
        "engine = sa.create_engine('sqlite:///:memory:')  # SQLite — для PostgreSQL меняем на postgresql://...",
        "class Base(DeclarativeBase): pass",
        "author_id: Mapped[int] = mapped_column(sa.ForeignKey('authors.id'))",
        "posts: Mapped[list['Post']] = relationship(back_populates='author')",
        "Base.metadata.create_all(engine); with Session(engine) as session: session.add(...); session.commit()",
      ],
      required: ["relationship", "ForeignKey", "mapped_column", "session.add", "session.commit"],
      minLines: 40,
      language: "python",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 6 · PostgreSQL — Flask + PostgreSQL
// ─────────────────────────────────────────────────────────────────────────────
const pg6: Round = {
  number: 6,
  title: "PostgreSQL · Flask + PostgreSQL — полный стек",
  level: "Средний → Сложный",
  intro:
    "Соединяем Flask и PostgreSQL в полноценное веб-приложение с REST API.\n\n" +
    "**В этом раунде:**\n" +
    "• Flask-SQLAlchemy — интеграция с Flask\n" +
    "• Модели и маршруты\n" +
    "• Обработка ошибок БД\n" +
    "• Базовые паттерны REST API с базой данных",
  lesson: {
    title: "Flask + PostgreSQL: REST API с базой данных",
    summary:
      "Flask-SQLAlchemy настройка; модели в Flask приложении; CRUD маршруты; обработка IntegrityError; паттерны возврата JSON.",
    readingMinutes: 22,
    sections: [
      {
        heading: "Flask-SQLAlchemy — настройка",
        tagline: "Flask-SQLAlchemy интегрирует SQLAlchemy в Flask с удобным API",
        body:
          "**Flask-SQLAlchemy** — расширение Flask, которое упрощает работу с SQLAlchemy: управляет сессиями автоматически (одна сессия на HTTP-запрос, автоматически закрывается).\n\n" +
          "```bash\npip install flask flask-sqlalchemy psycopg2-binary\n```\n\n" +
          "**Минимальная настройка:**\n" +
          "```python\nfrom flask import Flask\nfrom flask_sqlalchemy import SQLAlchemy\nimport os\n\napp = Flask(__name__)\napp.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(\n    'DATABASE_URL',\n    'postgresql://postgres:secret@localhost/myapp'\n)\napp.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # отключить лишние сигналы\n\ndb = SQLAlchemy(app)\n```\n\n" +
          "**Модели с Flask-SQLAlchemy:**\n" +
          "```python\nclass User(db.Model):\n    __tablename__ = 'users'\n    id = db.Column(db.Integer, primary_key=True)\n    name = db.Column(db.String(100), nullable=False)\n    email = db.Column(db.String(200), unique=True, nullable=False)\n    created_at = db.Column(db.DateTime, server_default=db.func.now())\n    \n    def to_dict(self):\n        return {'id': self.id, 'name': self.name, 'email': self.email}\n```\n\n" +
          "**Создать таблицы:**\n" +
          "```python\nwith app.app_context():\n    db.create_all()\n```",
        code:
          "from flask import Flask, jsonify, request\nfrom flask_sqlalchemy import SQLAlchemy\nfrom sqlalchemy.exc import IntegrityError\nimport os\n\napp = Flask(__name__)\napp.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(\n    'DATABASE_URL', 'sqlite:///app.db'  # SQLite для теста без PostgreSQL\n)\napp.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False\ndb = SQLAlchemy(app)\n\nclass User(db.Model):\n    __tablename__ = 'users'\n    id = db.Column(db.Integer, primary_key=True)\n    name = db.Column(db.String(100), nullable=False)\n    email = db.Column(db.String(200), unique=True, nullable=False)\n\n    def to_dict(self):\n        return {'id': self.id, 'name': self.name, 'email': self.email}\n\n# Создать таблицы при старте\nwith app.app_context():\n    db.create_all()\n\nif __name__ == '__main__':\n    app.run(debug=True)",
        keyTakeaways: [
          "Flask-SQLAlchemy автоматически управляет сессией на каждый HTTP-запрос.",
          "SQLALCHEMY_DATABASE_URI — строка подключения через переменную окружения.",
          "db.create_all() — создать таблицы по моделям (в app_context).",
          "to_dict() — стандартный метод для сериализации модели в JSON.",
        ],
      },
      {
        heading: "CRUD маршруты с Flask + SQLAlchemy",
        tagline: "Каждая операция с данными — отдельный HTTP-маршрут",
        body:
          "**REST API паттерн:**\n" +
          "- `GET /users` — список пользователей\n" +
          "- `GET /users/<id>` — один пользователь\n" +
          "- `POST /users` — создать пользователя\n" +
          "- `PUT /users/<id>` — обновить\n" +
          "- `DELETE /users/<id>` — удалить\n\n" +
          "**GET-маршрут:**\n" +
          "```python\n@app.route('/users')\ndef list_users():\n    users = User.query.order_by(User.name).all()\n    return jsonify([u.to_dict() for u in users])\n```\n\n" +
          "**POST-маршрут с обработкой ошибок:**\n" +
          "```python\n@app.route('/users', methods=['POST'])\ndef create_user():\n    data = request.get_json()\n    if not data or not data.get('name') or not data.get('email'):\n        return jsonify({'error': 'name и email обязательны'}), 400\n    \n    user = User(name=data['name'], email=data['email'])\n    db.session.add(user)\n    try:\n        db.session.commit()\n    except IntegrityError:\n        db.session.rollback()\n        return jsonify({'error': 'email уже занят'}), 409\n    \n    return jsonify(user.to_dict()), 201\n```\n\n" +
          "**abort(404)** — стандартный способ вернуть 404:\n" +
          "```python\nfrom flask import abort\nuser = User.query.get_or_404(user_id)  # автоматически 404 если нет\n```",
        code:
          "from flask import Flask, jsonify, request, abort\nfrom flask_sqlalchemy import SQLAlchemy\nfrom sqlalchemy.exc import IntegrityError\nimport os\n\napp = Flask(__name__)\napp.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')\napp.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False\ndb = SQLAlchemy(app)\n\nclass User(db.Model):\n    __tablename__ = 'users'\n    id = db.Column(db.Integer, primary_key=True)\n    name = db.Column(db.String(100), nullable=False)\n    email = db.Column(db.String(200), unique=True, nullable=False)\n    def to_dict(self): return {'id': self.id, 'name': self.name, 'email': self.email}\n\nwith app.app_context(): db.create_all()\n\n@app.route('/users', methods=['GET'])\ndef list_users():\n    users = User.query.order_by(User.name).all()\n    return jsonify([u.to_dict() for u in users])\n\n@app.route('/users/<int:uid>', methods=['GET'])\ndef get_user(uid):\n    user = db.session.get(User, uid) or abort(404)\n    return jsonify(user.to_dict())\n\n@app.route('/users', methods=['POST'])\ndef create_user():\n    data = request.get_json() or {}\n    if not data.get('name') or not data.get('email'):\n        return jsonify({'error': 'name и email обязательны'}), 400\n    user = User(name=data['name'], email=data['email'])\n    db.session.add(user)\n    try:\n        db.session.commit()\n        return jsonify(user.to_dict()), 201\n    except IntegrityError:\n        db.session.rollback()\n        return jsonify({'error': 'email уже занят'}), 409\n\n@app.route('/users/<int:uid>', methods=['DELETE'])\ndef delete_user(uid):\n    user = db.session.get(User, uid) or abort(404)\n    db.session.delete(user)\n    db.session.commit()\n    return '', 204",
        keyTakeaways: [
          "User.query.all() — все строки; .filter_by(x=y) — по условию.",
          "IntegrityError после commit — откатить сессию через db.session.rollback().",
          "db.session.get(Model, id) — по PK; abort(404) если None.",
          "Возвращать правильные HTTP коды: 200 OK, 201 Created, 400 Bad Request, 404 Not Found.",
        ],
        pitfalls: [
          "IntegrityError нужно поймать ДО отправки ответа — иначе сессия в сломанном состоянии.",
          "После IntegrityError обязательно db.session.rollback() — иначе следующие операции не работают.",
        ],
      },
    ],
  },
  fills: [
    {
      type: "fill",
      id: "pg6-f1",
      title: "Flask-SQLAlchemy настройка",
      description: "Настрой Flask-SQLAlchemy: укажи URL базы данных и создай объект db.",
      language: "python",
      code:
        "from flask import Flask\nfrom flask_sqlalchemy import SQLAlchemy\nimport os\n\napp = Flask(__name__)\napp.config['{{0}}'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')\ndb = {{1}}(app)\nprint('SQLAlchemy настроен!')",
      answers: [
        ["SQLALCHEMY_DATABASE_URI", "sqlalchemy_database_uri"],
        ["SQLAlchemy", "sqlalchemy"],
      ],
      hints: [
        "Ключ конфигурации URL базы — SQLALCHEMY_DATABASE_URI",
        "Класс для создания объекта ORM — SQLAlchemy",
      ],
    },
    {
      type: "fill",
      id: "pg6-f2",
      title: "Обработка IntegrityError",
      description: "Поймай IntegrityError при нарушении UNIQUE ограничения и откати сессию.",
      language: "python",
      code:
        "from sqlalchemy.exc import {{0}}\n\ntry:\n    db.session.add(user)\n    db.session.commit()\n    return jsonify(user.to_dict()), 201\nexcept {{0}}:\n    db.session.{{1}}()\n    return jsonify({'error': 'email уже занят'}), 409",
      answers: [["IntegrityError", "integrityerror"], ["rollback", "rollback "]],
      hints: [
        "Исключение при нарушении ограничений — IntegrityError из sqlalchemy.exc",
        "Отмена изменений транзакции — метод rollback",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "pg6-q1",
      title: "Когда вызывать rollback?",
      question: "Когда обязательно нужно вызвать db.session.rollback() в Flask-SQLAlchemy?",
      answers: [
        "после IntegrityError",
        "при исключении в commit",
        "после ошибки базы данных",
        "при IntegrityError или другой ошибке",
        "after database exception",
        "при нарушении ограничений",
        "после любой ошибки с базой",
      ],
      hint: "Сессия после ошибки в плохом состоянии — что нужно сделать?",
      explanation: "После любого исключения при работе с сессией (особенно IntegrityError) необходимо вызвать db.session.rollback(). Это очищает сессию от сломанного состояния. Без rollback все последующие операции с базой будут завершаться ошибкой.",
    },
    {
      type: "question",
      id: "pg6-q2",
      title: "HTTP статус для успешного создания",
      question: "Какой HTTP статус-код нужно вернуть при успешном создании нового ресурса (POST)?",
      answers: [
        "201",
        "201 created",
        "201 Created",
        "HTTP 201",
        "status code 201",
        "код 201",
        "двести один",
      ],
      hint: "200 OK — успех; 201 — специальный код для создания",
      explanation: "201 Created — правильный HTTP статус для успешного создания нового ресурса через POST. 200 OK тоже допустимо, но 201 точнее выражает семантику создания.",
    },
    {
      type: "question",
      id: "pg6-q3",
      title: "db.session управление",
      question: "Что делает Flask-SQLAlchemy автоматически по завершении каждого HTTP-запроса?",
      answers: [
        "закрывает сессию",
        "закрывает db session",
        "удаляет сессию",
        "teardown session",
        "сессия автоматически закрывается",
        "очищает session",
      ],
      hint: "Flask-SQLAlchemy управляет жизненным циклом сессии",
      explanation: "Flask-SQLAlchemy автоматически закрывает db.session по завершении каждого HTTP-запроса (через teardown_appcontext). Это предотвращает утечки соединений. Тебе не нужно явно вызывать session.close().",
    },
  ],
  writes: [
    {
      type: "write",
      id: "pg6-w1",
      title: "Todo App — SQLAlchemy + SQLite (паттерн Flask-SQLAlchemy)",
      task:
        "Создай Todo App используя SQLAlchemy ORM с SQLite (тот же паттерн, что Flask-SQLAlchemy):\n\n" +
        "Модель `Task` (id, title NOT NULL, done BOOL DEFAULT False, created_at)\n\n" +
        "Функции CRUD (принимают session):\n" +
        "- `create_task(session, title)` → Task (проверяй: title не пустой, иначе ValueError)\n" +
        "- `get_tasks(session, done=None)` → list[Task] (done=None — все, True/False — фильтр)\n" +
        "- `complete_task(session, task_id)` → Task (если нет — ValueError)\n" +
        "- `delete_task(session, task_id)` → bool\n\n" +
        "В конце: создай 3 задачи, выполни одну, вывести невыполненные, удали одну.\n\n" +
        "📌 В Flask-SQLAlchemy эти функции станут маршрутами — логика идентична.",
      hints: [
        "import sqlalchemy as sa; from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session",
        "engine = sa.create_engine('sqlite:///:memory:')",
        "created_at: Mapped[str] = mapped_column(sa.DateTime, server_default=sa.func.now())",
        "session.execute(sa.select(Task).where(Task.done == done)).scalars().all()",
        "task = session.get(Task, task_id)\nif not task: raise ValueError(f'Task {task_id} не найдена')",
        "session.delete(task); session.commit(); return True",
      ],
      required: ["DeclarativeBase", "mapped_column", "session.add", "session.commit", "session.get"],
      minLines: 45,
      language: "python",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 7 · PostgreSQL — Транзакции, ACID и надёжность данных
// ─────────────────────────────────────────────────────────────────────────────
const pg7: Round = {
  number: 7,
  title: "PostgreSQL · Транзакции, ACID и надёжность данных",
  level: "Средний → Сложный",
  intro:
    "Финальный раунд: надёжность данных — главное для продакшн-приложений.\n\n" +
    "**В этом раунде:**\n" +
    "• ACID — что это и почему критично\n" +
    "• Уровни изоляции транзакций\n" +
    "• Миграции с Alembic\n" +
    "• Deadlocks и как их избежать",
  lesson: {
    title: "Транзакции, ACID, изоляция и миграции",
    summary:
      "ACID свойства и что они гарантируют; BEGIN/COMMIT/ROLLBACK; уровни изоляции; проблемы конкурентности; Alembic для миграций схемы.",
    readingMinutes: 22,
    sections: [
      {
        heading: "ACID — четыре гарантии надёжных транзакций",
        tagline: "Atomicity, Consistency, Isolation, Durability — что PostgreSQL гарантирует тебе",
        body:
          "**ACID** — это четыре фундаментальных свойства транзакций, которые гарантирует PostgreSQL:\n\n" +
          "**A — Atomicity (Атомарность)**\n" +
          "Транзакция — это «всё или ничего». Либо все операции выполнились, либо ни одна. Если сервер упал во время транзакции — все изменения откатятся.\n" +
          "*Пример: перевод денег. Списать со счёта А И зачислить на счёт Б — обе операции или ни одна.*\n\n" +
          "**C — Consistency (Согласованность)**\n" +
          "Транзакция переводит базу из одного **корректного** состояния в другое. Все ограничения (CHECK, NOT NULL, FK) должны выполняться до и после транзакции.\n\n" +
          "**I — Isolation (Изолированность)**\n" +
          "Параллельно выполняющиеся транзакции не видят незафиксированных изменений друг друга. Каждая транзакция работает как будто она одна.\n\n" +
          "**D — Durability (Долговечность)**\n" +
          "После COMMIT данные записаны на диск и сохранятся даже при сбое питания. PostgreSQL использует WAL (Write-Ahead Log) для этой гарантии.\n\n" +
          "**Нарушения без транзакций:**\n" +
          "- Частичные обновления (A): пользователь создан, но его профиль не создан\n" +
          "- Грязное чтение (I): видишь данные которые ещё не сохранены\n" +
          "- Потеря данных (D): изменения не пережили сбой",
        code:
          "import psycopg2\n\n# Пример транзакции с ACID гарантиями\ndef transfer_money(conn, from_id, to_id, amount):\n    \"\"\"\n    Перевод денег — классический пример ACID транзакции:\n    - Atomicity: оба UPDATE или ни одного\n    - Consistency: баланс не может стать отрицательным (CHECK)\n    - Isolation: другие транзакции не видят промежуточного состояния\n    - Durability: после commit — на диске навсегда\n    \"\"\"\n    with conn:\n        with conn.cursor() as cur:\n            # Попытка списать\n            cur.execute(\n                '''UPDATE accounts SET balance = balance - %s\n                   WHERE id = %s AND balance >= %s\n                   RETURNING id''',\n                (amount, from_id, amount)\n            )\n            if cur.rowcount == 0:\n                raise ValueError('Недостаточно средств')\n            \n            # Зачислить\n            cur.execute(\n                'UPDATE accounts SET balance = balance + %s WHERE id = %s',\n                (amount, to_id)\n            )\n            # commit — обе операции сохранены\n        # rollback — автоматически при исключении",
        keyTakeaways: [
          "Atomicity: транзакция — всё или ничего. Нет частичных изменений.",
          "Consistency: ограничения (CHECK, FK) проверяются в конце транзакции.",
          "Isolation: параллельные транзакции не мешают друг другу.",
          "Durability: COMMIT = данные на диске, переживут любой сбой.",
        ],
      },
      {
        heading: "Уровни изоляции и проблемы конкурентности",
        tagline: "Read Committed по умолчанию; Serializable для полной изоляции",
        body:
          "При параллельной работе нескольких транзакций могут возникнуть проблемы:\n\n" +
          "- **Dirty Read** — читаешь незафиксированные данные другой транзакции\n" +
          "- **Non-repeatable Read** — повторное чтение той же строки даёт другой результат\n" +
          "- **Phantom Read** — повторный SELECT возвращает новые строки (другая транзакция вставила)\n\n" +
          "**Уровни изоляции PostgreSQL:**\n\n" +
          "| Уровень | Dirty Read | Non-repeatable | Phantom |\n" +
          "|---------|-----------|----------------|----------|\n" +
          "| Read Committed (по умолчанию) | Нет | Возможен | Возможен |\n" +
          "| Repeatable Read | Нет | Нет | Нет в PG |\n" +
          "| Serializable | Нет | Нет | Нет |\n\n" +
          "**Read Committed** (дефолт) — каждый SELECT видит только зафиксированные данные. Для большинства приложений достаточно.\n\n" +
          "**Serializable** — транзакции как будто выполняются строго последовательно. Самая безопасная, но самая медленная (возможны ошибки сериализации, нужен retry).\n\n" +
          "```python\n# Установить уровень изоляции:\nconn = psycopg2.connect(DATABASE_URL)\nconn.set_isolation_level(\n    psycopg2.extensions.ISOLATION_LEVEL_SERIALIZABLE\n)\n```",
        code:
          "import psycopg2\nimport psycopg2.extensions\n\n# Read Committed (по умолчанию) — подходит для большинства случаев\nconn = psycopg2.connect('...')\nwith conn:\n    with conn.cursor() as cur:\n        cur.execute('SELECT balance FROM accounts WHERE id = %s FOR UPDATE', (account_id,))\n        # FOR UPDATE — заблокировать строку для обновления\n        # Другие транзакции будут ждать пока мы не сделаем commit/rollback\n        row = cur.fetchone()\n        if row and row[0] >= amount:\n            cur.execute('UPDATE accounts SET balance = balance - %s WHERE id = %s',\n                       (amount, account_id))\n\n# Serializable — для финансовых операций\nconn2 = psycopg2.connect('...')\nconn2.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_SERIALIZABLE)\nwith conn2:\n    # Если обнаружен конфликт сериализации — SerializationFailure исключение\n    # Нужно повторить транзакцию\n    pass",
        keyTakeaways: [
          "Read Committed — дефолтный уровень, защищает от dirty reads.",
          "Serializable — максимальная изоляция для критичных операций.",
          "FOR UPDATE — заблокировать строку для обновления в рамках транзакции.",
          "При Serializable возможны ошибки — транзакцию нужно перезапустить.",
        ],
      },
      {
        heading: "Alembic — миграции схемы базы данных",
        tagline: "Миграции — версионирование схемы БД как git для структуры таблиц",
        body:
          "**Проблема:** когда добавляешь столбец или меняешь структуру таблицы в коде — как применить это к базе данных на сервере? Нельзя просто запустить `CREATE TABLE` ещё раз.\n\n" +
          "**Alembic** — инструмент миграций для SQLAlchemy. Хранит историю изменений схемы как файлы-миграции.\n\n" +
          "```bash\npip install alembic\nalembic init migrations  # создать директорию миграций\n```\n\n" +
          "**Рабочий процесс:**\n\n" +
          "```bash\n# 1. Сгенерировать миграцию (Alembic сравнивает модели с БД)\nalembic revision --autogenerate -m \"add email column\"\n\n# 2. Применить миграцию\nalembic upgrade head\n\n# 3. Откатить последнюю миграцию\nalembic downgrade -1\n\n# 4. Посмотреть историю\nalembic history\n```\n\n" +
          "**Файл миграции:**\n" +
          "```python\n# migrations/versions/abc123_add_email_column.py\ndef upgrade():\n    op.add_column('users',\n        sa.Column('email', sa.String(200), nullable=True)\n    )\n\ndef downgrade():\n    op.drop_column('users', 'email')\n```\n\n" +
          "**Золотое правило:** никогда не редактируй схему базы напрямую на продакшн-сервере. Всегда через миграции — так изменения воспроизводимы и откатываемы.",
        code:
          "# alembic.ini: установить DATABASE_URL\n# sqlalchemy.url = postgresql://user:pass@localhost/mydb\n\n# env.py: подключить модели\nfrom myapp.models import Base\ntarget_metadata = Base.metadata\n\n# Пример миграции:\n# alembic revision --autogenerate -m \"create users table\"\n\n# Сгенерированный файл:\ndef upgrade():\n    op.create_table(\n        'users',\n        sa.Column('id', sa.Integer(), nullable=False),\n        sa.Column('name', sa.String(100), nullable=False),\n        sa.Column('email', sa.String(200), nullable=True),\n        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),\n        sa.PrimaryKeyConstraint('id'),\n        sa.UniqueConstraint('email')\n    )\n\ndef downgrade():\n    op.drop_table('users')\n\n# Применить все миграции:\n# alembic upgrade head\n\n# В продакшн через CI/CD автоматически выполнять:\n# alembic upgrade head && python -m gunicorn app:app",
        keyTakeaways: [
          "Alembic — версионирование схемы БД; каждое изменение = файл миграции.",
          "alembic upgrade head — применить все новые миграции.",
          "alembic revision --autogenerate — сгенерировать миграцию по изменениям в моделях.",
          "Каждая миграция имеет upgrade() и downgrade() для отката.",
        ],
        pitfalls: [
          "Никогда не редактируй уже применённую миграцию — создавай новую.",
          "--autogenerate может пропустить некоторые изменения (CHECK constraints) — всегда проверяй сгенерированный файл.",
        ],
      },
    ],
  },
  fills: [
    {
      type: "fill",
      id: "pg7-f1",
      title: "FOR UPDATE — блокировка строки",
      description: "Добавь FOR UPDATE к SELECT чтобы заблокировать строку для обновления в транзакции.",
      language: "python",
      code:
        "sql = 'SELECT balance FROM accounts WHERE id = %s {{0}} {{1}}'\nprint(sql)\n# SELECT balance FROM accounts WHERE id = %s FOR UPDATE",
      answers: [["FOR", "for"], ["UPDATE", "update"]],
      hints: [
        "Блокировка строки начинается со слова FOR",
        "Вид блокировки — UPDATE",
      ],
    },
    {
      type: "fill",
      id: "pg7-f2",
      title: "Уровень изоляции",
      description: "Расшифруй аббревиатуру ACID: что означает буква A?",
      language: "python",
      code:
        "acid = {\n    'A': '{{0}}',    # Транзакция — всё или ничего\n    'C': 'Consistency',\n    'I': 'Isolation',\n    'D': 'Durability'\n}\nprint(acid)",
      answers: [["Atomicity", "atomicity", "атомарность", "Атомарность"]],
      hints: ["Первое свойство ACID — атомарность (от греческого 'неделимый')"],
    },
  ],
  questions: [
    {
      type: "question",
      id: "pg7-q1",
      title: "ACID — Atomicity",
      question: "Что гарантирует свойство Atomicity (атомарность) транзакции?",
      answers: [
        "все операции или ни одной",
        "транзакция всё или ничего",
        "partial operations не сохраняются",
        "либо все изменения либо rollback",
        "атомарность гарантирует неделимость",
        "нет частичных изменений",
        "all or nothing",
        "partial commits невозможны",
      ],
      hint: "Атом — неделимая единица. Что это значит для транзакции?",
      explanation: "Atomicity гарантирует: либо все операции транзакции выполнились успешно (COMMIT), либо ни одна из них не оставила след в базе (ROLLBACK). Невозможна ситуация когда деньги списались, но не зачислились.",
    },
    {
      type: "question",
      id: "pg7-q2",
      title: "Что такое Alembic?",
      question: "Для чего используется Alembic в Python-проектах с PostgreSQL?",
      answers: [
        "миграции схемы базы данных",
        "управление изменениями схемы",
        "version control for db schema",
        "изменение структуры таблиц",
        "database migrations",
        "управление миграциями",
        "версионирование базы данных",
        "эволюция схемы бд",
      ],
      hint: "Как применить ALTER TABLE к продакшн-базе без потери данных?",
      explanation: "Alembic — инструмент миграций для SQLAlchemy. Хранит историю изменений схемы БД в виде файлов-миграций (как git для структуры таблиц). Позволяет применять и откатывать изменения схемы на любом окружении.",
    },
    {
      type: "question",
      id: "pg7-q3",
      title: "Durability гарантия",
      question: "Что гарантирует свойство Durability (долговечность) после COMMIT?",
      answers: [
        "данные записаны на диск и переживут сбой",
        "данные сохранятся даже при отключении питания",
        "commit = данные на диске",
        "данные не потеряются после сбоя",
        "data persisted after crash",
        "постоянное хранение",
        "запись в wal лог",
        "данные не исчезнут",
      ],
      hint: "Что означает 'permanent' в контексте базы данных?",
      explanation: "Durability: после COMMIT данные записаны на диск (через WAL — Write-Ahead Log). Даже если сразу после COMMIT отключится питание — при следующем запуске PostgreSQL восстановит данные из WAL. Данные не потеряются.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "pg7-w1",
      title: "Надёжный банковский перевод",
      task:
        "Напиши функцию `transfer_funds(conn, from_id, to_id, amount)` которая:\n" +
        "1. Начинает транзакцию\n" +
        "2. Читает баланс отправителя WITH FOR UPDATE (блокировка)\n" +
        "3. Проверяет что баланс >= amount\n" +
        "4. Списывает сумму с отправителя\n" +
        "5. Зачисляет получателю\n" +
        "6. Делает COMMIT если всё ok, ROLLBACK при ошибке\n\n" +
        "Также напиши тест: создай два счёта, переведи деньги, проверь балансы.\n" +
        "Используй sqlite3 (вместо PostgreSQL) для тестирования без сервера.",
      hints: [
        "SELECT balance FROM accounts WHERE id = ? для чтения",
        "if balance < amount: raise ValueError('Недостаточно средств')",
        "UPDATE accounts SET balance = balance - ? WHERE id = ?",
        "conn.commit() после обоих UPDATE",
        "except Exception: conn.rollback(); raise",
      ],
      required: ["sqlite3", "commit", "rollback", "UPDATE", "SELECT", "WHERE"],
      minLines: 30,
      language: "python",
    },
  ],
};

export const POSTGRES_ROUNDS: Round[] = [pg1, pg2, pg3, pg4, pg5, pg6, pg7];
export const POSTGRES_TOTAL_ROUNDS = POSTGRES_ROUNDS.length;
