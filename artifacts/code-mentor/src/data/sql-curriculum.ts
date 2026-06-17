import type { Round } from "@/data/curriculum";

// ─────────────────────────────────────────────────────────────────────────────
// Round 1 · SQL Light — Введение в базы данных и первые SELECT-запросы
// ─────────────────────────────────────────────────────────────────────────────
const sql1: Round = {
  number: 1,
  title: "SQL Light · Базы данных, таблицы и первый SELECT",
  level: "Начальный",
  intro:
    "SQL (Structured Query Language) — язык, на котором ты разговариваешь с базой данных. Понимать SQL обязательно каждому разработчику: любое серьёзное приложение хранит данные именно в базах.\n\n" +
    "**В этом раунде:**\n" +
    "• Что такое реляционная база данных\n" +
    "• Структура: таблицы, строки, столбцы\n" +
    "• Первый запрос: SELECT и FROM\n" +
    "• Фильтрация строк: WHERE\n" +
    "• Особое значение NULL",
  lesson: {
    title: "SQL: базы данных, таблицы и SELECT",
    summary:
      "Что такое реляционная БД; как хранятся данные; запросы SELECT/FROM; фильтрация WHERE; значение NULL и работа с ним.",
    readingMinutes: 22,
    sections: [
      {
        heading: "Что такое реляционная база данных",
        tagline: "База данных — организованное хранилище данных с языком для их чтения и изменения",
        body:
          "**База данных (БД)** — это программа, которая хранит структурированные данные и позволяет эффективно их читать, изменять и искать. Думай о базе данных как о суперумном Excel-файле: данные хранятся в таблицах, но поиск и обработка работают в тысячи раз быстрее.\n\n" +
          "**Реляционная база данных** (от латинского *relatio* — отношение) — тип БД, где данные хранятся в связанных таблицах. Каждая таблица — это одна «сущность» приложения: например, `users` (пользователи), `orders` (заказы), `products` (товары).\n\n" +
          "**Структура таблицы:**\n" +
          "- **Столбец (column)** — тип данных, например `name`, `age`, `email`. Каждый столбец имеет фиксированный тип: TEXT, INTEGER, REAL и т.д.\n" +
          "- **Строка (row / record)** — одна запись. Например, один пользователь со своими `name`, `age`, `email`.\n" +
          "- **Первичный ключ (PRIMARY KEY)** — уникальный идентификатор строки (обычно поле `id`). Гарантирует, что две строки не перепутаются.\n\n" +
          "**Самые популярные СУБД (системы управления базами данных):**\n" +
          "- **SQLite** — встроена прямо в Python, нет сервера, данные в одном файле. Идеально для обучения и небольших проектов.\n" +
          "- **PostgreSQL** — мощная, промышленная. Используется в крупных проектах.\n" +
          "- **MySQL / MariaDB** — популярна в веб.\n" +
          "- **SQLite vs PostgreSQL:** для маленьких приложений — SQLite (файл). Для серьёзных — PostgreSQL (сервер).\n\n" +
          "**SQL (Structured Query Language)** — единый язык для всех этих систем. Синтаксис немного отличается, но основы одинаковы везде. Учишь SQL один раз — работаешь с любой реляционной БД.",
        keyTakeaways: [
          "Реляционная БД хранит данные в таблицах (как листы Excel) с чёткой схемой столбцов.",
          "Строка = одна запись, столбец = один атрибут, PRIMARY KEY = уникальный ID строки.",
          "SQLite встроена в Python — не нужно устанавливать ничего дополнительно.",
          "SQL — один язык для всех реляционных СУБД. Выучи раз, используй везде.",
        ],
        pitfalls: [
          "«База данных» — это не Excel. Данные нормализованы: каждый факт хранится в одном месте, не дублируется.",
          "SQLite хороша для обучения, но не подходит для многопользовательских веб-приложений — используй PostgreSQL.",
        ],
      },
      {
        heading: "SELECT и FROM — первый запрос",
        tagline: "SELECT выбирает что получить, FROM — из какой таблицы",
        body:
          "**Синтаксис базового SELECT-запроса:**\n\n" +
          "```sql\nSELECT столбец1, столбец2, ...\nFROM таблица;\n```\n\n" +
          "Точка с запятой `;` в конце — признак конца SQL-запроса. В Python это необязательно, но хороший тон.\n\n" +
          "**`SELECT *`** — выбрать ВСЕ столбцы. Удобно при исследовании, но в production-коде лучше перечислять нужные столбцы явно — это быстрее и понятнее.\n\n" +
          "**Примеры:**\n" +
          "- `SELECT name, email FROM users` — получить имя и email всех пользователей\n" +
          "- `SELECT * FROM products` — получить все столбцы таблицы products\n" +
          "- `SELECT title FROM books` — только заголовки книг\n\n" +
          "**Псевдонимы с AS:**\n" +
          "```sql\nSELECT name AS имя, age AS возраст FROM users;\n```\n" +
          "`AS` переименовывает столбец в результате — удобно для читаемости.\n\n" +
          "**Порядок слов SQL не является случайным.** Стандартная структура запроса:\n" +
          "1. `SELECT` — что выбрать\n" +
          "2. `FROM` — откуда\n" +
          "3. `WHERE` — условие (следующий раздел)\n" +
          "4. `ORDER BY` — порядок\n" +
          "5. `LIMIT` — ограничение количества\n\n" +
          "SQL не чувствителен к регистру: `select` и `SELECT` одно и то же. Но соглашение — ключевые слова ЗАГЛАВНЫМИ, имена таблиц и столбцов строчными.",
        code:
          "-- Создать таблицу\nCREATE TABLE users (\n  id    INTEGER PRIMARY KEY AUTOINCREMENT,\n  name  TEXT    NOT NULL,\n  email TEXT    UNIQUE,\n  age   INTEGER\n);\n\n" +
          "-- Выбрать все строки и все столбцы\nSELECT * FROM users;\n\n" +
          "-- Выбрать только имя и email\nSELECT name, email FROM users;\n\n" +
          "-- Переименовать столбцы в результате\nSELECT name AS имя, age AS возраст FROM users;",
        keyTakeaways: [
          "SELECT что, FROM откуда — обязательная пара для любого запроса на чтение.",
          "SELECT * удобен для изучения, но в коде лучше перечислять нужные столбцы явно.",
          "AS переименовывает столбец в результате, не в таблице.",
          "SQL нечувствителен к регистру; по соглашению — ключевые слова ЗАГЛАВНЫМИ.",
        ],
      },
      {
        heading: "WHERE — фильтрация строк",
        tagline: "WHERE оставляет только строки, удовлетворяющие условию",
        body:
          "**WHERE** позволяет выбрать не все строки, а только те, которые соответствуют условию.\n\n" +
          "```sql\nSELECT * FROM users WHERE age > 18;\n```\n\n" +
          "**Операторы сравнения в WHERE:**\n" +
          "- `=` — равно (не `==`! В SQL одиночное равно)\n" +
          "- `!=` или `<>` — не равно\n" +
          "- `>` — больше, `<` — меньше\n" +
          "- `>=` — больше или равно, `<=` — меньше или равно\n\n" +
          "**Логические операторы:**\n" +
          "- `AND` — оба условия должны быть истинны: `WHERE age > 18 AND city = 'Москва'`\n" +
          "- `OR` — хотя бы одно условие: `WHERE city = 'Москва' OR city = 'Питер'`\n" +
          "- `NOT` — отрицание: `WHERE NOT active = 1`\n\n" +
          "**Приоритет операторов:** AND выполняется раньше OR! Используй скобки:\n" +
          "```sql\nWHERE (age > 18 AND city = 'Москва') OR (age > 21 AND city = 'Питер')\n```\n\n" +
          "**Строки в WHERE:** всегда в одинарных кавычках: `WHERE name = 'Иван'`. Двойные кавычки — для имён таблиц/столбцов.\n\n" +
          "**Важно:** WHERE фильтрует строки ДО того, как они попадают в результат. Это быстро: база не читает ненужные строки полностью.",
        code:
          "-- Только взрослые пользователи\nSELECT name, age FROM users WHERE age >= 18;\n\n" +
          "-- Пользователи из Москвы старше 25\nSELECT * FROM users WHERE city = 'Москва' AND age > 25;\n\n" +
          "-- Пользователи из Москвы ИЛИ Питера\nSELECT name, city FROM users WHERE city = 'Москва' OR city = 'Санкт-Петербург';\n\n" +
          "-- Не удалённые записи\nSELECT * FROM posts WHERE deleted != 1;\n\n" +
          "-- Скобки для правильного приоритета\nSELECT * FROM orders WHERE (status = 'new' AND amount > 1000) OR priority = 1;",
        keyTakeaways: [
          "WHERE фильтрует строки по условию; без WHERE — возвращаются ВСЕ строки таблицы.",
          "В SQL для сравнения используется `=`, не `==` (это Python-привычка).",
          "AND выполняется раньше OR — используй скобки при смешивании.",
          "Строки в WHERE — в одинарных кавычках: `WHERE name = 'Анна'`.",
        ],
        pitfalls: [
          "WHERE name = \"Иван\" — ошибка! Двойные кавычки в SQL — для имён столбцов, не строк.",
          "WHERE age = NULL — не работает! Для NULL используй `IS NULL` или `IS NOT NULL`.",
        ],
      },
      {
        heading: "NULL — особое значение: отсутствие данных",
        tagline: "NULL — это не ноль и не пустая строка, это «неизвестно»",
        body:
          "**NULL** — специальное значение, означающее *«данных нет»* или *«неизвестно»*. NULL — это не:\n" +
          "- Ноль (`0`)\n" +
          "- Пустая строка (`''`)\n" +
          "- `False`\n\n" +
          "NULL означает «значение отсутствует». Например: если пользователь не указал номер телефона — поле `phone` будет NULL, а не `''`.\n\n" +
          "**Работа с NULL в WHERE:**\n" +
          "```sql\n-- ПРАВИЛЬНО: IS NULL\nSELECT * FROM users WHERE phone IS NULL;\n\n-- ПРАВИЛЬНО: IS NOT NULL\nSELECT * FROM users WHERE email IS NOT NULL;\n\n-- НЕПРАВИЛЬНО: никогда не работает!\nSELECT * FROM users WHERE phone = NULL;  -- не найдёт ничего!\n```\n\n" +
          "Почему `= NULL` не работает? Потому что NULL — это «неизвестность». Сравнение «неизвестно = неизвестно» даёт не TRUE, а снова NULL (не-истину). Это особенность логики трёх значений в SQL (True / False / Unknown).\n\n" +
          "**COALESCE** — заменить NULL дефолтным значением:\n" +
          "```sql\nSELECT name, COALESCE(phone, 'не указан') AS phone FROM users;\n```\n" +
          "Если `phone` NULL — вернёт строку `'не указан'`.",
        code:
          "-- Пользователи без email\nSELECT name FROM users WHERE email IS NULL;\n\n" +
          "-- Пользователи С email\nSELECT name, email FROM users WHERE email IS NOT NULL;\n\n" +
          "-- COALESCE: заменить NULL дефолтом\nSELECT\n  name,\n  COALESCE(phone, 'не указан') AS phone,\n  COALESCE(age, 0) AS age\nFROM users;\n\n" +
          "-- IFNULL в SQLite (аналог COALESCE для двух аргументов)\nSELECT name, IFNULL(city, 'неизвестно') AS city FROM users;",
        keyTakeaways: [
          "NULL — отсутствие значения. NULL != 0, NULL != '', NULL != False.",
          "Проверяй на NULL только через IS NULL / IS NOT NULL, не через = NULL.",
          "COALESCE(выражение, дефолт) заменяет NULL на дефолтное значение.",
          "Любая арифметика с NULL даёт NULL: `5 + NULL = NULL`.",
        ],
        pitfalls: [
          "WHERE age = NULL всегда вернёт 0 строк — это частая ошибка новичков.",
          "NULL в NOT IN() список делает весь запрос пустым — будь осторожен с подзапросами.",
        ],
      },
      {
        heading: "SQLite в Python: первые шаги",
        tagline: "import sqlite3 — база данных в одной строке без установки",
        body:
          "SQLite — единственная СУБД, встроенная прямо в Python. Не нужно устанавливать сервер, не нужны внешние библиотеки. База данных — это просто файл `.db` на диске.\n\n" +
          "**Минимальный код для работы с SQLite:**\n\n" +
          "```python\nimport sqlite3\n\n# 1. Открыть / создать файл БД\nconn = sqlite3.connect('my_database.db')\n\n# 2. Создать курсор — объект для выполнения SQL\ncursor = conn.cursor()\n\n# 3. Выполнить SQL\ncursor.execute('SELECT * FROM users')\n\n# 4. Получить результат\nrows = cursor.fetchall()  # список кортежей\n\n# 5. Закрыть соединение\nconn.close()\n```\n\n" +
          "**Ключевые объекты:**\n" +
          "- `conn` (`Connection`) — соединение с базой. Один файл БД = одно соединение.\n" +
          "- `cursor` (`Cursor`) — «указатель» для выполнения запросов. Один cursor может выполнять много запросов.\n\n" +
          "**`:memory:`** — специальное имя вместо файла: база хранится только в RAM и удаляется при закрытии. Отлично подходит для тестов:\n" +
          "```python\nconn = sqlite3.connect(':memory:')  # только в памяти\n```\n\n" +
          "**Важно:** SQLite создаёт файл автоматически, если он не существует. Это безопасно: `connect('app.db')` не вызовет ошибку при первом запуске.",
        code:
          "import sqlite3\n\n# Создать базу (или открыть существующую)\nconn = sqlite3.connect('students.db')\ncursor = conn.cursor()\n\n# Создать таблицу, если её нет\ncursor.execute('''\n  CREATE TABLE IF NOT EXISTS students (\n    id    INTEGER PRIMARY KEY AUTOINCREMENT,\n    name  TEXT    NOT NULL,\n    grade INTEGER,\n    city  TEXT\n  )\n''')\nconn.commit()  # сохранить изменения структуры\n\n# Вставить тестовую запись\ncursor.execute(\"INSERT INTO students (name, grade, city) VALUES ('Алиса', 5, 'Москва')\")\nconn.commit()\n\n# Прочитать всё\ncursor.execute('SELECT * FROM students')\nrows = cursor.fetchall()\nprint(rows)  # [(1, 'Алиса', 5, 'Москва')]\n\nconn.close()",
        keyTakeaways: [
          "import sqlite3 — всё встроено в Python, ничего устанавливать не нужно.",
          "conn = sqlite3.connect('file.db') открывает или создаёт файл БД.",
          "cursor.execute('SQL') выполняет запрос; fetchall() возвращает все строки.",
          "conn.commit() обязателен после INSERT, UPDATE, DELETE — иначе изменения не сохранятся.",
        ],
        pitfalls: [
          "Забыть conn.commit() после изменений — данные потеряются при закрытии.",
          "Один cursor можно использовать повторно; создавать новый cursor на каждый запрос не нужно.",
        ],
      },
    ],
  },
  fills: [
    {
      type: "fill",
      id: "sql1-f1",
      title: "Первый SELECT-запрос",
      description: "Получи имя и email всех пользователей из таблицы `users`.",
      language: "python",
      code:
        "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute(\"CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, age INTEGER)\")\ncursor.execute(\"INSERT INTO users VALUES (1, 'Алиса', 'alice@mail.ru', 25)\")\ncursor.execute(\"INSERT INTO users VALUES (2, 'Боб', 'bob@mail.ru', 17)\")\nconn.commit()\n\n# Выбрать только name и email из таблицы users\ncursor.execute(\"{{0}} name, email {{1}} users\")\nrows = cursor.fetchall()\nprint(rows)\nconn.close()",
      answers: [["SELECT", "select"], ["FROM", "from"]],
      hints: [
        "Ключевое слово для выбора столбцов — SELECT",
        "Ключевое слово для указания таблицы — FROM",
      ],
    },
    {
      type: "fill",
      id: "sql1-f2",
      title: "WHERE — фильтрация",
      description: "Выбери только совершеннолетних (age >= 18) пользователей.",
      language: "python",
      code:
        "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute(\"CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)\")\ncursor.execute(\"INSERT INTO users VALUES (1, 'Алиса', 25)\")\ncursor.execute(\"INSERT INTO users VALUES (2, 'Боб', 17)\")\ncursor.execute(\"INSERT INTO users VALUES (3, 'Вика', 20)\")\nconn.commit()\n\ncursor.execute(\"SELECT name, age FROM users {{0}} age {{1}} 18\")\nrows = cursor.fetchall()\nprint(rows)  # [('Алиса', 25), ('Вика', 20)]\nconn.close()",
      answers: [["WHERE", "where"], [">=", ">= ", "≥"]],
      hints: [
        "Ключевое слово для фильтрации строк — WHERE",
        "Оператор «больше или равно» — >=",
      ],
    },
    {
      type: "fill",
      id: "sql1-f3",
      title: "NULL — проверка отсутствия значения",
      description: "Найди пользователей, у которых не указан email (email IS NULL).",
      language: "python",
      code:
        "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute(\"CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)\")\ncursor.execute(\"INSERT INTO users VALUES (1, 'Алиса', 'alice@example.com')\")\ncursor.execute(\"INSERT INTO users VALUES (2, 'Боб', NULL)\")\ncursor.execute(\"INSERT INTO users VALUES (3, 'Вика', NULL)\")\nconn.commit()\n\ncursor.execute(\"SELECT name FROM users WHERE email {{0}} {{1}}\")\nrows = cursor.fetchall()\nprint(rows)  # [('Боб',), ('Вика',)]\nconn.close()",
      answers: [["IS", "is"], ["NULL", "null"]],
      hints: [
        "Для проверки на NULL используй IS, а не =",
        "Значение — NULL (не строка 'NULL')",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "sql1-q1",
      title: "Что делает SELECT *?",
      question: "Что означает звёздочка (*) в запросе SELECT * FROM table?",
      answers: [
        "выбрать все столбцы",
        "все столбцы",
        "выбрать все колонки",
        "звёздочка означает все столбцы",
        "все поля",
        "выбрать все поля",
        "select all columns",
        "all columns",
        "все данные",
        "получить все колонки",
        "все",
      ],
      hint: "Звёздочка — это маска/wildcard, обозначающая «все»",
      explanation: "SELECT * выбирает все столбцы таблицы. Удобно для быстрого просмотра, но в рабочем коде лучше явно перечислять нужные столбцы для читаемости и производительности.",
    },
    {
      type: "question",
      id: "sql1-q2",
      title: "Как проверить на NULL?",
      question: "Как правильно проверить, что значение в столбце phone равно NULL?",
      answers: [
        "IS NULL",
        "is null",
        "WHERE phone IS NULL",
        "phone IS NULL",
        "использовать IS NULL",
        "через IS NULL",
        "оператор IS NULL",
      ],
      hint: "Для NULL нельзя использовать оператор = (равенства)",
      explanation: "NULL нельзя сравнивать через = — это даст пустой результат. Правильно: WHERE phone IS NULL. Обратная проверка: WHERE phone IS NOT NULL.",
    },
    {
      type: "question",
      id: "sql1-q3",
      title: "Что такое PRIMARY KEY?",
      question: "Для чего нужен PRIMARY KEY в таблице?",
      answers: [
        "уникальный идентификатор строки",
        "уникальный id записи",
        "первичный ключ — уникальный идентификатор",
        "uniquely identifies a row",
        "гарантирует уникальность строки",
        "неповторяющийся ключ",
        "primary key уникально идентифицирует строку",
        "ключ уникальности",
        "уникальный ключ таблицы",
        "гарантирует что строки не повторяются",
      ],
      hint: "PRIMARY KEY гарантирует что-то про каждую строку таблицы",
      explanation: "PRIMARY KEY (первичный ключ) — столбец (или комбинация столбцов), значение которого уникально для каждой строки. Позволяет однозначно идентифицировать любую запись. Обычно это числовой ID с AUTOINCREMENT.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "sql1-w1",
      title: "Создай базу данных и сделай первый запрос",
      task:
        "Используй Python и sqlite3:\n1. Создай базу в памяти (:memory:)\n2. Создай таблицу `books` с полями: id (INTEGER PRIMARY KEY), title (TEXT), author (TEXT), year (INTEGER)\n3. Вставь 3 книги (любые)\n4. Выведи все книги, у которых год > 2000",
      hints: [
        "import sqlite3 и conn = sqlite3.connect(':memory:')",
        "CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, ...)",
        "INSERT INTO books (title, author, year) VALUES (...)",
        "SELECT * FROM books WHERE year > 2000",
      ],
      required: ["sqlite3", "CREATE TABLE", "INSERT INTO", "WHERE", "fetchall"],
      minLines: 10,
      language: "python",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 2 · SQL Light — Сортировка, ограничения и специальные фильтры
// ─────────────────────────────────────────────────────────────────────────────
const sql2: Round = {
  number: 2,
  title: "SQL Light · ORDER BY, LIMIT, BETWEEN, LIKE, DISTINCT",
  level: "Начальный",
  intro:
    "В первом раунде ты научился читать данные и фильтровать их по условию. Теперь — управляй порядком и количеством:\n\n" +
    "• `ORDER BY` — сортировка результата\n" +
    "• `LIMIT` и `OFFSET` — постраничный вывод\n" +
    "• `BETWEEN`, `IN`, `LIKE` — удобные фильтры\n" +
    "• `DISTINCT` — убрать дубликаты",
  lesson: {
    title: "Сортировка, ограничения и специальные операторы",
    summary:
      "ORDER BY для сортировки; LIMIT/OFFSET для пагинации; BETWEEN/IN/LIKE для удобной фильтрации; DISTINCT для уникальных значений.",
    readingMinutes: 18,
    sections: [
      {
        heading: "ORDER BY — сортировка результатов",
        tagline: "Без ORDER BY порядок строк не гарантирован — всегда сортируй явно",
        body:
          "По умолчанию SQL-запрос возвращает строки в произвольном порядке (зависит от внутренней структуры базы). Если тебе нужен определённый порядок — используй **ORDER BY**.\n\n" +
          "**Синтаксис:**\n" +
          "```sql\nSELECT * FROM products ORDER BY price;          -- по возрастанию (ASC по умолчанию)\nSELECT * FROM products ORDER BY price DESC;     -- по убыванию\nSELECT * FROM products ORDER BY price ASC;      -- явно по возрастанию\n```\n\n" +
          "**ASC** (ascending — по возрастанию) — от меньшего к большему, от А до Я. Это поведение по умолчанию — можно не писать.\n" +
          "**DESC** (descending — по убыванию) — от большего к меньшему, от Я до А.\n\n" +
          "**Сортировка по нескольким столбцам:**\n" +
          "```sql\nSELECT * FROM students ORDER BY grade DESC, name ASC;\n```\n" +
          "Сначала сортирует по оценке (убывание), при одинаковых оценках — по имени (возрастание).\n\n" +
          "**NULL при сортировке:** в SQLite NULL-значения идут последними при ASC и первыми при DESC. В PostgreSQL поведение другое (можно управлять через NULLS FIRST/LAST).\n\n" +
          "**Сортировка по позиции столбца:**\n" +
          "```sql\nSELECT name, age, city FROM users ORDER BY 2 DESC;  -- по второму столбцу (age)\n```\n" +
          "Удобно для интерактивных запросов, но в коде лучше писать явное имя столбца.",
        code:
          "-- По возрастанию цены\nSELECT name, price FROM products ORDER BY price;\n\n" +
          "-- Самые дорогие товары — сверху\nSELECT name, price FROM products ORDER BY price DESC;\n\n" +
          "-- Сначала по категории, потом по цене\nSELECT name, category, price\nFROM products\nORDER BY category ASC, price DESC;\n\n" +
          "-- Новые пользователи первыми\nSELECT name, created_at FROM users ORDER BY created_at DESC;",
        keyTakeaways: [
          "ORDER BY без ASC/DESC — сортирует по возрастанию (ASC) по умолчанию.",
          "DESC (descending) — по убыванию; ASC (ascending) — по возрастанию.",
          "Можно сортировать по нескольким столбцам через запятую.",
          "Без ORDER BY порядок строк не определён — не полагайся на него.",
        ],
      },
      {
        heading: "LIMIT и OFFSET — управление количеством строк",
        tagline: "LIMIT ограничивает количество строк, OFFSET пропускает первые N",
        body:
          "**LIMIT** ограничивает количество возвращаемых строк.\n\n" +
          "```sql\nSELECT * FROM products ORDER BY price DESC LIMIT 10;  -- топ-10 дорогих\n```\n\n" +
          "**OFFSET** пропускает указанное количество строк. Используется вместе с LIMIT для постраничного вывода (пагинации):\n" +
          "```sql\nSELECT * FROM products LIMIT 10 OFFSET 0;   -- страница 1 (строки 1-10)\nSELECT * FROM products LIMIT 10 OFFSET 10;  -- страница 2 (строки 11-20)\nSELECT * FROM products LIMIT 10 OFFSET 20;  -- страница 3 (строки 21-30)\n```\n\n" +
          "**Формула для страницы N (нумерация с 1):**\n" +
          "`OFFSET = (N - 1) * LIMIT`\n\n" +
          "В Python это выглядит так:\n" +
          "```python\npage = 2\nper_page = 10\noffset = (page - 1) * per_page\ncursor.execute('SELECT * FROM products LIMIT ? OFFSET ?', (per_page, offset))\n```\n\n" +
          "**LIMIT без ORDER BY** — не стоит использовать: порядок строк случаен и может измениться. Всегда комбинируй LIMIT с ORDER BY.\n\n" +
          "**Важно:** LIMIT и OFFSET работают с уже отфильтрованным и отсортированным результатом. Сначала выполняется WHERE, потом ORDER BY, потом LIMIT/OFFSET.",
        code:
          "-- Топ-5 самых популярных товаров\nSELECT name, views FROM products ORDER BY views DESC LIMIT 5;\n\n" +
          "-- Пагинация в Python\nimport sqlite3\n\ndef get_page(db_path, page=1, per_page=10):\n    offset = (page - 1) * per_page\n    conn = sqlite3.connect(db_path)\n    cursor = conn.cursor()\n    cursor.execute(\n        'SELECT * FROM products ORDER BY id LIMIT ? OFFSET ?',\n        (per_page, offset)\n    )\n    rows = cursor.fetchall()\n    conn.close()\n    return rows\n\n# Получить 2-ю страницу\npage2 = get_page('shop.db', page=2, per_page=10)",
        keyTakeaways: [
          "LIMIT N — вернуть не более N строк.",
          "OFFSET K — пропустить первые K строк.",
          "Для пагинации: LIMIT per_page OFFSET (page-1)*per_page.",
          "Всегда используй ORDER BY вместе с LIMIT — иначе строки случайные.",
        ],
        pitfalls: [
          "LIMIT без ORDER BY возвращает «случайные» строки — в разных запусках результат может отличаться.",
          "OFFSET медленно работает на больших таблицах (OFFSET 1000000 всё равно читает миллион строк).",
        ],
      },
      {
        heading: "BETWEEN, IN и LIKE — специальные операторы фильтрации",
        tagline: "Удобные альтернативы для диапазонов, списков и шаблонов",
        body:
          "**BETWEEN ... AND ...** — проверяет, что значение попадает в диапазон (включительно):\n" +
          "```sql\nSELECT * FROM products WHERE price BETWEEN 100 AND 500;\n-- Эквивалентно: WHERE price >= 100 AND price <= 500\n```\n\n" +
          "**IN (список)** — проверяет, есть ли значение в списке:\n" +
          "```sql\nSELECT * FROM users WHERE city IN ('Москва', 'Питер', 'Казань');\n-- Эквивалентно: WHERE city = 'Москва' OR city = 'Питер' OR city = 'Казань'\n```\n" +
          "Намного удобнее длинной цепочки OR.\n\n" +
          "**NOT IN (список)** — наоборот:\n" +
          "```sql\nSELECT * FROM products WHERE category NOT IN ('одежда', 'обувь');\n```\n\n" +
          "**LIKE** — поиск по шаблону (pattern matching):\n" +
          "- `%` — любое количество любых символов (в том числе ноль)\n" +
          "- `_` — ровно один любой символ\n" +
          "```sql\nSELECT * FROM users WHERE name LIKE 'Али%';     -- начинается с 'Али'\nSELECT * FROM users WHERE email LIKE '%@gmail%'; -- содержит '@gmail'\nSELECT * FROM users WHERE phone LIKE '7___';     -- 7 и ровно 3 цифры\n```\n\n" +
          "**LIKE регистрозависимость:** в SQLite LIKE нечувствителен к регистру для ASCII-букв, но чувствителен для кириллицы. В PostgreSQL LIKE чувствителен; используй `ILIKE` для нечувствительного поиска.\n\n" +
          "**GLOB (SQLite)** — альтернатива LIKE, чувствительна к регистру, использует `*` и `?` как в файловой системе.",
        code:
          "-- Товары в ценовом диапазоне 500-2000 рублей\nSELECT name, price FROM products WHERE price BETWEEN 500 AND 2000;\n\n" +
          "-- Пользователи из конкретных городов\nSELECT name, city FROM users WHERE city IN ('Москва', 'Питер', 'Екатеринбург');\n\n" +
          "-- Поиск по имени — начинается с 'Мар'\nSELECT * FROM users WHERE name LIKE 'Мар%';\n\n" +
          "-- Email от Gmail\nSELECT name, email FROM users WHERE email LIKE '%@gmail.com';\n\n" +
          "-- Имена ровно 5 букв\nSELECT name FROM users WHERE name LIKE '_____';",
        keyTakeaways: [
          "BETWEEN A AND B — включительно (>= A AND <= B).",
          "IN (a, b, c) — короткая замена длинной цепочке OR.",
          "LIKE '%текст%' — поиск подстроки; `%` = любое количество символов, `_` = один символ.",
          "NOT BETWEEN, NOT IN, NOT LIKE — отрицания этих операторов.",
        ],
        pitfalls: [
          "LIKE '%текст%' медленно работает на больших таблицах без специального индекса — для серьёзного поиска используй полнотекстовый поиск.",
          "NOT IN (подзапрос_с_NULL) вернёт 0 строк — NULL в списке ломает NOT IN.",
        ],
      },
      {
        heading: "DISTINCT — убрать дубликаты",
        tagline: "DISTINCT оставляет только уникальные значения в результате",
        body:
          "Иногда нужно получить список уникальных значений, без повторений. Например, все города, в которых есть пользователи:\n" +
          "```sql\nSELECT DISTINCT city FROM users;\n```\n" +
          "Без DISTINCT — один и тот же город встретится столько раз, сколько пользователей из него.\n\n" +
          "**DISTINCT работает для всей строки**, не отдельного столбца. При нескольких столбцах — уникальность определяется комбинацией всех столбцов:\n" +
          "```sql\nSELECT DISTINCT city, country FROM users;\n-- Уникальные пары (город, страна)\n```\n\n" +
          "**COUNT(DISTINCT столбец)** — подсчитать количество уникальных значений:\n" +
          "```sql\nSELECT COUNT(DISTINCT city) FROM users;\n-- Сколько разных городов?\n```\n\n" +
          "**Когда использовать DISTINCT:**\n" +
          "- Получить список категорий товаров\n" +
          "- Узнать все уникальные статусы заказов\n" +
          "- Подсчитать число уникальных покупателей\n\n" +
          "**DISTINCT vs GROUP BY:** оба убирают дубликаты, но GROUP BY позволяет ещё и агрегировать данные (COUNT, SUM и т.д.). Для простых уникальных значений — DISTINCT проще.",
        code:
          "-- Список всех городов пользователей (без дублей)\nSELECT DISTINCT city FROM users ORDER BY city;\n\n" +
          "-- Все уникальные категории товаров\nSELECT DISTINCT category FROM products;\n\n" +
          "-- Уникальные пары город+страна\nSELECT DISTINCT city, country FROM users ORDER BY country, city;\n\n" +
          "-- Сколько уникальных городов?\nSELECT COUNT(DISTINCT city) AS cities_count FROM users;",
        keyTakeaways: [
          "DISTINCT убирает дублирующиеся строки из результата.",
          "COUNT(DISTINCT column) — количество уникальных значений столбца.",
          "DISTINCT с несколькими столбцами — уникальность по комбинации.",
          "DISTINCT немного замедляет запрос (нужно сравнивать все строки).",
        ],
      },
    ],
  },
  fills: [
    {
      type: "fill",
      id: "sql2-f1",
      title: "Сортировка по убыванию",
      description: "Получи товары, отсортированные по цене от дорогих к дешёвым.",
      language: "python",
      code:
        "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL)')\ncursor.execute(\"INSERT INTO products VALUES (1, 'Телефон', 25000)\")\ncursor.execute(\"INSERT INTO products VALUES (2, 'Наушники', 3000)\")\ncursor.execute(\"INSERT INTO products VALUES (3, 'Ноутбук', 75000)\")\nconn.commit()\n\ncursor.execute('SELECT name, price FROM products {{0}} {{1}} {{2}}')\nrows = cursor.fetchall()\nprint(rows)  # [('Ноутбук', 75000), ('Телефон', 25000), ('Наушники', 3000)]\nconn.close()",
      answers: [["ORDER BY", "order by"], ["price", "price "], ["DESC", "desc"]],
      hints: [
        "Для сортировки используй ORDER BY",
        "Сортируем по столбцу price",
        "Убывание — DESC",
      ],
    },
    {
      type: "fill",
      id: "sql2-f2",
      title: "LIKE — поиск по шаблону",
      description: "Найди пользователей, чьё имя начинается с буквы 'А'.",
      language: "python",
      code:
        "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)')\ncursor.execute(\"INSERT INTO users VALUES (1, 'Алиса')\")\ncursor.execute(\"INSERT INTO users VALUES (2, 'Боб')\")\ncursor.execute(\"INSERT INTO users VALUES (3, 'Андрей')\")\nconn.commit()\n\ncursor.execute(\"SELECT name FROM users WHERE name {{0}} '{{1}}'\")\nrows = cursor.fetchall()\nprint(rows)  # [('Алиса',), ('Андрей',)]\nconn.close()",
      answers: [["LIKE", "like"], ["А%", "А%"]],
      hints: [
        "Для поиска по шаблону используй LIKE",
        "% означает «любые символы», поставь % после 'А'",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "sql2-q1",
      title: "Что делает ASC в ORDER BY?",
      question: "В каком направлении сортирует ORDER BY name ASC?",
      answers: [
        "по возрастанию",
        "от А до Я",
        "ascending",
        "от меньшего к большему",
        "ascending order",
        "возрастающий порядок",
        "алфавитный порядок",
        "от a до z",
        "ascending — по возрастанию",
      ],
      hint: "ASC расшифровывается как ascending (возрастающий)",
      explanation: "ASC (ascending — возрастающий) сортирует от меньшего к большему, строки от А до Я. Это поведение ORDER BY по умолчанию — можно не писать ASC явно.",
    },
    {
      type: "question",
      id: "sql2-q2",
      title: "LIMIT и OFFSET для пагинации",
      question: "Как получить вторую страницу, если на странице 10 товаров?",
      answers: [
        "LIMIT 10 OFFSET 10",
        "limit 10 offset 10",
        "offset 10",
        "OFFSET 10 LIMIT 10",
        "LIMIT 10 OFFSET 10",
        "пропустить 10 и взять 10",
        "skip 10 take 10",
      ],
      hint: "Формула: OFFSET = (номер_страницы - 1) × размер_страницы",
      explanation: "Вторая страница (page=2), по 10 записей: LIMIT 10 OFFSET 10. Формула: OFFSET = (page-1) * per_page = (2-1)*10 = 10.",
    },
    {
      type: "question",
      id: "sql2-q3",
      title: "Что означает % в LIKE?",
      question: "Что означает символ % (процент) в операторе LIKE?",
      answers: [
        "любое количество любых символов",
        "любые символы",
        "любая строка",
        "подстановочный знак",
        "wildcard",
        "любое количество символов",
        "заменяет любые символы",
        "маска любых символов",
        "любой текст",
        "ноль или более символов",
      ],
      hint: "% — это wildcard (маска) в LIKE",
      explanation: "% в LIKE означает «любое количество любых символов» (в том числе ноль). WHERE name LIKE 'А%' найдёт все имена, начинающиеся с А. WHERE email LIKE '%@gmail%' найдёт все Gmail-адреса.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "sql2-w1",
      title: "Поиск и сортировка",
      task:
        "Создай таблицу `movies` с полями: id, title (TEXT), year (INTEGER), rating (REAL).\n" +
        "Вставь 5 фильмов.\n" +
        "1. Выведи фильмы с рейтингом >= 7.0, отсортированные по рейтингу (от лучших)\n" +
        "2. Выведи только 3 самых новых фильма (по году)\n" +
        "3. Найди фильмы с 'Star' в названии (LIKE)",
      hints: [
        "CREATE TABLE movies (id INTEGER PRIMARY KEY, title TEXT, year INTEGER, rating REAL)",
        "WHERE rating >= 7.0 ORDER BY rating DESC",
        "ORDER BY year DESC LIMIT 3",
        "WHERE title LIKE '%Star%'",
      ],
      required: ["CREATE TABLE", "INSERT INTO", "ORDER BY", "LIMIT", "LIKE"],
      minLines: 15,
      language: "python",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 3 · SQL Light — INSERT, UPDATE, DELETE и транзакции
// ─────────────────────────────────────────────────────────────────────────────
const sql3: Round = {
  number: 3,
  title: "SQL Light · INSERT, UPDATE, DELETE и транзакции",
  level: "Начальный",
  intro:
    "До сих пор ты только читал данные. Теперь — изменяй базу: добавляй, правь и удаляй строки.\n\n" +
    "**В этом раунде:**\n" +
    "• `INSERT INTO` — добавить новые строки\n" +
    "• `UPDATE ... SET ... WHERE` — изменить существующие строки\n" +
    "• `DELETE FROM ... WHERE` — удалить строки\n" +
    "• Транзакции: почему важен `commit()` и когда делать `rollback()`",
  lesson: {
    title: "Изменение данных: INSERT, UPDATE, DELETE и транзакции",
    summary:
      "Как добавлять, обновлять и удалять данные; безопасные параметризованные запросы; транзакции для атомарности операций.",
    readingMinutes: 20,
    sections: [
      {
        heading: "INSERT INTO — добавить строки",
        tagline: "INSERT добавляет новые строки в таблицу",
        body:
          "**INSERT INTO** добавляет одну или несколько новых строк в таблицу.\n\n" +
          "**Синтаксис:**\n" +
          "```sql\nINSERT INTO таблица (столбец1, столбец2, ...) VALUES (значение1, значение2, ...);\n```\n\n" +
          "**Порядок важен:** имена столбцов и значения должны соответствовать друг другу по позиции.\n\n" +
          "**Можно не указывать столбцы** (но тогда значения для ВСЕХ столбцов по порядку):\n" +
          "```sql\nINSERT INTO users VALUES (1, 'Алиса', 'alice@mail.ru', 25);\n```\n" +
          "Это хрупко — если структура таблицы изменится, запрос сломается. Лучше всегда указывать имена столбцов.\n\n" +
          "**Вставить несколько строк сразу:**\n" +
          "```sql\nINSERT INTO users (name, email, age) VALUES\n  ('Алиса', 'alice@mail.ru', 25),\n  ('Боб', 'bob@mail.ru', 30),\n  ('Вика', 'vika@mail.ru', 22);\n```\n" +
          "Намного быстрее, чем вставлять каждую строку отдельным запросом!\n\n" +
          "**AUTOINCREMENT:** если у поля `id` стоит `AUTOINCREMENT` (или `INTEGER PRIMARY KEY` в SQLite — это синоним AUTOINCREMENT), не нужно указывать id при вставке — база сама назначит следующий.\n\n" +
          "**Последний вставленный ID:**\n" +
          "```python\ncursor.execute(\"INSERT INTO users (name) VALUES ('Алиса')\")\nnew_id = cursor.lastrowid  # id только что вставленной строки\n```",
        code:
          "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('''\n  CREATE TABLE users (\n    id    INTEGER PRIMARY KEY AUTOINCREMENT,\n    name  TEXT    NOT NULL,\n    email TEXT,\n    age   INTEGER\n  )\n''')\n\n# Вставить одну строку\ncursor.execute(\n    'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',\n    ('Алиса', 'alice@mail.ru', 25)\n)\nprint('Новый ID:', cursor.lastrowid)  # 1\n\n# Вставить несколько строк сразу\nusers = [('Боб', 'bob@mail.ru', 30), ('Вика', None, 22)]\ncursor.executemany('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', users)\n\nconn.commit()\ncursor.execute('SELECT * FROM users')\nprint(cursor.fetchall())",
        keyTakeaways: [
          "INSERT INTO table (cols) VALUES (vals) — всегда указывай имена столбцов.",
          "executemany() вставляет много строк за один вызов — быстрее цикла.",
          "cursor.lastrowid — ID последней вставленной строки.",
          "conn.commit() обязателен — иначе данные не сохранятся.",
        ],
        pitfalls: [
          "INSERT без явных имён столбцов ломается при изменении схемы таблицы.",
          "Вставка в цикле (1000 отдельных INSERT) намного медленнее одного executemany.",
        ],
      },
      {
        heading: "UPDATE — изменить существующие строки",
        tagline: "UPDATE без WHERE изменит ВСЕ строки — всегда пиши WHERE!",
        body:
          "**UPDATE** изменяет значения в уже существующих строках.\n\n" +
          "**Синтаксис:**\n" +
          "```sql\nUPDATE таблица\nSET столбец1 = новое_значение1, столбец2 = новое_значение2\nWHERE условие;\n```\n\n" +
          "**КРИТИЧЕСКИ ВАЖНО:** если забыть `WHERE` — UPDATE изменит **ВСЕ** строки таблицы! Это необратимо (без транзакции).\n\n" +
          "```sql\n-- БЕЗОПАСНО — только один пользователь\nUPDATE users SET age = 26 WHERE id = 1;\n\n-- ОПАСНО! Изменит возраст ВСЕХ пользователей!\nUPDATE users SET age = 26;  -- WHERE пропущен!\n```\n\n" +
          "**Можно изменять несколько столбцов сразу:**\n" +
          "```sql\nUPDATE users SET name = 'Алиса Иванова', email = 'alice.new@mail.ru' WHERE id = 1;\n```\n\n" +
          "**Арифметика в SET:**\n" +
          "```sql\nUPDATE products SET price = price * 1.1 WHERE category = 'электроника';  -- +10% к цене\nUPDATE products SET views = views + 1 WHERE id = ?;  -- счётчик просмотров\n```\n\n" +
          "**Проверить количество изменённых строк:**\n" +
          "```python\ncursor.execute('UPDATE users SET active = 0 WHERE last_login < ?', (cutoff_date,))\nprint(f'Деактивировано: {cursor.rowcount} пользователей')\n```",
        code:
          "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL, stock INTEGER)')\ncursor.execute(\"INSERT INTO products VALUES (1, 'Телефон', 20000, 10)\")\ncursor.execute(\"INSERT INTO products VALUES (2, 'Ноутбук', 60000, 5)\")\nconn.commit()\n\n# Обновить цену конкретного товара\ncursor.execute('UPDATE products SET price = 22000 WHERE id = 1')\nprint(f'Обновлено строк: {cursor.rowcount}')  # 1\n\n# Поднять цены на электронику на 5%\ncursor.execute('UPDATE products SET price = price * 1.05')\n\n# Уменьшить склад на 1 (продажа)\ncursor.execute('UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0', (1,))\n\nconn.commit()\ncursor.execute('SELECT * FROM products')\nprint(cursor.fetchall())",
        keyTakeaways: [
          "UPDATE без WHERE — изменит ВСЕ строки. Всегда добавляй WHERE!",
          "cursor.rowcount — количество затронутых строк после UPDATE.",
          "SET может содержать выражения: price = price * 1.1, count = count + 1.",
          "Используй параметры (?) для значений — защита от SQL-инъекций.",
        ],
        pitfalls: [
          "UPDATE users SET email = 'test' без WHERE изменит email У ВСЕХ пользователей.",
          "UPDATE с condition, которое ничего не находит, не вызывает ошибку — rowcount будет 0.",
        ],
      },
      {
        heading: "DELETE FROM — удалить строки",
        tagline: "DELETE без WHERE удалит ВСЕ данные из таблицы — будь осторожен",
        body:
          "**DELETE FROM** удаляет строки из таблицы.\n\n" +
          "```sql\nDELETE FROM таблица WHERE условие;\n```\n\n" +
          "**ОПАСНО без WHERE:**\n" +
          "```sql\nDELETE FROM users WHERE id = 5;  -- удалить одного пользователя\nDELETE FROM users;                -- удалить ВСЕХ пользователей!\n```\n\n" +
          "**DELETE vs TRUNCATE vs DROP:**\n" +
          "- `DELETE FROM table` — удаляет строки (можно с WHERE, можно откатить транзакцией)\n" +
          "- `TRUNCATE TABLE table` — удаляет ВСЕ строки быстро (нет в SQLite; в PostgreSQL быстрее DELETE)\n" +
          "- `DROP TABLE table` — удаляет САМУ ТАБЛИЦУ со всеми данными и структурой\n\n" +
          "**Мягкое удаление (soft delete):** вместо настоящего DELETE многие приложения добавляют поле `is_deleted = TRUE`. Данные остаются, просто «скрыты»:\n" +
          "```sql\n-- Мягкое удаление\nUPDATE users SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE id = ?;\n\n-- Запрос с учётом мягкого удаления\nSELECT * FROM users WHERE is_deleted = 0;\n```\n" +
          "Это позволяет восстанавливать удалённые данные и вести историю.\n\n" +
          "**Проверить количество удалённых строк:**\n" +
          "```python\ncursor.execute('DELETE FROM sessions WHERE expired < ?', (cutoff,))\nprint(f'Удалено {cursor.rowcount} устаревших сессий')\n```",
        code:
          "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT, published INTEGER)')\ncursor.execute(\"INSERT INTO posts VALUES (1, 'Черновик', 0)\")\ncursor.execute(\"INSERT INTO posts VALUES (2, 'Статья 1', 1)\")\ncursor.execute(\"INSERT INTO posts VALUES (3, 'Устаревший пост', 1)\")\nconn.commit()\n\n# Удалить черновики\ncursor.execute('DELETE FROM posts WHERE published = 0')\nprint(f'Удалено черновиков: {cursor.rowcount}')  # 1\n\n# Удалить конкретный пост\ncursor.execute('DELETE FROM posts WHERE id = ?', (3,))\n\nconn.commit()\ncursor.execute('SELECT * FROM posts')\nprint(cursor.fetchall())  # [(2, 'Статья 1', 1)]",
        keyTakeaways: [
          "DELETE FROM table WHERE — без WHERE удалит все строки!",
          "cursor.rowcount после DELETE — количество удалённых строк.",
          "Мягкое удаление (soft delete) — лучше для production: данные можно восстановить.",
          "DROP TABLE удаляет таблицу целиком (структуру + данные).",
        ],
        pitfalls: [
          "DELETE FROM table (без WHERE) очищает всю таблицу — это необратимо без транзакции.",
          "Нельзя удалить строку, на которую ссылается FOREIGN KEY (нужно сначала удалить дочерние).",
        ],
      },
      {
        heading: "Параметризованные запросы — защита от SQL-инъекций",
        tagline: "Никогда не подставляй данные пользователя в строку SQL напрямую",
        body:
          "**SQL-инъекция** — одна из самых опасных уязвимостей. Если подставить данные пользователя прямо в строку запроса, злоумышленник может сломать запрос или получить все данные из базы.\n\n" +
          "**Опасный код:**\n" +
          "```python\n# ОПАСНО! SQL-инъекция возможна\nname = input('Имя: ')  # пользователь вводит: ' OR '1'='1\ncursor.execute(f\"SELECT * FROM users WHERE name = '{name}'\")\n# Получившийся запрос: SELECT * FROM users WHERE name = '' OR '1'='1'\n# Результат: вернёт ВСЕХ пользователей!\n```\n\n" +
          "**Безопасный код — параметризованные запросы:**\n" +
          "```python\n# БЕЗОПАСНО — знак ? как плейсхолдер\nname = input('Имя: ')\ncursor.execute('SELECT * FROM users WHERE name = ?', (name,))\n```\n\n" +
          "Знак `?` — это *плейсхолдер* (место для подстановки). sqlite3 автоматически экранирует значения — никакой инъекции не будет.\n\n" +
          "**Несколько параметров:**\n" +
          "```python\ncursor.execute('INSERT INTO users (name, age) VALUES (?, ?)', (name, age))\ncursor.execute('SELECT * FROM users WHERE age > ? AND city = ?', (18, city))\n```\n\n" +
          "**Важно:** параметры передаются как кортеж, даже если один: `(value,)` — обрати внимание на запятую.\n\n" +
          "**В PostgreSQL** используют `%s` вместо `?`:\n" +
          "```python\ncursor.execute('SELECT * FROM users WHERE name = %s', (name,))\n```",
        code:
          "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, password TEXT)')\ncursor.execute(\"INSERT INTO users VALUES (1, 'admin', 'secret123')\")\nconn.commit()\n\n# ОПАСНО (никогда так не делай):\ndef unsafe_login(username):\n    query = f\"SELECT * FROM users WHERE name = '{username}'\"\n    cursor.execute(query)\n    return cursor.fetchone()\n\n# БЕЗОПАСНО — параметризованный запрос:\ndef safe_login(username, password):\n    cursor.execute(\n        'SELECT * FROM users WHERE name = ? AND password = ?',\n        (username, password)  # sqlite3 сам экранирует\n    )\n    return cursor.fetchone()\n\nresult = safe_login('admin', 'secret123')\nprint('Вошёл:', result)",
        keyTakeaways: [
          "Никогда не подставляй данные пользователя напрямую в f-строку SQL.",
          "Используй ? (SQLite) или %s (PostgreSQL) как плейсхолдеры.",
          "Параметры — второй аргумент execute() как кортеж: (value,) или (val1, val2).",
          "Параметризованные запросы защищают от SQL-инъекций автоматически.",
        ],
        pitfalls: [
          "f\"SELECT * FROM users WHERE name = '{name}'\" — уязвимость SQL-инъекции!",
          "cursor.execute('SELECT ... WHERE id = ?', new_id) — ошибка: нужен кортеж (new_id,) с запятой.",
        ],
      },
      {
        heading: "Транзакции — BEGIN, COMMIT, ROLLBACK",
        tagline: "Транзакция — блок операций, который либо выполняется весь, либо не выполняется совсем",
        body:
          "**Транзакция** (transaction) — это группа SQL-операций, которые выполняются как единое целое. Либо все операции успешны — тогда они сохраняются (`COMMIT`). Либо хоть одна не удалась — тогда всё откатывается к исходному состоянию (`ROLLBACK`).\n\n" +
          "**Пример:** перевод денег между счетами.\n" +
          "```sql\nBEGIN;  -- начало транзакции\nUPDATE accounts SET balance = balance - 1000 WHERE id = 1;  -- списать\nUPDATE accounts SET balance = balance + 1000 WHERE id = 2;  -- зачислить\nCOMMIT;  -- сохранить оба изменения\n```\n" +
          "Если между первым и вторым UPDATE что-то пошло не так — ROLLBACK отменит списание.\n\n" +
          "**В Python (sqlite3):** соединение по умолчанию работает в режиме автотранзакции. `conn.commit()` сохраняет, `conn.rollback()` откатывает:\n" +
          "```python\ntry:\n    cursor.execute('UPDATE accounts SET balance = balance - ?', (amount, sender_id))\n    cursor.execute('UPDATE accounts SET balance = balance + ?', (amount, receiver_id))\n    conn.commit()  # всё ок — сохранить\nexcept Exception as e:\n    conn.rollback()  # ошибка — откатить\n    raise\n```\n\n" +
          "**Context manager (лучший подход):**\n" +
          "```python\nwith sqlite3.connect('bank.db') as conn:\n    cursor = conn.cursor()\n    # ... SQL операции ...\n    # conn.commit() вызывается автоматически при выходе\n    # conn.rollback() — автоматически при исключении\n```",
        code:
          "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE accounts (id INTEGER PRIMARY KEY, name TEXT, balance REAL)')\ncursor.execute(\"INSERT INTO accounts VALUES (1, 'Алиса', 5000)\")\ncursor.execute(\"INSERT INTO accounts VALUES (2, 'Боб', 3000)\")\nconn.commit()\n\ndef transfer(sender_id, receiver_id, amount):\n    try:\n        cursor.execute(\n            'UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?',\n            (amount, sender_id, amount)\n        )\n        if cursor.rowcount == 0:\n            raise ValueError('Недостаточно средств!')\n        cursor.execute(\n            'UPDATE accounts SET balance = balance + ? WHERE id = ?',\n            (amount, receiver_id)\n        )\n        conn.commit()\n        print(f'Перевод {amount} руб. выполнен')\n    except Exception as e:\n        conn.rollback()\n        print(f'Ошибка: {e}')\n\ntransfer(1, 2, 1000)  # Перевод 1000 руб.\ncursor.execute('SELECT * FROM accounts')\nprint(cursor.fetchall())",
        keyTakeaways: [
          "Транзакция — атомарная группа операций: либо все успешны, либо ни одной.",
          "conn.commit() сохраняет изменения; conn.rollback() откатывает.",
          "Используй try/except с rollback для надёжного кода.",
          "Context manager (with sqlite3.connect() as conn) автоматически делает commit/rollback.",
        ],
        pitfalls: [
          "Без conn.commit() изменения теряются при закрытии соединения.",
          "Длинные незакрытые транзакции блокируют таблицу для других — делай commit/rollback как можно скорее.",
        ],
      },
    ],
  },
  fills: [
    {
      type: "fill",
      id: "sql3-f1",
      title: "Безопасный INSERT с параметрами",
      description: "Вставь нового пользователя, используя параметризованный запрос (?) для защиты от инъекций.",
      language: "python",
      code:
        "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER)')\n\nname = 'Алиса'\nage = 25\ncursor.execute('{{0}} INTO users (name, age) {{1}} ({{2}}, {{2}})', (name, age))\nconn.commit()\ncursor.execute('SELECT * FROM users')\nprint(cursor.fetchall())\nconn.close()",
      answers: [["INSERT", "insert"], ["VALUES", "values"], ["?", "?, ?"]],
      hints: [
        "Команда добавления строк — INSERT",
        "Значения идут после VALUES",
        "Плейсхолдер для параметра — знак ?",
      ],
    },
    {
      type: "fill",
      id: "sql3-f2",
      title: "UPDATE с условием",
      description: "Обнови цену товара с id=1, установив новое значение 15000.",
      language: "python",
      code:
        "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL)')\ncursor.execute(\"INSERT INTO products VALUES (1, 'Телефон', 20000)\")\nconn.commit()\n\ncursor.execute('{{0}} products {{1}} price = ? {{2}} id = ?', (15000, 1))\nconn.commit()\ncursor.execute('SELECT * FROM products')\nprint(cursor.fetchall())  # [(1, 'Телефон', 15000.0)]\nconn.close()",
      answers: [["UPDATE", "update"], ["SET", "set"], ["WHERE", "where"]],
      hints: [
        "Команда изменения строк — UPDATE",
        "Присвоение нового значения идёт после SET",
        "Условие изменения — WHERE",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "sql3-q1",
      title: "Опасность UPDATE без WHERE",
      question: "Что произойдёт, если выполнить UPDATE users SET age = 0 без условия WHERE?",
      answers: [
        "изменит все строки",
        "обновит всех пользователей",
        "изменит всю таблицу",
        "обнулит возраст у всех",
        "обновит каждую строку",
        "изменится весь столбец",
        "все строки будут обновлены",
        "все записи будут изменены",
        "обновятся все пользователи",
      ],
      hint: "WHERE — это условие. Что происходит без условия?",
      explanation: "UPDATE без WHERE изменит значение указанного столбца у ВСЕХ строк таблицы. Это очень опасно — данные могут быть безвозвратно потеряны (без транзакции). Всегда проверяй, что WHERE написан правильно перед выполнением UPDATE.",
    },
    {
      type: "question",
      id: "sql3-q2",
      title: "Зачем нужен commit()?",
      question: "Что произойдёт с данными, добавленными через INSERT, если не вызвать conn.commit() и закрыть соединение?",
      answers: [
        "данные потеряются",
        "изменения не сохранятся",
        "данные не запишутся",
        "rollback автоматически",
        "потеря данных",
        "изменения откатятся",
        "данные не будут сохранены",
        "изменения не применятся",
        "данные исчезнут",
      ],
      hint: "commit() = сохранить. Что если не сохранить?",
      explanation: "Без conn.commit() транзакция автоматически откатывается при закрытии соединения. Все изменения (INSERT, UPDATE, DELETE) теряются. Всегда вызывай commit() после изменения данных.",
    },
    {
      type: "question",
      id: "sql3-q3",
      title: "Защита от SQL-инъекций",
      question: "Почему нельзя вставлять данные пользователя в SQL-запрос через f-строку?",
      answers: [
        "sql инъекция",
        "sql injection",
        "уязвимость sql injection",
        "взлом через запрос",
        "пользователь может сломать запрос",
        "sql-инъекция",
        "атака через sql",
        "данные пользователя опасны в запросе",
        "injection attack",
      ],
      hint: "Это классическая уязвимость веб-приложений",
      explanation: "f-строки в SQL опасны: злоумышленник может ввести специальные символы и изменить логику запроса (SQL-инъекция). Например: name = \"'; DROP TABLE users; --\". Безопасная альтернатива — параметры через ? с передачей значений вторым аргументом execute().",
    },
  ],
  writes: [
    {
      type: "write",
      id: "sql3-w1",
      title: "Безопасный CRUD",
      task:
        "Напиши Python-программу для управления списком задач (todo list):\n" +
        "1. Создай таблицу `tasks` (id, title TEXT, done INTEGER, created_at TEXT)\n" +
        "2. Добавь 3 задачи\n" +
        "3. Отметь первую задачу как выполненную (UPDATE ... SET done = 1)\n" +
        "4. Удали вторую задачу (DELETE ... WHERE id = 2)\n" +
        "5. Выведи все оставшиеся задачи\n\n" +
        "Используй параметризованные запросы (?) везде, где подставляешь значения.",
      hints: [
        "CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, done INTEGER DEFAULT 0, created_at TEXT)",
        "INSERT INTO tasks (title, done) VALUES (?, 0) — для каждой задачи",
        "UPDATE tasks SET done = 1 WHERE id = ?",
        "DELETE FROM tasks WHERE id = ?",
        "conn.commit() после каждой группы изменений",
      ],
      required: ["CREATE TABLE", "INSERT INTO", "UPDATE", "SET", "DELETE", "WHERE", "?"],
      minLines: 15,
      language: "python",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 4 · SQL Light — Агрегация: COUNT, GROUP BY, HAVING
// ─────────────────────────────────────────────────────────────────────────────
const sql4: Round = {
  number: 4,
  title: "SQL Light · Агрегатные функции, GROUP BY и HAVING",
  level: "Начальный",
  intro:
    "Агрегация — это когда ты обрабатываешь много строк и получаешь одно число: сумму продаж, среднее значение, количество записей.\n\n" +
    "**В этом раунде:**\n" +
    "• Агрегатные функции: COUNT, SUM, AVG, MIN, MAX\n" +
    "• GROUP BY — группировать строки для агрегации\n" +
    "• HAVING — фильтровать уже сгруппированные данные\n" +
    "• AS — псевдонимы для читаемых заголовков",
  lesson: {
    title: "Агрегация, GROUP BY и HAVING",
    summary:
      "Агрегатные функции для подсчёта и вычислений; GROUP BY для группировки по категориям; HAVING для фильтрации групп; псевдонимы AS.",
    readingMinutes: 18,
    sections: [
      {
        heading: "Агрегатные функции: COUNT, SUM, AVG, MIN, MAX",
        tagline: "Превращают множество строк в одно итоговое значение",
        body:
          "**Агрегатные функции** — функции, которые принимают набор строк и возвращают одно значение:\n\n" +
          "| Функция | Что делает | Пример |\n" +
          "|---------|------------|--------|\n" +
          "| `COUNT(*)` | Количество строк | COUNT(*) → 42 |\n" +
          "| `COUNT(col)` | Количество строк, где col не NULL | COUNT(email) |\n" +
          "| `SUM(col)` | Сумма числового столбца | SUM(price) → 150000 |\n" +
          "| `AVG(col)` | Среднее значение | AVG(age) → 27.5 |\n" +
          "| `MIN(col)` | Минимальное значение | MIN(price) → 100 |\n" +
          "| `MAX(col)` | Максимальное значение | MAX(price) → 99999 |\n\n" +
          "**Применение:**\n" +
          "```sql\nSELECT COUNT(*) FROM users;                     -- сколько всего пользователей\nSELECT SUM(price) FROM orders;                  -- общая сумма заказов\nSELECT AVG(age) FROM users WHERE active = 1;    -- средний возраст активных\nSELECT MIN(price), MAX(price) FROM products;    -- ценовой диапазон\n```\n\n" +
          "**COUNT(*) vs COUNT(col):**\n" +
          "- `COUNT(*)` считает ВСЕ строки, включая те где есть NULL\n" +
          "- `COUNT(email)` считает только строки, где `email` не NULL\n" +
          "Разница важна при работе с необязательными полями.\n\n" +
          "**ROUND()** — округление результата:\n" +
          "```sql\nSELECT ROUND(AVG(age), 1) FROM users;  -- средний возраст, 1 знак после запятой\n```",
        code:
          "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, customer TEXT, amount REAL, status TEXT)')\ndata = [\n    ('Алиса', 1500, 'paid'), ('Боб', 2300, 'paid'),\n    ('Вика', 800, 'pending'), ('Алиса', 3200, 'paid')\n]\ncursor.executemany('INSERT INTO orders (customer, amount, status) VALUES (?, ?, ?)', data)\nconn.commit()\n\n# Статистика по заказам\ncursor.execute('''\n  SELECT\n    COUNT(*)              AS total_orders,\n    SUM(amount)           AS total_revenue,\n    ROUND(AVG(amount), 2) AS avg_order,\n    MIN(amount)           AS min_order,\n    MAX(amount)           AS max_order\n  FROM orders WHERE status = 'paid'\n''')\nrow = cursor.fetchone()\nprint('Заказов:', row[0])       # 3\nprint('Выручка:', row[1])       # 7000.0\nprint('Средний:', row[2])       # 2333.33\nconn.close()",
        keyTakeaways: [
          "COUNT(*) — все строки; COUNT(col) — строки, где col не NULL.",
          "SUM, AVG, MIN, MAX работают с числовыми столбцами.",
          "ROUND(AVG(col), N) — округление до N знаков после запятой.",
          "Агрегатные функции игнорируют NULL (кроме COUNT(*)).",
        ],
      },
      {
        heading: "GROUP BY — агрегация по группам",
        tagline: "GROUP BY разбивает строки на группы и агрегирует каждую группу отдельно",
        body:
          "Без GROUP BY агрегатные функции считают по ВСЕЙ таблице. GROUP BY позволяет посчитать отдельно для каждого значения указанного столбца.\n\n" +
          "```sql\n-- Сколько заказов у каждого покупателя?\nSELECT customer, COUNT(*) AS orders_count\nFROM orders\nGROUP BY customer;\n```\n\n" +
          "**Правило SELECT + GROUP BY:** в SELECT можно указывать:\n" +
          "1. Столбцы, которые упомянуты в GROUP BY\n" +
          "2. Агрегатные функции\n\n" +
          "Нельзя: `SELECT customer, amount FROM orders GROUP BY customer` — `amount` не в GROUP BY и не агрегирован.\n\n" +
          "**GROUP BY по нескольким столбцам:**\n" +
          "```sql\nSELECT city, category, COUNT(*) AS count\nFROM products\nGROUP BY city, category\nORDER BY city, count DESC;\n```\n\n" +
          "**Порядок выполнения запроса:**\n" +
          "1. FROM — выбрать таблицу\n" +
          "2. WHERE — отфильтровать строки\n" +
          "3. GROUP BY — разбить на группы\n" +
          "4. SELECT (с агрегатами) — вычислить для каждой группы\n" +
          "5. HAVING — отфильтровать группы\n" +
          "6. ORDER BY — отсортировать\n" +
          "7. LIMIT — ограничить количество",
        code:
          "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE sales (id INTEGER PRIMARY KEY, category TEXT, product TEXT, amount REAL)')\ndata = [\n    ('электроника', 'Телефон', 25000),\n    ('электроника', 'Ноутбук', 75000),\n    ('одежда', 'Куртка', 8000),\n    ('одежда', 'Джинсы', 4500),\n    ('электроника', 'Наушники', 3000),\n]\ncursor.executemany('INSERT INTO sales (category, product, amount) VALUES (?, ?, ?)', data)\nconn.commit()\n\n# Статистика по категориям\ncursor.execute('''\n  SELECT\n    category,\n    COUNT(*)           AS items,\n    SUM(amount)        AS total,\n    ROUND(AVG(amount), 0) AS avg_price\n  FROM sales\n  GROUP BY category\n  ORDER BY total DESC\n''')\nfor row in cursor.fetchall():\n    print(row)\nconn.close()",
        keyTakeaways: [
          "GROUP BY col — разбивает строки на группы по значению col.",
          "В SELECT можно использовать только столбцы из GROUP BY + агрегатные функции.",
          "ORDER BY можно применять к агрегатным результатам.",
          "WHERE применяется ДО группировки; HAVING — ПОСЛЕ.",
        ],
        pitfalls: [
          "SELECT *, COUNT(*) FROM table GROUP BY col — ошибка: * не в GROUP BY.",
          "GROUP BY без агрегатных функций работает как DISTINCT — это валидно, но редко нужно.",
        ],
      },
      {
        heading: "HAVING — фильтр для сгруппированных данных",
        tagline: "WHERE фильтрует строки, HAVING фильтрует уже сгруппированные результаты",
        body:
          "**HAVING** — это WHERE для агрегированных данных. WHERE не может использовать агрегатные функции (COUNT, SUM и т.д.) — для этого есть HAVING.\n\n" +
          "```sql\n-- Покупатели с суммой заказов > 10000\nSELECT customer, SUM(amount) AS total\nFROM orders\nGROUP BY customer\nHAVING total > 10000;\n\n-- Категории с более чем 5 товарами\nSELECT category, COUNT(*) AS count\nFROM products\nGROUP BY category\nHAVING count > 5\nORDER BY count DESC;\n```\n\n" +
          "**WHERE vs HAVING — разница:**\n" +
          "- `WHERE` — фильтрует отдельные **строки** до группировки\n" +
          "- `HAVING` — фильтрует **группы** после агрегации\n\n" +
          "```sql\n-- WHERE: убрать отменённые заказы ДО подсчёта\n-- HAVING: оставить только покупателей с total > 5000 ПОСЛЕ подсчёта\nSELECT customer, SUM(amount) AS total\nFROM orders\nWHERE status != 'cancelled'  -- сначала убираем отменённые\nGROUP BY customer\nHAVING total > 5000;         -- потом фильтруем группы\n```\n\n" +
          "**HAVING без GROUP BY** — применяется ко всей таблице как одной группе. Редко нужно, но валидно.",
        code:
          "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, customer TEXT, amount REAL, status TEXT)')\ndata = [\n    ('Алиса', 3000, 'paid'), ('Боб', 500, 'paid'),\n    ('Алиса', 7000, 'paid'), ('Вика', 2000, 'cancelled'),\n    ('Боб', 8000, 'paid'), ('Вика', 6000, 'paid'),\n]\ncursor.executemany('INSERT INTO orders (customer, amount, status) VALUES (?, ?, ?)', data)\nconn.commit()\n\n# VIP-клиенты: оплаченные заказы > 5000 в сумме\ncursor.execute('''\n  SELECT\n    customer,\n    COUNT(*) AS orders,\n    SUM(amount) AS total\n  FROM orders\n  WHERE status = 'paid'      -- фильтр строк до группировки\n  GROUP BY customer\n  HAVING total > 5000        -- фильтр групп после агрегации\n  ORDER BY total DESC\n''')\nfor row in cursor.fetchall():\n    print(row)\nconn.close()",
        keyTakeaways: [
          "HAVING фильтрует группы после GROUP BY + агрегации.",
          "WHERE нельзя использовать с агрегатными функциями — для этого HAVING.",
          "Можно использовать WHERE и HAVING в одном запросе.",
          "HAVING COUNT(*) > N — убрать группы с малым количеством строк.",
        ],
        pitfalls: [
          "WHERE SUM(amount) > 5000 — синтаксическая ошибка. Агрегаты только в HAVING.",
          "HAVING без GROUP BY работает, но редко имеет смысл.",
        ],
      },
    ],
  },
  fills: [
    {
      type: "fill",
      id: "sql4-f1",
      title: "Подсчёт и сумма",
      description: "Посчитай количество заказов и общую сумму из таблицы orders.",
      language: "python",
      code:
        "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, amount REAL)')\ncursor.execute(\"INSERT INTO orders VALUES (1, 1500)\")\ncursor.execute(\"INSERT INTO orders VALUES (2, 2300)\")\ncursor.execute(\"INSERT INTO orders VALUES (3, 800)\")\nconn.commit()\n\ncursor.execute('SELECT {{0}}(*), {{1}}(amount) FROM orders')\nrow = cursor.fetchone()\nprint(f'Заказов: {row[0]}, Сумма: {row[1]}')  # Заказов: 3, Сумма: 4600.0\nconn.close()",
      answers: [["COUNT", "count"], ["SUM", "sum"]],
      hints: [
        "Количество строк — функция COUNT",
        "Сумма числового столбца — функция SUM",
      ],
    },
    {
      type: "fill",
      id: "sql4-f2",
      title: "GROUP BY с HAVING",
      description: "Сгруппируй заказы по покупателю и оставь только тех, у кого сумма > 3000.",
      language: "python",
      code:
        "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, customer TEXT, amount REAL)')\ndata = [('Алиса', 2000), ('Боб', 500), ('Алиса', 1500), ('Боб', 4000)]\ncursor.executemany('INSERT INTO orders (customer, amount) VALUES (?, ?)', data)\nconn.commit()\n\ncursor.execute('''\n  SELECT customer, SUM(amount) AS total\n  FROM orders\n  {{0}} customer\n  {{1}} total > 3000\n''')\nfor row in cursor.fetchall():\n    print(row)\nconn.close()",
      answers: [["GROUP BY", "group by"], ["HAVING", "having"]],
      hints: [
        "Группировка по столбцу — GROUP BY",
        "Фильтрация по агрегированному значению — HAVING",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "sql4-q1",
      title: "COUNT(*) vs COUNT(col)",
      question: "В чём разница между COUNT(*) и COUNT(email)?",
      answers: [
        "count(*) считает все строки, count(email) только где email не null",
        "count(*) все строки, count(email) не считает null",
        "count(*) считает с null, count col без null",
        "count звёздочка все строки включая null",
        "count col пропускает null значения",
        "count(*) считает включая null, count(email) игнорирует null",
      ],
      hint: "Что происходит с NULL-значениями в каждом случае?",
      explanation: "COUNT(*) считает все строки без исключения, включая строки с NULL. COUNT(email) считает только строки, где значение email НЕ равно NULL. Если у части пользователей нет email — COUNT(email) < COUNT(*).",
    },
    {
      type: "question",
      id: "sql4-q2",
      title: "WHERE vs HAVING",
      question: "Когда нужно использовать HAVING вместо WHERE?",
      answers: [
        "когда нужно фильтровать по агрегатным функциям",
        "при использовании count sum avg",
        "для фильтрации групп после group by",
        "при фильтрации агрегированных данных",
        "where не работает с агрегатами",
        "для условий на агрегатных функциях",
        "having фильтрует после группировки",
        "when filtering aggregated results",
      ],
      hint: "WHERE не может использоваться с функциями типа COUNT, SUM...",
      explanation: "HAVING используется, когда условие фильтрации включает агрегатную функцию (COUNT, SUM, AVG, MIN, MAX). WHERE фильтрует строки до группировки, HAVING — группы после агрегации. WHERE COUNT(*) > 5 — ошибка; HAVING COUNT(*) > 5 — правильно.",
    },
    {
      type: "question",
      id: "sql4-q3",
      title: "Порядок выполнения запроса",
      question: "В каком порядке SQL выполняет клаузулы: WHERE, GROUP BY, HAVING, ORDER BY?",
      answers: [
        "where, group by, having, order by",
        "WHERE затем GROUP BY затем HAVING затем ORDER BY",
        "сначала where, потом group by, потом having",
        "where → group by → having → order by",
        "фильтр, группировка, фильтр групп, сортировка",
      ],
      hint: "WHERE фильтрует строки, потом группировка, потом фильтр групп",
      explanation: "Порядок выполнения SQL-запроса: 1) FROM, 2) WHERE (фильтр строк), 3) GROUP BY (группировка), 4) Агрегатные функции, 5) HAVING (фильтр групп), 6) SELECT, 7) ORDER BY, 8) LIMIT.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "sql4-w1",
      title: "Аналитика продаж",
      task:
        "Создай таблицу `sales` (id, product TEXT, category TEXT, amount REAL, date TEXT).\n" +
        "Вставь 8-10 продаж из разных категорий.\n" +
        "Напиши запросы:\n" +
        "1. Общая выручка и количество продаж по каждой категории\n" +
        "2. Среднее значение продажи по всей таблице\n" +
        "3. Категории с суммарной выручкой > 10000\n" +
        "4. Самая дорогая продажа в каждой категории",
      hints: [
        "SELECT category, COUNT(*), SUM(amount) FROM sales GROUP BY category",
        "SELECT AVG(amount) FROM sales",
        "HAVING SUM(amount) > 10000",
        "SELECT category, MAX(amount) FROM sales GROUP BY category",
      ],
      required: ["GROUP BY", "COUNT", "SUM", "AVG", "HAVING"],
      minLines: 20,
      language: "python",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 5 · SQL Light — JOIN: объединение таблиц
// ─────────────────────────────────────────────────────────────────────────────
const sql5: Round = {
  number: 5,
  title: "SQL Light · JOIN — объединение таблиц",
  level: "Средний",
  intro:
    "Реляционная часть реляционных баз данных — связи между таблицами. JOIN позволяет объединить данные из нескольких таблиц в одном запросе.\n\n" +
    "**В этом раунде:**\n" +
    "• PRIMARY KEY и FOREIGN KEY — как связать таблицы\n" +
    "• INNER JOIN — только совпадающие строки\n" +
    "• LEFT JOIN — все строки из левой таблицы\n" +
    "• Псевдонимы таблиц для удобства",
  lesson: {
    title: "JOIN: объединение таблиц и связи между ними",
    summary:
      "Первичный и внешний ключи для связей; INNER JOIN для совпадающих строк; LEFT JOIN когда нужны все строки; псевдонимы таблиц.",
    readingMinutes: 22,
    sections: [
      {
        heading: "PRIMARY KEY и FOREIGN KEY — как связать таблицы",
        tagline: "Внешний ключ — это ссылка из одной таблицы на строку другой таблицы",
        body:
          "В реальных базах данных информация разделяется по нескольким таблицам — чтобы не дублировать данные. Например:\n" +
          "- Таблица `users` — информация о пользователях\n" +
          "- Таблица `orders` — заказы, каждый принадлежит пользователю\n\n" +
          "**Нормализация** — принцип: каждый факт хранится в одном месте. Не нужно копировать имя пользователя в каждый заказ — достаточно хранить `user_id`.\n\n" +
          "**PRIMARY KEY (первичный ключ)** — уникальный идентификатор строки в своей таблице. Обычно это поле `id`.\n\n" +
          "**FOREIGN KEY (внешний ключ)** — столбец в одной таблице, ссылающийся на PRIMARY KEY другой таблицы:\n" +
          "```sql\nCREATE TABLE users (\n  id   INTEGER PRIMARY KEY AUTOINCREMENT,\n  name TEXT NOT NULL\n);\n\nCREATE TABLE orders (\n  id      INTEGER PRIMARY KEY AUTOINCREMENT,\n  user_id INTEGER REFERENCES users(id),  -- внешний ключ!\n  amount  REAL\n);\n```\n\n" +
          "Поле `user_id` в таблице `orders` — это ссылка на строку в таблице `users`. Так база «знает», чей это заказ.\n\n" +
          "**Важно в SQLite:** внешние ключи по умолчанию не проверяются. Нужно включить явно:\n" +
          "```python\ncursor.execute('PRAGMA foreign_keys = ON')\n```\n\n" +
          "**Типы связей:**\n" +
          "- **Один к одному (1:1)** — один пользователь, один профиль\n" +
          "- **Один ко многим (1:N)** — один пользователь, много заказов ✓\n" +
          "- **Многие ко многим (N:M)** — студенты и курсы (нужна промежуточная таблица)",
        code:
          "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('PRAGMA foreign_keys = ON')  # включить проверку FK в SQLite\n\ncursor.execute('''\n  CREATE TABLE users (\n    id   INTEGER PRIMARY KEY AUTOINCREMENT,\n    name TEXT NOT NULL,\n    city TEXT\n  )\n''')\ncursor.execute('''\n  CREATE TABLE orders (\n    id      INTEGER PRIMARY KEY AUTOINCREMENT,\n    user_id INTEGER NOT NULL REFERENCES users(id),\n    product TEXT,\n    amount  REAL\n  )\n''')\n\n# Добавить пользователей\ncursor.execute(\"INSERT INTO users (name, city) VALUES ('Алиса', 'Москва')\")\ncursor.execute(\"INSERT INTO users (name, city) VALUES ('Боб', 'Питер')\")\n\n# Добавить заказы (user_id ссылается на users.id)\ncursor.execute(\"INSERT INTO orders (user_id, product, amount) VALUES (1, 'Телефон', 25000)\")\ncursor.execute(\"INSERT INTO orders (user_id, product, amount) VALUES (1, 'Чехол', 500)\")\ncursor.execute(\"INSERT INTO orders (user_id, product, amount) VALUES (2, 'Ноутбук', 65000)\")\nconn.commit()",
        keyTakeaways: [
          "FOREIGN KEY — ссылка из одной таблицы на PRIMARY KEY другой.",
          "Нормализация: не дублируй данные — храни только ID со ссылкой.",
          "В SQLite нужно включать проверку FK: PRAGMA foreign_keys = ON.",
          "Самая распространённая связь — один ко многим (1:N).",
        ],
      },
      {
        heading: "INNER JOIN — только совпадающие строки",
        tagline: "INNER JOIN возвращает строки, у которых есть соответствие в обеих таблицах",
        body:
          "**JOIN (INNER JOIN)** — объединяет строки из двух таблиц, когда выполняется условие связи.\n\n" +
          "```sql\nSELECT columns\nFROM table1\nINNER JOIN table2 ON table1.key = table2.foreign_key;\n```\n\n" +
          "**Ключевое:** `ON table1.column = table2.column` — условие совпадения. Обычно это первичный ключ одной таблицы и внешний ключ другой.\n\n" +
          "```sql\n-- Получить заказы с именами покупателей\nSELECT\n  users.name,\n  orders.product,\n  orders.amount\nFROM orders\nINNER JOIN users ON orders.user_id = users.id;\n```\n\n" +
          "**Псевдонимы таблиц** — короткие имена для удобства:\n" +
          "```sql\nSELECT u.name, o.product, o.amount\nFROM orders AS o\nINNER JOIN users AS u ON o.user_id = u.id;\n\n-- Ключевое слово AS можно опустить:\nFROM orders o\nJOIN users u ON o.user_id = u.id\n```\n\n" +
          "**INNER JOIN** = только строки, у которых ЕСТЬ соответствие в обеих таблицах. Если у пользователя нет заказов — он не попадёт в результат. Если у заказа нет пользователя (NULL в user_id) — такой заказ тоже не попадёт.\n\n" +
          "**Ключевое слово:** `JOIN` без INNER — то же самое что INNER JOIN. Это алиас.",
        code:
          "# (продолжение предыдущего примера)\n\n# INNER JOIN: заказы с именами покупателей\ncursor.execute('''\n  SELECT\n    u.name   AS покупатель,\n    o.product AS товар,\n    o.amount  AS сумма\n  FROM orders AS o\n  INNER JOIN users AS u ON o.user_id = u.id\n  ORDER BY o.amount DESC\n''')\nfor row in cursor.fetchall():\n    print(row)\n# ('Боб', 'Ноутбук', 65000)\n# ('Алиса', 'Телефон', 25000)\n# ('Алиса', 'Чехол', 500)\n\n# Агрегация с JOIN\ncursor.execute('''\n  SELECT\n    u.name,\n    COUNT(o.id)   AS orders_count,\n    SUM(o.amount) AS total_spent\n  FROM users u\n  INNER JOIN orders o ON o.user_id = u.id\n  GROUP BY u.id, u.name\n  ORDER BY total_spent DESC\n''')\nfor row in cursor.fetchall():\n    print(row)",
        keyTakeaways: [
          "INNER JOIN возвращает только строки с совпадением в обеих таблицах.",
          "ON указывает условие совпадения — обычно FK = PK.",
          "Псевдонимы (AS u, AS o) делают длинные запросы читаемыми.",
          "JOIN без INNER = INNER JOIN, это синонимы.",
        ],
        pitfalls: [
          "Без WHERE или ON при JOIN — декартово произведение (каждая строка с каждой)!",
          "Одинаковые имена столбцов в двух таблицах: всегда указывай table.column или псевдоним.",
        ],
      },
      {
        heading: "LEFT JOIN — все строки из левой таблицы",
        tagline: "LEFT JOIN возвращает все строки из левой таблицы, даже если совпадений нет",
        body:
          "**LEFT JOIN** (LEFT OUTER JOIN) возвращает:\n" +
          "- Все строки из **левой** таблицы (той, что после FROM)\n" +
          "- Соответствующие строки из правой таблицы\n" +
          "- Если совпадения нет — правая часть заполняется NULL\n\n" +
          "```sql\n-- Все пользователи, даже без заказов\nSELECT u.name, o.product, o.amount\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id;\n-- Если у пользователя нет заказов: name = 'Вика', product = NULL, amount = NULL\n```\n\n" +
          "**Когда использовать LEFT JOIN:**\n" +
          "- Когда нужны все записи из одной таблицы + связанные данные, если есть\n" +
          "- Найти «сироты» — строки без связанных записей\n\n" +
          "**Найти пользователей без заказов:**\n" +
          "```sql\nSELECT u.name\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE o.id IS NULL;  -- нет соответствующей строки в orders\n```\n\n" +
          "**INNER vs LEFT JOIN:**\n" +
          "- INNER JOIN: Алиса (3 заказа) + Боб (1 заказ) → 4 строки\n" +
          "- LEFT JOIN: Алиса (3 заказа) + Боб (1 заказ) + Вика (нет заказов, NULL) → 5 строк\n\n" +
          "**RIGHT JOIN** — зеркально LEFT JOIN (все из правой). В SQLite не поддерживается — просто поменяй таблицы местами.\n\n" +
          "**FULL OUTER JOIN** — все строки из обеих таблиц. В SQLite нет, в PostgreSQL есть.",
        code:
          "# Добавим пользователя без заказов\ncursor.execute(\"INSERT INTO users (name, city) VALUES ('Вика', 'Казань')\")\nconn.commit()\n\n# LEFT JOIN: все пользователи + их заказы (включая тех, у кого нет заказов)\ncursor.execute('''\n  SELECT\n    u.name,\n    u.city,\n    COUNT(o.id)        AS orders_count,\n    COALESCE(SUM(o.amount), 0) AS total_spent\n  FROM users u\n  LEFT JOIN orders o ON o.user_id = u.id\n  GROUP BY u.id, u.name, u.city\n  ORDER BY total_spent DESC\n''')\nfor row in cursor.fetchall():\n    print(row)\n# ('Боб', 'Питер', 1, 65000)\n# ('Алиса', 'Москва', 2, 25500)\n# ('Вика', 'Казань', 0, 0)  <- NULL заменён на 0 через COALESCE\n\n# Найти пользователей без заказов\ncursor.execute('''\n  SELECT u.name\n  FROM users u\n  LEFT JOIN orders o ON o.user_id = u.id\n  WHERE o.id IS NULL\n''')\nprint('Без заказов:', cursor.fetchall())",
        keyTakeaways: [
          "LEFT JOIN — все из левой таблицы; совпадения из правой или NULL.",
          "COALESCE(SUM(col), 0) заменяет NULL на 0 при агрегации с LEFT JOIN.",
          "WHERE right_table.id IS NULL — найти строки без связанных записей.",
          "INNER JOIN < LEFT JOIN по количеству строк (если есть несовпадения).",
        ],
        pitfalls: [
          "COALESCE нужен при агрегации с LEFT JOIN — иначе SUM возвращает NULL вместо 0.",
          "LEFT JOIN + WHERE на правую таблицу (без IS NULL) фактически превращается в INNER JOIN.",
        ],
      },
    ],
  },
  fills: [
    {
      type: "fill",
      id: "sql5-f1",
      title: "INNER JOIN двух таблиц",
      description: "Получи имя пользователя и сумму каждого его заказа через INNER JOIN.",
      language: "python",
      code:
        "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)')\ncursor.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, amount REAL)')\ncursor.execute(\"INSERT INTO users VALUES (1, 'Алиса'), (2, 'Боб')\")\ncursor.execute(\"INSERT INTO orders VALUES (1, 1, 1500), (2, 1, 2500), (3, 2, 3000)\")\nconn.commit()\n\ncursor.execute('''\n  SELECT u.name, o.amount\n  FROM orders o\n  {{0}} users u {{1}} o.user_id = u.id\n''')\nfor row in cursor.fetchall():\n    print(row)\nconn.close()",
      answers: [
        ["INNER JOIN", "JOIN", "inner join", "join"],
        ["ON", "on"],
      ],
      hints: [
        "Для объединения таблиц — INNER JOIN (или просто JOIN)",
        "Условие совпадения записывается после ON",
      ],
    },
    {
      type: "fill",
      id: "sql5-f2",
      title: "LEFT JOIN — пользователи без заказов",
      description: "Найди пользователей, у которых нет ни одного заказа.",
      language: "python",
      code:
        "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)')\ncursor.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER)')\ncursor.execute(\"INSERT INTO users VALUES (1, 'Алиса'), (2, 'Боб'), (3, 'Вика')\")\ncursor.execute(\"INSERT INTO orders VALUES (1, 1), (2, 2)\")\nconn.commit()\n\ncursor.execute('''\n  SELECT u.name\n  FROM users u\n  {{0}} orders o ON o.user_id = u.id\n  WHERE o.id {{1}} NULL\n''')\nprint(cursor.fetchall())  # [('Вика',)]\nconn.close()",
      answers: [["LEFT JOIN", "left join"], ["IS", "is"]],
      hints: [
        "Чтобы получить ВСЕХ пользователей включая без заказов — LEFT JOIN",
        "Отсутствие совпадения в правой таблице — IS NULL",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "sql5-q1",
      title: "INNER vs LEFT JOIN",
      question: "В чём ключевое отличие LEFT JOIN от INNER JOIN?",
      answers: [
        "left join включает строки без совпадений из левой таблицы",
        "left join возвращает все строки из левой таблицы",
        "left join оставляет строки даже без совпадения",
        "inner join исключает строки без совпадений",
        "left join с null в правой части",
        "left join all left rows even without match",
        "левый джоин включает несовпадающие строки",
      ],
      hint: "INNER — только совпадения. LEFT — ?",
      explanation: "LEFT JOIN возвращает ВСЕ строки из левой таблицы (после FROM), а правая часть заполняется NULL, если совпадений нет. INNER JOIN возвращает только строки с совпадением в обеих таблицах.",
    },
    {
      type: "question",
      id: "sql5-q2",
      title: "Что такое FOREIGN KEY?",
      question: "Для чего нужен FOREIGN KEY в таблице orders?",
      answers: [
        "ссылка на первичный ключ другой таблицы",
        "связывает таблицы",
        "внешний ключ ссылается на id другой таблицы",
        "связь между таблицами",
        "references другой таблицы",
        "указывает на строку в другой таблице",
        "foreign key = ссылка на pk другой таблицы",
        "обеспечивает целостность данных",
      ],
      hint: "Как orders 'знает', чей это заказ?",
      explanation: "FOREIGN KEY — это столбец, который ссылается на PRIMARY KEY другой таблицы. В таблице orders поле user_id является внешним ключом, ссылающимся на users.id. Это обеспечивает ссылочную целостность данных.",
    },
    {
      type: "question",
      id: "sql5-q3",
      title: "ON в JOIN",
      question: "Что указывает условие ON в запросе JOIN?",
      answers: [
        "условие совпадения строк",
        "по какому столбцу объединять таблицы",
        "условие связи таблиц",
        "какие строки считать совпавшими",
        "on задаёт условие объединения",
        "условие для соединения строк",
        "связь между первичным и внешним ключом",
      ],
      hint: "ON указывает, по какому условию строки 'совпадают'",
      explanation: "ON задаёт условие, по которому строки из двух таблиц считаются 'совпавшими' и объединяются. Обычно: ON child_table.foreign_key = parent_table.primary_key.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "sql5-w1",
      title: "База данных блога",
      task:
        "Создай две таблицы:\n" +
        "- `authors` (id, name TEXT, email TEXT)\n" +
        "- `posts` (id, author_id INTEGER, title TEXT, views INTEGER)\n\n" +
        "Вставь 2-3 авторов и 5-6 постов.\n" +
        "Напиши запросы:\n" +
        "1. Все посты с именем автора (INNER JOIN)\n" +
        "2. Все авторы и количество их постов (включая авторов без постов — LEFT JOIN)\n" +
        "3. Топ-3 поста по просмотрам с именем автора",
      hints: [
        "CREATE TABLE posts (id INTEGER PRIMARY KEY, author_id INTEGER REFERENCES authors(id), ...)",
        "INNER JOIN authors ON posts.author_id = authors.id",
        "LEFT JOIN + GROUP BY + COUNT(posts.id)",
        "ORDER BY views DESC LIMIT 3",
      ],
      required: ["INNER JOIN", "LEFT JOIN", "ON", "GROUP BY", "COUNT"],
      minLines: 20,
      language: "python",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 6 · SQL Light — Python + sqlite3: полноценная работа с базой
// ─────────────────────────────────────────────────────────────────────────────
const sql6: Round = {
  number: 6,
  title: "SQL Light · Python + sqlite3 — полноценная работа с БД",
  level: "Средний",
  intro:
    "Теперь соединим SQL-знания с Python: научимся профессионально работать со sqlite3.\n\n" +
    "**В этом раунде:**\n" +
    "• Модуль sqlite3 — полное API\n" +
    "• Row factory — именованные столбцы\n" +
    "• executemany — эффективная массовая вставка\n" +
    "• Context manager — автоматический commit/rollback\n" +
    "• Обработка ошибок базы данных",
  lesson: {
    title: "Python + sqlite3: профессиональная работа с базой данных",
    summary:
      "Полное API sqlite3; Row factory для именованных колонок; executemany для массовых операций; context manager; обработка исключений.",
    readingMinutes: 20,
    sections: [
      {
        heading: "sqlite3 — полное API модуля",
        tagline: "connect, cursor, execute, fetch — все методы которые нужны",
        body:
          "**sqlite3** — модуль стандартной библиотеки Python для работы с SQLite. Изучи все ключевые методы:\n\n" +
          "**Connection (соединение):**\n" +
          "- `sqlite3.connect(path)` — открыть/создать БД\n" +
          "- `conn.commit()` — сохранить изменения\n" +
          "- `conn.rollback()` — отменить изменения\n" +
          "- `conn.close()` — закрыть соединение\n" +
          "- `conn.execute(sql)` — быстрый запрос без явного cursor\n\n" +
          "**Cursor (курсор):**\n" +
          "- `cursor.execute(sql, params)` — выполнить запрос\n" +
          "- `cursor.executemany(sql, list_of_params)` — много строк\n" +
          "- `cursor.fetchone()` — одна строка (или None)\n" +
          "- `cursor.fetchall()` — все строки как список кортежей\n" +
          "- `cursor.fetchmany(n)` — n строк\n" +
          "- `cursor.rowcount` — затронуто строк после INSERT/UPDATE/DELETE\n" +
          "- `cursor.lastrowid` — id последней вставленной строки\n" +
          "- `cursor.description` — имена столбцов результата\n\n" +
          "**Итерация по курсору (экономно с памятью):**\n" +
          "```python\ncursor.execute('SELECT * FROM users')\nfor row in cursor:  # строки читаются по одной\n    print(row)\n```\n" +
          "Это лучше, чем `fetchall()` при миллионах строк — не загружает всё в память.\n\n" +
          "**isolation_level=None — autocommit:**\n" +
          "```python\nconn = sqlite3.connect('db.sqlite', isolation_level=None)\n# каждый запрос коммитится автоматически\n```",
        code:
          "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\n\n# Создать и наполнить\ncursor.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)')\ncursor.executemany(\n    'INSERT INTO users (name, age) VALUES (?, ?)',\n    [('Алиса', 25), ('Боб', 30), ('Вика', 22), ('Гриша', 28)]\n)\nconn.commit()\n\n# Различные способы получить данные\ncursor.execute('SELECT * FROM users WHERE age > 24')\nprint('fetchone:', cursor.fetchone())  # первая строка\nprint('fetchmany(2):', cursor.fetchmany(2))  # следующие 2\n\n# Итерация\ncursor.execute('SELECT * FROM users ORDER BY age')\nfor row in cursor:\n    print(row)\n\n# rowcount\ncursor.execute('UPDATE users SET age = age + 1 WHERE age < 30')\nprint(f'Обновлено: {cursor.rowcount}')  # 3\nconn.commit()\nconn.close()",
        keyTakeaways: [
          "cursor.fetchone() — одна строка или None; fetchall() — все строки.",
          "for row in cursor — эффективная итерация без загрузки всего в память.",
          "cursor.rowcount — сколько строк затронул UPDATE/DELETE/INSERT.",
          "cursor.description[i][0] — имя i-го столбца в результате.",
        ],
      },
      {
        heading: "Row Factory — словари вместо кортежей",
        tagline: "Именованные столбцы делают код понятным: row['name'] вместо row[0]",
        body:
          "По умолчанию sqlite3 возвращает строки как кортежи: `(1, 'Алиса', 25)`. Обращаться к полям по индексу (`row[1]`) неудобно и хрупко.\n\n" +
          "**Row Factory** — механизм замены кортежей на именованные строки.\n\n" +
          "**sqlite3.Row** — специальный тип, который ведёт себя и как кортеж, и как словарь:\n" +
          "```python\nconn.row_factory = sqlite3.Row\n\ncursor.execute('SELECT name, age FROM users WHERE id = ?', (1,))\nrow = cursor.fetchone()\n\nprint(row['name'])  # 'Алиса' — доступ по имени столбца\nprint(row[0])       # 'Алиса' — доступ по индексу тоже работает\nprint(dict(row))    # {'name': 'Алиса', 'age': 25} — конвертировать в словарь\n```\n\n" +
          "**Когда устанавливать:** сразу после `connect()`, до первого запроса.\n\n" +
          "**Список словарей из fetchall:**\n" +
          "```python\nconn.row_factory = sqlite3.Row\ncursor.execute('SELECT * FROM users')\nusers = [dict(row) for row in cursor.fetchall()]\n# [{'id': 1, 'name': 'Алиса', 'age': 25}, ...]\n```\n\n" +
          "**Пользовательский row_factory:**\n" +
          "```python\ndef dict_factory(cursor, row):\n    return {col[0]: row[i] for i, col in enumerate(cursor.description)}\nconn.row_factory = dict_factory\n# Теперь fetchall() возвращает список обычных dict\n```",
        code:
          "import sqlite3\n\nconn = sqlite3.connect(':memory:')\nconn.row_factory = sqlite3.Row  # включить именованные строки\n\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL, stock INTEGER)')\ncursor.executemany(\n    'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',\n    [('Телефон', 25000, 10), ('Ноутбук', 75000, 3), ('Наушники', 3000, 20)]\n)\nconn.commit()\n\ncursor.execute('SELECT * FROM products ORDER BY price DESC')\nfor row in cursor.fetchall():\n    # Доступ по имени — читаемо!\n    print(f\"{row['name']}: {row['price']} руб., склад: {row['stock']} шт.\")\n\n# Конвертировать в список словарей (удобно для JSON API)\ncursor.execute('SELECT id, name, price FROM products')\nproducts_list = [dict(row) for row in cursor.fetchall()]\nprint(products_list)",
        keyTakeaways: [
          "conn.row_factory = sqlite3.Row — именованные строки вместо кортежей.",
          "row['column_name'] — доступ по имени столбца.",
          "dict(row) — преобразовать Row в обычный словарь.",
          "Устанавливай row_factory сразу после connect(), до запросов.",
        ],
      },
      {
        heading: "Context manager и обработка ошибок",
        tagline: "with-блок гарантирует commit при успехе и rollback при ошибке",
        body:
          "**Context manager для соединения:**\n\n" +
          "sqlite3 поддерживает протокол `with`. При использовании `with conn:` — автоматически делает `commit()` при нормальном выходе и `rollback()` при исключении:\n" +
          "```python\nwith sqlite3.connect('db.sqlite') as conn:\n    cursor = conn.cursor()\n    cursor.execute('INSERT INTO users (name) VALUES (?)', ('Алиса',))\n    # commit() вызывается автоматически при выходе из блока\n    # rollback() — автоматически при любом исключении\n```\n\n" +
          "**Важно:** `with conn:` не закрывает соединение! Только управляет транзакцией.\n\n" +
          "**Обработка специфичных исключений sqlite3:**\n" +
          "```python\ntry:\n    cursor.execute('INSERT INTO users (id, name) VALUES (1, ?)', ('Копия',))\nexcept sqlite3.IntegrityError:\n    print('Ошибка: нарушение ограничения (id уже существует)')  \nexcept sqlite3.OperationalError as e:\n    print(f'Ошибка базы: {e}')  # таблица не существует и т.п.\n```\n\n" +
          "**Иерархия исключений sqlite3:**\n" +
          "- `sqlite3.Error` — базовое исключение всех ошибок БД\n" +
          "- `sqlite3.IntegrityError` — нарушение ограничений (UNIQUE, NOT NULL, FK)\n" +
          "- `sqlite3.OperationalError` — ошибки при работе (нет таблицы, нет файла)\n" +
          "- `sqlite3.ProgrammingError` — ошибки в коде (неверный SQL, неверные параметры)\n\n" +
          "**Паттерн надёжной записи:**\n" +
          "```python\nwith sqlite3.connect('db.sqlite') as conn:\n    try:\n        cursor = conn.cursor()\n        # операции...\n    except sqlite3.IntegrityError as e:\n        print(f'Дубликат или нарушение ограничения: {e}')\n        # rollback сделает with-блок при выходе\n        raise\n```",
        code:
          "import sqlite3\n\n# Паттерн: context manager + Row factory + обработка ошибок\ndef create_user(db_path, name, email):\n    try:\n        with sqlite3.connect(db_path) as conn:\n            conn.row_factory = sqlite3.Row\n            cursor = conn.cursor()\n            cursor.execute(\n                'INSERT INTO users (name, email) VALUES (?, ?)',\n                (name, email)\n            )\n            new_id = cursor.lastrowid\n            # commit() будет вызван автоматически\n        return {'id': new_id, 'name': name, 'email': email}\n    except sqlite3.IntegrityError:\n        return None  # email уже занят (UNIQUE)\n\ndef get_user(db_path, user_id):\n    with sqlite3.connect(db_path) as conn:\n        conn.row_factory = sqlite3.Row\n        cursor = conn.cursor()\n        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))\n        row = cursor.fetchone()\n        return dict(row) if row else None\n\n# Тест\nimport tempfile, os\ndb = tempfile.mktemp(suffix='.db')\nwith sqlite3.connect(db) as conn:\n    conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE)')\nresult = create_user(db, 'Алиса', 'alice@mail.ru')\nprint('Создан:', result)\nos.unlink(db)",
        keyTakeaways: [
          "with conn: автоматически commit при успехе, rollback при исключении.",
          "IntegrityError — нарушение UNIQUE, NOT NULL, FOREIGN KEY.",
          "OperationalError — нет таблицы, нет файла, синтаксическая ошибка.",
          "with conn: не закрывает соединение — только управляет транзакцией.",
        ],
        pitfalls: [
          "with sqlite3.connect() as conn: conn.close() — не нужно вызывать close() внутри with.",
          "Лови sqlite3.IntegrityError отдельно от OperationalError — они означают разные проблемы.",
        ],
      },
    ],
  },
  fills: [
    {
      type: "fill",
      id: "sql6-f1",
      title: "Row Factory — именованные строки",
      description: "Настрой row_factory чтобы получать именованные строки, и обратись к полям по имени.",
      language: "python",
      code:
        "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.{{0}} = sqlite3.{{1}}\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)')\ncursor.execute(\"INSERT INTO users VALUES (1, 'Алиса', 25)\")\nconn.commit()\n\ncursor.execute('SELECT * FROM users')\nrow = cursor.fetchone()\nprint(row['name'])  # 'Алиса'\nprint(row['age'])   # 25\nconn.close()",
      answers: [["row_factory", "row_factory "], ["Row", "Row "]],
      hints: [
        "Свойство соединения для именованных строк — row_factory",
        "Класс для именованных строк из модуля sqlite3 — Row",
      ],
    },
    {
      type: "fill",
      id: "sql6-f2",
      title: "executemany — массовая вставка",
      description: "Вставь список пользователей через executemany за один вызов.",
      language: "python",
      code:
        "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER)')\n\nusers = [('Алиса', 25), ('Боб', 30), ('Вика', 22)]\ncursor.{{0}}('INSERT INTO users (name, age) {{1}} (?, ?)', users)\nconn.commit()\ncursor.execute('SELECT COUNT(*) FROM users')\nprint(cursor.fetchone()[0])  # 3\nconn.close()",
      answers: [["executemany", "executemany "], ["VALUES", "values"]],
      hints: [
        "Метод для вставки нескольких строк за раз — executemany",
        "Ключевое слово перед плейсхолдерами — VALUES",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "sql6-q1",
      title: "fetchone vs fetchall",
      question: "Что возвращает cursor.fetchone() если строк в результате нет?",
      answers: [
        "None",
        "none",
        "null",
        "возвращает None",
        "ничего не возвращает (None)",
        "пустое значение None",
      ],
      hint: "fetchone() возвращает одну строку или... что?",
      explanation: "cursor.fetchone() возвращает первую строку результата или None, если строк нет. Важно проверять: row = cursor.fetchone(); if row is not None: ...",
    },
    {
      type: "question",
      id: "sql6-q2",
      title: "Row Factory для словарей",
      question: "Как настроить sqlite3 чтобы fetchall() возвращал строки с именованными полями?",
      answers: [
        "conn.row_factory = sqlite3.Row",
        "row_factory = sqlite3.Row",
        "установить row_factory",
        "sqlite3.Row",
        "conn.row_factory",
        "через row_factory",
      ],
      hint: "Нужно установить одно свойство объекта conn",
      explanation: "conn.row_factory = sqlite3.Row — устанавливается сразу после connect(), до создания курсора. После этого row['column_name'] работает для доступа к полям по имени.",
    },
    {
      type: "question",
      id: "sql6-q3",
      title: "context manager sqlite3",
      question: "Что происходит с транзакцией при выходе из `with sqlite3.connect('db') as conn:` без ошибок?",
      answers: [
        "автоматически commit",
        "commit вызывается",
        "изменения сохраняются",
        "conn.commit()",
        "автоматически коммитит",
        "транзакция коммитится",
        "changes are committed",
      ],
      hint: "context manager автоматически управляет транзакцией",
      explanation: "При нормальном выходе из `with conn:` — автоматически вызывается commit(). При возникновении исключения — rollback(). Это делает код надёжным без явных try/except для commit/rollback.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "sql6-w1",
      title: "Менеджер задач с sqlite3",
      task:
        "Напиши класс `TaskManager` для управления задачами через sqlite3:\n" +
        "- `__init__(self, db_path)` — создать соединение, включить row_factory, создать таблицу tasks\n" +
        "- `add(title: str) -> int` — добавить задачу, вернуть id\n" +
        "- `complete(task_id: int)` — отметить как выполненную\n" +
        "- `delete(task_id: int)` — удалить задачу\n" +
        "- `list_pending() -> list[dict]` — список невыполненных задач\n\n" +
        "Используй context manager и row_factory. Протестируй все методы.",
      hints: [
        "self.conn = sqlite3.connect(db_path); self.conn.row_factory = sqlite3.Row",
        "with self.conn: cursor.execute('INSERT INTO tasks ...')",
        "SELECT * FROM tasks WHERE done = 0",
        "[dict(row) for row in cursor.fetchall()]",
      ],
      required: ["sqlite3", "row_factory", "sqlite3.Row", "fetchall", "commit"],
      minLines: 30,
      language: "python",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 7 · SQL Light — Полное приложение: индексы и оптимизация
// ─────────────────────────────────────────────────────────────────────────────
const sql7: Round = {
  number: 7,
  title: "SQL Light · Индексы, оптимизация и полное приложение",
  level: "Средний",
  intro:
    "Финальный раунд: собираем всё вместе и добавляем важные темы для продакшн-кода.\n\n" +
    "**В этом раунде:**\n" +
    "• CREATE INDEX — ускорение запросов\n" +
    "• EXPLAIN QUERY PLAN — понять как работает запрос\n" +
    "• CREATE VIEW — виртуальные таблицы\n" +
    "• Полное приложение «Библиотека» с CRUD и статистикой",
  lesson: {
    title: "Индексы, VIEW и полное приложение на SQLite",
    summary:
      "Зачем нужны индексы и как их создавать; EXPLAIN для анализа запросов; VIEW для часто используемых запросов; полноценное CRUD-приложение.",
    readingMinutes: 22,
    sections: [
      {
        heading: "Индексы — ускорение запросов в 100-1000 раз",
        tagline: "Индекс — как указатель в конце книги: быстро найти нужные данные без перелистывания всего",
        body:
          "**Проблема без индекса:** при запросе `WHERE email = 'alice@mail.ru'` база читает каждую строку таблицы последовательно (full table scan). При 1 000 000 строк — это медленно.\n\n" +
          "**Индекс** — отдельная структура данных (обычно B-дерево), которая хранит отсортированные значения столбца и позиции соответствующих строк. Поиск по индексу — как бинарный поиск: за O(log N) вместо O(N).\n\n" +
          "**Создание индекса:**\n" +
          "```sql\n-- Обычный индекс по одному столбцу\nCREATE INDEX idx_users_email ON users(email);\n\n-- Уникальный индекс (гарантирует уникальность)\nCREATE UNIQUE INDEX idx_users_email_unique ON users(email);\n\n-- Составной индекс по нескольким столбцам\nCREATE INDEX idx_orders_user_date ON orders(user_id, created_at);\n\n-- Удалить индекс\nDROP INDEX idx_users_email;\n```\n\n" +
          "**Когда индекс ускоряет:**\n" +
          "- `WHERE col = value` — поиск по значению\n" +
          "- `WHERE col > value` — диапазон\n" +
          "- `ORDER BY col` — сортировка\n" +
          "- `JOIN ON table1.col = table2.col` — объединение таблиц\n\n" +
          "**Когда индекс НЕ ускоряет:**\n" +
          "- `WHERE col LIKE '%text%'` — поиск по вхождению (wildcard в начале)\n" +
          "- `WHERE UPPER(col) = 'VALUE'` — функция от индексированного столбца\n\n" +
          "**Цена индекса:** замедляет INSERT/UPDATE/DELETE (нужно обновлять и индекс). Не создавай индексы на все подряд — только на часто используемые столбцы в WHERE и JOIN.",
        code:
          "import sqlite3\nimport time\n\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, age INTEGER)')\n\n# Вставить 100_000 тестовых строк\ndata = [(f'User{i}', f'user{i}@mail.ru', 20 + i % 60) for i in range(100_000)]\ncursor.executemany('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', data)\nconn.commit()\n\n# Поиск БЕЗ индекса\nstart = time.time()\ncursor.execute('SELECT * FROM users WHERE email = ?', ('user50000@mail.ru',))\ncursor.fetchone()\nprint(f'Без индекса: {(time.time()-start)*1000:.1f} мс')\n\n# Создать индекс по email\ncursor.execute('CREATE INDEX idx_email ON users(email)')\n\n# Поиск С индексом\nstart = time.time()\ncursor.execute('SELECT * FROM users WHERE email = ?', ('user50000@mail.ru',))\ncursor.fetchone()\nprint(f'С индексом:  {(time.time()-start)*1000:.1f} мс')\n# Ожидаемо: с индексом в 10-100x быстрее",
        keyTakeaways: [
          "Индекс ускоряет поиск по WHERE и JOIN в 10-1000 раз на больших таблицах.",
          "PRIMARY KEY и UNIQUE столбцы индексируются автоматически.",
          "Индекс замедляет запись — создавай только на нужные столбцы.",
          "Составной индекс (col1, col2) работает для WHERE col1 = ? AND col2 = ?.",
        ],
        pitfalls: [
          "WHERE UPPER(email) = 'TEST' не использует индекс на email — функция от столбца.",
          "WHERE col LIKE '%text' — индекс не поможет, когда % в начале шаблона.",
        ],
      },
      {
        heading: "EXPLAIN QUERY PLAN — анализ плана запроса",
        tagline: "Понять, как база выполняет запрос, чтобы найти узкие места",
        body:
          "**EXPLAIN QUERY PLAN** показывает, какие шаги будет делать база при выполнении запроса — в частности, использует ли она индекс или сканирует всю таблицу.\n\n" +
          "```sql\nEXPLAIN QUERY PLAN\nSELECT * FROM users WHERE email = 'alice@mail.ru';\n```\n\n" +
          "**Что искать в результате:**\n" +
          "- `SCAN users` — полное сканирование (медленно на больших таблицах)\n" +
          "- `SEARCH users USING INDEX idx_email` — использует индекс (быстро!)\n" +
          "- `SEARCH users USING INTEGER PRIMARY KEY` — поиск по PK (очень быстро)\n\n" +
          "```python\ncursor.execute('EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = ?', ('alice@mail.ru',))\nfor row in cursor.fetchall():\n    print(row[3])  # описание шага\n```\n\n" +
          "**Результаты:**\n" +
          "- До индекса: `SCAN users` — читает все строки\n" +
          "- После индекса: `SEARCH users USING INDEX idx_email (email=?)` — быстрый поиск\n\n" +
          "**PRAGMA table_info** — посмотреть структуру таблицы:\n" +
          "```python\ncursor.execute('PRAGMA table_info(users)')\nfor col in cursor.fetchall():\n    print(col)  # (id, name, type, notnull, default, pk)\n```",
        code:
          "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, status TEXT, amount REAL)')\n\n# Проверить план запроса\ncursor.execute('EXPLAIN QUERY PLAN SELECT * FROM orders WHERE status = ?', ('paid',))\nplan_before = cursor.fetchall()\nprint('До индекса:', plan_before[0][3])\n# 'SCAN orders'\n\n# Создать индекс\ncursor.execute('CREATE INDEX idx_status ON orders(status)')\n\n# Снова проверить план\ncursor.execute('EXPLAIN QUERY PLAN SELECT * FROM orders WHERE status = ?', ('paid',))\nplan_after = cursor.fetchall()\nprint('После индекса:', plan_after[0][3])\n# 'SEARCH orders USING INDEX idx_status (status=?)'\n\n# Просмотр структуры таблицы\ncursor.execute('PRAGMA table_info(orders)')\nfor col in cursor.fetchall():\n    cid, name, ctype, notnull, default, pk = col\n    print(f'  {name} {ctype}{\" NOT NULL\" if notnull else \"\"}{\" PRIMARY KEY\" if pk else \"\"}')",
        keyTakeaways: [
          "EXPLAIN QUERY PLAN показывает использует ли запрос индекс.",
          "SCAN = полное сканирование (медленно). SEARCH USING INDEX = быстро.",
          "PRAGMA table_info(table) — структура таблицы из Python.",
          "Используй EXPLAIN при оптимизации медленных запросов.",
        ],
      },
      {
        heading: "VIEW — виртуальные таблицы",
        tagline: "VIEW сохраняет сложный запрос под простым именем — как макрос для SQL",
        body:
          "**VIEW (представление)** — именованный SQL-запрос, который выглядит как таблица. Данные в VIEW не хранятся физически — при каждом запросе к VIEW выполняется исходный SELECT.\n\n" +
          "**Создание VIEW:**\n" +
          "```sql\nCREATE VIEW active_users AS\nSELECT id, name, email\nFROM users\nWHERE is_active = 1 AND deleted_at IS NULL;\n\n-- Теперь можно использовать как таблицу:\nSELECT * FROM active_users WHERE city = 'Москва';\n```\n\n" +
          "**Зачем нужен VIEW:**\n" +
          "- Скрыть сложные JOIN-запросы за простым именем\n" +
          "- Ограничить доступ к определённым столбцам\n" +
          "- Создать общий «контракт» для часто используемых запросов\n\n" +
          "```sql\n-- VIEW для статистики заказов\nCREATE VIEW order_stats AS\nSELECT\n  u.name,\n  COUNT(o.id) AS orders_count,\n  SUM(o.amount) AS total_spent\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nGROUP BY u.id, u.name;\n```\n\n" +
          "**Удалить VIEW:** `DROP VIEW active_users;`\n\n" +
          "**VIEW vs таблица:** VIEW не хранит данные, всегда актуален, нельзя делать INSERT/UPDATE (в большинстве СУБД без специальных триггеров).",
        code:
          "import sqlite3\n\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\n\ncursor.executescript('''\n  CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, active INTEGER);\n  CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, amount REAL);\n  INSERT INTO users VALUES (1, 'Алиса', 1), (2, 'Боб', 1), (3, 'Удалённый', 0);\n  INSERT INTO orders VALUES (1, 1, 5000), (2, 1, 3000), (3, 2, 8000);\n  \n  -- Создать VIEW\n  CREATE VIEW user_order_stats AS\n  SELECT\n    u.id,\n    u.name,\n    COUNT(o.id)        AS orders_count,\n    COALESCE(SUM(o.amount), 0) AS total_spent\n  FROM users u\n  LEFT JOIN orders o ON o.user_id = u.id\n  WHERE u.active = 1\n  GROUP BY u.id, u.name;\n''')\n\n# Запрос к VIEW как к обычной таблице\ncursor.execute('SELECT * FROM user_order_stats ORDER BY total_spent DESC')\nfor row in cursor.fetchall():\n    print(row)",
        keyTakeaways: [
          "VIEW — именованный SELECT, выглядит как таблица.",
          "Данные в VIEW не хранятся — каждый SELECT к VIEW выполняет исходный запрос.",
          "Удобен для сложных JOIN/агрегаций, которые используются часто.",
          "DROP VIEW name — удалить представление.",
        ],
      },
    ],
  },
  fills: [
    {
      type: "fill",
      id: "sql7-f1",
      title: "CREATE INDEX",
      description: "Создай индекс по столбцу email таблицы users для ускорения поиска.",
      language: "python",
      code:
        "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)')\nconn.commit()\n\n# Создать индекс по email\ncursor.execute('{{0}} {{1}} idx_users_email ON users(email)')\nprint('Индекс создан!')\n\n# Проверить план запроса\ncursor.execute('EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = ?', ('test@mail.ru',))\nprint(cursor.fetchall()[0][3])\nconn.close()",
      answers: [["CREATE", "create"], ["INDEX", "index"]],
      hints: [
        "Создание объекта в SQL начинается с CREATE",
        "Тип создаваемого объекта — INDEX",
      ],
    },
    {
      type: "fill",
      id: "sql7-f2",
      title: "CREATE VIEW",
      description: "Создай VIEW active_users, который выбирает только активных пользователей.",
      language: "python",
      code:
        "import sqlite3\nconn = sqlite3.connect(':memory:')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, active INTEGER)')\ncursor.execute(\"INSERT INTO users VALUES (1, 'Алиса', 1), (2, 'Архив', 0), (3, 'Боб', 1)\")\nconn.commit()\n\ncursor.execute('''\n  {{0}} {{1}} active_users {{2}}\n  SELECT id, name FROM users WHERE active = 1\n''')\n\ncursor.execute('SELECT * FROM active_users')\nprint(cursor.fetchall())  # [(1, 'Алиса'), (3, 'Боб')]\nconn.close()",
      answers: [["CREATE", "create"], ["VIEW", "view"], ["AS", "as"]],
      hints: [
        "CREATE VIEW имя AS SELECT...",
        "Тип объекта — VIEW",
        "Перед запросом ставится AS",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "sql7-q1",
      title: "Когда нужен индекс",
      question: "На каком столбце стоит создать индекс в первую очередь?",
      answers: [
        "на столбцах часто используемых в WHERE и JOIN",
        "на часто фильтруемых столбцах",
        "по которым часто ищут",
        "в where и join",
        "на frequently queried columns",
        "на столбцах в условиях фильтрации",
        "столбцы используемые в where",
      ],
      hint: "Индекс ускоряет поиск — а что в запросе задаёт условие поиска?",
      explanation: "Индексы нужны на столбцах, которые часто используются в WHERE, JOIN ON и ORDER BY. PRIMARY KEY и UNIQUE индексируются автоматически. Избегай индексов на редко используемых столбцах.",
    },
    {
      type: "question",
      id: "sql7-q2",
      title: "Что такое VIEW?",
      question: "Хранятся ли данные физически в VIEW (представлении)?",
      answers: [
        "нет",
        "данные не хранятся",
        "нет, view это виртуальная таблица",
        "нет, view — запрос",
        "view не хранит данные",
        "нет физического хранения",
        "no",
        "нет, это виртуальное представление",
      ],
      hint: "VIEW — это не таблица, это...",
      explanation: "VIEW не хранит данные физически. Это сохранённый SELECT-запрос. При каждом обращении к VIEW база выполняет исходный запрос заново. Данные всегда актуальны, но VIEW немного медленнее, чем запрос к таблице.",
    },
    {
      type: "question",
      id: "sql7-q3",
      title: "Что показывает EXPLAIN QUERY PLAN?",
      question: "Что означает 'SCAN users' в результате EXPLAIN QUERY PLAN?",
      answers: [
        "полное сканирование таблицы",
        "читает все строки",
        "full table scan",
        "нет индекса используется",
        "перебирает все строки",
        "индекс не используется",
        "медленный обход таблицы",
        "table scan без индекса",
      ],
      hint: "SCAN vs SEARCH USING INDEX — что быстрее?",
      explanation: "SCAN users означает полное сканирование таблицы — база читает каждую строку подряд. Это медленно на больших таблицах. После создания индекса появится SEARCH users USING INDEX — намного быстрее.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "sql7-w1",
      title: "Полная библиотека с CRUD и статистикой",
      task:
        "Создай систему управления библиотекой:\n\n" +
        "Таблицы:\n" +
        "- `books` (id, title TEXT, author TEXT, year INTEGER, genre TEXT, available INTEGER)\n" +
        "- `loans` (id, book_id INTEGER, reader_name TEXT, loan_date TEXT, return_date TEXT)\n\n" +
        "Функции:\n" +
        "- `add_book(title, author, year, genre)` — добавить книгу\n" +
        "- `loan_book(book_id, reader)` — взять книгу (available = 0)\n" +
        "- `return_book(book_id)` — вернуть книгу\n" +
        "- `search_books(keyword)` — поиск по названию/автору\n" +
        "- `stats()` — статистика: всего книг, доступных, выдано сегодня\n\n" +
        "Создай индексы по genre и author. Используй row_factory.",
      hints: [
        "CREATE TABLE books (...); CREATE TABLE loans (...);",
        "CREATE INDEX idx_books_genre ON books(genre);",
        "conn.row_factory = sqlite3.Row",
        "WHERE title LIKE ? OR author LIKE ? с параметром '%' + keyword + '%'",
        "JOIN loans ON loans.book_id = books.id",
      ],
      required: ["CREATE TABLE", "CREATE INDEX", "row_factory", "LIKE", "JOIN"],
      minLines: 40,
      language: "python",
    },
  ],
};

export const SQL_ROUNDS: Round[] = [sql1, sql2, sql3, sql4, sql5, sql6, sql7];
export const SQL_TOTAL_ROUNDS = SQL_ROUNDS.length;
