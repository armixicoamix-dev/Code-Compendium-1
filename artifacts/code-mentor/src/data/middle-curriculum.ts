import type { Round } from "@/data/curriculum";

// ---------------------------------------------------------------------------
// MIDDLE PYTHON COURSE — 7 раундов
//
// Продолжение Junior. Цель — сделать из уверенного джуниора крепкого мидла:
// идиомы, генераторы, исключения, файлы, модули, типизация, декораторы.
// ---------------------------------------------------------------------------

const m1: Round = {
  number: 1,
  title: "Middle · Comprehensions: списки, словари, множества",
  level: "Средний",
  intro:
    "Comprehension — это «декларативная» запись цикла, который собирает коллекцию. Один из главных идиоматических инструментов Python: короче, читаемее и обычно быстрее ручного цикла.",
  lesson: {
    title: "List/dict/set/generator comprehensions",
    summary:
      "Учимся переводить циклы в comprehension'ы, вкладывать условия и циклы, понимать generator-выражения и когда они уместнее.",
    readingMinutes: 6,
    sections: [
      {
        heading: "List comprehension — базовая форма",
        tagline: "[выражение for элемент in итерируемое if условие]",
        body:
          "Сравни два способа получить квадраты чётных чисел:\n\n" +
          "Обычный цикл:\n" +
          "```\n" +
          "result = []\n" +
          "for x in range(10):\n" +
          "    if x % 2 == 0:\n" +
          "        result.append(x ** 2)\n" +
          "```\n\n" +
          "List comprehension — одна строка:\n" +
          "```\n" +
          "result = [x ** 2 for x in range(10) if x % 2 == 0]\n" +
          "```\n\n" +
          "Структура: `[<что добавить> for <переменная> in <итер> if <условие>]`. Условие опционально. Можно несколько `for` подряд — это вложенные циклы:\n\n" +
          "`pairs = [(i, j) for i in range(3) for j in range(3) if i != j]`\n\n" +
          "**Когда НЕ использовать**: если выражение становится длиннее одной читаемой строки или содержит несколько уровней if/else — лучше обычный цикл.",
        code:
          "nums = [1, 2, 3, 4, 5]\n\n" +
          "squares = [n ** 2 for n in nums]\n" +
          "evens = [n for n in nums if n % 2 == 0]\n" +
          "labels = [\"чёт\" if n % 2 == 0 else \"нечёт\" for n in nums]\n\n" +
          "# Из строки\n" +
          "vowels = [ch for ch in \"Programming\" if ch.lower() in \"aeiou\"]\n" +
          "print(vowels)   # ['o', 'a', 'i']\n\n" +
          "# Декартово произведение\n" +
          "matrix = [[i * j for j in range(3)] for i in range(3)]",
        keyTakeaways: [
          "[expr for x in seq if cond] — главная форма.",
          "Тернарный if/else идёт ПЕРЕД for: [a if c else b for x in seq].",
          "Несколько for в одном comprehension = вложенные циклы.",
        ],
        pitfalls: [
          "Не путай: `[x if c else y for x in seq]` (тернарный) и `[x for x in seq if c]` (фильтр).",
          "Слишком сложное выражение в comprehension — антипаттерн. Цикл понятнее.",
          "Не используй comprehension только ради побочного эффекта (для печати) — пиши обычный for.",
        ],
      },
      {
        heading: "Dict, set и generator comprehensions",
        tagline: "Те же скобки + чуть другой синтаксис",
        body:
          "**Dict comprehension** — `{ключ: значение for ... }`:\n\n" +
          "`squares = {n: n ** 2 for n in range(5)}`\n\n" +
          "**Set comprehension** — `{выражение for ... }` (без двоеточия):\n\n" +
          "`unique_lengths = {len(w) for w in words}`\n\n" +
          "**Generator expression** — `(выражение for ... )` в круглых скобках. Это **ленивый** comprehension: значения вычисляются по одному, без хранения в памяти. Идеально для `sum`, `any`, `all`, `max`, `min` и больших данных:\n\n" +
          "`total = sum(x ** 2 for x in range(1_000_000))`  # никакого огромного списка\n\n" +
          "При передаче генератора единственным аргументом скобки можно опустить: `sum(x for x in nums)`.",
        code:
          "users = [{\"name\": \"Аня\", \"age\": 17}, {\"name\": \"Боря\", \"age\": 21}]\n\n" +
          "# dict: имя → возраст\n" +
          "by_name = {u[\"name\"]: u[\"age\"] for u in users}\n\n" +
          "# set: уникальные возрасты\n" +
          "unique_ages = {u[\"age\"] for u in users}\n\n" +
          "# generator: сумма всех возрастов без промежуточного списка\n" +
          "total_age = sum(u[\"age\"] for u in users)\n\n" +
          "# any / all с генераторами — read like English\n" +
          "any_adult = any(u[\"age\"] >= 18 for u in users)\n" +
          "all_adult = all(u[\"age\"] >= 18 for u in users)",
        keyTakeaways: [
          "{}: dict (с :) или set (без :). Пустой {} — это dict.",
          "(...): generator expression — лениво, без памяти.",
          "any/all/sum/max принимают генератор — самые идиоматичные комбинации.",
        ],
        pitfalls: [
          "`{1, 2, 3}` — set; `{1: 2}` — dict. Пусто `{}` — dict. Пустой set — `set()`.",
          "Генератор можно пройти ОДИН раз. Если нужно дважды — сохрани в list/tuple.",
        ],
      },
    ],
    cheatSheet: [
      "[expr for x in seq if cond] — list comprehension.",
      "{key: value for ...} — dict; {expr for ...} — set.",
      "(expr for ...) — generator expression, ленивый.",
      "Тернарный if/else идёт ПЕРЕД for. Фильтр — ПОСЛЕ.",
      "any/all/sum/max принимают итератор без скобок: sum(x for x in nums).",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "m1-f1",
      title: "List comprehension с фильтром",
      description: "Собери список квадратов положительных чисел.",
      code:
        "nums = [-2, -1, 0, 1, 2, 3]\n" +
        "squares = [{{0}} for n in nums {{1}} n > 0]\n" +
        "print(squares)   # [1, 4, 9]",
      answers: [["n ** 2", "n**2"], ["if"]],
      hints: [
        "Что добавить — квадрат текущего элемента.",
        "Ключевое слово фильтра в comprehension.",
      ],
      explanation: {
        summary:
          "Стандартная форма с фильтром: выражение, потом for, потом if.",
        keyPoints: [
          "if в конце — это фильтр (включить элемент или нет).",
          "Если бы был if/else, он шёл бы до for.",
        ],
      },
    },
    {
      type: "fill",
      id: "m1-f2",
      title: "Dict и generator comprehension",
      description: "Создай словарь и проверь условие через any.",
      code:
        "words = [\"apple\", \"bee\", \"car\", \"door\"]\n\n" +
        "lengths = {w: {{0}}(w) for w in words}\n" +
        "has_long = {{1}}(len(w) >= 5 for w in words)\n\n" +
        "print(lengths)\n" +
        "print(has_long)   # True",
      answers: [["len"], ["any"]],
      hints: [
        "Функция длины — для значения словаря.",
        "Возвращает True, если хотя бы один элемент истинен.",
      ],
      explanation: {
        summary:
          "Dict comprehension даёт {слово: длина}. any с генераторным выражением проверяет «хотя бы один из…», без создания промежуточного списка.",
        keyPoints: [
          "any/all лениво останавливаются — экономят время.",
          "Здесь скобки у генератора можно опустить.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "m1-q1",
      title: "Тернарный if/else в comprehension",
      question:
        "Где в list comprehension должен стоять тернарный оператор if/else (например, чтобы выбирать a или b в зависимости от условия)?",
      answers: [
        "перед for",
        "до for",
        "перед for, не после",
        "if/else идёт перед for",
      ],
      hint: "Перед for — это часть выражения. После for — это фильтр.",
      explanation:
        "Тернарный if/else — это часть выражения, поэтому идёт ПЕРЕД for: `[a if c else b for x in seq]`. Фильтр (просто if) идёт ПОСЛЕ for.",
    },
    {
      type: "question",
      id: "m1-q2",
      title: "Generator vs list",
      question:
        "Когда стоит выбрать generator expression (...) вместо list comprehension [...]?",
      answers: [
        "когда не нужно хранить весь список в памяти",
        "когда данные большие или результат сразу потребляется одной функцией",
        "когда нужна экономия памяти",
        "когда результат используется только один раз",
      ],
      hint: "Главное преимущество — память и ленивость.",
      explanation:
        "Генератор не хранит все элементы в памяти и выдаёт их по одному. Идеально для больших данных или когда результат сразу потребляет sum/any/all/max и т.п.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "m1-w1",
      title: "Уникальные длины слов",
      task:
        "Получи строку, разбей по пробелам и через set comprehension построй множество уникальных длин слов длиной не короче 3 символов. Напечатай отсортированный по возрастанию список этих длин.",
      hints: [
        "words = input().split()",
        "lengths = {len(w) for w in words if len(w) >= 3} — set comprehension с фильтром.",
        "print(sorted(lengths)) — отсортированный список.",
      ],
      required: ["input(", ".split()", "{", "for", "if", "len(", "sorted("],
      minLines: 4,
      explanation: {
        summary:
          "Set comprehension сразу даёт уникальность. sorted превращает в упорядоченный список.",
        keyPoints: [
          "set автоматически убирает дубликаты.",
          "sorted принимает любой итерируемый.",
        ],
      },
    },
  ],
};

const m2: Round = {
  number: 2,
  title: "Middle · Файлы и контекстные менеджеры",
  level: "Средний",
  intro:
    "Файл — это объект с методами .read/.write. Главная идиома — `with open(...) as f:` — она сама закроет файл, даже если случится исключение. Учим текстовые и бинарные файлы, кодировки, JSON.",
  lesson: {
    title: "Работа с файлами и `with`",
    summary:
      "Открыть/прочитать/записать; режимы r/w/a/b; кодировки; чтение по строкам; контекстные менеджеры; JSON-сериализация.",
    readingMinutes: 6,
    sections: [
      {
        heading: "open() и контекстный менеджер with",
        tagline: "with open(...) as f — единственно правильный способ",
        body:
          "Сигнатура: `open(path, mode=\"r\", encoding=\"utf-8\")`. Режимы:\n\n" +
          "- `\"r\"` — чтение (по умолчанию);\n" +
          "- `\"w\"` — запись (затирает!);\n" +
          "- `\"a\"` — дозапись;\n" +
          "- `\"r+\"` — чтение+запись;\n" +
          "- `\"b\"` — добавить к любому, чтобы открыть бинарно (без encoding).\n\n" +
          "**`with`-блок** — это **контекстный менеджер**. Он гарантирует, что `f.close()` будет вызван **в любом случае** — даже если внутри блока произойдёт исключение. Поэтому никакого ручного `f.close()` писать не надо.\n\n" +
          "Чтение:\n\n" +
          "- `f.read()` — весь файл в строку;\n" +
          "- `f.readlines()` — список строк (с `\\n`);\n" +
          "- `for line in f:` — построчно, **ленивая** итерация (важно для больших файлов).",
        code:
          "# Запись\n" +
          "with open(\"notes.txt\", \"w\", encoding=\"utf-8\") as f:\n" +
          "    f.write(\"Привет\\n\")\n" +
          "    f.writelines([\"строка 1\\n\", \"строка 2\\n\"])\n\n" +
          "# Чтение построчно — лениво, не съедает память\n" +
          "with open(\"notes.txt\", encoding=\"utf-8\") as f:\n" +
          "    for line in f:\n" +
          "        print(line.rstrip())\n\n" +
          "# Дозапись\n" +
          "with open(\"notes.txt\", \"a\", encoding=\"utf-8\") as f:\n" +
          "    f.write(\"ещё одна\\n\")",
        keyTakeaways: [
          "Всегда используй `with open(...) as f:` — закроет файл сам.",
          "encoding=\"utf-8\" — почти всегда правильный выбор для текстов.",
          "Перебор по файлу `for line in f:` — лениво и эффективно.",
        ],
        pitfalls: [
          "`\"w\"` ЗАТИРАЕТ файл — не путай с `\"a\"`.",
          "Без encoding на Windows может быть cp1251 → кракозябры. Указывай явно.",
          "f.read() в больших файлах съедает всю память.",
          "`for line in f:` оставляет `\\n` в конце — обычно `.rstrip()`.",
        ],
      },
      {
        heading: "JSON и сериализация",
        tagline: "json.dump / json.load — сохранить/загрузить структуру",
        body:
          "**JSON** — текстовый формат для словарей/списков/чисел/строк/булевых/None. Модуль `json` стандартный, импортировать просто: `import json`.\n\n" +
          "Запись:\n\n" +
          "- `json.dump(data, file)` — записать в файл;\n" +
          "- `json.dumps(data)` — вернуть строку.\n\n" +
          "Чтение:\n\n" +
          "- `json.load(file)` — из файла;\n" +
          "- `json.loads(string)` — из строки.\n\n" +
          "Полезные параметры: `indent=2` — красивое форматирование; `ensure_ascii=False` — чтобы кириллица сохранялась как кириллица, а не как `\\u041f...`.",
        code:
          "import json\n\n" +
          "data = {\n" +
          "    \"name\": \"Аня\",\n" +
          "    \"hobbies\": [\"книги\", \"бег\"],\n" +
          "    \"active\": True,\n" +
          "}\n\n" +
          "with open(\"user.json\", \"w\", encoding=\"utf-8\") as f:\n" +
          "    json.dump(data, f, ensure_ascii=False, indent=2)\n\n" +
          "with open(\"user.json\", encoding=\"utf-8\") as f:\n" +
          "    loaded = json.load(f)\n" +
          "print(loaded[\"name\"])   # Аня",
        keyTakeaways: [
          "json.dump — в файл, json.dumps — в строку (мнемоника: s = string).",
          "indent=2 + ensure_ascii=False — читаемый JSON с кириллицей.",
          "JSON не знает tuple, datetime, set — придётся конвертировать.",
        ],
        pitfalls: [
          "Сериализация set вызовет TypeError — конвертируй в list.",
          "json.load нельзя дать строку — только файл. Для строки — json.loads.",
        ],
      },
      {
        heading: "pathlib — современная работа с путями",
        tagline: "Path вместо os.path: объектный стиль, работает на всех ОС",
        body:
          "Старый способ — строки + `os.path.join(...)`. Новый — `pathlib.Path`. Разница огромная: `Path` — это объект с методами и операторами.\n\n" +
          "Основные операции:\n\n" +
          "- `Path(\"dir\") / \"file.txt\"` — сконструировать путь через `/` (работает на Windows и Linux).\n" +
          "- `p.exists()`, `p.is_file()`, `p.is_dir()` — проверки.\n" +
          "- `p.stem` — имя без расширения, `p.suffix` — расширение, `p.name` — имя файла, `p.parent` — родительский каталог.\n" +
          "- `p.read_text(encoding='utf-8')` / `p.write_text(text)` — чтение/запись в одну строку.\n" +
          "- `p.mkdir(parents=True, exist_ok=True)` — создать директорию с родителями.\n" +
          "- `list(p.glob('*.txt'))` — найти все файлы по маске.\n" +
          "- `p.rename(new_path)`, `p.unlink()` — переименовать/удалить файл.",
        code:
          "from pathlib import Path\n\n" +
          "# Создаём путь — кроссплатформенно\n" +
          "data_dir = Path(\"data\")\n" +
          "config = data_dir / \"config.json\"\n\n" +
          "# Создаём директорию, если не существует\n" +
          "data_dir.mkdir(parents=True, exist_ok=True)\n\n" +
          "# Запись и чтение в одну строку\n" +
          "config.write_text('{\"debug\": true}', encoding=\"utf-8\")\n" +
          "text = config.read_text(encoding=\"utf-8\")\n\n" +
          "# Атрибуты пути\n" +
          "p = Path(\"/home/user/report.csv\")\n" +
          "print(p.name)    # 'report.csv'\n" +
          "print(p.stem)    # 'report'\n" +
          "print(p.suffix)  # '.csv'\n" +
          "print(p.parent)  # PosixPath('/home/user')\n\n" +
          "# Найти все файлы .py в директории\n" +
          "for py_file in Path(\".\").glob(\"*.py\"):\n" +
          "    print(py_file)",
        keyTakeaways: [
          "`Path` — объект с методами. Используй `/` для склейки частей пути.",
          "`.read_text()` / `.write_text()` — самый короткий способ читать/писать файл.",
          "Предпочитай `pathlib` вместо строк + `os.path` в новом коде.",
        ],
        pitfalls: [
          "`Path(\"a\") + \"b\"` — ошибка. Используй `/` : `Path(\"a\") / \"b\"`.",
          "`.glob()` возвращает генератор — если нужен список, оберни: `list(p.glob(...))`.",
          "`p.unlink()` — только для файлов. Для директорий — `p.rmdir()` или `shutil.rmtree(p)`.",
        ],
      },
      {
        heading: "CSV — читаем и пишем таблицы",
        tagline: "csv.reader и csv.DictReader/DictWriter — стандартный модуль",
        body:
          "CSV (Comma-Separated Values) — самый распространённый текстовый формат для таблиц. Модуль `csv` обрабатывает кавычки, разделители и переносы строк за тебя — не надо парсить вручную.\n\n" +
          "**Чтение**: `csv.reader(f)` → итератор списков. `csv.DictReader(f)` → итератор словарей (первая строка — заголовки).\n\n" +
          "**Запись**: `csv.writer(f)` + `.writerow([...])`. `csv.DictWriter(f, fieldnames=[...])` + `.writerow({...})`.\n\n" +
          "Важные параметры: `delimiter=','` (или `;` для европейского Excel), `newline=''` при открытии (иначе двойные переносы на Windows).",
        code:
          "import csv\n\n" +
          "# Запись\n" +
          "rows = [\n" +
          "    {\"name\": \"Аня\", \"age\": 17, \"city\": \"Киев\"},\n" +
          "    {\"name\": \"Боря\", \"age\": 21, \"city\": \"Харьков\"},\n" +
          "]\n" +
          "with open(\"students.csv\", \"w\", newline=\"\", encoding=\"utf-8\") as f:\n" +
          "    writer = csv.DictWriter(f, fieldnames=[\"name\", \"age\", \"city\"])\n" +
          "    writer.writeheader()\n" +
          "    writer.writerows(rows)\n\n" +
          "# Чтение\n" +
          "with open(\"students.csv\", encoding=\"utf-8\") as f:\n" +
          "    for row in csv.DictReader(f):\n" +
          "        print(f\"{row['name']}, {row['age']} лет, из {row['city']}\")",
        keyTakeaways: [
          "`DictReader` / `DictWriter` — предпочтительны: имена столбцов делают код понятнее.",
          "При открытии файла для CSV всегда `newline=\"\"` — иначе двойные переносы.",
          "Данные из CSV — всегда строки. `int(row['age'])` для числовых полей.",
        ],
        pitfalls: [
          "Не парси CSV вручную через `.split(',')` — кавычки и запятые внутри полей сломают.",
          "`age = row['age']` — это строка '17', не число. Не забывай приводить тип.",
          "В Excel на русской Windows разделитель может быть `;` — указывай `delimiter=';'`.",
        ],
      },
    ],
    cheatSheet: [
      "with open(path, mode, encoding=\"utf-8\") as f: ...",
      "Режимы: r (чтение), w (запись, затирает), a (дозапись), b (бинарный).",
      "for line in f: — ленивое чтение по строкам, не забудь .rstrip().",
      "json.dump/load для файлов; json.dumps/loads для строк.",
      "JSON: dict→object, list→array, str→string, int/float→number, True/False→bool, None→null.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "m2-f1",
      title: "Запись с кодировкой",
      description: "Запиши список строк в файл и прочитай построчно.",
      code:
        "lines = [\"раз\", \"два\", \"три\"]\n\n" +
        "{{0}} open(\"out.txt\", \"{{1}}\", encoding=\"utf-8\") as f:\n" +
        "    for line in lines:\n" +
        "        f.write(line + \"\\n\")\n\n" +
        "with open(\"out.txt\", encoding=\"{{2}}\") as f:\n" +
        "    for line in f:\n" +
        "        print(line.rstrip())",
      answers: [["with"], ["w"], ["utf-8"]],
      hints: [
        "Ключевое слово контекстного менеджера.",
        "Режим открытия для записи (с затиранием).",
        "Самая универсальная кодировка для текстов.",
      ],
      explanation: {
        summary:
          "with гарантирует закрытие файла. \"w\" — запись с затиранием. utf-8 — стандартная кодировка для текстов на любом языке.",
        keyPoints: [
          "Без encoding на Windows может получиться битый текст.",
          "rstrip() убирает завершающий \\n.",
        ],
      },
    },
    {
      type: "fill",
      id: "m2-f2",
      title: "JSON: dump и load",
      description: "Сохрани словарь в JSON и считай обратно.",
      code:
        "import json\n\n" +
        "data = {\"name\": \"Аня\", \"age\": 17}\n\n" +
        "with open(\"u.json\", \"w\", encoding=\"utf-8\") as f:\n" +
        "    json.{{0}}(data, f, ensure_ascii={{1}}, indent=2)\n\n" +
        "with open(\"u.json\", encoding=\"utf-8\") as f:\n" +
        "    loaded = json.{{2}}(f)\n\n" +
        "print(loaded)",
      answers: [["dump"], ["False"], ["load"]],
      hints: [
        "Запись в файл.",
        "Чтобы кириллица не превращалась в \\u-эскейпы.",
        "Чтение из файла.",
      ],
      explanation: {
        summary:
          "dump/load работают с файлами; dumps/loads — со строками. ensure_ascii=False сохраняет кириллицу человеко-читаемой.",
        keyPoints: [
          "Мнемоника: dump_S и load_S — для String.",
          "indent=2 делает JSON красивым.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "m2-q1",
      title: "Зачем нужен with?",
      question:
        "Почему правильно открывать файлы через `with open(...) as f:` вместо ручного f = open(...)?",
      answers: [
        "with закроет файл автоматически даже при исключении",
        "with гарантирует закрытие файла после блока",
        "with автоматически вызывает close, даже если произошла ошибка",
        "with управляет ресурсом и закрывает файл сам",
      ],
      hint: "Что произойдёт с файлом, если внутри случится исключение?",
      explanation:
        "with — это контекстный менеджер. Он гарантирует вызов __exit__ (для файлов это close) при любом исходе — нормальном завершении или исключении. Это исключает утечки файловых дескрипторов.",
    },
    {
      type: "question",
      id: "m2-q2",
      title: "Различие dump и dumps",
      question:
        "Чем json.dump отличается от json.dumps? Кратко.",
      answers: [
        "dump пишет в файл, dumps возвращает строку",
        "dump — в файл, dumps — в строку",
        "dump в файл, dumps возвращает str",
        "dumps возвращает строку json, dump пишет в файл",
      ],
      hint: "Подсказка в названии: s — это string.",
      explanation:
        "dump — записывает JSON в файловый объект. dumps (с s = string) — возвращает строку. Аналогично load и loads для чтения.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "m2-w1",
      title: "Подсчёт строк в файле",
      task:
        "Прочитай файл 'data.txt' построчно и напечатай: общее число строк и число непустых строк (после strip). Используй with и ленивый перебор по файлу.",
      hints: [
        "Открывай через with open('data.txt', encoding='utf-8') as f.",
        "Заведи два счётчика total=0 и nonempty=0, обновляй в цикле for line in f.",
        "Не забудь line.strip(): пустая строка после strip — это \"\".",
      ],
      required: ["with", "open(", "encoding=", "for", "strip()", "print("],
      minLines: 6,
      explanation: {
        summary:
          "Демонстрация с-блока, ленивого чтения и аккуратной работы с пустыми строками.",
        keyPoints: [
          "for line in f: — не загружает файл целиком.",
          "strip() убирает и пробелы, и \\n.",
        ],
      },
    },
  ],
};

const m3: Round = {
  number: 3,
  title: "Middle · Исключения и обработка ошибок",
  level: "Средний",
  intro:
    "Исключение — это объект, описывающий ошибку. Вместо «вернуть None при ошибке» Python говорит «бросить исключение». Учимся ловить (try/except), бросать (raise), создавать свои и пользоваться `finally`.",
  lesson: {
    title: "try / except / else / finally и иерархия исключений",
    summary:
      "Когда ловить, когда пропускать; что значит EAFP против LBYL; как делать пользовательские исключения и зачем нужны цепочки причин (raise from).",
    readingMinutes: 7,
    sections: [
      {
        heading: "Базовая обработка: try / except",
        tagline: "Ловим то, что знаем; не ловим Exception без причины",
        body:
          "Синтаксис:\n\n" +
          "```\n" +
          "try:\n" +
          "    рискованный код\n" +
          "except SomeError as e:\n" +
          "    обработка\n" +
          "except (TypeError, ValueError):\n" +
          "    обработка нескольких\n" +
          "else:\n" +
          "    выполнится, если ИСКЛЮЧЕНИЯ НЕ БЫЛО\n" +
          "finally:\n" +
          "    выполнится В ЛЮБОМ случае (для очистки)\n" +
          "```\n\n" +
          "**Ключевые правила**:\n\n" +
          "- Лови **конкретные** исключения, а не голый `except:`. Голый `except` ловит даже KeyboardInterrupt.\n" +
          "- Поймал → знай, что делать. Если не знаешь — не лови.\n" +
          "- В Python принят стиль **EAFP**: «проще попросить прощения, чем разрешения». Например, для словаря лучше `try d[k] except KeyError`, чем сначала `if k in d`. Особенно в многопоточном коде — между проверкой и действием состояние может поменяться.\n" +
          "- `else` — для кода, который ДОЛЖЕН выполниться только при успехе try. `finally` — для очистки.",
        code:
          "def to_int_safe(s):\n" +
          "    try:\n" +
          "        n = int(s)\n" +
          "    except ValueError:\n" +
          "        return None\n" +
          "    else:\n" +
          "        return n        # выполнится, только если int не упал\n\n" +
          "print(to_int_safe(\"42\"))   # 42\n" +
          "print(to_int_safe(\"abc\"))  # None\n\n" +
          "# finally — выполнится всегда\n" +
          "def safe_div(a, b):\n" +
          "    try:\n" +
          "        return a / b\n" +
          "    except ZeroDivisionError:\n" +
          "        return float(\"inf\")\n" +
          "    finally:\n" +
          "        print(\"закончили\")",
        keyTakeaways: [
          "Лови КОНКРЕТНЫЕ исключения. Голый except — антипаттерн.",
          "else — только при успехе; finally — всегда.",
          "EAFP > LBYL: try/except часто читаемее и быстрее, чем предварительные проверки.",
        ],
        pitfalls: [
          "`except Exception:` ловит почти всё, кроме SystemExit/KeyboardInterrupt — но всё равно слишком широко. Лови конкретно.",
          "В блоке try не стоит писать «всё подряд» — узкие try-блоки понятнее.",
          "Пустой `except: pass` — почти всегда баг в будущем.",
        ],
      },
      {
        heading: "raise, цепочки причин и свои исключения",
        tagline: "Создавай свои классы — это нормально и идиоматично",
        body:
          "**Бросить** исключение — `raise SomeError(\"msg\")`. Передавать только экземпляр или класс. Внутри except можно проследить причину: `raise NewError(...) from e`. Это даст полный traceback с обеими ошибками.\n\n" +
          "**Свои исключения**:\n\n" +
          "```\n" +
          "class PaymentError(Exception):\n" +
          "    \"\"\"Базовое исключение платежей.\"\"\"\n\n" +
          "class InsufficientFunds(PaymentError):\n" +
          "    pass\n" +
          "```\n\n" +
          "Зачем своё? Чтобы вызывающий код мог ловить **именно** твою ошибку, а не любые ValueError случайно. Иерархия — чтобы можно было поймать `PaymentError` и обработать любую дочернюю.\n\n" +
          "Также есть **`raise` без аргументов** внутри `except` — он перебрасывает текущее исключение дальше (после логирования, например).",
        code:
          "class ConfigError(Exception): ...\n" +
          "class MissingKey(ConfigError): ...\n\n" +
          "def get_setting(d, key):\n" +
          "    try:\n" +
          "        return d[key]\n" +
          "    except KeyError as e:\n" +
          "        raise MissingKey(f\"нет ключа {key}\") from e\n\n" +
          "try:\n" +
          "    get_setting({}, \"db_url\")\n" +
          "except ConfigError as e:    # ловим базовый — поймает и MissingKey\n" +
          "    print(\"плохая конфигурация:\", e)",
        keyTakeaways: [
          "raise X(\"msg\") — бросить; raise — без аргументов, чтобы перебросить.",
          "raise NewError(...) from e — сохранить цепочку причин.",
          "Свои исключения = подкласс Exception. Иерархия упрощает обработку.",
        ],
        pitfalls: [
          "`raise SomeError` без скобок работает, но обычно пишут `raise SomeError(\"msg\")` для ясности.",
          "Не используй исключения для управления штатным потоком (например, для нормальной валидации). Это про ИСКЛЮЧИТЕЛЬНЫЕ ситуации.",
        ],
      },
      {
        heading: "contextlib — собственный контекстный менеджер",
        tagline: "@contextmanager превращает генератор в контекстный менеджер",
        body:
          "Контекстный менеджер — любой объект с `__enter__` и `__exit__`. Самый простой способ написать свой — `@contextlib.contextmanager`. Пишешь обычную генераторную функцию с единственным `yield`: код до `yield` — это «вход», код после — «выход» (даже при исключении).\n\n" +
          "Стандартные контекстные менеджеры из `contextlib`:\n\n" +
          "- `contextlib.suppress(*exceptions)` — игнорировать конкретные исключения без try/except.\n" +
          "- `contextlib.redirect_stdout(f)` — перенаправить stdout в файл-объект.\n" +
          "- `contextlib.ExitStack` — динамически стекать несколько менеджеров.\n\n" +
          "Контекстные менеджеры — не только для файлов: транзакции БД, мьютексы, временные каталоги, измерение времени.",
        code:
          "from contextlib import contextmanager, suppress\n" +
          "import time\n\n" +
          "@contextmanager\n" +
          "def timer(label):\n" +
          "    start = time.perf_counter()\n" +
          "    try:\n" +
          "        yield          # всё внутри with-блока выполняется здесь\n" +
          "    finally:\n" +
          "        elapsed = time.perf_counter() - start\n" +
          "        print(f\"{label}: {elapsed:.3f}s\")\n\n" +
          "with timer(\"сортировка\"):\n" +
          "    sorted(range(100_000))\n\n" +
          "# suppress — подавить конкретное исключение\n" +
          "with suppress(FileNotFoundError):\n" +
          "    with open(\"нет_такого.txt\") as f:\n" +
          "        print(f.read())\n" +
          "# исключение FileNotFoundError поглощено — код продолжается",
        keyTakeaways: [
          "@contextmanager + yield — самый простой способ написать свой контекстный менеджер.",
          "contextlib.suppress(E) — замена try/except/pass, более явная.",
          "Контекстные менеджеры = гарантия очистки ресурсов, как with open(...).",
        ],
        pitfalls: [
          "Если в @contextmanager нет try/finally, код после yield не выполнится при исключении.",
          "Не пиши два yield в @contextmanager — это ошибка времени выполнения.",
          "`suppress` поглощает ошибку полностью — убедись, что это именно то, что нужно.",
        ],
      },
    ],
    cheatSheet: [
      "try / except SpecificError as e / else / finally.",
      "EAFP > LBYL — пробуй и лови, а не проверяй заранее.",
      "raise X(\"msg\") — бросить; raise (без args) — перебросить.",
      "raise NewError(...) from e — цепочка причин.",
      "Свои исключения: class MyError(Exception): pass.",
      "Никогда не пиши голый `except:` — лови конкретные.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "m3-f1",
      title: "Безопасное приведение к int",
      description: "Заверши функцию через try/except.",
      code:
        "def to_int_or(default, s):\n" +
        "    {{0}}:\n" +
        "        return int(s)\n" +
        "    {{1}} {{2}}:\n" +
        "        return default\n\n" +
        "print(to_int_or(0, \"42\"))    # 42\n" +
        "print(to_int_or(0, \"oops\"))  # 0",
      answers: [["try"], ["except"], ["ValueError"]],
      hints: [
        "Ключевое слово начала рискованного блока.",
        "Ключевое слово ловли исключения.",
        "Конкретный класс, который бросает int(\"abc\").",
      ],
      explanation: {
        summary:
          "Точечная ловля ValueError — именно того, что бросит int(...) при некорректной строке. Голый except ловил бы и неожиданные баги.",
        keyPoints: [
          "Ловим ровно то, что ожидаем.",
          "В простых функциях return default — нормальная стратегия.",
        ],
      },
    },
    {
      type: "fill",
      id: "m3-f2",
      title: "raise from — цепочка причин",
      description: "Перенаправь KeyError в осмысленное MissingKey.",
      code:
        "class MissingKey(Exception): pass\n\n" +
        "def get_required(d, key):\n" +
        "    try:\n" +
        "        return d[key]\n" +
        "    except {{0}} as e:\n" +
        "        {{1}} MissingKey(f\"нет ключа {key}\") {{2}} e",
      answers: [["KeyError"], ["raise"], ["from"]],
      hints: [
        "Какое исключение бросит d[key], если ключа нет.",
        "Ключевое слово броска исключения.",
        "Связывает новое исключение с исходным.",
      ],
      explanation: {
        summary:
          "Превращаем технический KeyError в доменный MissingKey, сохраняя оригинальную причину через `from e`. В traceback будут видны оба.",
        keyPoints: [
          "raise X from e — лучшая практика при оборачивании.",
          "Иерархия своих исключений делает API чище.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "m3-q1",
      title: "EAFP vs LBYL",
      question:
        "Что означает аббревиатура EAFP в Python и какой подход она поощряет?",
      answers: [
        "easier to ask forgiveness than permission — пробовать и ловить исключения",
        "easier to ask forgiveness than permission — try/except вместо предварительных проверок",
        "проще попросить прощения чем разрешения — try/except предпочтительнее проверок",
        "проще попросить прощения чем разрешения",
      ],
      hint: "Это противоположность LBYL (look before you leap).",
      explanation:
        "EAFP = Easier to Ask Forgiveness than Permission. В Python принято пробовать действие и ловить исключение, а не сначала проверять условия — это часто короче, читаемее и безопаснее в многопоточном коде.",
    },
    {
      type: "question",
      id: "m3-q2",
      title: "Когда выполнится else в try?",
      question:
        "В конструкции try / except / else / finally — когда именно выполнится блок else?",
      answers: [
        "если в try не было исключения",
        "только если try выполнился без исключений",
        "когда try завершился нормально без exception",
        "если в try не возникло исключение",
      ],
      hint: "Только при успешном завершении try.",
      explanation:
        "else выполняется ТОЛЬКО если try завершился без исключения. Это позволяет отделить «основной успех» от «рискованного шага» и не ловить лишнего.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "m3-w1",
      title: "Безопасный калькулятор",
      task:
        "Напиши функцию safe_div(a, b), которая возвращает результат a/b. Лови ZeroDivisionError и возвращай float('inf'). Лови TypeError (если a или b не число) и возвращай None. Покажи 3 разных вызова.",
      hints: [
        "def safe_div(a, b): try / except ZeroDivisionError / except TypeError.",
        "Возвращай float('inf'), None и обычный результат.",
        "Покажи safe_div(10, 2), safe_div(1, 0), safe_div('10', 2).",
      ],
      required: ["def safe_div(", "try:", "except ZeroDivisionError", "except TypeError", "return", "print(safe_div("],
      minLines: 8,
      explanation: {
        summary:
          "Несколько except-блоков подряд — стандартная практика. Каждый ловит свой случай.",
        keyPoints: [
          "Порядок except важен: специфичные раньше общих.",
          "float('inf') — корректное «бесконечность» в Python.",
        ],
      },
    },
  ],
};

const m4: Round = {
  number: 4,
  title: "Middle · Модули, пакеты и импорты",
  level: "Средний",
  intro:
    "Любой .py-файл — это модуль. Папка с __init__.py — это пакет. Учим, как импортировать, как пользоваться `if __name__ == '__main__'`, и что делает sys.path.",
  lesson: {
    title: "Импорт, модули, пакеты, точки входа",
    summary:
      "import / from import / as; абсолютные и относительные импорты; точка входа; стандартная и сторонняя библиотека.",
    readingMinutes: 6,
    sections: [
      {
        heading: "import и его формы",
        tagline: "Импортируй модулем, не «всем подряд»",
        body:
          "Базовая форма — `import math`, доступ — `math.sqrt(2)`. Удобно, явно, не загрязняет namespace.\n\n" +
          "`from math import sqrt` — приносит конкретное имя в текущий файл. Удобно, если используется часто. Минус: меньше контекста при чтении.\n\n" +
          "`from math import *` — приносит ВСЁ. **Так делать почти никогда не надо**: непонятно, откуда что взялось, ломаются IDE и линтеры.\n\n" +
          "`import numpy as np` — алиас. Полезно для устоявшихся коротких имён (`np`, `pd`, `tf`).\n\n" +
          "**Стандартная библиотека** уже идёт с Python: `os`, `sys`, `json`, `re`, `pathlib`, `datetime`, `collections`, `itertools`, `functools`, `typing`, `dataclasses` — это твои основные инструменты.\n\n" +
          "**Сторонние** — устанавливаются через `pip install ...`. Список зависимостей хранят в `requirements.txt` или `pyproject.toml`.",
        code:
          "import math\n" +
          "from datetime import datetime, timedelta\n" +
          "from pathlib import Path\n" +
          "import json as J            # реже, но иногда полезно\n\n" +
          "print(math.pi)\n" +
          "print(datetime.now())\n" +
          "print(Path(\"/tmp\") / \"a.txt\")  # path joining\n" +
          "print(J.dumps({\"k\": 1}))",
        keyTakeaways: [
          "`import module` + `module.thing` — самый явный стиль.",
          "from X import a, b — для часто используемых.",
          "from X import * — антипаттерн, не используй.",
          "Алиасы как np/pd — норма для устоявшихся библиотек.",
        ],
        pitfalls: [
          "Циклические импорты (a импортирует b, b импортирует a) — ломаются. Решение: разделить общий код в третий модуль.",
          "`from X import *` ломает поиск ссылок и линтинг.",
        ],
      },
      {
        heading: "Точка входа и пакеты",
        tagline: "if __name__ == '__main__': — главный страж",
        body:
          "Когда Python запускает файл напрямую (`python my.py`), переменная `__name__` в этом файле равна строке `\"__main__\"`. Если же файл импортирован — `__name__` равно имени модуля.\n\n" +
          "Поэтому идиома:\n\n" +
          "```\n" +
          "def main():\n" +
          "    ...\n\n" +
          "if __name__ == \"__main__\":\n" +
          "    main()\n" +
          "```\n\n" +
          "Это позволяет файл и импортировать (как модуль с функциями), и запускать (как самостоятельную программу) — без того, чтобы при импорте сразу запускался основной код.\n\n" +
          "**Пакет** — это папка, в которой лежит файл `__init__.py` (он может быть пустым). Внутри пакета можно делать **относительные импорты**:\n\n" +
          "```\n" +
          "from .utils import helper        # из соседнего модуля\n" +
          "from ..other_pkg import thing    # из родительского пакета\n" +
          "```",
        code:
          "# math_utils.py\n" +
          "def square(x):\n" +
          "    return x * x\n\n" +
          "def main():\n" +
          "    print(square(5))\n\n" +
          "if __name__ == \"__main__\":\n" +
          "    main()\n\n" +
          "# Теперь:\n" +
          "# python math_utils.py  → напечатает 25\n" +
          "# from math_utils import square  → не запустит main(), просто даст функцию",
        keyTakeaways: [
          "`if __name__ == \"__main__\":` — отделяет код, который должен выполниться только при прямом запуске.",
          "Пакет = папка с __init__.py.",
          "Относительные импорты используют точки: `.` и `..`.",
        ],
        pitfalls: [
          "Без `if __name__ ...` твой основной код выполнится при простом `import` — это часто баг.",
          "Относительные импорты работают только внутри пакета, не из скриптов.",
        ],
      },
      {
        heading: "Стандартная библиотека: collections и itertools",
        tagline: "Знай их — экономь часы написания собственных велосипедов",
        body:
          "**collections** — специализированные контейнеры:\n\n" +
          "- `Counter(seq)` — словарь частот: `Counter('banana') → {'a':3,'n':2,'b':1}`; метод `.most_common(n)` возвращает n самых частых.\n" +
          "- `defaultdict(factory)` — словарь с автосозданием default при обращении к несуществующему ключу: `defaultdict(list)`, `defaultdict(int)`.\n" +
          "- `namedtuple('Point', 'x y')` — кортеж с именованными полями. Доступ по имени, неизменяем.\n" +
          "- `deque(maxlen=N)` — двусторонняя очередь; `.appendleft()`, `.popleft()` за O(1) (список — O(n) слева).\n\n" +
          "**itertools** — бесконечные и комбинаторные итераторы:\n\n" +
          "- `chain(a, b, c)` — слить несколько итерируемых в один поток.\n" +
          "- `islice(iter, n)` — ленивый срез первых n элементов.\n" +
          "- `groupby(sorted_seq, key)` — сгруппировать соседние одинаковые (нужен sort перед!).\n" +
          "- `product(a, b)`, `combinations(a, r)`, `permutations(a, r)` — комбинаторика.",
        code:
          "from collections import Counter, defaultdict, deque\n" +
          "from itertools import chain, islice\n\n" +
          "# Counter\n" +
          "c = Counter(\"banana\")\n" +
          "print(c.most_common(2))         # [('a', 3), ('n', 2)]\n\n" +
          "# defaultdict — не надо проверять наличие ключа\n" +
          "groups: dict[int, list[str]] = defaultdict(list)\n" +
          "for word in [\"py\", \"go\", \"rust\", \"c\"]:\n" +
          "    groups[len(word)].append(word)\n" +
          "print(dict(groups))             # {2: ['py', 'go'], 4: ['rust'], 1: ['c']}\n\n" +
          "# deque — очередь с двух сторон\n" +
          "q = deque([1, 2, 3], maxlen=3)\n" +
          "q.appendleft(0)                 # [0, 1, 2] — 3 вытолкнуто\n\n" +
          "# chain — слить списки без явного создания\n" +
          "all_nums = list(chain([1, 2], [3, 4], [5, 6]))\n" +
          "print(all_nums)                 # [1, 2, 3, 4, 5, 6]",
        keyTakeaways: [
          "Counter — счётчик частот с удобным .most_common().",
          "defaultdict(list) — замена `d.setdefault(k, []).append(...)`, но короче.",
          "deque — O(1) для операций с обоих концов (list.insert(0, x) — O(n)).",
        ],
        pitfalls: [
          "groupby из itertools работает только с уже отсортированными данными — иначе одна группа окажется в нескольких местах.",
          "deque с maxlen автоматически выбрасывает элементы с противоположного конца.",
        ],
      },
    ],
    cheatSheet: [
      "import module / from module import name / import module as alias.",
      "Не используй from module import *.",
      "Стандартная библиотека: os, sys, json, re, pathlib, datetime, collections, itertools, functools, typing, dataclasses.",
      "if __name__ == \"__main__\": — точка входа.",
      "Пакет = папка с __init__.py. Относительные импорты с . и ..",
      "Counter, defaultdict, deque — из collections; chain, islice, groupby — из itertools.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "m4-f1",
      title: "Импорт и алиас",
      description: "Импортируй модули правильно.",
      code:
        "{{0}} math\n" +
        "{{1}} datetime {{2}} datetime, timedelta\n" +
        "import json {{3}} J\n\n" +
        "print(math.sqrt(2))\n" +
        "print(datetime.now() + timedelta(days=1))",
      answers: [["import"], ["from"], ["import"], ["as"]],
      hints: [
        "Простая форма импорта модуля.",
        "Принести конкретные имена.",
        "Из чего и что.",
        "Алиас.",
      ],
      explanation: {
        summary:
          "Три самые частые формы: import X, from X import a, b, и import X as alias. Знать все три обязательно.",
        keyPoints: [
          "import math — модулем, доступ через точку.",
          "from datetime import ... — конкретные имена.",
          "as — алиас для краткости.",
        ],
      },
    },
    {
      type: "fill",
      id: "m4-f2",
      title: "Точка входа",
      description: "Заверши идиому точки входа.",
      code:
        "def main():\n" +
        "    print(\"Запущен напрямую\")\n\n" +
        "if {{0}} == \"{{1}}\":\n" +
        "    {{2}}()",
      answers: [["__name__"], ["__main__"], ["main"]],
      hints: [
        "Специальная переменная имени модуля.",
        "Строка, которой равно __name__ при прямом запуске.",
        "Имя функции, которую вызываем.",
      ],
      explanation: {
        summary:
          "Защита `if __name__ == '__main__':` гарантирует, что main() запустится только при прямом вызове, а не при импорте файла как модуля.",
        keyPoints: [
          "Без этого блока импорт = запуск программы — это плохо.",
          "С ним — файл одновременно и библиотека, и скрипт.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "m4-q1",
      title: "Антипаттерн from X import *",
      question:
        "Назови главный недостаток конструкции from module import * .",
      answers: [
        "загрязняет пространство имён, неясно что откуда взялось",
        "неявно приносит много имён, ломает читаемость и линтеры",
        "непонятно откуда взялись имена, конфликты и ошибки",
        "загрязняет namespace и мешает читаемости",
      ],
      hint: "Что станет с пространством имён файла?",
      explanation:
        "Эта конструкция приносит ВСЕ публичные имена модуля и загрязняет namespace. Невозможно понять, откуда взялась функция, есть риск перекрыть свои имена и сломать линтеры/IDE.",
    },
    {
      type: "question",
      id: "m4-q2",
      title: "Что делает __init__.py?",
      question:
        "Что присутствие файла __init__.py в папке означает с точки зрения Python?",
      answers: [
        "что папка является пакетом",
        "папка становится пакетом python",
        "что директория — это пакет, который можно импортировать",
        "папка — пакет",
      ],
      hint: "Это маркер.",
      explanation:
        "Наличие __init__.py делает папку пакетом — её можно импортировать, использовать как namespace для модулей внутри. Сам файл может быть пустым, либо содержать инициализацию пакета.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "m4-w1",
      title: "Скрипт с точкой входа",
      task:
        "Напиши маленький модуль math_utils.py, в котором есть две функции: square(x) и cube(x), и точка входа, которая печатает square(5) и cube(3) только при прямом запуске. Используй idiom if __name__ == '__main__':.",
      hints: [
        "Функции возвращают x ** 2 и x ** 3.",
        "main() вызывает обе с print.",
        "В конце файла — if __name__ == '__main__': main().",
      ],
      required: ["def square(", "def cube(", "def main(", "if __name__ ==", "main()"],
      minLines: 9,
      explanation: {
        summary:
          "Образцовый минимальный модуль: можно импортировать функции, можно запускать как скрипт.",
        keyPoints: [
          "Идиома точки входа — стандарт в любом проекте.",
          "main() — обычная функция, имя по конвенции.",
        ],
      },
    },
  ],
};

const m5: Round = {
  number: 5,
  title: "Middle · Декораторы и functools",
  level: "Средний → Сложный",
  intro:
    "Декоратор — это функция, которая принимает другую функцию и возвращает новую. Дает возможность аккуратно «обернуть» поведение: логирование, кэш, замер времени, авторизация.",
  lesson: {
    title: "Функции — first-class. Декораторы — это «обёртки»",
    summary:
      "Что значит first-class, что такое замыкание, как работает @decorator, зачем functools.wraps, и как принимать аргументы у самого декоратора.",
    readingMinutes: 7,
    sections: [
      {
        heading: "Функции как объекты",
        tagline: "Функцию можно положить в переменную, передать в параметре, вернуть",
        body:
          "В Python функции — **first-class objects**: их можно присваивать, передавать в другие функции, возвращать как результат. Именно это делает декораторы возможными.\n\n" +
          "**Замыкание (closure)** — это вложенная функция, которая «помнит» переменные внешней даже после того, как внешняя завершилась.",
        code:
          "def make_multiplier(k):\n" +
          "    def inner(x):\n" +
          "        return x * k    # k «помнится» благодаря замыканию\n" +
          "    return inner\n\n" +
          "double = make_multiplier(2)\n" +
          "triple = make_multiplier(3)\n" +
          "print(double(10))   # 20\n" +
          "print(triple(10))   # 30\n\n" +
          "# Функция как аргумент\n" +
          "def apply_twice(fn, x):\n" +
          "    return fn(fn(x))\n\n" +
          "print(apply_twice(double, 5))   # 20",
        keyTakeaways: [
          "Функция — это объект; её можно передавать и возвращать.",
          "Замыкание помнит переменные внешней функции.",
          "Это основа декораторов, callback'ов, функционального стиля.",
        ],
        pitfalls: [
          "Замыкание захватывает переменные **по ссылке**, а не по значению. В цикле это даёт классический баг — все лямбды смотрят на финальное значение.",
          "Чтобы зафиксировать значение, используй параметр по умолчанию: `lambda x, k=k: ...`.",
        ],
      },
      {
        heading: "Декораторы: @decorator и functools.wraps",
        tagline: "@d → name = d(name) — это просто синтаксический сахар",
        body:
          "Запись:\n\n" +
          "```\n" +
          "@my_decorator\n" +
          "def func(...): ...\n" +
          "```\n\n" +
          "...это **в точности то же самое**, что:\n\n" +
          "`func = my_decorator(func)`\n\n" +
          "Каркас декоратора:\n\n" +
          "```\n" +
          "from functools import wraps\n\n" +
          "def my_decorator(fn):\n" +
          "    @wraps(fn)\n" +
          "    def wrapper(*args, **kwargs):\n" +
          "        # до\n" +
          "        result = fn(*args, **kwargs)\n" +
          "        # после\n" +
          "        return result\n" +
          "    return wrapper\n" +
          "```\n\n" +
          "**`@wraps(fn)`** — это must-have. Без него у обёрнутой функции теряется имя, docstring, аннотации — всё показывает «wrapper». Это путает дебаггеры и автодокументацию.\n\n" +
          "**Декоратор с аргументами** — это функция, которая возвращает декоратор:\n\n" +
          "```\n" +
          "def repeat(n):\n" +
          "    def deco(fn):\n" +
          "        @wraps(fn)\n" +
          "        def wrapper(*a, **kw):\n" +
          "            for _ in range(n):\n" +
          "                fn(*a, **kw)\n" +
          "        return wrapper\n" +
          "    return deco\n\n" +
          "@repeat(3)\n" +
          "def hi(): print(\"Hi\")\n" +
          "```\n\n" +
          "Полезные готовые декораторы из `functools`: `@lru_cache(maxsize=None)` — мемоизация (кэш по аргументам); `@cache` (3.9+) — то же без maxsize.",
        code:
          "from functools import wraps, lru_cache\n" +
          "import time\n\n" +
          "def timed(fn):\n" +
          "    @wraps(fn)\n" +
          "    def wrapper(*a, **kw):\n" +
          "        t = time.perf_counter()\n" +
          "        result = fn(*a, **kw)\n" +
          "        dt = time.perf_counter() - t\n" +
          "        print(f\"{fn.__name__} занял {dt*1000:.2f} мс\")\n" +
          "        return result\n" +
          "    return wrapper\n\n" +
          "@timed\n" +
          "@lru_cache(maxsize=None)\n" +
          "def fib(n):\n" +
          "    return n if n < 2 else fib(n - 1) + fib(n - 2)\n\n" +
          "print(fib(30))",
        keyTakeaways: [
          "@d над функцией — это просто `f = d(f)`.",
          "Используй @wraps(fn) чтобы сохранить имя/docstring обёрнутой функции.",
          "Декоратор с аргументами — это «функция, возвращающая декоратор».",
          "@lru_cache — встроенная мемоизация, мощно ускоряет рекурсию.",
        ],
        pitfalls: [
          "Без @wraps теряется самоописание функции — больно при отладке.",
          "Декоратор с аргументами — это ТРИ уровня вложенности. Часто запутывает; начинай с двух.",
          "Применяются декораторы СНИЗУ ВВЕРХ: `@a @b def f` = `a(b(f))`.",
        ],
      },
    ],
    cheatSheet: [
      "Декоратор: def d(fn): def w(*a, **kw): ...; return w; return w.",
      "@d def f(): ... — это f = d(f).",
      "Всегда @wraps(fn) внутри обёртки.",
      "Декоратор с аргументами: def d(arg): def deco(fn): def w(...): ...",
      "functools.lru_cache / functools.cache — готовая мемоизация.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "m5-f1",
      title: "Каркас декоратора",
      description: "Заполни пропуски в типичном декораторе с wraps.",
      code:
        "from functools import {{0}}\n\n" +
        "def log_call(fn):\n" +
        "    @{{1}}(fn)\n" +
        "    def wrapper(*args, **kwargs):\n" +
        "        print(f\"calling {fn.__name__}\")\n" +
        "        result = fn(*args, **kwargs)\n" +
        "        return {{2}}\n" +
        "    return wrapper\n\n" +
        "@log_call\n" +
        "def add(a, b): return a + b",
      answers: [["wraps"], ["wraps"], ["result"]],
      hints: [
        "Импорт must-have инструмента для декораторов.",
        "Декоратор внутри декоратора — сохраняет метаданные.",
        "Что возвращаем после вызова исходной функции.",
      ],
      explanation: {
        summary:
          "Шаблон, который пригодится в 90% случаев: импорт wraps, декоратор @wraps(fn) поверх wrapper, возврат result.",
        keyPoints: [
          "Без @wraps add.__name__ станет 'wrapper'.",
          "Возврат result обязателен, иначе функция всегда вернёт None.",
        ],
      },
    },
    {
      type: "fill",
      id: "m5-f2",
      title: "Мемоизация через lru_cache",
      description: "Ускори рекурсивный fib с помощью встроенного декоратора.",
      code:
        "from functools import {{0}}\n\n" +
        "@{{0}}({{1}}=None)\n" +
        "def fib(n):\n" +
        "    return n if n < 2 else fib(n - 1) + fib(n - 2)\n\n" +
        "print(fib(50))",
      answers: [["lru_cache"], ["maxsize"]],
      hints: [
        "Декоратор для кэша по аргументам.",
        "Параметр, ограничивающий размер кэша. None — без ограничения.",
      ],
      explanation: {
        summary:
          "lru_cache(maxsize=None) превращает наивный экспоненциальный fib в линейный за счёт кэша. С 3.9+ есть просто @cache (без maxsize).",
        keyPoints: [
          "Аргументы должны быть хешируемыми.",
          "lru_cache работает только на уровне функций, не методов с self в произвольных классах.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "m5-q1",
      title: "Что такое декоратор по сути?",
      question:
        "Какое определение декоратора в Python наиболее точное?",
      answers: [
        "функция, которая принимает функцию и возвращает функцию",
        "вызываемое, которое получает функцию и возвращает функцию",
        "функция-обёртка над другой функцией",
        "callable, принимающее функцию и возвращающее функцию",
      ],
      hint: "Что подаётся на вход и что выходит на выход.",
      explanation:
        "Декоратор — это вызываемое (обычно функция), которое получает другую функцию и возвращает (обычно новую) функцию. @d def f = f = d(f).",
    },
    {
      type: "question",
      id: "m5-q2",
      title: "Зачем @wraps(fn)?",
      question:
        "Что произойдёт с функцией, если в декораторе НЕ использовать @functools.wraps(fn)?",
      answers: [
        "потеряются имя, docstring и метаданные исходной функции",
        "функция будет показывать имя wrapper вместо исходного",
        "потеряются __name__, __doc__ и __wrapped__",
        "обёрнутая функция потеряет своё имя и docstring",
      ],
      hint: "Метаданные функции.",
      explanation:
        "Без @wraps у обёрнутой функции __name__ станет 'wrapper', docstring пропадёт, аннотации скопированы не будут — это путает дебаггеры, автодокументацию и тесты.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "m5-w1",
      title: "Декоратор @timed",
      task:
        "Напиши декоратор timed, который измеряет время выполнения функции и печатает результат: '<имя> занял <мс> мс'. Использует functools.wraps и time.perf_counter. Покажи применение к функции, которая делает sum(range(1_000_000)).",
      hints: [
        "import time, from functools import wraps.",
        "Внутри обёртки: t = time.perf_counter(), результат, dt в мс.",
        "@wraps(fn) обязателен.",
      ],
      required: ["from functools import wraps", "time.perf_counter()", "@wraps(fn)", "def wrapper(", "return wrapper", "@timed"],
      minLines: 12,
      explanation: {
        summary:
          "Каноничный декоратор для замера времени. Полезен в реальной разработке для быстрого профилирования.",
        keyPoints: [
          "perf_counter — высокоточный таймер.",
          "@wraps(fn) — must-have.",
        ],
      },
    },
  ],
};

const m6: Round = {
  number: 6,
  title: "Middle · Итераторы и генераторы",
  level: "Сложный",
  intro:
    "Итератор — это что-то, по чему можно ходить через for. Генератор — простой способ создать свой итератор через yield. Понимание этих штук открывает путь к ленивым вычислениям и обработке больших данных.",
  lesson: {
    title: "iter, next, yield, генераторы",
    summary:
      "Протокол итератора, генератор-функции, генераторные выражения, бесконечные потоки, главные идиомы из itertools.",
    readingMinutes: 7,
    sections: [
      {
        heading: "Протокол итератора",
        tagline: "Iterable отдаёт iterator. Iterator знает next().",
        body:
          "**Iterable** (итерируемое) — то, по чему можно пройтись `for`-ом: список, строка, словарь, файл, диапазон.\n\n" +
          "**Iterator** (итератор) — объект с методом `__next__()`, который выдаёт следующее значение или бросает `StopIteration`.\n\n" +
          "Связь: `iter(iterable)` возвращает iterator. `for x in seq:` под капотом делает ровно `it = iter(seq); while True: try: x = next(it); except StopIteration: break`.\n\n" +
          "Iterator — обычно одноразовый. Список можно перебирать сколько хочешь, а итератор — один раз.",
        code:
          "lst = [10, 20, 30]\n" +
          "it = iter(lst)\n" +
          "print(next(it))   # 10\n" +
          "print(next(it))   # 20\n" +
          "print(next(it))   # 30\n" +
          "# print(next(it)) # StopIteration\n\n" +
          "# Свой итератор по убыванию\n" +
          "class Countdown:\n" +
          "    def __init__(self, n): self.n = n\n" +
          "    def __iter__(self): return self\n" +
          "    def __next__(self):\n" +
          "        if self.n <= 0:\n" +
          "            raise StopIteration\n" +
          "        self.n -= 1\n" +
          "        return self.n + 1\n\n" +
          "for x in Countdown(3):\n" +
          "    print(x)   # 3, 2, 1",
        keyTakeaways: [
          "Iterable → iter() → Iterator → next() → значения / StopIteration.",
          "Своя итерация — это пара методов __iter__ и __next__.",
          "Итераторы обычно одноразовые.",
        ],
        pitfalls: [
          "Не делай `__iter__` так, чтобы он возвращал НОВЫЙ итератор каждый раз — это путает.",
          "Не забудь raise StopIteration при исчерпании.",
        ],
      },
      {
        heading: "yield: генераторы и itertools",
        tagline: "Функция с yield — это генератор. Лениво. Без памяти.",
        body:
          "**Генератор-функция** — это функция, в которой есть `yield`. При вызове она НЕ выполняется сразу — возвращает генератор-объект (это итератор). Каждое `yield` приостанавливает функцию и выдаёт значение; следующий `next()` продолжает с того же места.\n\n" +
          "Это даёт лениво вычисляемые потоки: можно делать **бесконечные** последовательности и читать данные потоком, не загружая всё в память.\n\n" +
          "**Генераторное выражение** — `(expr for x in seq if cond)` — компактная форма генератора без отдельной функции.\n\n" +
          "Стандартный модуль **`itertools`** — золотой запас:\n\n" +
          "- `count(start, step)` — бесконечная арифметическая прогрессия;\n" +
          "- `cycle(seq)` — бесконечно повторяет последовательность;\n" +
          "- `chain(a, b, ...)` — склеивает несколько итерируемых;\n" +
          "- `islice(it, stop)` / `islice(it, start, stop)` — срез итератора;\n" +
          "- `groupby`, `combinations`, `permutations`, `product` — для комбинаторики.",
        code:
          "from itertools import islice, count\n\n" +
          "def fibs():\n" +
          "    a, b = 0, 1\n" +
          "    while True:           # бесконечный поток!\n" +
          "        yield a\n" +
          "        a, b = b, a + b\n\n" +
          "print(list(islice(fibs(), 10)))\n" +
          "# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n\n" +
          "# Бесконечная прогрессия + лимит\n" +
          "first_10_evens = list(islice((x for x in count(0, 2)), 10))\n" +
          "print(first_10_evens)\n" +
          "# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]",
        keyTakeaways: [
          "yield — это «выдай значение и засни до следующего next».",
          "Генератор → ленивая последовательность → можно бесконечную.",
          "itertools.islice безопасно отрезает первые N значений.",
        ],
        pitfalls: [
          "Генератор пройти можно ОДИН раз. Сохрани в list, если нужно дважды.",
          "В бесконечный генератор без islice не клади list() — повиснешь.",
          "yield внутри обычной функции делает её ВСЮ генератором, даже если ветка с yield не выполняется.",
        ],
      },
    ],
    cheatSheet: [
      "iter(seq) → итератор; next(it) → значение / StopIteration.",
      "Функция с yield = генератор-функция.",
      "(expr for x in seq) — генераторное выражение.",
      "itertools: count, cycle, chain, islice, groupby, combinations.",
      "Генератор — одноразовый. Бесконечный — оборачивай в islice.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "m6-f1",
      title: "Свой генератор Фибоначчи",
      description: "Допиши бесконечный генератор fibs.",
      code:
        "def fibs():\n" +
        "    a, b = 0, 1\n" +
        "    while True:\n" +
        "        {{0}} a\n" +
        "        a, b = b, a + b\n\n" +
        "from itertools import {{1}}\n" +
        "print(list({{1}}(fibs(), 6)))   # [0, 1, 1, 2, 3, 5]",
      answers: [["yield"], ["islice"]],
      hints: [
        "Ключевое слово, которое делает функцию генератором.",
        "Функция, которая «отрезает» первые N элементов из итератора.",
      ],
      explanation: {
        summary:
          "yield превращает функцию в генератор. islice — единственно правильный способ взять конечный кусок из бесконечного потока.",
        keyPoints: [
          "Без islice list(fibs()) повис бы навсегда.",
          "islice(it, n) = первые n; islice(it, start, stop) = срез.",
        ],
      },
    },
    {
      type: "fill",
      id: "m6-f2",
      title: "Генераторное выражение в sum",
      description: "Подсчитай сумму квадратов первых 100 натуральных чисел без промежуточного списка.",
      code:
        "total = {{0}}({{1}} ** 2 for n in range(1, 101))\n" +
        "print(total)   # 338350",
      answers: [["sum"], ["n"]],
      hints: [
        "Функция суммы.",
        "Какая переменная пробегает по range.",
      ],
      explanation: {
        summary:
          "Когда генератор — единственный аргумент функции, скобки можно опустить. Это идиоматично для sum/any/all/max/min.",
        keyPoints: [
          "Никакого промежуточного [n**2 for n in ...] — экономия памяти.",
          "n — переменная цикла, n**2 — выражение.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "m6-q1",
      title: "Чем yield отличается от return?",
      question:
        "В чём принципиальное отличие yield от return в функции?",
      answers: [
        "yield приостанавливает функцию и возобновляет её при следующем next, return завершает функцию",
        "yield возвращает значение и сохраняет состояние, return завершает выполнение",
        "yield делает функцию генератором и не завершает её",
        "yield не завершает функцию, а приостанавливает её",
      ],
      hint: "Что происходит с функцией после yield против return.",
      explanation:
        "return завершает функцию насовсем. yield приостанавливает её, выдаёт значение и сохраняет состояние — следующий next() продолжит выполнение со следующей инструкции после yield.",
    },
    {
      type: "question",
      id: "m6-q2",
      title: "Сколько раз можно пройти генератор?",
      question:
        "Сколько раз можно пройти один и тот же объект-генератор циклом for?",
      answers: ["один", "1", "один раз", "только один раз"],
      hint: "Генератор не «перематывается».",
      explanation:
        "Генератор — одноразовый итератор. После исчерпания второй проход даёт пустоту. Если нужно пройти несколько раз — сохрани в list или каждый раз создавай новый генератор.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "m6-w1",
      title: "Чанки списка",
      task:
        "Напиши функцию-генератор chunks(seq, n), которая выдаёт последовательные куски длины n (последний может быть короче). Пример: list(chunks([1,2,3,4,5], 2)) → [[1,2], [3,4], [5]]. Используй yield и срезы.",
      hints: [
        "def chunks(seq, n):",
        "for i in range(0, len(seq), n):",
        "yield seq[i:i+n]",
      ],
      required: ["def chunks(", "yield", "range(", "len(", "[i:"],
      minLines: 4,
      explanation: {
        summary:
          "Один из топ-частых паттернов: разбить большую последовательность на удобные пакеты для обработки.",
        keyPoints: [
          "yield делает функцию генератором.",
          "Срез [i:i+n] безопасен — не упадёт, если за хвост.",
        ],
      },
    },
  ],
};

const m7: Round = {
  number: 7,
  title: "Middle · Типизация (typing) и dataclasses",
  level: "Сложный",
  intro:
    "Python динамический, но с 3.5+ умеет статические аннотации типов. Это не «строгая типизация», но огромная подсказка для людей, IDE и mypy/pyright. Параллельно учим @dataclass — короткий способ описать «структуру с данными».",
  lesson: {
    title: "Аннотации типов и @dataclass",
    summary:
      "Базовые аннотации (int, list[str], dict[str, int]), Optional, Union, TypeAlias, Protocol; @dataclass для DTO.",
    readingMinutes: 7,
    sections: [
      {
        heading: "Аннотации типов",
        tagline: "Это контракт для людей и проверщиков, не строгая проверка",
        body:
          "Python НЕ проверяет аннотации в рантайме (за редкими исключениями). Они существуют для:\n\n" +
          "1. человека — читая сигнатуру, ясно что куда;\n" +
          "2. IDE — подсказывает поля, спорит при неверных вызовах;\n" +
          "3. статических анализаторов (mypy, pyright) — ловят баги до рантайма.\n\n" +
          "С Python 3.9+ можно писать **встроенные дженерики**: `list[str]`, `dict[str, int]`, `tuple[int, ...]` — без `typing.List`/`Dict`. Со 3.10+ — `int | None` вместо `Optional[int]`, и `int | str` вместо `Union[int, str]`.",
        code:
          "from typing import Iterable\n\n" +
          "def average(nums: list[float]) -> float:\n" +
          "    if not nums:\n" +
          "        return 0.0\n" +
          "    return sum(nums) / len(nums)\n\n" +
          "def find_user(uid: int) -> dict[str, str] | None:\n" +
          "    return None\n\n" +
          "def take_strings(items: Iterable[str]) -> list[str]:\n" +
          "    return [s.strip() for s in items]",
        keyTakeaways: [
          "Аннотации не проверяются в рантайме — это подсказка.",
          "С Py 3.9: list[str], dict[str, int]. С 3.10: int | None.",
          "Iterable[X] — для «любой итерируемой штуки».",
        ],
        pitfalls: [
          "Не пиши Optional[X] и `int | None` одновременно — выбери один стиль.",
          "Не путай `list` (тип) и `List` (старый алиас из typing). На новых версиях — list.",
          "Аннотации не превращают код в безопасный — нужен инструмент проверки (mypy/pyright).",
        ],
      },
      {
        heading: "@dataclass — DTO одной строкой",
        tagline: "Никаких __init__, __repr__ и __eq__ руками",
        body:
          "Декоратор `@dataclass` (модуль `dataclasses`) автоматически создаёт `__init__`, `__repr__`, `__eq__` по полям. Идеально для контейнеров данных, ответов API, конфигов.\n\n" +
          "Полезные параметры: `frozen=True` — поля нельзя менять (объект становится хешируемым → можно класть в set/использовать как ключ); `slots=True` (3.10+) — экономит память.\n\n" +
          "Для значений по умолчанию изменяемых типов используй `field(default_factory=list)` — иначе будет тот же баг, что с дефолтными `[]` в функциях.",
        code:
          "from dataclasses import dataclass, field\n\n" +
          "@dataclass\n" +
          "class User:\n" +
          "    name: str\n" +
          "    age: int = 0\n" +
          "    hobbies: list[str] = field(default_factory=list)\n\n" +
          "u = User(\"Аня\", 17)\n" +
          "print(u)              # User(name='Аня', age=17, hobbies=[])\n" +
          "u.hobbies.append(\"книги\")\n" +
          "print(u == User(\"Аня\", 17, [\"книги\"]))   # True\n\n" +
          "@dataclass(frozen=True)\n" +
          "class Point:\n" +
          "    x: int\n" +
          "    y: int\n\n" +
          "p = Point(1, 2)\n" +
          "# p.x = 10  # FrozenInstanceError\n" +
          "print({Point(1, 2), Point(1, 2)})   # {(1,2)} — works as set element",
        keyTakeaways: [
          "@dataclass пишет __init__/__repr__/__eq__ за тебя.",
          "field(default_factory=list) — для изменяемых дефолтов.",
          "frozen=True → неизменяемый, хешируемый, можно в set/dict.",
        ],
        pitfalls: [
          "Не пиши `hobbies: list[str] = []` — это тот же общий список во всех инстансах.",
          "Поля без дефолта должны идти ДО полей с дефолтом.",
          "@dataclass — не ORM. Для БД нужны другие инструменты.",
        ],
      },
    ],
    cheatSheet: [
      "Аннотации не проверяются в рантайме — это подсказка для IDE/mypy.",
      "Python 3.9+: list[str], dict[str, int], tuple[int, ...].",
      "Python 3.10+: int | None вместо Optional[int].",
      "@dataclass → __init__/__repr__/__eq__ за бесплатно.",
      "field(default_factory=list/dict/...) для изменяемых дефолтов.",
      "@dataclass(frozen=True, slots=True) — для хешируемых неизменяемых DTO.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "m7-f1",
      title: "Аннотации типов",
      description: "Расставь современные аннотации.",
      code:
        "def normalize(items: {{0}}[str]) -> {{1}}[str]:\n" +
        "    return [s.strip().lower() for s in items]\n\n" +
        "def find(uid: int) -> dict[str, str] {{2}} None:\n" +
        "    return None",
      answers: [["list"], ["list"], ["|"]],
      hints: [
        "Тип «список из…» (с маленькой буквы, Py3.9+).",
        "Тот же тип результата.",
        "Современный способ написать Optional.",
      ],
      explanation: {
        summary:
          "Современный стиль аннотаций без typing.List/Optional: используем встроенный list и оператор |.",
        keyPoints: [
          "list[str], dict[str, int] — Py 3.9+.",
          "int | None — Py 3.10+.",
        ],
      },
    },
    {
      type: "fill",
      id: "m7-f2",
      title: "@dataclass с правильным дефолтом",
      description: "Заверши dataclass с list-полем.",
      code:
        "from dataclasses import {{0}}, {{1}}\n\n" +
        "@{{0}}\n" +
        "class User:\n" +
        "    name: str\n" +
        "    age: int = 0\n" +
        "    hobbies: list[str] = {{1}}(default_factory={{2}})",
      answers: [["dataclass"], ["field"], ["list"]],
      hints: [
        "Декоратор для DTO.",
        "Функция, через которую задают сложные дефолты.",
        "Что вызывать, чтобы создать новый пустой список.",
      ],
      explanation: {
        summary:
          "field(default_factory=list) гарантирует, что у каждого экземпляра будет СВОЙ пустой список. Просто `= []` создал бы один общий объект — баг.",
        keyPoints: [
          "default_factory принимает callable — list, dict, set, lambda.",
          "Поля без дефолта идут раньше, с дефолтом — позже.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "m7-q1",
      title: "Проверяет ли Python аннотации?",
      question:
        "Проверяет ли интерпретатор Python аннотации типов в рантайме? Ответь да/нет и кратко поясни.",
      answers: [
        "нет, аннотации не проверяются в рантайме, для проверки нужен mypy или pyright",
        "нет, проверка идёт статическими анализаторами вроде mypy",
        "нет, нужны внешние инструменты типа mypy/pyright",
        "нет",
      ],
      hint: "Python — динамически типизированный.",
      explanation:
        "Нет. Python НЕ проверяет аннотации в рантайме (за редкими случаями типа Pydantic). Это подсказка для людей, IDE и статических анализаторов (mypy, pyright).",
    },
    {
      type: "question",
      id: "m7-q2",
      title: "Зачем default_factory?",
      question:
        "Почему в @dataclass для list/dict/set нужно использовать field(default_factory=list), а не = [] напрямую?",
      answers: [
        "иначе все экземпляры будут разделять один и тот же общий список",
        "потому что иначе все объекты получат один и тот же список как общий",
        "общий изменяемый объект между всеми экземплярами — баг",
        "default = [] создаст один общий list для всех экземпляров",
      ],
      hint: "Та же проблема, что с дефолтным аргументом функции `def f(x=[])`.",
      explanation:
        "Если написать `hobbies: list[str] = []`, то ВСЕ экземпляры будут разделять ОДИН и тот же список. Изменения в одном — видны во всех. default_factory вызывает list() заново для каждого инстанса.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "m7-w1",
      title: "@dataclass Product",
      task:
        "Опиши через @dataclass класс Product с полями name: str, price: float и tags: list[str] (по умолчанию пустой список). Создай два продукта, добавь тег к одному и распечатай оба, чтобы убедиться, что списки независимые.",
      hints: [
        "from dataclasses import dataclass, field.",
        "tags: list[str] = field(default_factory=list).",
        "Два продукта, метод append к одному.",
      ],
      required: ["from dataclasses import", "@dataclass", "class Product", "field(default_factory=list)", "name: str", "price: float", "tags: list[str]"],
      minLines: 9,
      explanation: {
        summary:
          "Стандартный кусок реальных проектов: dataclass + field(default_factory=...). Знать на автомате обязательно.",
        keyPoints: [
          "@dataclass избавляет от boilerplate.",
          "default_factory критичен для изменяемых дефолтов.",
        ],
      },
    },
  ],
};

export const MIDDLE_ROUNDS: Round[] = [m1, m2, m3, m4, m5, m6, m7];
export const MIDDLE_TOTAL_ROUNDS = MIDDLE_ROUNDS.length;
