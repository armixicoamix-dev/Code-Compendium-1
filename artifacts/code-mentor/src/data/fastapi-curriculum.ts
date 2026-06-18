/**
 * FastAPI Curriculum — 10 раундов
 * Методички МЕГА-ПОДРОБНЫЕ: объяснения + ответы на упражнения + практические гиды.
 * Проверка ответов максимально гибкая.
 */

import type { Round } from "@/data/curriculum";

// ─────────────────────────────────────────────────────────────────────────────
// Round 1 · Введение в FastAPI
// ─────────────────────────────────────────────────────────────────────────────
const fa1: Round = {
  number: 1,
  title: "FastAPI · Введение и первое приложение",
  level: "Начальный",
  intro:
    "FastAPI — современный веб-фреймворк для Python, один из самых быстрых в мире. Он генерирует документацию автоматически, валидирует данные через Pydantic и использует аннотации типов Python.\n\n**В этом раунде:**\n• Что такое FastAPI и почему он быстрый\n• Установка и первое приложение\n• Операции GET / POST\n• Автоматическая документация (Swagger UI)\n• Как запустить приложение через uvicorn",
  lesson: {
    title: "FastAPI — фреймворк, который думает как ты",
    summary:
      "FastAPI создаёт REST API на Python быстрее и надёжнее Flask. Использует аннотации типов Python для автоматической валидации, сериализации и документирования.",
    readingMinutes: 15,
    sections: [
      {
        heading: "Что такое FastAPI и почему его выбирают",
        tagline: "FastAPI = скорость разработки + скорость выполнения + автодокументация",
        body:
          "**FastAPI** — Python-фреймворк для создания REST API, выпущенный в 2018 году Себастьяном Рамиресом. Построен поверх **Starlette** (ASGI-фреймворк) и **Pydantic** (валидация данных).\n\n" +
          "### Что всё это значит простыми словами\n\n" +
          "- **REST API** — набор URL-адресов на сервере, к которым обращаются браузер, мобильное приложение или другой сервис. Ты делаешь GET-запрос на `/users` — сервер возвращает список пользователей в JSON. Это и есть REST API.\n" +
          "- **WSGI** (старый стандарт, Flask/Django) — каждый HTTP-запрос занимает отдельный поток (как отдельный рабочий). Пока один запрос ждёт ответа от БД — поток заблокирован и не может принять новый запрос.\n" +
          "- **ASGI** (новый стандарт, FastAPI) — один поток обрабатывает много запросов одновременно. Пока один запрос ждёт БД — поток переключается на другой запрос. Отсюда высокая скорость.\n" +
          "- **Starlette** — готовый ASGI-«движок» (фундамент). FastAPI построен поверх него и добавляет Pydantic, автодокументацию, аннотации типов.\n" +
          "- **Pydantic** — библиотека для описания структуры данных через классы Python. Ты пишешь `class User(BaseModel): name: str` — и Pydantic сам проверяет что name действительно строка, выдаёт понятную ошибку если нет.\n" +
          "- **JSON** — текстовый формат данных: `{\"name\": \"Анна\", \"age\": 25}`. Браузер и сервер «разговаривают» через JSON.\n\n" +
          "---\n\n" +
          "**Почему FastAPI быстрый:**\n" +
          "1. **ASGI** вместо WSGI — асинхронный интерфейс, поддерживает async/await нативно. Flask/Django используют WSGI — один поток на запрос.\n" +
          "2. **Pydantic v2** написан на Rust — валидация данных в 5–50 раз быстрее чем marshmallow или voluptuous.\n" +
          "3. Минимальный оверхед роутинга — Starlette одна из самых быстрых ASGI-основ.\n" +
          "4. Тесты показывают скорость сравнимую с Go-фреймворками (gin, echo).\n\n" +
          "**Ключевые преимущества над Flask:**\n\n" +
          "| Критерий | Flask | FastAPI |\n" +
          "|---|---|---|\n" +
          "| Валидация данных | Вручную или WTForms | Автоматически через Pydantic |\n" +
          "| Документация | flask-restx или flasgger | Встроена (Swagger + ReDoc) |\n" +
          "| Async поддержка | Слабая (gevent) | Нативная (asyncio) |\n" +
          "| Аннотации типов | Опционально | Обязательны (и это даёт мощь!) |\n" +
          "| Скорость | Средняя | Очень высокая |\n" +
          "| IDE поддержка | Хорошая | Отличная (автодополнение работает точнее) |\n\n" +
          "**Что НЕ умеет FastAPI:**\n" +
          "- Рендерить HTML-шаблоны (для этого есть Jinja2, но это не его основное назначение)\n" +
          "- Быть «полным» веб-фреймворком как Django (нет ORM из коробки, нет admin-панели)\n\n" +
          "FastAPI — это инструмент для REST API и микросервисов. Если нужен сайт с HTML — Flask или Django лучше. Если нужен API — FastAPI лучше.\n\n" +
          "**REST API — что это?**\n" +
          "Набор HTTP-маршрутов (URL), которые принимают JSON-запросы и возвращают JSON-ответы. Браузер, мобильное приложение, другой сервис — все общаются с твоим API через HTTP.",
        code:
          "# Минимальное FastAPI-приложение\n" +
          "from fastapi import FastAPI\n\n" +
          "app = FastAPI()  # создаём экземпляр приложения\n\n" +
          "@app.get('/')   # GET-запрос на корневой URL\n" +
          "def root():\n" +
          "    return {'message': 'Привет, FastAPI!'}\n\n" +
          "# Запуск: uvicorn main:app --reload\n" +
          "# После запуска: http://127.0.0.1:8000\n" +
          "# Документация: http://127.0.0.1:8000/docs\n" +
          "# ReDoc: http://127.0.0.1:8000/redoc",
        keyTakeaways: [
          "FastAPI создан для REST API — не для HTML-сайтов (хотя это тоже возможно).",
          "Декоратор @app.get('/') регистрирует GET-маршрут, @app.post('/') — POST, и т.д.",
          "Функция возвращает dict — FastAPI автоматически сериализует его в JSON.",
        ],
        pitfalls: [
          "uvicorn — это ASGI-сервер для запуска, Flask использует встроенный Werkzeug (WSGI). Это разные стандарты.",
          "return {'key': 'value'} — FastAPI сам делает JSONResponse, не надо писать jsonify().",
          "Аннотации типов — это не просто стиль, это рабочий механизм валидации. Не игнорируй их.",
        ],
        analogy:
          "Flask — как ручная коробка передач: гибко, но надо всё делать самому. FastAPI — как автомат с ассистентом: он сам валидирует, документирует и подсказывает ошибки. Ты пишешь меньше кода, получаешь больше возможностей.",
      },
      {
        heading: "Установка и структура проекта",
        tagline: "pip install fastapi uvicorn[standard] — и готово к работе",
        body:
          "**Установка:**\n\n" +
          "```bash\n" +
          "pip install fastapi uvicorn[standard]\n" +
          "# uvicorn[standard] включает:\n" +
          "# - watchfiles (для --reload)\n" +
          "# - WebSocket поддержку\n" +
          "# - uvloop (ускоренный event loop на Unix)\n" +
          "```\n\n" +
          "**Проверка установки:**\n" +
          "```bash\n" +
          "python -c 'import fastapi; print(fastapi.__version__)'\n" +
          "python -c 'import uvicorn; print(uvicorn.__version__)'\n" +
          "```\n\n" +
          "**Минимальная структура проекта:**\n\n" +
          "```\n" +
          "myapi/\n" +
          "├── main.py          ← точка входа (app = FastAPI())\n" +
          "├── models.py        ← Pydantic модели (схемы данных)\n" +
          "├── routers/         ← роутеры (как blueprints во Flask)\n" +
          "│   ├── __init__.py\n" +
          "│   ├── users.py\n" +
          "│   └── items.py\n" +
          "├── database.py      ← настройка SQLAlchemy (если нужна БД)\n" +
          "├── dependencies.py  ← общие Depends (авторизация и т.д.)\n" +
          "└── requirements.txt\n" +
          "```\n\n" +
          "**Запуск для разработки:**\n" +
          "```bash\n" +
          "uvicorn main:app --reload\n" +
          "# main:app → файл main.py (без .py), переменная app\n" +
          "# --reload → перезапуск при изменениях файлов (только dev!)\n" +
          "# --host 0.0.0.0 → доступно с других устройств в сети\n" +
          "# --port 8080 → изменить порт (по умолчанию 8000)\n" +
          "```\n\n" +
          "**Что видишь после запуска:**\n" +
          "- `http://127.0.0.1:8000` — твой API (возвращает JSON)\n" +
          "- `http://127.0.0.1:8000/docs` — Swagger UI (интерактивная документация, можно тестировать маршруты прямо там!)\n" +
          "- `http://127.0.0.1:8000/redoc` — ReDoc (альтернативный вид документации)\n" +
          "- `http://127.0.0.1:8000/openapi.json` — OpenAPI схема (JSON, используется для генерации клиентов)\n\n" +
          "**Зачем нужна документация из коробки?**\n" +
          "Swagger UI позволяет тестировать API прямо в браузере без Postman или curl. Также фронтенд-разработчики и другие команды могут сразу видеть все маршруты и их схемы.",
        code:
          "# main.py\n" +
          "from fastapi import FastAPI\n\n" +
          "app = FastAPI(\n" +
          "    title='Мой API',           # заголовок в документации\n" +
          "    description='Описание API',  # markdown поддерживается!\n" +
          "    version='1.0.0',\n" +
          "    docs_url='/docs',          # URL Swagger UI\n" +
          "    redoc_url='/redoc',        # URL ReDoc\n" +
          ")\n\n" +
          "@app.get('/', tags=['Root'])  # tags группируют маршруты в Swagger\n" +
          "def root():\n" +
          "    return {'status': 'ok', 'version': '1.0.0'}\n\n" +
          "@app.get('/items', tags=['Items'])\n" +
          "def get_items():\n" +
          "    return [{'id': 1, 'name': 'Item 1'}, {'id': 2, 'name': 'Item 2'}]\n\n" +
          "# В браузере мы не запускаем uvicorn — запускаем код напрямую\n" +
          "print('FastAPI app создан!')\n" +
          "print('Маршруты:', [r.path for r in app.routes if hasattr(r, 'path')])",
        keyTakeaways: [
          "uvicorn main:app — первое слово это имя файла (без .py), второе — имя переменной FastAPI().",
          "--reload нужен только в разработке! В продакшене его не используй.",
          "FastAPI(title=..., description=...) — это метаданные для автоматической документации.",
        ],
        pitfalls: [
          "Если имя файла не main.py (например myapp.py) — используй: uvicorn myapp:app",
          "Не путай uvicorn (ASGI) и gunicorn (WSGI). Для FastAPI нужен uvicorn или hypercorn.",
        ],
      },
      {
        heading: "HTTP-методы и маршруты",
        tagline: "Каждый декоратор — это HTTP-метод: get, post, put, patch, delete",
        body:
          "**Все HTTP-методы FastAPI:**\n\n" +
          "```python\n" +
          "@app.get('/items')         # GET — получить данные (список или один)\n" +
          "@app.post('/items')        # POST — создать новый ресурс\n" +
          "@app.put('/items/{id}')    # PUT — полностью заменить ресурс\n" +
          "@app.patch('/items/{id}')  # PATCH — частично обновить\n" +
          "@app.delete('/items/{id}') # DELETE — удалить\n" +
          "@app.head('/items')        # HEAD — как GET, но без тела\n" +
          "@app.options('/items')     # OPTIONS — CORS preflight\n" +
          "```\n\n" +
          "**REST-соглашения (которым следует FastAPI):**\n\n" +
          "| Метод | URL | Действие | Тело запроса | Ответ |\n" +
          "|---|---|---|---|---|\n" +
          "| GET | /users | Список всех | нет | 200 + список |\n" +
          "| GET | /users/42 | Один пользователь | нет | 200 + объект |\n" +
          "| POST | /users | Создать нового | да (JSON) | 201 + созданный |\n" +
          "| PUT | /users/42 | Полностью обновить | да (полный объект) | 200 + обновлённый |\n" +
          "| PATCH | /users/42 | Частично обновить | да (только изменения) | 200 + обновлённый |\n" +
          "| DELETE | /users/42 | Удалить | нет | 204 (нет тела) |\n\n" +
          "**Path parameters (параметры пути) — /items/{id}:**\n" +
          "Добавь `{имя}` в URL → FastAPI передаёт как аргумент функции. Тип аннотации = автоматическая валидация!\n\n" +
          "```python\n" +
          "@app.get('/items/{item_id}')\n" +
          "def get_item(item_id: int):  # int → FastAPI конвертирует строку из URL в int\n" +
          "    return {'item_id': item_id}\n" +
          "# GET /items/abc → 422 Unprocessable Entity (abc не int!)\n" +
          "# GET /items/42  → {'item_id': 42} ✓\n" +
          "```\n\n" +
          "**Query parameters (параметры запроса) — ?key=value:**\n" +
          "Аргументы функции БЕЗ соответствующего `{имя}` в URL → FastAPI берёт из строки запроса.\n\n" +
          "```python\n" +
          "@app.get('/items')\n" +
          "def list_items(skip: int = 0, limit: int = 10, q: str = None):\n" +
          "    return {'skip': skip, 'limit': limit, 'q': q}\n" +
          "# GET /items?skip=5&limit=20&q=laptop\n" +
          "```\n\n" +
          "**Важный нюанс — порядок маршрутов:**\n" +
          "FastAPI проверяет маршруты в порядке объявления. Статичные пути должны быть ДО динамических!\n\n" +
          "```python\n" +
          "@app.get('/items/new')   # ДОЛЖЕН быть ДО {item_id}!\n" +
          "@app.get('/items/{item_id}')  # иначе 'new' → item_id='new' → 422\n" +
          "```",
        code:
          "from fastapi import FastAPI\n\n" +
          "app = FastAPI()\n\n" +
          "# Path parameter: /items/42 → item_id=42\n" +
          "@app.get('/items/{item_id}')\n" +
          "def get_item(item_id: int):  # тип int → автоматическая валидация!\n" +
          "    return {'item_id': item_id, 'name': f'Item #{item_id}'}\n\n" +
          "# Query parameters: /items?skip=0&limit=10&q=laptop\n" +
          "@app.get('/items')\n" +
          "def list_items(skip: int = 0, limit: int = 10, q: str = None):\n" +
          "    items = [{'id': i, 'name': f'Item {i}'} for i in range(1, 20)]\n" +
          "    if q:\n" +
          "        items = [i for i in items if q.lower() in i['name'].lower()]\n" +
          "    return {'total': len(items), 'items': items[skip:skip+limit]}\n\n" +
          "# Оба типа: /users/42/items?active=true\n" +
          "@app.get('/users/{user_id}/items')\n" +
          "def get_user_items(user_id: int, active: bool = True):\n" +
          "    return {'user_id': user_id, 'active': active, 'items': []}\n\n" +
          "# Тест\n" +
          "print('GET /items/1 →', get_item(1))\n" +
          "print('GET /items?skip=0 →', list_items()['total'], 'items')",
        keyTakeaways: [
          "item_id: int в сигнатуре функции — FastAPI сам парсит и валидирует тип из URL.",
          "Если передали строку вместо int → FastAPI вернёт понятную ошибку 422 Unprocessable Entity автоматически.",
          "Параметры с дефолтными значениями → query params. Без дефолта → обязательные path params.",
        ],
        pitfalls: [
          "Порядок маршрутов важен! `/items/new` должен быть ДО `/items/{item_id}`, иначе 'new' будет воспринято как item_id.",
          "bool в Python: 'True', '1', 'yes', 'on' → True. 'False', '0', 'no', 'off' → False. FastAPI это умеет.",
          "Query param без дефолта — ОБЯЗАТЕЛЬНЫЙ: def fn(q: str) ← клиент ОБЯЗАН передать ?q=...",
        ],
      },
      {
        heading: "🚀 Мастер-гид: строим полноценный API шаг за шагом",
        tagline: "Подробный разбор всех концепций раунда с полными примерами и советами",
        body:
          "## Шаг 1 — Понимаем структуру FastAPI-файла\n\n" +
          "Каждый FastAPI-проект начинается с одного файла. Вот ПОЛНЫЙ шаблон с объяснением каждой строки:\n\n" +
          "```python\n" +
          "# ────────── main.py ──────────\n" +
          "from fastapi import FastAPI   # 1. Импортируем класс приложения\n\n" +
          "# 2. Создаём экземпляр приложения с метаданными\n" +
          "app = FastAPI(\n" +
          "    title='Мой первый API',       # Заголовок в Swagger UI\n" +
          "    description='Описание API',    # Markdown поддерживается!\n" +
          "    version='0.1.0',               # Семантическая версия\n" +
          ")\n\n" +
          "# 3. Регистрируем маршруты через декораторы\n" +
          "@app.get('/')                 # Декоратор = метод + путь\n" +
          "def root():                   # Функция = обработчик запроса\n" +
          "    return {'message': 'OK'} # dict → FastAPI → JSON автоматически\n\n" +
          "# В браузере (без uvicorn) — тестируем функции напрямую:\n" +
          "print(root())  # {'message': 'OK'}\n" +
          "```\n\n" +
          "**Что происходит при GET-запросе на /:**\n" +
          "1. Браузер/клиент отправляет `GET / HTTP/1.1`\n" +
          "2. uvicorn принимает запрос\n" +
          "3. FastAPI находит маршрут `@app.get('/')`\n" +
          "4. Вызывает функцию `root()`\n" +
          "5. dict → JSON → клиент получает `{\"message\": \"OK\"}`\n\n" +
          "## Шаг 2 — Маршруты с параметрами (три типа)\n\n" +
          "**Тип 1: Path parameters (параметры пути)**\n" +
          "Объявляешь в URL через `{имя}`, FastAPI передаёт как аргумент:\n\n" +
          "```python\n" +
          "@app.get('/users/{user_id}')      # {user_id} в URL\n" +
          "def get_user(user_id: int):       # → аргумент с типом int\n" +
          "    # FastAPI автоматически:\n" +
          "    # - извлекает '42' из URL\n" +
          "    # - конвертирует '42' → 42 (int)\n" +
          "    # - если 'abc' → 422 ошибка автоматически!\n" +
          "    return {'id': user_id, 'name': f'User #{user_id}'}\n\n" +
          "# Тест: print(get_user(42))  # {'id': 42, 'name': 'User #42'}\n" +
          "print(get_user(42))\n" +
          "```\n\n" +
          "**Тип 2: Query parameters (параметры запроса)**\n" +
          "Аргументы функции БЕЗ `{имя}` в URL — это query params (?key=value):\n\n" +
          "```python\n" +
          "@app.get('/items')\n" +
          "def list_items(\n" +
          "    skip: int = 0,          # необязательный, дефолт 0\n" +
          "    limit: int = 10,        # необязательный, дефолт 10\n" +
          "    q: str = None,          # необязательный, дефолт None\n" +
          "    active: bool = True,    # bool → FastAPI понимает true/false/1/0\n" +
          "):\n" +
          "    return {'skip': skip, 'limit': limit, 'q': q, 'active': active}\n\n" +
          "# Вызов: GET /items?skip=5&limit=20&q=phone&active=false\n" +
          "# Тест:\n" +
          "print(list_items(skip=5, limit=20, q='phone', active=False))\n" +
          "```\n\n" +
          "**Тип 3: Комбинация path + query**\n" +
          "```python\n" +
          "@app.get('/users/{user_id}/orders')\n" +
          "def get_user_orders(\n" +
          "    user_id: int,          # из пути {user_id}\n" +
          "    paid: bool = True,     # из запроса ?paid=...\n" +
          "    limit: int = 50,       # из запроса ?limit=...\n" +
          "):\n" +
          "    return {'user_id': user_id, 'paid': paid, 'limit': limit}\n\n" +
          "print(get_user_orders(42, paid=False, limit=10))\n" +
          "```\n\n" +
          "## Шаг 3 — Все HTTP-методы: когда какой использовать\n\n" +
          "```python\n" +
          "from fastapi import FastAPI\n" +
          "app = FastAPI()\n\n" +
          "# POST — создаёт новый ресурс (201 Created)\n" +
          "@app.post('/products')\n" +
          "def create_product():\n" +
          "    return {'status': 'created', 'id': 1}\n\n" +
          "# GET — читает данные (200 OK)\n" +
          "@app.get('/products/{pid}')\n" +
          "def get_product(pid: int):\n" +
          "    return {'id': pid, 'name': f'Product {pid}'}\n\n" +
          "# PUT — полная замена (200 OK или 204)\n" +
          "@app.put('/products/{pid}')\n" +
          "def update_product(pid: int):\n" +
          "    return {'id': pid, 'updated': True}\n\n" +
          "# PATCH — частичное обновление (200 OK)\n" +
          "@app.patch('/products/{pid}/price')\n" +
          "def patch_price(pid: int):\n" +
          "    return {'id': pid, 'price_updated': True}\n\n" +
          "# DELETE — удаляет (204 No Content обычно)\n" +
          "@app.delete('/products/{pid}')\n" +
          "def delete_product(pid: int):\n" +
          "    return {'id': pid, 'deleted': True}\n\n" +
          "# Тест GET:\n" +
          "print(get_product(5))\n" +
          "print(create_product())\n" +
          "```\n\n" +
          "## Шаг 4 — Метаданные: title, description, tags, summary\n\n" +
          "```python\n" +
          "from fastapi import FastAPI\n\n" +
          "app = FastAPI(\n" +
          "    title='Bookstore API',\n" +
          "    description='### REST API для книжного магазина\\n\\nПоддерживает CRUD для книг и авторов.',\n" +
          "    version='1.0.0',\n" +
          "    contact={'name': 'Dev Team', 'email': 'dev@example.com'},\n" +
          ")\n\n" +
          "# tags=['Books'] — группирует маршруты в Swagger UI\n" +
          "# summary='...' — краткое описание маршрута в Swagger\n" +
          "# description='...' — подробное описание\n" +
          "@app.get(\n" +
          "    '/books',\n" +
          "    tags=['Books'],\n" +
          "    summary='Список всех книг',\n" +
          "    description='Возвращает список книг с пагинацией. По умолчанию 20 штук.',\n" +
          ")\n" +
          "def get_books(skip: int = 0, limit: int = 20):\n" +
          "    return {'books': [], 'total': 0}\n\n" +
          "@app.get('/books/{book_id}', tags=['Books'], summary='Книга по ID')\n" +
          "def get_book(book_id: int):\n" +
          "    return {'id': book_id, 'title': 'Clean Code'}\n\n" +
          "print('Маршруты:', [r.path for r in app.routes if hasattr(r, 'path')])\n" +
          "```\n\n" +
          "## Разбор типичных ошибок новичков\n\n" +
          "**Ошибка 1: Забыл двоеточие в пути**\n" +
          "```python\n" +
          "# ❌ НЕПРАВИЛЬНО — нет двоеточия в имени аргумента\n" +
          "@app.get('/items/{item_id}')\n" +
          "def get_item(item_id):  # нет типа — работает, но нет валидации!\n" +
          "    return item_id\n\n" +
          "# ✅ ПРАВИЛЬНО — с аннотацией типа\n" +
          "@app.get('/items/{item_id}')\n" +
          "def get_item(item_id: int):  # int → валидация + конвертация\n" +
          "    return {'id': item_id}\n" +
          "```\n\n" +
          "**Ошибка 2: Перепутал path и query param**\n" +
          "```python\n" +
          "# ❌ НЕПРАВИЛЬНО — нет {q} в URL, но написано без дефолта\n" +
          "@app.get('/search')\n" +
          "def search(q: str):  # ОБЯЗАТЕЛЬНЫЙ query param — клиент должен передать ?q=\n" +
          "    return q\n\n" +
          "# ✅ ПРАВИЛЬНО — с дефолтом (необязательный)\n" +
          "@app.get('/search')\n" +
          "def search(q: str = None):  # необязательный\n" +
          "    if q: return {'results': [f'Result for {q}']}\n" +
          "    return {'results': []}\n" +
          "```\n\n" +
          "**Ошибка 3: Неправильный порядок маршрутов**\n" +
          "```python\n" +
          "# ❌ НЕПРАВИЛЬНО — GET /items/featured поймается как item_id='featured'\n" +
          "@app.get('/items/{item_id}')  # этот маршрут стоит первым!\n" +
          "@app.get('/items/featured')   # никогда не вызовется\n\n" +
          "# ✅ ПРАВИЛЬНО — статичный путь ПЕРВЫМ\n" +
          "@app.get('/items/featured')   # сначала статичный\n" +
          "@app.get('/items/{item_id}')  # потом динамический\n" +
          "```\n\n" +
          "## Как запустить и протестировать (реальный workflow)\n\n" +
          "```bash\n" +
          "# 1. Установка\n" +
          "pip install fastapi uvicorn[standard]\n\n" +
          "# 2. Создай main.py с кодом выше\n\n" +
          "# 3. Запуск\n" +
          "uvicorn main:app --reload\n\n" +
          "# 4. Тестирование через curl:\n" +
          "curl http://localhost:8000/\n" +
          "curl http://localhost:8000/items/42\n" +
          "curl http://localhost:8000/items?skip=0&limit=5\n\n" +
          "# 5. Или открой http://localhost:8000/docs — Swagger UI\n" +
          "#    Там можно кликнуть на маршрут → Try it out → Execute\n" +
          "```\n\n" +
          "В этом тренажёре: нажми «Запустить» в Python-компиляторе — увидишь вывод print() и подтверждение что FastAPI-приложение создано.",
        code:
          "from fastapi import FastAPI\n\n" +
          "# Полный пример: продуктовый API с разными типами параметров\n" +
          "app = FastAPI(title='Products API', version='1.0')\n\n" +
          "products_db = [\n" +
          "    {'id': 1, 'name': 'Laptop', 'category': 'electronics', 'price': 999},\n" +
          "    {'id': 2, 'name': 'Book', 'category': 'education', 'price': 25},\n" +
          "    {'id': 3, 'name': 'Phone', 'category': 'electronics', 'price': 599},\n" +
          "]\n\n" +
          "# GET с query params: /products?category=electronics&min_price=100\n" +
          "@app.get('/products', tags=['Products'])\n" +
          "def list_products(\n" +
          "    category: str = None,\n" +
          "    min_price: float = 0,\n" +
          "    limit: int = 10,\n" +
          "):\n" +
          "    result = products_db\n" +
          "    if category:\n" +
          "        result = [p for p in result if p['category'] == category]\n" +
          "    result = [p for p in result if p['price'] >= min_price]\n" +
          "    return {'count': len(result), 'products': result[:limit]}\n\n" +
          "# GET с path param: /products/1\n" +
          "@app.get('/products/{product_id}', tags=['Products'])\n" +
          "def get_product(product_id: int):\n" +
          "    for p in products_db:\n" +
          "        if p['id'] == product_id:\n" +
          "            return p\n" +
          "    return {'error': 'not found'}\n\n" +
          "# POST: создать продукт\n" +
          "@app.post('/products', tags=['Products'])\n" +
          "def create_product():\n" +
          "    return {'status': 'created', 'id': 4}\n\n" +
          "# Тест:\n" +
          "print('Все:', list_products())\n" +
          "print('Electronics:', list_products(category='electronics'))\n" +
          "print('Product 1:', get_product(1))\n" +
          "print('Создать:', create_product())",
        keyTakeaways: [
          "Аннотации типов — это НЕ просто для IDE. Это рабочий механизм валидации FastAPI.",
          "Path params: {имя} в URL → аргумент функции. Query params: аргументы без {имя} → из ?key=value.",
          "Дефолтное значение = необязательный param. Без дефолта = обязательный.",
          "Статичные маршруты ('/items/featured') должны объявляться РАНЬШЕ динамических ('/items/{id}').",
          "В этом тренажёре: Python компилятор запускает функции напрямую — это учебный режим. В реальном FastAPI клиент делает HTTP-запросы.",
        ],
        pitfalls: [
          "FastAPI != Flask: не нужен jsonify(), возвращай dict напрямую.",
          "uvicorn main:app — 'main' это имя файла (без .py), 'app' — имя переменной FastAPI().",
          "Без аннотации типа FastAPI не валидирует значение из URL — это частая причина ошибок.",
          "bool query param: ?active=true → True, ?active=1 → True, ?active=yes → True. FastAPI умеет всё это.",
        ],
        analogy: "FastAPI маршруты — как пункты приёма на почте. @app.get('/посылки/{id}') — это окошко 'получить посылку по номеру'. Номер посылки (path param) — прямо в названии окошка. Дополнительные вопросы (query params) — задаёшь отдельно: 'Нужна ли подпись? (paid=true)'. Сортировщик (FastAPI) сам проверяет что номер посылки — это число, а не буквы.",
      },
      {
        heading: "Примеры и пояснения",
        body:
          "### Заполни пропуски — Упражнение 1: «Первое FastAPI-приложение»\n\n" +
          "```python\n" +
          "from fastapi import FastAPI      # {{0}} = fastapi\n" +
          "app = FastAPI()                  # {{1}} = FastAPI\n" +
          "@app.get('/')                    # {{2}} = get\n" +
          "def read_root(): ...\n\n" +
          "def read_item(item_id: int,      # {{3}} = int\n" +
          "              q: str = None):    # {{4}} = None\n" +
          "    ...\n" +
          "# uvicorn main:app --reload      # {{5}} = reload\n" +
          "```\n\n" +
          "**Объяснение каждого пропуска:**\n" +
          "- `{{0}} = fastapi` — название пакета в нижнем регистре. `import fastapi` или `from fastapi import ...`\n" +
          "- `{{1}} = FastAPI` — класс с заглавной буквы. `app = FastAPI()` — стандартное имя переменной\n" +
          "- `{{2}} = get` — HTTP-метод GET. @app.get() регистрирует GET-маршрут\n" +
          "- `{{3}} = int` — тип числового ID в пути. FastAPI автоматически конвертирует строку URL в int\n" +
          "- `{{4}} = None` — дефолтное значение query параметра (необязательный)\n" +
          "- `{{5}} = reload` — флаг `--reload` перезапускает сервер при изменениях\n\n" +
          "---\n\n" +
          "### Заполни пропуски — Упражнение 2: «Параметры пути и запроса»\n\n" +
          "```python\n" +
          "def get_product(product_id: int):  # {{0}} = int\n" +
          "def list_products(category: str = None, limit: int = 10):\n" +
          "#                  {{1}} = str      {{2}} = 10\n" +
          "@app.get('/users/{user_id}/orders')  # {{3}} = get\n" +
          "def get_user_orders(user_id: int, paid: bool = True):\n" +
          "#                              {{4}} = bool\n" +
          "@app.post('/products')         # {{5}} = post\n" +
          "```\n\n" +
          "---\n\n" +
          "### Заполни пропуски — Упражнение 3: «Метаданные и теги»\n\n" +
          "```python\n" +
          "app = FastAPI(\n" +
          "    title='Bookstore API',    # {{0}} = title\n" +
          "    description='...',        # {{1}} = description\n" +
          "    version='0.1.0',          # {{2}} = version\n" +
          ")\n" +
          "@app.get('/books', tags=['Books'])    # {{3}} = tags\n" +
          "@app.get('/books/{id}', tags=['Books'], summary='...')  # {{4}} = summary\n" +
          "def health(): return {'status': 'ok'}  # {{5}} = status\n" +
          "```\n\n" +
          "---\n\n" +
          "### Ключевые отличия FastAPI\n\n" +
          "**Pydantic — основа FastAPI.** FastAPI использует Pydantic для автоматической валидации входящих данных и генерации документации. Достаточно указать тип параметра — FastAPI сам проверит формат и вернёт ошибку 422, если данные неверны. Flask такого механизма не имеет — там нужно валидировать вручную.\n\n" +
          "**ASGI-сервер uvicorn.** FastAPI — асинхронный фреймворк (ASGI). Для его запуска нужен uvicorn: команда `uvicorn main:app --reload` запускает приложение в режиме разработки с автоперезагрузкой при изменениях файлов. Flask использует синхронный Werkzeug.\n\n" +
          "**Автодокументация из кода.** FastAPI генерирует интерактивный Swagger UI по адресу `/docs` и ReDoc по `/redoc` автоматически — на основе типов и аннотаций твоего кода. Ты не пишешь YAML-схемы руками: декораторы маршрутов и Pydantic-модели становятся документацией сами.\n\n" +
          "---\n\n" +
          "### Практика: как делать задание «API для задач (Todo)»\n\n" +
          "**Шаг 1.** Импортируй и создай app:\n" +
          "```python\n" +
          "from fastapi import FastAPI\n" +
          "app = FastAPI()\n" +
          "todos = []  # список в памяти\n" +
          "```\n\n" +
          "**Шаг 2.** Добавь маршруты по одному:\n" +
          "```python\n" +
          "@app.get('/')\n" +
          "def root(): return {'message': 'Todo API'}\n\n" +
          "@app.get('/todos')\n" +
          "def get_todos(): return todos\n\n" +
          "@app.get('/todos/{todo_id}')\n" +
          "def get_todo(todo_id: int): return {'id': todo_id}\n\n" +
          "@app.delete('/todos/{todo_id}')\n" +
          "def delete_todo(todo_id: int): return {'deleted': True}\n" +
          "```\n\n" +
          "**Шаг 3.** Запусти через кнопку Python — проверь что нет ошибок синтаксиса.\n" +
          "Если видишь `✓ FastAPI-приложение создано!` — всё правильно!",
      },
    ],
    cheatSheet: [
      "`from fastapi import FastAPI; app = FastAPI()` — создать приложение.",
      "`@app.get('/path')` / `@app.post('/path')` — декораторы маршрутов.",
      "`def fn(id: int)` — path param (в URL); `def fn(q: str = None)` — query param.",
      "`uvicorn main:app --reload` — запустить в dev-режиме.",
      "`/docs` — Swagger UI, `/redoc` — ReDoc, `/openapi.json` — схема.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fa1-f1",
      title: "Первое FastAPI-приложение",
      description: "Заполни пропуски в минимальном FastAPI-приложении с двумя маршрутами.",
      code:
        "from {{0}} import FastAPI\n\n" +
        "app = {{1}}()\n\n" +
        "@app.{{2}}('/')\n" +
        "def read_root():\n" +
        "    return {'message': 'Hello, FastAPI!'}\n\n" +
        "@app.get('/items/{item_id}')\n" +
        "def read_item(item_id: {{3}}, q: str = {{4}}):\n" +
        "    return {'item_id': item_id, 'q': q}\n\n" +
        "# Запуск: uvicorn main:app --{{5}}",
      answers: [
        ["fastapi"],
        ["FastAPI"],
        ["get"],
        ["int"],
        ["None"],
        ["reload"],
      ],
      hints: [
        "Название модуля/пакета FastAPI (строчными).",
        "Класс приложения FastAPI (с заглавной буквы).",
        "Декоратор для GET-запроса.",
        "Тип для числового параметра пути.",
        "Значение по умолчанию — «ничего».",
        "Флаг для автоперезагрузки при изменениях файлов.",
      ],
      explanation: {
        summary:
          "Разбор первого FastAPI-приложения: импорт, создание экземпляра, маршруты GET/POST, параметры пути и запроса, запуск через uvicorn.",
        keyPoints: [
          "from fastapi import FastAPI — пакет называется fastapi (строчные), класс FastAPI с заглавной буквы.",
          "app = FastAPI() — экземпляр приложения; именно через него регистрируются все маршруты.",
          "@app.get('/path') — декоратор GET-маршрута; аналогично @app.post, @app.put, @app.delete.",
          "item_id: int — FastAPI автоматически конвертирует строку из URL в int; вернёт 422 если конвертация невозможна.",
          "q: str = None — необязательный query-параметр; ?q=hello в URL FastAPI распознаёт сам по дефолту None.",
          "--reload — флаг uvicorn для автоперезапуска при изменениях файлов (только для разработки, не для продакшена!).",
        ],
        pitfalls: [
          "Не путай пакет fastapi (строчные при импорте) с классом FastAPI (CamelCase при создании экземпляра).",
          "Query-параметры (после ?) отличаются от path-параметров ({в фигурных скобках}) — их разделяет FastAPI автоматически.",
        ],
      },
    },
    {
      type: "fill",
      id: "fa1-f2",
      title: "Параметры пути и запроса",
      description: "Заполни параметры в маршрутах FastAPI.",
      code:
        "from fastapi import FastAPI\n\n" +
        "app = FastAPI(title='Shop API', version='1.0')\n\n" +
        "# Path parameter: /products/42\n" +
        "@app.get('/products/{product_id}')\n" +
        "def get_product(product_id: {{0}}):\n" +
        "    return {'id': product_id, 'name': f'Product {product_id}'}\n\n" +
        "# Query params: /products?category=books&limit=5\n" +
        "@app.get('/products')\n" +
        "def list_products(category: {{1}} = None, limit: int = {{2}}):\n" +
        "    return {'category': category, 'limit': limit}\n\n" +
        "# Path + query: /users/7/orders?paid=true\n" +
        "@app.{{3}}('/users/{user_id}/orders')\n" +
        "def get_user_orders(user_id: int, paid: {{4}} = True):\n" +
        "    return {'user_id': user_id, 'paid': paid}\n\n" +
        "# POST маршрут\n" +
        "@app.{{5}}('/products')\n" +
        "def create_product():\n" +
        "    return {'status': 'created'}",
      answers: [
        ["int"],
        ["str"],
        ["10"],
        ["get"],
        ["bool"],
        ["post"],
      ],
      hints: [
        "Тип числового ID.",
        "Тип текстовой категории.",
        "Разумный лимит по умолчанию для пагинации.",
        "HTTP-метод для чтения данных.",
        "Тип булевого параметра в Python.",
        "HTTP-метод для создания ресурса.",
      ],
    },
    {
      type: "fill",
      id: "fa1-f3",
      title: "Метаданные и теги",
      description: "Настрой FastAPI-приложение с метаданными и тегами для документации.",
      code:
        "from fastapi import FastAPI\n\n" +
        "app = FastAPI(\n" +
        "    {{0}}='Bookstore API',\n" +
        "    {{1}}='API для управления книжным магазином',\n" +
        "    {{2}}='0.1.0',\n" +
        ")\n\n" +
        "@app.get('/books', {{3}}=['Books'])\n" +
        "def list_books():\n" +
        "    return []\n\n" +
        "@app.get('/books/{book_id}', tags=['Books'], {{4}}='Получить книгу по ID')\n" +
        "def get_book(book_id: int):\n" +
        "    return {'id': book_id}\n\n" +
        "@app.get('/health', tags=['System'])\n" +
        "def health():\n" +
        "    return {'{{5}}': 'ok'}",
      answers: [
        ["title"],
        ["description"],
        ["version"],
        ["tags"],
        ["summary"],
        ["status"],
      ],
      hints: [
        "Параметр FastAPI для заголовка документации.",
        "Параметр FastAPI для описания API.",
        "Параметр для версии.",
        "Список строк для группировки в Swagger.",
        "Краткое описание отдельного маршрута.",
        "Стандартное поле для ответа healthcheck.",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "fa1-q1",
      title: "Чем FastAPI отличается от Flask?",
      question:
        "FastAPI использует ___ для валидации данных и генерации документации — библиотека, написанная частично на Rust. Введи имя этой библиотеки.",
      answers: ["pydantic", "Pydantic", "пайдантик", "pydantic v2", "pydantic2", "pydantic v 2"],
      hint: "Эта библиотека даёт FastAPI его «магию» — типы Python становятся схемами данных.",
      explanation:
        "Pydantic — основа FastAPI. Когда ты пишешь `def fn(id: int)`, FastAPI использует Pydantic для парсинга, валидации и сериализации. Pydantic v2 написан на Rust и работает в 5–50 раз быстрее v1.",
    },
    {
      type: "question",
      id: "fa1-q2",
      title: "Какой сервер запускает FastAPI?",
      question:
        "Для запуска FastAPI-приложения в разработке используется: `___ main:app --reload`. Введи имя этой команды/сервера.",
      answers: ["uvicorn", "uvicorn main:app", "uvicorn main:app --reload", "uvicorn.run", "Uvicorn"],
      hint: "ASGI-сервер, в отличие от WSGI-серверов (gunicorn без воркеров).",
      explanation:
        "uvicorn — лёгкий ASGI-сервер для Python. `main:app` → файл main.py и переменная `app`. `--reload` → перезапуск при изменениях (только для разработки). В продакшене: `uvicorn main:app --workers 4`.",
    },
    {
      type: "question",
      id: "fa1-q3",
      title: "Где находится автодокументация?",
      question:
        "После запуска FastAPI-сервера, по какому URL доступна интерактивная Swagger UI документация?",
      answers: [
        "/docs", "http://localhost:8000/docs", "/docs/", "localhost:8000/docs",
        "/swagger", "swagger ui по адресу /docs", "docs", "/api/docs",
        "127.0.0.1:8000/docs", "http://127.0.0.1:8000/docs",
      ],
      hint: "Это стандартный URL, добавленный к хосту сервера. Четыре буквы.",
      explanation:
        "FastAPI автоматически генерирует:\n• `/docs` — Swagger UI (интерактивная документация, можно тестировать прямо там)\n• `/redoc` — ReDoc (альтернативный вид документации)\n• `/openapi.json` — OpenAPI 3.0 спецификация в JSON\n\nВсё это без единой строки дополнительного кода.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fa1-w1",
      title: "API для задач (Todo)",
      task:
        "Создай простой FastAPI-сервер для управления задачами.\n\n" +
        "━━━ Что нужно реализовать ━━━\n\n" +
        "1. `GET /` — приветственное сообщение {'message': 'Todo API'}\n" +
        "2. `GET /todos` — вернуть список всех задач (хранить в списке в памяти)\n" +
        "3. `GET /todos/{todo_id}` — вернуть задачу по ID (int)\n" +
        "4. `DELETE /todos/{todo_id}` — удалить задачу (вернуть {'deleted': True})\n\n" +
        "━━━ Проверь в коде ━━━\n" +
        "• `from fastapi import FastAPI`\n" +
        "• `app = FastAPI()`\n" +
        "• `@app.get('/todos')`\n" +
        "• `@app.delete('/todos/{todo_id}')`\n" +
        "• `todo_id: int` в сигнатуре функции\n\n" +
        "⚡ Запусти код через Python-компилятор чтобы убедиться, что нет ошибок синтаксиса.",
      hints: [
        "from fastapi import FastAPI; app = FastAPI()",
        "@app.get('/') def root(): return {'message': 'Todo API'}",
        "todos = [] — простой список для хранения данных",
        "@app.get('/todos/{todo_id}') def get_todo(todo_id: int): ...",
        "@app.delete('/todos/{todo_id}') def delete_todo(todo_id: int): return {'deleted': True}",
      ],
      required: [
        "from fastapi import FastAPI",
        "app = FastAPI()",
        "@app.get",
        "@app.delete",
        "todo_id: int",
        "todos",
      ],
      minLines: 18,
    },
    {
      type: "write",
      id: "fa1-w2",
      title: "Продуктовый API с разными методами",
      task:
        "Создай FastAPI-приложение для магазина с несколькими маршрутами.\n\n" +
        "━━━ Маршруты ━━━\n\n" +
        "`GET /` — {'name': 'Shop API', 'version': '1.0'}\n" +
        "`GET /products` — список продуктов (query params: `category: str = None`, `limit: int = 20`)\n" +
        "`GET /products/{product_id}` — продукт по ID\n" +
        "`POST /products` — создать (просто возвращай {'status': 'created'})\n" +
        "`GET /categories` — список категорий\n\n" +
        "━━━ Должно быть в коде ━━━\n" +
        "• FastAPI с title и version в конструкторе\n" +
        "• Path parameter (product_id: int)\n" +
        "• Query parameters с дефолтными значениями\n" +
        "• @app.post маршрут\n" +
        "• tags=[] хотя бы у одного маршрута",
      hints: [
        "app = FastAPI(title='Shop API', version='1.0')",
        "Для query params: def list_products(category: str = None, limit: int = 20)",
        "tags=['Products'] в декораторе @app.get('/products', tags=['Products'])",
        "Path param: @app.get('/products/{product_id}') def get_product(product_id: int)",
      ],
      required: [
        "FastAPI(",
        "title=",
        "@app.get",
        "@app.post",
        "product_id: int",
        "category",
        "limit",
        "tags=",
      ],
      minLines: 28,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 2 · Pydantic — валидация и схемы данных
// ─────────────────────────────────────────────────────────────────────────────
const fa2: Round = {
  number: 2,
  title: "FastAPI · Pydantic — схемы и валидация",
  level: "Начальный",
  intro:
    "Pydantic — сердце FastAPI. Он позволяет описывать структуры данных как Python-классы и автоматически валидирует входящие данные.\n\n**В этом раунде:**\n• BaseModel — основа всех схем\n• Поля и их типы\n• Optional поля и значения по умолчанию\n• Вложенные модели\n• Валидация с Field()",
  lesson: {
    title: "Pydantic BaseModel — описывай данные как классы",
    summary:
      "BaseModel превращает аннотации типов Python в схемы с автоматической валидацией. FastAPI использует их для body запросов, ответов и параметров.",
    readingMinutes: 14,
    sections: [
      {
        heading: "BaseModel — твоя первая Pydantic-схема",
        tagline: "Наследуй от BaseModel, описывай поля — валидация работает автоматически",
        body:
          "Pydantic-модель — это Python-класс, унаследованный от `BaseModel`. Каждое поле с аннотацией типа — это будущее поле JSON-объекта.\n\n" +
          "**Как FastAPI использует модели:**\n" +
          "1. Объявляешь параметр функции с типом BaseModel → FastAPI ожидает JSON-тело запроса\n" +
          "2. FastAPI автоматически парсит JSON в модель\n" +
          "3. Если данные не подходят → 422 Unprocessable Entity с подробным описанием ошибки\n" +
          "4. Возвращаешь модель → FastAPI сериализует в JSON\n\n" +
          "**Обязательные vs необязательные поля:**\n\n" +
          "```python\n" +
          "class User(BaseModel):\n" +
          "    name: str              # ОБЯЗАТЕЛЬНОЕ — без него ошибка 422\n" +
          "    age: int               # ОБЯЗАТЕЛЬНОЕ\n" +
          "    bio: Optional[str] = None   # НЕОБЯЗАТЕЛЬНОЕ — если не передать, bio=None\n" +
          "    active: bool = True    # НЕОБЯЗАТЕЛЬНОЕ — если не передать, active=True\n" +
          "```\n\n" +
          "**Ключевое правило:** поле ОБЯЗАТЕЛЬНОЕ, если нет `= default_value`. Даже `Optional[str]` БЕЗ `= None` — обязательное! (Ты обязан передать null явно.)\n\n" +
          "**Типы полей Pydantic:**\n" +
          "- `str`, `int`, `float`, `bool` — базовые Python типы\n" +
          "- `Optional[str]` (= `str | None`) — необязательное поле (Python 3.10+: `str | None`)\n" +
          "- `List[str]` (= `list[str]`) — список\n" +
          "- `Dict[str, int]` — словарь\n" +
          "- `datetime` — дата и время (парсится из ISO строки '2024-01-15T10:30:00')\n" +
          "- `UUID` — уникальный идентификатор\n" +
          "- Другие Pydantic-модели — вложенные объекты\n\n" +
          "**Полезные методы моделей:**\n" +
          "- `model.model_dump()` → dict (Pydantic v2; в v1 было `model.dict()`)\n" +
          "- `model.model_dump_json()` → JSON-строка\n" +
          "- `Model.model_validate(dict)` → создать модель из dict (Pydantic v2)\n" +
          "- `model.model_copy(update={'field': value})` → копия с изменениями",
        code:
          "from pydantic import BaseModel\n" +
          "from typing import Optional, List\n\n" +
          "class Item(BaseModel):\n" +
          "    name: str              # обязательное поле\n" +
          "    description: Optional[str] = None  # необязательное\n" +
          "    price: float           # обязательное число\n" +
          "    is_available: bool = True  # с дефолтом\n" +
          "    tags: List[str] = []   # список (дефолт — пустой)\n\n" +
          "# Создание экземпляра напрямую:\n" +
          "item = Item(name='Ноутбук', price=999.99)\n" +
          "print('name:', item.name)           # Ноутбук\n" +
          "print('available:', item.is_available) # True\n" +
          "print('dict:', item.model_dump())\n\n" +
          "# Из словаря:\n" +
          "data = {'name': 'Книга', 'price': 15.0, 'tags': ['python']}\n" +
          "item2 = Item(**data)\n" +
          "print('item2:', item2.name, item2.tags)\n\n" +
          "# Валидация: строка вместо float → ошибка\n" +
          "try:\n" +
          "    bad = Item(name='X', price='дорого')  # ValueError!\n" +
          "except Exception as e:\n" +
          "    print('Ошибка:', type(e).__name__)",
        keyTakeaways: [
          "class Item(BaseModel) — всё, что нужно для валидации. Никаких декораторов или лишнего кода.",
          "Optional[str] = None → поле необязательное. str без default → обязательное.",
          "model_dump() → dict из модели (Pydantic v2). В v1 было dict().",
        ],
        pitfalls: [
          "Optional[str] БЕЗ = None → всё равно обязательное! Нужно: bio: Optional[str] = None",
          "В Pydantic v2 метод называется model_dump(), а не dict(). Оба работают, но dict() устарел.",
        ],
      },
      {
        heading: "Field() — контроль валидации",
        tagline: "Field позволяет добавить ограничения: min, max, regex, описание",
        body:
          "Базовые аннотации типов говорят ЧТО за данные. `Field()` говорит КАКИЕ ограничения применять.\n\n" +
          "**Основные параметры Field:**\n\n" +
          "| Параметр | Тип поля | Значение |\n" +
          "|---|---|---|\n" +
          "| `default=` | любой | Значение по умолчанию |\n" +
          "| `default_factory=` | любой | Функция для генерации дефолта |\n" +
          "| `min_length=` | str | Минимальная длина строки |\n" +
          "| `max_length=` | str | Максимальная длина строки |\n" +
          "| `pattern=` | str | Regex для проверки строки |\n" +
          "| `gt=` | число | Больше (strictly greater than) |\n" +
          "| `ge=` | число | Больше или равно (>=) |\n" +
          "| `lt=` | число | Меньше (strictly less than) |\n" +
          "| `le=` | число | Меньше или равно (<=) |\n" +
          "| `description=` | любой | Описание в Swagger |\n" +
          "| `examples=` | любой | Примеры для документации |\n\n" +
          "**Мнемоника для gt/ge/lt/le:**\n" +
          "- gt = **g**reater **t**han (>)\n" +
          "- ge = **g**reater or **e**qual (>=)\n" +
          "- lt = **l**ess **t**han (<)\n" +
          "- le = **l**ess or **e**qual (<=)\n\n" +
          "**Annotated-синтаксис (Pydantic v2, современный способ):**\n" +
          "```python\n" +
          "from typing import Annotated\n" +
          "from pydantic import Field\n\n" +
          "# Создаём переиспользуемые типы:\n" +
          "PositivePrice = Annotated[float, Field(gt=0, description='Цена > 0')]\n" +
          "ShortName = Annotated[str, Field(min_length=1, max_length=100)]\n\n" +
          "class Product(BaseModel):\n" +
          "    name: ShortName       # переиспользуем тип\n" +
          "    price: PositivePrice  # переиспользуем тип\n" +
          "```",
        code:
          "from pydantic import BaseModel, Field\n" +
          "from typing import Optional\n\n" +
          "class Product(BaseModel):\n" +
          "    name: str = Field(\n" +
          "        min_length=1,\n" +
          "        max_length=100,\n" +
          "        description='Название продукта'\n" +
          "    )\n" +
          "    price: float = Field(gt=0, description='Цена строго больше 0')\n" +
          "    stock: int = Field(ge=0, default=0, description='Количество >= 0')\n" +
          "    category: Optional[str] = Field(None, max_length=50)\n" +
          "    sku: str = Field(pattern=r'^[A-Z]{2}-\\d{4}$',\n" +
          "                    description='Формат: AB-1234')\n" +
          "    discount: float = Field(ge=0.0, le=1.0, default=0.0,\n" +
          "                           description='Скидка от 0 до 1 (0% до 100%)')\n\n" +
          "# Тест валидации:\n" +
          "try:\n" +
          "    p = Product(name='Laptop', price=-10, sku='XX-0001')\n" +
          "except Exception as e:\n" +
          "    print('Ошибка цены:', 'price' in str(e))\n\n" +
          "# Правильный объект:\n" +
          "p = Product(name='Laptop', price=999.0, sku='AB-1234')\n" +
          "print(p.name, p.price, p.stock, p.discount)",
        keyTakeaways: [
          "Field(gt=0) — цена строго больше 0. ge=0 — включительно (>=). lt и le — аналогично для верхней границы.",
          "pattern=r'regex' — валидация через регулярное выражение. Ошибка если не совпадает.",
          "description= — появляется в Swagger UI как подсказка к полю. Помогает потребителям API.",
        ],
        pitfalls: [
          "gt=0 и ge=0 — разные вещи. gt=0 не пропустит price=0, ge=0 пропустит.",
          "Не забудь raw-строку r'...' для pattern, иначе обратные слэши не работают.",
        ],
      },
      {
        heading: "Вложенные модели и списки",
        tagline: "Модели могут содержать другие модели — FastAPI сам сериализует/десериализует",
        body:
          "Одна из мощных возможностей Pydantic — **вложенные модели**. JSON-объект внутри JSON-объекта описывается просто как поле с типом другой модели.\n\n" +
          "**Когда используешь вложенные модели:**\n" +
          "- Заказ содержит адрес доставки (один вложенный объект)\n" +
          "- Заказ содержит список товаров (список вложенных объектов)\n" +
          "- Статья содержит автора (вложенный объект)\n\n" +
          "**Как это выглядит в JSON (то что клиент отправляет):**\n" +
          "```json\n" +
          "{\n" +
          "    \"customer\": \"Иван\",\n" +
          "    \"address\": {\n" +
          "        \"city\": \"Москва\",\n" +
          "        \"street\": \"Ленина 1\"\n" +
          "    },\n" +
          "    \"items\": [\n" +
          "        {\"product_id\": 1, \"quantity\": 2, \"price\": 100.0},\n" +
          "        {\"product_id\": 5, \"quantity\": 1, \"price\": 500.0}\n" +
          "    ]\n" +
          "}\n" +
          "```\n\n" +
          "**В Python это автоматически превращается в объекты — не надо писать парсер вручную!**\n\n" +
          "**model_dump() с вложенными моделями:**\n" +
          "```python\n" +
          "order.model_dump()\n" +
          "# {'customer': 'Иван', 'address': {'city': 'Москва', ...}, 'items': [...]}\n" +
          "# Все уровни автоматически превращаются в dict\n" +
          "```\n\n" +
          "**Доступ к вложенным полям:**\n" +
          "```python\n" +
          "order.address.city      # → 'Москва'\n" +
          "order.items[0].price    # → 100.0\n" +
          "```",
        code:
          "from fastapi import FastAPI\n" +
          "from pydantic import BaseModel\n" +
          "from typing import List, Optional\n\n" +
          "class Address(BaseModel):\n" +
          "    city: str\n" +
          "    street: str\n" +
          "    zip_code: str\n\n" +
          "class OrderItem(BaseModel):\n" +
          "    product_id: int\n" +
          "    quantity: int\n" +
          "    price: float\n\n" +
          "class Order(BaseModel):\n" +
          "    id: Optional[int] = None\n" +
          "    customer: str\n" +
          "    address: Address          # вложенная модель\n" +
          "    items: List[OrderItem]    # список вложенных моделей\n" +
          "    note: Optional[str] = None\n\n" +
          "# Демонстрация:\n" +
          "addr = Address(city='Москва', street='Ленина 1', zip_code='101000')\n" +
          "item = OrderItem(product_id=1, quantity=2, price=100.0)\n" +
          "order = Order(customer='Иван', address=addr, items=[item])\n\n" +
          "print('Заказ:', order.customer)\n" +
          "print('Город:', order.address.city)\n" +
          "print('Товаров:', len(order.items))\n" +
          "print('Сумма:', sum(i.price * i.quantity for i in order.items))\n\n" +
          "# model_dump() — всё в dict:\n" +
          "d = order.model_dump()\n" +
          "print('address в dict:', d['address']['city'])",
        keyTakeaways: [
          "address: Address — просто укажи тип, Pydantic сам десериализует вложенный JSON.",
          "items: List[OrderItem] — список моделей работает так же, как и одиночная модель.",
          "model_dump() возвращает dict со всеми вложенными полями (рекурсивно).",
        ],
        pitfalls: [
          "List[OrderItem] и list[OrderItem] — оба работают. List — из typing, list — встроенный (Python 3.9+).",
          "Если клиент пропустит обязательное поле вложенной модели — 422 с указанием пути: 'address.city'.",
        ],
      },
      {
        heading: "🚀 Мастер-гид: Pydantic в реальных проектах",
        tagline: "Полная практика — как строить схемы, валидировать данные и проектировать API-контракты",
        body:
          "## Основные паттерны Pydantic — шпаргалка с объяснениями\n\n" +
          "### Паттерн 1: Разные схемы для создания и ответа (Create/Response split)\n\n" +
          "Это ключевой паттерн для безопасных API:\n\n" +
          "```python\n" +
          "from fastapi import FastAPI\n" +
          "from pydantic import BaseModel, Field\n" +
          "from typing import Optional\n\n" +
          "# Схема для ВХОДЯЩИХ данных (что клиент присылает)\n" +
          "class UserCreate(BaseModel):\n" +
          "    name: str = Field(min_length=2, max_length=100)\n" +
          "    email: str = Field(pattern=r'^[^@]+@[^@]+\\.[^@]+$')\n" +
          "    password: str = Field(min_length=8)  # пароль клиент присылает...\n\n" +
          "# Схема для ОТВЕТА (что API возвращает клиенту)\n" +
          "class UserResponse(BaseModel):\n" +
          "    id: int\n" +
          "    name: str\n" +
          "    email: str\n" +
          "    # password НЕТУ! никогда не возвращаем пароль!\n\n" +
          "app = FastAPI()\n\n" +
          "@app.post('/users', response_model=UserResponse)  # response_model фильтрует поля!\n" +
          "def create_user(user: UserCreate):\n" +
          "    # Имитируем сохранение в БД\n" +
          "    return {'id': 1, 'name': user.name, 'email': user.email}  # пароль не возвращаем\n\n" +
          "# Тест:\n" +
          "result = create_user(UserCreate(name='Алексей', email='alex@example.com', password='securepass'))\n" +
          "print('Создан пользователь:', result)\n" +
          "```\n\n" +
          "**Почему Create/Response split — хорошая практика?**\n" +
          "- UserCreate содержит password — нужен для создания\n" +
          "- UserResponse НЕ содержит password — никогда не возвращай пароли клиенту!\n" +
          "- response_model=UserResponse гарантирует фильтрацию даже если в dict есть лишние поля\n\n" +
          "### Паттерн 2: Вложенные модели (nested models)\n\n" +
          "```python\n" +
          "from fastapi import FastAPI\n" +
          "from pydantic import BaseModel, Field\n" +
          "from typing import List, Optional\n\n" +
          "class Address(BaseModel):\n" +
          "    street: str\n" +
          "    city: str\n" +
          "    country: str = 'Russia'  # дефолт\n\n" +
          "class OrderItem(BaseModel):\n" +
          "    product_id: int\n" +
          "    quantity: int = Field(ge=1)  # не меньше 1\n" +
          "    price: float = Field(gt=0)\n\n" +
          "class OrderCreate(BaseModel):\n" +
          "    items: List[OrderItem]          # список вложенных моделей!\n" +
          "    shipping_address: Address       # вложенная модель\n" +
          "    comment: Optional[str] = None\n\n" +
          "app = FastAPI()\n\n" +
          "@app.post('/orders')\n" +
          "def create_order(order: OrderCreate):\n" +
          "    total = sum(item.quantity * item.price for item in order.items)\n" +
          "    return {\n" +
          "        'total': total,\n" +
          "        'items_count': len(order.items),\n" +
          "        'ship_to': order.shipping_address.city,\n" +
          "    }\n\n" +
          "# Тест — передаём dict, Pydantic сам создаёт вложенные объекты:\n" +
          "order = OrderCreate(\n" +
          "    items=[\n" +
          "        OrderItem(product_id=1, quantity=2, price=99.9),\n" +
          "        OrderItem(product_id=2, quantity=1, price=199.0),\n" +
          "    ],\n" +
          "    shipping_address=Address(street='Ленина 1', city='Москва'),\n" +
          ")\n" +
          "print('Заказ:', create_order(order))\n" +
          "```\n\n" +
          "### Паттерн 3: Все варианты Field() — когда что использовать\n\n" +
          "```python\n" +
          "from pydantic import BaseModel, Field\n" +
          "from typing import List\n\n" +
          "class Product(BaseModel):\n" +
          "    # Строки:\n" +
          "    name: str = Field(min_length=1, max_length=100)\n" +
          "    slug: str = Field(pattern=r'^[a-z0-9-]+$')  # только строчные + дефис\n" +
          "    description: str = Field(default='')  # дефолт — пустая строка\n\n" +
          "    # Числа:\n" +
          "    price: float = Field(gt=0)      # gt = greater than (строго больше 0)\n" +
          "    stock: int = Field(ge=0)        # ge = greater or equal (0 или больше)\n" +
          "    discount: float = Field(ge=0.0, le=1.0)  # от 0 до 1 включительно\n" +
          "    weight_kg: float = Field(gt=0, lt=1000)  # gt и lt вместе\n\n" +
          "    # Списки:\n" +
          "    tags: List[str] = Field(default_factory=list, max_length=10)  # не более 10 тегов\n\n" +
          "# Мнемоника: gt/lt = greater/less than (строго), ge/le = greater/less or Equal\n" +
          "p = Product(\n" +
          "    name='Ноутбук', slug='noutbuk', price=999.99,\n" +
          "    stock=50, discount=0.1, weight_kg=2.5, tags=['электроника']\n" +
          ")\n" +
          "print('Продукт:', p.model_dump())\n" +
          "```\n\n" +
          "### Паттерн 4: model_dump() и создание из dict\n\n" +
          "```python\n" +
          "from pydantic import BaseModel\n\n" +
          "class Item(BaseModel):\n" +
          "    name: str\n" +
          "    price: float\n" +
          "    active: bool = True\n\n" +
          "# Создание из dict (очень часто при работе с БД):\n" +
          "data = {'name': 'Телефон', 'price': 599.0}\n" +
          "item = Item(**data)  # распаковка dict в аргументы\n" +
          "print('Объект:', item)\n\n" +
          "# Конвертация обратно в dict:\n" +
          "d = item.model_dump()\n" +
          "print('Dict:', d)  # {'name': 'Телефон', 'price': 599.0, 'active': True}\n\n" +
          "# model_dump с exclude (убрать поля):\n" +
          "d2 = item.model_dump(exclude={'active'})\n" +
          "print('Без active:', d2)\n\n" +
          "# model_dump с include (оставить только эти поля):\n" +
          "d3 = item.model_dump(include={'name', 'price'})\n" +
          "print('Только name+price:', d3)\n" +
          "```\n\n" +
          "## Как подходить к упражнениям этого раунда\n\n" +
          "**Fill-in упражнения (заполни пропуски):**\n" +
          "- Смотри на то, что вокруг пропуска. Если `from pydantic import {{0}}` — это класс который наследуют, значит `BaseModel`\n" +
          "- Если `{{0}}[str] = None` — это Optional, если `Optional[{{0}}] = None` — это тип (str, int...)\n" +
          "- Field() аргументы: gt/ge/lt/le для чисел, min_length/max_length для строк, pattern для regex\n\n" +
          "**Write упражнения (напиши с нуля):**\n" +
          "1. Начни с импортов: `from fastapi import FastAPI; from pydantic import BaseModel, Field`\n" +
          "2. Определи все модели ПЕРЕД созданием app и маршрутов\n" +
          "3. Для каждого POST-маршрута: параметр функции = модель входных данных\n" +
          "4. response_model= в декораторе = схема ответа\n" +
          "5. Запусти через Python-компилятор — он проверит синтаксис\n\n" +
          "**Частые ошибки:**\n" +
          "```python\n" +
          "# ❌ Забыл наследовать от BaseModel:\n" +
          "class User:  # это обычный класс, не Pydantic!\n" +
          "    name: str\n\n" +
          "# ✅ Правильно:\n" +
          "class User(BaseModel):  # наследуем от BaseModel!\n" +
          "    name: str\n\n" +
          "# ❌ Optional без дефолта:\n" +
          "bio: Optional[str]  # ошибка в Pydantic v2 — нужен дефолт!\n\n" +
          "# ✅ Правильно:\n" +
          "bio: Optional[str] = None  # или bio: str | None = None\n\n" +
          "# ❌ dict() вместо model_dump() (Pydantic v2):\n" +
          "user.dict()  # работает, но устарело — используй model_dump()\n" +
          "```",
        code:
          "from fastapi import FastAPI\n" +
          "from pydantic import BaseModel, Field\n" +
          "from typing import Optional, List\n\n" +
          "# ── Схемы для E-commerce API ──\n" +
          "class CategoryBase(BaseModel):\n" +
          "    name: str = Field(min_length=1, max_length=50)\n\n" +
          "class ProductCreate(BaseModel):\n" +
          "    name: str = Field(min_length=2, max_length=200)\n" +
          "    price: float = Field(gt=0)\n" +
          "    stock: int = Field(ge=0, default=0)\n" +
          "    category: CategoryBase\n" +
          "    tags: List[str] = Field(default_factory=list)\n" +
          "    description: Optional[str] = None\n\n" +
          "class ProductResponse(BaseModel):\n" +
          "    id: int\n" +
          "    name: str\n" +
          "    price: float\n" +
          "    category: CategoryBase\n\n" +
          "app = FastAPI(title='E-commerce API')\n\n" +
          "@app.post('/products', response_model=ProductResponse)\n" +
          "def create_product(product: ProductCreate):\n" +
          "    return {'id': 100, 'name': product.name, 'price': product.price, 'category': product.category}\n\n" +
          "@app.get('/products/{pid}', response_model=ProductResponse)\n" +
          "def get_product(pid: int):\n" +
          "    return {'id': pid, 'name': 'Laptop', 'price': 999.0, 'category': {'name': 'Electronics'}}\n\n" +
          "# Тест\n" +
          "new_p = ProductCreate(\n" +
          "    name='iPhone 15', price=799.99, stock=25,\n" +
          "    category=CategoryBase(name='Electronics'),\n" +
          "    tags=['apple', 'smartphone']\n" +
          ")\n" +
          "print('Данные:', new_p.model_dump())\n" +
          "print('Создан:', create_product(new_p))",
        keyTakeaways: [
          "Разделяй схемы: UserCreate (вход) и UserResponse (выход) — хорошая практика безопасности.",
          "response_model= в декораторе — FastAPI автоматически фильтрует лишние поля в ответе.",
          "Optional[str] = None — ОБЯЗАТЕЛЬНО указывай = None, иначе ошибка в Pydantic v2.",
          "Field() — не только ограничения, но и метаданные для Swagger (description, example).",
          "model_dump() с include/exclude — гибкая сериализация только нужных полей.",
        ],
        pitfalls: [
          "Не забывай наследовать: class User(BaseModel): — без BaseModel это просто класс без валидации.",
          "В Pydantic v2 Optional[str] без дефолта = ошибка. Пиши Optional[str] = None.",
          "response_model не работает с JSONResponse — FastAPI не фильтрует JSONResponse.",
          "Вложенная модель в JSON: {'category': {'name': 'Electronics'}} — это вложенный объект, не строка.",
        ],
        analogy: "Pydantic BaseModel — как анкета с чёткими правилами заполнения. Поле name: str = Field(min_length=2) — это как 'имя: не менее 2 символов'. Если кто-то оставит пустым — анкета возвращается с отметкой ошибки (422). Optional[str] = None — как поле 'второе имя (необязательно)'. model_dump() — как сканирование заполненной анкеты в PDF.",
      },
      {
        heading: "Примеры и пояснения",
        tagline: "Pydantic — разбор шаблонов, поля Field(), вложенные модели на практике",
        body:
          "### Упражнение 1: «Базовая Pydantic-модель»\n\n" +
          "```python\n" +
          "from pydantic import BaseModel  # {{0}} = BaseModel\n" +
          "from typing import Optional     # {{1}} = Optional\n\n" +
          "class User(BaseModel):          # {{2}} = BaseModel (наследуемся)\n" +
          "    name: str\n" +
          "    email: str\n" +
          "    age: int                    # {{3}} = int\n" +
          "    bio: Optional[str] = None   # {{4}} = None\n\n" +
          "@app.post('/users')\n" +
          "def create_user(user: User):    # {{5}} = User\n" +
          "    return user.model_dump()    # {{6}} = model_dump\n" +
          "```\n\n" +
          "**Объяснение:**\n" +
          "- `{{0}} = BaseModel` — импортируем базовый класс для всех Pydantic-моделей\n" +
          "- `{{1}} = Optional` — нужен для `Optional[str]` (необязательная строка)\n" +
          "- `{{2}} = BaseModel` — класс User НАСЛЕДУЕТ BaseModel, получая всю магию Pydantic\n" +
          "- `{{3}} = int` — возраст это целое число\n" +
          "- `{{4}} = None` — дефолт для необязательного поля\n" +
          "- `{{5}} = User` — тип параметра = модель → FastAPI ожидает JSON-тело с полями User\n" +
          "- `{{6}} = model_dump` — метод Pydantic v2 для конвертации в dict\n\n" +
          "---\n\n" +
          "### Упражнение 2: «Field с ограничениями»\n\n" +
          "```python\n" +
          "from pydantic import BaseModel, Field  # {{0}} = Field\n\n" +
          "class Product(BaseModel):\n" +
          "    name: str = Field(min_length=1, max_length=100)  # {{1}} = Field\n" +
          "    price: float = Field(gt=0.01)    # {{2}} = gt (strictly greater than)\n" +
          "    stock: int = Field(ge=0)         # {{3}} = ge (greater or equal)\n" +
          "    discount: float = Field(ge=0.0, le=1.0)  # {{4}}=ge, {{5}}=le\n" +
          "    tags: list[str] = Field(default_factory=list)  # {{1}} = Field\n" +
          "```\n\n" +
          "**Мнемоника:** gt=**g**reater **t**han (>), ge=**g**reater or **e**qual (>=), le=**l**ess or **e**qual (<=)\n\n" +
          "---\n\n" +
          "### Упражнение 3: «Вложенные модели в FastAPI»\n\n" +
          "```python\n" +
          "class Tag(BaseModel):\n" +
          "    name: str                  # {{0}} = str\n\n" +
          "class Article(BaseModel):\n" +
          "    tags: List[Tag] = []       # {{1}} = List\n" +
          "    published: bool = False    # {{2}} = bool\n\n" +
          "@app.post('/articles', response_model=ArticleResponse)  # {{3}}=response_model, {{4}}=ArticleResponse\n" +
          "def create_article(article: Article):\n" +
          "    return {'id': 1, **article.model_dump()}  # {{5}} = model_dump\n" +
          "```\n\n" +
          "---\n\n" +
          "### Необязательные поля и сериализация\n\n" +
          "**Необязательное поле требует двух вещей одновременно.** Недостаточно написать только `bio: Optional[str]` или только `bio: str = None` — нужно и то, и другое: `bio: Optional[str] = None`. Тип говорит Pydantic что значение может быть `None`, а `= None` задаёт значение по умолчанию. В Python 3.10+ можно писать короче: `bio: str | None = None` — это эквивалент. Без одной из частей Pydantic либо потребует поле обязательным, либо не будет знать что `None` допустимо.\n\n" +
          "**model_dump() — главный метод сериализации.** Метод `model_dump()` преобразует Pydantic-объект в обычный Python-словарь `dict`. Это нужно для: передачи данных в функции, которые ожидают dict; создания нового объекта с изменениями через `Model(**existing.model_dump(), field=new_value)`; логирования и отладки. Раньше (Pydantic v1) этот метод назывался `.dict()`.\n\n" +
          "---\n\n" +
          "### Практика: Схемы для Blog API\n\n" +
          "```python\n" +
          "from fastapi import FastAPI\n" +
          "from pydantic import BaseModel, Field\n" +
          "from typing import Optional\n\n" +
          "class Category(BaseModel):\n" +
          "    name: str = Field(min_length=1, max_length=50)\n\n" +
          "class PostCreate(BaseModel):\n" +
          "    title: str = Field(min_length=3, max_length=200)\n" +
          "    body: str = Field(min_length=1)\n" +
          "    category: Category  # вложенная!\n" +
          "    published: bool = False\n\n" +
          "class PostResponse(BaseModel):\n" +
          "    id: int\n" +
          "    title: str\n" +
          "    published: bool\n\n" +
          "app = FastAPI()\n\n" +
          "@app.post('/posts', response_model=PostResponse, status_code=201)\n" +
          "def create_post(post: PostCreate):\n" +
          "    return {'id': 1, 'title': post.title, 'published': post.published}\n\n" +
          "@app.get('/posts/{post_id}', response_model=PostResponse)\n" +
          "def get_post(post_id: int):\n" +
          "    return {'id': post_id, 'title': 'Post', 'published': True}\n" +
          "```",
      },
    ],
    cheatSheet: [
      "`class Model(BaseModel): field: type` — объявить модель.",
      "`field: Optional[str] = None` — необязательное поле.",
      "`Field(gt=0, max_length=100)` — ограничения валидации.",
      "`model.model_dump()` — модель → dict. `Model(**dict)` — dict → модель.",
      "Вложенные: `class Order(BaseModel): address: Address` — вложенная модель.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fa2-f1",
      title: "Базовая Pydantic-модель",
      description: "Заполни пропуски в модели пользователя и маршруте создания.",
      code:
        "from fastapi import FastAPI\n" +
        "from pydantic import {{0}}\n" +
        "from typing import {{1}}\n\n" +
        "class User({{2}}):\n" +
        "    name: str\n" +
        "    email: str\n" +
        "    age: {{3}}\n" +
        "    bio: Optional[str] = {{4}}\n\n" +
        "app = FastAPI()\n\n" +
        "@app.post('/users')\n" +
        "def create_user(user: {{5}}):\n" +
        "    return user.{{6}}()",
      answers: [
        ["BaseModel"],
        ["Optional"],
        ["BaseModel"],
        ["int"],
        ["None"],
        ["User"],
        ["model_dump"],
      ],
      hints: [
        "Базовый класс для Pydantic-моделей.",
        "Тип для необязательных полей (из typing).",
        "От какого класса наследуется схема?",
        "Тип для целого числа возраста.",
        "Дефолтное значение для необязательного поля.",
        "Тип параметра body — та же модель.",
        "Метод для получения dict из модели (Pydantic v2).",
      ],
      explanation: {
        summary:
          "Pydantic BaseModel — основа валидации данных в FastAPI. Optional поля, вложенные модели и конвертация в dict через model_dump().",
        keyPoints: [
          "BaseModel — базовый класс Pydantic; от него наследуются все схемы, он добавляет валидацию и сериализацию автоматически.",
          "Optional[str] = None — поле необязательно: можно не передавать в JSON, тогда оно будет None.",
          "user: User в параметре функции — FastAPI ждёт JSON-тело с полями, описанными в модели User (автоматически).",
          "model_dump() — метод Pydantic v2 для конвертации модели в обычный Python dict (в v1 это было .dict()).",
        ],
        pitfalls: [
          "В Pydantic v1 использовалось .dict(), в v2 — .model_dump(). FastAPI 0.100+ использует Pydantic v2.",
          "Optional[str] требует from typing import Optional (или используй str | None в Python 3.10+).",
          "Не забывай: int возраст — число, не строка; Pydantic вернёт 422 ошибку если передать '25' вместо 25.",
        ],
      },
    },
    {
      type: "fill",
      id: "fa2-f2",
      title: "Field с ограничениями",
      description: "Добавь Field с валидационными ограничениями.",
      code:
        "from pydantic import BaseModel, {{0}}\n" +
        "from typing import Optional\n\n" +
        "class Product(BaseModel):\n" +
        "    name: str = {{1}}(min_length=1, max_length=100)\n" +
        "    price: float = Field({{2}}=0.01)  # строго больше 0.01\n" +
        "    stock: int = Field({{3}}=0)        # >= 0\n" +
        "    discount: float = Field({{4}}=0.0, {{5}}=1.0)  # 0 ≤ x ≤ 1\n" +
        "    tags: list[str] = {{1}}(default_factory=list)\n\n" +
        "p = Product(name='Laptop', price=999.99, stock=10)\n" +
        "print(p.name, p.price, p.tags)",
      answers: [
        ["Field"],
        ["Field"],
        ["gt"],
        ["ge"],
        ["ge"],
        ["le"],
      ],
      hints: [
        "Имя класса/функции для задания ограничений полей.",
        "Функция для задания параметров поля.",
        "gt = greater than (строго больше).",
        "ge = greater or equal (больше или равно).",
        "ge для нижней границы диапазона.",
        "le = less or equal (меньше или равно).",
      ],
    },
    {
      type: "fill",
      id: "fa2-f3",
      title: "Вложенные модели в FastAPI",
      description: "Создай API с вложенными Pydantic-моделями.",
      code:
        "from fastapi import FastAPI\n" +
        "from pydantic import BaseModel\n" +
        "from typing import List, Optional\n\n" +
        "class Tag(BaseModel):\n" +
        "    name: {{0}}\n\n" +
        "class Article(BaseModel):\n" +
        "    title: str\n" +
        "    body: str\n" +
        "    tags: {{1}}[Tag] = []\n" +
        "    published: {{2}} = False\n\n" +
        "class ArticleResponse(BaseModel):\n" +
        "    id: int\n" +
        "    title: str\n" +
        "    tags: List[Tag]\n\n" +
        "app = FastAPI()\n\n" +
        "@app.post('/articles', {{3}}={{4}})\n" +
        "def create_article(article: Article):\n" +
        "    return {'id': 1, **article.{{5}}()}\n\n" +
        "tag = Tag(name='python')\n" +
        "art = Article(title='FastAPI', body='...', tags=[tag])\n" +
        "print(art.title, len(art.tags))",
      answers: [
        ["str"],
        ["List"],
        ["bool"],
        ["response_model"],
        ["ArticleResponse"],
        ["model_dump"],
      ],
      hints: [
        "Тип текстового поля.",
        "Тип для массива/списка.",
        "Тип для булевого флага публикации.",
        "Параметр декоратора для ограничения ответа.",
        "Имя модели ответа.",
        "Метод для конвертации в dict.",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "fa2-q1",
      title: "Как объявить необязательное поле?",
      question:
        "В Pydantic v2 поле `bio` должно быть необязательной строкой. Как его объявить одной строкой (через Optional или через | None)?",
      answers: [
        "bio: Optional[str] = None",
        "bio: str | None = None",
        "bio: str = None",
        "Optional[str] = None",
        "str | None = None",
        "Optional str None",
      ],
      hint: "Нужно два компонента: тип (Optional[str] или str | None) И default = None.",
      explanation:
        "Оба варианта работают: `bio: Optional[str] = None` и `bio: str | None = None` (Python 3.10+).\n\nВажно: без `= None` поле будет обязательным, даже если тип Optional! Pydantic v2 требует явного default=None.",
    },
    {
      type: "question",
      id: "fa2-q2",
      title: "Что делает model_dump()?",
      question:
        "Метод `model.model_dump()` возвращает ___ (тип Python-объекта).",
      answers: [
        "dict", "словарь", "dictionary", "python dict", "питон дикт",
        "dict python", "словарь питон", "словарь Python",
      ],
      hint: "Это стандартный Python тип для пар ключ-значение.",
      explanation:
        "`model_dump()` — метод Pydantic v2 (в v1 был `dict()`). Возвращает `dict` со всеми полями модели, включая вложенные (тоже как dict). Полезно для сохранения в БД или передачи в другую функцию.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fa2-w1",
      title: "Схемы для Blog API",
      task:
        "Создай Pydantic-модели и FastAPI-маршруты для блога.\n\n" +
        "━━━ Модели ━━━\n\n" +
        "class Category(BaseModel):\n" +
        "    • name: str (min_length=1, max_length=50)\n\n" +
        "class PostCreate(BaseModel):\n" +
        "    • title: str (min_length=3, max_length=200)\n" +
        "    • body: str (min_length=1)\n" +
        "    • category: Category (вложенная!)\n" +
        "    • published: bool = False\n\n" +
        "class PostResponse(BaseModel):\n" +
        "    • id: int\n" +
        "    • title: str\n" +
        "    • published: bool\n\n" +
        "━━━ Маршруты ━━━\n\n" +
        "POST /posts — принять PostCreate, вернуть PostResponse (через response_model)\n" +
        "GET /posts/{post_id} — вернуть {'id': post_id, 'title': 'Post', 'published': True}\n\n" +
        "Запусти код и убедись, что нет ошибок!",
      hints: [
        "from pydantic import BaseModel, Field",
        "class Category(BaseModel): name: str = Field(min_length=1, max_length=50)",
        "category: Category — просто укажи тип модели для вложения",
        "@app.post('/posts', response_model=PostResponse)",
        "return {'id': 1, **post.model_dump()}",
      ],
      required: [
        "BaseModel",
        "Field(",
        "category: Category",
        "response_model=PostResponse",
        "PostCreate",
        "PostResponse",
        "published",
        "model_dump",
      ],
      minLines: 32,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 3 · Зависимости (Depends) и HTTP-исключения
// ─────────────────────────────────────────────────────────────────────────────
const fa3: Round = {
  number: 3,
  title: "FastAPI · Depends — внедрение зависимостей",
  level: "Средний",
  intro:
    "Depends — система внедрения зависимостей FastAPI. Она позволяет переиспользовать логику (пагинация, авторизация, подключение к БД) без дублирования кода.\n\n**В этом раунде:**\n• HTTPException — правильные ошибки\n• Depends() — зависимости\n• Общие зависимости (пагинация, фильтрация)\n• Зависимости-классы\n• Вложенные зависимости",
  lesson: {
    title: "HTTPException и Depends — ошибки и переиспользование",
    summary:
      "HTTPException возвращает HTTP-ошибку с кодом и сообщением. Depends подключает переиспользуемую логику к маршрутам.",
    readingMinutes: 14,
    sections: [
      {
        heading: "HTTPException — правильные ошибки API",
        tagline: "raise HTTPException(status_code=404) — вместо return {'error': ...}",
        body:
          "В REST API ошибки передаются через HTTP-статус-коды, а не через успешный ответ с полем error.\n\n" +
          "**❌ Неправильно (Flask-стиль):**\n" +
          "```python\n" +
          "@app.get('/users/{id}')\n" +
          "def get_user(id: int):\n" +
          "    user = db.get(id)\n" +
          "    if not user:\n" +
          "        return {'error': 'User not found'}  # ❌ HTTP 200, но ошибка!\n" +
          "```\n\n" +
          "**✅ Правильно (FastAPI-стиль):**\n" +
          "```python\n" +
          "@app.get('/users/{id}')\n" +
          "def get_user(id: int):\n" +
          "    user = db.get(id)\n" +
          "    if not user:\n" +
          "        raise HTTPException(status_code=404, detail='User not found')  # HTTP 404!\n" +
          "    return user\n" +
          "```\n\n" +
          "**Основные коды ошибок:**\n\n" +
          "| Код | Имя | Когда использовать |\n" +
          "|---|---|---|\n" +
          "| 400 | Bad Request | Клиент отправил некорректные данные |\n" +
          "| 401 | Unauthorized | Не аутентифицирован (нет токена) |\n" +
          "| 403 | Forbidden | Аутентифицирован, но нет прав |\n" +
          "| 404 | Not Found | Ресурс не найден |\n" +
          "| 409 | Conflict | Конфликт (email уже существует) |\n" +
          "| 422 | Unprocessable | Ошибка валидации (FastAPI генерирует автоматически) |\n" +
          "| 429 | Too Many Requests | Превышен лимит запросов |\n" +
          "| 500 | Server Error | Внутренняя ошибка сервера |\n\n" +
          "**HTTPException** прерывает выполнение функции (как `raise` в Python) и FastAPI возвращает JSON:\n" +
          "```json\n" +
          "{\"detail\": \"User not found\"}\n" +
          "```\n\n" +
          "**detail может быть строкой, dict или list:**\n" +
          "```python\n" +
          "raise HTTPException(\n" +
          "    status_code=422,\n" +
          "    detail=[{'loc': ['body', 'email'], 'msg': 'Email уже занят', 'type': 'value_error'}]\n" +
          ")\n" +
          "```\n\n" +
          "**headers= для добавления заголовков к ошибке:**\n" +
          "```python\n" +
          "raise HTTPException(\n" +
          "    status_code=401,\n" +
          "    detail='Требуется авторизация',\n" +
          "    headers={'WWW-Authenticate': 'Bearer'}  # стандарт для Bearer токенов\n" +
          ")\n" +
          "```",
        code:
          "from fastapi import FastAPI, HTTPException\n\n" +
          "app = FastAPI()\n\n" +
          "users = {1: 'Анна', 2: 'Иван', 3: 'Мария'}\n\n" +
          "@app.get('/users/{user_id}')\n" +
          "def get_user(user_id: int):\n" +
          "    if user_id not in users:\n" +
          "        raise HTTPException(\n" +
          "            status_code=404,\n" +
          "            detail=f'Пользователь {user_id} не найден'\n" +
          "        )\n" +
          "    return {'id': user_id, 'name': users[user_id]}\n\n" +
          "# Кастомные заголовки в ошибке:\n" +
          "@app.get('/secure')\n" +
          "def secure_endpoint(token: str = None):\n" +
          "    if token != 'secret':\n" +
          "        raise HTTPException(\n" +
          "            status_code=401,\n" +
          "            detail='Неверный токен',\n" +
          "            headers={'WWW-Authenticate': 'Bearer'}\n" +
          "        )\n" +
          "    return {'data': 'секретные данные'}\n\n" +
          "# Тест:\n" +
          "try:\n" +
          "    get_user(999)  # вызовет исключение\n" +
          "except HTTPException as e:\n" +
          "    print(f'HTTPException {e.status_code}: {e.detail}')",
        keyTakeaways: [
          "raise HTTPException(404) — прерывает функцию, клиент получает JSON {'detail': '...'}.",
          "headers= в HTTPException — добавляет заголовки к ответу об ошибке.",
          "422 FastAPI генерирует автоматически при ошибках валидации Pydantic.",
        ],
        pitfalls: [
          "return {'error': 'not found'} — это HTTP 200 с body об ошибке. Клиент не поймёт что это ошибка!",
          "raise HTTPException(401) и raise HTTPException(403) — разные вещи. 401 = нет токена, 403 = токен есть но нет прав.",
        ],
      },
      {
        heading: "Depends() — система зависимостей",
        tagline: "Depends = переиспользуемая логика, подключённая к маршруту автоматически",
        body:
          "**Depends** — механизм внедрения зависимостей (Dependency Injection). Ты описываешь логику один раз, а FastAPI подключает её к маршрутам автоматически.\n\n" +
          "### Что такое Dependency Injection простыми словами\n\n" +
          "**Dependency Injection (DI)** — паттерн программирования. Вместо того чтобы каждый маршрут сам создавал нужный объект (сессию БД, проверял токен, считывал параметры) — ты описываешь это один раз в отдельной функции, а FastAPI сам «вкалывает» (inject) результат в каждый маршрут.\n\n" +
          "Аналогия: ты идёшь на работу, и охрана на входе сама проверяет твой пропуск (зависимость). Тебе не нужно в каждом кабинете заново показывать пропуск — охрана уже сделала это за тебя.\n\n" +
          "---\n\n" +
          "**Для чего используется Depends:**\n\n" +
          "| Задача | Без Depends | С Depends |\n" +
          "|---|---|---|\n" +
          "| Пагинация | skip и limit в каждой функции | Одна функция pagination() |\n" +
          "| Авторизация | Проверять токен в каждом маршруте | Одна функция get_current_user() |\n" +
          "| Сессия БД | Открывать/закрывать в каждом маршруте | Одна функция get_db() с yield |\n" +
          "| Фильтрация | Дублировать query params везде | Одна функция common_filters() |\n\n" +
          "**Как работает Depends:**\n" +
          "```python\n" +
          "def pagination(skip: int = 0, limit: int = 10):\n" +
          "    return {'skip': skip, 'limit': limit}\n\n" +
          "@app.get('/items')\n" +
          "def list_items(page = Depends(pagination)):\n" +
          "    # FastAPI:\n" +
          "    # 1. Смотрит на параметры pagination() — skip и limit\n" +
          "    # 2. Берёт их из query string запроса\n" +
          "    # 3. Вызывает pagination(skip=0, limit=10)\n" +
          "    # 4. Передаёт результат в page\n" +
          "    return page  # {'skip': 0, 'limit': 10}\n" +
          "```\n\n" +
          "**Зависимость может быть:**\n" +
          "- Обычной функцией: `def dep(): return ...`\n" +
          "- Async функцией: `async def dep(): return ...`\n" +
          "- Callable-классом: экземпляр класса с `__call__`\n" +
          "- Generator (с yield): для очистки ресурсов после запроса\n\n" +
          "**Вложенные зависимости:**\n" +
          "Зависимость может зависеть от другой зависимости!\n" +
          "```python\n" +
          "def get_token(token: str): return token\n" +
          "def get_user(token = Depends(get_token)): return users[token]  # зависит от get_token\n" +
          "def require_admin(user = Depends(get_user)): ...  # зависит от get_user\n" +
          "```\n" +
          "FastAPI сам строит граф зависимостей и вызывает их в правильном порядке!\n\n" +
          "**Кэширование:** по умолчанию зависимость вызывается ОДИН РАЗ за запрос. Если несколько маршрутов используют одну зависимость — она будет вызвана один раз. Отключить: `Depends(fn, use_cache=False)`.",
        code:
          "from fastapi import FastAPI, Depends, HTTPException\n\n" +
          "app = FastAPI()\n\n" +
          "# Зависимость для пагинации — используется везде\n" +
          "def pagination(skip: int = 0, limit: int = 10):\n" +
          "    if limit > 100:\n" +
          "        raise HTTPException(400, 'limit не может быть больше 100')\n" +
          "    return {'skip': skip, 'limit': limit}\n\n" +
          "@app.get('/items')\n" +
          "def list_items(page: dict = Depends(pagination)):\n" +
          "    return {'page': page, 'items': []}\n\n" +
          "@app.get('/users')\n" +
          "def list_users(page: dict = Depends(pagination)):  # та же зависимость!\n" +
          "    return {'page': page, 'users': []}\n\n" +
          "# Зависимость для проверки токена\n" +
          "TOKENS = {'abc123': 'admin', 'xyz789': 'user'}\n\n" +
          "def get_current_user(token: str):\n" +
          "    user = TOKENS.get(token)\n" +
          "    if not user:\n" +
          "        raise HTTPException(401, 'Неверный токен')\n" +
          "    return user\n\n" +
          "@app.get('/profile')\n" +
          "def profile(user: str = Depends(get_current_user)):\n" +
          "    return {'user': user}\n\n" +
          "print('Depends: зависимости подключены!')",
        keyTakeaways: [
          "Depends(fn) — FastAPI вызовет fn, передаст результат в параметр маршрута.",
          "Зависимость может принимать свои параметры (query params, headers) — FastAPI разберётся.",
          "raise HTTPException внутри зависимости — прерывает весь запрос (маршрут не вызывается).",
        ],
        pitfalls: [
          "Depends(pagination) — не Depends(pagination()) ! Передаём функцию, а не её вызов.",
          "def req(x: str) в зависимости — x будет ОБЯЗАТЕЛЬНЫМ query param. def req(x: str = None) — необязательным.",
        ],
      },
      {
        heading: "🚀 Мастер-гид: обработка ошибок и зависимости (Raund 3)",
        tagline: "Пошаговый разбор HTTPException, валидационных ошибок, Depends и chain-зависимостей",
        body:
          "## HTTPException — правильный способ возвращать ошибки\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, HTTPException\n\n" +
          "app = FastAPI()\n\n" +
          "ITEMS = {1: 'Laptop', 2: 'Phone', 3: 'Book'}\n\n" +
          "@app.get('/items/{item_id}')\n" +
          "def get_item(item_id: int):\n" +
          "    if item_id not in ITEMS:\n" +
          "        raise HTTPException(\n" +
          "            status_code=404,         # HTTP статус-код\n" +
          "            detail='Item not found', # сообщение клиенту\n" +
          "        )\n" +
          "    return {'id': item_id, 'name': ITEMS[item_id]}\n\n" +
          "# Тест — успешно:\n" +
          "try:\n" +
          "    print('Найден:', get_item(1))\n" +
          "    print('Ошибка:', get_item(999))\n" +
          "except Exception as e:\n" +
          "    print('HTTPException поймана:', e)\n" +
          "```\n\n" +
          "**Стандартные статус-коды — когда какой использовать:**\n\n" +
          "| Код | Название | Когда использовать |\n" +
          "|---|---|---|\n" +
          "| 400 | Bad Request | Невалидные данные от клиента (бизнес-логика) |\n" +
          "| 401 | Unauthorized | Не аутентифицирован (нужен логин) |\n" +
          "| 403 | Forbidden | Аутентифицирован, но нет прав |\n" +
          "| 404 | Not Found | Ресурс не существует |\n" +
          "| 409 | Conflict | Дубликат (email уже занят) |\n" +
          "| 422 | Unprocessable | FastAPI автоматически при ошибке типа |\n" +
          "| 500 | Server Error | Внутренняя ошибка сервера (редко явно) |\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, HTTPException\n\n" +
          "app = FastAPI()\n" +
          "USERS = {'alex@mail.com': {'id': 1, 'name': 'Alex'}}\n\n" +
          "@app.post('/users')\n" +
          "def create_user(email: str, name: str):\n" +
          "    if email in USERS:\n" +
          "        raise HTTPException(status_code=409, detail=f'Email {email} уже занят')\n" +
          "    if len(name) < 2:\n" +
          "        raise HTTPException(status_code=400, detail='Имя должно быть минимум 2 символа')\n" +
          "    USERS[email] = {'id': len(USERS)+1, 'name': name}\n" +
          "    return USERS[email]\n\n" +
          "# Тест:\n" +
          "try:\n" +
          "    print('Создан:', create_user('new@mail.com', 'Петр'))\n" +
          "    print('Дубликат:', create_user('alex@mail.com', 'Alex2'))\n" +
          "except Exception as e:\n" +
          "    print('Ошибка:', e)\n" +
          "```\n\n" +
          "## Depends() — система зависимостей FastAPI\n\n" +
          "**Depends — это Dependency Injection (внедрение зависимостей)**\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, Depends, HTTPException\n\n" +
          "app = FastAPI()\n\n" +
          "# ЗАВИСИМОСТЬ: функция, которую FastAPI вызывает перед обработчиком\n" +
          "def get_pagination(skip: int = 0, limit: int = 20):\n" +
          "    if limit > 100:\n" +
          "        raise HTTPException(400, detail='limit не может быть больше 100')\n" +
          "    return {'skip': skip, 'limit': limit}\n\n" +
          "# Используем зависимость: Depends(get_pagination) — БЕЗ скобок!\n" +
          "@app.get('/items')\n" +
          "def list_items(pagination: dict = Depends(get_pagination)):\n" +
          "    # pagination = {'skip': 0, 'limit': 20} — результат get_pagination()\n" +
          "    items = [{'id': i} for i in range(pagination['skip'], pagination['skip'] + pagination['limit'])]\n" +
          "    return {'pagination': pagination, 'items': items[:5]}\n\n" +
          "# Тест:\n" +
          "pag = get_pagination(skip=0, limit=10)  # тестируем зависимость напрямую\n" +
          "print('Pagination:', pag)\n" +
          "print('Items:', list_items(pagination=pag))\n" +
          "```\n\n" +
          "**Цепочки зависимостей (chain of dependencies):**\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, Depends, HTTPException\n\n" +
          "app = FastAPI()\n\n" +
          "# 1. Базовая зависимость: получаем токен из заголовка\n" +
          "VALID_TOKEN = 'secret-token-123'\n\n" +
          "def verify_token(token: str = 'none'):\n" +
          "    if token != VALID_TOKEN:\n" +
          "        raise HTTPException(status_code=401, detail='Неверный токен')\n" +
          "    return token\n\n" +
          "# 2. Зависимость 2-го уровня: получает текущего пользователя\n" +
          "#    — сама зависит от verify_token!\n" +
          "def get_current_user(token: str = Depends(verify_token)):\n" +
          "    return {'id': 1, 'name': 'Alex', 'token': token}\n\n" +
          "# 3. Маршрут использует get_current_user → который тянет verify_token\n" +
          "@app.get('/profile')\n" +
          "def get_profile(user: dict = Depends(get_current_user)):\n" +
          "    return {'profile': user}\n\n" +
          "# Тест:\n" +
          "try:\n" +
          "    u = get_current_user(token=verify_token(VALID_TOKEN))\n" +
          "    print('Пользователь:', u)\n" +
          "except Exception as e:\n" +
          "    print('Ошибка:', e)\n" +
          "```\n\n" +
          "## Как подходить к упражнениям раунда 3\n\n" +
          "**HTTPException упражнения:**\n" +
          "- Запомни: `raise HTTPException(status_code=404, detail='...')` — именно RAISE, не return!\n" +
          "- Импортируй: `from fastapi import FastAPI, HTTPException`\n" +
          "- Паттерн: `if not found: raise HTTPException(404, 'Not Found')`\n\n" +
          "**Depends упражнения:**\n" +
          "- `Depends(fn)` — без скобок у fn! `Depends(fn())` — ОШИБКА!\n" +
          "- Функция зависимости может принимать свои параметры (query params) — FastAPI их заполнит\n" +
          "- Результат зависимости передаётся как аргумент маршрута\n\n" +
          "```python\n" +
          "# Быстрый шаблон — 404 обработчик:\n" +
          "from fastapi import FastAPI, HTTPException\n" +
          "app = FastAPI()\n\n" +
          "DB = {1: 'Item 1', 2: 'Item 2'}\n\n" +
          "@app.get('/items/{id}')\n" +
          "def get(id: int):\n" +
          "    if id not in DB:\n" +
          "        raise HTTPException(status_code=404, detail='Not found')\n" +
          "    return {'id': id, 'name': DB[id]}\n\n" +
          "# Быстрый шаблон — пагинация через Depends:\n" +
          "def paginate(page: int = 1, size: int = 10):\n" +
          "    return {'skip': (page-1)*size, 'limit': size}\n\n" +
          "@app.get('/items')\n" +
          "def list_items(pag: dict = Depends(paginate)):\n" +
          "    return pag\n\n" +
          "print(get(1))  # {'id': 1, 'name': 'Item 1'}\n" +
          "print(paginate(page=2, size=5))  # {'skip': 5, 'limit': 5}\n" +
          "```",
        code:
          "from fastapi import FastAPI, HTTPException, Depends\n\n" +
          "app = FastAPI()\n\n" +
          "# База данных в памяти\n" +
          "users_db = {\n" +
          "    1: {'id': 1, 'name': 'Алексей', 'email': 'alex@mail.com', 'active': True},\n" +
          "    2: {'id': 2, 'name': 'Мария', 'email': 'maria@mail.com', 'active': False},\n" +
          "}\n\n" +
          "# Зависимость: пагинация\n" +
          "def get_pagination(skip: int = 0, limit: int = 10):\n" +
          "    if limit > 100:\n" +
          "        raise HTTPException(400, 'limit макс. 100')\n" +
          "    return {'skip': skip, 'limit': limit}\n\n" +
          "# Зависимость: получить активного пользователя или 404/403\n" +
          "def get_active_user(user_id: int):\n" +
          "    if user_id not in users_db:\n" +
          "        raise HTTPException(404, f'Пользователь {user_id} не найден')\n" +
          "    user = users_db[user_id]\n" +
          "    if not user['active']:\n" +
          "        raise HTTPException(403, 'Пользователь заблокирован')\n" +
          "    return user\n\n" +
          "# Маршруты\n" +
          "@app.get('/users')\n" +
          "def list_users(pagination: dict = Depends(get_pagination)):\n" +
          "    all_users = list(users_db.values())\n" +
          "    return all_users[pagination['skip']:pagination['skip']+pagination['limit']]\n\n" +
          "@app.get('/users/{user_id}')\n" +
          "def get_user(user: dict = Depends(get_active_user)):\n" +
          "    return user\n\n" +
          "# Тест:\n" +
          "pag = get_pagination(skip=0, limit=10)\n" +
          "print('Список:', list_users(pagination=pag))\n" +
          "try:\n" +
          "    print('Активный:', get_active_user(1))\n" +
          "    print('Заблокирован:', get_active_user(2))\n" +
          "except Exception as e:\n" +
          "    print('Ошибка:', e)",
        keyTakeaways: [
          "raise HTTPException(404, 'Not found') — RAISE, не return! HTTPException наследует Exception.",
          "Depends(fn) — без скобок! FastAPI сам вызовет функцию и передаст результат в маршрут.",
          "Зависимости могут иметь свои зависимости — FastAPI строит граф и вызывает всё в правильном порядке.",
          "HTTPException в зависимости — прерывает выполнение, маршрут не вызывается вообще.",
          "Зависимости переиспользуются: одна функция пагинации для 100 маршрутов — DRY-принцип.",
        ],
        pitfalls: [
          "raise HTTPException, не return HTTPException — очень частая ошибка.",
          "Depends(get_user()) с скобками — вызовет функцию сразу, не передаст как зависимость!",
          "Зависимость без type hint: def fn(user=Depends(get_user)) — работает, но с type hint IDE лучше помогает.",
        ],
      },
      {
        heading: "Примеры и пояснения",
        tagline: "HTTPException, Depends, валидация — полные рабочие примеры",
        body:
          "### Упражнение 1: «HTTPException в маршрутах»\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, HTTPException  # {{0}} = HTTPException\n\n" +
          "# if item_id not in items:\n" +
          "raise HTTPException(               # {{1}} = HTTPException\n" +
          "    status_code=404,               # {{2}} = 404 (Not Found)\n" +
          "    detail='Item not found'\n" +
          ")\n\n" +
          "# DELETE:\n" +
          "raise HTTPException(status_code=404)  # {{3}} = 404\n" +
          "return {'deleted': True}              # {{4}} = True\n\n" +
          "# Admin:\n" +
          "raise HTTPException(status_code=403)  # {{5}} = status_code, {{6}} = 403\n" +
          "```\n\n" +
          "---\n\n" +
          "### Упражнение 2: «Depends — зависимость пагинации»\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, Depends  # {{0}} = Depends\n\n" +
          "def common_params(\n" +
          "    skip: int = 0,\n" +
          "    limit: int = 10,  # {{1}} = 10\n" +
          "):\n" +
          "    return {'skip': skip, 'limit': limit}\n\n" +
          "@app.get('/users')\n" +
          "def list_users(params: dict = Depends(common_params)):  # {{2}} = Depends\n" +
          "    ...\n\n" +
          "@app.get('/products')\n" +
          "def list_products(params: dict = Depends(common_params)):  # {{3}} = common_params\n" +
          "    ...\n\n" +
          "class Filter:\n" +
          "    def __call__(self):   # {{4}} = call (магический метод callable)\n" +
          "        return {'active': self.active}\n\n" +
          "@app.get('/items')\n" +
          "def list_items(f = Depends(Filter)):  # {{5}} = Depends\n" +
          "```\n\n" +
          "---\n\n" +
          "### Упражнение 3: «Вложенные зависимости»\n\n" +
          "```python\n" +
          "def get_token(token: str):\n" +
          "    if token not in USERS_DB:\n" +
          "        raise HTTPException(401)  # {{0}} = HTTPException\n" +
          "    return token\n\n" +
          "def get_user(token: str = Depends(get_token)):  # {{1}} = Depends\n" +
          "    return USERS_DB[token]\n\n" +
          "def require_admin(user: dict = Depends(get_user)):  # {{2}} = get_user\n" +
          "    if user['role'] != 'admin':  # {{3}} = admin\n" +
          "        raise HTTPException(403)\n\n" +
          "@app.get('/admin/stats')\n" +
          "def admin_stats(admin = Depends(require_admin)):  # {{4}} = require_admin\n" +
          "```\n\n" +
          "---\n\n" +
          "### Валидация и механизм зависимостей\n\n" +
          "**HTTP 422 — ошибка валидации.** FastAPI возвращает статус 422 Unprocessable Entity автоматически, когда входящие данные не прошли проверку Pydantic. Например: передана строка \'abc\' там где ожидается `int`, или обязательное поле отсутствует в теле запроса. FastAPI включает в ответ подробный JSON с описанием каждой ошибки поля — это удобно при отладке. Тебе не нужно писать try/except для базовой валидации.\n\n" +
          "**Depends — IoC-контейнер FastAPI.** Отличие Depends от обычного вызова в том, что FastAPI сам создаёт и передаёт зависимость в функцию маршрута. Depends умеет: читать параметры из запроса (query, header, cookie, path); поддерживать вложенные зависимости (зависимость может сама зависеть от другого Depends); поддерживать `yield`-зависимости для управления ресурсами (соединения к БД). Обычный вызов функции ничего этого не может — он не имеет доступа к объекту запроса.\n\n" +
          "---\n\n" +
          "### Практика: API с аутентификацией\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, Depends, HTTPException\n\n" +
          "USERS = {\n" +
          "    'token1': {'name': 'Admin', 'role': 'admin'},\n" +
          "    'token2': {'name': 'User', 'role': 'user'},\n" +
          "}\n\n" +
          "def get_current_user(token: str):\n" +
          "    user = USERS.get(token)\n" +
          "    if not user:\n" +
          "        raise HTTPException(status_code=401, detail='Неверный токен')\n" +
          "    return user\n\n" +
          "def require_admin(user: dict = Depends(get_current_user)):\n" +
          "    if user['role'] != 'admin':\n" +
          "        raise HTTPException(status_code=403, detail='Только для администраторов')\n" +
          "    return user\n\n" +
          "app = FastAPI()\n\n" +
          "@app.get('/public')\n" +
          "def public(): return {'message': 'Публичная страница'}\n\n" +
          "@app.get('/me')\n" +
          "def me(user = Depends(get_current_user)): return user\n\n" +
          "@app.get('/admin')\n" +
          "def admin(user = Depends(require_admin)): return user\n" +
          "```",
      },
    ],
    cheatSheet: [
      "`from fastapi import HTTPException` → `raise HTTPException(status_code=404, detail='...')`",
      "`def dep(skip: int = 0, limit: int = 10): return {'skip': skip, 'limit': limit}`",
      "`def endpoint(data: dict = Depends(dep)):` — подключить зависимость.",
      "Depends может быть async: `async def dep(): ...`",
      "Вложенные: `def dep2(x = Depends(dep1)):` — dep1 вызывается перед dep2.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fa3-f1",
      title: "HTTPException в маршрутах",
      description: "Добавь правильные ошибки через HTTPException.",
      code:
        "from fastapi import FastAPI, {{0}}\n\n" +
        "app = FastAPI()\n" +
        "items = {1: 'Apple', 2: 'Banana', 3: 'Cherry'}\n\n" +
        "@app.get('/items/{item_id}')\n" +
        "def get_item(item_id: int):\n" +
        "    if item_id not in items:\n" +
        "        raise {{1}}(\n" +
        "            status_code={{2}},\n" +
        "            detail=f'Item {item_id} not found'\n" +
        "        )\n" +
        "    return {'id': item_id, 'name': items[item_id]}\n\n" +
        "@app.delete('/items/{item_id}')\n" +
        "def delete_item(item_id: int):\n" +
        "    if item_id not in items:\n" +
        "        raise HTTPException(status_code={{3}}, detail='Not found')\n" +
        "    del items[item_id]\n" +
        "    return {'deleted': {{4}}}\n\n" +
        "@app.get('/admin')\n" +
        "def admin(secret: str = None):\n" +
        "    if secret != 'password':\n" +
        "        raise HTTPException({{5}}={{6}}, detail='Forbidden')\n" +
        "    return {'access': 'granted'}",
      answers: [
        ["HTTPException"],
        ["HTTPException"],
        ["404"],
        ["404"],
        ["True"],
        ["status_code"],
        ["403"],
      ],
      hints: [
        "Класс для HTTP-ошибок из fastapi.",
        "Имя класса, который мы raise-им.",
        "Код 'не найдено'.",
        "Тот же код для DELETE.",
        "Булево значение успешного удаления.",
        "Параметр для кода статуса.",
        "Код 'доступ запрещён'.",
      ],
    },
    {
      type: "fill",
      id: "fa3-f2",
      title: "Depends — зависимость пагинации",
      description: "Создай зависимость пагинации и подключи её к маршрутам.",
      code:
        "from fastapi import FastAPI, {{0}}\n\n" +
        "app = FastAPI()\n\n" +
        "def common_params(\n" +
        "    skip: int = 0,\n" +
        "    limit: int = {{1}},\n" +
        "    q: str = None\n" +
        "):\n" +
        "    return {'skip': skip, 'limit': limit, 'q': q}\n\n" +
        "@app.get('/users')\n" +
        "def list_users(params: dict = {{2}}(common_params)):\n" +
        "    return params\n\n" +
        "@app.get('/products')\n" +
        "def list_products(params: dict = Depends({{3}})):\n" +
        "    return {'products': [], **params}\n\n" +
        "class Filter:\n" +
        "    def __init__(self, active: bool = True):\n" +
        "        self.active = active\n\n" +
        "    def __{{4}}__(self):\n" +
        "        return {'active': self.active}\n\n" +
        "@app.get('/items')\n" +
        "def list_items(f: Filter = {{5}}(Filter)):\n" +
        "    return f",
      answers: [
        ["Depends"],
        ["10"],
        ["Depends"],
        ["common_params"],
        ["call"],
        ["Depends"],
      ],
      hints: [
        "Функция из fastapi для внедрения зависимостей.",
        "Дефолтный лимит для пагинации.",
        "Как подключаем зависимость в параметр.",
        "Имя функции-зависимости (определённой выше).",
        "Магический метод для callable-объекта.",
        "Зависимость подключается через Depends.",
      ],
    },
    {
      type: "fill",
      id: "fa3-f3",
      title: "Вложенные зависимости",
      description: "Зависимости могут использовать другие зависимости.",
      code:
        "from fastapi import FastAPI, Depends, HTTPException\n\n" +
        "app = FastAPI()\n\n" +
        "USERS_DB = {'token_a': {'id': 1, 'name': 'Анна', 'role': 'admin'},\n" +
        "            'token_b': {'id': 2, 'name': 'Борис', 'role': 'user'}}\n\n" +
        "def get_token(token: str):\n" +
        "    if token not in USERS_DB:\n" +
        "        raise {{0}}(status_code=401, detail='Невалидный токен')\n" +
        "    return token\n\n" +
        "def get_user(token: str = {{1}}(get_token)):\n" +
        "    return USERS_DB[token]\n\n" +
        "def require_admin(user: dict = Depends({{2}})):\n" +
        "    if user['role'] != '{{3}}':\n" +
        "        raise HTTPException(status_code=403, detail='Только для администраторов')\n" +
        "    return user\n\n" +
        "@app.get('/admin/stats')\n" +
        "def admin_stats(admin: dict = Depends({{4}})):\n" +
        "    return {'admin': admin['name'], 'stats': 'ok'}\n\n" +
        "@app.get('/me')\n" +
        "def me(user: dict = Depends(get_user)):\n" +
        "    return user",
      answers: [
        ["HTTPException"],
        ["Depends"],
        ["get_user"],
        ["admin"],
        ["require_admin"],
      ],
      hints: [
        "Какой класс мы raise-им для ошибок HTTP?",
        "Depends подключает get_token к get_user.",
        "Зависимость get_user использует результат другой зависимости.",
        "Строка-роль администратора.",
        "Последняя зависимость в цепочке для маршрута.",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "fa3-q1",
      title: "Что такое 422 Unprocessable Entity?",
      question:
        "FastAPI автоматически возвращает 422, когда клиент передаёт данные, не прошедшие ___. Введи одно слово.",
      answers: [
        "валидацию", "валидацию pydantic", "pydantic валидацию", "validation",
        "pydantic validation", "проверку типов", "pydantic проверку", "типизацию",
        "проверку", "pydantic", "валидацию данных",
      ],
      hint: "Это процесс проверки соответствия данных ожидаемым типам и ограничениям.",
      explanation:
        "422 Unprocessable Entity — ответ FastAPI при ошибках валидации Pydantic. Тело ответа содержит подробный список ошибок с указанием поля и причины. Это происходит автоматически — тебе не нужно писать try/except.",
    },
    {
      type: "question",
      id: "fa3-q2",
      title: "Чем Depends лучше обычного импорта?",
      question:
        "Зачем использовать `Depends()` вместо обычного вызова функции внутри маршрута?",
      answers: [
        "Depends позволяет fastapi управлять жизненным циклом зависимости и использовать её как параметр с автоматическим внедрением",
        "зависимость получает свои параметры из запроса автоматически",
        "fastapi сам разрешает параметры зависимости из запроса",
        "depends автоматически инжектит параметры из query path header",
        "fastapi вызывает функцию зависимости с правильными параметрами из запроса",
        "переиспользование логики без дублирования кода",
        "depends инжектирует зависимости автоматически",
        "dependency injection позволяет fastapi управлять вызовом",
        "fastapi сам вызывает и передаёт параметры",
        "автоматическое внедрение параметров из запроса",
        "инверсия управления параметрами",
      ],
      hint: "Ключевое слово: FastAPI сам знает, откуда брать параметры зависимости.",
      explanation:
        "Depends позволяет FastAPI:\n1. Автоматически разрешать параметры зависимости из текущего запроса (query, path, headers)\n2. Кэшировать результат зависимости в рамках одного запроса\n3. Использовать yield-зависимости (cleanup после запроса)\n4. Строить граф зависимостей и обнаруживать циклы\n\nОбычный вызов функции это не умеет.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fa3-w1",
      title: "API с аутентификацией через Depends",
      task:
        "Создай FastAPI с системой авторизации через Depends.\n\n" +
        "━━━ Что нужно ━━━\n\n" +
        "1. Словарь `USERS = {'token1': {'name': 'Admin', 'role': 'admin'}, ...}`\n\n" +
        "2. Зависимость `get_current_user(token: str)` → проверяет токен, возвращает пользователя или HTTPException 401\n\n" +
        "3. Зависимость `require_admin(user = Depends(get_current_user))` → проверяет role=='admin', иначе 403\n\n" +
        "4. Маршруты:\n" +
        "   - `GET /me` — текущий пользователь (нужен get_current_user)\n" +
        "   - `GET /admin` — только для admin (нужен require_admin)\n" +
        "   - `GET /public` — без авторизации\n\n" +
        "Убедись что HTTPException, Depends импортированы.",
      hints: [
        "from fastapi import FastAPI, Depends, HTTPException",
        "def get_current_user(token: str): если нет → raise HTTPException(401)",
        "def require_admin(user: dict = Depends(get_current_user)): если role != 'admin' → 403",
        "@app.get('/me') def me(user = Depends(get_current_user)): return user",
      ],
      required: [
        "Depends",
        "HTTPException",
        "get_current_user",
        "require_admin",
        "status_code=401",
        "status_code=403",
        "@app.get('/me')",
        "@app.get('/admin')",
      ],
      minLines: 32,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 4 · Response Model и статус-коды
// ─────────────────────────────────────────────────────────────────────────────
const fa4: Round = {
  number: 4,
  title: "FastAPI · Ответы, статус-коды, response_model",
  level: "Средний",
  intro:
    "FastAPI позволяет точно контролировать форму ответа и HTTP-статус-код. response_model фильтрует данные перед отправкой, status_code задаёт код успешного ответа.\n\n**В этом раунде:**\n• response_model — ограничение формы ответа\n• status_code — правильные коды\n• JSONResponse и Response\n• Исключение полей из ответа\n• Union в response_model",
  lesson: {
    title: "response_model и статус-коды — полный контроль над ответом",
    summary:
      "response_model ограничивает что видит клиент. status_code задаёт HTTP-код успеха. JSONResponse даёт полный контроль над ответом.",
    readingMinutes: 12,
    sections: [
      {
        heading: "response_model — что видит клиент",
        tagline: "response_model фильтрует поля перед отправкой — безопасность и контракт API",
        body:
          "**Зачем response_model:**\n\n" +
          "1. **Безопасность** — скрыть поля, которые не должен видеть клиент (например, password_hash, internal_id)\n" +
          "2. **Контракт API** — гарантировать форму ответа независимо от внутренней реализации\n" +
          "3. **Документация** — Swagger показывает правильную схему ответа (не то что функция реально возвращает)\n" +
          "4. **Сериализация** — FastAPI сам конвертирует вложенные объекты\n\n" +
          "**Паттерн Create/Response/DB:**\n\n" +
          "```python\n" +
          "class UserCreate(BaseModel):   # что принимает POST\n" +
          "    name: str\n" +
          "    email: str\n" +
          "    password: str  # принимаем пароль от клиента\n\n" +
          "class UserResponse(BaseModel): # что возвращает API\n" +
          "    id: int\n" +
          "    name: str\n" +
          "    email: str\n" +
          "    # password ЗДЕСЬ НЕТ — клиент не увидит!\n\n" +
          "class UserDB(BaseModel):       # что хранится в БД\n" +
          "    id: int\n" +
          "    name: str\n" +
          "    email: str\n" +
          "    password_hash: str  # хэш пароля\n" +
          "```\n\n" +
          "**response_model_exclude_unset=True** — исключает поля с дефолтными значениями из ответа. Полезно для PATCH: возвращай только то что реально изменилось.\n\n" +
          "**response_model_include/exclude** — включить или исключить конкретные поля:\n" +
          "```python\n" +
          "@app.get('/users/{id}', response_model=User, response_model_exclude={'password'})\n" +
          "@app.get('/users/{id}', response_model=User, response_model_include={'id', 'name'})\n" +
          "```\n\n" +
          "**Важно:** response_model фильтрует данные ПОСЛЕ того как функция вернула значение. Функция может возвращать больше полей — FastAPI срежет лишнее.",
        code:
          "from fastapi import FastAPI\n" +
          "from pydantic import BaseModel\n" +
          "from typing import Optional\n\n" +
          "class UserCreate(BaseModel):\n" +
          "    name: str\n" +
          "    email: str\n" +
          "    password: str  # принимаем пароль\n\n" +
          "class UserResponse(BaseModel):\n" +
          "    id: int\n" +
          "    name: str\n" +
          "    email: str\n" +
          "    # password здесь НЕТ — клиент не увидит!\n\n" +
          "app = FastAPI()\n\n" +
          "@app.post('/users', response_model=UserResponse, status_code=201)\n" +
          "def create_user(user: UserCreate):\n" +
          "    # Даже если вернём password — FastAPI его отфильтрует!\n" +
          "    return {\n" +
          "        'id': 1,\n" +
          "        'name': user.name,\n" +
          "        'email': user.email,\n" +
          "        'password': user.password  # будет удалено из ответа!\n" +
          "    }\n\n" +
          "print('response_model защищает данные!')\n" +
          "# Демо: создаём пользователя\n" +
          "u = UserCreate(name='Анна', email='anna@example.com', password='secret')\n" +
          "print('Создано:', create_user(u))",
        keyTakeaways: [
          "response_model= — FastAPI фильтрует ответ по этой схеме ПЕРЕД отправкой.",
          "status_code=201 — код успешного создания. По умолчанию 200.",
          "Даже если функция вернёт лишние поля — response_model их срежет.",
        ],
        pitfalls: [
          "response_model фильтрует только при отправке через HTTP. При прямом вызове функции (в тестах) фильтрации нет.",
          "Если функция возвращает меньше полей чем в response_model — FastAPI вернёт 500! Убедись что возвращаешь все обязательные поля.",
        ],
      },
      {
        heading: "Статус-коды и JSONResponse",
        tagline: "Правильные HTTP-коды делают API понятным для клиентов",
        body:
          "**Стандартные коды для REST API:**\n\n" +
          "| Код | Имя | Когда использовать |\n" +
          "|---|---|---|\n" +
          "| 200 | OK | GET успешен, PUT/PATCH обновлены |\n" +
          "| 201 | Created | POST создал ресурс |\n" +
          "| 204 | No Content | DELETE успешен (нет тела в ответе!) |\n" +
          "| 400 | Bad Request | Некорректный запрос |\n" +
          "| 401 | Unauthorized | Не аутентифицирован |\n" +
          "| 403 | Forbidden | Нет прав |\n" +
          "| 404 | Not Found | Ресурс не найден |\n" +
          "| 422 | Unprocessable | Ошибка валидации (FastAPI авто) |\n" +
          "| 500 | Server Error | Ошибка сервера |\n\n" +
          "**Модуль status — именованные константы:**\n" +
          "```python\n" +
          "from fastapi import status\n\n" +
          "status.HTTP_200_OK          # 200\n" +
          "status.HTTP_201_CREATED     # 201\n" +
          "status.HTTP_204_NO_CONTENT  # 204\n" +
          "status.HTTP_404_NOT_FOUND   # 404\n" +
          "# ... и многие другие\n" +
          "```\n\n" +
          "**JSONResponse — полный контроль:**\n" +
          "```python\n" +
          "from fastapi.responses import JSONResponse\n\n" +
          "@app.get('/custom')\n" +
          "def custom():\n" +
          "    return JSONResponse(\n" +
          "        content={'key': 'value'},  # Python dict → JSON\n" +
          "        status_code=200,\n" +
          "        headers={'X-Custom': 'value', 'Cache-Control': 'no-cache'}\n" +
          "    )\n" +
          "```\n\n" +
          "**Response для 204 (без тела):**\n" +
          "```python\n" +
          "from fastapi.responses import Response\n\n" +
          "@app.delete('/items/{id}', status_code=204)\n" +
          "def delete(id: int):\n" +
          "    # удаляем...\n" +
          "    return Response(status_code=204)  # пустой ответ!\n" +
          "```\n\n" +
          "**RedirectResponse:**\n" +
          "```python\n" +
          "from fastapi.responses import RedirectResponse\n\n" +
          "@app.get('/old-url')\n" +
          "def old_url():\n" +
          "    return RedirectResponse(url='/new-url', status_code=301)  # постоянный редирект\n" +
          "```",
        code:
          "from fastapi import FastAPI, status\n" +
          "from fastapi.responses import JSONResponse, Response\n" +
          "from pydantic import BaseModel\n\n" +
          "app = FastAPI()\n\n" +
          "class Item(BaseModel):\n" +
          "    name: str\n" +
          "    price: float\n\n" +
          "items_db = {}\n" +
          "next_id = 1\n\n" +
          "@app.post('/items', status_code=status.HTTP_201_CREATED)\n" +
          "def create(item: Item):\n" +
          "    global next_id\n" +
          "    items_db[next_id] = item\n" +
          "    result = {'id': next_id, **item.model_dump()}\n" +
          "    next_id += 1\n" +
          "    return result\n\n" +
          "@app.delete('/items/{item_id}', status_code=status.HTTP_204_NO_CONTENT)\n" +
          "def delete(item_id: int):\n" +
          "    items_db.pop(item_id, None)\n" +
          "    return Response(status_code=204)  # 204 — нет тела!\n\n" +
          "@app.get('/custom')\n" +
          "def custom():\n" +
          "    return JSONResponse(\n" +
          "        content={'message': 'ok'},\n" +
          "        headers={'X-Custom': 'value'}\n" +
          "    )\n\n" +
          "print('Коды:', status.HTTP_200_OK, status.HTTP_201_CREATED, status.HTTP_204_NO_CONTENT)",
        keyTakeaways: [
          "status.HTTP_201_CREATED лучше магического числа 201 — читабельно и безопасно от опечаток.",
          "DELETE с 204 не должен возвращать тело — только Response(status_code=204).",
          "JSONResponse — когда нужен полный контроль: заголовки, Content-Type, код.",
        ],
        pitfalls: [
          "status_code=204 в декораторе И return dict — FastAPI выдаст ошибку. При 204 нет тела, нужен return Response(status_code=204).",
          "response_model и JSONResponse несовместимы — FastAPI не фильтрует JSONResponse через response_model.",
        ],
      },
      {
        heading: "🚀 Мастер-гид: response_model, статус-коды и JSONResponse (Round 4)",
        tagline: "Полный разбор управления ответами FastAPI — что возвращать, как фильтровать, когда использовать JSONResponse",
        body:
          "## response_model — ключевой инструмент безопасности API\n\n" +
          "response_model делает три вещи:\n" +
          "1. **Фильтрует** лишние поля из ответа (пароли, внутренние данные)\n" +
          "2. **Документирует** структуру ответа в Swagger\n" +
          "3. **Валидирует** что ответ сервера соответствует схеме\n\n" +
          "```python\n" +
          "from fastapi import FastAPI\n" +
          "from pydantic import BaseModel\n\n" +
          "app = FastAPI()\n\n" +
          "class UserInDB(BaseModel):\n" +
          "    id: int\n" +
          "    name: str\n" +
          "    email: str\n" +
          "    password_hash: str   # ← это НИКОГДА не должно уйти клиенту!\n" +
          "    internal_notes: str  # ← и это тоже\n\n" +
          "class UserPublic(BaseModel):\n" +
          "    id: int\n" +
          "    name: str\n" +
          "    email: str\n" +
          "    # password_hash и internal_notes — НЕТ!\n\n" +
          "# Без response_model — клиент видит всё включая пароль:\n" +
          "@app.get('/users-unsafe/{user_id}')\n" +
          "def get_user_unsafe(user_id: int):\n" +
          "    return {'id': user_id, 'name': 'Alex', 'email': 'a@b.com', 'password_hash': 'SECRET!', 'internal_notes': 'VIP'}\n\n" +
          "# С response_model=UserPublic — FastAPI фильтрует лишние поля автоматически:\n" +
          "@app.get('/users/{user_id}', response_model=UserPublic)\n" +
          "def get_user(user_id: int):\n" +
          "    return {'id': user_id, 'name': 'Alex', 'email': 'a@b.com', 'password_hash': 'FILTERED!', 'internal_notes': 'HIDDEN'}\n" +
          "    # password_hash и internal_notes будут удалены из ответа!\n\n" +
          "print('Небезопасно:', get_user_unsafe(1))\n" +
          "print('Безопасно (модель фильтрует):', UserPublic(**get_user(1)).model_dump())\n" +
          "```\n\n" +
          "## response_model_exclude_unset — не возвращать поля с дефолтами\n\n" +
          "```python\n" +
          "from fastapi import FastAPI\n" +
          "from pydantic import BaseModel\n" +
          "from typing import Optional\n\n" +
          "app = FastAPI()\n\n" +
          "class UserUpdate(BaseModel):\n" +
          "    name: Optional[str] = None\n" +
          "    email: Optional[str] = None\n" +
          "    bio: Optional[str] = None\n\n" +
          "@app.patch('/users/{user_id}', response_model=UserUpdate, response_model_exclude_unset=True)\n" +
          "def update_user(user_id: int, user: UserUpdate):\n" +
          "    # Возвращаем только то, что клиент прислал\n" +
          "    return user\n\n" +
          "# Клиент прислал только name — ответ содержит только name:\n" +
          "upd = UserUpdate(name='Новое имя')\n" +
          "print('Установленные поля:', upd.model_dump(exclude_unset=True))\n" +
          "```\n\n" +
          "## Статус-коды — полная картина\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, status\n" +
          "from fastapi.responses import Response\n\n" +
          "app = FastAPI()\n\n" +
          "# POST → 201 Created (созданный ресурс)\n" +
          "@app.post('/items', status_code=201)  # или status_code=status.HTTP_201_CREATED\n" +
          "def create_item():\n" +
          "    return {'id': 1, 'created': True}\n\n" +
          "# DELETE → 204 No Content (нет тела в ответе!)\n" +
          "@app.delete('/items/{item_id}', status_code=204)\n" +
          "def delete_item(item_id: int):\n" +
          "    return None  # или ничего не возвращать\n\n" +
          "# Динамический статус-код через Response:\n" +
          "@app.get('/items/{item_id}')\n" +
          "def get_item(item_id: int, response: Response):\n" +
          "    if item_id == 0:\n" +
          "        response.status_code = 404\n" +
          "        return {'detail': 'not found'}\n" +
          "    return {'id': item_id}\n\n" +
          "print('POST:', create_item())\n" +
          "print('DELETE:', delete_item(1))\n" +
          "```\n\n" +
          "## JSONResponse — когда нужен полный контроль\n\n" +
          "```python\n" +
          "from fastapi import FastAPI\n" +
          "from fastapi.responses import JSONResponse\n" +
          "import json\n\n" +
          "app = FastAPI()\n\n" +
          "# JSONResponse — когда нужны особые заголовки или статус-код в логике:\n" +
          "@app.post('/login')\n" +
          "def login(username: str, password: str):\n" +
          "    if username == 'admin' and password == 'secret':\n" +
          "        return JSONResponse(\n" +
          "            content={'token': 'abc123', 'user': username},\n" +
          "            status_code=200,\n" +
          "            headers={'X-Token': 'abc123'},  # дополнительный заголовок\n" +
          "        )\n" +
          "    return JSONResponse(\n" +
          "        content={'detail': 'Неверные данные'},\n" +
          "        status_code=401,\n" +
          "    )\n\n" +
          "# Тест:\n" +
          "resp = login('admin', 'secret')\n" +
          "print('Логин:', json.loads(resp.body))\n" +
          "resp2 = login('user', 'wrong')\n" +
          "print('Неудача:', resp2.status_code, json.loads(resp2.body))\n" +
          "```\n\n" +
          "## Как подходить к упражнениям раунда 4\n\n" +
          "**response_model упражнения:**\n" +
          "- response_model= ВСЕГДА в декораторе, не в функции\n" +
          "- Паттерн: `@app.get('/path', response_model=MySchema)`\n" +
          "- Если нужно исключить поля — либо создай отдельную схему, либо `response_model_exclude={'field'}`\n\n" +
          "**status_code упражнения:**\n" +
          "- POST создаёт → 201\n" +
          "- DELETE удаляет → 204\n" +
          "- GET читает → 200 (дефолт)\n" +
          "- PUT/PATCH обновляет → 200\n\n" +
          "**Частые ошибки:**\n" +
          "```python\n" +
          "# ❌ response_model в функции (не работает):\n" +
          "def get_user() -> UserPublic:  # это type hint, не response_model FastAPI\n" +
          "    ...\n\n" +
          "# ✅ response_model в декораторе:\n" +
          "@app.get('/users/{id}', response_model=UserPublic)\n" +
          "def get_user(id: int):\n" +
          "    ...\n\n" +
          "# ❌ return dict при status_code=204:\n" +
          "@app.delete('/items/{id}', status_code=204)\n" +
          "def delete(id: int): return {'deleted': True}  # ошибка! 204 = нет тела\n\n" +
          "# ✅ return None или ничего при 204:\n" +
          "@app.delete('/items/{id}', status_code=204)\n" +
          "def delete(id: int): return None\n" +
          "```",
        code:
          "from fastapi import FastAPI, status\n" +
          "from fastapi.responses import JSONResponse\n" +
          "from pydantic import BaseModel\n" +
          "from typing import Optional\n" +
          "import json\n\n" +
          "app = FastAPI()\n\n" +
          "# ── Схемы ──\n" +
          "class PostCreate(BaseModel):\n" +
          "    title: str\n" +
          "    body: str\n" +
          "    secret_draft_key: str  # внутреннее поле!\n\n" +
          "class PostResponse(BaseModel):\n" +
          "    id: int\n" +
          "    title: str\n" +
          "    body: str\n" +
          "    # secret_draft_key НЕТ — безопасность!\n\n" +
          "class PostPartialUpdate(BaseModel):\n" +
          "    title: Optional[str] = None\n" +
          "    body: Optional[str] = None\n\n" +
          "posts_db = {}\n\n" +
          "# POST → 201 + response_model фильтрует secret_draft_key\n" +
          "@app.post('/posts', response_model=PostResponse, status_code=201)\n" +
          "def create_post(post: PostCreate):\n" +
          "    pid = len(posts_db) + 1\n" +
          "    posts_db[pid] = {'id': pid, 'title': post.title, 'body': post.body}\n" +
          "    return posts_db[pid]\n\n" +
          "# PATCH → 200, возвращаем только изменённые поля\n" +
          "@app.patch('/posts/{pid}', response_model=PostPartialUpdate, response_model_exclude_unset=True)\n" +
          "def patch_post(pid: int, data: PostPartialUpdate):\n" +
          "    return data\n\n" +
          "# DELETE → 204 (нет тела)\n" +
          "@app.delete('/posts/{pid}', status_code=204)\n" +
          "def delete_post(pid: int):\n" +
          "    return None\n\n" +
          "# JSONResponse с заголовками:\n" +
          "@app.get('/posts/{pid}')\n" +
          "def get_post(pid: int):\n" +
          "    if pid not in posts_db:\n" +
          "        return JSONResponse({'detail': 'Not found'}, status_code=404)\n" +
          "    return JSONResponse(posts_db[pid], headers={'X-Post-Id': str(pid)})\n\n" +
          "# Тест:\n" +
          "p = create_post(PostCreate(title='Hello', body='World', secret_draft_key='KEY!'))\n" +
          "print('Создан (без secret_key):', p)\n" +
          "resp = get_post(1)\n" +
          "print('Пост:', json.loads(resp.body))",
        keyTakeaways: [
          "response_model= в декораторе — не в функции. Это ключевой инструмент безопасности.",
          "POST → 201, DELETE → 204 (без тела), GET/PUT → 200. Используй правильные статус-коды.",
          "response_model_exclude_unset=True — возвращает только поля, которые реально установил клиент.",
          "JSONResponse — когда нужны кастомные заголовки или динамический статус-код прямо в логике.",
          "status.HTTP_201_CREATED == 201 — используй константы из fastapi.status для читаемости кода.",
        ],
        pitfalls: [
          "status_code=204 + return dict = ошибка. При 204 нет тела — return None или ничего не возвращай.",
          "response_model не работает с JSONResponse — FastAPI не фильтрует JSONResponse через схему.",
          "response_model= это СХЕМА ОТВЕТА, не схема входных данных. Для входных — параметр функции.",
        ],
        analogy: "response_model — как пропускная система на выходе из склада. Даже если внутри склада есть секретные документы, на выход пропускают только то, что разрешено (UserPublic). JSONResponse — как VIP-пропуск: полный контроль над тем что выйдет и какими маршрутами.",
      },
      {
        heading: "Примеры и пояснения",
        body:
          "### Упражнение 1: «response_model и status_code»\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, status  # {{0}} = status\n\n" +
          "@app.post('/users',\n" +
          "          response_model=UserOut,     # {{1}} = response_model\n" +
          "          status_code=               # {{2}} = status_code\n" +
          "              201)                   # {{3}} = 201\n\n" +
          "@app.get('/users/{uid}',\n" +
          "         response_model=UserOut)     # {{4}} = UserOut\n\n" +
          "@app.delete('/users/{uid}',\n" +
          "            status_code=204)         # {{5}} = 204\n" +
          "    return Response(status_code=204) # {{6}} = 204\n" +
          "```\n\n" +
          "---\n\n" +
          "### Упражнение 2: «JSONResponse и кастомные заголовки»\n\n" +
          "```python\n" +
          "from fastapi.responses import JSONResponse, Response  # {{0}}=JSONResponse, {{1}}=Response\n\n" +
          "@app.get('/data')\n" +
          "def get_data():\n" +
          "    return JSONResponse(    # {{2}} = JSONResponse\n" +
          "        content={...},\n" +
          "        headers={...}\n" +
          "    )\n\n" +
          "@app.delete('/resource')\n" +
          "def delete():\n" +
          "    return Response(status_code=204)  # {{3}} = Response\n\n" +
          "RedirectResponse(url='/data', status_code=302)  # {{4}} = 302\n" +
          "```\n\n" +
          "---\n\n" +
          "### Упражнение 3: «Разные схемы ввода и вывода»\n\n" +
          "```python\n" +
          "class UserCreate(BaseModel):\n" +
          "    password: str        # {{0}} = str\n\n" +
          "class UserUpdate(BaseModel):\n" +
          "    username: Optional[str] = None  # {{1}} = None\n\n" +
          "class UserResponse(BaseModel):\n" +
          "    id: int              # {{2}} = int\n\n" +
          "@app.post('/users', response_model=UserResponse)  # {{3}} = UserResponse\n" +
          "@app.patch('/users/{uid}', response_model=UserResponse)  # {{4}} = UserResponse\n" +
          "def update(uid: int, update: UserUpdate): ...  # {{5}} = UserUpdate\n" +
          "```\n\n" +
          "---\n\n" +
          "### Модели ответов и HTTP-коды\n\n" +
          "**response_model — схема и фильтр одновременно.** Параметр `response_model` у декоратора маршрута делает две вещи: генерирует документацию в Swagger (показывает какие поля возвращает эндпоинт) и фильтрует ответ — удаляет поля, которых нет в схеме. Это важно для безопасности: если внутренний объект содержит поле `password_hash`, а в `response_model` его нет — оно не попадёт в ответ. Без `response_model` FastAPI вернёт всё что вернула функция.\n\n" +
          "**HTTP 204 — успех без тела.** Для операций DELETE (и иногда PUT) принято возвращать статус 204 No Content: запрос выполнен успешно, но тела ответа нет. В FastAPI это делается через `status_code=204` и `return Response(status_code=204)`. Возвращать 200 с пустым телом технически работает, но нарушает REST-конвенцию. Клиенты (браузер, frontend) интерпретируют 204 как сигнал: готово, тела нет.\\n\\n" +
          "---\n\n" +
          "### Практика: Полный CRUD с правильными ответами\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, HTTPException, status\n" +
          "from fastapi.responses import Response\n" +
          "from pydantic import BaseModel\n" +
          "from typing import List, Optional\n\n" +
          "class BookCreate(BaseModel):\n" +
          "    title: str\n" +
          "    author: str\n" +
          "    year: int\n\n" +
          "class BookResponse(BaseModel):\n" +
          "    id: int\n" +
          "    title: str\n" +
          "    author: str\n" +
          "    year: int\n\n" +
          "class BookUpdate(BaseModel):\n" +
          "    title: Optional[str] = None\n" +
          "    author: Optional[str] = None\n\n" +
          "app = FastAPI()\n" +
          "books: dict[int, dict] = {}\n" +
          "next_id = 1\n\n" +
          "@app.get('/books', response_model=List[BookResponse])\n" +
          "def list_books(): return list(books.values())\n\n" +
          "@app.post('/books', response_model=BookResponse, status_code=201)\n" +
          "def create_book(book: BookCreate):\n" +
          "    global next_id\n" +
          "    b = {'id': next_id, **book.model_dump()}\n" +
          "    books[next_id] = b; next_id += 1\n" +
          "    return b\n\n" +
          "@app.get('/books/{book_id}', response_model=BookResponse)\n" +
          "def get_book(book_id: int):\n" +
          "    if book_id not in books:\n" +
          "        raise HTTPException(404, 'Not found')\n" +
          "    return books[book_id]\n\n" +
          "@app.patch('/books/{book_id}', response_model=BookResponse)\n" +
          "def update_book(book_id: int, update: BookUpdate):\n" +
          "    if book_id not in books:\n" +
          "        raise HTTPException(404)\n" +
          "    b = books[book_id]\n" +
          "    if update.title: b['title'] = update.title\n" +
          "    if update.author: b['author'] = update.author\n" +
          "    return b\n\n" +
          "@app.delete('/books/{book_id}', status_code=204)\n" +
          "def delete_book(book_id: int):\n" +
          "    books.pop(book_id, None)\n" +
          "    return Response(status_code=204)\n" +
          "```",
      },
    ],
    cheatSheet: [
      "`@app.post('/items', response_model=ItemOut, status_code=201)` — модель ответа и код.",
      "`from fastapi import status; status.HTTP_201_CREATED` — именованные коды.",
      "`return Response(status_code=204)` — пустой ответ для DELETE.",
      "`return JSONResponse(content={...}, headers={...})` — полный контроль.",
      "`response_model_exclude_unset=True` — убрать поля с дефолтами из ответа.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fa4-f1",
      title: "response_model и status_code",
      description: "Настрой ответы с правильными моделями и статус-кодами.",
      code:
        "from fastapi import FastAPI, {{0}}\n" +
        "from pydantic import BaseModel\n\n" +
        "class UserCreate(BaseModel):\n" +
        "    name: str\n" +
        "    password: str\n\n" +
        "class UserOut(BaseModel):\n" +
        "    id: int\n" +
        "    name: str\n\n" +
        "app = FastAPI()\n\n" +
        "@app.post('/users',\n" +
        "          {{1}}=UserOut,\n" +
        "          {{2}}=status.HTTP_201_CREATED)\n" +
        "def create_user(user: UserCreate):\n" +
        "    return {'id': 42, 'name': user.name, 'password': user.password}\n\n" +
        "@app.get('/users/{uid}', response_model={{4}})\n" +
        "def get_user(uid: int):\n" +
        "    return {'id': uid, 'name': 'Анна'}\n\n" +
        "@app.delete('/users/{uid}', status_code={{5}})\n" +
        "def delete_user(uid: int):\n" +
        "    from fastapi.responses import Response\n" +
        "    return Response(status_code={{6}})",
      answers: [
        ["status"],
        ["response_model"],
        ["status_code"],
        ["201"],
        ["UserOut"],
        ["204"],
        ["204"],
      ],
      hints: [
        "Модуль с именованными HTTP-кодами.",
        "Параметр декоратора для ограничения формы ответа.",
        "Параметр для HTTP-кода успешного ответа.",
        "Код создания ресурса.",
        "Имя модели ответа.",
        "Код пустого успешного ответа.",
        "Тот же код в Response объекте.",
      ],
    },
    {
      type: "fill",
      id: "fa4-f2",
      title: "JSONResponse и кастомные заголовки",
      description: "Используй JSONResponse для полного контроля над ответом.",
      code:
        "from fastapi import FastAPI\n" +
        "from fastapi.responses import {{0}}, {{1}}\n" +
        "import json\n\n" +
        "app = FastAPI()\n\n" +
        "@app.get('/data')\n" +
        "def get_data():\n" +
        "    return {{2}}(\n" +
        "        content={'key': 'value', 'count': 42},\n" +
        "        status_code=200,\n" +
        "        headers={'X-Api-Version': '1.0', 'Cache-Control': 'no-cache'}\n" +
        "    )\n\n" +
        "@app.delete('/resource')\n" +
        "def delete_resource():\n" +
        "    return {{3}}(status_code=204)\n\n" +
        "@app.get('/redirect')\n" +
        "def redirect():\n" +
        "    from fastapi.responses import RedirectResponse\n" +
        "    return RedirectResponse(url='/data', status_code={{4}})\n\n" +
        "print('JSONResponse и Response импортированы')",
      answers: [
        ["JSONResponse"],
        ["Response"],
        ["JSONResponse"],
        ["Response"],
        ["302"],
      ],
      hints: [
        "Класс для JSON-ответа с контролем заголовков.",
        "Базовый класс ответа без тела (для 204).",
        "Используй его для JSON с заголовками.",
        "Пустой ответ без тела.",
        "HTTP-код временного редиректа.",
      ],
    },
    {
      type: "fill",
      id: "fa4-f3",
      title: "Разные схемы ввода и вывода",
      description: "Паттерн Create/Response/DB для разделения схем.",
      code:
        "from fastapi import FastAPI\n" +
        "from pydantic import BaseModel\n" +
        "from typing import Optional\n\n" +
        "class UserCreate(BaseModel):\n" +
        "    username: str\n" +
        "    email: str\n" +
        "    password: {{0}}\n\n" +
        "class UserUpdate(BaseModel):\n" +
        "    username: Optional[str] = {{1}}\n" +
        "    email: Optional[str] = None\n\n" +
        "class UserResponse(BaseModel):\n" +
        "    id: {{2}}\n" +
        "    username: str\n" +
        "    email: str\n\n" +
        "app = FastAPI()\n\n" +
        "@app.post('/users', response_model={{3}}, status_code=201)\n" +
        "def create(user: UserCreate):\n" +
        "    return {'id': 1, 'username': user.username, 'email': user.email}\n\n" +
        "@app.patch('/users/{uid}', response_model={{4}})\n" +
        "def update(uid: int, update: {{5}}):\n" +
        "    return {'id': uid, 'username': update.username or 'unchanged', 'email': update.email or 'unchanged'}",
      answers: [
        ["str"],
        ["None"],
        ["int"],
        ["UserResponse"],
        ["UserResponse"],
        ["UserUpdate"],
      ],
      hints: [
        "Тип пароля — обычная строка.",
        "Default для необязательного поля.",
        "Тип числового ID.",
        "Модель ответа при создании.",
        "Та же модель ответа для PATCH.",
        "Схема частичного обновления.",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "fa4-q1",
      title: "Зачем нужен response_model?",
      question:
        "response_model в FastAPI используется для: 1) фильтрации полей в ответе, 2) ___ документации в Swagger. Введи слово для пункта 2.",
      answers: [
        "генерации", "автоматической генерации", "генерирования", "создания",
        "формирования", "документирования", "генерации схемы", "создания схемы",
        "автогенерации", "построения",
      ],
      hint: "FastAPI смотрит на response_model и создаёт схему ответа в OpenAPI автоматически.",
      explanation:
        "response_model даёт FastAPI две вещи:\n1. **Фильтрация** — срезает лишние поля (например, password) из ответа\n2. **Документация** — генерирует схему ответа в Swagger UI / OpenAPI.json\n\nКлиенты могут использовать эту схему для генерации кода (TypeScript типы, Python клиент и т.д.).",
    },
    {
      type: "question",
      id: "fa4-q2",
      title: "Какой код для DELETE без тела?",
      question:
        "Маршрут DELETE успешно удалил ресурс. Какой HTTP-статус нужно вернуть, если тело ответа пустое?",
      answers: [
        "204", "204 no content", "no content", "http 204", "статус 204",
        "204 No Content", "код 204", "двести четыре",
      ],
      hint: "No Content — нет содержимого. Не 200, не 201.",
      explanation:
        "204 No Content — стандарт для DELETE (и иногда PUT/PATCH). Означает 'успешно, но возвращать нечего'. FastAPI при 204 не сериализует тело. Важно: return Response(status_code=204), а не dict — иначе FastAPI попытается сериализовать None.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fa4-w1",
      title: "Полный CRUD с правильными ответами",
      task:
        "Создай CRUD API с правильными response_model и статус-кодами.\n\n" +
        "━━━ Модели ━━━\n\n" +
        "class BookCreate(BaseModel): title: str, author: str, year: int\n" +
        "class BookResponse(BaseModel): id: int, title: str, author: str, year: int\n" +
        "class BookUpdate(BaseModel): title: Optional[str] = None, author: Optional[str] = None\n\n" +
        "━━━ Маршруты ━━━\n\n" +
        "GET /books → список (response_model=List[BookResponse])\n" +
        "POST /books → создать (response_model=BookResponse, status_code=201)\n" +
        "GET /books/{book_id} → один (response_model=BookResponse, или 404)\n" +
        "PATCH /books/{book_id} → обновить частично (response_model=BookResponse)\n" +
        "DELETE /books/{book_id} → удалить (status_code=204, Response без тела)\n\n" +
        "Храни книги в словаре `books = {}`. Запусти и проверь синтаксис!",
      hints: [
        "from fastapi import FastAPI, HTTPException, status; from fastapi.responses import Response",
        "books: dict[int, dict] = {}; next_id = 1",
        "@app.post('/books', response_model=BookResponse, status_code=201)",
        "if book_id not in books: raise HTTPException(404, 'Not found')",
        "@app.delete('/books/{book_id}', status_code=204) ... return Response(status_code=204)",
      ],
      required: [
        "BookCreate",
        "BookResponse",
        "BookUpdate",
        "response_model=",
        "status_code=201",
        "status_code=204",
        "HTTPException",
        "Response(",
        "books",
        "@app.patch",
        "@app.delete",
      ],
      minLines: 48,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 5 · Роутеры (APIRouter) — модульная архитектура
// ─────────────────────────────────────────────────────────────────────────────
const fa5: Round = {
  number: 5,
  title: "FastAPI · APIRouter — модульная архитектура",
  level: "Средний",
  intro:
    "Когда проект растёт, держать все маршруты в main.py становится неудобно. APIRouter позволяет разбить приложение на модули — как Blueprints в Flask.\n\n**В этом раунде:**\n• APIRouter — создание и подключение\n• prefix и tags на уровне роутера\n• Файловая структура FastAPI-проекта\n• include_router в main.py\n• Зависимости на уровне роутера",
  lesson: {
    title: "APIRouter — масштабируй FastAPI без хаоса",
    summary:
      "APIRouter разбивает приложение на логические модули. Подключается через app.include_router() с prefix и tags.",
    readingMinutes: 12,
    sections: [
      {
        heading: "APIRouter — как Blueprint во Flask",
        tagline: "Один роутер = один модуль (users, products, auth, ...)",
        body:
          "**Проблема без роутеров:**\n" +
          "Когда в main.py 50+ маршрутов — код нечитаем, команде сложно работать параллельно, тестировать сложно.\n\n" +
          "**Решение — APIRouter:**\n" +
          "Разбить маршруты на логические файлы. Каждый файл — свой роутер.\n\n" +
          "**Структура проекта с роутерами:**\n\n" +
          "```\n" +
          "myapi/\n" +
          "├── main.py              ← FastAPI(), include_router()\n" +
          "├── routers/\n" +
          "│   ├── __init__.py\n" +
          "│   ├── users.py         ← router = APIRouter(prefix='/users')\n" +
          "│   ├── products.py      ← router = APIRouter(prefix='/products')\n" +
          "│   └── auth.py          ← router = APIRouter(prefix='/auth')\n" +
          "├── models.py            ← Pydantic-схемы\n" +
          "├── database.py          ← SQLAlchemy\n" +
          "└── dependencies.py      ← общие Depends\n" +
          "```\n\n" +
          "**Как работает prefix:**\n" +
          "```\n" +
          "APIRouter(prefix='/users')  ← префикс\n" +
          "  + @router.get('/')        ← путь\n" +
          "  = GET /users/             ← итоговый маршрут\n\n" +
          "  + @router.get('/{id}')    ← путь\n" +
          "  = GET /users/{id}         ← итоговый маршрут\n\n" +
          "  + @router.post('/')       ← путь\n" +
          "  = POST /users/            ← итоговый маршрут\n" +
          "```\n\n" +
          "**В main.py — только подключение:**\n" +
          "```python\n" +
          "# main.py\n" +
          "from fastapi import FastAPI\n" +
          "from routers import users, products, auth\n\n" +
          "app = FastAPI()\n" +
          "app.include_router(users.router)\n" +
          "app.include_router(products.router)\n" +
          "app.include_router(auth.router, prefix='/auth', tags=['Auth'])\n" +
          "# prefix и tags можно переопределить при include_router!\n" +
          "```\n\n" +
          "**Аналог Flask:**\n" +
          "- Flask: `bp = Blueprint('users', __name__, url_prefix='/users')` → `app.register_blueprint(bp)`\n" +
          "- FastAPI: `router = APIRouter(prefix='/users')` → `app.include_router(router)`",
        code:
          "from fastapi import APIRouter, HTTPException, FastAPI\n" +
          "from pydantic import BaseModel\n\n" +
          "# === routers/users.py (имитируем в одном файле) ===\n" +
          "router = APIRouter(\n" +
          "    prefix='/users',    # все маршруты: /users/...\n" +
          "    tags=['Users'],     # группа в Swagger\n" +
          ")\n\n" +
          "class User(BaseModel):\n" +
          "    id: int\n" +
          "    name: str\n\n" +
          "users_db = {1: User(id=1, name='Анна'), 2: User(id=2, name='Иван')}\n\n" +
          "@router.get('/')      # → GET /users/\n" +
          "def list_users():\n" +
          "    return list(users_db.values())\n\n" +
          "@router.get('/{user_id}')  # → GET /users/42\n" +
          "def get_user(user_id: int):\n" +
          "    if user_id not in users_db:\n" +
          "        raise HTTPException(404, 'Not found')\n" +
          "    return users_db[user_id]\n\n" +
          "# === main.py ===\n" +
          "app = FastAPI(title='My API')\n" +
          "app.include_router(router)\n\n" +
          "# Список всех маршрутов:\n" +
          "routes = [r.path for r in app.routes if hasattr(r, 'path') and not r.path.startswith('/openapi')]\n" +
          "print('Маршруты:', routes)",
        keyTakeaways: [
          "prefix='/users' → все маршруты роутера начинаются с /users.",
          "@router.get('/') регистрирует GET /users/ (prefix + path).",
          "app.include_router(router) подключает все маршруты роутера в приложение.",
        ],
        pitfalls: [
          "prefix='/users/' (с финальным /) + path='/' → '/users//' (двойной слэш). Убери финальный / из prefix.",
          "@router.get (не @app.get) — важно! Иначе маршрут попадёт в app без prefix.",
        ],
      },
      {
        heading: "Зависимости на уровне роутера",
        tagline: "dependencies=[Depends(fn)] — одна зависимость для всего роутера",
        body:
          "Если нужно проверять авторизацию для ВСЕХ маршрутов роутера — не пиши `Depends` в каждой функции. Передай зависимости в конструктор роутера.\n\n" +
          "**Три способа задать зависимости:**\n\n" +
          "1. **На конкретном маршруте** (минимальный охват):\n" +
          "```python\n" +
          "@router.get('/secret', dependencies=[Depends(auth)])\n" +
          "def secret(): ...\n" +
          "```\n\n" +
          "2. **На роутере** (для всех маршрутов этого роутера):\n" +
          "```python\n" +
          "router = APIRouter(\n" +
          "    prefix='/admin',\n" +
          "    dependencies=[Depends(require_admin)]\n" +
          ")\n" +
          "```\n\n" +
          "3. **При include_router** (добавляется к уже существующим):\n" +
          "```python\n" +
          "app.include_router(\n" +
          "    admin_router,\n" +
          "    dependencies=[Depends(check_maintenance_mode)]\n" +
          ")\n" +
          "```\n\n" +
          "**Важно:** зависимости складываются! Маршрут может иметь зависимости с трёх уровней одновременно.\n\n" +
          "**Когда использовать каждый уровень:**\n" +
          "- Маршрут: уникальная зависимость только для одного endpoint\n" +
          "- Роутер: авторизация для целого модуля (например, весь /admin)\n" +
          "- include_router: глобальные зависимости (rate limiting, maintenance mode)",
        code:
          "from fastapi import FastAPI, APIRouter, Depends, HTTPException\n\n" +
          "app = FastAPI()\n\n" +
          "# Зависимость-авторизация\n" +
          "def api_key_check(x_api_key: str = None):\n" +
          "    if x_api_key != 'secret-key':\n" +
          "        raise HTTPException(401, 'Неверный API ключ')\n\n" +
          "# Публичные маршруты (без зависимостей)\n" +
          "public = APIRouter(tags=['Public'])\n\n" +
          "@public.get('/status')\n" +
          "def status(): return {'ok': True}\n\n" +
          "# Защищённые маршруты (с зависимостью для всего роутера)\n" +
          "private = APIRouter(\n" +
          "    prefix='/api',\n" +
          "    tags=['Private'],\n" +
          "    dependencies=[Depends(api_key_check)]  # для всех!\n" +
          ")\n\n" +
          "@private.get('/data')\n" +
          "def data(): return {'secret': 'data'}\n\n" +
          "@private.get('/users')\n" +
          "def users(): return []\n\n" +
          "app.include_router(public)\n" +
          "app.include_router(private)\n\n" +
          "print('Роутеров:', 2, '| Маршрутов:', len([r for r in app.routes if hasattr(r, 'path')]))",
        keyTakeaways: [
          "dependencies=[Depends(fn)] в APIRouter — для всего роутера разом.",
          "Зависимость на роутере вызывается для каждого запроса, но объявлена один раз.",
          "include_router(router, dependencies=[...]) — добавить зависимость при подключении.",
        ],
        pitfalls: [
          "dependencies=[Depends(fn)] — Depends В списке, а не Depends как значение по умолчанию.",
          "Зависимость на роутере выполняется даже если маршрут не использует её результат.",
        ],
      },
      {
        heading: "🚀 Мастер-гид: APIRouter и модульная структура (Round 5)",
        tagline: "Как организовать большой FastAPI-проект через роутеры, prefix, tags и dependencies",
        body:
          "## Почему APIRouter необходим в реальных проектах\n\n" +
          "Когда проект вырастает до 10+ маршрутов, держать всё в main.py — плохая идея.\n" +
          "APIRouter — это как Blueprint во Flask: отдельный модуль с группой маршрутов.\n\n" +
          "**Структура проекта с роутерами:**\n" +
          "```\n" +
          "myapi/\n" +
          "├── main.py              ← app = FastAPI(), подключение роутеров\n" +
          "├── routers/\n" +
          "│   ├── __init__.py\n" +
          "│   ├── users.py         ← router = APIRouter(prefix='/users')\n" +
          "│   ├── products.py      ← router = APIRouter(prefix='/products')\n" +
          "│   └── orders.py        ← router = APIRouter(prefix='/orders')\n" +
          "└── models.py            ← Pydantic модели\n" +
          "```\n\n" +
          "## Как создать и подключить роутер\n\n" +
          "```python\n" +
          "# ── routers/users.py ──\n" +
          "from fastapi import APIRouter, HTTPException\n\n" +
          "router = APIRouter(\n" +
          "    prefix='/users',       # все маршруты начинаются с /users\n" +
          "    tags=['Users'],        # группа в Swagger UI\n" +
          ")\n\n" +
          "USERS = {1: {'id': 1, 'name': 'Alex'}, 2: {'id': 2, 'name': 'Maria'}}\n\n" +
          "@router.get('/')           # полный путь: GET /users/\n" +
          "def list_users():\n" +
          "    return list(USERS.values())\n\n" +
          "@router.get('/{user_id}')  # полный путь: GET /users/{user_id}\n" +
          "def get_user(user_id: int):\n" +
          "    if user_id not in USERS:\n" +
          "        raise HTTPException(404, 'User not found')\n" +
          "    return USERS[user_id]\n\n" +
          "@router.post('/')          # полный путь: POST /users/\n" +
          "def create_user(name: str):\n" +
          "    new_id = max(USERS.keys()) + 1\n" +
          "    USERS[new_id] = {'id': new_id, 'name': name}\n" +
          "    return USERS[new_id]\n\n" +
          "# ── main.py ──\n" +
          "from fastapi import FastAPI\n" +
          "# from routers import users  # в реальном проекте\n\n" +
          "app = FastAPI(title='Users API')\n\n" +
          "# Подключаем роутер к app:\n" +
          "app.include_router(router)  # router из users.py\n\n" +
          "# Для теста в браузере:\n" +
          "print('Пользователи:', list_users())\n" +
          "print('Пользователь 1:', get_user(1))\n" +
          "print('Создан:', create_user('Иван'))\n" +
          "```\n\n" +
          "## Роутер с dependencies — проверка прав для всей группы\n\n" +
          "```python\n" +
          "from fastapi import APIRouter, Depends, HTTPException\n\n" +
          "ADMIN_TOKEN = 'admin-secret'\n\n" +
          "# Зависимость-охранник для admin-маршрутов:\n" +
          "def require_admin(token: str = 'none'):\n" +
          "    if token != ADMIN_TOKEN:\n" +
          "        raise HTTPException(403, 'Требуются права администратора')\n" +
          "    return True\n\n" +
          "# Роутер с зависимостью — ВСЕ маршруты требуют admin-токен:\n" +
          "admin_router = APIRouter(\n" +
          "    prefix='/admin',\n" +
          "    tags=['Admin'],\n" +
          "    dependencies=[Depends(require_admin)],  # применяется ко ВСЕМ маршрутам!\n" +
          ")\n\n" +
          "@admin_router.get('/users')  # GET /admin/users — требует admin\n" +
          "def admin_list_users():\n" +
          "    return [{'id': 1, 'name': 'Alex'}, {'id': 2, 'name': 'Maria'}]\n\n" +
          "@admin_router.delete('/users/{uid}')  # DELETE /admin/users/{uid} — тоже требует admin\n" +
          "def admin_delete_user(uid: int):\n" +
          "    return {'deleted': uid}\n\n" +
          "app = FastAPI()\n" +
          "app.include_router(admin_router)\n\n" +
          "# Тест зависимости:\n" +
          "try:\n" +
          "    print('Без токена:', require_admin('wrong'))  # HTTPException 403\n" +
          "except Exception as e:\n" +
          "    print('Отказано:', e)\n" +
          "print('С токеном:', require_admin(ADMIN_TOKEN))\n" +
          "print('Список:', admin_list_users())\n" +
          "```\n\n" +
          "## include_router с дополнительным prefix\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, APIRouter\n\n" +
          "# Роутер без prefix:\n" +
          "v1_router = APIRouter()\n\n" +
          "@v1_router.get('/items')\n" +
          "def get_items(): return []\n\n" +
          "app = FastAPI()\n\n" +
          "# Подключаем с prefix и tags:\n" +
          "app.include_router(\n" +
          "    v1_router,\n" +
          "    prefix='/api/v1',    # добавляем к роутеру\n" +
          "    tags=['V1 API'],     # добавляем теги\n" +
          ")  # Итоговый путь: GET /api/v1/items\n\n" +
          "# Или несколько версий одного роутера:\n" +
          "app.include_router(v1_router, prefix='/api/v1')\n" +
          "# app.include_router(v2_router, prefix='/api/v2')\n\n" +
          "print('Маршруты:', [r.path for r in app.routes if hasattr(r, 'path')])\n" +
          "```\n\n" +
          "## Как подходить к упражнениям раунда 5\n\n" +
          "**Создание роутера:**\n" +
          "```python\n" +
          "from fastapi import APIRouter\n" +
          "router = APIRouter(prefix='/items', tags=['Items'])\n\n" +
          "# Маршруты роутера — @router.get(), @router.post(), etc.\n" +
          "@router.get('/') def list_items(): return []\n" +
          "@router.get('/{id}') def get_item(id: int): return {'id': id}\n" +
          "```\n\n" +
          "**Подключение к app:**\n" +
          "```python\n" +
          "app = FastAPI()\n" +
          "app.include_router(router)  # роутер с prefix='/items'\n" +
          "# Или с дополнительными параметрами:\n" +
          "app.include_router(router, prefix='/extra', tags=['Extra'])\n" +
          "```\n\n" +
          "**Частые ошибки:**\n" +
          "```python\n" +
          "# ❌ Используешь @app вместо @router:\n" +
          "router = APIRouter(prefix='/items')\n" +
          "@app.get('/items')  # НЕПРАВИЛЬНО — декоратор app, а не router!\n\n" +
          "# ✅ Правильно:\n" +
          "@router.get('/')  # декоратор router, путь без prefix (он уже в router)\n\n" +
          "# ❌ Забыл include_router:\n" +
          "router = APIRouter(prefix='/items')\n" +
          "@router.get('/') def list(): return []\n" +
          "app = FastAPI()  # БЕЗ include_router — маршруты недоступны!\n\n" +
          "# ✅ Не забудь:\n" +
          "app.include_router(router)  # подключить обязательно!\n" +
          "```",
        code:
          "from fastapi import FastAPI, APIRouter, HTTPException, Depends\n\n" +
          "# ──────────────────────────────────────────────────────────\n" +
          "# Имитируем отдельные модули (в реальном проекте — разные файлы)\n" +
          "# ──────────────────────────────────────────────────────────\n\n" +
          "# --- routers/products.py ---\n" +
          "products_router = APIRouter(prefix='/products', tags=['Products'])\n" +
          "PRODUCTS = {1: {'id': 1, 'name': 'Laptop', 'price': 999}}\n\n" +
          "@products_router.get('/')  # GET /products\n" +
          "def list_products(): return list(PRODUCTS.values())\n\n" +
          "@products_router.get('/{pid}')  # GET /products/{pid}\n" +
          "def get_product(pid: int):\n" +
          "    if pid not in PRODUCTS: raise HTTPException(404, 'Не найден')\n" +
          "    return PRODUCTS[pid]\n\n" +
          "# --- routers/users.py ---\n" +
          "users_router = APIRouter(prefix='/users', tags=['Users'])\n" +
          "USERS = {1: {'id': 1, 'name': 'Alex'}}\n\n" +
          "@users_router.get('/')  # GET /users\n" +
          "def list_users(): return list(USERS.values())\n\n" +
          "@users_router.get('/{uid}')  # GET /users/{uid}\n" +
          "def get_user(uid: int):\n" +
          "    if uid not in USERS: raise HTTPException(404, 'Не найден')\n" +
          "    return USERS[uid]\n\n" +
          "# --- main.py ---\n" +
          "app = FastAPI(title='Shop API', version='1.0')\n\n" +
          "# Подключаем оба роутера:\n" +
          "app.include_router(products_router)\n" +
          "app.include_router(users_router)\n\n" +
          "# Тест:\n" +
          "print('Продукты:', list_products())\n" +
          "print('Продукт 1:', get_product(1))\n" +
          "print('Пользователи:', list_users())\n" +
          "print('Маршруты:', [r.path for r in app.routes if hasattr(r, 'path')])",
        keyTakeaways: [
          "APIRouter(prefix='/users', tags=['Users']) — роутер с общим префиксом и тегами для всех маршрутов.",
          "@router.get('/') — НЕ @app.get('/users/'). Декоратор роутера, путь БЕЗ prefix (он уже задан).",
          "app.include_router(router) — подключить роутер к приложению. Без этого маршруты недоступны!",
          "dependencies=[Depends(fn)] в роутере — охрана для всей группы маршрутов (авторизация, логирование).",
          "include_router с prefix= и tags= переопределяет/дополняет настройки роутера при подключении.",
        ],
        pitfalls: [
          "@router.get, не @app.get — частая ошибка при работе с роутерами.",
          "Не забудь app.include_router(router) — без этого маршруты роутера не видны!",
          "dependencies=[Depends(fn)] — Depends В списке. Не путай с параметром функции-маршрута.",
        ],
        analogy: "APIRouter — как отдел в магазине (отдел электроники, отдел книг). У каждого отдела своя вывеска (prefix='/products') и своя секция в каталоге (tags=['Products']). Менеджер магазина (app.include_router) добавляет отдел в общую карту магазина. dependencies=[Depends(охрана)] — как охранник на входе в отдел VIP.",
      },
      {
        heading: "Примеры и пояснения",
        tagline: "APIRouter, prefix, tags, зависимости роутера — полные рабочие примеры",
        body:
          "### Упражнение 1: «Создание APIRouter»\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, APIRouter  # {{0}} = APIRouter\n\n" +
          "products_router = APIRouter(            # {{1}} = APIRouter\n" +
          "    prefix='/products',                 # {{2}} = products\n" +
          "    tags=['Products'],                  # {{3}} = tags\n" +
          ")\n\n" +
          "@products_router.get('/{product_id}')  # {{4}} = {product_id}\n" +
          "@products_router.post('/')              # {{5}} = post\n\n" +
          "app.include_router(products_router)     # {{6}} = include\n" +
          "```\n\n" +
          "---\n\n" +
          "### Упражнение 2: «Роутеры с разными prefix и tags»\n\n" +
          "```python\n" +
          "users = APIRouter(prefix='/users', tags=['Users'])  # {{0}} = prefix\n" +
          "@users.get('/')                         # {{1}} = get\n\n" +
          "orders = APIRouter(prefix='/orders', tags=['Orders'])  # {{2}} = tags\n" +
          "@orders.post('/')                       # {{3}} = post\n\n" +
          "app.include_router(users)               # {{4}} = users\n" +
          "app.include_router(orders)              # {{5}} = orders\n" +
          "print('Маршрутов:', len(app.routes))    # {{6}} = len\n" +
          "```\n\n" +
          "---\n\n" +
          "### Упражнение 3: «Зависимости на уровне роутера»\n\n" +
          "```python\n" +
          "def verify_token(authorization: str = None):\n" +
          "    if not authorization:\n" +
          "        raise HTTPException(401)    # {{0}} = HTTPException\n\n" +
          "protected = APIRouter(\n" +
          "    prefix='/api',\n" +
          "    dependencies=[Depends(verify_token)]  # {{1}} = dependencies, {{2}} = Depends\n" +
          ")\n\n" +
          "public = APIRouter(tags=['Public'])  # {{3}} = APIRouter\n\n" +
          "app.include_router(protected)        # {{4}} = include\n" +
          "```\n\n" +
          "---\n\n" +
          "### APIRouter и структура приложения\n\n" +
          "**app.include_router() — аналог register_blueprint() из Flask.** APIRouter позволяет разнести маршруты по модулям, как blueprints во Flask. Создаёшь `router = APIRouter(prefix=\'/users\', tags=[\'Users\'])` в отдельном файле, добавляешь маршруты через `@router.get()`, `@router.post()` и т.д., затем подключаешь в главном приложении: `app.include_router(users_router)`. Это не просто удобство — это необходимость в любом проекте больше 3-4 эндпоинтов.\n\n" +
          "**Как складывается финальный URL.** Prefix роутера и путь маршрута конкатенируются напрямую: `prefix=\'/users\'` + `@router.get(\'/{user_id}\')` → финальный URL `/users/{user_id}`. Поэтому путь в @router.get() должен начинаться с `/`, но не повторять prefix. Если ты зарегистрировал роутер с prefix и хочешь корневой маршрут роутера — пиши `@router.get(\'/')`, это даст `/users/`.",
      },
    ],
    cheatSheet: [
      "`router = APIRouter(prefix='/items', tags=['Items'])` — создать роутер.",
      "`@router.get('/') @router.post('/')` — маршруты роутера.",
      "`app.include_router(router)` — подключить в приложение.",
      "`APIRouter(dependencies=[Depends(fn)])` — зависимость для всего роутера.",
      "prefix='/items' + @router.get('/{id}') → GET /items/{id}",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fa5-f1",
      title: "Создание APIRouter",
      description: "Создай роутер и зарегистрируй его в приложении.",
      code:
        "from fastapi import FastAPI, {{0}}\n\n" +
        "products_router = {{1}}(\n" +
        "    prefix='/{{2}}',\n" +
        "    {{3}}=['Products'],\n" +
        ")\n\n" +
        "@products_router.get('/')\n" +
        "def list_products():\n" +
        "    return []\n\n" +
        "@products_router.get('/{{4}}')\n" +
        "def get_product(product_id: int):\n" +
        "    return {'id': product_id}\n\n" +
        "@products_router.{{5}}('/')\n" +
        "def create_product():\n" +
        "    return {'status': 'created'}\n\n" +
        "app = FastAPI()\n" +
        "app.{{6}}_router(products_router)",
      answers: [
        ["APIRouter"],
        ["APIRouter"],
        ["products"],
        ["tags"],
        ["{product_id}"],
        ["post"],
        ["include"],
      ],
      hints: [
        "Класс для модульных маршрутов.",
        "Создаём экземпляр роутера.",
        "Префикс URL — название ресурса.",
        "Параметр для группировки в Swagger.",
        "Path parameter в фигурных скобках.",
        "HTTP-метод для создания.",
        "Метод app для подключения роутера.",
      ],
    },
    {
      type: "fill",
      id: "fa5-f2",
      title: "Роутеры с разными prefix и tags",
      description: "Создай несколько роутеров и подключи их в приложении.",
      code:
        "from fastapi import FastAPI, APIRouter\n\n" +
        "users = APIRouter({{0}}='/users', tags=['Users'])\n" +
        "\n" +
        "@users.{{1}}('/')\n" +
        "def get_users(): return []\n\n" +
        "@users.get('/{uid}')\n" +
        "def get_user(uid: int): return {'id': uid}\n\n" +
        "orders = APIRouter(prefix='/orders', {{2}}=['Orders'])\n\n" +
        "@orders.get('/')\n" +
        "def get_orders(): return []\n\n" +
        "@orders.{{3}}('/')\n" +
        "def create_order(): return {'status': 'created'}\n\n" +
        "app = FastAPI(title='Shop API')\n" +
        "app.include_router({{4}})\n" +
        "app.include_router({{5}})\n\n" +
        "print('Маршрутов:', {{6}}(app.routes))",
      answers: [
        ["prefix"],
        ["get"],
        ["tags"],
        ["post"],
        ["users"],
        ["orders"],
        ["len"],
      ],
      hints: [
        "Параметр для URL-префикса.",
        "GET-маршрут на корень роутера.",
        "Параметр для тегов Swagger.",
        "POST-маршрут для создания.",
        "Первый роутер для подключения.",
        "Второй роутер для подключения.",
        "Встроенная функция для подсчёта элементов.",
      ],
    },
    {
      type: "fill",
      id: "fa5-f3",
      title: "Зависимости на уровне роутера",
      description: "Добавь зависимость-авторизацию на весь роутер.",
      code:
        "from fastapi import FastAPI, APIRouter, Depends, HTTPException\n\n" +
        "VALID_TOKENS = {'admin-token', 'user-token'}\n\n" +
        "def verify_token(authorization: str = None):\n" +
        "    if not authorization or authorization not in VALID_TOKENS:\n" +
        "        raise {{0}}(status_code=401, detail='Неверный токен')\n\n" +
        "protected = APIRouter(\n" +
        "    prefix='/api',\n" +
        "    tags=['Protected'],\n" +
        "    {{1}}=[{{2}}(verify_token)]\n" +
        ")\n\n" +
        "@protected.get('/profile')\n" +
        "def profile(): return {'user': 'Анна'}\n\n" +
        "@protected.get('/settings')\n" +
        "def settings(): return {'theme': 'dark'}\n\n" +
        "public = {{3}}(tags=['Public'])\n\n" +
        "@public.get('/health')\n" +
        "def health(): return {'status': 'ok'}\n\n" +
        "app = FastAPI()\n" +
        "app.include_router(public)\n" +
        "app.{{4}}_router(protected)",
      answers: [
        ["HTTPException"],
        ["dependencies"],
        ["Depends"],
        ["APIRouter"],
        ["include"],
      ],
      hints: [
        "Класс ошибки для неавторизованного доступа.",
        "Параметр APIRouter для списка зависимостей.",
        "Функция внедрения зависимости.",
        "Класс для публичного роутера.",
        "Метод подключения роутера.",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "fa5-q1",
      title: "Чем APIRouter отличается от Flask Blueprint?",
      question:
        "APIRouter и Flask Blueprint решают одну задачу — модульность. Какой аналог метода `app.register_blueprint()` используется в FastAPI?",
      answers: [
        "app.include_router()", "include_router", "app.include_router",
        "include_router()", "app include router", "include router",
      ],
      hint: "В FastAPI слово include, а не register.",
      explanation:
        "`app.include_router(router)` в FastAPI аналогичен `app.register_blueprint(bp)` в Flask.\n\nРазличия:\n• FastAPI: `app.include_router(router, prefix='/v1', tags=['V1'])`\n• Flask: `app.register_blueprint(bp, url_prefix='/v1')`\n\nAPIRouter также поддерживает `dependencies=` для всего роутера — это мощнее Blueprint.",
    },
    {
      type: "question",
      id: "fa5-q2",
      title: "prefix='/users' + @router.get('/{id}') = ?",
      question:
        "Если у роутера prefix='/users' и маршрут @router.get('/{user_id}'), какой полный URL будет у этого маршрута?",
      answers: [
        "/users/{user_id}", "/users/user_id", "GET /users/{user_id}",
        "/users/{user_id}/", "users/{user_id}", "/users/{id}",
      ],
      hint: "prefix + path склеиваются напрямую.",
      explanation:
        "prefix + path: '/users' + '/{user_id}' = '/users/{user_id}'.\n\nВажные нюансы:\n• Если prefix='/users/' и path='/{id}' → '/users//{id}' (лишний слэш!). Следи за слэшами.\n• По соглашению: prefix без финального /, path начинается с /\n• @router.get('/') → '/users/' (весь список)",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fa5-w1",
      title: "Проект с несколькими роутерами",
      task:
        "Создай FastAPI-приложение с тремя роутерами.\n\n" +
        "━━━ Роутеры ━━━\n\n" +
        "1. `auth_router` (prefix='/auth', tags=['Auth'])\n" +
        "   - POST /auth/login → {'token': 'fake-token'}\n" +
        "   - POST /auth/logout → {'logged_out': True}\n\n" +
        "2. `users_router` (prefix='/users', tags=['Users'])\n" +
        "   - GET /users/ → список\n" +
        "   - GET /users/{user_id} → один пользователь\n\n" +
        "3. `admin_router` (prefix='/admin', tags=['Admin'],\n" +
        "    + dependencies=[Depends(check_admin)] — зависимость проверки)\n" +
        "   - GET /admin/stats → {'users': 100}\n\n" +
        "Функция `check_admin(key: str = None)` — если key != 'admin' → HTTPException 403.\n\n" +
        "Подключи все роутеры через app.include_router().",
      hints: [
        "from fastapi import FastAPI, APIRouter, Depends, HTTPException",
        "auth_router = APIRouter(prefix='/auth', tags=['Auth'])",
        "admin_router = APIRouter(prefix='/admin', tags=['Admin'], dependencies=[Depends(check_admin)])",
        "@auth_router.post('/login') def login(): return {'token': 'fake-token'}",
        "app.include_router(auth_router); app.include_router(users_router); app.include_router(admin_router)",
      ],
      required: [
        "APIRouter",
        "prefix='/auth'",
        "prefix='/users'",
        "prefix='/admin'",
        "dependencies=[",
        "Depends(",
        "HTTPException",
        "include_router",
        "tags=",
      ],
      minLines: 42,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 6 · FastAPI + SQLAlchemy — база данных
// ─────────────────────────────────────────────────────────────────────────────
const fa6: Round = {
  number: 6,
  title: "FastAPI · SQLAlchemy — работа с БД",
  level: "Средний",
  intro:
    "FastAPI отлично работает с SQLAlchemy — самой популярной ORM для Python. Связь через Depends позволяет правильно управлять сессиями.\n\n**В этом раунде:**\n• SQLAlchemy + FastAPI паттерн\n• Получение сессии через Depends\n• Модели БД vs Pydantic-схемы\n• CRUD операции\n• from_orm и sqlalchemy_model_config",
  lesson: {
    title: "FastAPI + SQLAlchemy — правильный паттерн",
    summary:
      "Сессия SQLAlchemy передаётся через Depends(get_db). Модели БД — SQLAlchemy, схемы API — Pydantic. Два разных мира соединяются через model_validate.",
    readingMinutes: 16,
    sections: [
      {
        heading: "Настройка SQLAlchemy в FastAPI",
        tagline: "get_db() как yield-зависимость — сессия живёт один запрос",
        body:
          "**Два типа моделей — не путай!**\n\n" +
          "```python\n" +
          "# SQLAlchemy модель — описывает таблицу в БД:\n" +
          "class UserDB(Base):  # наследует Base (declarative_base())\n" +
          "    __tablename__ = 'users'\n" +
          "    id = Column(Integer, primary_key=True)\n" +
          "    name = Column(String(50))\n\n" +
          "# Pydantic схема — описывает JSON для API:\n" +
          "class UserSchema(BaseModel):  # наследует BaseModel\n" +
          "    id: int\n" +
          "    name: str\n" +
          "    model_config = {'from_attributes': True}  # для связи с ORM\n" +
          "```\n\n" +
          "**Паттерн get_db (yield-зависимость) — главный паттерн FastAPI + БД:**\n" +
          "```python\n" +
          "def get_db():\n" +
          "    db = SessionLocal()  # открываем сессию\n" +
          "    try:\n" +
          "        yield db          # передаём в маршрут (здесь обрабатывается запрос)\n" +
          "    finally:\n" +
          "        db.close()        # закрываем ВСЕГДА, даже при исключении!\n" +
          "```\n\n" +
          "`yield` в зависимости — это как context manager с `with`. FastAPI:\n" +
          "1. Вызывает get_db() до маршрута\n" +
          "2. Передаёт db в маршрут\n" +
          "3. После маршрута (или исключения) выполняет finally\n\n" +
          "**check_same_thread=False — зачем нужен?**\n" +
          "SQLite по умолчанию разрешает использование только из того потока, который создал соединение. FastAPI использует несколько потоков → нужен этот параметр.\n\n" +
          "**from_attributes=True (Pydantic v2) — зачем нужен?**\n" +
          "По умолчанию Pydantic v2 создаёт объекты только из dict. `from_attributes=True` позволяет создавать из ORM-объектов (у которых атрибуты, а не ключи словаря).\n\n" +
          "**Инициализация таблиц:**\n" +
          "```python\n" +
          "Base.metadata.create_all(bind=engine)\n" +
          "# Создаёт все таблицы если они не существуют\n" +
          "# В продакшене используй Alembic для миграций!\n" +
          "```",
        code:
          "from sqlalchemy import create_engine, Column, Integer, String, Boolean\n" +
          "from sqlalchemy.orm import declarative_base, sessionmaker, Session\n" +
          "from fastapi import FastAPI, Depends\n" +
          "from pydantic import BaseModel\n\n" +
          "# === Настройка БД ===\n" +
          "engine = create_engine(\n" +
          "    'sqlite:///./test.db',\n" +
          "    connect_args={'check_same_thread': False}  # для SQLite!\n" +
          ")\n" +
          "SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)\n" +
          "Base = declarative_base()\n\n" +
          "# === SQLAlchemy модель (таблица users) ===\n" +
          "class UserDB(Base):\n" +
          "    __tablename__ = 'users'\n" +
          "    id = Column(Integer, primary_key=True, index=True)\n" +
          "    name = Column(String(50), nullable=False)\n" +
          "    email = Column(String(100), unique=True)\n" +
          "    active = Column(Boolean, default=True)\n\n" +
          "Base.metadata.create_all(bind=engine)  # создаём таблицы\n\n" +
          "# === Pydantic схема (API) ===\n" +
          "class UserSchema(BaseModel):\n" +
          "    id: int\n" +
          "    name: str\n" +
          "    email: str\n" +
          "    model_config = {'from_attributes': True}  # из ORM-объекта!\n\n" +
          "# === Зависимость ===\n" +
          "def get_db():\n" +
          "    db = SessionLocal()\n" +
          "    try:\n" +
          "        yield db\n" +
          "    finally:\n" +
          "        db.close()\n\n" +
          "app = FastAPI()\n\n" +
          "@app.get('/users', response_model=list[UserSchema])\n" +
          "def list_users(db: Session = Depends(get_db)):\n" +
          "    return db.query(UserDB).all()\n\n" +
          "print('FastAPI + SQLAlchemy готовы!')",
        keyTakeaways: [
          "yield в get_db() → FastAPI закроет сессию после запроса (cleanup в finally).",
          "check_same_thread=False нужен для SQLite + FastAPI (несколько потоков).",
          "from_attributes=True (Pydantic v2) позволяет создать схему из ORM-объекта.",
        ],
        pitfalls: [
          "SessionLocal() без finally → утечка соединений! Всегда используй yield с finally: db.close()",
          "Не путай Base (SQLAlchemy) и BaseModel (Pydantic) — это разные вещи!",
          "autocommit=False — по умолчанию. Нужно явно вызывать db.commit() чтобы сохранить изменения.",
        ],
      },
      {
        heading: "CRUD операции через SQLAlchemy",
        tagline: "db.query(Model).all() / db.add(obj) / db.commit() / db.delete(obj)",
        body:
          "**Основные операции:**\n\n" +
          "```python\n" +
          "# READ — получить все:\n" +
          "users = db.query(UserDB).all()  # список ORM объектов\n\n" +
          "# READ — получить один по ID:\n" +
          "user = db.query(UserDB).filter(UserDB.id == user_id).first()\n" +
          "# first() → первый или None\n\n" +
          "# READ — с условием:\n" +
          "active_users = db.query(UserDB).filter(UserDB.active == True).all()\n\n" +
          "# CREATE:\n" +
          "new_user = UserDB(name='Анна', email='anna@test.com')\n" +
          "db.add(new_user)    # добавить в сессию\n" +
          "db.commit()         # сохранить в БД\n" +
          "db.refresh(new_user)  # обновить объект (получить id из БД)\n\n" +
          "# UPDATE:\n" +
          "user.name = 'Новое имя'\n" +
          "db.commit()         # SQLAlchemy видит изменение и сохраняет\n" +
          "db.refresh(user)    # обновить объект\n\n" +
          "# DELETE:\n" +
          "db.delete(user)\n" +
          "db.commit()\n" +
          "```\n\n" +
          "**PATCH паттерн (частичное обновление):**\n" +
          "```python\n" +
          "class UserUpdate(BaseModel):\n" +
          "    name: Optional[str] = None\n" +
          "    email: Optional[str] = None\n\n" +
          "@app.patch('/users/{uid}')\n" +
          "def update_user(uid: int, data: UserUpdate, db: Session = Depends(get_db)):\n" +
          "    user = db.query(UserDB).filter(UserDB.id == uid).first()\n" +
          "    # exclude_unset=True — только поля, которые передал клиент:\n" +
          "    update_data = data.model_dump(exclude_unset=True)\n" +
          "    for field, value in update_data.items():\n" +
          "        setattr(user, field, value)  # динамическое обновление!\n" +
          "    db.commit()\n" +
          "    db.refresh(user)\n" +
          "    return user\n" +
          "```",
        code:
          "from sqlalchemy.orm import Session\n" +
          "from fastapi import FastAPI, Depends, HTTPException\n" +
          "from pydantic import BaseModel\n" +
          "from typing import Optional\n\n" +
          "# (импортируем UserDB, SessionLocal, get_db из примера выше)\n\n" +
          "class UserCreate(BaseModel):\n" +
          "    name: str\n" +
          "    email: str\n\n" +
          "class UserOut(BaseModel):\n" +
          "    id: int; name: str; email: str\n" +
          "    model_config = {'from_attributes': True}\n\n" +
          "app = FastAPI()\n\n" +
          "# Здесь демонстрируем SQLAlchemy без реального подключения:\n" +
          "from sqlalchemy import create_engine, Column, Integer, String\n" +
          "from sqlalchemy.orm import declarative_base, sessionmaker\n\n" +
          "engine = create_engine('sqlite:///:memory:',\n" +
          "                       connect_args={'check_same_thread': False})\n" +
          "SessionLocal = sessionmaker(bind=engine)\n" +
          "Base = declarative_base()\n\n" +
          "class UserDB(Base):\n" +
          "    __tablename__ = 'users'\n" +
          "    id = Column(Integer, primary_key=True)\n" +
          "    name = Column(String)\n" +
          "    email = Column(String)\n\n" +
          "Base.metadata.create_all(bind=engine)\n\n" +
          "def get_db():\n" +
          "    db = SessionLocal()\n" +
          "    try: yield db\n" +
          "    finally: db.close()\n\n" +
          "# CRUD демо:\n" +
          "db = SessionLocal()\n" +
          "user = UserDB(name='Анна', email='anna@test.com')\n" +
          "db.add(user)\n" +
          "db.commit()\n" +
          "db.refresh(user)\n" +
          "print('Создан пользователь:', user.id, user.name)\n" +
          "all_users = db.query(UserDB).all()\n" +
          "print('Всего пользователей:', len(all_users))\n" +
          "db.close()",
        keyTakeaways: [
          "db.add(obj) + db.commit() — добавить и сохранить.",
          "db.query(Model).filter(Model.field == val).first() — найти один или None.",
          "model_dump(exclude_unset=True) — только поля которые клиент реально передал (для PATCH).",
        ],
        pitfalls: [
          "db.refresh(obj) после commit() — обязательно если нужны данные из БД (например, id, created_at).",
          "filter(Model.field == val) — не filter(Model.field = val). Используй == для сравнения!",
        ],
      },
      {
        heading: "🚀 Мастер-гид: SQLAlchemy + FastAPI — полный CRUD (Round 6)",
        tagline: "Настройка БД, модели, сессии через Depends, полные Create/Read/Update/Delete операции",
        body:
          "## Полная настройка SQLAlchemy в FastAPI — шаблон на каждый проект\n\n" +
          "```python\n" +
          "# database.py — настройка подключения к БД\n" +
          "from sqlalchemy import create_engine\n" +
          "from sqlalchemy.orm import sessionmaker, declarative_base\n\n" +
          "# SQLite для разработки:\n" +
          "DATABASE_URL = 'sqlite:///./app.db'\n" +
          "# Для PostgreSQL в продакшене:\n" +
          "# DATABASE_URL = 'postgresql://user:pass@localhost/dbname'\n\n" +
          "engine = create_engine(DATABASE_URL, connect_args={'check_same_thread': False})\n" +
          "# check_same_thread=False только для SQLite!\n\n" +
          "SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)\n" +
          "Base = declarative_base()\n\n" +
          "# Зависимость для получения сессии:\n" +
          "def get_db():\n" +
          "    db = SessionLocal()\n" +
          "    try:\n" +
          "        yield db      # ← yield вместо return — сессия закрывается после запроса!\n" +
          "    finally:\n" +
          "        db.close()   # всегда закрываем, даже если ошибка\n" +
          "```\n\n" +
          "## SQLAlchemy модели (таблицы БД)\n\n" +
          "```python\n" +
          "# models.py — SQLAlchemy модели (описание таблиц)\n" +
          "from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey\n" +
          "from sqlalchemy.orm import relationship\n" +
          "# from database import Base\n\n" +
          "# Имитируем Base для теста в браузере:\n" +
          "from sqlalchemy.orm import declarative_base\n" +
          "Base = declarative_base()\n\n" +
          "class User(Base):\n" +
          "    __tablename__ = 'users'\n\n" +
          "    id = Column(Integer, primary_key=True, index=True)\n" +
          "    name = Column(String(100), nullable=False)\n" +
          "    email = Column(String(200), unique=True, nullable=False)\n" +
          "    is_active = Column(Boolean, default=True)\n\n" +
          "    # Связь один-ко-многим: у пользователя много постов\n" +
          "    posts = relationship('Post', back_populates='author')\n\n" +
          "class Post(Base):\n" +
          "    __tablename__ = 'posts'\n\n" +
          "    id = Column(Integer, primary_key=True, index=True)\n" +
          "    title = Column(String(200), nullable=False)\n" +
          "    body = Column(String)\n" +
          "    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)\n\n" +
          "    # Обратная связь:\n" +
          "    author = relationship('User', back_populates='posts')\n\n" +
          "print('Модели созданы:', User.__tablename__, Post.__tablename__)\n" +
          "```\n\n" +
          "## Полный CRUD — Create, Read, Update, Delete\n\n" +
          "```python\n" +
          "# Эмуляция CRUD операций (без реальной БД — для учебного теста)\n" +
          "from pydantic import BaseModel\n" +
          "from typing import Optional, List\n\n" +
          "class UserCreate(BaseModel):\n" +
          "    name: str\n" +
          "    email: str\n\n" +
          "class UserResponse(BaseModel):\n" +
          "    id: int\n" +
          "    name: str\n" +
          "    email: str\n" +
          "    is_active: bool\n\n" +
          "# Имитируем сессию БД:\n" +
          "class FakeDB:\n" +
          "    def __init__(self):\n" +
          "        self._data = {}\n" +
          "        self._counter = 0\n\n" +
          "    def add(self, obj): pass\n" +
          "    def commit(self): pass\n" +
          "    def refresh(self, obj): pass\n" +
          "    def query(self, model): return self\n" +
          "    def filter(self, *a): return self\n" +
          "    def first(self): return None\n" +
          "    def all(self): return list(self._data.values())\n" +
          "    def close(self): pass\n\n" +
          "db = FakeDB()\n\n" +
          "# CREATE:\n" +
          "def create_user_crud(user_data: UserCreate):\n" +
          "    db._counter += 1\n" +
          "    user = {'id': db._counter, 'name': user_data.name, 'email': user_data.email, 'is_active': True}\n" +
          "    db._data[db._counter] = user\n" +
          "    # В реальном: db.add(user_obj); db.commit(); db.refresh(user_obj)\n" +
          "    return user\n\n" +
          "# READ:\n" +
          "def get_users_crud(): return list(db._data.values())\n" +
          "def get_user_crud(uid): return db._data.get(uid)\n\n" +
          "# UPDATE:\n" +
          "def update_user_crud(uid: int, name: str):\n" +
          "    if uid in db._data:\n" +
          "        db._data[uid]['name'] = name\n" +
          "    return db._data.get(uid)\n\n" +
          "# DELETE:\n" +
          "def delete_user_crud(uid: int):\n" +
          "    return db._data.pop(uid, None)\n\n" +
          "# Тест:\n" +
          "u1 = create_user_crud(UserCreate(name='Алексей', email='alex@mail.com'))\n" +
          "u2 = create_user_crud(UserCreate(name='Мария', email='maria@mail.com'))\n" +
          "print('Все:', get_users_crud())\n" +
          "print('Пользователь 1:', get_user_crud(1))\n" +
          "update_user_crud(1, 'Александр')\n" +
          "print('После update:', get_user_crud(1))\n" +
          "delete_user_crud(2)\n" +
          "print('После delete:', get_users_crud())\n" +
          "```\n\n" +
          "## Паттерн: Depends(get_db) — сессия через зависимость\n\n" +
          "```python\n" +
          "# В реальном FastAPI-проекте:\n" +
          "from fastapi import FastAPI, Depends\n" +
          "# from database import get_db, SessionLocal\n" +
          "# from sqlalchemy.orm import Session\n\n" +
          "app = FastAPI()\n\n" +
          "# @app.post('/users', response_model=UserResponse)\n" +
          "# def create_user(user: UserCreate, db: Session = Depends(get_db)):\n" +
          "#     db_user = UserModel(name=user.name, email=user.email)\n" +
          "#     db.add(db_user)    # добавляем в сессию\n" +
          "#     db.commit()        # сохраняем в БД\n" +
          "#     db.refresh(db_user)  # обновляем объект из БД (получаем id)\n" +
          "#     return db_user\n\n" +
          "# Ключевые шаги:\n" +
          "steps = [\n" +
          "    '1. db.add(obj) — добавить объект в сессию',\n" +
          "    '2. db.commit() — записать в БД',\n" +
          "    '3. db.refresh(obj) — обновить obj из БД (получить id)',\n" +
          "    '4. return obj — FastAPI сериализует в JSON',\n" +
          "]\n" +
          "for s in steps: print(s)\n" +
          "```",
        code:
          "# Полный CRUD без реальной БД (SQLAlchemy эмуляция для теста)\n" +
          "from fastapi import FastAPI, HTTPException\n" +
          "from pydantic import BaseModel, Field\n" +
          "from typing import Optional, List\n\n" +
          "class ProductCreate(BaseModel):\n" +
          "    name: str = Field(min_length=1)\n" +
          "    price: float = Field(gt=0)\n" +
          "    stock: int = Field(ge=0, default=0)\n\n" +
          "class ProductUpdate(BaseModel):\n" +
          "    name: Optional[str] = None\n" +
          "    price: Optional[float] = None\n" +
          "    stock: Optional[int] = None\n\n" +
          "class ProductResponse(BaseModel):\n" +
          "    id: int\n" +
          "    name: str\n" +
          "    price: float\n" +
          "    stock: int\n\n" +
          "app = FastAPI(title='Products CRUD')\n" +
          "# Имитация БД:\n" +
          "_db = {}\n" +
          "_id_counter = 0\n\n" +
          "@app.post('/products', response_model=ProductResponse, status_code=201)\n" +
          "def create_product(product: ProductCreate):\n" +
          "    global _id_counter\n" +
          "    _id_counter += 1\n" +
          "    p = {'id': _id_counter, **product.model_dump()}\n" +
          "    _db[_id_counter] = p\n" +
          "    return p\n\n" +
          "@app.get('/products', response_model=List[ProductResponse])\n" +
          "def list_products(skip: int = 0, limit: int = 10):\n" +
          "    return list(_db.values())[skip:skip+limit]\n\n" +
          "@app.get('/products/{pid}', response_model=ProductResponse)\n" +
          "def get_product(pid: int):\n" +
          "    if pid not in _db: raise HTTPException(404, 'Не найден')\n" +
          "    return _db[pid]\n\n" +
          "@app.patch('/products/{pid}', response_model=ProductResponse)\n" +
          "def update_product(pid: int, data: ProductUpdate):\n" +
          "    if pid not in _db: raise HTTPException(404, 'Не найден')\n" +
          "    updates = data.model_dump(exclude_unset=True)\n" +
          "    _db[pid].update(updates)\n" +
          "    return _db[pid]\n\n" +
          "@app.delete('/products/{pid}', status_code=204)\n" +
          "def delete_product(pid: int):\n" +
          "    if pid not in _db: raise HTTPException(404, 'Не найден')\n" +
          "    del _db[pid]\n\n" +
          "# Тест:\n" +
          "p1 = create_product(ProductCreate(name='Laptop', price=999, stock=10))\n" +
          "p2 = create_product(ProductCreate(name='Phone', price=499, stock=25))\n" +
          "print('Создано:', p1, p2)\n" +
          "print('Список:', list_products())\n" +
          "update_product(1, ProductUpdate(price=899))\n" +
          "print('После update:', get_product(1))",
        keyTakeaways: [
          "Base = declarative_base() — основа для всех SQLAlchemy-моделей в FastAPI.",
          "get_db() с yield — сессия открывается для запроса, закрывается в finally. Это стандартный паттерн.",
          "db.add() → db.commit() → db.refresh() — три шага для создания записи. Refresh обновляет id.",
          "Разделяй схемы: UserCreate (вход), UserResponse (выход), UserUpdate (обновление). Это лучшая практика.",
          "model_dump(exclude_unset=True) для PATCH — обновляй только поля которые клиент реально прислал.",
        ],
        pitfalls: [
          "db.refresh(obj) после commit() — без него obj не имеет id и автозаполненных полей из БД.",
          "filter(Model.field == val) — двойное ==. Одинарное = это присваивание и вызовет ошибку SQLAlchemy.",
          "check_same_thread=False только для SQLite! Для PostgreSQL не нужен этот параметр.",
          "yield в get_db() — обязательно в try/finally чтобы закрыть сессию даже при ошибке.",
        ],
        analogy: "SQLAlchemy Session — как транзакция в банке. db.add() — положить деньги на стол кассира. db.commit() — кассир записал в реестр (деньги теперь в банке). db.refresh() — получить квитанцию с номером транзакции (id). db.close() — уйти из банка (закрыть сессию). Если что-то пошло не так до commit — деньги возвращаются (rollback).",
      },
      {
        heading: "Примеры и пояснения",
        tagline: "SQLAlchemy + FastAPI: сессии, CRUD, схемы запроса и ответа",
        body:
          "### Упражнение 1: «Настройка SQLAlchemy + FastAPI»\n\n" +
          "```python\n" +
          "from sqlalchemy.orm import ..., Session  # {{0}} = Session\n" +
          "from fastapi import FastAPI, Depends     # {{1}} = Depends\n\n" +
          "engine = create_engine(\n" +
          "    DATABASE_URL,\n" +
          "    connect_args={'check_same_thread': False}  # {{2}} = check\n" +
          ")\n" +
          "SessionLocal = sessionmaker(bind=engine)  # {{3}} = sessionmaker\n\n" +
          "class Task(Base):\n" +
          "    __tablename__ = 'tasks'  # {{4}} = tasks\n" +
          "    done = Column(Boolean, ...)  # {{5}} = Boolean\n\n" +
          "def get_db():\n" +
          "    db = SessionLocal()    # {{6}} = SessionLocal\n" +
          "    try:\n" +
          "        yield db           # {{7}} = yield\n" +
          "    finally:\n" +
          "        db.close()\n" +
          "```\n\n" +
          "---\n\n" +
          "### Упражнение 2: «CRUD маршруты с БД»\n\n" +
          "```python\n" +
          "class UserOut(BaseModel):\n" +
          "    model_config = {'from_attributes': True}  # {{0}} = from_attributes\n\n" +
          "def get_db():\n" +
          "    ...finally: db.close()  # {{1}} = close\n\n" +
          "@app.get('/users')\n" +
          "def get_users(db = Depends(get_db)):  # {{2}} = get_db\n" +
          "    return db.query(UserDB).all()  # {{3}} = query\n\n" +
          "@app.post('/users')\n" +
          "def create_user(user: UserCreate, db = Depends(get_db)):\n" +
          "    db_user = UserDB(**user.model_dump())  # {{4}} = model_dump\n" +
          "    db.add(db_user)    # {{5}} = add\n" +
          "    db.commit()        # {{6}} = commit\n" +
          "    ...filter(UserDB.id == uid).first()  # {{7}} = first\n" +
          "```\n\n" +
          "---\n\n" +
          "### Упражнение 3: «Удаление и обновление в БД»\n\n" +
          "```python\n" +
          "...filter(ItemDB.id == item_id).first()  # {{0}} = first\n" +
          "raise HTTPException(404)  # {{1}} = 404\n" +
          "data.model_dump(exclude_unset=True)  # {{2}} = unset\n" +
          "update_data.items()  # {{3}} = items\n" +
          "db.commit()  # {{4}} = commit\n" +
          "db.delete(item)  # {{5}} = delete\n" +
          "return Response(status_code=204)  # {{6}} = 204\n" +
          "```\n\n" +
          "---\n\n" +
          "### Управление сессией и транзакциями\n\n" +
          "**yield в get_db() гарантирует закрытие сессии.** Функция с yield — генератор: код до yield — startup (открываем сессию), код после (в finally) — cleanup (закрываем сессию). Блок finally выполняется ВСЕГДА, даже если маршрут бросил исключение. Без finally незакрытые сессии накапливаются и исчерпывают пул подключений к БД. FastAPI специально поддерживает yield-зависимости для управления ресурсами.\n\n" +
          "**db.commit() фиксирует транзакцию.** SQLAlchemy работает транзакционно: все изменения (INSERT, UPDATE, DELETE) накапливаются в памяти и не попадают в БД до db.commit(). Это позволяет откатить операции через db.rollback(). db.flush() отправляет SQL на сервер, но не фиксирует — используется когда нужен автогенерированный id до commit.",
      },
    ],
    cheatSheet: [
      "`engine = create_engine('sqlite:///./test.db', connect_args={'check_same_thread': False})`",
      "`SessionLocal = sessionmaker(bind=engine)`",
      "`def get_db(): db = SessionLocal(); try: yield db; finally: db.close()`",
      "`db: Session = Depends(get_db)` — в параметре маршрута.",
      "`model_config = {'from_attributes': True}` — в Pydantic схеме для from ORM.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fa6-f1",
      title: "Настройка SQLAlchemy + FastAPI",
      description: "Заполни настройку БД и зависимость get_db.",
      code:
        "from sqlalchemy import create_engine, Column, Integer, String\n" +
        "from sqlalchemy.orm import declarative_base, sessionmaker, {{0}}\n" +
        "from fastapi import FastAPI, {{1}}\n\n" +
        "DATABASE_URL = 'sqlite:///./app.db'\n" +
        "engine = create_engine(\n" +
        "    DATABASE_URL,\n" +
        "    connect_args={'{{2}}_same_thread': False}\n" +
        ")\n" +
        "SessionLocal = {{3}}(bind=engine)\n" +
        "Base = declarative_base()\n\n" +
        "class Task(Base):\n" +
        "    __tablename__ = '{{4}}'\n" +
        "    id = Column(Integer, primary_key=True)\n" +
        "    title = Column(String(200))\n" +
        "    done = Column({{5}}, default=False)\n\n" +
        "Base.metadata.create_all(bind=engine)\n\n" +
        "def get_db():\n" +
        "    db = {{6}}()\n" +
        "    try:\n" +
        "        {{7}} db\n" +
        "    finally:\n" +
        "        db.close()\n\n" +
        "app = FastAPI()\n" +
        "print('БД настроена!')",
      answers: [
        ["Session"],
        ["Depends"],
        ["check"],
        ["sessionmaker"],
        ["tasks"],
        ["Boolean"],
        ["SessionLocal"],
        ["yield"],
      ],
      hints: [
        "Тип SQLAlchemy для аннотации сессии.",
        "Функция FastAPI для зависимостей.",
        "check_same_thread — параметр для SQLite.",
        "Фабрика для создания сессий.",
        "Имя таблицы в БД.",
        "SQLAlchemy тип для булевого поля.",
        "Фабрика сессий для создания экземпляра.",
        "Ключевое слово Python для паузы в генераторе.",
      ],
    },
    {
      type: "fill",
      id: "fa6-f2",
      title: "CRUD маршруты с БД",
      description: "Реализуй CRUD используя SQLAlchemy-сессию.",
      code:
        "from fastapi import FastAPI, Depends, HTTPException\n" +
        "from sqlalchemy.orm import Session\n" +
        "from pydantic import BaseModel\n\n" +
        "class UserCreate(BaseModel):\n" +
        "    name: str\n" +
        "    email: str\n\n" +
        "class UserOut(BaseModel):\n" +
        "    id: int; name: str; email: str\n" +
        "    model_config = {'{{0}}': True}\n\n" +
        "def get_db():\n" +
        "    db = SessionLocal()\n" +
        "    try: yield db\n" +
        "    finally: db.{{1}}()\n\n" +
        "app = FastAPI()\n\n" +
        "@app.get('/users', response_model=list[UserOut])\n" +
        "def get_users(db: Session = Depends({{2}})):\n" +
        "    return db.{{3}}(UserDB).all()\n\n" +
        "@app.post('/users', response_model=UserOut, status_code=201)\n" +
        "def create_user(user: UserCreate, db: Session = Depends(get_db)):\n" +
        "    db_user = UserDB(**user.{{4}}())\n" +
        "    db.{{5}}(db_user)\n" +
        "    db.{{6}}()\n" +
        "    db.refresh(db_user)\n" +
        "    return db_user\n\n" +
        "@app.get('/users/{uid}', response_model=UserOut)\n" +
        "def get_user(uid: int, db: Session = Depends(get_db)):\n" +
        "    user = db.query(UserDB).filter(UserDB.id == uid).{{7}}()\n" +
        "    if not user: raise HTTPException(404, 'Not found')\n" +
        "    return user",
      answers: [
        ["from_attributes"],
        ["close"],
        ["get_db"],
        ["query"],
        ["model_dump"],
        ["add"],
        ["commit"],
        ["first"],
      ],
      hints: [
        "Конфиг Pydantic v2 для работы с ORM-объектами.",
        "Метод для закрытия сессии.",
        "Имя функции-зависимости.",
        "Метод SQLAlchemy для запроса к таблице.",
        "Метод Pydantic для конвертации в dict.",
        "Метод сессии для добавления объекта.",
        "Метод сессии для сохранения изменений.",
        "Метод запроса для получения первого результата.",
      ],
    },
    {
      type: "fill",
      id: "fa6-f3",
      title: "Удаление и обновление в БД",
      description: "Реализуй UPDATE и DELETE через SQLAlchemy.",
      code:
        "from fastapi import FastAPI, Depends, HTTPException\n" +
        "from fastapi.responses import Response\n" +
        "from sqlalchemy.orm import Session\n" +
        "from pydantic import BaseModel\n" +
        "from typing import Optional\n\n" +
        "class ItemUpdate(BaseModel):\n" +
        "    name: Optional[str] = None\n" +
        "    price: Optional[float] = None\n\n" +
        "app = FastAPI()\n\n" +
        "@app.put('/items/{item_id}')\n" +
        "def update_item(\n" +
        "    item_id: int,\n" +
        "    data: ItemUpdate,\n" +
        "    db: Session = Depends(get_db)\n" +
        "):\n" +
        "    item = db.query(ItemDB).filter(ItemDB.id == item_id).{{0}}()\n" +
        "    if not item:\n" +
        "        raise HTTPException({{1}}, 'Not found')\n" +
        "    update_data = data.model_dump(exclude_{{2}}=True)\n" +
        "    for field, value in update_data.{{3}}():\n" +
        "        setattr(item, field, value)\n" +
        "    db.{{4}}()\n" +
        "    db.refresh(item)\n" +
        "    return item\n\n" +
        "@app.delete('/items/{item_id}', status_code=204)\n" +
        "def delete_item(item_id: int, db: Session = Depends(get_db)):\n" +
        "    item = db.query(ItemDB).filter(ItemDB.id == item_id).first()\n" +
        "    if not item:\n" +
        "        raise HTTPException(404, 'Not found')\n" +
        "    db.{{5}}(item)\n" +
        "    db.commit()\n" +
        "    return Response(status_code={{6}})",
      answers: [
        ["first"],
        ["404"],
        ["unset"],
        ["items"],
        ["commit"],
        ["delete"],
        ["204"],
      ],
      hints: [
        "Метод для первой записи или None.",
        "HTTP-код для 'не найдено'.",
        "exclude_unset=True — убрать незаданные поля.",
        "Метод dict для итерации пар ключ-значение.",
        "Сохранить изменения в БД.",
        "Метод сессии для удаления объекта.",
        "Код без содержимого для DELETE.",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "fa6-q1",
      title: "Зачем yield в get_db()?",
      question:
        "Функция get_db() использует `yield db` вместо `return db`. Что происходит с сессией ПОСЛЕ того как FastAPI завершил обработку запроса?",
      answers: [
        "сессия закрывается в блоке finally",
        "finally закрывает сессию автоматически после запроса",
        "db.close() вызывается в finally после yield",
        "сессия автоматически закрывается",
        "db.close в блоке finally",
        "закрытие сессии в finally блоке",
        "cleanup в finally",
      ],
      hint: "Смотри на блок try/finally вокруг yield.",
      explanation:
        "После yield FastAPI выполняет код ПОСЛЕ yield (в блоке finally). Это гарантирует:\n• Сессия закроется даже при исключении в маршруте\n• Нет утечек соединений\n• Правильное управление ресурсами (Resource Management Pattern)",
    },
    {
      type: "question",
      id: "fa6-q2",
      title: "Что делает db.commit()?",
      question:
        "После db.add(user) нужно вызвать ___, чтобы изменения сохранились в базе данных.",
      answers: [
        "db.commit()", "commit()", "commit", "db.commit",
        "db.save()", "сохранить транзакцию", "подтвердить транзакцию",
      ],
      hint: "Это подтверждение транзакции — без него изменения не сохранятся.",
      explanation:
        "db.commit() подтверждает текущую транзакцию. После add() объект находится в сессии но НЕ в БД. commit() записывает изменения в БД. После commit() нужен db.refresh(obj) чтобы получить автогенерируемые поля (id, created_at).",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fa6-w1",
      title: "Todo API с SQLite",
      task:
        "Создай FastAPI-приложение для управления задачами с SQLite через SQLAlchemy.\n\n" +
        "━━━ Настройка БД ━━━\n\n" +
        "1. `engine = create_engine('sqlite:///./todos.db', connect_args={...})`\n" +
        "2. `SessionLocal = sessionmaker(bind=engine)`\n" +
        "3. `Base = declarative_base()`\n\n" +
        "━━━ SQLAlchemy модель ━━━\n\n" +
        "class TodoDB(Base):\n" +
        "    __tablename__ = 'todos'\n" +
        "    id = Column(Integer, primary_key=True)\n" +
        "    title = Column(String(200))\n" +
        "    done = Column(Boolean, default=False)\n\n" +
        "━━━ Pydantic схемы ━━━\n\n" +
        "class TodoCreate(BaseModel): title: str\n" +
        "class TodoOut(BaseModel): id: int, title: str, done: bool\n" +
        "    + model_config = {'from_attributes': True}\n\n" +
        "━━━ get_db зависимость ━━━\n\n" +
        "def get_db(): db = SessionLocal(); try: yield db; finally: db.close()\n\n" +
        "━━━ Маршруты ━━━\n\n" +
        "GET /todos — все задачи\n" +
        "POST /todos — создать (status_code=201)\n" +
        "GET /todos/{todo_id} — одна задача (или 404)\n" +
        "DELETE /todos/{todo_id} — удалить (204)\n\n" +
        "Запусти! Таблица создастся автоматически.",
      hints: [
        "from sqlalchemy import create_engine, Column, Integer, String, Boolean",
        "from sqlalchemy.orm import declarative_base, sessionmaker, Session",
        "Base.metadata.create_all(bind=engine)",
        "db_todo = TodoDB(**todo.model_dump()); db.add(db_todo); db.commit(); db.refresh(db_todo)",
        "db.query(TodoDB).filter(TodoDB.id == todo_id).first() → если None → HTTPException(404)",
      ],
      required: [
        "create_engine",
        "sessionmaker",
        "declarative_base",
        "get_db",
        "yield",
        "from_attributes",
        "model_dump",
        "db.add",
        "db.commit",
        "HTTPException",
        "Response(",
      ],
      minLines: 55,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 7 · JWT — аутентификация
// ─────────────────────────────────────────────────────────────────────────────
const fa7: Round = {
  number: 7,
  title: "FastAPI · JWT и OAuth2 — аутентификация",
  level: "Сложный",
  intro:
    "JWT (JSON Web Token) — стандарт для безопасной передачи информации между клиентом и сервером. FastAPI имеет встроенную поддержку OAuth2 с Bearer токенами.\n\n**В этом раунде:**\n• JWT — что это и как работает\n• OAuth2PasswordBearer схема\n• Создание и проверка JWT\n• Защищённые маршруты\n• Refresh токены",
  lesson: {
    title: "JWT и OAuth2 — безопасная аутентификация",
    summary:
      "JWT — подписанный токен с данными пользователя. OAuth2PasswordBearer — схема FastAPI для Bearer токенов. jose/python-jose — библиотека для работы с JWT.",
    readingMinutes: 18,
    sections: [
      {
        heading: "JWT — что это и как работает",
        tagline: "JWT = base64(header) + base64(payload) + signature — подписанный токен",
        body:
          "### Ключевые термины этого раздела\n\n" +
          "- **Аутентификация** — «кто ты?» (проверка логина и пароля → выдача токена).\n" +
          "- **Авторизация** — «что тебе можно?» (проверка токена → получение доступа к ресурсу).\n" +
          "- **JWT (JSON Web Token)** — специально закодированная строка с данными пользователя + цифровой подписью. Сервер выдаёт её после входа, клиент прикладывает к каждому запросу.\n" +
          "- **Bearer token (предъявительский токен)** — тот, кто «предъявляет» этот токен — тот и авторизован. Как наличные деньги: не важно чьи они, важно что они у тебя. Поэтому токен нельзя передавать другим людям.\n" +
          "- **Stateless (без состояния)** — сервер не хранит ничего о сессии пользователя. Вся информация о пользователе зашита прямо в токен. Проверил подпись — доверяет содержимому. Это позволяет масштабировать: любой из 10 серверов может обработать запрос без общей памяти.\n" +
          "- **Claims (утверждения)** — поля payload токена. Токен «утверждает»: «я — user@mail.com, моя роль — admin, действую до такого-то времени». Сервер верит этому, потому что проверил цифровую подпись.\n" +
          "- **HS256** — алгоритм подписи. HMAC-SHA256: берёт данные + SECRET_KEY → создаёт контрольную сумму. Если изменить хоть один символ в токене — подпись не совпадёт и токен будет отклонён.\n" +
          "- **RFC 7519** — номер официального стандарта JWT (RFC = Request for Comments, технический документ IETF). Просто означает «JWT — стандартная технология, не самодельная».\n\n" +
          "---\n\n" +
          "**JWT (JSON Web Token)** — стандарт RFC 7519. Токен состоит из трёх частей, разделённых точкой:\n\n" +
          "```\n" +
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  ← header (base64)\n" +
          "eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzAwMDAwMDAwfQ.  ← payload (base64)\n" +
          "abc123signature  ← signature\n" +
          "```\n\n" +
          "**Payload (полезная нагрузка) содержит claims:**\n" +
          "- `sub` — subject (идентификатор пользователя: email или user_id)\n" +
          "- `exp` — expiration (время истечения токена, Unix timestamp)\n" +
          "- `iat` — issued at (время создания)\n" +
          "- Любые кастомные данные: role, permissions\n\n" +
          "**Как работает аутентификация с JWT:**\n\n" +
          "```\n" +
          "1. Клиент → POST /auth/token {username, password}\n" +
          "2. Сервер проверяет пароль → создаёт JWT → возвращает\n" +
          "3. Клиент сохраняет токен (localStorage / cookie)\n" +
          "4. Клиент → GET /profile + Authorization: Bearer <token>\n" +
          "5. Сервер проверяет подпись токена → извлекает sub → возвращает данные\n" +
          "```\n\n" +
          "**Преимущества JWT:**\n" +
          "- Stateless — сервер не хранит сессии (масштабируемость)\n" +
          "- Самодостаточный — payload содержит нужные данные\n" +
          "- Поддержка микросервисов — один токен валиден на всех сервисах\n\n" +
          "**Недостатки JWT:**\n" +
          "- Нельзя отозвать до истечения exp (нужен blacklist)\n" +
          "- Payload не шифруется! (только подписывается) — не храни пароли в payload!\n\n" +
          "**SECRET_KEY** — секретный ключ для подписи. Должен быть длинным случайным строкой:\n" +
          "```bash\n" +
          "python -c \"import secrets; print(secrets.token_hex(32))\"\n" +
          "# → a1b2c3d4e5f6... (64 символа)\n" +
          "```",
        code:
          "# Для JWT нужен python-jose:\n" +
          "# pip install python-jose[cryptography] passlib[bcrypt]\n\n" +
          "from jose import jwt, JWTError\n" +
          "from datetime import datetime, timedelta\n\n" +
          "SECRET_KEY = 'super-secret-key-change-in-production'\n" +
          "ALGORITHM = 'HS256'  # HMAC-SHA256 — стандартный алгоритм\n" +
          "ACCESS_TOKEN_EXPIRE = 30  # минут\n\n" +
          "def create_access_token(data: dict, expires_minutes: int = ACCESS_TOKEN_EXPIRE) -> str:\n" +
          "    to_encode = data.copy()\n" +
          "    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)\n" +
          "    to_encode.update({'exp': expire})  # добавляем время истечения\n" +
          "    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)\n\n" +
          "def decode_token(token: str) -> dict:\n" +
          "    try:\n" +
          "        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])\n" +
          "        return payload\n" +
          "    except JWTError:\n" +
          "        return None\n\n" +
          "# Тест:\n" +
          "token = create_access_token({'sub': 'user@example.com', 'role': 'admin'})\n" +
          "print('Токен создан! Длина:', len(token))\n" +
          "payload = decode_token(token)\n" +
          "print('Декодирован:', payload['sub'] if payload else 'ошибка')",
        keyTakeaways: [
          "JWT = base64(header).base64(payload).signature — подписанный, НЕ зашифрованный токен.",
          "sub — идентификатор пользователя. exp — Unix timestamp истечения. Это стандартные claims.",
          "SECRET_KEY — держи в секрете! В переменных окружения, не в коде.",
        ],
        pitfalls: [
          "JWT payload не шифруется — его можно декодировать без ключа. Не храни пароли и секреты!",
          "Без проверки exp токен никогда не истечёт. jose/PyJWT проверяют exp автоматически при decode.",
        ],
        analogy:
          "JWT — как паспорт. Выдаётся один раз (при входе), проверяется везде (на каждом запросе), содержит информацию о владельце (payload), имеет срок действия (exp), подписан государством (SECRET_KEY). Без подделки подписи нельзя изменить данные.",
      },
      {
        heading: "OAuth2PasswordBearer и FastAPI",
        tagline: "oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/token') — стандартная схема",
        body:
          "**OAuth2PasswordBearer** — схема FastAPI для работы с Bearer токенами. Делает:\n" +
          "1. Показывает кнопку «Authorize» в Swagger UI\n" +
          "2. Извлекает токен из заголовка `Authorization: Bearer <token>`\n" +
          "3. Передаёт токен в зависимость\n\n" +
          "**Полный поток аутентификации:**\n\n" +
          "```python\n" +
          "oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/token')\n\n" +
          "# 1. Эндпоинт выдачи токена:\n" +
          "@app.post('/auth/token')\n" +
          "def login(form: OAuth2PasswordRequestForm = Depends()):\n" +
          "    # form.username, form.password — из form-data\n" +
          "    user = verify_password(form.username, form.password)\n" +
          "    if not user:\n" +
          "        raise HTTPException(401, 'Неверные данные')\n" +
          "    token = create_access_token({'sub': user.email})\n" +
          "    return {'access_token': token, 'token_type': 'bearer'}\n\n" +
          "# 2. Зависимость для защищённых маршрутов:\n" +
          "def get_current_user(token: str = Depends(oauth2_scheme)):\n" +
          "    payload = decode_token(token)\n" +
          "    if not payload:\n" +
          "        raise HTTPException(401, 'Неверный токен',\n" +
          "                           headers={'WWW-Authenticate': 'Bearer'})\n" +
          "    user = get_user_by_email(payload['sub'])\n" +
          "    return user\n\n" +
          "# 3. Защищённый маршрут:\n" +
          "@app.get('/me')\n" +
          "def get_me(user = Depends(get_current_user)):\n" +
          "    return user\n" +
          "```\n\n" +
          "**OAuth2PasswordRequestForm** — тело form-data (не JSON!):\n" +
          "- `form.username` — имя пользователя\n" +
          "- `form.password` — пароль\n" +
          "- `form.scopes` — список прав (опционально)\n\n" +
          "**Важно:** tokenUrl='/auth/token' — это просто URL для Swagger UI кнопки Authorize. Сам маршрут надо создать!",
        code:
          "from fastapi import FastAPI, Depends, HTTPException\n" +
          "from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm\n" +
          "from jose import jwt, JWTError\n" +
          "from datetime import datetime, timedelta\n\n" +
          "SECRET_KEY = 'demo-secret-key'\n" +
          "ALGORITHM = 'HS256'\n\n" +
          "# Простая БД пользователей:\n" +
          "USERS = {\n" +
          "    'admin@test.com': {'email': 'admin@test.com', 'password': 'admin123', 'role': 'admin'},\n" +
          "    'user@test.com':  {'email': 'user@test.com',  'password': 'user123',  'role': 'user'},\n" +
          "}\n\n" +
          "oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/token')\n\n" +
          "def create_token(email: str) -> str:\n" +
          "    expire = datetime.utcnow() + timedelta(minutes=30)\n" +
          "    return jwt.encode({'sub': email, 'exp': expire}, SECRET_KEY, ALGORITHM)\n\n" +
          "def get_current_user(token: str = Depends(oauth2_scheme)):\n" +
          "    try:\n" +
          "        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])\n" +
          "        email = payload.get('sub')\n" +
          "        if not email or email not in USERS:\n" +
          "            raise HTTPException(401, 'Неверный токен')\n" +
          "        return USERS[email]\n" +
          "    except JWTError:\n" +
          "        raise HTTPException(401, 'Неверный токен')\n\n" +
          "app = FastAPI()\n\n" +
          "@app.post('/auth/token')\n" +
          "def login(form: OAuth2PasswordRequestForm = Depends()):\n" +
          "    user = USERS.get(form.username)\n" +
          "    if not user or user['password'] != form.password:\n" +
          "        raise HTTPException(401, 'Неверные данные')\n" +
          "    return {'access_token': create_token(form.username), 'token_type': 'bearer'}\n\n" +
          "@app.get('/me')\n" +
          "def me(user = Depends(get_current_user)):\n" +
          "    return {'email': user['email'], 'role': user['role']}\n\n" +
          "print('Auth API готов!')\n" +
          "token = create_token('admin@test.com')\n" +
          "print('Токен:', token[:50] + '...')",
        keyTakeaways: [
          "OAuth2PasswordBearer извлекает Bearer токен из заголовка Authorization автоматически.",
          "OAuth2PasswordRequestForm — form-data (username/password), не JSON!",
          "get_current_user — зависимость, которая проверяет токен и возвращает пользователя.",
        ],
        pitfalls: [
          "В реальном продакшене НЕ храни пароли в открытом виде! Используй passlib: pwd_context.hash(password).",
          "token_type='bearer' обязателен в ответе — без него Swagger не примет токен.",
        ],
      },
      {
        heading: "🚀 Мастер-гид: JWT-авторизация в FastAPI (Round 7)",
        tagline: "Полный разбор JWT: создание токенов, верификация, защита маршрутов, OAuth2PasswordBearer",
        body:
          "## Как работает JWT-авторизация — полная схема\n\n" +
          "```\n" +
          "Клиент                         FastAPI\n" +
          "  │                              │\n" +
          "  │ POST /token {login, password} │\n" +
          "  │──────────────────────────────▶│\n" +
          "  │                              │ 1. Проверяет логин/пароль\n" +
          "  │                              │ 2. Создаёт JWT токен\n" +
          "  │ 200 {access_token, token_type}│\n" +
          "  │◀──────────────────────────────│\n" +
          "  │                              │\n" +
          "  │ GET /protected               │\n" +
          "  │ Authorization: Bearer <token> │\n" +
          "  │──────────────────────────────▶│\n" +
          "  │                              │ 3. Декодирует JWT → user_id\n" +
          "  │                              │ 4. Проверяет срок действия\n" +
          "  │ 200 {protected data}         │\n" +
          "  │◀──────────────────────────────│\n" +
          "```\n\n" +
          "## Структура JWT токена\n\n" +
          "JWT = три части через точку: `header.payload.signature`\n\n" +
          "```\n" +
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← header (алгоритм)\n" +
          ".eyJzdWIiOiJ1c2VyQGVtYWlsLmNvbSIsImV4cCI6MTYyMzk1MDB9  ← payload (данные)\n" +
          ".SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← signature (подпись)\n" +
          "```\n\n" +
          "**Payload содержит:**\n" +
          "- `sub` — subject (обычно user_id или email)\n" +
          "- `exp` — expiration time (время истечения)\n" +
          "- любые другие данные (role, etc.)\n\n" +
          "## Полная реализация JWT авторизации\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, HTTPException, Depends\n" +
          "from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm\n" +
          "import jwt  # pip install python-jose[cryptography]\n" +
          "from datetime import datetime, timedelta\n\n" +
          "# Конфигурация:\n" +
          "SECRET_KEY = 'your-secret-key-change-in-production'  # в реальности: из переменных окружения!\n" +
          "ALGORITHM = 'HS256'\n" +
          "ACCESS_TOKEN_EXPIRE_MINUTES = 30\n\n" +
          "# Имитация БД пользователей:\n" +
          "USERS_DB = {\n" +
          "    'alex@mail.com': {'id': 1, 'email': 'alex@mail.com', 'password': 'secret123'},\n" +
          "}\n\n" +
          "app = FastAPI()\n\n" +
          "# Схема OAuth2: FastAPI будет брать токен из заголовка Authorization: Bearer ...\n" +
          "oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/token')\n\n" +
          "# 1. Создание JWT токена:\n" +
          "def create_token(data: dict, expires_delta: timedelta = None):\n" +
          "    to_encode = data.copy()\n" +
          "    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))\n" +
          "    to_encode.update({'exp': expire})\n" +
          "    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)\n\n" +
          "# 2. Эндпоинт входа — выдаёт токен:\n" +
          "@app.post('/token')\n" +
          "def login(form_data: OAuth2PasswordRequestForm = Depends()):\n" +
          "    user = USERS_DB.get(form_data.username)\n" +
          "    if not user or user['password'] != form_data.password:\n" +
          "        raise HTTPException(401, detail='Неверный email или пароль')\n" +
          "    token = create_token({'sub': user['email']})\n" +
          "    return {'access_token': token, 'token_type': 'bearer'}\n\n" +
          "# 3. Зависимость — получить текущего пользователя из токена:\n" +
          "def get_current_user(token: str = Depends(oauth2_scheme)):\n" +
          "    try:\n" +
          "        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])\n" +
          "        email = payload.get('sub')\n" +
          "        if not email:\n" +
          "            raise HTTPException(401, 'Неверный токен')\n" +
          "    except jwt.ExpiredSignatureError:\n" +
          "        raise HTTPException(401, 'Токен истёк')\n" +
          "    except jwt.JWTError:\n" +
          "        raise HTTPException(401, 'Неверный токен')\n" +
          "    user = USERS_DB.get(email)\n" +
          "    if not user:\n" +
          "        raise HTTPException(401, 'Пользователь не найден')\n" +
          "    return user\n\n" +
          "# 4. Защищённый маршрут:\n" +
          "@app.get('/me')\n" +
          "def get_me(current_user: dict = Depends(get_current_user)):\n" +
          "    return {'id': current_user['id'], 'email': current_user['email']}\n\n" +
          "# Тест создания токена:\n" +
          "token = create_token({'sub': 'alex@mail.com'}, timedelta(minutes=30))\n" +
          "print('Токен создан (первые 30 символов):', token[:30], '...')\n" +
          "print('OAuth2 схема настроена, маршруты:', [r.path for r in app.routes if hasattr(r, 'path')])\n" +
          "```\n\n" +
          "## Хеширование паролей — обязательно в продакшене\n\n" +
          "```python\n" +
          "# pip install passlib[bcrypt]\n" +
          "from passlib.context import CryptContext\n\n" +
          "pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')\n\n" +
          "def hash_password(password: str) -> str:\n" +
          "    return pwd_context.hash(password)\n\n" +
          "def verify_password(plain: str, hashed: str) -> bool:\n" +
          "    return pwd_context.verify(plain, hashed)\n\n" +
          "# Регистрация:\n" +
          "hashed = hash_password('mypassword123')\n" +
          "print('Хеш пароля:', hashed[:30], '...')\n" +
          "print('Верный пароль:', verify_password('mypassword123', hashed))\n" +
          "print('Неверный пароль:', verify_password('wrong', hashed))\n" +
          "```\n\n" +
          "## Как подходить к упражнениям раунда 7\n\n" +
          "**OAuth2 упражнения:**\n" +
          "- `OAuth2PasswordBearer(tokenUrl='/token')` — указывает FastAPI где получать токены (для Swagger)\n" +
          "- `OAuth2PasswordRequestForm` — стандартная форма логина (username + password)\n" +
          "- `token_type='bearer'` — ОБЯЗАТЕЛЬНО в ответе /token\n\n" +
          "**JWT упражнения:**\n" +
          "- Создание: `jwt.encode({'sub': email, 'exp': datetime + timedelta}, SECRET_KEY, ALGORITHM)`\n" +
          "- Декодирование: `jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])`\n" +
          "- Payload.get('sub') — получить subject из токена\n\n" +
          "**Частые ошибки:**\n" +
          "```python\n" +
          "# ❌ Хранение пароля в открытом виде:\n" +
          "db = {'user': 'password123'}  # никогда! только хеши\n\n" +
          "# ✅ Правильно:\n" +
          "db = {'user': pwd_context.hash('password123')}  # bcrypt хеш\n\n" +
          "# ❌ SECRET_KEY в коде:\n" +
          "SECRET_KEY = 'mysecret'  # коммит в git → хакеры\n\n" +
          "# ✅ Из переменной окружения:\n" +
          "import os\n" +
          "SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-only-key')\n" +
          "```",
        code:
          "from fastapi import FastAPI\n" +
          "import hmac\n" +
          "import hashlib\n" +
          "import base64\n" +
          "import json\n" +
          "from datetime import datetime, timedelta\n\n" +
          "# Упрощённая JWT реализация для демонстрации (в реальном — python-jose)\n" +
          "SECRET = 'demo-secret-key'\n\n" +
          "def simple_encode(payload: dict) -> str:\n" +
          "    data = json.dumps(payload).encode()\n" +
          "    sig = hmac.new(SECRET.encode(), data, hashlib.sha256).hexdigest()[:16]\n" +
          "    return base64.b64encode(data).decode() + '.' + sig\n\n" +
          "def simple_decode(token: str) -> dict:\n" +
          "    try:\n" +
          "        encoded, sig = token.rsplit('.', 1)\n" +
          "        data = base64.b64decode(encoded.encode())\n" +
          "        expected = hmac.new(SECRET.encode(), data, hashlib.sha256).hexdigest()[:16]\n" +
          "        if sig != expected:\n" +
          "            raise ValueError('Неверная подпись токена')\n" +
          "        payload = json.loads(data)\n" +
          "        exp = datetime.fromisoformat(payload.get('exp', '2099-01-01'))\n" +
          "        if datetime.utcnow() > exp:\n" +
          "            raise ValueError('Токен истёк')\n" +
          "        return payload\n" +
          "    except Exception as e:\n" +
          "        raise ValueError(str(e))\n\n" +
          "# Имитация пользователей:\n" +
          "USERS = {'admin@mail.com': {'id': 1, 'email': 'admin@mail.com', 'role': 'admin'}}\n\n" +
          "def create_access_token(email: str, minutes: int = 30) -> str:\n" +
          "    payload = {\n" +
          "        'sub': email,\n" +
          "        'exp': (datetime.utcnow() + timedelta(minutes=minutes)).isoformat(),\n" +
          "    }\n" +
          "    return simple_encode(payload)\n\n" +
          "def get_current_user(token: str) -> dict:\n" +
          "    payload = simple_decode(token)  # вызовет ValueError если токен неверный\n" +
          "    email = payload.get('sub')\n" +
          "    user = USERS.get(email)\n" +
          "    if not user: raise ValueError('Пользователь не найден')\n" +
          "    return user\n\n" +
          "# Тест:\n" +
          "print('=== JWT Demo ===')\n" +
          "token = create_access_token('admin@mail.com')\n" +
          "print('Токен создан, длина:', len(token))\n" +
          "user = get_current_user(token)\n" +
          "print('Пользователь из токена:', user)\n" +
          "try:\n" +
          "    get_current_user('invalid.token')\n" +
          "except ValueError as e:\n" +
          "    print('Неверный токен:', e)\n" +
          "print('JWT авторизация работает!')",
        keyTakeaways: [
          "JWT = header.payload.signature — подписанный токен который FastAPI проверяет без БД-запроса.",
          "OAuth2PasswordBearer(tokenUrl='/token') — говорит Swagger где получать токен для авторизации.",
          "get_current_user с Depends — стандартная зависимость для защиты маршрутов.",
          "Никогда не храни пароли в открытом виде — только bcrypt хеши через passlib.",
          "SECRET_KEY в .env или переменных окружения — никогда не коммить в git!",
        ],
        pitfalls: [
          "jwt.decode требует algorithms=[ALGORITHM] — список, не строку!",
          "token_type='bearer' в ответе /token обязателен — без него Swagger не авторизует.",
          "ExpiredSignatureError и JWTError — оба нужно обрабатывать отдельно для точных сообщений об ошибках.",
        ],
        analogy: "JWT — как пропуск в здание. При входе (POST /token) охрана проверяет паспорт (логин/пароль) и выдаёт временный пропуск (JWT токен). На каждом следующем входе предъявляешь пропуск — охрана проверяет подпись и срок действия. Потерял пропуск (token утёк) — до истечения срока злоумышленник войдёт. Поэтому срок действия небольшой (15-60 мин), а SECRET_KEY меняется при компрометации.",
      },
      {
        heading: "Примеры и пояснения",
        tagline: "JWT-токены, OAuth2PasswordBearer, защита маршрутов — полные примеры",
        body:
          "### Упражнение 1: «OAuth2 схема и токен»\n\n" +
          "```python\n" +
          "from fastapi.security import OAuth2PasswordBearer  # {{0}} = OAuth2PasswordBearer\n" +
          "from jose import jwt                               # {{1}} = jwt\n\n" +
          "oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/token')  # {{2}} = tokenUrl\n\n" +
          "def create_token(email: str) -> str:\n" +
          "    expire = datetime.utcnow() + timedelta(minutes=30)\n" +
          "    return jwt.encode({'sub': email, 'exp': expire},  # {{3}} = sub\n" +
          "                     SECRET_KEY, ALGORITHM)           # {{4}} = ALGORITHM\n\n" +
          "def get_user(token: str = Depends(oauth2_scheme)):    # {{5}} = oauth2_scheme\n" +
          "    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])\n" +
          "    return payload['sub']  # {{6}} = sub\n" +
          "```\n\n" +
          "---\n\n" +
          "### Упражнение 2: «Login эндпоинт»\n\n" +
          "```python\n" +
          "from fastapi.security import OAuth2PasswordRequestForm  # {{0}} = OAuth2PasswordRequestForm\n\n" +
          "@app.post('/auth/token')\n" +
          "def login(form: OAuth2PasswordRequestForm = Depends()):  # {{1}} = Depends()\n" +
          "    user = USERS.get(form.username)                       # {{2}} = username\n" +
          "    if not user or user['password'] != form.password:    # {{3}} = password\n" +
          "        raise HTTPException(401)\n" +
          "    token = create_token(form.username)                   # {{4}} = username\n" +
          "    return {'access_token': token, 'token_type': 'bearer'}  # {{5}} = bearer\n" +
          "```\n\n" +
          "---\n\n" +
          "### Структура JWT и схемы аутентификации\n\n" +
          "**Что хранится в payload JWT.** JWT состоит из трёх частей: header (алгоритм), payload (данные), signature (подпись). В payload хранят: sub (subject — email или user_id), exp (время истечения в Unix timestamp), опционально role или scopes. Payload не зашифрован — его можно декодировать без ключа (это base64url). Подпись лишь гарантирует, что данные не были изменены. Поэтому в payload никогда не кладут пароли.\n\n" +
          "**Bearer токен vs Basic Auth.** Basic Auth передаёт base64(username:password) в каждом запросе — перехватив один запрос, атакующий получает пароль. Bearer — временный токен: пользователь вводит пароль один раз при логине, получает токен с ограниченным сроком жизни. Даже если токен похищен — он истечёт сам. В FastAPI: OAuth2PasswordBearer(tokenUrl=...) в Depends автоматически читает Bearer-токен из заголовка Authorization.\n\n" +
          "---\n\n" +
          "### Практика: Полный Auth API\n\n" +
          "Минимальный рабочий пример:\n" +
          "```python\n" +
          "from fastapi import FastAPI, Depends, HTTPException\n" +
          "from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm\n\n" +
          "USERS = {'admin@test.com': {'name': 'Admin', 'password': 'admin', 'role': 'admin'}}\n" +
          "oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/token')\n\n" +
          "def get_current_user(token: str = Depends(oauth2_scheme)):\n" +
          "    user = USERS.get(token)  # упрощённая проверка (token = email)\n" +
          "    if not user:\n" +
          "        raise HTTPException(status_code=401, detail='Неверный токен')\n" +
          "    return user\n\n" +
          "app = FastAPI()\n\n" +
          "@app.post('/auth/token')\n" +
          "def login(form: OAuth2PasswordRequestForm = Depends()):\n" +
          "    user = USERS.get(form.username)\n" +
          "    if not user or user['password'] != form.password:\n" +
          "        raise HTTPException(401, 'Неверные данные')\n" +
          "    return {'access_token': form.username, 'token_type': 'bearer'}\n\n" +
          "@app.get('/me')\n" +
          "def me(user = Depends(get_current_user)): return user\n\n" +
          "@app.get('/users')\n" +
          "def users(user = Depends(get_current_user)):\n" +
          "    if user['role'] != 'admin': raise HTTPException(403)\n" +
          "    return list(USERS.values())\n" +
          "```",
      },
    ],
    cheatSheet: [
      "`oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/token')`",
      "`token: str = Depends(oauth2_scheme)` — извлечь Bearer токен из заголовка.",
      "`jwt.encode({'sub': email, 'exp': expire}, SECRET_KEY, ALGORITHM)` — создать JWT.",
      "`jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])` — проверить и декодировать.",
      "`OAuth2PasswordRequestForm = Depends()` — form-data с username/password.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fa7-f1",
      title: "OAuth2 схема и создание токена",
      description: "Настрой OAuth2 схему и функцию создания JWT.",
      code:
        "from fastapi import FastAPI, Depends, HTTPException\n" +
        "from fastapi.security import {{0}}\n" +
        "from jose import {{1}}, JWTError\n" +
        "from datetime import datetime, timedelta\n\n" +
        "SECRET_KEY = 'my-secret'\n" +
        "ALGORITHM = 'HS256'\n\n" +
        "oauth2_scheme = OAuth2PasswordBearer({{2}}='/auth/token')\n\n" +
        "def create_token(email: str) -> str:\n" +
        "    expire = datetime.utcnow() + timedelta(minutes=30)\n" +
        "    return jwt.encode(\n" +
        "        {'{{3}}': email, 'exp': expire},\n" +
        "        SECRET_KEY,\n" +
        "        {{4}}=ALGORITHM\n" +
        "    )\n\n" +
        "def get_user(token: str = Depends({{5}})):\n" +
        "    try:\n" +
        "        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])\n" +
        "        return payload.get('{{6}}')\n" +
        "    except JWTError:\n" +
        "        raise HTTPException(401, 'Bad token')\n\n" +
        "app = FastAPI()\n" +
        "print('OAuth2 настроен!')",
      answers: [
        ["OAuth2PasswordBearer"],
        ["jwt"],
        ["tokenUrl"],
        ["sub"],
        ["algorithm"],
        ["oauth2_scheme"],
        ["sub"],
      ],
      hints: [
        "Класс схемы OAuth2 Bearer.",
        "Модуль для работы с JWT из jose.",
        "URL для получения токена.",
        "Стандартный claim для идентификатора пользователя.",
        "Параметр алгоритма для jwt.encode.",
        "Имя схемы для Depends.",
        "Тот же claim для получения email из payload.",
      ],
    },
    {
      type: "fill",
      id: "fa7-f2",
      title: "Login эндпоинт и защищённые маршруты",
      description: "Реализуй логин с OAuth2PasswordRequestForm.",
      code:
        "from fastapi import FastAPI, Depends, HTTPException\n" +
        "from fastapi.security import OAuth2PasswordBearer, {{0}}\n\n" +
        "USERS = {'admin@test.com': {'email': 'admin@test.com', 'password': 'admin', 'role': 'admin'}}\n" +
        "oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/token')\n\n" +
        "app = FastAPI()\n\n" +
        "@app.post('/auth/token')\n" +
        "def login(form: OAuth2PasswordRequestForm = {{1}}):\n" +
        "    user = USERS.get(form.{{2}})\n" +
        "    if not user or user['password'] != form.{{3}}:\n" +
        "        raise HTTPException(status_code=401, detail='Wrong credentials')\n" +
        "    return {\n" +
        "        'access_token': create_token(form.{{4}}),\n" +
        "        'token_type': '{{5}}'\n" +
        "    }\n\n" +
        "@app.get('/me')\n" +
        "def me(email: str = Depends(get_user)):\n" +
        "    return {'email': email}\n\n" +
        "print('Login endpoint готов!')",
      answers: [
        ["OAuth2PasswordRequestForm"],
        ["Depends()"],
        ["username"],
        ["password"],
        ["username"],
        ["bearer"],
      ],
      hints: [
        "Класс для form-data аутентификации.",
        "Depends() без аргументов — параметры берутся из form-data.",
        "Поле username в form.",
        "Поле password в form.",
        "Используем username как идентификатор.",
        "Стандартный тип Bearer токена.",
      ],
    },
    {
      type: "fill",
      id: "fa7-f3",
      title: "Ролевая авторизация",
      description: "Добавь проверку роли пользователя.",
      code:
        "from fastapi import FastAPI, Depends, HTTPException\n" +
        "from fastapi.security import OAuth2PasswordBearer\n\n" +
        "USERS = {\n" +
        "    'token_admin': {'email': 'admin@test.com', 'role': '{{0}}'},\n" +
        "    'token_user':  {'email': 'user@test.com',  'role': 'user'},\n" +
        "}\n" +
        "oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/token')\n\n" +
        "def get_user(token: str = {{1}}(oauth2_scheme)):\n" +
        "    user = USERS.get(token)\n" +
        "    if not user: raise HTTPException({{2}}, 'Bad token')\n" +
        "    return user\n\n" +
        "def require_admin(user: dict = Depends({{3}})):\n" +
        "    if user['role'] != 'admin':\n" +
        "        raise HTTPException({{4}}, 'Admins only')\n" +
        "    return user\n\n" +
        "app = FastAPI()\n\n" +
        "@app.get('/me')\n" +
        "def me(user = Depends(get_user)): return user\n\n" +
        "@app.get('/admin')\n" +
        "def admin(user = Depends({{5}})): return {'admin': user['email']}\n\n" +
        "@app.get('/users')\n" +
        "def users(user = Depends(require_admin)): return list(USERS.values())",
      answers: [
        ["admin"],
        ["Depends"],
        ["401"],
        ["get_user"],
        ["403"],
        ["require_admin"],
      ],
      hints: [
        "Роль администратора.",
        "Зависимость для извлечения токена.",
        "Код для неверного токена (не авторизован).",
        "Зависимость которую используем для проверки.",
        "Код для запрещённого доступа (нет прав).",
        "Зависимость для admin-маршрута.",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "fa7-q1",
      title: "Что хранится в payload JWT?",
      question:
        "В JWT payload стандартный claim `sub` содержит ___ пользователя. Введи короткое описание (что хранится в sub).",
      answers: [
        "идентификатор", "идентификатор пользователя", "subject", "субъект",
        "email", "user id", "userid", "user_id", "имя пользователя",
        "id пользователя", "логин", "identifier",
      ],
      hint: "sub = subject — кто является субъектом токена.",
      explanation:
        "sub (subject) — стандартный JWT claim, содержащий идентификатор пользователя. Обычно это email или user_id. Другие стандартные claims: exp (expiration), iat (issued at), iss (issuer), aud (audience).",
    },
    {
      type: "question",
      id: "fa7-q2",
      title: "Чем Bearer токен отличается от Basic Auth?",
      question:
        "В заголовке Authorization: Bearer <token> используется токен. В Basic Auth передаётся base64(username:___). Что передаётся вместо ___?",
      answers: [
        "password", "пароль", "passwd", "pwd", "secret",
        "base64 пароль", "пароль в base64",
      ],
      hint: "Basic Auth передаёт учётные данные — имя пользователя и ... в каждом запросе.",
      explanation:
        "Basic Auth: `Authorization: Basic base64('username:password')` — пароль в каждом запросе!\nBearer: `Authorization: Bearer <token>` — только токен, пароль не передаётся.\n\nBearer безопаснее: пароль передаётся только один раз при логине, дальше используется токен с коротким сроком жизни.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fa7-w1",
      title: "Полный Auth API",
      task:
        "Создай систему аутентификации FastAPI.\n\n" +
        "━━━ Что нужно ━━━\n\n" +
        "1. `USERS` словарь (email → {name, password, role})\n\n" +
        "2. `OAuth2PasswordBearer(tokenUrl='/auth/token')` — схема\n\n" +
        "3. `POST /auth/token` — принимает OAuth2PasswordRequestForm,\n" +
        "   проверяет пароль, возвращает {'access_token': email, 'token_type': 'bearer'}\n\n" +
        "4. `get_current_user(token: str = Depends(oauth2_scheme))` — зависимость:\n" +
        "   ищет пользователя по токену, HTTPException 401 если не найден\n\n" +
        "5. `GET /me` — возвращает текущего пользователя\n\n" +
        "6. `GET /users` — только для role=='admin' (используй get_current_user + проверку)\n\n" +
        "7. `POST /users/register` — создать нового пользователя\n\n" +
        "Всё через Depends!",
      hints: [
        "from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm",
        "oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/token')",
        "@app.post('/auth/token') def login(form: OAuth2PasswordRequestForm = Depends()): ...",
        "def get_current_user(token: str = Depends(oauth2_scheme)): user = USERS.get(token); if not user: raise HTTPException(401)",
        "@app.get('/me') def me(user = Depends(get_current_user)): return user",
      ],
      required: [
        "OAuth2PasswordBearer",
        "OAuth2PasswordRequestForm",
        "Depends()",
        "get_current_user",
        "Depends(oauth2_scheme)",
        "status_code=401",
        "@app.post('/auth/token')",
        "@app.get('/me')",
        "token_type",
      ],
      minLines: 50,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 8 · Middleware, CORS и Background Tasks
// ─────────────────────────────────────────────────────────────────────────────
const fa8: Round = {
  number: 8,
  title: "FastAPI · Middleware, CORS, Background Tasks",
  level: "Сложный",
  intro:
    "Middleware обрабатывает каждый запрос до и после маршрута. CORS необходим для работы с фронтендом. Background Tasks позволяют выполнять код после ответа.\n\n**В этом раунде:**\n• Middleware — что это и как писать\n• CORSMiddleware — настройка для React/Vue\n• Background Tasks — отложенные задачи\n• Startup/Shutdown события\n• Логирование запросов",
  lesson: {
    title: "Middleware, CORS и фоновые задачи",
    summary:
      "Middleware оборачивает каждый запрос. CORSMiddleware разрешает кросс-доменные запросы. BackgroundTasks выполняет код после отправки ответа.",
    readingMinutes: 14,
    sections: [
      {
        heading: "Middleware — обработка каждого запроса",
        tagline: "Middleware = код до маршрута + код после маршрута для КАЖДОГО запроса",
        body:
          "**Middleware** — функция, которая выполняется для КАЖДОГО HTTP-запроса:\n\n" +
          "```\n" +
          "Запрос → Middleware A → Middleware B → Маршрут → Middleware B → Middleware A → Ответ\n" +
          "```\n\n" +
          "**Middleware добавляется в стек (LIFO — last in, first out):**\n" +
          "Последний добавленный middleware выполняется первым на входящих запросах.\n\n" +
          "**Что делают middleware:**\n" +
          "1. **До маршрута:** проверить заголовки, логировать, добавить данные в request.state, проверить rate limit\n" +
          "2. **После маршрута:** добавить заголовки к ответу, логировать время выполнения, сжать ответ\n\n" +
          "**Встроенные middleware FastAPI:**\n\n" +
          "| Middleware | Функция |\n" +
          "|---|---|\n" +
          "| `CORSMiddleware` | CORS заголовки |\n" +
          "| `GZipMiddleware` | Сжатие ответов gzip |\n" +
          "| `HTTPSRedirectMiddleware` | Редирект HTTP → HTTPS |\n" +
          "| `TrustedHostMiddleware` | Проверка Host заголовка |\n" +
          "| `SessionMiddleware` | Cookie-based сессии |\n\n" +
          "**Своё middleware — два способа:**\n\n" +
          "1. Через декоратор `@app.middleware('http')`:\n" +
          "```python\n" +
          "@app.middleware('http')\n" +
          "async def my_middleware(request: Request, call_next):\n" +
          "    # ДО маршрута:\n" +
          "    start = time.time()\n" +
          "    # Выполнить маршрут:\n" +
          "    response = await call_next(request)\n" +
          "    # ПОСЛЕ маршрута:\n" +
          "    duration = time.time() - start\n" +
          "    response.headers['X-Time'] = f'{duration:.3f}s'\n" +
          "    return response\n" +
          "```\n\n" +
          "2. Через наследование от `BaseHTTPMiddleware`:\n" +
          "```python\n" +
          "from starlette.middleware.base import BaseHTTPMiddleware\n\n" +
          "class TimingMiddleware(BaseHTTPMiddleware):\n" +
          "    async def dispatch(self, request, call_next):\n" +
          "        start = time.time()\n" +
          "        response = await call_next(request)\n" +
          "        response.headers['X-Time'] = str(time.time() - start)\n" +
          "        return response\n\n" +
          "app.add_middleware(TimingMiddleware)\n" +
          "```",
        code:
          "from fastapi import FastAPI, Request\n" +
          "from fastapi.middleware.cors import CORSMiddleware\n" +
          "import time\n\n" +
          "app = FastAPI()\n\n" +
          "# CORS — разрешить запросы с фронтенда\n" +
          "app.add_middleware(\n" +
          "    CORSMiddleware,\n" +
          "    allow_origins=['http://localhost:3000', 'http://localhost:5173'],\n" +
          "    allow_credentials=True,\n" +
          "    allow_methods=['*'],  # GET, POST, PUT, DELETE...\n" +
          "    allow_headers=['*'],  # Authorization, Content-Type...\n" +
          ")\n\n" +
          "# Кастомное middleware для логирования\n" +
          "@app.middleware('http')\n" +
          "async def timing_middleware(request: Request, call_next):\n" +
          "    start = time.time()\n" +
          "    response = await call_next(request)\n" +
          "    duration = (time.time() - start) * 1000\n" +
          "    response.headers['X-Process-Time'] = f'{duration:.1f}ms'\n" +
          "    print(f'{request.method} {request.url.path} — {duration:.1f}ms')\n" +
          "    return response\n\n" +
          "@app.get('/')\n" +
          "def root(): return {'message': 'Hello'}\n\n" +
          "print('Middleware настроены!')",
        keyTakeaways: [
          "await call_next(request) — передаёт запрос дальше (в маршрут). Без этого запрос зависнет.",
          "CORSMiddleware — обязательна если React/Vue на другом порту обращается к API.",
          "allow_origins=['*'] — разрешить всем (только для dev!). В продакшене — конкретные домены.",
        ],
        pitfalls: [
          "Не вызвать await call_next(request) → запрос зависнет навечно. Всегда вызывай!",
          "allow_origins=['*'] с allow_credentials=True — ошибка! CORS не разрешает это сочетание.",
        ],
        analogy:
          "Middleware — как охрана на входе в ресторан. Сначала проверяет одежду (запрос) → пускает внутрь (маршрут) → при выходе говорит 'приятного аппетита' (заголовки ответа). Каждый гость проходит через охрану.",
      },
      {
        heading: "Background Tasks — код после ответа",
        tagline: "BackgroundTasks = отправляем ответ клиенту, потом делаем тяжёлую работу",
        body:
          "**Зачем нужны Background Tasks:**\n\n" +
          "Клиент не должен ждать пока сервер:\n" +
          "- Отправляет email\n" +
          "- Записывает в лог-файл\n" +
          "- Генерирует отчёт\n" +
          "- Обрабатывает изображение\n" +
          "- Отправляет уведомление\n\n" +
          "**Принцип работы:**\n" +
          "```\n" +
          "1. Клиент → POST /register\n" +
          "2. Сервер: создаёт пользователя\n" +
          "3. Сервер: планирует email (НЕ отправляет сразу!)\n" +
          "4. Сервер → {'message': 'created'} → Клиент (получает сразу!)\n" +
          "5. [В фоне]: отправляет email (клиент уже получил ответ)\n" +
          "```\n\n" +
          "**BackgroundTasks — встроен в FastAPI, не требует Redis или Celery!**\n\n" +
          "```python\n" +
          "@app.post('/register')\n" +
          "def register(user: UserCreate, background_tasks: BackgroundTasks):\n" +
          "    create_user(user)  # основная работа\n" +
          "    background_tasks.add_task(send_welcome_email, user.email)  # в фон\n" +
          "    background_tasks.add_task(log_activity, 'register', user.email)  # тоже\n" +
          "    return {'message': 'Пользователь создан'}  # ← клиент получает сразу\n" +
          "    # email отправится ПОСЛЕ этого return\n" +
          "```\n\n" +
          "**Когда НЕ подходят BackgroundTasks:**\n" +
          "- CPU-heavy задачи (они блокируют event loop)\n" +
          "- Задачи дольше нескольких секунд\n" +
          "- Задачи, которые нужно retry при ошибке\n" +
          "- Для этого — Celery, Dramatiq, RQ или FastAPI + asyncio.create_task()",
        code:
          "from fastapi import FastAPI, BackgroundTasks\n" +
          "from pydantic import BaseModel\n" +
          "import time\n\n" +
          "app = FastAPI()\n\n" +
          "# Функции для фоновых задач\n" +
          "def send_welcome_email(email: str, name: str):\n" +
          "    time.sleep(0.05)  # имитация отправки\n" +
          "    print(f'[Фон] Письмо отправлено на {email} для {name}')\n\n" +
          "def log_activity(action: str, user_id: int):\n" +
          "    print(f'[Фон] Log: пользователь {user_id} → {action}')\n\n" +
          "class UserCreate(BaseModel):\n" +
          "    name: str\n" +
          "    email: str\n\n" +
          "@app.post('/register', status_code=201)\n" +
          "def register(user: UserCreate, background_tasks: BackgroundTasks):\n" +
          "    # Планируем фоновые задачи:\n" +
          "    background_tasks.add_task(send_welcome_email, user.email, user.name)\n" +
          "    background_tasks.add_task(log_activity, 'register', 42)\n" +
          "    # Ответ возвращается НЕМЕДЛЕННО:\n" +
          "    return {'message': f'Пользователь {user.name} создан'}\n\n" +
          "print('BackgroundTasks пример:')\n" +
          "u = UserCreate(name='Анна', email='anna@test.com')\n" +
          "bg = BackgroundTasks()\n" +
          "result = register(u, bg)\n" +
          "print('Ответ:', result)\n" +
          "# В реальной среде фоновые задачи выполнились бы после ответа",
        keyTakeaways: [
          "background_tasks.add_task(fn, arg1, arg2) — fn будет вызвана с arg1 и arg2 после ответа.",
          "BackgroundTasks в параметре маршрута — FastAPI инжектит автоматически.",
          "Для CPU-heavy задач используй Celery. BackgroundTasks для лёгкого IO (email, log).",
        ],
        pitfalls: [
          "BackgroundTasks выполняются в том же process — если сервер упадёт, задачи потеряются.",
          "Не передавай db-сессию в background task — она может быть закрыта к тому времени.",
        ],
      },
      {
        heading: "🚀 Мастер-гид: Middleware и Background Tasks (Round 8)",
        tagline: "CORS, timing middleware, logging, background задачи — реальные паттерны для продакшена",
        body:
          "## Middleware — обёртка вокруг каждого запроса\n\n" +
          "Middleware выполняется ДО и ПОСЛЕ каждого обработчика маршрута:\n\n" +
          "```\n" +
          "Запрос → [Middleware 1 вход] → [Middleware 2 вход] → [Маршрут] → [Middleware 2 выход] → [Middleware 1 выход] → Ответ\n" +
          "```\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, Request\n" +
          "from fastapi.middleware.cors import CORSMiddleware\n" +
          "import time\n\n" +
          "app = FastAPI()\n\n" +
          "# 1. CORS Middleware — обязательно для работы с фронтендом:\n" +
          "app.add_middleware(\n" +
          "    CORSMiddleware,\n" +
          "    allow_origins=['http://localhost:3000', 'https://mysite.com'],  # или ['*'] для разработки\n" +
          "    allow_credentials=True,  # для cookies и Authorization заголовков\n" +
          "    allow_methods=['*'],     # GET, POST, PUT, DELETE...\n" +
          "    allow_headers=['*'],     # Authorization, Content-Type...\n" +
          ")\n\n" +
          "# 2. Кастомный middleware — логирование и timing:\n" +
          "@app.middleware('http')\n" +
          "async def log_requests(request: Request, call_next):\n" +
          "    start = time.time()\n" +
          "    # ── ДО обработчика маршрута ──\n" +
          "    print(f'→ {request.method} {request.url}')\n" +
          "\n" +
          "    response = await call_next(request)  # ← вызываем маршрут\n" +
          "\n" +
          "    # ── ПОСЛЕ обработчика маршрута ──\n" +
          "    elapsed = time.time() - start\n" +
          "    print(f'← {response.status_code} ({elapsed*1000:.1f}ms)')\n" +
          "    response.headers['X-Process-Time'] = f'{elapsed:.4f}'\n" +
          "    return response\n\n" +
          "@app.get('/items')\n" +
          "def get_items(): return [{'id': 1}]\n\n" +
          "print('Middleware настроен!')\n" +
          "print('Маршруты:', [r.path for r in app.routes if hasattr(r, 'path')])\n" +
          "```\n\n" +
          "## Порядок middleware имеет значение\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, Request\n\n" +
          "app = FastAPI()\n\n" +
          "# Middleware добавляются в стек — ПОСЛЕДНИЙ добавленный выполняется ПЕРВЫМ:\n" +
          "@app.middleware('http')\n" +
          "async def middleware_a(request: Request, call_next):\n" +
          "    print('A: ДО')          # выполняется 2-м\n" +
          "    response = await call_next(request)\n" +
          "    print('A: ПОСЛЕ')       # выполняется 2-м после маршрута\n" +
          "    return response\n\n" +
          "@app.middleware('http')\n" +
          "async def middleware_b(request: Request, call_next):\n" +
          "    print('B: ДО')          # выполняется 1-м (добавлен последним)\n" +
          "    response = await call_next(request)\n" +
          "    print('B: ПОСЛЕ')       # выполняется 1-м после маршрута\n" +
          "    return response\n\n" +
          "@app.get('/')\n" +
          "def root(): return 'ok'\n\n" +
          "# Порядок выполнения при запросе:\n" +
          "# B: ДО → A: ДО → root() → A: ПОСЛЕ → B: ПОСЛЕ\n" +
          "print('Порядок: B → A → route → A → B')\n" +
          "```\n\n" +
          "## Background Tasks — задачи после ответа клиенту\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, BackgroundTasks\n" +
          "import time\n\n" +
          "app = FastAPI()\n\n" +
          "# Фоновые функции — обычные Python-функции:\n" +
          "def send_email(email: str, subject: str, body: str):\n" +
          "    # Имитация отправки (реально: smtp, SendGrid и т.д.)\n" +
          "    time.sleep(1)  # долгая операция не блокирует ответ клиенту!\n" +
          "    print(f'📧 Email отправлен на {email}: [{subject}] {body}')\n\n" +
          "def log_signup(user_id: int):\n" +
          "    print(f'📊 Новый пользователь #{user_id} зарегистрирован')\n\n" +
          "@app.post('/register')\n" +
          "def register_user(\n" +
          "    email: str,\n" +
          "    background_tasks: BackgroundTasks,  # ← FastAPI инжектирует\n" +
          "):\n" +
          "    user_id = 42  # создаём пользователя...\n\n" +
          "    # Добавляем фоновые задачи — выполнятся ПОСЛЕ ответа:\n" +
          "    background_tasks.add_task(send_email, email, 'Добро пожаловать!', 'Вы зарегистрированы')\n" +
          "    background_tasks.add_task(log_signup, user_id)\n\n" +
          "    # Клиент получает ответ СРАЗУ, не ждёт email:\n" +
          "    return {'status': 'registered', 'user_id': user_id, 'message': 'Email будет отправлен'}\n\n" +
          "# Тест (фоновые задачи выполняются синхронно при тестировании напрямую):\n" +
          "tasks = BackgroundTasks()\n" +
          "result = register_user('test@mail.com', tasks)\n" +
          "print('Ответ клиенту:', result)\n" +
          "# Выполним задачи вручную для теста:\n" +
          "for task in tasks.tasks:\n" +
          "    task.func(*task.args, **task.kwargs)\n" +
          "```\n\n" +
          "## Как подходить к упражнениям раунда 8\n\n" +
          "**CORS упражнения:**\n" +
          "```python\n" +
          "# Шаблон CORS — запомни:\n" +
          "from fastapi.middleware.cors import CORSMiddleware\n" +
          "app.add_middleware(\n" +
          "    CORSMiddleware,\n" +
          "    allow_origins=['*'],      # или конкретные домены\n" +
          "    allow_credentials=True,\n" +
          "    allow_methods=['*'],\n" +
          "    allow_headers=['*'],\n" +
          ")\n" +
          "```\n\n" +
          "**Middleware упражнения:**\n" +
          "```python\n" +
          "# Шаблон кастомного middleware:\n" +
          "@app.middleware('http')\n" +
          "async def my_middleware(request: Request, call_next):\n" +
          "    # до маршрута...\n" +
          "    response = await call_next(request)  # call_next ОБЯЗАТЕЛЕН!\n" +
          "    # после маршрута...\n" +
          "    return response  # ОБЯЗАТЕЛЬНО вернуть response!\n" +
          "```\n\n" +
          "**BackgroundTasks упражнения:**\n" +
          "```python\n" +
          "# BackgroundTasks — параметр функции:\n" +
          "def route(bg: BackgroundTasks):\n" +
          "    bg.add_task(function, arg1, arg2)  # функция без скобок!\n" +
          "    return {'status': 'ok'}  # клиент не ждёт function()\n" +
          "```",
        code:
          "from fastapi import FastAPI, Request, BackgroundTasks\n" +
          "import time\n\n" +
          "app = FastAPI()\n\n" +
          "# ── Timing Middleware ──\n" +
          "@app.middleware('http')\n" +
          "async def add_process_time(request: Request, call_next):\n" +
          "    start = time.time()\n" +
          "    response = await call_next(request)\n" +
          "    process_time = time.time() - start\n" +
          "    response.headers['X-Process-Time'] = str(round(process_time * 1000, 2)) + 'ms'\n" +
          "    return response\n\n" +
          "# ── Auth check Middleware ──\n" +
          "@app.middleware('http')\n" +
          "async def check_user_agent(request: Request, call_next):\n" +
          "    ua = request.headers.get('user-agent', 'unknown')\n" +
          "    if 'bot' in ua.lower() and request.url.path not in ['/', '/health']:\n" +
          "        from fastapi.responses import JSONResponse\n" +
          "        return JSONResponse({'detail': 'Боты не допускаются'}, status_code=403)\n" +
          "    return await call_next(request)\n\n" +
          "# ── Background notifications ──\n" +
          "LOG = []\n\n" +
          "def log_action(action: str, user_id: int):\n" +
          "    LOG.append({'action': action, 'user_id': user_id, 'time': 'now'})\n" +
          "    print(f'📊 Logged: {action} by user#{user_id}')\n\n" +
          "def notify_admin(message: str):\n" +
          "    print(f'🔔 Admin notification: {message}')\n\n" +
          "@app.post('/items')\n" +
          "def create_item(name: str, user_id: int, bg: BackgroundTasks):\n" +
          "    bg.add_task(log_action, 'create_item', user_id)\n" +
          "    bg.add_task(notify_admin, f'Новый item: {name}')\n" +
          "    return {'id': 1, 'name': name, 'status': 'created'}\n\n" +
          "@app.get('/health')\n" +
          "def health(): return {'status': 'ok'}\n\n" +
          "@app.get('/log')\n" +
          "def get_log(): return LOG\n\n" +
          "# Тест:\n" +
          "bg = BackgroundTasks()\n" +
          "print('Создан:', create_item('Laptop', 42, bg))\n" +
          "for t in bg.tasks: t.func(*t.args, **t.kwargs)  # запуск фоновых задач\n" +
          "print('Лог:', get_log())",
        keyTakeaways: [
          "Middleware выполняется до И после каждого запроса — response = await call_next(request) разделяет до/после.",
          "CORS обязателен для работы с браузерным фронтендом — без него браузер заблокирует запросы.",
          "BackgroundTasks.add_task(fn, *args) — клиент не ждёт фоновой задачи. Идеально для email, логов.",
          "Последний добавленный middleware выполняется первым — учитывай порядок для logging + auth.",
          "Не передавай SQLAlchemy db-сессию в background task — она закрыта к тому времени.",
        ],
        pitfalls: [
          "Забыл return response в middleware — запрос зависнет навсегда!",
          "await call_next(request) — обязательно await, это async middleware.",
          "BackgroundTask для критических операций — если сервер упадёт, задача потеряется. Для важного — Celery/RQ.",
        ],
        analogy: "Middleware — как охрана на входе и выходе из здания. Охрана при входе (до call_next): проверяет пропуск, логирует. Охрана при выходе (после call_next): проверяет что не вынесли лишнего, добавляет штамп (заголовок). BackgroundTasks — как курьер: клиент получил чек (response), курьер уже едет доставлять посылку (фоновая задача). Клиент не стоит и не ждёт курьера.",
      },
      {
        heading: "Примеры и пояснения",
        tagline: "Middleware, CORS, BackgroundTasks — полные рабочие примеры",
        body:
          "### Упражнение 1: «CORSMiddleware настройка»\n\n" +
          "```python\n" +
          "from fastapi.middleware.cors import CORSMiddleware  # {{0}} = cors, {{1}} = CORSMiddleware\n\n" +
          "app.add_middleware(                                  # {{2}} = add\n" +
          "    CORSMiddleware,\n" +
          "    allow_origins=['http://localhost:3000',\n" +
          "                   'http://localhost:5173'],         # {{3}} = 5173 (Vite!)\n" +
          "    allow_credentials=True,                         # {{4}} = credentials\n" +
          "    allow_methods=['*'],                            # {{5}} = methods\n" +
          ")\n" +
          "```\n\n" +
          "**Порт 5173** — это дефолтный порт Vite/React в режиме разработки.\n\n" +
          "---\n\n" +
          "### Упражнение 2: «Кастомное Middleware»\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, Request  # {{0}} = Request\n\n" +
          "@app.middleware('http')               # {{1}} = middleware, {{2}} = http\n" +
          "async def my_middleware(request: Request, call_next):\n" +
          "    response = await call_next(request)  # {{3}} = await\n" +
          "    response.headers['X-Time'] = '...'  # {{4}} = headers\n" +
          "    return response                      # {{5}} = return\n" +
          "```\n\n" +
          "---\n\n" +
          "### Упражнение 3: «Background Tasks»\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, BackgroundTasks  # {{0}} = BackgroundTasks\n\n" +
          "@app.post('/send')\n" +
          "def send(bg: BackgroundTasks):  # {{1}} = BackgroundTasks\n" +
          "    bg.add_task(send_email, 'test@test.com')  # {{2}} = add_task\n" +
          "    return {'queued': True}  # {{3}} = True\n" +
          "```\n\n" +
          "---\n\n" +
          "### Middleware и фоновые задачи\n\n" +
          "**CORSMiddleware — разрешение кросс-доменных запросов.** CORS — браузерный механизм безопасности: браузер блокирует запрос с localhost:3000 к API на localhost:8000, потому что это разные origins. CORSMiddleware добавляет заголовок Access-Control-Allow-Origin к ответам. allow_origins=[] со звёздочкой разрешает всем (только для разработки!), в продакшене указывай конкретные домены. Также настраивай allow_methods и allow_headers. Регистрируется через app.add_middleware().\n\n" +
          "**BackgroundTasks — задачи после отправки ответа.** Фоновая задача выполняется ПОСЛЕ того как HTTP-ответ уже отправлен клиенту — клиент не ждёт её завершения. Идеально для: отправки email после регистрации, записи в лог, обновления кэша, отправки уведомлений. Добавляешь параметр background_tasks: BackgroundTasks в сигнатуру маршрута, затем вызываешь background_tasks.add_task(fn, arg1, arg2). Для тяжёлых долгих операций используй Celery или ARQ — BackgroundTasks для коротких задач.",
      },
    ],
    cheatSheet: [
      "`app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])`",
      "`@app.middleware('http') async def mw(request, call_next): resp = await call_next(request); return resp`",
      "`background_tasks: BackgroundTasks` в параметрах; `.add_task(fn, *args)` для добавления.",
      "`@app.on_event('startup') async def startup(): ...` — событие старта (устаревшее).",
      "Используй lifespan вместо on_event: `@asynccontextmanager async def lifespan(app): yield`",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fa8-f1",
      title: "CORSMiddleware настройка",
      description: "Настрой CORS для работы с React-фронтендом.",
      code:
        "from fastapi import FastAPI\n" +
        "from fastapi.middleware.{{0}} import {{1}}\n\n" +
        "app = FastAPI()\n\n" +
        "app.{{2}}_middleware(\n" +
        "    CORSMiddleware,\n" +
        "    allow_origins=[\n" +
        "        'http://localhost:3000',\n" +
        "        'http://localhost:{{3}}',\n" +
        "    ],\n" +
        "    allow_{{4}}=True,\n" +
        "    allow_{{5}}=['*'],\n" +
        "    allow_headers=['*'],\n" +
        ")\n\n" +
        "@app.get('/api/data')\n" +
        "def data():\n" +
        "    return {'key': 'value'}\n\n" +
        "print('CORS настроен')",
      answers: [
        ["cors"],
        ["CORSMiddleware"],
        ["add"],
        ["5173"],
        ["credentials"],
        ["methods"],
      ],
      hints: [
        "Название модуля middleware (название темы).",
        "Класс CORS middleware (с большой буквы).",
        "Метод app для добавления middleware.",
        "Порт Vite/React по умолчанию.",
        "Параметр для разрешения cookie/session.",
        "Параметр для разрешения HTTP-методов.",
      ],
    },
    {
      type: "fill",
      id: "fa8-f2",
      title: "Кастомное Middleware",
      description: "Создай middleware для логирования и добавления заголовков.",
      code:
        "from fastapi import FastAPI, {{0}}\n" +
        "import time\n\n" +
        "app = FastAPI()\n\n" +
        "@app.{{1}}('{{2}}')\n" +
        "async def timing_middleware(request: Request, call_next):\n" +
        "    start = time.time()\n" +
        "    response = {{3}} call_next(request)\n" +
        "    duration = time.time() - start\n" +
        "    response.{{4}}['X-Time'] = f'{duration:.3f}s'\n" +
        "    {{5}} response\n\n" +
        "@app.get('/')\n" +
        "def root(): return {'ok': True}\n\n" +
        "print('Middleware создан!')",
      answers: [
        ["Request"],
        ["middleware"],
        ["http"],
        ["await"],
        ["headers"],
        ["return"],
      ],
      hints: [
        "Класс для доступа к данным запроса.",
        "Декоратор для регистрации middleware.",
        "Тип middleware (HTTP).",
        "Ключевое слово для асинхронного вызова.",
        "Атрибут ответа для заголовков.",
        "Вернуть изменённый ответ.",
      ],
    },
    {
      type: "fill",
      id: "fa8-f3",
      title: "Background Tasks",
      description: "Используй BackgroundTasks для выполнения задач после ответа.",
      code:
        "from fastapi import FastAPI, {{0}}\n" +
        "from pydantic import BaseModel\n" +
        "import time\n\n" +
        "app = FastAPI()\n\n" +
        "def send_email(to: str, subject: str):\n" +
        "    time.sleep(0.1)\n" +
        "    print(f'Email sent to {to}: {subject}')\n\n" +
        "def write_log(msg: str):\n" +
        "    print(f'Log: {msg}')\n\n" +
        "class Notification(BaseModel):\n" +
        "    email: str\n" +
        "    message: str\n\n" +
        "@app.post('/notify')\n" +
        "def notify(n: Notification, bg: {{1}}):\n" +
        "    bg.{{2}}(send_email, n.email, n.message)\n" +
        "    bg.add_task(write_log, f'Notification to {n.email}')\n" +
        "    return {'queued': {{3}}}\n\n" +
        "@app.post('/bulk-notify')\n" +
        "def bulk(emails: list[str], background_tasks: {{4}}):\n" +
        "    for email in emails:\n" +
        "        background_tasks.add_task(send_email, email, 'Bulk notification')\n" +
        "    return {'count': {{5}}(emails)}",
      answers: [
        ["BackgroundTasks"],
        ["BackgroundTasks"],
        ["add_task"],
        ["True"],
        ["BackgroundTasks"],
        ["len"],
      ],
      hints: [
        "Класс FastAPI для управления фоновыми задачами.",
        "Тип параметра — тот же класс.",
        "Метод для добавления задачи.",
        "Флаг успешного добавления в очередь.",
        "Тип параметра для bulk.",
        "Функция подсчёта элементов.",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "fa8-q1",
      title: "Что делает CORSMiddleware?",
      question:
        "CORS (Cross-Origin Resource Sharing) — механизм браузера. Когда React на localhost:3000 делает запрос к API на localhost:8000, браузер блокирует его без специальных ___. CORSMiddleware добавляет эти заголовки.",
      answers: [
        "заголовков", "CORS заголовков", "заголовки", "headers",
        "Access-Control заголовков", "cors headers", "response headers",
        "http headers", "заголовки ответа", "access control заголовков",
      ],
      hint: "CORS работает через HTTP-заголовки в ответе сервера.",
      explanation:
        "CORSMiddleware добавляет в ответ заголовки:\n• `Access-Control-Allow-Origin: http://localhost:3000`\n• `Access-Control-Allow-Methods: GET, POST, ...`\n• `Access-Control-Allow-Headers: Authorization, ...`\n\nБраузер видит эти заголовки и разрешает JavaScript делать кросс-доменные запросы.",
    },
    {
      type: "question",
      id: "fa8-q2",
      title: "Когда выполняется background task?",
      question:
        "В какой момент выполняется функция, добавленная через `background_tasks.add_task()`?",
      answers: [
        "после отправки ответа клиенту",
        "после ответа",
        "после отправки HTTP-ответа",
        "когда клиент уже получил ответ",
        "фоном после ответа",
        "after response",
        "после return",
        "в фоне после завершения маршрута",
        "после отправки ответа",
        "после завершения запроса",
      ],
      hint: "Клиент НЕ ждёт фоновую задачу — это её главное преимущество.",
      explanation:
        "BackgroundTasks выполняются ПОСЛЕ того как FastAPI отправил HTTP-ответ клиенту. Клиент не ждёт. Порядок:\n1. Маршрут возвращает данные\n2. FastAPI отправляет HTTP-ответ клиенту\n3. [Потом] выполняются все задачи из BackgroundTasks",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fa8-w1",
      title: "API с Middleware и фоновыми задачами",
      task:
        "Создай FastAPI с middleware и фоновыми задачами.\n\n" +
        "━━━ Что нужно ━━━\n\n" +
        "1. **CORSMiddleware** — разрешить localhost:3000 и localhost:5173\n\n" +
        "2. **Timing Middleware** (@app.middleware('http')) — добавляй заголовок X-Process-Time к каждому ответу\n\n" +
        "3. **Background task функция** `send_notification(email: str, message: str)` — выводит в консоль\n\n" +
        "4. **POST /events** — принимает {email: str, event: str}, планирует фоновую отправку уведомления, возвращает {'status': 'queued'}\n\n" +
        "5. **GET /health** — возвращает {'status': 'ok'}\n\n" +
        "Запусти и убедись в отсутствии ошибок!",
      hints: [
        "from fastapi import FastAPI, BackgroundTasks, Request; from fastapi.middleware.cors import CORSMiddleware",
        "app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])",
        "@app.middleware('http') async def timing(request, call_next): ... response = await call_next(request)",
        "def send_notification(email, message): print(f'Notif to {email}: {message}')",
        "@app.post('/events') def create_event(data: EventCreate, bg: BackgroundTasks): bg.add_task(send_notification, data.email, data.event)",
      ],
      required: [
        "CORSMiddleware",
        "add_middleware",
        "@app.middleware",
        "call_next",
        "BackgroundTasks",
        "add_task",
        "send_notification",
        "@app.post('/events')",
        "@app.get('/health')",
      ],
      minLines: 45,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 9 · Тестирование FastAPI
// ─────────────────────────────────────────────────────────────────────────────
const fa9: Round = {
  number: 9,
  title: "FastAPI · Тестирование с TestClient",
  level: "Сложный",
  intro:
    "FastAPI даёт TestClient (на базе httpx) для тестирования прямо в Python без запуска сервера. Pytest и dependency_overrides делают тестирование удобным.\n\n**В этом раунде:**\n• TestClient — тесты без запуска сервера\n• pytest fixtures\n• dependency_overrides — замена зависимостей\n• Тестирование CRUD\n• Параметризованные тесты",
  lesson: {
    title: "Тестирование FastAPI — TestClient и pytest",
    summary:
      "TestClient позволяет тестировать FastAPI-маршруты как настоящий HTTP-клиент, но без сетевого сервера. dependency_overrides подменяет зависимости (например, БД) в тестах.",
    readingMinutes: 14,
    sections: [
      {
        heading: "TestClient — тестируй как HTTP-клиент",
        tagline: "client = TestClient(app) — реальные HTTP запросы без сервера",
        body:
          "**TestClient** (из `fastapi.testclient`) — это синхронный HTTP-клиент для тестирования FastAPI.\n\n" +
          "**Как работает:**\n" +
          "- Не запускает настоящий сервер\n" +
          "- Вызывает ASGI app напрямую через транспорт httpx\n" +
          "- Полностью имитирует HTTP запросы (статус-коды, заголовки, тело)\n\n" +
          "**Установка:**\n" +
          "```bash\n" +
          "pip install pytest httpx\n" +
          "# fastapi[all] уже включает httpx\n" +
          "```\n\n" +
          "**Базовый тест:**\n" +
          "```python\n" +
          "from fastapi.testclient import TestClient\n" +
          "from main import app  # твой FastAPI app\n\n" +
          "client = TestClient(app)\n\n" +
          "def test_get_root():\n" +
          "    response = client.get('/')           # GET запрос\n" +
          "    assert response.status_code == 200   # проверяем статус\n" +
          "    assert response.json() == {'msg': 'ok'}  # проверяем JSON\n\n" +
          "def test_create_item():\n" +
          "    response = client.post('/items', json={'name': 'Test', 'price': 9.99})\n" +
          "    assert response.status_code == 201\n" +
          "    data = response.json()\n" +
          "    assert data['name'] == 'Test'\n" +
          "    assert 'id' in data\n\n" +
          "def test_not_found():\n" +
          "    response = client.get('/items/999')\n" +
          "    assert response.status_code == 404\n" +
          "```\n\n" +
          "**Запуск тестов:**\n" +
          "```bash\n" +
          "pytest test_main.py -v   # -v = verbose (подробный вывод)\n" +
          "pytest -v -k 'test_get'  # запустить только тесты со словом 'test_get'\n" +
          "```\n\n" +
          "**pytest fixtures:**\n" +
          "```python\n" +
          "import pytest\n\n" +
          "@pytest.fixture\n" +
          "def client():  # fixture создаёт клиент для каждого теста\n" +
          "    return TestClient(app)\n\n" +
          "def test_something(client):  # client передаётся автоматически\n" +
          "    response = client.get('/')\n" +
          "    assert response.status_code == 200\n" +
          "```",
        code:
          "from fastapi import FastAPI, HTTPException\n" +
          "from fastapi.testclient import TestClient\n" +
          "from pydantic import BaseModel\n\n" +
          "app = FastAPI()\n\n" +
          "class Item(BaseModel):\n" +
          "    name: str\n" +
          "    price: float\n\n" +
          "items_db = {1: {'id': 1, 'name': 'Apple', 'price': 1.5}}\n\n" +
          "@app.get('/items')\n" +
          "def list_items(): return list(items_db.values())\n\n" +
          "@app.get('/items/{item_id}')\n" +
          "def get_item(item_id: int):\n" +
          "    if item_id not in items_db:\n" +
          "        raise HTTPException(404, 'Not found')\n" +
          "    return items_db[item_id]\n\n" +
          "@app.post('/items', status_code=201)\n" +
          "def create_item(item: Item):\n" +
          "    new_id = max(items_db.keys()) + 1\n" +
          "    items_db[new_id] = {'id': new_id, **item.model_dump()}\n" +
          "    return items_db[new_id]\n\n" +
          "# === ТЕСТЫ ===\n" +
          "client = TestClient(app)\n\n" +
          "def test_list_items():\n" +
          "    r = client.get('/items')\n" +
          "    assert r.status_code == 200\n" +
          "    assert isinstance(r.json(), list)\n\n" +
          "def test_get_item():\n" +
          "    r = client.get('/items/1')\n" +
          "    assert r.status_code == 200\n" +
          "    assert r.json()['name'] == 'Apple'\n\n" +
          "def test_item_not_found():\n" +
          "    r = client.get('/items/999')\n" +
          "    assert r.status_code == 404\n\n" +
          "def test_create_item():\n" +
          "    r = client.post('/items', json={'name': 'Banana', 'price': 0.5})\n" +
          "    assert r.status_code == 201\n" +
          "    assert r.json()['name'] == 'Banana'\n\n" +
          "# Запускаем тесты:\n" +
          "test_list_items()\n" +
          "test_get_item()\n" +
          "test_item_not_found()\n" +
          "test_create_item()\n" +
          "print('Все тесты прошли!')",
        keyTakeaways: [
          "TestClient(app) — клиент для тестов без запуска сервера.",
          "response.status_code и response.json() — основные проверки.",
          "client.post('/items', json={...}) — POST с JSON телом.",
        ],
        pitfalls: [
          "client.get() — синхронный вызов. Для async тестов используй pytest-asyncio.",
          "Если тесты изменяют items_db — данные сохраняются между тестами! Используй fixtures с reset.",
        ],
      },
      {
        heading: "dependency_overrides — замена зависимостей в тестах",
        tagline: "app.dependency_overrides — подмени get_db() на in-memory БД в тестах",
        body:
          "**Главная проблема тестирования:** тесты не должны работать с реальной БД, отправлять реальные email, использовать реальные API.\n\n" +
          "**dependency_overrides — решение:**\n" +
          "```python\n" +
          "# В тестах подменяем get_db на тестовую версию:\n" +
          "def override_get_db():\n" +
          "    try:\n" +
          "        yield test_db  # in-memory SQLite\n" +
          "    finally:\n" +
          "        pass\n\n" +
          "app.dependency_overrides[get_db] = override_get_db\n" +
          "```\n\n" +
          "**Шаблон для тестов с SQLAlchemy:**\n" +
          "```python\n" +
          "import pytest\n" +
          "from sqlalchemy import create_engine\n" +
          "from sqlalchemy.orm import sessionmaker\n\n" +
          "SQLALCHEMY_TEST_URL = 'sqlite:///:memory:'\n\n" +
          "@pytest.fixture\n" +
          "def test_app():\n" +
          "    # Создаём тестовую БД:\n" +
          "    engine = create_engine(SQLALCHEMY_TEST_URL,\n" +
          "                          connect_args={'check_same_thread': False})\n" +
          "    TestSession = sessionmaker(bind=engine)\n" +
          "    Base.metadata.create_all(engine)\n\n" +
          "    # Подменяем get_db:\n" +
          "    def override_db():\n" +
          "        db = TestSession()\n" +
          "        try: yield db\n" +
          "        finally: db.close()\n\n" +
          "    app.dependency_overrides[get_db] = override_db\n" +
          "    yield TestClient(app)\n" +
          "    # После тестов:\n" +
          "    app.dependency_overrides.clear()\n" +
          "    Base.metadata.drop_all(engine)\n" +
          "```\n\n" +
          "**Подмена авторизации:**\n" +
          "```python\n" +
          "def override_auth():\n" +
          "    return {'email': 'test@test.com', 'role': 'admin'}\n\n" +
          "app.dependency_overrides[get_current_user] = override_auth\n" +
          "# Теперь все маршруты считают что пользователь admin@test.com\n" +
          "```",
        code:
          "from fastapi import FastAPI, Depends\n" +
          "from fastapi.testclient import TestClient\n\n" +
          "app = FastAPI()\n\n" +
          "# Оригинальные зависимости:\n" +
          "def get_settings():\n" +
          "    return {'debug': False, 'env': 'production'}\n\n" +
          "def get_current_user():\n" +
          "    return {'email': 'real@test.com', 'role': 'user'}\n\n" +
          "@app.get('/settings')\n" +
          "def settings(cfg = Depends(get_settings)):\n" +
          "    return cfg\n\n" +
          "@app.get('/me')\n" +
          "def me(user = Depends(get_current_user)):\n" +
          "    return user\n\n" +
          "@app.get('/admin')\n" +
          "def admin(user = Depends(get_current_user)):\n" +
          "    if user['role'] != 'admin':\n" +
          "        from fastapi import HTTPException\n" +
          "        raise HTTPException(403)\n" +
          "    return {'admin': True}\n\n" +
          "# === ТЕСТЫ С ПЕРЕОПРЕДЕЛЕНИЕМ ===\n\n" +
          "# Подмена зависимостей:\n" +
          "app.dependency_overrides[get_settings] = lambda: {'debug': True, 'env': 'test'}\n" +
          "app.dependency_overrides[get_current_user] = lambda: {'email': 'test@test.com', 'role': 'admin'}\n\n" +
          "client = TestClient(app)\n\n" +
          "def test_settings():\n" +
          "    r = client.get('/settings')\n" +
          "    assert r.json()['env'] == 'test'  # тестовые настройки!\n\n" +
          "def test_admin_access():\n" +
          "    r = client.get('/admin')  # admin потому что подменили user\n" +
          "    assert r.status_code == 200\n\n" +
          "test_settings()\n" +
          "test_admin_access()\n" +
          "print('Все тесты с overrides прошли!')\n\n" +
          "# Очищаем после тестов:\n" +
          "app.dependency_overrides.clear()",
        keyTakeaways: [
          "app.dependency_overrides[fn] = override_fn — подменяет зависимость для тестов.",
          "dependency_overrides.clear() — очищай после тестов!",
          "Подмена позволяет тестировать без реальной БД, email, внешних API.",
        ],
        pitfalls: [
          "Не забудь app.dependency_overrides.clear() после тестов — иначе переопределения останутся!",
          "dependency_overrides работает только если тест использует тот же app объект.",
        ],
      },
      {
        heading: "🚀 Мастер-гид: Тестирование FastAPI (Round 9)",
        tagline: "TestClient, pytest, dependency_overrides — полный гид по тестированию API без сервера",
        body:
          "## TestClient — HTTP-клиент для тестирования без реального сервера\n\n" +
          "```python\n" +
          "# pip install httpx pytest\n" +
          "from fastapi import FastAPI\n" +
          "from fastapi.testclient import TestClient\n\n" +
          "app = FastAPI()\n\n" +
          "@app.get('/items/{item_id}')\n" +
          "def get_item(item_id: int):\n" +
          "    if item_id < 0:\n" +
          "        from fastapi import HTTPException\n" +
          "        raise HTTPException(400, 'ID должен быть положительным')\n" +
          "    return {'id': item_id, 'name': f'Item #{item_id}'}\n\n" +
          "@app.post('/items', status_code=201)\n" +
          "def create_item(name: str):\n" +
          "    return {'id': 1, 'name': name, 'created': True}\n\n" +
          "# ──────────────────────────────────────────────\n" +
          "# ТЕСТЫ (в реальном проекте — отдельный файл test_main.py)\n" +
          "# ──────────────────────────────────────────────\n" +
          "client = TestClient(app)\n\n" +
          "def test_get_item():\n" +
          "    response = client.get('/items/42')\n" +
          "    assert response.status_code == 200\n" +
          "    data = response.json()\n" +
          "    assert data['id'] == 42\n" +
          "    assert 'name' in data\n" +
          "    print('✓ test_get_item')\n\n" +
          "def test_get_item_invalid():\n" +
          "    response = client.get('/items/-1')\n" +
          "    assert response.status_code == 400\n" +
          "    print('✓ test_get_item_invalid')\n\n" +
          "def test_get_item_not_int():\n" +
          "    response = client.get('/items/abc')  # не int!\n" +
          "    assert response.status_code == 422  # FastAPI автоматически\n" +
          "    print('✓ test_get_item_not_int — FastAPI вернул 422')\n\n" +
          "def test_create_item():\n" +
          "    response = client.post('/items?name=Laptop')\n" +
          "    assert response.status_code == 201\n" +
          "    data = response.json()\n" +
          "    assert data['created'] == True\n" +
          "    print('✓ test_create_item')\n\n" +
          "# Запускаем тесты:\n" +
          "test_get_item()\n" +
          "test_get_item_invalid()\n" +
          "test_get_item_not_int()\n" +
          "test_create_item()\n" +
          "print('\\n✅ Все тесты прошли!')\n" +
          "```\n\n" +
          "## Тестирование POST с JSON body\n\n" +
          "```python\n" +
          "from fastapi import FastAPI\n" +
          "from fastapi.testclient import TestClient\n" +
          "from pydantic import BaseModel\n\n" +
          "class UserCreate(BaseModel):\n" +
          "    name: str\n" +
          "    email: str\n\n" +
          "app = FastAPI()\n\n" +
          "@app.post('/users', status_code=201)\n" +
          "def create_user(user: UserCreate):\n" +
          "    return {'id': 1, 'name': user.name, 'email': user.email}\n\n" +
          "client = TestClient(app)\n\n" +
          "def test_create_user_success():\n" +
          "    # POST с JSON body:\n" +
          "    response = client.post('/users', json={'name': 'Алексей', 'email': 'alex@mail.com'})\n" +
          "    assert response.status_code == 201\n" +
          "    data = response.json()\n" +
          "    assert data['name'] == 'Алексей'\n" +
          "    assert data['email'] == 'alex@mail.com'\n" +
          "    print('✓ test_create_user_success')\n\n" +
          "def test_create_user_missing_field():\n" +
          "    # Пропустили email — ожидаем 422:\n" +
          "    response = client.post('/users', json={'name': 'Алексей'})\n" +
          "    assert response.status_code == 422\n" +
          "    errors = response.json()['detail']\n" +
          "    print('✓ test_create_user_missing_field, ошибки:', len(errors))\n\n" +
          "def test_create_user_with_headers():\n" +
          "    # С заголовком авторизации:\n" +
          "    response = client.post(\n" +
          "        '/users',\n" +
          "        json={'name': 'Maria', 'email': 'maria@mail.com'},\n" +
          "        headers={'Authorization': 'Bearer test-token'},\n" +
          "    )\n" +
          "    assert response.status_code == 201\n" +
          "    print('✓ test_create_user_with_headers')\n\n" +
          "test_create_user_success()\n" +
          "test_create_user_missing_field()\n" +
          "test_create_user_with_headers()\n" +
          "print('✅ Тесты POST с JSON прошли!')\n" +
          "```\n\n" +
          "## dependency_overrides — замена зависимостей для тестов\n\n" +
          "```python\n" +
          "from fastapi import FastAPI, Depends\n" +
          "from fastapi.testclient import TestClient\n\n" +
          "app = FastAPI()\n\n" +
          "# Реальная зависимость (в тестах не используем):\n" +
          "def get_db():\n" +
          "    # В реальности: открывает соединение с PostgreSQL\n" +
          "    return {'type': 'real_db'}\n\n" +
          "def get_current_user(db=Depends(get_db)):\n" +
          "    return {'id': 1, 'email': 'user@mail.com', 'db': db['type']}\n\n" +
          "@app.get('/profile')\n" +
          "def profile(user=Depends(get_current_user)):\n" +
          "    return user\n\n" +
          "# ── Тест с подменой зависимости ──\n" +
          "def override_db():\n" +
          "    return {'type': 'test_db'}  # тест-зависимость, без реальной БД\n\n" +
          "def override_user():\n" +
          "    return {'id': 999, 'email': 'test@test.com', 'role': 'test_user'}\n\n" +
          "# Подменяем:\n" +
          "app.dependency_overrides[get_db] = override_db\n" +
          "app.dependency_overrides[get_current_user] = override_user\n\n" +
          "client = TestClient(app)\n\n" +
          "def test_profile():\n" +
          "    response = client.get('/profile')\n" +
          "    assert response.status_code == 200\n" +
          "    data = response.json()\n" +
          "    assert data['email'] == 'test@test.com'  # тестовый пользователь!\n" +
          "    print('✓ test_profile с подменённой зависимостью:', data)\n\n" +
          "test_profile()\n\n" +
          "# Очищаем после тестов!\n" +
          "app.dependency_overrides.clear()\n" +
          "print('✅ dependency_overrides работает!')\n" +
          "```\n\n" +
          "## Как подходить к упражнениям раунда 9\n\n" +
          "**TestClient упражнения:**\n" +
          "```python\n" +
          "client = TestClient(app)  # создаём один раз\n\n" +
          "# GET запрос:\n" +
          "response = client.get('/path')  # или client.get('/path?param=val')\n" +
          "assert response.status_code == 200\n" +
          "data = response.json()\n\n" +
          "# POST с JSON:\n" +
          "response = client.post('/path', json={...})\n\n" +
          "# С заголовком:\n" +
          "response = client.get('/path', headers={'Authorization': 'Bearer token'})\n" +
          "```\n\n" +
          "**Что тестировать в каждом маршруте:**\n" +
          "- ✓ Успешный случай (200/201) — нормальные данные\n" +
          "- ✓ Ошибочный случай (404/422) — неверный ID, невалидные данные\n" +
          "- ✓ Структура ответа — нужные поля присутствуют\n" +
          "- ✓ Аутентификация — без токена 401, с токеном 200",
        code:
          "from fastapi import FastAPI, HTTPException, Depends\n" +
          "from fastapi.testclient import TestClient\n" +
          "from pydantic import BaseModel\n\n" +
          "# ── Приложение ──\n" +
          "app = FastAPI()\n\n" +
          "products = {1: {'id': 1, 'name': 'Laptop', 'price': 999}, 2: {'id': 2, 'name': 'Phone', 'price': 499}}\n\n" +
          "class ProductCreate(BaseModel):\n" +
          "    name: str\n" +
          "    price: float\n\n" +
          "@app.get('/products')\n" +
          "def list_products(): return list(products.values())\n\n" +
          "@app.get('/products/{pid}')\n" +
          "def get_product(pid: int):\n" +
          "    if pid not in products: raise HTTPException(404, 'Не найден')\n" +
          "    return products[pid]\n\n" +
          "@app.post('/products', status_code=201)\n" +
          "def create_product(product: ProductCreate):\n" +
          "    new_id = max(products.keys()) + 1\n" +
          "    p = {'id': new_id, **product.model_dump()}\n" +
          "    products[new_id] = p\n" +
          "    return p\n\n" +
          "# ── Тесты ──\n" +
          "client = TestClient(app)\n\n" +
          "def test_list(): assert client.get('/products').status_code == 200; print('✓ list')\n" +
          "def test_get(): assert client.get('/products/1').status_code == 200; print('✓ get')\n" +
          "def test_not_found(): assert client.get('/products/999').status_code == 404; print('✓ 404')\n" +
          "def test_invalid_type(): assert client.get('/products/abc').status_code == 422; print('✓ 422')\n" +
          "def test_create():\n" +
          "    r = client.post('/products', json={'name': 'Tablet', 'price': 299.0})\n" +
          "    assert r.status_code == 201\n" +
          "    assert r.json()['name'] == 'Tablet'\n" +
          "    print('✓ create')\n" +
          "def test_missing_field():\n" +
          "    r = client.post('/products', json={'name': 'Tablet'})\n" +
          "    assert r.status_code == 422  # нет price!\n" +
          "    print('✓ missing field → 422')\n\n" +
          "test_list(); test_get(); test_not_found()\n" +
          "test_invalid_type(); test_create(); test_missing_field()\n" +
          "print('\\n✅ Все тесты прошли!')",
        keyTakeaways: [
          "TestClient(app) — ASGI-клиент без реального HTTP. Тесты быстрые, без запуска сервера.",
          "client.get('/path') / client.post('/path', json={...}) — синтаксис идентичен requests.",
          "response.status_code, response.json() — основные методы проверки ответа.",
          "dependency_overrides[real_fn] = mock_fn — подмена зависимостей для изоляции тестов.",
          "Тестируй: успех (200/201), ошибку (404), невалидные данные (422), структуру ответа.",
        ],
        pitfalls: [
          "dependency_overrides.clear() после тестов — иначе моки останутся для следующих тестов!",
          "TestClient не запускает uvicorn — он вызывает app напрямую через ASGI интерфейс.",
          "client.post('/path?param=val', json={...}) — query params в URL, body в json=.",
        ],
        analogy: "TestClient — как манекен-покупатель в магазине. Ходит по отделам (маршрутам), покупает (POST) и проверяет (GET), смотрит чеки (response.json()). dependency_overrides — как учебный манекен вместо реального человека: поведение то же, но без настоящих денег (реальной БД). После тренировки манекена убираем (clear()) чтобы реальные покупатели не взаимодействовали с манекеном.",
      },
      {
        heading: "Примеры и пояснения",
        tagline: "TestClient, тестирование GET/POST/auth-маршрутов — полные примеры",
        body:
          "### Упражнение 1: «TestClient базовые тесты»\n\n" +
          "```python\n" +
          "from fastapi.testclient import TestClient  # {{0}} = TestClient\n\n" +
          "client = TestClient(app)  # {{1}} = TestClient\n\n" +
          "def test_root():\n" +
          "    response = client.get('/')         # {{2}} = get\n" +
          "    assert response.status_code == 200  # {{3}} = status_code\n" +
          "    assert response.json() == {...}     # {{4}} = json\n\n" +
          "def test_create():\n" +
          "    response = client.post('/items',    # {{5}} = post\n" +
          "                          json={...})   # {{6}} = json\n" +
          "    assert response.status_code == 201\n" +
          "```\n\n" +
          "---\n\n" +
          "### Упражнение 2: «dependency_overrides»\n\n" +
          "```python\n" +
          "# Переопределяем зависимость:\n" +
          "app.dependency_overrides[get_db] = override_get_db  # {{0}} = dependency_overrides\n\n" +
          "# Создаём тестовый client:\n" +
          "client = TestClient(app)  # {{1}} = TestClient\n\n" +
          "def override_auth():\n" +
          "    return {'role': 'admin'}  # {{2}} = admin\n\n" +
          "app.dependency_overrides[get_current_user] = override_auth  # {{3}} = get_current_user\n\n" +
          "# Очищаем:\n" +
          "app.dependency_overrides.clear()  # {{4}} = clear\n" +
          "```\n\n" +
          "---\n\n" +
          "### Тестирование FastAPI приложений\n\n" +
          "**TestClient — тесты без реального сервера.** TestClient (из fastapi.testclient, основан на httpx) позволяет тестировать FastAPI-приложение напрямую, без запуска HTTP-сервера. Тест выполняется в одном процессе — быстрее, нет сетевых задержек, легко запускается в CI/CD. Синтаксис: client.get(path), client.post(path, json={...}). Ответ содержит .status_code, .json(), .headers.\n\n" +
          "**dependency_overrides — подмена зависимостей в тестах.** В реальном коде маршруты зависят от get_db() (PostgreSQL) или get_current_user() (JWT). В тестах реальная БД и токены не нужны. app.dependency_overrides[original_dep] = mock_dep заставляет FastAPI использовать тестовую версию. Важно очищать после теста: app.dependency_overrides.clear(). Это делает тесты изолированными и независимыми от внешних сервисов.",
      },
    ],
    cheatSheet: [
      "`from fastapi.testclient import TestClient; client = TestClient(app)`",
      "`response = client.get('/path'); assert response.status_code == 200`",
      "`client.post('/path', json={...})` — POST с JSON телом.",
      "`app.dependency_overrides[original_dep] = override_dep` — подмена.",
      "`app.dependency_overrides.clear()` — очистить после тестов.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fa9-f1",
      title: "TestClient базовые тесты",
      description: "Напиши тесты для FastAPI маршрутов.",
      code:
        "from fastapi import FastAPI, HTTPException\n" +
        "from fastapi.testclient import {{0}}\n" +
        "from pydantic import BaseModel\n\n" +
        "app = FastAPI()\n" +
        "db = {1: {'id': 1, 'name': 'Test'}}\n\n" +
        "@app.get('/')\n" +
        "def root(): return {'status': 'ok'}\n\n" +
        "@app.get('/items/{item_id}')\n" +
        "def get_item(item_id: int):\n" +
        "    if item_id not in db: raise HTTPException(404)\n" +
        "    return db[item_id]\n\n" +
        "client = {{1}}(app)\n\n" +
        "def test_root():\n" +
        "    response = client.{{2}}('/')\n" +
        "    assert response.{{3}} == 200\n" +
        "    assert response.{{4}}() == {'status': 'ok'}\n\n" +
        "def test_get_item():\n" +
        "    r = client.get('/items/1')\n" +
        "    assert r.{{3}} == 200\n\n" +
        "def test_not_found():\n" +
        "    r = client.get('/items/999')\n" +
        "    assert r.{{3}} == {{5}}\n\n" +
        "test_root(); test_get_item(); test_not_found()\n" +
        "print('Тесты пройдены!')",
      answers: [
        ["TestClient"],
        ["TestClient"],
        ["get"],
        ["status_code"],
        ["json"],
        ["404"],
      ],
      hints: [
        "Класс тестового клиента.",
        "Создаём экземпляр клиента.",
        "HTTP-метод для GET запроса.",
        "Атрибут ответа для статус-кода.",
        "Метод ответа для получения JSON.",
        "Ожидаемый код 'не найдено'.",
      ],
    },
    {
      type: "fill",
      id: "fa9-f2",
      title: "Тестирование POST и JSON",
      description: "Напиши тесты для создания ресурсов через POST.",
      code:
        "from fastapi import FastAPI\n" +
        "from fastapi.testclient import TestClient\n" +
        "from pydantic import BaseModel\n\n" +
        "class Item(BaseModel):\n" +
        "    name: str\n" +
        "    price: float\n\n" +
        "app = FastAPI()\n" +
        "items = []\n\n" +
        "@app.post('/items', status_code=201)\n" +
        "def create(item: Item):\n" +
        "    new = {'id': len(items) + 1, **item.model_dump()}\n" +
        "    items.append(new)\n" +
        "    return new\n\n" +
        "client = TestClient(app)\n\n" +
        "def test_create_item():\n" +
        "    response = client.{{0}}(\n" +
        "        '/items',\n" +
        "        {{1}}={'name': 'Laptop', 'price': 999.0}\n" +
        "    )\n" +
        "    assert response.{{2}} == 201\n" +
        "    data = response.json()\n" +
        "    assert data['{{3}}'] == 'Laptop'\n" +
        "    assert '{{4}}' in data\n\n" +
        "def test_create_invalid():\n" +
        "    response = client.post('/items', json={'name': 'Test'})\n" +
        "    assert response.status_code == {{5}}\n\n" +
        "test_create_item(); test_create_invalid()\n" +
        "print('POST тесты пройдены!')",
      answers: [
        ["post"],
        ["json"],
        ["status_code"],
        ["name"],
        ["id"],
        ["422"],
      ],
      hints: [
        "HTTP-метод для создания.",
        "Параметр для JSON тела.",
        "Атрибут статус-кода ответа.",
        "Поле имени в ответе.",
        "Поле ID в ответе.",
        "Код ошибки валидации (нет обязательного поля price).",
      ],
    },
    {
      type: "fill",
      id: "fa9-f3",
      title: "dependency_overrides в тестах",
      description: "Подмени зависимости для изолированного тестирования.",
      code:
        "from fastapi import FastAPI, Depends, HTTPException\n" +
        "from fastapi.testclient import TestClient\n\n" +
        "app = FastAPI()\n\n" +
        "def get_current_user():\n" +
        "    return {'email': 'real@test.com', 'role': 'user'}\n\n" +
        "@app.get('/me')\n" +
        "def me(user = Depends(get_current_user)):\n" +
        "    return user\n\n" +
        "@app.get('/admin')\n" +
        "def admin(user = Depends(get_current_user)):\n" +
        "    if user['role'] != 'admin':\n" +
        "        raise HTTPException(403)\n" +
        "    return {'ok': True}\n\n" +
        "# === Тесты ===\n" +
        "def mock_admin():\n" +
        "    return {'email': 'admin@test.com', 'role': '{{0}}'}\n\n" +
        "app.{{1}}[get_current_user] = mock_admin\n" +
        "client = TestClient(app)\n\n" +
        "def test_me_as_admin():\n" +
        "    r = client.get('/{{2}}')\n" +
        "    assert r.json()['role'] == '{{0}}'\n\n" +
        "def test_admin_access():\n" +
        "    r = client.get('/admin')\n" +
        "    assert r.{{3}} == 200\n\n" +
        "test_me_as_admin(); test_admin_access()\n" +
        "app.dependency_overrides.{{4}}()\n" +
        "print('Override тесты пройдены!')",
      answers: [
        ["admin"],
        ["dependency_overrides"],
        ["me"],
        ["status_code"],
        ["clear"],
      ],
      hints: [
        "Роль администратора.",
        "Словарь для переопределения зависимостей.",
        "Маршрут /me (без слэша в аргументе).",
        "Атрибут статус-кода.",
        "Метод очистки переопределений.",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "fa9-q1",
      title: "Чем TestClient лучше реального сервера?",
      question:
        "TestClient позволяет тестировать FastAPI без запуска настоящего сервера. Какое главное преимущество такого подхода?",
      answers: [
        "не нужен сетевой сервер",
        "тесты быстрее без реального сервера",
        "нет необходимости запускать uvicorn",
        "тесты выполняются в процессе",
        "не нужен отдельный порт",
        "можно тестировать без сети",
        "faster testing",
        "не требует запуска сервера",
        "быстрое тестирование без сервера",
        "работает без сетевого подключения",
      ],
      hint: "Нет сервера → нет ожидания запуска → нет сетевого стека.",
      explanation:
        "TestClient преимущества:\n• Не нужен сетевой сервер — тесты быстрее\n• Работает в CI/CD без дополнительной настройки\n• Нет проблем с портами (занятый порт, firewall)\n• Полная изоляция — тесты не влияют друг на друга\n• Можно тестировать без интернета",
    },
    {
      type: "question",
      id: "fa9-q2",
      title: "Что такое dependency_overrides?",
      question:
        "В тестах мы хотим заменить реальную БД на тестовую. Для этого используем `app.___ = {get_db: test_get_db}`.",
      answers: [
        "dependency_overrides",
        "dependency overrides",
        "dependencyoverrides",
        "overrides",
        "dependency_override",
      ],
      hint: "Атрибут приложения (словарь) для замены зависимостей.",
      explanation:
        "`app.dependency_overrides` — словарь FastAPI для подмены зависимостей.\n\n```python\napp.dependency_overrides[get_db] = test_db_factory\napp.dependency_overrides[get_current_user] = mock_user\n```\n\nПосле тестов: `app.dependency_overrides.clear()`",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fa9-w1",
      title: "Полный набор тестов для CRUD API",
      task:
        "Создай FastAPI-приложение и полный набор тестов.\n\n" +
        "━━━ Приложение ━━━\n\n" +
        "class Note(BaseModel): id: int, title: str, content: str\n" +
        "class NoteCreate(BaseModel): title: str, content: str\n\n" +
        "notes: dict[int, dict] = {} (хранить в памяти)\n\n" +
        "GET /notes → список всех\n" +
        "POST /notes → создать (201)\n" +
        "GET /notes/{note_id} → одну (или 404)\n" +
        "DELETE /notes/{note_id} → удалить (204)\n\n" +
        "━━━ Тесты ━━━\n\n" +
        "client = TestClient(app)\n\n" +
        "test_get_empty() — GET /notes → пустой список []\n" +
        "test_create_note() — POST /notes → 201, есть 'id' в ответе\n" +
        "test_get_note() — GET /notes/1 → 200\n" +
        "test_note_not_found() — GET /notes/999 → 404\n" +
        "test_delete_note() — DELETE /notes/1 → 204\n\n" +
        "Запусти — тесты должны проходить!",
      hints: [
        "from fastapi.testclient import TestClient; client = TestClient(app)",
        "Храни notes = {}; next_id = 1 как глобальные переменные",
        "def test_create_note(): r = client.post('/notes', json={'title': 'T', 'content': 'C'}); assert r.status_code == 201",
        "def test_not_found(): r = client.get('/notes/999'); assert r.status_code == 404",
        "def test_delete(): r = client.delete('/notes/1'); assert r.status_code == 204",
      ],
      required: [
        "TestClient",
        "client = TestClient",
        "client.get",
        "client.post",
        "client.delete",
        "status_code",
        "json()",
        "assert",
        "404",
        "201",
        "204",
      ],
      minLines: 60,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 10 · Async, Lifespan и деплой
// ─────────────────────────────────────────────────────────────────────────────
const fa10: Round = {
  number: 10,
  title: "FastAPI · Async, Lifespan, деплой",
  level: "Сложный",
  intro:
    "FastAPI нативно поддерживает async/await. Lifespan управляет ресурсами при старте и завершении. Знание деплоя завершает картину.\n\n**В этом раунде:**\n• async def vs def — когда что использовать\n• asyncio.gather() — параллельные задачи\n• Lifespan — управление ресурсами\n• Production деплой (Docker + uvicorn)\n• Финальный проект",
  lesson: {
    title: "Async, Lifespan и продакшен-деплой",
    summary:
      "async def для IO-задач, def для CPU-задач (FastAPI запустит в threadpool). Lifespan — startup/shutdown через @asynccontextmanager. Docker + uvicorn — стандарт деплоя.",
    readingMinutes: 16,
    sections: [
      {
        heading: "async def vs def — когда что использовать",
        tagline: "async def + await asyncio.sleep → правильно. async def + time.sleep → БАГ!",
        body:
          "### Что такое async и event loop простыми словами\n\n" +
          "- **Синхронный код (sync)** — строки выполняются одна за другой. Пока одна строка ждёт ответа от БД — всё остальное стоит.\n" +
          "- **Асинхронный код (async)** — пока одна задача ждёт ответа — программа переключается на другую. Это называется **кооперативная многозадачность**.\n" +
          "- **Event loop (цикл событий)** — «диспетчер» asyncio. Бесконечно проверяет: «какая задача готова к выполнению?» Когда функция говорит `await` — она отдаёт управление обратно event loop'у, который запускает другие задачи.\n" +
          "- **Coroutine (корутина)** — функция с `async def`. При вызове `my_func()` без `await` — функция НЕ выполняется, создаётся объект-корутина. `await my_func()` — вот тут она реально запускается.\n" +
          "- **ThreadPool (пул потоков)** — несколько «рабочих» потоков готовых выполнять задачи. FastAPI автоматически запускает обычные `def` функции в threadpool чтобы они не блокировали event loop.\n" +
          "- **IO-bound задача** — задача, которая в основном ждёт: запрос к БД, HTTP-запрос к стороннему API, чтение файла. Для таких задач async даёт огромный прирост скорости.\n" +
          "- **CPU-bound задача** — задача, которая активно нагружает процессор: математика, архивация, обработка изображений. Async здесь не поможет — нужен multiprocessing.\n\n" +
          "---\n\n" +
          "FastAPI поддерживает оба типа функций — async и sync.\n\n" +
          "**Когда использовать `async def`:**\n" +
          "- Работа с async библиотеками: httpx, asyncpg, aioredis, aiofiles\n" +
          "- `await asyncio.sleep()` — асинхронная задержка\n" +
          "- Когда нужно `asyncio.gather()` для параллельных задач\n\n" +
          "**Когда использовать `def` (синхронную):**\n" +
          "- Работа с sync библиотеками: requests, psycopg2, SQLAlchemy\n" +
          "- CPU-интенсивные операции\n\n" +
          "**Что делает FastAPI с `def` маршрутами:**\n" +
          "FastAPI автоматически запускает синхронные маршруты в `ThreadPoolExecutor` через `asyncio.run_in_executor()`.\n" +
          "Это означает: event loop НЕ блокируется, другие запросы обрабатываются параллельно!\n\n" +
          "**Главная ошибка — время.sleep в async функции:**\n\n" +
          "```python\n" +
          "# ❌ НЕПРАВИЛЬНО — блокирует весь event loop!\n" +
          "async def bad_endpoint():\n" +
          "    import time\n" +
          "    time.sleep(1)  # блокирует ВСЕ запросы на 1 секунду!\n" +
          "    return {}\n\n" +
          "# ✅ ПРАВИЛЬНО — не блокирует event loop\n" +
          "async def good_endpoint():\n" +
          "    import asyncio\n" +
          "    await asyncio.sleep(1)  # другие запросы продолжают работать\n" +
          "    return {}\n\n" +
          "# ✅ ТОЖЕ ПРАВИЛЬНО — sync функция в threadpool\n" +
          "def sync_endpoint():\n" +
          "    import time\n" +
          "    time.sleep(1)  # в threadpool, не блокирует event loop\n" +
          "    return {}\n" +
          "```\n\n" +
          "**asyncio.gather() — параллельные задачи:**\n" +
          "```python\n" +
          "import asyncio\n\n" +
          "async def fetch_users():  # имитация async запроса к БД\n" +
          "    await asyncio.sleep(0.1)\n" +
          "    return []\n\n" +
          "async def fetch_products():\n" +
          "    await asyncio.sleep(0.1)\n" +
          "    return []\n\n" +
          "@app.get('/dashboard')\n" +
          "async def dashboard():\n" +
          "    # Запускаем ПАРАЛЛЕЛЬНО, не последовательно!\n" +
          "    users, products = await asyncio.gather(\n" +
          "        fetch_users(),\n" +
          "        fetch_products()\n" +
          "    )\n" +
          "    # Общее время ≈ 0.1s (не 0.2s!)\n" +
          "    return {'users': users, 'products': products}\n" +
          "```",
        code:
          "from fastapi import FastAPI\n" +
          "import asyncio\n\n" +
          "app = FastAPI()\n\n" +
          "# Async маршрут — правильно:\n" +
          "@app.get('/async-route')\n" +
          "async def async_route():\n" +
          "    await asyncio.sleep(0.01)  # НЕ блокирует!\n" +
          "    return {'type': 'async'}\n\n" +
          "# Sync маршрут — FastAPI запустит в threadpool:\n" +
          "@app.get('/sync-route')\n" +
          "def sync_route():\n" +
          "    import time\n" +
          "    time.sleep(0.01)  # безопасно — в threadpool\n" +
          "    return {'type': 'sync'}\n\n" +
          "# Параллельные задачи:\n" +
          "@app.get('/parallel')\n" +
          "async def parallel():\n" +
          "    results = await asyncio.gather(\n" +
          "        asyncio.sleep(0.01),\n" +
          "        asyncio.sleep(0.01),\n" +
          "        asyncio.sleep(0.01),\n" +
          "    )\n" +
          "    return {'parallel_tasks': len(results)}\n\n" +
          "# Демо:\n" +
          "import asyncio\n" +
          "asyncio.run(async_route())\n" +
          "print('Async маршруты работают!')",
        keyTakeaways: [
          "async def + await asyncio.sleep → правильный async. async def + time.sleep → БАГ (блокировка).",
          "def в FastAPI автоматически запускается в threadpool — это безопасно для синхронного кода.",
          "asyncio.gather() — выполнить несколько корутин параллельно.",
        ],
        pitfalls: [
          "async def + requests.get() (blocking) → блокирует event loop. Используй httpx с await.",
          "asyncio.run() в Jupyter/FastAPI не нужен — там уже есть event loop. Используй await.",
        ],
        analogy:
          "async — как официант в ресторане: принял заказ, пошёл дальше, вернулся когда готово. sync в threadpool — как нанять дополнительного официанта для длинного заказа. time.sleep в async — как официант стоит и ждёт пока готовится блюдо, не принимая другие заказы. Катастрофа!",
      },
      {
        heading: "Lifespan — управление ресурсами",
        tagline: "Lifespan заменяет on_event startup/shutdown — правильный способ управлять ресурсами",
        body:
          "**Lifespan** — context manager для управления ресурсами приложения:\n\n" +
          "```python\n" +
          "from contextlib import asynccontextmanager\n\n" +
          "@asynccontextmanager\n" +
          "async def lifespan(app: FastAPI):\n" +
          "    # === STARTUP ===\n" +
          "    await connect_to_db()\n" +
          "    load_ml_model()\n" +
          "    print('Приложение запущено')\n" +
          "    yield  # ← приложение работает здесь\n" +
          "    # === SHUTDOWN ===\n" +
          "    await disconnect_from_db()\n" +
          "    print('Приложение завершено')\n\n" +
          "app = FastAPI(lifespan=lifespan)\n" +
          "```\n\n" +
          "**Зачем использовать lifespan:**\n" +
          "- Подключить к БД при старте → отключить при завершении\n" +
          "- Загрузить ML-модель в память\n" +
          "- Создать пул HTTP-соединений (httpx.AsyncClient)\n" +
          "- Инициализировать кэш\n\n" +
          "**Преимущества lifespan над on_event:**\n\n" +
          "| on_event (устарело) | lifespan (рекомендуется) |\n" +
          "|---|---|\n" +
          "| Два декоратора: startup + shutdown | Один context manager |\n" +
          "| Ресурсы в глобальных переменных | Ресурсы в локальных переменных |\n" +
          "| Сложнее тестировать | Легко тестировать |\n" +
          "| Deprecated с FastAPI 0.93 | Официальный способ |\n\n" +
          "**@asynccontextmanager + yield — паттерн Python:**\n" +
          "- Всё до `yield` = startup\n" +
          "- `yield` = приложение работает\n" +
          "- Всё после `yield` (или finally) = shutdown\n\n" +
          "Это тот же паттерн что и в `get_db()` зависимости!",
        code:
          "from fastapi import FastAPI\n" +
          "from contextlib import asynccontextmanager\n" +
          "import asyncio\n\n" +
          "class FakeDB:\n" +
          "    def __init__(self):\n" +
          "        self.connected = False\n" +
          "    async def connect(self):\n" +
          "        await asyncio.sleep(0)\n" +
          "        self.connected = True\n" +
          "        print('DB: подключились!')\n" +
          "    async def disconnect(self):\n" +
          "        self.connected = False\n" +
          "        print('DB: отключились!')\n\n" +
          "db = FakeDB()\n\n" +
          "@asynccontextmanager\n" +
          "async def lifespan(app: FastAPI):\n" +
          "    # === Startup ===\n" +
          "    await db.connect()\n" +
          "    print('✅ Приложение запущено')\n" +
          "    yield              # Здесь приложение работает\n" +
          "    # === Shutdown ===\n" +
          "    await db.disconnect()\n" +
          "    print('🛑 Приложение завершено')\n\n" +
          "app = FastAPI(lifespan=lifespan)\n\n" +
          "@app.get('/')\n" +
          "def root():\n" +
          "    return {'db_connected': db.connected}\n\n" +
          "# Демо startup:\n" +
          "asyncio.run(db.connect())\n" +
          "print('DB connected:', db.connected)",
        keyTakeaways: [
          "@asynccontextmanager + yield — всё до yield это startup, всё после — shutdown.",
          "app = FastAPI(lifespan=lifespan) — передаём менеджер при создании приложения.",
          "Старый @app.on_event('startup') работает, но считается устаревшим (deprecated).",
        ],
        pitfalls: [
          "lifespan — это async функция, но FastAPI вызовет её через context manager. Не вызывай напрямую.",
          "Без yield — shutdown не выполнится. Yield обязателен!",
        ],
      },
      {
        heading: "Деплой FastAPI в продакшен",
        tagline: "Docker + Gunicorn + Uvicorn — стандарт продакшен-деплоя FastAPI",
        body:
          "**Команда деплоя — два варианта:**\n\n" +
          "```bash\n" +
          "# Вариант 1: только uvicorn с несколькими воркерами\n" +
          "uvicorn main:app --workers 4 --host 0.0.0.0 --port 8000\n\n" +
          "# Вариант 2: gunicorn управляет uvicorn воркерами (рекомендуется)\n" +
          "gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000\n" +
          "```\n\n" +
          "**Сколько воркеров?**\n" +
          "Правило: `(2 × CPU_count) + 1`. Для 2 CPU → 5 воркеров.\n\n" +
          "**Минимальный Dockerfile:**\n" +
          "```dockerfile\n" +
          "FROM python:3.11-slim\n" +
          "WORKDIR /app\n" +
          "COPY requirements.txt .\n" +
          "RUN pip install --no-cache-dir -r requirements.txt\n" +
          "COPY . .\n" +
          "EXPOSE 8000\n" +
          "CMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]\n" +
          "```\n\n" +
          "**requirements.txt:**\n" +
          "```\n" +
          "fastapi>=0.110.0\n" +
          "uvicorn[standard]>=0.29.0\n" +
          "pydantic>=2.0.0\n" +
          "gunicorn>=21.0.0\n" +
          "```\n\n" +
          "**Production настройки:**\n\n" +
          "| Настройка | Dev | Production |\n" +
          "|---|---|---|\n" +
          "| --reload | ✅ | ❌ никогда! |\n" +
          "| docs_url | /docs | None (скрыть) |\n" +
          "| debug | True | False |\n" +
          "| Секреты | В коде | env vars |\n" +
          "| --workers | 1 | N (2×CPU+1) |\n\n" +
          "**Платформы деплоя:**\n" +
          "- **Railway, Render, Fly.io** — проще всего (Docker поддержка)\n" +
          "- **AWS Lambda + Mangum** — serverless FastAPI\n" +
          "- **Kubernetes** — для больших проектов",
        code:
          "from fastapi import FastAPI\n" +
          "from contextlib import asynccontextmanager\n" +
          "from fastapi.middleware.cors import CORSMiddleware\n" +
          "import os\n\n" +
          "# Production конфиг из env-переменных\n" +
          "DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'\n" +
          "DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./dev.db')\n" +
          "SECRET_KEY = os.getenv('SECRET_KEY', 'dev-key-CHANGE-IN-PRODUCTION')\n\n" +
          "@asynccontextmanager\n" +
          "async def lifespan(app: FastAPI):\n" +
          "    print(f'🚀 Start | Debug={DEBUG}')\n" +
          "    yield\n" +
          "    print('🛑 Shutdown')\n\n" +
          "app = FastAPI(\n" +
          "    title='Production API',\n" +
          "    version='1.0.0',\n" +
          "    docs_url='/docs' if DEBUG else None,   # скрыть docs в продакшене\n" +
          "    redoc_url='/redoc' if DEBUG else None,\n" +
          "    lifespan=lifespan,\n" +
          ")\n\n" +
          "app.add_middleware(\n" +
          "    CORSMiddleware,\n" +
          "    allow_origins=['*'] if DEBUG else ['https://myapp.com'],\n" +
          "    allow_methods=['*'],\n" +
          "    allow_headers=['*'],\n" +
          ")\n\n" +
          "@app.get('/health')\n" +
          "def health():\n" +
          "    return {'status': 'ok', 'debug': DEBUG, 'version': '1.0.0'}\n\n" +
          "print(f'App created! DEBUG={DEBUG}')\n" +
          "print('Секрет:', '***' if SECRET_KEY else 'NOT SET')",
        keyTakeaways: [
          "docs_url=None в продакшене — скрыть Swagger UI от публичного доступа.",
          "Конфиг через os.getenv — никогда не хардкоди секреты в коде.",
          "gunicorn -w 4 -k UvicornWorker — 4 воркера для параллельных запросов.",
        ],
        pitfalls: [
          "--reload в продакшене — критическая ошибка! Перезапуск при каждом изменении файла.",
          "SECRET_KEY в коде → GitHub → хакеры. ВСЕГДА через переменные окружения.",
        ],
      },
      {
        heading: "🚀 Мастер-гид: async, Lifespan и деплой в продакшен (Round 10)",
        tagline: "Когда использовать async def, управление ресурсами через lifespan, деплой на Render/Railway/VPS",
        body:
          "## async def vs def — принципиальная разница\n\n" +
          "```python\n" +
          "from fastapi import FastAPI\n" +
          "import asyncio\n\n" +
          "app = FastAPI()\n\n" +
          "# sync def — FastAPI запускает в threadpool executor (не блокирует event loop)\n" +
          "@app.get('/sync')\n" +
          "def sync_route():\n" +
          "    # Подходит для: синхронных БД-запросов, CPU-задач\n" +
          "    import time\n" +
          "    time.sleep(0.01)  # OK — FastAPI поместит в thread\n" +
          "    return {'type': 'sync'}\n\n" +
          "# async def — выполняется в event loop (не блокируй его!)\n" +
          "@app.get('/async')\n" +
          "async def async_route():\n" +
          "    # Подходит для: aiohttp запросов, asyncpg, aiofiles\n" +
          "    await asyncio.sleep(0.01)  # OK — уступает event loop другим запросам\n" +
          "    return {'type': 'async'}\n\n" +
          "# НЕЛЬЗЯ блокировать event loop в async def!\n" +
          "@app.get('/bad-async')\n" +
          "async def bad_async():\n" +
          "    import time\n" +
          "    time.sleep(1)  # ❌ БЛОКИРУЕТ event loop! Все другие запросы ждут!\n" +
          "    return {'bad': True}\n\n" +
          "print('Маршруты:', [r.path for r in app.routes if hasattr(r, 'path')])\n" +
          "```\n\n" +
          "**Правило выбора async/sync:**\n\n" +
          "| Ситуация | Рекомендация |\n" +
          "|---|---|\n" +
          "| Нет I/O (вычисления, in-memory) | def (без async) |\n" +
          "| SQLAlchemy синхронный | def |\n" +
          "| SQLAlchemy asyncio (asyncpg) | async def |\n" +
          "| HTTP-запросы (httpx async) | async def |\n" +
          "| Чтение/запись файлов (aiofiles) | async def |\n" +
          "| Не знаешь что выбрать | def — FastAPI справится |\n\n" +
          "## Lifespan — инициализация при старте, cleanup при остановке\n\n" +
          "```python\n" +
          "from fastapi import FastAPI\n" +
          "from contextlib import asynccontextmanager\n\n" +
          "# Общий словарь для хранения ресурсов:\n" +
          "app_state = {}\n\n" +
          "@asynccontextmanager\n" +
          "async def lifespan(app: FastAPI):\n" +
          "    # ─── STARTUP (до начала приёма запросов) ───\n" +
          "    print('🚀 Запуск приложения...')\n" +
          "    # Инициализация: БД, кэш, ML-модели, пулы соединений\n" +
          "    app_state['db_pool'] = {'connected': True, 'size': 5}  # имитация\n" +
          "    app_state['cache'] = {}  # простой in-memory кэш\n" +
          "    print('✅ БД и кэш инициализированы')\n\n" +
          "    yield  # ← здесь приложение принимает запросы\n\n" +
          "    # ─── SHUTDOWN (после остановки приёма запросов) ───\n" +
          "    print('🛑 Остановка приложения...')\n" +
          "    app_state['db_pool'] = None  # закрываем соединения\n" +
          "    app_state.clear()\n" +
          "    print('✅ Ресурсы освобождены')\n\n" +
          "app = FastAPI(lifespan=lifespan)\n\n" +
          "@app.get('/')\n" +
          "def root():\n" +
          "    return {'db_connected': app_state.get('db_pool', {}).get('connected', False)}\n\n" +
          "print('App с lifespan создан (lifespan запустится при uvicorn)')\n" +
          "print('app_state:', app_state)  # пока пустой (lifespan не запущен)\n" +
          "```\n\n" +
          "## Деплой FastAPI — пошаговые инструкции\n\n" +
          "**Вариант 1: Render.com (бесплатно)**\n\n" +
          "```yaml\n" +
          "# render.yaml\n" +
          "services:\n" +
          "  - type: web\n" +
          "    name: my-fastapi\n" +
          "    env: python\n" +
          "    buildCommand: pip install -r requirements.txt\n" +
          "    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT\n" +
          "    envVars:\n" +
          "      - key: SECRET_KEY\n" +
          "        generateValue: true\n" +
          "```\n\n" +
          "**Вариант 2: Railway.app**\n\n" +
          "```\n" +
          "# Procfile\n" +
          "web: uvicorn main:app --host 0.0.0.0 --port $PORT\n" +
          "```\n\n" +
          "**Вариант 3: VPS (Ubuntu) с Nginx**\n\n" +
          "```bash\n" +
          "# 1. Установка\n" +
          "pip install fastapi uvicorn gunicorn\n\n" +
          "# 2. Запуск через gunicorn (несколько воркеров):\n" +
          "gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000\n\n" +
          "# 3. Nginx config:\n" +
          "# location / { proxy_pass http://127.0.0.1:8000; }\n\n" +
          "# 4. systemd service для автозапуска:\n" +
          "# ExecStart=/usr/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker\n" +
          "```\n\n" +
          "## Переменные окружения — обязательно для продакшена\n\n" +
          "```python\n" +
          "import os\n" +
          "from fastapi import FastAPI\n\n" +
          "# Никогда не хардкодь секреты в коде!\n" +
          "SECRET_KEY = os.environ.get('SECRET_KEY')\n" +
          "if not SECRET_KEY:\n" +
          "    raise RuntimeError('SECRET_KEY не установлен! Проверь переменные окружения.')\n\n" +
          "DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///./dev.db')\n" +
          "# В продакшене: DATABASE_URL=postgresql://user:pass@host/db\n\n" +
          "DEBUG = os.environ.get('DEBUG', 'false').lower() == 'true'\n\n" +
          "app = FastAPI(\n" +
          "    title='Мой API',\n" +
          "    docs_url='/docs' if DEBUG else None,  # Swagger только в DEBUG\n" +
          "    redoc_url='/redoc' if DEBUG else None,\n" +
          ")\n\n" +
          "print(f'DB: {DATABASE_URL[:20]}..., Debug: {DEBUG}')\n" +
          "```\n\n" +
          "## Чеклист готовности к продакшену\n\n" +
          "```python\n" +
          "# Проверяй перед деплоем:\n" +
          "checklist = [\n" +
          "    '✅ SECRET_KEY в переменных окружения (не в коде!)',\n" +
          "    '✅ DATABASE_URL в переменных окружения',\n" +
          "    '✅ --reload УБРАН из команды запуска',\n" +
          "    '✅ Swagger/docs отключён или защищён',\n" +
          "    '✅ CORS настроен на конкретные домены (не *)',\n" +
          "    '✅ Пароли хешируются через passlib/bcrypt',\n" +
          "    '✅ Логирование настроено',\n" +
          "    '✅ Тесты написаны и проходят',\n" +
          "    '✅ requirements.txt актуален: pip freeze > requirements.txt',\n" +
          "]\n" +
          "for item in checklist: print(item)\n" +
          "```",
        code:
          "import asyncio\n" +
          "from fastapi import FastAPI\n" +
          "from contextlib import asynccontextmanager\n" +
          "import os\n\n" +
          "# ── Конфиг из переменных окружения ──\n" +
          "APP_NAME = os.environ.get('APP_NAME', 'My FastAPI App')\n" +
          "DEBUG = os.environ.get('DEBUG', 'true').lower() == 'true'\n\n" +
          "# ── Shared state ──\n" +
          "state = {}\n\n" +
          "@asynccontextmanager\n" +
          "async def lifespan(app: FastAPI):\n" +
          "    # ── STARTUP ──\n" +
          "    print(f'🚀 Запуск {APP_NAME}...')\n" +
          "    state['ready'] = True\n" +
          "    state['cache'] = {}\n" +
          "    state['request_count'] = 0\n" +
          "    print('✅ Инициализация завершена')\n\n" +
          "    yield  # приложение принимает запросы\n\n" +
          "    # ── SHUTDOWN ──\n" +
          "    print(f'🛑 Остановка. Обработано запросов: {state[\"request_count\"]}')\n" +
          "    state.clear()\n\n" +
          "app = FastAPI(\n" +
          "    title=APP_NAME,\n" +
          "    docs_url='/docs' if DEBUG else None,\n" +
          "    lifespan=lifespan,\n" +
          ")\n\n" +
          "# ── Маршруты ──\n" +
          "@app.get('/')\n" +
          "async def root():\n" +
          "    state['request_count'] = state.get('request_count', 0) + 1\n" +
          "    return {'app': APP_NAME, 'requests': state.get('request_count', 0)}\n\n" +
          "@app.get('/sync-example')\n" +
          "def sync_example():  # def без async — тоже работает!\n" +
          "    return {'type': 'sync', 'note': 'FastAPI поместит в threadpool'}\n\n" +
          "@app.get('/async-example')\n" +
          "async def async_example():\n" +
          "    await asyncio.sleep(0)  # уступает event loop\n" +
          "    return {'type': 'async', 'note': 'В event loop'}\n\n" +
          "@app.get('/health')\n" +
          "def health(): return {'status': 'ok', 'debug': DEBUG}\n\n" +
          "# Тест (lifespan не запускается при прямом вызове):\n" +
          "print(f'Приложение: {APP_NAME}, Debug: {DEBUG}')\n" +
          "print(f'Docs: {\"доступны\" if DEBUG else \"отключены\"}')\n" +
          "print('sync:', sync_example())\n\n" +
          "# Имитируем lifespan startup:\n" +
          "async def test_startup():\n" +
          "    async with lifespan(app):\n" +
          "        print('Внутри lifespan:', state)\n" +
          "        print('root():', root())\n" +
          "    print('После shutdown:', state)  # пустой!\n\n" +
          "asyncio.run(test_startup())",
        keyTakeaways: [
          "async def для I/O-bound операций (HTTP, async БД). def для CPU-bound или синхронного кода.",
          "Не блокируй event loop в async def — используй await или перенеси в def.",
          "lifespan = @asynccontextmanager с yield — до yield startup, после — shutdown.",
          "В продакшене: uvicorn main:app --host 0.0.0.0 --port $PORT (NO --reload!).",
          "SECRET_KEY, DATABASE_URL — всегда через os.environ, никогда в коде и git.",
        ],
        pitfalls: [
          "time.sleep() в async def — блокирует весь сервер. Используй await asyncio.sleep().",
          "--reload в продакшене — перезапускает при каждом изменении файла. Критическая ошибка.",
          "Swagger (/docs) открытый в продакшене — раскрывает API структуру. Защити или отключи.",
          "pip freeze > requirements.txt — зафиксируй версии перед деплоем чтобы не сломать на сервере.",
        ],
        analogy: "async def — как официант который может обслуживать несколько столиков одновременно (пока ждёт заказ у одного — принимает у другого). def — как второй официант в отдельной комнате (threadpool): работает там сам по себе, не мешая первому. time.sleep() в async def — как заснуть прямо в зале: все гости (запросы) ждут пока официант проснётся. Lifespan — как открытие и закрытие ресторана: до yield = готовимся к открытию, после yield (shutdown) = убираем и закрываем.",
      },
      {
        heading: "Примеры и пояснения",
        tagline: "async def, Lifespan, деплой uvicorn+gunicorn — полные примеры",
        body:
          "### Упражнение 1: «Async маршруты»\n\n" +
          "```python\n" +
          "import asyncio   # {{0}} = asyncio\n\n" +
          "async def slow_route():     # {{1}} = async\n" +
          "    await asyncio.sleep(0.01)  # {{2}} = await\n\n" +
          "@app.get('/parallel')\n" +
          "async def parallel():\n" +
          "    results = await asyncio.gather(...)  # {{2}} = await, {{3}} = gather\n" +
          "    return {'tasks': len(results)}  # {{4}} = len\n\n" +
          "@app.get('/sync')\n" +
          "def sync_route():  # {{5}} = def (sync!)\n" +
          "    ...\n" +
          "```\n\n" +
          "---\n\n" +
          "### Упражнение 2: «Lifespan — управление ресурсами»\n\n" +
          "```python\n" +
          "from contextlib import asynccontextmanager  # {{0}} = asynccontextmanager\n\n" +
          "@asynccontextmanager                        # {{1}} = asynccontextmanager\n" +
          "async def lifespan(app: FastAPI):\n" +
          "    cache.connect()                         # {{2}} = connect\n" +
          "    yield                                   # {{3}} = yield\n" +
          "    cache.disconnect()\n\n" +
          "app = FastAPI(lifespan=lifespan)            # {{4}} = lifespan\n\n" +
          "@app.get('/status')\n" +
          "def status(): return {'ready': cache.ready}  # {{5}} = ready\n" +
          "```\n\n" +
          "---\n\n" +
          "### Упражнение 3: «Production-готовое приложение»\n\n" +
          "```python\n" +
          "VERSION = '1.0.0'  # {{0}} = 1.0.0\n\n" +
          "@asynccontextmanager\n" +
          "async def lifespan(app):\n" +
          "    ...\n" +
          "    yield           # {{1}} = yield\n" +
          "    ...\n\n" +
          "app = FastAPI(\n" +
          "    docs_url='/docs' if DEBUG else None,  # {{2}} = '/docs', {{3}} = None\n" +
          "    lifespan=lifespan,\n" +
          ")\n\n" +
          "app.add_middleware(\n" +
          "    CORSMiddleware,  # {{4}} = CORSMiddleware\n" +
          "    ...\n" +
          ")\n\n" +
          "@app.get('/health')  # {{5}} = health\n" +
          "def health(): ...\n" +
          "```\n\n" +
          "---\n\n" +
          "### async/await и Lifespan в FastAPI\n\n" +
          "**async def vs def — разные режимы выполнения.** def (sync): FastAPI запускает в пуле потоков (threadpool), чтобы не блокировать event loop — безопасно для любого блокирующего I/O. async def: выполняется в event loop — нельзя вызывать блокирующие операции (time.sleep, sync-запросы к БД), иначе заморозишь обработку всех запросов. Используй async def только с настоящими async-библиотеками (asyncpg, httpx, aiofiles). Если не уверен — пиши def.\n\n" +
          "**Lifespan вместо устаревшего on_event.** on_event startup/shutdown устарели начиная с FastAPI 0.93. Современный способ — lifespan context manager: один блок кода, где до yield — инициализация (БД, кэш, ML-модель), после yield — очистка ресурсов. Startup и shutdown в одном месте — удобнее читать и тестировать. Подключение: app = FastAPI(lifespan=lifespan).\n\n" +
          "---\n\n" +
          "### Финальный проект — план\n\n" +
          "Собери всё изученное в одном файле:\n" +
          "```python\n" +
          "from fastapi import FastAPI, APIRouter, Depends, HTTPException, BackgroundTasks\n" +
          "from fastapi.middleware.cors import CORSMiddleware\n" +
          "from contextlib import asynccontextmanager\n" +
          "from pydantic import BaseModel\n" +
          "from typing import Optional\n\n" +
          "# 1. Lifespan\n" +
          "@asynccontextmanager\n" +
          "async def lifespan(app):\n" +
          "    print('API started')\n" +
          "    yield\n" +
          "    print('API stopped')\n\n" +
          "# 2. App с CORS\n" +
          "app = FastAPI(title='Final API', lifespan=lifespan)\n" +
          "app.add_middleware(CORSMiddleware, allow_origins=['*'],\n" +
          "                   allow_methods=['*'], allow_headers=['*'])\n\n" +
          "# 3. Middleware\n" +
          "@app.middleware('http')\n" +
          "async def log_mw(request, call_next):\n" +
          "    r = await call_next(request)\n" +
          "    return r\n\n" +
          "# 4. Models\n" +
          "class Item(BaseModel): name: str; price: float\n" +
          "class ItemResponse(Item): id: int\n\n" +
          "# 5. Router\n" +
          "router = APIRouter(prefix='/items', tags=['Items'])\n" +
          "items_db: dict[int, dict] = {}; nid = 1\n\n" +
          "@router.get('/', response_model=list[ItemResponse])\n" +
          "def list(): return list(items_db.values())\n\n" +
          "@router.post('/', response_model=ItemResponse, status_code=201)\n" +
          "def create(item: Item, bg: BackgroundTasks):\n" +
          "    global nid\n" +
          "    bg.add_task(print, f'Created {item.name}')\n" +
          "    r = {'id': nid, **item.model_dump()}; items_db[nid]=r; nid+=1\n" +
          "    return r\n\n" +
          "# 6. Include router\n" +
          "app.include_router(router)\n\n" +
          "@app.get('/health')\n" +
          "def health(): return {'status': 'ok'}\n" +
          "```",
      },
    ],
    cheatSheet: [
      "`async def endpoint(): await async_op()` — async маршрут. `def endpoint(): sync_op()` — sync (в threadpool).",
      "`@asynccontextmanager async def lifespan(app): ... yield ...` — управление ресурсами.",
      "`app = FastAPI(lifespan=lifespan)` — подключить lifespan.",
      "`uvicorn main:app --workers 4 --host 0.0.0.0` — продакшен-запуск.",
      "`docs_url=None` — скрыть Swagger в продакшене.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fa10-f1",
      title: "Async маршруты",
      description: "Напиши async маршруты с правильным использованием await.",
      code:
        "from fastapi import FastAPI\n" +
        "import {{0}}\n\n" +
        "app = FastAPI()\n\n" +
        "@app.get('/slow')\n" +
        "{{1}} def slow_route():\n" +
        "    {{2}} asyncio.sleep(0.01)\n" +
        "    return {'waited': '10ms'}\n\n" +
        "@app.get('/parallel')\n" +
        "async def parallel():\n" +
        "    results = {{2}} asyncio.{{3}}(\n" +
        "        asyncio.sleep(0.01),\n" +
        "        asyncio.sleep(0.01),\n" +
        "    )\n" +
        "    return {'tasks': {{4}}(results)}\n\n" +
        "@app.get('/sync')\n" +
        "{{5}} sync_route():\n" +
        "    import time; time.sleep(0.01)\n" +
        "    return {'type': 'sync'}\n\n" +
        "import asyncio\n" +
        "asyncio.run(slow_route())\n" +
        "print('Async маршрут выполнен!')",
      answers: [
        ["asyncio"],
        ["async"],
        ["await"],
        ["gather"],
        ["len"],
        ["def"],
      ],
      hints: [
        "Стандартный модуль для асинхронного программирования.",
        "Ключевое слово для асинхронной функции.",
        "Ключевое слово для ожидания корутины.",
        "asyncio функция для параллельного выполнения корутин.",
        "Встроенная функция для подсчёта элементов.",
        "Синхронная функция — без async.",
      ],
    },
    {
      type: "fill",
      id: "fa10-f2",
      title: "Lifespan — управление ресурсами",
      description: "Настрой Lifespan для управления ресурсами приложения.",
      code:
        "from fastapi import FastAPI\n" +
        "from contextlib import {{0}}\n\n" +
        "class Cache:\n" +
        "    def __init__(self):\n" +
        "        self.data = {}\n" +
        "        self.ready = False\n" +
        "    def connect(self): self.ready = True; print('Cache: online')\n" +
        "    def disconnect(self): self.ready = False; print('Cache: offline')\n\n" +
        "cache = Cache()\n\n" +
        "@{{1}}\n" +
        "async def lifespan(app: FastAPI):\n" +
        "    cache.{{2}}()\n" +
        "    print('Приложение стартовало')\n" +
        "    {{3}}\n" +
        "    cache.disconnect()\n" +
        "    print('Приложение завершено')\n\n" +
        "app = FastAPI({{4}}=lifespan)\n\n" +
        "@app.get('/status')\n" +
        "def status():\n" +
        "    return {'cache_ready': cache.{{5}}}\n\n" +
        "cache.connect()\n" +
        "print('Cache ready:', cache.ready)",
      answers: [
        ["asynccontextmanager"],
        ["asynccontextmanager"],
        ["connect"],
        ["yield"],
        ["lifespan"],
        ["ready"],
      ],
      hints: [
        "Декоратор из contextlib для async context manager.",
        "Применяем декоратор к lifespan-функции.",
        "Метод подключения кэша.",
        "Ключевое слово Python для паузы генератора/контекст-менеджера.",
        "Параметр FastAPI для контекст-менеджера жизненного цикла.",
        "Атрибут состояния кэша.",
      ],
    },
    {
      type: "fill",
      id: "fa10-f3",
      title: "Production-готовое приложение",
      description: "Собери финальное production-ready FastAPI-приложение.",
      code:
        "from fastapi import FastAPI\n" +
        "from fastapi.middleware.cors import CORSMiddleware\n" +
        "from contextlib import asynccontextmanager\n" +
        "import os\n\n" +
        "DEBUG = os.getenv('DEBUG', 'false') == 'true'\n" +
        "VERSION = '{{0}}'\n\n" +
        "@asynccontextmanager\n" +
        "async def lifespan(app: FastAPI):\n" +
        "    print(f'Starting v{VERSION} | debug={DEBUG}')\n" +
        "    {{1}}\n" +
        "    print('Shutting down...')\n\n" +
        "app = FastAPI(\n" +
        "    title='Production API',\n" +
        "    version=VERSION,\n" +
        "    docs_url={{2}} if DEBUG else {{3}},\n" +
        "    lifespan=lifespan,\n" +
        ")\n\n" +
        "app.add_middleware(\n" +
        "    {{4}},\n" +
        "    allow_origins=['*'] if DEBUG else ['https://myapp.com'],\n" +
        "    allow_methods=['*'],\n" +
        "    allow_headers=['*'],\n" +
        ")\n\n" +
        "@app.get('/{{5}}')\n" +
        "def health():\n" +
        "    return {'status': 'ok', 'version': VERSION}\n\n" +
        "print('App created, debug =', DEBUG)",
      answers: [
        ["1.0.0"],
        ["yield"],
        ["'/docs'"],
        ["None"],
        ["CORSMiddleware"],
        ["health"],
      ],
      hints: [
        "Версия приложения в формате semver.",
        "Пауза lifespan (приложение работает).",
        "URL документации для dev-режима.",
        "Скрыть документацию в продакшене.",
        "Middleware для CORS.",
        "Стандартный эндпоинт для проверки состояния.",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "fa10-q1",
      title: "async def vs def в FastAPI",
      question:
        "В FastAPI маршрут объявлен как `def` (не async). Как FastAPI его выполняет?",
      answers: [
        "в отдельном threadpool чтобы не блокировать event loop",
        "в threadpool воркере",
        "запускает в отдельном потоке",
        "FastAPI запускает синхронный маршрут в threadpool",
        "в пуле потоков",
        "thread pool executor",
        "в отдельном потоке через threadpool",
        "в executor/threadpool",
        "через asyncio run_in_executor",
        "в ThreadPoolExecutor",
        "в потоке threadpool",
        "в пуле потоков threadpool",
      ],
      hint: "FastAPI умный — он не блокирует event loop даже для sync функций.",
      explanation:
        "FastAPI запускает `def` маршруты через `asyncio.run_in_executor()` — в ThreadPoolExecutor. Это означает:\n• Event loop не блокируется\n• Другие запросы обрабатываются параллельно\n• Синхронные библиотеки (requests, psycopg2) работают корректно\n\nТолько `async def` с блокирующим кодом (time.sleep вместо asyncio.sleep) — это баг!",
    },
    {
      type: "question",
      id: "fa10-q2",
      title: "Чем Lifespan лучше on_event?",
      question:
        "FastAPI рекомендует использовать lifespan вместо @app.on_event('startup'). Какой паттерн Python использует lifespan?",
      answers: [
        "context manager", "контекст-менеджер", "asynccontextmanager",
        "async context manager", "контекстный менеджер",
        "contextlib", "with statement", "contextmanager",
        "async context manager with yield", "context manager с yield",
        "асинхронный контекст менеджер",
      ],
      hint: "Это паттерн Python с `with` и `yield` — что-то делаем, передаём управление, делаем cleanup.",
      explanation:
        "Lifespan использует `@asynccontextmanager` — async context manager с yield:\n```python\n@asynccontextmanager\nasync def lifespan(app):\n    # startup\n    yield\n    # shutdown\n```\n\nПреимущества над on_event:\n• Startup и shutdown в одном месте (видишь пару)\n• Можно хранить ресурсы в локальных переменных между startup и shutdown\n• Лучше для тестирования\n• Официальный рекомендованный способ с FastAPI 0.93+",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fa10-w1",
      title: "Финальный проект: полноценный FastAPI",
      task:
        "Создай production-ready FastAPI-приложение, объединяющее всё изученное.\n\n" +
        "━━━ Структура ━━━\n\n" +
        "1. **Lifespan** — startup (print 'API started') и shutdown (print 'API stopped')\n\n" +
        "2. **CORSMiddleware** — разрешить localhost:3000\n\n" +
        "3. **Middleware логирования** (@app.middleware) — логировать каждый запрос\n\n" +
        "4. **Pydantic модели**:\n" +
        "   - class Item(BaseModel): name: str, price: float, category: str = 'general'\n" +
        "   - class ItemCreate(Item): pass\n" +
        "   - class ItemResponse(Item): id: int\n\n" +
        "5. **APIRouter** (prefix='/items', tags=['Items']) с маршрутами:\n" +
        "   - GET / → список\n" +
        "   - POST / → создать (201, response_model=ItemResponse)\n" +
        "   - GET /{id} → один (или HTTPException 404)\n" +
        "   - DELETE /{id} → удалить (204)\n\n" +
        "6. **Background Task** при создании: фоновый log_creation(item_name: str)\n\n" +
        "7. **GET /health** — {'status': 'ok', 'items_count': N}\n\n" +
        "8. app.include_router(items_router)\n\n" +
        "Запусти и убедись, что нет ошибок синтаксиса!",
      hints: [
        "from contextlib import asynccontextmanager; @asynccontextmanager async def lifespan(app): ... yield ...",
        "app = FastAPI(title='Final API', lifespan=lifespan)",
        "from fastapi import BackgroundTasks; background_tasks.add_task(log_creation, item.name)",
        "items_router = APIRouter(prefix='/items', tags=['Items']); @items_router.post('/', response_model=ItemResponse, status_code=201)",
        "app.include_router(items_router)",
      ],
      required: [
        "asynccontextmanager",
        "lifespan",
        "CORSMiddleware",
        "@app.middleware",
        "await call_next",
        "APIRouter",
        "prefix='/items'",
        "response_model=ItemResponse",
        "status_code=201",
        "status_code=204",
        "HTTPException",
        "BackgroundTasks",
        "add_task",
        "include_router",
        "@app.get('/health')",
      ],
      minLines: 85,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────
export const FASTAPI_ROUNDS: Round[] = [fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, fa9, fa10];
export const FASTAPI_TOTAL_ROUNDS = FASTAPI_ROUNDS.length;
