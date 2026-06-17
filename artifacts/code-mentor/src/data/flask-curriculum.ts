import type { Round } from "@/data/curriculum";

// ─────────────────────────────────────────────────────────────────────────────
// Round 1 · Flask — установка, маршруты, первое приложение
// ─────────────────────────────────────────────────────────────────────────────
const fl1: Round = {
  number: 1,
  title: "Flask · Первое веб-приложение и маршруты",
  level: "Средний",
  intro:
    "Flask — самый популярный Python-микрофреймворк для веба: минимум кода, максимум результата. За 10 минут ты поднимешь первое рабочее приложение с несколькими страницами.\n\n" +
    "**Что ты изучишь в этом раунде:**\n" +
    "• Как Flask получает HTTP-запрос от браузера и возвращает HTTP-ответ\n" +
    "• Что такое маршрут (@app.route) и view-функция — сердце любого Flask-приложения\n" +
    "• Как принимать динамические параметры прямо из URL: /user/<name>, /post/<int:id>\n" +
    "• Как организовать проект: папки templates/ и static/, файл requirements.txt\n\n" +
    "**Что ждёт в упражнениях:** заполнение пропусков, вопросы на понимание маршрутизации, задание написать Flask-приложение с тремя маршрутами шаг за шагом.",
  lesson: {
    title: "Flask: установка, первое приложение, маршруты",
    summary:
      "Что такое Flask и зачем он нужен; как устроено Flask-приложение изнутри; маршруты (@app.route), view-функции, динамические параметры URL, HTTP-методы и структура проекта.",
    readingMinutes: 12,
    sections: [
      {
        heading: "Что такое Flask и как работает Интернет",
        tagline: "Flask — Python-код, который слушает HTTP-запросы и возвращает ответы",
        body:
          "**Flask** — это micro web-framework для Python. Слово «micro» означает: Flask даёт только самое нужное (маршрутизацию, шаблоны, обработку запросов), а всё остальное (база данных, авторизация, формы) ты добавляешь сам.\n\n" +
          "**Как работает веб-приложение — пошагово:**\n\n" +
          "1. Пользователь вводит в браузере `http://localhost:5000/hello`\n" +
          "2. Браузер отправляет HTTP-запрос: `GET /hello HTTP/1.1`\n" +
          "3. Операционная система передаёт запрос процессу Flask (он слушает порт 5000)\n" +
          "4. Flask смотрит в свою таблицу маршрутов: «есть ли кто-нибудь для `/hello`?»\n" +
          "5. Находит зарегистрированную функцию `hello_page()`\n" +
          "6. Вызывает её и берёт возвращаемое значение\n" +
          "7. Оборачивает значение в HTTP-ответ (статус 200, заголовки, тело)\n" +
          "8. Отправляет ответ обратно браузеру\n" +
          "9. Браузер рендерит полученный HTML\n\n" +
          "**Установка Flask:**\n\n" +
          "```bash\n" +
          "# Способ 1: глобально\n" +
          "pip install flask\n\n" +
          "# Способ 2 (рекомендуется): в виртуальном окружении\n" +
          "python -m venv venv\n" +
          "source venv/bin/activate  # Windows: venv\\Scripts\\activate\n" +
          "pip install flask\n" +
          "```\n\n" +
          "После установки `flask` — обычный Python-пакет. `from flask import Flask` — вот и вся магия. Никакой конфигурации, никаких XML-файлов.",
        code:
          "# Минимальное Flask-приложение (файл: app.py)\n" +
          "from flask import Flask\n\n" +
          "# Создаём экземпляр приложения.\n" +
          "# __name__ говорит Flask, где искать шаблоны и статику.\n" +
          "# Если запускаем напрямую: __name__ == '__main__'\n" +
          "# Если импортируем: __name__ == 'app' (имя файла)\n" +
          "app = Flask(__name__)\n\n" +
          "# @app.route — декоратор, регистрирующий маршрут '/'\n" +
          "# Браузер запросит GET / — Flask вызовет index()\n" +
          "@app.route('/')\n" +
          "def index():\n" +
          "    # Всё что вернём — станет телом HTTP-ответа (статус 200 OK)\n" +
          "    return '<h1>Привет, Flask!</h1>'\n\n" +
          "# Запуск встроенного dev-сервера\n" +
          "# debug=True: авто-перезагрузка при изменениях, подробные ошибки\n" +
          "if __name__ == '__main__':\n" +
          "    app.run(debug=True)",
        keyTakeaways: [
          "Flask — Python-пакет, `app = Flask(__name__)` создаёт приложение.",
          "@app.route('/путь') регистрирует функцию как обработчик URL.",
          "debug=True включает авто-перезагрузку и страницу ошибки с трейсбеком в браузере.",
        ],
        pitfalls: [
          "Никогда не запускай debug=True в продакшене — это дыра в безопасности (даёт доступ к Python-консоли).",
          "`if __name__ == '__main__':` нужен только для прямого запуска. Gunicorn/uWSGI сам импортирует `app`.",
          "Имя переменной `app` — соглашение, не требование. Но лучше не менять.",
        ],
        analogy:
          "Flask — как портье в отеле. Каждый маршрут ('/login', '/about') — это номер. Портье смотрит в список (таблица маршрутов) и направляет гостя (HTTP-запрос) к нужной функции (номеру). Если номера нет — 404.",
      },
      {
        heading: "Маршруты (@app.route) изнутри — как Flask их регистрирует",
        tagline: "@app.route — это декоратор, добавляющий функцию в таблицу маршрутов",
        body:
          "**Что делает @app.route('/'):** при загрузке модуля Python выполняет декоратор и добавляет запись в словарь маршрутов Flask: `{'/': index_function}`. Когда приходит запрос на `/`, Flask ищет в словаре и вызывает функцию.\n\n" +
          "**Правила именования view-функций:**\n" +
          "- Имя функции должно быть уникальным в приложении\n" +
          "- Имя используется в `url_for('function_name')` для генерации URL\n" +
          "- По соглашению: snake_case, описывает что делает маршрут\n\n" +
          "**Один маршрут — несколько URL:** можно навесить несколько декораторов на одну функцию.\n\n" +
          "**Redirect на trailing slash:** `@app.route('/about/')` с trailing slash — если пользователь зайдёт на `/about` (без слеша), Flask перенаправит его на `/about/`. Без слеша — нет редиректа.\n\n" +
          "**Возвращаемые значения из view-функции:**\n" +
          "- `return 'текст'` → статус 200, тело = текст\n" +
          "- `return 'текст', 404` → статус 404\n" +
          "- `return response_object` → полный контроль над ответом\n" +
          "- `return render_template(...)` → рендер HTML-шаблона",
        code:
          "from flask import Flask\n\n" +
          "app = Flask(__name__)\n\n" +
          "# Один декоратор — один маршрут\n" +
          "@app.route('/')\n" +
          "def index():\n" +
          "    return '<h1>Главная</h1>'\n\n" +
          "# Два декоратора — два URL, одна функция\n" +
          "# И /about, и /о-нас ведут в одно место\n" +
          "@app.route('/about')\n" +
          "@app.route('/о-нас')\n" +
          "def about():\n" +
          "    return '<p>О нас</p>'\n\n" +
          "# Возврат кастомного статус-кода\n" +
          "@app.route('/not-found')\n" +
          "def not_found_page():\n" +
          "    return '<h1>Страница не найдена</h1>', 404\n\n" +
          "# Все зарегистрированные маршруты (удобно для отладки)\n" +
          "@app.route('/routes')\n" +
          "def show_routes():\n" +
          "    routes = [str(rule) for rule in app.url_map.iter_rules()]\n" +
          "    return '<br>'.join(routes)\n\n" +
          "if __name__ == '__main__':\n" +
          "    app.run(debug=True)",
        keyTakeaways: [
          "Каждый маршрут = запись в словаре {URL: функция}. Декоратор добавляет запись при импорте.",
          "Имя view-функции = имя для url_for(). Должно быть уникальным.",
          "`return 'html', status_code` — вернуть ответ с кастомным статусом.",
        ],
        pitfalls: [
          "Два маршрута с одинаковым именем функции — AssertionError при запуске.",
          "@app.route('/about') ≠ @app.route('/about/') — это разные URL.",
          "Маршруты не работают, если файл не импортирован. Убедись что app.py содержит весь код.",
        ],
      },
      {
        heading: "Динамические параметры URL: <variable> и типы",
        tagline: "<username> в маршруте → аргумент функции username. Автоматически.",
        body:
          "**Статические маршруты** — `/`, `/about`, `/contact` — всегда одни и те же.\n\n" +
          "**Динамические маршруты** — часть URL берётся как параметр:\n" +
          "- `/user/<username>` → переменная username\n" +
          "- `/post/<int:post_id>` → целое число post_id\n" +
          "- `/file/<path:filename>` → путь с `/`, например `docs/intro.pdf`\n\n" +
          "**Встроенные конвертеры:**\n" +
          "- `<string:name>` — строка без `/` (по умолчанию)\n" +
          "- `<int:id>` — целое число; если придёт не число — Flask вернёт 404\n" +
          "- `<float:price>` — число с точкой\n" +
          "- `<path:filepath>` — строка с `/` (для путей к файлам)\n" +
          "- `<uuid:token>` — UUID-формат (8-4-4-4-12)\n\n" +
          "**Как это работает пошагово:**\n\n" +
          "1. Flask видит запрос `GET /user/Аня`\n" +
          "2. Ищет маршрут, который подходит по шаблону\n" +
          "3. Находит `@app.route('/user/<username>')`\n" +
          "4. Извлекает `Аня` из URL и присваивает переменной `username`\n" +
          "5. Вызывает `profile(username='Аня')`\n" +
          "6. Функция получает строку `'Аня'` как обычный аргумент",
        code:
          "from flask import Flask\n\n" +
          "app = Flask(__name__)\n\n" +
          "# Строковый параметр (по умолчанию)\n" +
          "@app.route('/user/<username>')\n" +
          "def profile(username):\n" +
          "    # GET /user/Аня → username = 'Аня'\n" +
          "    return f'<h2>Профиль: {username}</h2>'\n\n" +
          "# Целочисленный параметр — Flask проверит, что post_id — число\n" +
          "# GET /post/abc → 404 (не число!)\n" +
          "# GET /post/42  → post_id = 42 (уже int, не строка)\n" +
          "@app.route('/post/<int:post_id>')\n" +
          "def post(post_id):\n" +
          "    return f'<p>Статья #{post_id}, следующая: #{post_id + 1}</p>'\n\n" +
          "# Путь с подпапками — path включает '/'\n" +
          "@app.route('/files/<path:filepath>')\n" +
          "def get_file(filepath):\n" +
          "    # GET /files/docs/intro.pdf → filepath = 'docs/intro.pdf'\n" +
          "    return f'<p>Файл: {filepath}</p>'\n\n" +
          "# Несколько параметров в одном маршруте\n" +
          "@app.route('/blog/<int:year>/<int:month>/<slug>')\n" +
          "def blog_post(year, month, slug):\n" +
          "    return f'<p>Пост {slug} за {month}/{year}</p>'\n\n" +
          "if __name__ == '__main__':\n" +
          "    app.run(debug=True)",
        keyTakeaways: [
          "`<param>` в маршруте → аргумент функции. Имя обязано совпадать!",
          "`<int:id>` — Flask автоматически конвертирует и вернёт 404 если не число.",
          "`<path:fp>` единственный конвертер, который позволяет `/` в значении.",
        ],
        pitfalls: [
          "Имя в `<param>` ОБЯЗАНО совпадать с именем аргумента функции — иначе TypeError при старте.",
          "Порядок маршрутов: более конкретные (`/user/admin`) регистрируй ПЕРЕД общими (`/user/<name>`).",
          "Flask чувствителен к trailing slash: `/about` и `/about/` — разные URL.",
        ],
        analogy:
          "Маршрут с параметром — как шаблон адреса: 'ул. Ленина, квартира <номер>'. Когда приходит запрос на 'ул. Ленина, кв. 42' — Flask вырезает 42 и передаёт его в функцию как `номер`.",
      },
      {
        heading: "HTTP-методы: GET, POST и объект request",
        tagline: "По умолчанию маршрут принимает только GET — для POST нужно явно указать methods",
        body:
          "**Основные HTTP-методы:**\n" +
          "- `GET` — получить данные. Параметры в URL. Безопасный, идемпотентный.\n" +
          "- `POST` — отправить данные. Параметры в теле запроса. Формы, создание ресурсов.\n" +
          "- `PUT` / `PATCH` — обновить ресурс\n" +
          "- `DELETE` — удалить ресурс\n\n" +
          "**Как добавить поддержку POST:**\n\n" +
          "```python\n" +
          "@app.route('/login', methods=['GET', 'POST'])\n" +
          "def login():\n" +
          "    ...\n" +
          "```\n\n" +
          "Без `methods=['POST']` → Flask вернёт **405 Method Not Allowed**.\n\n" +
          "**Объект request** — доступен в любой view-функции через `from flask import request`:\n" +
          "- `request.method` — 'GET', 'POST', 'PUT' и т.д.\n" +
          "- `request.form` — данные из HTML-формы (POST)\n" +
          "- `request.args` — query-параметры: `/search?q=Flask` → `request.args['q']`\n" +
          "- `request.json` — тело JSON-запроса (API)\n" +
          "- `request.files` — загруженные файлы\n" +
          "- `request.headers` — HTTP-заголовки\n\n" +
          "**Паттерн GET/POST для форм:**\n" +
          "GET → показать форму, POST → обработать данные. Это стандартный паттерн.\n" +
          "После POST всегда делай `redirect()` — это предотвращает повторную отправку формы при обновлении страницы (Post/Redirect/Get pattern).",
        code:
          "from flask import Flask, request, redirect, url_for\n\n" +
          "app = Flask(__name__)\n\n" +
          "# GET: показать форму. POST: обработать.\n" +
          "@app.route('/login', methods=['GET', 'POST'])\n" +
          "def login():\n" +
          "    if request.method == 'POST':\n" +
          "        # Данные из <input name='username'> и <input name='password'>\n" +
          "        username = request.form.get('username', '').strip()\n" +
          "        password = request.form.get('password', '')\n\n" +
          "        if username == 'admin' and password == '1234':\n" +
          "            # Redirect после POST — предотвращает дублирование при F5\n" +
          "            return redirect(url_for('dashboard'))\n" +
          "        return '<p>Неверные данные</p>', 401\n\n" +
          "    # GET — просто показать форму\n" +
          "    return '''\n" +
          "        <form method=\"post\">\n" +
          "            <input name=\"username\" placeholder=\"Логин\">\n" +
          "            <input name=\"password\" type=\"password\" placeholder=\"Пароль\">\n" +
          "            <button type=\"submit\">Войти</button>\n" +
          "        </form>\n" +
          "    '''\n\n" +
          "@app.route('/dashboard')\n" +
          "def dashboard():\n" +
          "    return '<h1>Личный кабинет</h1>'\n\n" +
          "# Query-параметры: /search?q=Flask&page=2\n" +
          "@app.route('/search')\n" +
          "def search():\n" +
          "    query = request.args.get('q', '')\n" +
          "    page = request.args.get('page', 1, type=int)\n" +
          "    return f'<p>Поиск: {query}, стр. {page}</p>'\n\n" +
          "if __name__ == '__main__':\n" +
          "    app.run(debug=True)",
        keyTakeaways: [
          "По умолчанию только GET. `methods=['GET', 'POST']` — явное разрешение.",
          "`request.form` — данные из HTML-формы. `request.args` — из URL (?q=...).",
          "Паттерн POST→redirect→GET предотвращает дублирование при обновлении страницы.",
        ],
        pitfalls: [
          "Забытый `methods=['POST']` → 405 Method Not Allowed. Очень частая ошибка.",
          "`request.form['key']` бросит KeyError если поля нет. Используй `.get('key', default)`.",
          "Объект `request` работает только внутри view-функции, не вне её контекста.",
        ],
      },
      {
        heading: "Структура Flask-проекта и запуск сервера",
        tagline: "Правильная структура папок — основа масштабируемого приложения",
        body:
          "**Минимальная структура Flask-проекта:**\n\n" +
          "```\n" +
          "myproject/\n" +
          "│  app.py              ← главный файл приложения\n" +
          "│  requirements.txt    ← список зависимостей\n" +
          "│  .env                ← переменные окружения (SECRET_KEY и т.д.)\n" +
          "│  .gitignore          ← не коммитим venv/ и .env\n" +
          "├─ templates/          ← HTML-шаблоны Jinja2\n" +
          "│    base.html\n" +
          "│    index.html\n" +
          "│    about.html\n" +
          "└─ static/             ← CSS, JS, изображения\n" +
          "     css/\n" +
          "       style.css\n" +
          "     js/\n" +
          "       app.js\n" +
          "     img/\n" +
          "       logo.png\n" +
          "```\n\n" +
          "**Почему templates/ и static/ именно так:**\n" +
          "Flask ищет шаблоны в `templates/` и статику в `static/` автоматически, основываясь на расположении файла, переданного в `Flask(__name__)`. Эти имена жёстко заданы в Flask — менять их без необходимости не стоит.\n\n" +
          "**Способы запуска:**\n\n" +
          "```bash\n" +
          "# Способ 1: прямой запуск\n" +
          "python app.py\n\n" +
          "# Способ 2: Flask CLI (рекомендуется для разработки)\n" +
          "export FLASK_APP=app.py\n" +
          "export FLASK_DEBUG=1\n" +
          "flask run\n\n" +
          "# Способ 3: с python-dotenv (автоматически читает .env)\n" +
          "# Установи: pip install python-dotenv\n" +
          "# Создай .flaskenv: FLASK_APP=app.py\\nFLASK_DEBUG=1\n" +
          "flask run\n" +
          "```\n\n" +
          "После запуска Flask слушает `http://127.0.0.1:5000/`.",
        code:
          "# app.py — правильная структура с переменными окружения\n" +
          "from flask import Flask, render_template\n" +
          "import os\n\n" +
          "# Для python-dotenv: автоматически читает .env\n" +
          "# from dotenv import load_dotenv\n" +
          "# load_dotenv()\n\n" +
          "app = Flask(__name__)\n\n" +
          "# SECRET_KEY нужен для сессий и flash-сообщений\n" +
          "# В .env: SECRET_KEY=мой-секретный-ключ-очень-длинный\n" +
          "app.secret_key = os.environ.get('SECRET_KEY', 'dev-key-not-for-production')\n\n" +
          "@app.route('/')\n" +
          "def index():\n" +
          "    # render_template ищет файл в папке templates/\n" +
          "    return render_template('index.html')\n\n" +
          "@app.route('/about')\n" +
          "def about():\n" +
          "    return render_template('about.html')\n\n" +
          "if __name__ == '__main__':\n" +
          "    # debug из переменной окружения (безопаснее)\n" +
          "    debug = os.environ.get('FLASK_DEBUG', '0') == '1'\n" +
          "    app.run(debug=debug, host='0.0.0.0', port=5000)",
        keyTakeaways: [
          "templates/ и static/ — стандартные папки Flask (ищет автоматически).",
          "SECRET_KEY хранить только в .env, никогда в коде — иначе уязвимость.",
          "`host='0.0.0.0'` нужен чтобы сервер был виден снаружи Docker/контейнера.",
        ],
        pitfalls: [
          "Папка templates/ РЯДОМ с app.py — если в другом месте, Flask её не найдёт.",
          "Не коммить .env в Git — там секреты. Добавь в .gitignore.",
          "requirements.txt генерируй через `pip freeze > requirements.txt` в активном venv.",
        ],
      },
    ],
    cheatSheet: [
      "`from flask import Flask; app = Flask(__name__)` — создать приложение.",
      "`@app.route('/path')` — зарегистрировать маршрут (только GET).",
      "`@app.route('/path', methods=['GET','POST'])` — разрешить POST.",
      "`<username>`, `<int:id>`, `<path:fp>` — типизированные параметры URL.",
      "`request.form['key']` — данные формы; `request.args.get('q')` — query-параметры.",
      "`return 'html', 404` — ответ с кастомным статус-кодом.",
      "`app.run(debug=True)` — dev-сервер; НИКОГДА не в продакшене.",
      "templates/ — для HTML, static/ — для CSS/JS/картинок.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fl1-f1",
      title: "Создание Flask-приложения",
      description:
        "Заверши минимальное Flask-приложение. Три пропуска — три ключевых элемента любого Flask-приложения.",
      code:
        "from flask import {{0}}\n\n" +
        "app = {{0}}({{1}})\n\n" +
        "@app.{{2}}('/')\n" +
        "def index():\n" +
        "    return '<h1>Привет!</h1>'\n\n" +
        "if __name__ == '__main__':\n" +
        "    app.run(debug=True)",
      answers: [["Flask"], ["__name__"], ["route"]],
      hints: [
        "Класс веб-приложения, который мы импортируем из пакета flask.",
        "Специальная Python-переменная. При прямом запуске файла равна '__main__', при импорте — имени модуля. Flask использует её чтобы найти папки templates/ и static/.",
        "Имя декоратора Flask, который регистрирует URL-маршрут. Полный вид: @app.___('/путь')",
      ],
      explanation: {
        summary:
          "Три обязательных элемента любого Flask-приложения: импорт класса Flask, создание экземпляра app, регистрация маршрута через декоратор.",
        keyPoints: [
          "`__name__` — это магическая переменная Python. Равна `'__main__'` если файл запущен напрямую через `python app.py`, или `'app'` если файл импортирован как модуль.",
          "Flask использует `__name__` чтобы знать, в какой папке искать `templates/` и `static/`.",
          "`@app.route` — это обычный Python-декоратор. Он вызывает `app.add_url_rule('/', 'index', index)` — добавляет запись в словарь маршрутов приложения.",
        ],
        realWorld:
          "В крупных Flask-приложениях используют Blueprints — отдельные 'мини-приложения' для каждой части сайта. Но механизм тот же: app.register_blueprint(bp).",
      },
    },
    {
      type: "fill",
      id: "fl1-f2",
      title: "Динамический маршрут с параметром",
      description:
        "Маршрут принимает имя пользователя прямо из URL. Заполни синтаксис динамического параметра и аргумент функции.",
      code:
        "from flask import Flask\n\n" +
        "app = Flask(__name__)\n\n" +
        "@app.route('/user/{{0}}username{{1}}')\n" +
        "def profile({{2}}):\n" +
        "    return f'Привет, {username}!'\n\n" +
        "# GET /user/Аня → вернёт 'Привет, Аня!'\n" +
        "# GET /user/42  → вернёт 'Привет, 42!'",
      answers: [["<"], [">"], ["username"]],
      hints: [
        "Открывающий символ динамического параметра в URL Flask.",
        "Закрывающий символ динамического параметра в URL Flask.",
        "Имя параметра должно совпадать с именем аргумента функции — иначе TypeError.",
      ],
      explanation: {
        summary:
          "Угловые скобки `<name>` в строке маршрута — синтаксис Flask для динамического сегмента. Flask автоматически передаёт значение как аргумент функции.",
        keyPoints: [
          "`<username>` — всё что между `<` и `>` становится именем переменной. Flask вырежет эту часть из URL и передаст в функцию.",
          "Имя в `<...>` ОБЯЗАНО точно совпадать с именем аргумента функции. `<username>` → `def profile(username)`. Если написать `def profile(name)` — будет `TypeError`.",
          "Типизация: `<int:id>` → Flask автоматически конвертирует в int и вернёт 404 если значение не является числом.",
        ],
        realWorld:
          "Динамические маршруты — основа REST API: `/api/users/<int:user_id>`, `/api/posts/<slug>`. Каждый ресурс имеет свой уникальный URL с параметрами.",
      },
    },
    {
      type: "fill",
      id: "fl1-f3",
      title: "Маршрут с GET и POST",
      description:
        "Добавь поддержку POST-метода и прочитай данные из формы. Без явного указания methods Flask принимает только GET.",
      code:
        "from flask import Flask, request\n\n" +
        "app = Flask(__name__)\n\n" +
        "@app.route('/login', {{0}}=['GET', 'POST'])\n" +
        "def login():\n" +
        "    if request.{{1}} == 'POST':\n" +
        "        name = request.{{2}}.get('name', '')\n" +
        "        return f'Вошёл: {name}'\n" +
        "    return '<form method=post><input name=name><button>Войти</button></form>'",
      answers: [["methods"], ["method"], ["form"]],
      hints: [
        "Ключевой аргумент декоратора @app.route, принимающий список разрешённых HTTP-методов.",
        "Атрибут объекта request, содержащий тип текущего запроса строкой ('GET', 'POST', 'PUT', ...).",
        "Атрибут request для доступа к данным HTML-формы (словарь из <input name=...>).",
      ],
      explanation: {
        summary:
          "`methods=` разрешает конкретные HTTP-методы; `request.method` показывает каким методом пришёл запрос; `request.form` даёт доступ к данным формы.",
        keyPoints: [
          "По умолчанию @app.route принимает только GET. Без `methods=['POST']` браузер получит **405 Method Not Allowed**.",
          "`request.method` — всегда заглавными буквами: 'GET', 'POST', 'PUT', 'DELETE'.",
          "`request.form` — это словарь. Используй `.get('key', default)` а не `['key']`, чтобы не получить KeyError если поле отсутствует.",
        ],
        realWorld:
          "Паттерн POST/Redirect/GET: после обработки POST-данных делай redirect(). Это предотвращает повторную отправку формы при нажатии F5 (обновление страницы).",
      },
    },
    {
      type: "fill",
      id: "fl1-f4",
      title: "Типизированный параметр и query-строка",
      description:
        "Заполни правильные типы параметров. post_id должен быть целым числом, а q — query-параметр из URL.",
      code:
        "from flask import Flask, request\n\n" +
        "app = Flask(__name__)\n\n" +
        "# GET /post/42 → post_id = 42 (int)\n" +
        "# GET /post/abc → 404 автоматически\n" +
        "@app.route('/post/<{{0}}:post_id>')\n" +
        "def post(post_id):\n" +
        "    return f'Статья #{post_id}'\n\n" +
        "# GET /search?q=Flask&page=2\n" +
        "@app.route('/search')\n" +
        "def search():\n" +
        "    q = request.{{1}}.get('q', '')\n" +
        "    page = request.{{1}}.get('page', 1, {{0}}=int)\n" +
        "    return f'Поиск: {q}, стр. {page}'",
      answers: [["int"], ["args"]],
      hints: [
        "Встроенный тип Python для целых чисел.",
        "Атрибут request для доступа к query-параметрам из URL (часть после ?).",
      ],
      explanation: {
        summary:
          "`<int:name>` автоматически конвертирует и защищает от нечисловых URL. `request.args` — словарь query-параметров (после `?` в URL).",
        keyPoints: [
          "`<int:post_id>` — Flask проверяет что значение является целым числом. Если нет — возвращает 404, не пропуская запрос в функцию.",
          "`request.args` — ImmutableMultiDict с query-параметрами. `/search?q=Flask` → `request.args['q'] == 'Flask'`.",
          "`.get('page', 1, type=int)` — безопасное получение параметра с преобразованием типа. Если параметра нет или он не число — вернёт 1.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "fl1-q1",
      title: "Зачем debug=True",
      question:
        "Что даёт флаг `debug=True` при запуске Flask-приложения? Назови два главных преимущества для разработчика.",
      answers: [
        "авто-перезагрузка при изменениях и страница ошибки с трейсбеком",
        "автоматическая перезагрузка и подробные ошибки в браузере",
        "hot reload и интерактивный дебаггер в браузере",
        "reloader и debugger",
        "авто-перезапуск и трейсбек",
        "перезагружает сервер и показывает ошибки",
        "автообновление при изменении кода",
        "авто-рестарт при изменениях",
        "reload при изменении файлов и отладчик в браузере",
        "debugging and hot reload",
      ],
      hint: "Один бонус связан с изменением кода, другой — с отображением ошибок.",
      explanation:
        "debug=True даёт две вещи:\n" +
        "1. **Reloader** — Flask следит за файлами и автоматически перезапускает сервер при любом изменении кода. Не нужно вручную останавливать и запускать.\n" +
        "2. **Интерактивный дебаггер** — при ошибке в браузере видна полная трассировка стека (traceback). Можно нажать на кадр и выполнять Python-код прямо в браузере.\n\n" +
        "ВАЖНО: debug=True в продакшене — это критическая уязвимость! Через дебаггер можно выполнить произвольный код на сервере.",
    },
    {
      type: "question",
      id: "fl1-q2",
      title: "Что вернёт Flask если маршрута нет",
      question:
        "Пользователь открыл `http://localhost:5000/unknown-page`, но такого маршрута нет в приложении. Какой HTTP-статус вернёт Flask?",
      answers: [
        "404",
        "404 not found",
        "не найдено",
        "страница не найдена",
        "ресурс не найден",
        "404 не найдено",
      ],
      hint: "Это стандартный HTTP-статус для 'страница не найдена'.",
      explanation:
        "Flask вернёт **404 Not Found**. Это стандартный HTTP-статус, означающий что запрошенный ресурс не найден на сервере.\n\n" +
        "Можно зарегистрировать свой обработчик 404:\n" +
        "@app.errorhandler(404)\n" +
        "def not_found(e):\n" +
        "    return render_template('404.html'), 404",
    },
    {
      type: "question",
      id: "fl1-q3",
      title: "request.form vs request.args",
      question:
        "В чём разница между `request.form` и `request.args`? Когда использовать каждый?",
      answers: [
        "form — данные из тела POST-запроса (HTML-форма), args — query-параметры из URL после вопросительного знака",
        "request.form для данных формы при POST, request.args для параметров в URL при GET",
        "form берёт данные из тела запроса, args из строки URL",
        "form из POST тела, args из URL строки после ?",
        "form для POST форм, args для GET параметров",
        "request.form — тело запроса POST, request.args — query params URL",
        "form из тела, args из строки запроса",
        "form при POST, args при GET",
        "form для html форм, args для url параметров",
        "form из body запроса args из url query string",
      ],
      hint: "Один для тела запроса, другой для части URL после ?",
      explanation:
        "`request.form` — данные из тела HTTP-запроса (HTML form с method=POST). Используется при обработке форм.\n\n" +
        "`request.args` — query-параметры из URL: `/search?q=Flask&page=2`. Обычно для GET-запросов с фильтрами, поиском, пагинацией.\n\n" +
        "Оба возвращают словарь. Используй `.get('key', default)` для безопасного доступа.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fl1-w1",
      title: "Flask-приложение с тремя маршрутами",
      task:
        "Создай Flask-приложение app.py с тремя маршрутами.\n\n" +
        "━━━ Шаг 1: Импорт и создание приложения ━━━\n" +
        "Напиши в начале файла:\n" +
        "  from flask import Flask\n" +
        "  app = Flask(__name__)\n\n" +
        "━━━ Шаг 2: Главная страница ━━━\n" +
        "Маршрут GET / возвращает HTML-строку '<h1>Главная</h1>'.\n" +
        "Напиши:\n" +
        "  @app.route('/')\n" +
        "  def index():\n" +
        "      return '<h1>Главная</h1>'\n\n" +
        "━━━ Шаг 3: Страница 'О нас' ━━━\n" +
        "Маршрут GET /about возвращает '<p>О нас</p>'.\n" +
        "Напиши аналогично шагу 2, но для URL '/about'.\n\n" +
        "━━━ Шаг 4: Динамическая страница пользователя ━━━\n" +
        "Маршрут GET /user/<name> возвращает f'<p>Пользователь: {name}</p>'.\n" +
        "ВАЖНО: функция обязана принимать аргумент с тем же именем что в <...>:\n" +
        "  @app.route('/user/<name>')\n" +
        "  def user(name):\n" +
        "      return f'<p>Пользователь: {name}</p>'\n\n" +
        "━━━ Шаг 5: Точка входа ━━━\n" +
        "В самом конце добавь запуск dev-сервера:\n" +
        "  if __name__ == '__main__':\n" +
        "      app.run(debug=True)\n\n" +
        "Запусти код кнопкой «Запустить» — если без ошибок, жми «Проверить».",
      hints: [
        "Шаг 1: `from flask import Flask` затем `app = Flask(__name__)`",
        "Шаг 2-3: @app.route('/путь') затем def имя_функции(): return '...'",
        "Шаг 4: @app.route('/user/<name>') — имя в <> ОБЯЗАНО совпасть с аргументом функции def user(name):",
      ],
      required: [
        "from flask import Flask",
        "app = Flask(__name__)",
        "@app.route('/')",
        "@app.route('/about')",
        "@app.route('/user/<name>')",
        "def user(name)",
      ],
      minLines: 16,
      explanation: {
        summary:
          "Три маршрута — три функции. Каждый @app.route связывает URL с Python-функцией. Динамический параметр <name> автоматически передаётся как аргумент функции.",
        keyPoints: [
          "Каждый @app.route регистрирует маршрут в словаре Flask. Когда приходит запрос, Flask ищет совпадение и вызывает соответствующую функцию.",
          "Функция с динамическим маршрутом ОБЯЗАНА иметь аргумент с тем же именем: `<name>` → `def user(name)`. Несовпадение = TypeError при запуске.",
          "f-строки работают внутри возвращаемого HTML — это просто Python-строка. `return f'<p>{name}</p>'` совершенно корректно.",
        ],
        realWorld:
          "В реальных проектах вместо return '<h1>...' используют render_template('index.html') — это загружает HTML из файла templates/. Но принцип маршрутизации тот же.",
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 2 · Jinja2 — шаблоны, переменные, фильтры, циклы
// ─────────────────────────────────────────────────────────────────────────────
const fl2: Round = {
  number: 2,
  title: "Flask · Шаблоны Jinja2 — динамический HTML",
  level: "Средний",
  intro:
    "Возвращать HTML-строки из Python — плохая идея: сложно писать, невозможно поддерживать, дизайнер не может работать с кодом. Jinja2 решает это раз и навсегда — шаблоны хранятся в отдельных файлах и поддерживают переменные, циклы и условия.\n\n" +
    "**Что ты изучишь:**\n" +
    "• render_template() — как Flask загружает HTML-файл и подставляет данные\n" +
    "• {{ variable }} — вывод значения; {% tag %} — управляющие конструкции\n" +
    "• Фильтры: upper, length, default, round, truncate и другие\n" +
    "• {% for %} с loop.index, loop.first, loop.last\n" +
    "• {% if %} / {% elif %} / {% else %} прямо в HTML\n\n" +
    "**Что ждёт в упражнениях:** заполнение кода с Jinja2, вопросы на синтаксис, задание создать страницу со списком из Python.",
  lesson: {
    title: "Jinja2: переменные, фильтры, циклы и условия в HTML",
    summary:
      "render_template() загружает HTML из templates/; синтаксис Jinja2: {{ }}, {% %}, {# #}; передача переменных; встроенные фильтры; циклы {% for %} с loop.index; условия {% if %}.",
    readingMinutes: 10,
    sections: [
      {
        heading: "render_template и передача данных из Python в HTML",
        tagline: "render_template('file.html', key=value) — главная функция работы с шаблонами",
        body:
          "**Проблема без шаблонов:** писать HTML прямо в Python-коде — это ужасно:\n\n" +
          "```python\n" +
          "# ПЛОХО — HTML внутри Python\n" +
          "return f'<html><body><h1>{name}</h1><p>Возраст: {age}</p></body></html>'\n" +
          "```\n\n" +
          "При добавлении стилей, JavaScript и сложной разметки это превращается в кошмар.\n\n" +
          "**Решение — render_template:**\n" +
          "1. Создай папку `templates/` рядом с `app.py`\n" +
          "2. Создай файл `templates/index.html` с HTML и Jinja2-тегами\n" +
          "3. В Python вызови `render_template('index.html', name='Аня', age=25)`\n" +
          "4. Flask найдёт файл, подставит переменные и вернёт готовый HTML\n\n" +
          "**Синтаксис Jinja2 — три типа тегов:**\n" +
          "- `{{ expression }}` — **вывод** значения. Всё внутри — Python-выражение.\n" +
          "- `{% statement %}` — **управляющие конструкции**: if, for, block, extends.\n" +
          "- `{# comment #}` — **комментарий**. Не попадает в финальный HTML.\n\n" +
          "**Что можно писать внутри {{ }}:**\n" +
          "- Переменную: `{{ name }}`\n" +
          "- Атрибут: `{{ user.name }}` или `{{ user['name'] }}`\n" +
          "- Метод: `{{ name.upper() }}`\n" +
          "- Выражение: `{{ price * 1.2 }}`\n" +
          "- Тернарный: `{{ 'да' if x else 'нет' }}`\n\n" +
          "**Автоматическое экранирование (XSS-защита):** Jinja2 по умолчанию экранирует `<`, `>`, `&`, `\"` — так что `{{ user_input }}` безопасен. Никогда не используй `{{ input | safe }}` для данных от пользователя.",
        code:
          "# app.py\n" +
          "from flask import Flask, render_template\n\n" +
          "app = Flask(__name__)\n\n" +
          "@app.route('/')\n" +
          "def index():\n" +
          "    # Все keyword-аргументы становятся переменными в шаблоне\n" +
          "    return render_template(\n" +
          "        'index.html',\n" +
          "        title='Главная страница',\n" +
          "        username='Аня',\n" +
          "        score=95,\n" +
          "        items=['Python', 'Flask', 'Jinja2'],\n" +
          "        user={'name': 'Аня', 'role': 'admin'},\n" +
          "    )\n\n" +
          "# templates/index.html\n" +
          "# <!DOCTYPE html>\n" +
          "# <html lang=\"ru\">\n" +
          "# <head>\n" +
          "#   <title>{{ title }}</title>   {# переменная title #}\n" +
          "# </head>\n" +
          "# <body>\n" +
          "#   <h1>Привет, {{ username }}!</h1>         {# строка #}\n" +
          "#   <p>Твой счёт: {{ score }}</p>             {# число #}\n" +
          "#   <p>Кол-во: {{ items | length }}</p>       {# фильтр #}\n" +
          "#   <p>Роль: {{ user.role | upper }}</p>      {# атрибут + фильтр #}\n" +
          "#   <p>{{ 'Админ' if user.role == 'admin' else 'Гость' }}</p>\n" +
          "# </body>\n" +
          "# </html>",
        keyTakeaways: [
          "`render_template('file.html', key=val)` — загрузить шаблон с переменными из templates/.",
          "`{{ var }}` — вывод значения; автоэкранирование включено (безопасно от XSS).",
          "Передавай любые Python-объекты: строки, числа, списки, словари, объекты классов.",
        ],
        pitfalls: [
          "Файл шаблона ОБЯЗАН быть в папке templates/ — иначе `jinja2.TemplateNotFound`.",
          "`{{ user_input | safe }}` — обходит XSS-защиту! Только для доверенного HTML.",
          "Если переменная не передана — Jinja2 вернёт пустую строку (не ошибку) в режиме `undefined`.",
        ],
        analogy:
          "render_template — как принтер с заготовкой. HTML-шаблон — это бланк с полями ({{ name }}). Python передаёт значения, принтер вставляет их и выдаёт готовую страницу.",
      },
      {
        heading: "Фильтры Jinja2 — преобразование значений",
        tagline: "{{ value | filter }} — конвейер преобразований прямо в шаблоне",
        body:
          "**Фильтры** применяются через символ `|` и преобразуют значение перед выводом. Можно цеплять несколько фильтров подряд.\n\n" +
          "**Строковые фильтры:**\n" +
          "- `{{ name | upper }}` → 'АНЯ'\n" +
          "- `{{ name | lower }}` → 'аня'\n" +
          "- `{{ name | title }}` → 'Аня Иванова'\n" +
          "- `{{ text | truncate(50) }}` → первые 50 символов + '...'\n" +
          "- `{{ text | truncate(50, killwords=True, end='…') }}` — настраиваемый обрыв\n" +
          "- `{{ name | trim }}` → убрать пробелы по краям\n" +
          "- `{{ name | replace('А', 'a') }}` → замена\n\n" +
          "**Числовые фильтры:**\n" +
          "- `{{ price | round(2) }}` → 9.99\n" +
          "- `{{ value | int }}` → привести к целому\n" +
          "- `{{ value | float }}` → привести к float\n" +
          "- `{{ big_number | filesizeformat }}` → '1.2 MB'\n\n" +
          "**Фильтры коллекций:**\n" +
          "- `{{ items | length }}` → длина\n" +
          "- `{{ items | join(', ') }}` → элементы через запятую\n" +
          "- `{{ items | sort }}` → сортированный список\n" +
          "- `{{ items | reverse | list }}` → список в обратном порядке\n" +
          "- `{{ items | first }}` / `{{ items | last }}` — первый/последний\n\n" +
          "**Универсальные фильтры:**\n" +
          "- `{{ value | default('—') }}` → если None или пусто — показать '—'\n" +
          "- `{{ value | default('—', boolean=True) }}` → если falsy (0, '', []) — тоже '—'\n\n" +
          "**Цепочка фильтров:** `{{ name | trim | upper | truncate(20) }}`",
        code:
          "<!-- templates/products.html —примеры всех основных фильтров -->\n" +
          "<!DOCTYPE html>\n" +
          "<html lang=\"ru\">\n" +
          "<body>\n\n" +
          "<!-- Строковые -->\n" +
          "<h1>{{ title | upper }}</h1>\n" +
          "<p>{{ description | truncate(100) }}</p>\n\n" +
          "<!-- Числовые -->\n" +
          "<p>Цена: {{ price | round(2) }} руб.</p>\n\n" +
          "<!-- default для None -->\n" +
          "<p>Скидка: {{ discount | default('нет') }}</p>\n\n" +
          "<!-- Список -->\n" +
          "<p>Теги: {{ tags | join(', ') }}</p>\n" +
          "<p>Всего: {{ products | length }} товаров</p>\n\n" +
          "<!-- Цепочка фильтров -->\n" +
          "<p>Автор: {{ author | trim | title }}</p>\n\n" +
          "</body>\n" +
          "</html>",
        keyTakeaways: [
          "`{{ value | filter }}` — конвейер. `{{ val | trim | upper }}` — цепочка.",
          "`| default('—')` — незаменим для опциональных полей (None → '—').",
          "`| length`, `| join`, `| sort` — стандартный набор для списков.",
        ],
        pitfalls: [
          "`| safe` — отключает экранирование! Никогда для пользовательского ввода.",
          "Фильтры чувствительны к типу: `{{ number | upper }}` — ошибка (upper только для строк).",
          "Jinja2 — не Python: нет list comprehensions, нет f-строк, нет import.",
        ],
      },
      {
        heading: "Циклы {% for %} и переменные loop",
        tagline: "{% for item in list %} — обязательно закрывать {% endfor %}",
        body:
          "**Синтаксис цикла в Jinja2:**\n\n" +
          "```html\n" +
          "{% for item in items %}\n" +
          "    <p>{{ item }}</p>\n" +
          "{% endfor %}\n" +
          "```\n\n" +
          "**Переменная `loop` — магический объект внутри цикла:**\n" +
          "- `loop.index` — номер итерации, начиная с **1**\n" +
          "- `loop.index0` — номер итерации, начиная с **0**\n" +
          "- `loop.first` — True если это первая итерация\n" +
          "- `loop.last` — True если это последняя итерация\n" +
          "- `loop.length` — общее количество элементов\n" +
          "- `loop.revindex` — номер итерации с конца\n\n" +
          "**Цикл по словарю:**\n\n" +
          "```html\n" +
          "{% for key, value in user.items() %}\n" +
          "    <p>{{ key }}: {{ value }}</p>\n" +
          "{% endfor %}\n" +
          "```\n\n" +
          "**{% else %} в цикле — выполняется если список пуст:**\n\n" +
          "```html\n" +
          "{% for item in items %}\n" +
          "    <p>{{ item }}</p>\n" +
          "{% else %}\n" +
          "    <p>Список пуст</p>\n" +
          "{% endfor %}\n" +
          "```\n\n" +
          "**ВАЖНО:** всегда закрывай `{% endfor %}`. Без него — TemplateSyntaxError.",
        code:
          "# app.py\n" +
          "from flask import Flask, render_template\n\n" +
          "app = Flask(__name__)\n\n" +
          "@app.route('/students')\n" +
          "def students():\n" +
          "    data = [\n" +
          "        {'name': 'Аня', 'grade': 95, 'city': 'Москва'},\n" +
          "        {'name': 'Иван', 'grade': 78, 'city': 'СПб'},\n" +
          "        {'name': 'Петя', 'grade': None, 'city': 'Казань'},\n" +
          "    ]\n" +
          "    return render_template('students.html', title='Студенты', students=data)\n\n" +
          "# templates/students.html\n" +
          "# <!DOCTYPE html><html lang=\"ru\"><body>\n" +
          "# <h1>{{ title | upper }}</h1>\n" +
          "# <p>Всего: {{ students | length }} студентов</p>\n" +
          "# <ol>\n" +
          "#   {% for s in students %}\n" +
          "#     <li>\n" +
          "#       {# loop.index — порядковый номер с 1 #}\n" +
          "#       {{ loop.index }}. {{ s.name }} ({{ s.city }})\n" +
          "#       — оценка: {{ s.grade | default('нет') }}\n" +
          "#       {# Спец-стиль для первого #}\n" +
          "#       {% if loop.first %}<strong>★ Лидер</strong>{% endif %}\n" +
          "#     </li>\n" +
          "#   {% else %}\n" +
          "#     <li>Студентов нет</li>\n" +
          "#   {% endfor %}\n" +
          "# </ol>\n" +
          "# </body></html>",
        keyTakeaways: [
          "`{% for x in list %} ... {% endfor %}` — обязательно закрывать endfor.",
          "`loop.index` — с 1; `loop.index0` — с 0; `loop.first`/`loop.last` — булевы.",
          "`{% else %}` внутри for — выполняется когда список пуст.",
        ],
        pitfalls: [
          "Забытый `{% endfor %}` → TemplateSyntaxError (Jinja2 укажет строку).",
          "`loop` доступна ТОЛЬКО внутри `{% for %}`-блока.",
          "В Jinja2 нет `break`/`continue` (в отличие от Python). Используй `{% if %}`.",
        ],
      },
      {
        heading: "Условия {% if %} / {% elif %} / {% else %}",
        tagline: "{% if condition %} в Jinja2 работает так же как в Python",
        body:
          "**Синтаксис условия:**\n\n" +
          "```html\n" +
          "{% if condition %}\n" +
          "    <!-- выполняется если True -->\n" +
          "{% elif other_condition %}\n" +
          "    <!-- иначе если -->\n" +
          "{% else %}\n" +
          "    <!-- иначе -->\n" +
          "{% endif %}\n" +
          "```\n\n" +
          "**Условие внутри выражения — тернарный оператор:**\n\n" +
          "`{{ 'Взрослый' if age >= 18 else 'Ребёнок' }}`\n\n" +
          "**Проверка существования переменной:**\n" +
          "- `{% if variable %}` — True если не None, не пустая строка, не 0\n" +
          "- `{% if variable is defined %}` — True если переменная передана в шаблон\n" +
          "- `{% if variable is none %}` — явная проверка на None\n\n" +
          "**Операторы в условиях:**\n" +
          "- `and`, `or`, `not` (не `&&`, `||`, `!` как в JavaScript)\n" +
          "- `in`, `not in`, `is`, `is not`\n" +
          "- `==`, `!=`, `<`, `>`, `<=`, `>=`\n\n" +
          "**ВАЖНО:** всегда закрывай `{% endif %}`. Без него — TemplateSyntaxError.",
        code:
          "<!-- templates/profile.html — примеры условий -->\n" +
          "<!DOCTYPE html>\n" +
          "<html lang=\"ru\">\n" +
          "<body>\n\n" +
          "<h1>{{ username }}</h1>\n\n" +
          "<!-- Многоуровневое условие -->\n" +
          "{% if score >= 90 %}\n" +
          "  <span style=\"color:green\">Отлично ({{ score }})</span>\n" +
          "{% elif score >= 70 %}\n" +
          "  <span style=\"color:orange\">Хорошо ({{ score }})</span>\n" +
          "{% elif score >= 50 %}\n" +
          "  <span style=\"color:red\">Удовлетворительно ({{ score }})</span>\n" +
          "{% else %}\n" +
          "  <span style=\"color:darkred\">Неудовлетворительно</span>\n" +
          "{% endif %}\n\n" +
          "<!-- Тернарный в строке -->\n" +
          "<p>Статус: {{ 'Взрослый' if age >= 18 else 'Ребёнок' }}</p>\n\n" +
          "<!-- Проверка на существование -->\n" +
          "{% if avatar is defined and avatar %}\n" +
          "  <img src=\"{{ avatar }}\" alt=\"Аватар\">\n" +
          "{% else %}\n" +
          "  <p>Нет аватара</p>\n" +
          "{% endif %}\n\n" +
          "<!-- Сложное условие -->\n" +
          "{% if user.role == 'admin' and user.active %}\n" +
          "  <a href=\"/admin\">Панель администратора</a>\n" +
          "{% endif %}\n\n" +
          "</body>\n" +
          "</html>",
        keyTakeaways: [
          "`{% if %}...{% elif %}...{% else %}...{% endif %}` — обязательно закрывать endif.",
          "`{{ 'yes' if x else 'no' }}` — тернарный оператор прямо внутри {{ }}.",
          "`and`, `or`, `not` — не `&&`, `||`, `!` (это JavaScript, не Python/Jinja2).",
        ],
        pitfalls: [
          "Забытый `{% endif %}` → TemplateSyntaxError.",
          "В Jinja2 используй `and`/`or`/`not`, а не `&&`/`||`/`!` — это частая ошибка после JavaScript.",
          "`{% if items %}` — False если items пустой список `[]`. Используй `{% if items | length > 0 %}` для явности.",
        ],
        analogy:
          "Jinja2 — как Word-шаблон с полями и условиями. {{ name }} — поле для заполнения, {% if %} — условное форматирование, {% for %} — как 'повторить для каждого' в таблице.",
      },
    ],
    cheatSheet: [
      "`render_template('page.html', key=val)` — вернуть HTML из templates/.",
      "`{{ variable }}` — вывод; `{{ var | filter }}` — с фильтром.",
      "`{{ 'yes' if x else 'no' }}` — тернарный оператор.",
      "`{% if x %} ... {% elif y %} ... {% else %} ... {% endif %}`",
      "`{% for item in list %} ... {{ loop.index }} ... {% endfor %}`",
      "Фильтры: `upper`, `lower`, `length`, `truncate`, `default`, `round`, `join`, `sort`.",
      "`{{ text | safe }}` — опасно! Только для доверенного HTML.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fl2-f1",
      title: "render_template и переменные",
      description:
        "Заверши маршрут — передай переменные в шаблон правильной функцией и обратись к атрибуту словаря.",
      code:
        "from flask import Flask, {{0}}\n\n" +
        "app = Flask(__name__)\n\n" +
        "@app.route('/profile')\n" +
        "def profile():\n" +
        "    user = {'name': 'Аня', 'age': 25, 'city': 'Москва'}\n" +
        "    return {{0}}(\n" +
        "        'profile.html',\n" +
        "        {{1}}=user,\n" +
        "        title='Профиль',\n" +
        "    )\n\n" +
        "# templates/profile.html:\n" +
        "# <h1>{{ {{1}}.{{2}} }}</h1>\n" +
        "# <p>Возраст: {{ {{1}}.age }}</p>\n" +
        "# <p>Город: {{ {{1}}.city }}</p>",
      answers: [["render_template"], ["user"], ["name"]],
      hints: [
        "Функция Flask для загрузки HTML-шаблона из папки templates/ с подстановкой переменных.",
        "Имя переменной, которую передаём в шаблон — должно совпадать с именем в {{ }} в HTML.",
        "Ключ словаря user, содержащий имя пользователя.",
      ],
      explanation: {
        summary:
          "render_template принимает имя файла и keyword-аргументы. Каждый аргумент становится переменной в шаблоне.",
        keyPoints: [
          "`render_template('file.html', user=user, title='...')` — имена аргументов становятся именами переменных в шаблоне.",
          "В Jinja2 к атрибутам словаря обращаются через точку: `{{ user.name }}` или `{{ user['name'] }}` — оба варианта работают.",
          "Файл шаблона ищется в папке `templates/` рядом с `app.py`.",
        ],
      },
    },
    {
      type: "fill",
      id: "fl2-f2",
      title: "Фильтры Jinja2",
      description:
        "Примени нужные фильтры: длину списка, обрезку строки и значение по умолчанию для None.",
      code:
        "<!-- templates/shop.html -->\n" +
        "<h1>{{ title | {{0}} }}</h1>\n" +
        "<p>Описание: {{ description | {{1}}(80) }}</p>\n" +
        "<p>Товаров: {{ products | {{2}} }}</p>\n" +
        "<p>Скидка: {{ discount | {{3}}('нет') }}</p>\n" +
        "<p>Теги: {{ tags | {{4}}(', ') }}</p>",
      answers: [["upper"], ["truncate"], ["length"], ["default"], ["join"]],
      hints: [
        "Фильтр для перевода строки в ВЕРХНИЙ РЕГИСТР.",
        "Фильтр для обрезки строки до N символов (с '...' в конце).",
        "Фильтр для получения количества элементов в коллекции.",
        "Фильтр для подстановки значения по умолчанию если переменная None или пустая.",
        "Фильтр для объединения элементов списка в строку с разделителем.",
      ],
      explanation: {
        summary: "Пять самых часто используемых Jinja2-фильтров для типичных задач в шаблонах.",
        keyPoints: [
          "`| upper` — всю строку в заглавные. `| lower` — строчные. `| title` — каждое слово с заглавной.",
          "`| truncate(80)` — обрезать до 80 символов с добавлением '...'.",
          "`| length` — работает для строк, списков, словарей (как len() в Python).",
          "`| default('нет')` — если значение None, пустая строка или 0 — показать 'нет'.",
          "`| join(', ')` — `['Python', 'Flask']` → `'Python, Flask'`.",
        ],
      },
    },
    {
      type: "fill",
      id: "fl2-f3",
      title: "Цикл for с loop.index",
      description:
        "Заполни цикл for и используй специальные переменные loop для нумерации и проверки первого элемента.",
      code:
        "<!-- templates/ranking.html -->\n" +
        "<ol>\n" +
        "  {{{0}} for player in players %}\n" +
        "    <li>\n" +
        "      {{ loop.{{1}} }}. {{ player.name }}\n" +
        "      {{{0}} if loop.{{2}} %}\n" +
        "        <strong>🥇 Победитель!</strong>\n" +
        "      {{{0}} {{3}} %}\n" +
        "    </li>\n" +
        "  {{{0}} {{4}} %}\n" +
        "</ol>",
      answers: [["%"], ["index"], ["first"], ["endif"], ["endfor"]],
      hints: [
        "Открывающий символ управляющих конструкций Jinja2 ({% начинается с этого символа).",
        "Атрибут переменной loop — номер текущей итерации, начиная с 1.",
        "Атрибут переменной loop — True если это первая итерация цикла.",
        "Закрывающий тег условия {% if %} в Jinja2.",
        "Закрывающий тег цикла {% for %} в Jinja2.",
      ],
      explanation: {
        summary:
          "{% for %} создаёт объект loop с полезными атрибутами. Обязательно закрывать endfor и endif.",
        keyPoints: [
          "`loop.index` — номер с 1; `loop.index0` — с 0. Удобно для пронумерованных списков.",
          "`loop.first` / `loop.last` — булевые, используются для спецоформления первого/последнего элемента.",
          "Вложенные теги (`{% if %}` внутри `{% for %}`) — каждый требует своего закрывающего тега.",
        ],
      },
    },
    {
      type: "fill",
      id: "fl2-f4",
      title: "Условие if/elif/else",
      description: "Заполни многоуровневое условие для отображения статуса оценки.",
      code:
        "<!-- templates/grade.html -->\n" +
        "{{{0}} if score >= 90 %}\n" +
        "  <span class=\"green\">Отлично ({{ score }})</span>\n" +
        "{{{0}} {{1}} score >= 70 %}\n" +
        "  <span class=\"orange\">Хорошо ({{ score }})</span>\n" +
        "{{{0}} else %}\n" +
        "  <span class=\"red\">Нужно лучше</span>\n" +
        "{{{0}} {{2}} %}\n\n" +
        "<!-- Тернарный вариант -->\n" +
        "<p>{{ 'Сдал' {{3}} score >= 60 {{4}} 'Не сдал' }}</p>",
      answers: [["%"], ["elif"], ["endif"], ["if"], ["else"]],
      hints: [
        "Открывающий символ управляющих конструкций Jinja2.",
        "Ключевое слово 'иначе если' — аналог elif в Python.",
        "Обязательное закрывающее слово для блока if в Jinja2.",
        "Ключевое слово для тернарного оператора внутри {{ }}.",
        "Ключевое слово для альтернативы в тернарном операторе.",
      ],
      explanation: {
        summary:
          "{% if %}/{% elif %}/{% else %}/{% endif %} — полный синтаксис условия. Тернарный {{ 'a' if x else 'b' }} — для коротких условий.",
        keyPoints: [
          "elif — не else if (в отличие от C/JavaScript). Это одно слово.",
          "{% endif %} — обязателен. Без него TemplateSyntaxError.",
          "Тернарный `{{ 'a' if x else 'b' }}` удобен для простых условий прямо в тексте.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "fl2-q1",
      title: "Три типа тегов Jinja2",
      question:
        "Назови три типа тегов Jinja2 и для чего каждый используется: {{ }}, {% %}, {# #}.",
      answers: [
        "двойные фигурные — вывод значений, фигурные с процентом — управляющие конструкции, с решёткой — комментарии",
        "{{ }} для вывода переменных, {% %} для if/for/block, {# #} для комментариев",
        "{{ expression }} вывод, {% statement %} управление, {# comment #} комментарии",
        "{{ }} переменные, {% %} логика, {# #} комментарии",
        "{{ вывод, {% управление, {# комментарий",
        "вывод значений, управляющие конструкции, комментарии",
        "{{ }} output {% %} control {# #} comment",
        "двойные для вывода процент для кода решётка для комментариев",
        "переменные управление комментарии",
      ],
      hint: "Первый выводит, второй управляет, третий комментирует.",
      explanation:
        "{{ expression }} — вывод значения. Всё внутри — Python-выражение: переменная, метод, фильтр.\n\n" +
        "{% statement %} — управляющие конструкции: if, for, block, extends, include, set, macro. Не выводят текст.\n\n" +
        "{# comment #} — комментарий, не попадает в HTML-вывод. Полезно для пояснений в шаблонах.",
    },
    {
      type: "question",
      id: "fl2-q2",
      title: "Что такое loop.index",
      question:
        "Ты пишешь цикл {% for item in items %} в Jinja2. Какое значение имеет `loop.index` на третьей итерации?",
      answers: ["3", "три", "index равен 3", "loop.index равен 3", "значение 3",
        "3 — считает с 1", "третье значение 3", "равно 3", "3 (с единицы)",
      ],
      hint: "loop.index считает с единицы, loop.index0 — с нуля.",
      explanation:
        "`loop.index` — номер текущей итерации, начиная с **1**. На третьей итерации — 3.\n\n" +
        "Если нужен с нуля — используй `loop.index0`. На третьей итерации будет 2.\n\n" +
        "Другие атрибуты: `loop.first` (первая?), `loop.last` (последняя?), `loop.length` (всего элементов), `loop.revindex` (с конца).",
    },
    {
      type: "question",
      id: "fl2-q3",
      title: "default фильтр",
      question:
        "В шаблоне есть `{{ user.bio | default('Нет описания') }}`. Когда именно отобразится текст 'Нет описания'?",
      answers: [
        "когда user.bio равно None или пустой строке",
        "если user.bio это None или пустая строка или False",
        "когда значение falsy: None, пустая строка, 0, пустой список",
        "когда bio равно None",
        "если значение None или пустое",
        "falsy значения — None пустая строка False 0",
        "когда bio не задан или None",
        "при None пустой строке и других falsy",
        "если user.bio отсутствует или None",
        "when bio is None or empty",
      ],
      hint: "Фильтр default срабатывает при falsy-значениях.",
      explanation:
        "`| default('Нет описания')` выводит дефолтное значение когда переменная **falsy** в Python: `None`, пустая строка `''`, `0`, `False`, `[]`, `{}`.\n\n" +
        "Если нужно только для `None` — используй `| default('...', boolean=False)`.\n\n" +
        "Чаще всего используют для опциональных полей: bio, avatar, website и т.д.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fl2-w1",
      title: "Страница со списком элементов",
      task:
        "Создай Flask-маршрут и шаблон, отображающий список книг с фильтрами и условиями.\n\n" +
        "━━━ Шаг 1: Маршрут в app.py ━━━\n" +
        "from flask import Flask, render_template\n" +
        "app = Flask(__name__)\n\n" +
        "@app.route('/books')\n" +
        "def books():\n" +
        "    # Создай список словарей (3 книги):\n" +
        "    book_list = [\n" +
        "        {'title': 'Flask Web Development', 'author': 'Miguel Grinberg', 'pages': 312},\n" +
        "        {'title': 'Python Tricks', 'author': 'Dan Bader', 'pages': 302},\n" +
        "        {'title': 'Clean Code', 'author': None, 'pages': 431},\n" +
        "    ]\n" +
        "    return render_template('books.html', books=book_list, title='Мои книги')\n\n" +
        "━━━ Шаг 2: Шаблон templates/books.html ━━━\n" +
        "Напиши HTML с Jinja2 (в виде строки-комментария или отдельного кода):\n\n" +
        "В шаблоне обязательно используй:\n" +
        "• {{ title | upper }} — заголовок в верхнем регистре\n" +
        "• {{ books | length }} — количество книг\n" +
        "• {% for book in books %} ... {% endfor %} — цикл\n" +
        "• {{ loop.index }} — порядковый номер\n" +
        "• {{ book.author | default('Автор неизвестен') }} — дефолт для None\n" +
        "• {% if book.pages > 350 %} ... {% endif %} — условие\n\n" +
        "━━━ Шаг 3: Запусти код ━━━\n" +
        "Нажми «Запустить» — если ошибок нет, нажми «Проверить».",
      hints: [
        "Шаг 1: список словарей → render_template('books.html', books=book_list, title='...')",
        "Шаг 2: {% for book in books %} {{ loop.index }}. {{ book.title }} {% endfor %}",
        "Для автора: {{ book.author | default('Автор неизвестен') }} — сработает когда None",
      ],
      required: [
        "render_template",
        "{% for",
        "{% endfor",
        "loop.index",
        "| default",
        "| length",
        "{% if",
      ],
      minLines: 18,
      explanation: {
        summary:
          "render_template + список словарей + Jinja2-цикл — стандартная связка для отображения данных из Python в HTML.",
        keyPoints: [
          "Данные передаются из Python в шаблон через keyword-аргументы render_template. Каждый аргумент — переменная в Jinja2.",
          "{% for %} в Jinja2 работает так же как в Python, плюс специальный объект `loop` с индексами и флагами.",
          "`| default('...')` незаменим для опциональных полей — когда часть данных может отсутствовать.",
        ],
        realWorld:
          "В реальных проектах данные приходят из базы данных (SQLAlchemy, SQLite). Но интерфейс тот же: Python-список/QuerySet → render_template → Jinja2-цикл.",
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 3 · Наследование шаблонов — base.html, block, include
// ─────────────────────────────────────────────────────────────────────────────
const fl3: Round = {
  number: 3,
  title: "Flask · Наследование шаблонов — base.html и блоки",
  level: "Средний",
  intro:
    "Представь 10 страниц сайта, каждая повторяет одну и ту же шапку, навигацию и подвал. При изменении меню — правишь 10 файлов. Наследование шаблонов решает это элегантно.\n\n" +
    "**Что ты изучишь:**\n" +
    "• {% extends 'base.html' %} — дочерний шаблон берёт всю структуру от родителя\n" +
    "• {% block content %}...{% endblock %} — «дырки» в base.html, которые заполняют дочерние шаблоны\n" +
    "• {{ super() }} — добавить к блоку родителя, не заменяя его\n" +
    "• {% include 'navbar.html' %} — вставить готовый кусок HTML из другого файла\n" +
    "• {{ url_for('view_name') }} — безопасные ссылки, которые не сломаются при рефакторинге\n\n" +
    "**Что ждёт в упражнениях:** заполнение кода base.html и дочернего шаблона, вопросы на url_for и super(), задание написать полную иерархию шаблонов поэтапно.",
  lesson: {
    title: "extends, block, include — переиспользование HTML без дублирования",
    summary:
      "{% extends %} — наследование шаблона; {% block %} — точки расширения; super() — добавить к родительскому блоку; {% include %} — переиспользование кусков HTML; url_for — безопасные URL.",
    readingMinutes: 10,
    sections: [
      {
        heading: "Проблема дублирования и её решение через наследование",
        tagline: "base.html — скелет сайта; дочерние шаблоны заполняют только содержимое",
        body:
          "**Проблема без наследования:**\n\n" +
          "```\n" +
          "index.html   — <html><head>...</head><nav>...</nav><main>ГЛАВНАЯ</main><footer>...</footer></html>\n" +
          "about.html   — <html><head>...</head><nav>...</nav><main>О НАС</main><footer>...</footer></html>\n" +
          "contact.html — <html><head>...</head><nav>...</nav><main>КОНТАКТЫ</main><footer>...</footer></html>\n" +
          "```\n\n" +
          "Шапка, навигация и подвал — одинаковые в каждом файле. Изменение меню = правка 10 файлов.\n\n" +
          "**Решение — три шага:**\n\n" +
          "1. Создай `templates/base.html` — общий скелет с `<head>`, `<nav>`, `<footer>`\n" +
          "2. В base.html объяви **блоки** (`{% block name %}{% endblock %}`) — «дырки» для контента\n" +
          "3. В каждой странице: `{% extends 'base.html' %}` + заполни только свои блоки\n\n" +
          "**Как это работает изнутри — пошагово:**\n\n" +
          "1. Flask загружает `index.html`\n" +
          "2. Jinja2 видит `{% extends 'base.html' %}`\n" +
          "3. Загружает и компилирует `base.html`\n" +
          "4. Для каждого `{% block %}` в base.html проверяет: переопределён ли он в index.html?\n" +
          "5. Если да — вставляет содержимое из index.html\n" +
          "6. Если нет — использует дефолтное содержимое из base.html\n" +
          "7. Возвращает склеенный HTML",
        code:
          "<!-- templates/base.html — СКЕЛЕТ САЙТА -->\n" +
          "<!DOCTYPE html>\n" +
          "<html lang=\"ru\">\n" +
          "<head>\n" +
          "  <meta charset=\"UTF-8\">\n" +
          "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n\n" +
          "  {# block title — дочерние шаблоны переопределяют заголовок вкладки #}\n" +
          "  <title>{% block title %}Мой сайт{% endblock %}</title>\n\n" +
          "  <link rel=\"stylesheet\" href=\"{{ url_for('static', filename='style.css') }}\">\n\n" +
          "  {# block extra_css — для страниц с доп. стилями #}\n" +
          "  {% block extra_css %}{% endblock %}\n" +
          "</head>\n" +
          "<body>\n" +
          "  <nav>\n" +
          "    <a href=\"{{ url_for('index') }}\">Главная</a>\n" +
          "    <a href=\"{{ url_for('about') }}\">О нас</a>\n" +
          "    <a href=\"{{ url_for('contact') }}\">Контакты</a>\n" +
          "  </nav>\n\n" +
          "  <main>\n" +
          "    {# block content — ГЛАВНАЯ «ДЫРКА» для содержимого страницы #}\n" +
          "    {% block content %}\n" +
          "      <p>Нет содержимого — переопредели block content в дочернем шаблоне</p>\n" +
          "    {% endblock %}\n" +
          "  </main>\n\n" +
          "  <footer>\n" +
          "    <p>© 2024 Мой сайт</p>\n" +
          "    {% block extra_footer %}{% endblock %}\n" +
          "  </footer>\n" +
          "</body>\n" +
          "</html>\n\n" +
          "<!-- templates/index.html — ДОЧЕРНИЙ ШАБЛОН -->\n" +
          "{% extends 'base.html' %}\n\n" +
          "{% block title %}Главная — Мой сайт{% endblock %}\n\n" +
          "{% block content %}\n" +
          "  <h1>Добро пожаловать!</h1>\n" +
          "  <p>Это главная страница.</p>\n" +
          "{% endblock %}\n\n" +
          "<!-- templates/about.html — ЕЩЁ ОДИН ДОЧЕРНИЙ ШАБЛОН -->\n" +
          "{% extends 'base.html' %}\n\n" +
          "{% block title %}О нас — Мой сайт{% endblock %}\n\n" +
          "{% block content %}\n" +
          "  <h1>О нас</h1>\n" +
          "  <p>Мы делаем крутые Flask-приложения.</p>\n" +
          "{% endblock %}",
        keyTakeaways: [
          "`{% extends 'base.html' %}` — ПЕРВАЯ строка дочернего шаблона. Ничего до неё.",
          "`{% block name %}дефолт{% endblock %}` — точка расширения. Дочерние переопределяют.",
          "Всё что вне блоков в дочернем шаблоне — игнорируется.",
        ],
        pitfalls: [
          "`{% extends %}` — ОБЯЗАТЕЛЬНО первая строка. HTML до него → ошибка или игнорирование.",
          "В дочернем шаблоне нельзя писать HTML вне блоков — Jinja2 его проигнорирует.",
          "Имя блока в base.html и дочернем ОБЯЗАНО совпадать (регистр важен).",
        ],
        analogy:
          "base.html — типовой бланк договора с пустыми полями. Каждая страница — заполненный экземпляр: меняет 'заголовок' и 'содержимое', весь остальной текст (шапка, подписи) одинаков.",
      },
      {
        heading: "super(), {% include %} и url_for в шаблонах",
        tagline: "super() расширяет блок; include вставляет файл; url_for генерирует URL",
        body:
          "**{{ super() }}** — вставляет содержимое родительского блока ПЕРЕД своим содержимым. Полезно когда нужно ДОБАВИТЬ что-то к блоку, а не заменить его целиком:\n\n" +
          "```html\n" +
          "{% block scripts %}\n" +
          "  {{ super() }}      {# сначала скрипты из base.html #}\n" +
          "  <script src=\"page.js\"></script>  {# потом добавляем свой #}\n" +
          "{% endblock %}\n" +
          "```\n\n" +
          "**{% include 'file.html' %}** — вставляет содержимое другого файла как есть. Хорошо для:\n" +
          "- Навигационного меню (`navbar.html`)\n" +
          "- Форм поиска (`search_form.html`)\n" +
          "- Блоков комментариев, рекламы и т.д.\n\n" +
          "Включённый файл видит все переменные текущего контекста.\n\n" +
          "**{{ url_for('view_name') }}** — КЛЮЧЕВАЯ функция. Генерирует URL по имени Python-функции.\n\n" +
          "**Почему url_for лучше жёстких путей:**\n" +
          "- Жёсткий путь: `href='/user/profile'` — сломается если ты переименуешь маршрут\n" +
          "- url_for: `href=\"{{ url_for('user_profile') }}\"` — автоматически обновится\n\n" +
          "**Синтаксис url_for:**\n" +
          "- `url_for('index')` → `/`\n" +
          "- `url_for('profile', username='Аня')` → `/user/Аня`\n" +
          "- `url_for('static', filename='css/main.css')` → `/static/css/main.css`",
        code:
          "<!-- Примеры url_for в шаблоне -->\n\n" +
          "<!-- Простая ссылка по имени функции -->\n" +
          "<a href=\"{{ url_for('index') }}\">Главная</a>\n" +
          "<a href=\"{{ url_for('about') }}\">О нас</a>\n\n" +
          "<!-- Маршрут с параметром: /user/<username> -->\n" +
          "<a href=\"{{ url_for('profile', username=current_user.name) }}\">Мой профиль</a>\n\n" +
          "<!-- Статические файлы — ВСЕГДА через url_for -->\n" +
          "<link rel=\"stylesheet\" href=\"{{ url_for('static', filename='css/main.css') }}\">\n" +
          "<script src=\"{{ url_for('static', filename='js/app.js') }}\"></script>\n" +
          "<img src=\"{{ url_for('static', filename='img/logo.png') }}\" alt=\"Лого\">\n\n" +
          "<!-- include — вставить templates/partials/navbar.html -->\n" +
          "{% include 'partials/navbar.html' %}\n\n" +
          "<!-- super() — добавить к родительскому блоку -->\n" +
          "{% block scripts %}\n" +
          "  {{ super() }}  {# JS из base.html — СНАЧАЛА #}\n" +
          "  <script src=\"{{ url_for('static', filename='js/page-specific.js') }}\"></script>\n" +
          "{% endblock %}",
        keyTakeaways: [
          "`url_for('func_name')` генерирует URL безопасно — при переименовании маршрута ссылки не сломаются.",
          "`{% include 'partial.html' %}` — переиспользование кусков HTML.",
          "`{{ super() }}` — добавить к блоку родителя, не заменяя его полностью.",
        ],
        pitfalls: [
          "Никогда не пиши `href='/about'` — используй `url_for('about')`. Жёсткие пути ломаются при рефакторинге.",
          "`{% include %}` не умеет передавать дополнительные переменные — они берутся из текущего контекста.",
          "`url_for` для статики: `filename` относительно папки `static/` (включая подпапки).",
        ],
      },
    ],
    cheatSheet: [
      "`{% extends 'base.html' %}` — первая строка дочернего шаблона.",
      "`{% block name %}дефолт{% endblock %}` — точка расширения в base.html.",
      "`{{ super() }}` — вставить содержимое родительского блока.",
      "`{% include 'partial.html' %}` — вставить кусок HTML.",
      "`{{ url_for('view_func') }}` — безопасный URL по имени функции.",
      "`{{ url_for('static', filename='css/style.css') }}` — URL статического файла.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fl3-f1",
      title: "base.html с блоками и url_for",
      description:
        "Заверши шаблон-скелет: объяви блоки для заголовка и содержимого, используй url_for для навигации.",
      code:
        "<!-- templates/base.html -->\n" +
        "<!DOCTYPE html>\n" +
        "<html lang=\"ru\">\n" +
        "<head>\n" +
        "  <title>{{% block {{0}} %}}Сайт{{% endblock %}}</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "  <nav>\n" +
        "    <a href=\"{{ {{1}}('index') }}\">Главная</a>\n" +
        "    <a href=\"{{ {{1}}('about') }}\">О нас</a>\n" +
        "  </nav>\n" +
        "  <main>\n" +
        "    {{% block {{2}} %}}{{% endblock %}}\n" +
        "  </main>\n" +
        "  <footer><p>© 2024</p></footer>\n" +
        "</body>\n" +
        "</html>",
      answers: [["title"], ["url_for"], ["content"]],
      hints: [
        "Стандартное имя блока для заголовка вкладки браузера.",
        "Функция Flask/Jinja2 для безопасной генерации URL по имени view-функции.",
        "Стандартное имя блока для основного содержимого страницы.",
      ],
      explanation: {
        summary:
          "base.html — скелет с блоками-точками расширения. url_for генерирует URL по имени Python-функции.",
        keyPoints: [
          "block title — дочерний шаблон может переопределить заголовок вкладки.",
          "url_for('index') — Flask найдёт функцию с таким именем и вернёт её URL. При переименовании маршрута ссылки не сломаются.",
          "block content — основной блок. В нём дочерние шаблоны размещают уникальный контент.",
        ],
      },
    },
    {
      type: "fill",
      id: "fl3-f2",
      title: "Дочерний шаблон: extends и block",
      description:
        "Создай дочерний шаблон about.html, наследующий base.html. Заполни директиву наследования и имена блоков.",
      code:
        "<!-- templates/about.html -->\n" +
        "{{% {{0}} 'base.html' %}}\n\n" +
        "{{% block {{1}} %}}О нас — Мой сайт{{% endblock %}}\n\n" +
        "{{% block {{2}} %}}\n" +
        "  <h1>О нас</h1>\n" +
        "  <p>Мы делаем Flask-приложения.</p>\n" +
        "{{% {{3}} %}}",
      answers: [["extends"], ["title"], ["content"], ["endblock"]],
      hints: [
        "Директива Jinja2 для указания родительского шаблона — первая строка файла.",
        "Имя блока для заголовка вкладки (такое же как в base.html).",
        "Имя основного блока содержимого (такое же как в base.html).",
        "Закрывающий тег любого блока в Jinja2.",
      ],
      explanation: {
        summary: "extends + переопределение блоков = страница без дублирования кода.",
        keyPoints: [
          "`{% extends %}` — ВСЕГДА первая строка. Ничего до неё.",
          "Имена блоков в дочернем шаблоне обязаны совпадать с именами в base.html.",
          "Блоки которые не переопределены — берут дефолтное содержимое из base.html.",
        ],
      },
    },
    {
      type: "fill",
      id: "fl3-f3",
      title: "url_for с параметрами и super()",
      description:
        "Заполни url_for с параметром маршрута и super() для расширения блока.",
      code:
        "<!-- templates/user_profile.html -->\n" +
        "{{% extends 'base.html' %}}\n\n" +
        "{{% block title %}}{{ user.name }} — Профиль{{% endblock %}}\n\n" +
        "{{% block content %}}\n" +
        "  <h1>{{ user.name }}</h1>\n" +
        "  <!-- url_for с параметром: /user/<username> -->\n" +
        "  <a href=\"{{ {{0}}('edit_profile', {{1}}=user.name) }}\">Редактировать</a>\n" +
        "{{% endblock %}}\n\n" +
        "{{% block scripts %}}\n" +
        "  {{ {{2}}() }}\n" +
        "  <script src=\"/static/profile.js\"></script>\n" +
        "{{% endblock %}}",
      answers: [["url_for"], ["username"], ["super"]],
      hints: [
        "Функция для генерации URL по имени view-функции.",
        "Имя параметра маршрута @app.route('/user/<username>') — должно совпадать.",
        "Функция Jinja2 для вставки содержимого родительского блока.",
      ],
      explanation: {
        summary:
          "url_for с keyword-аргументами заполняет параметры URL. super() позволяет расширять блок а не заменять его.",
        keyPoints: [
          "`url_for('edit_profile', username='Аня')` — генерирует URL для маршрута `/user/<username>` с `username='Аня'`.",
          "`{{ super() }}` — вставляет содержимое блока из base.html. Скрипты из base.html останутся.",
          "Порядок важен: `{{ super() }}` перед своим кодом → родительский JS загрузится первым.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "fl3-q1",
      title: "Почему url_for вместо жёстких путей",
      question:
        "Почему рекомендуется использовать `{{ url_for('func_name') }}` вместо прямой записи `href='/path'`?",
      answers: [
        "url_for автоматически обновляет ссылки при переименовании маршрутов",
        "url_for строит URL по имени функции и при рефакторинге маршрута ссылки не сломаются",
        "url_for гарантирует что ссылка всегда ведёт на актуальный URL функции",
        "не сломается при изменении маршрута",
        "при переименовании пути ссылки обновятся автоматически",
        "url_for генерирует путь по имени функции",
        "не нужно менять все href при рефакторинге",
        "автоматически строит url по имени view-функции",
        "generates url from function name, no hardcoded paths",
        "ссылки не нужно менять вручную при изменении url",
      ],
      hint: "Что случится со всеми href='/about' если ты переименуешь маршрут в '/company/about'?",
      explanation:
        "url_for('about') генерирует URL, находя маршрут по имени Python-функции. Если переименовать `/about` в `/company/about` — все `href='/about'` сломаются, а `url_for('about')` автоматически вернёт новый путь.\n\n" +
        "Дополнительно: url_for правильно обрабатывает HTTPS, query-параметры и строит абсолютные URL когда нужно.",
    },
    {
      type: "question",
      id: "fl3-q2",
      title: "super() в блоке",
      question: "Что делает `{{ super() }}` внутри `{% block scripts %}` дочернего шаблона?",
      answers: [
        "вставляет содержимое блока scripts из родительского шаблона",
        "добавляет контент из блока scripts базового шаблона",
        "подставляет скрипты из base.html не заменяя их",
        "включает содержимое родительского блока",
        "добавляет то что было в блоке базового шаблона",
        "подставляет содержимое base.html блока",
        "сохраняет контент родителя и добавляет к нему",
        "inserts parent block content",
        "выводит контент блока из base.html",
        "расширяет блок вместо полной замены",
      ],
      hint: "super() позволяет ДОБАВИТЬ к блоку, а не заменить его полностью.",
      explanation:
        "`{{ super() }}` вставляет содержимое того же блока из родительского шаблона. Дочерний шаблон расширяет блок, а не заменяет его.\n\n" +
        "Типичный кейс: base.html в блоке scripts подключает jQuery. Дочерняя страница хочет добавить свой скрипт. С `{{ super() }}` оба скрипта будут подключены.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fl3-w1",
      title: "Иерархия шаблонов: base.html + дочерние страницы",
      task:
        "Создай Flask-приложение с наследованием шаблонов — два маршрута, один base.html.\n\n" +
        "━━━ Шаг 1: Python-код (app.py) ━━━\n" +
        "from flask import Flask, render_template\n" +
        "app = Flask(__name__)\n\n" +
        "@app.route('/')\n" +
        "def index():\n" +
        "    return render_template('home.html')\n\n" +
        "@app.route('/about')\n" +
        "def about():\n" +
        "    return render_template('about.html')\n\n" +
        "if __name__ == '__main__':\n" +
        "    app.run(debug=True)\n\n" +
        "━━━ Шаг 2: Шаблон base.html (напиши как строку или комментарий) ━━━\n" +
        "Структура base.html:\n" +
        "  - DOCTYPE, <html>, <head> с {% block title %}\n" +
        "  - <nav> с ссылками через url_for('index') и url_for('about')\n" +
        "  - <main> с {% block content %}{% endblock %}\n" +
        "  - <footer>\n\n" +
        "━━━ Шаг 3: Шаблон home.html ━━━\n" +
        "  - {% extends 'base.html' %} — ПЕРВАЯ строка\n" +
        "  - {% block title %}Главная{% endblock %}\n" +
        "  - {% block content %}<h1>Главная</h1>{% endblock %}\n\n" +
        "━━━ Шаг 4: Шаблон about.html ━━━\n" +
        "  - Аналогично home.html, но другое содержимое\n\n" +
        "КЛЮЧЕВЫЕ ПРАВИЛА:\n" +
        "• extends — всегда первая строка дочернего шаблона\n" +
        "• Имена блоков обязаны совпадать в base.html и дочерних шаблонах\n" +
        "• В дочернем шаблоне нельзя писать HTML вне блоков\n\n" +
        "Проверь что в коде есть: extends, block, endblock, url_for.",
      hints: [
        "base.html: {% block content %}{% endblock %} — 'дырка' для содержимого каждой страницы",
        "home.html первая строка: {% extends 'base.html' %} — без этого ничего не работает",
        "url_for в навигации: {{ url_for('index') }} и {{ url_for('about') }}",
      ],
      required: ["render_template", "extends", "block", "endblock", "url_for"],
      minLines: 22,
      explanation: {
        summary:
          "Наследование: base.html — скелет со всем общим. Дочерние шаблоны переопределяют только уникальные блоки.",
        keyPoints: [
          "{% extends %} и {% block %} — основа DRY (Don't Repeat Yourself) в HTML.",
          "url_for в навигации — при переименовании маршрутов ссылки обновятся автоматически.",
          "block content — стандартное имя для основного блока. Можно добавлять сколько угодно блоков.",
        ],
        realWorld:
          "В крупных проектах base.html включает CDN-стили, analytics, мета-теги. Дочерние страницы добавляют только page-specific стили и скрипты через дополнительные блоки.",
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 4 · Формы, POST-запросы и redirect
// ─────────────────────────────────────────────────────────────────────────────
const fl4: Round = {
  number: 4,
  title: "Flask · Формы, POST-запросы и redirect",
  level: "Средний",
  intro:
    "Статические страницы без форм мертвы: нет входа, регистрации, поиска, комментариев. Формы — главный мост между пользователем и сервером.\n\n" +
    "**Что ты изучишь:**\n" +
    "• Как HTML-форма отправляет данные методом POST, и как Flask принимает их через request.form\n" +
    "• request.method — как отличить GET (показать форму) от POST (обработать)\n" +
    "• redirect() и url_for() — паттерн PRG (Post/Redirect/Get) для форм\n" +
    "• flash() и get_flashed_messages() — уведомления пользователю\n" +
    "• Базовая валидация на сервере — проверка данных перед сохранением\n\n" +
    "**Что ждёт в упражнениях:** заполнение кода формы и обработчика, вопросы на PRG-паттерн, задание написать полную форму входа поэтапно.",
  lesson: {
    title: "Формы в Flask: request.form, redirect, flash и валидация",
    summary:
      "Обработка HTML-форм: request.form и request.method; паттерн GET=форма/POST=обработка; redirect после POST; flash-уведомления; базовая серверная валидация.",
    readingMinutes: 11,
    sections: [
      {
        heading: "HTML-формы и Flask: как данные попадают на сервер",
        tagline: "method=POST → тело запроса → request.form['field_name']",
        body:
          "**Как работает HTML-форма:**\n\n" +
          "1. Браузер рендерит форму: `<form method='post' action='/login'>`\n" +
          "2. Пользователь заполняет поля и нажимает кнопку\n" +
          "3. Браузер собирает данные из всех `<input name='...'>` в словарь\n" +
          "4. Кодирует как `username=Аня&password=1234` (URL-encoded)\n" +
          "5. Отправляет POST-запрос на `/login` с данными в теле запроса\n" +
          "6. Flask принимает запрос, парсит тело → `request.form`\n" +
          "7. Flask вызывает функцию `login()`\n" +
          "8. Функция читает `request.form['username']` и `request.form['password']`\n\n" +
          "**Атрибуты HTML-формы:**\n" +
          "- `method='post'` — способ отправки. POST = в теле запроса (безопасно для паролей).\n" +
          "- `action='/login'` — URL для отправки. Если не указан — текущий URL.\n" +
          "- `name='username'` в `<input>` — ключ в request.form.\n\n" +
          "**Чтение данных из формы:**\n" +
          "- `request.form['username']` — KeyError если поля нет\n" +
          "- `request.form.get('username', '')` — безопасно, дефолт ''\n" +
          "- `request.form.get('remember', type=bool)` — с преобразованием типа",
        code:
          "from flask import Flask, request\n\n" +
          "app = Flask(__name__)\n\n" +
          "@app.route('/login', methods=['GET', 'POST'])\n" +
          "def login():\n" +
          "    if request.method == 'POST':\n" +
          "        # Безопасное чтение данных (без KeyError)\n" +
          "        username = request.form.get('username', '').strip()\n" +
          "        password = request.form.get('password', '')\n\n" +
          "        print(f'Получены данные: username={username!r}')\n\n" +
          "        if username and password:  # базовая проверка\n" +
          "            return f'Привет, {username}!'\n" +
          "        return 'Заполни все поля', 400\n\n" +
          "    # GET — показать форму\n" +
          "    return '''\n" +
          "        <!DOCTYPE html>\n" +
          "        <html><body>\n" +
          "        <form method=\"post\">\n" +
          "            <label>Логин: <input name=\"username\" required></label><br>\n" +
          "            <label>Пароль: <input name=\"password\" type=\"password\"></label><br>\n" +
          "            <button type=\"submit\">Войти</button>\n" +
          "        </form>\n" +
          "        </body></html>\n" +
          "    '''\n\n" +
          "if __name__ == '__main__':\n" +
          "    app.run(debug=True)",
        keyTakeaways: [
          "`name='field'` в `<input>` — ключ для `request.form['field']`.",
          "Всегда используй `.get('key', default)` — безопасно от KeyError.",
          "Метод POST — данные в теле запроса, не видны в URL (в отличие от GET).",
        ],
        pitfalls: [
          "Без `methods=['POST']` → 405 Method Not Allowed. Очень частая ошибка.",
          "`request.form['key']` бросает KeyError если поле не отправлено. Используй `.get()`.",
          "GET-параметры (`?key=val`) — это `request.args`, а не `request.form`.",
        ],
      },
      {
        heading: "Post/Redirect/Get — правильный паттерн для форм",
        tagline: "После POST → redirect() → GET. Это предотвращает дублирование при обновлении",
        body:
          "**Проблема без redirect:**\n" +
          "Пользователь отправил форму (POST), сервер вернул ответ напрямую. Пользователь нажал F5 (обновление) — браузер СНОВА отправляет POST. Данные дублируются.\n\n" +
          "**Решение — паттерн PRG (Post/Redirect/Get):**\n\n" +
          "1. Пользователь отправляет форму (POST)\n" +
          "2. Сервер обрабатывает данные\n" +
          "3. Сервер возвращает **redirect** на другую страницу (GET)\n" +
          "4. Браузер делает GET-запрос\n" +
          "5. При F5 — повторяется только безопасный GET, не POST\n\n" +
          "**Коды редиректа:**\n" +
          "- `302` (по умолчанию) — временный редирект. Использовать после форм.\n" +
          "- `301` — постоянный редирект. Для изменившихся URL.\n\n" +
          "**flash() — уведомления пользователю:**\n" +
          "Flash-сообщения — это одноразовые уведомления, хранящиеся в сессии до следующего запроса. После показа удаляются.\n\n" +
          "- `flash('Вход выполнен!', 'success')` — категория 'success'\n" +
          "- `flash('Неверный пароль', 'error')` — категория 'error'\n" +
          "- В шаблоне: `{% for msg in get_flashed_messages() %}`\n\n" +
          "**ВАЖНО:** flash() требует `app.secret_key` — без него ошибка.",
        code:
          "from flask import Flask, request, redirect, url_for, flash, render_template\n\n" +
          "app = Flask(__name__)\n" +
          "app.secret_key = 'dev-secret-key-change-in-production'\n\n" +
          "@app.route('/login', methods=['GET', 'POST'])\n" +
          "def login():\n" +
          "    if request.method == 'POST':\n" +
          "        username = request.form.get('username', '').strip()\n" +
          "        password = request.form.get('password', '')\n\n" +
          "        if username == 'admin' and password == '1234':\n" +
          "            flash('Добро пожаловать, ' + username + '!', 'success')\n" +
          "            # PRG: redirect после POST\n" +
          "            return redirect(url_for('dashboard'))\n\n" +
          "        flash('Неверный логин или пароль', 'error')\n" +
          "        # Redirect обратно на форму (не return ошибки напрямую)\n" +
          "        return redirect(url_for('login'))\n\n" +
          "    return render_template('login.html')\n\n" +
          "@app.route('/dashboard')\n" +
          "def dashboard():\n" +
          "    return render_template('dashboard.html')\n\n" +
          "# templates/login.html (часть):\n" +
          "# {% with messages = get_flashed_messages(with_categories=True) %}\n" +
          "#   {% for category, msg in messages %}\n" +
          "#     <div class=\"alert {{ category }}\">{{ msg }}</div>\n" +
          "#   {% endfor %}\n" +
          "# {% endwith %}\n" +
          "# <form method=\"post\">\n" +
          "#   <input name=\"username\" placeholder=\"Логин\">\n" +
          "#   <input name=\"password\" type=\"password\" placeholder=\"Пароль\">\n" +
          "#   <button>Войти</button>\n" +
          "# </form>",
        keyTakeaways: [
          "После обработки POST всегда делай `redirect(url_for('...'))` — паттерн PRG.",
          "`flash('сообщение', 'category')` → уведомление в следующем GET-запросе.",
          "`app.secret_key` обязателен для flash() и сессий.",
        ],
        pitfalls: [
          "Без redirect после POST — F5 дублирует отправку формы.",
          "Без `app.secret_key` — `RuntimeError: The session is unavailable because no secret key was set`.",
          "flash-сообщения показываются только ОДИН РАЗ — потом удаляются из сессии.",
        ],
        analogy:
          "POST/Redirect/GET — как кассовый чек. Ты оплатил (POST), получил уведомление (flash), тебя перенаправили на страницу подтверждения (redirect+GET). Если обновишь страницу подтверждения — оплата не повторится.",
      },
      {
        heading: "Серверная валидация форм",
        tagline: "Никогда не доверяй данным от пользователя — всегда проверяй на сервере",
        body:
          "**Почему серверная валидация обязательна:**\n" +
          "Клиентская (JavaScript/HTML5 required) — удобство для пользователя. Но любой может отключить JS или отправить запрос напрямую через curl. Серверная валидация — единственная реальная защита.\n\n" +
          "**Что нужно проверять:**\n" +
          "- Поле не пустое: `if not username:` или `if not username.strip():`\n" +
          "- Длина: `if len(password) < 8:`\n" +
          "- Формат email: через регулярное выражение или библиотеку\n" +
          "- Допустимые символы: `if not username.isalnum():`\n" +
          "- Уникальность: проверка в базе данных\n\n" +
          "**Паттерн сбора ошибок:**\n\n" +
          "```python\n" +
          "errors = []\n" +
          "if not username:\n" +
          "    errors.append('Введи логин')\n" +
          "if len(password) < 6:\n" +
          "    errors.append('Пароль минимум 6 символов')\n" +
          "if errors:\n" +
          "    # Вернуть форму с ошибками\n" +
          "    return render_template('form.html', errors=errors)\n" +
          "```\n\n" +
          "**Статус-коды для ошибок:**\n" +
          "- Верни `400 Bad Request` при ошибке валидации\n" +
          "- `return render_template('form.html', errors=errors), 400`\n\n" +
          "**Сохранение введённых данных при ошибке:**\n" +
          "Передай данные обратно в шаблон чтобы пользователь не перепечатывал:\n" +
          "`return render_template('form.html', errors=errors, username=username), 400`",
        code:
          "from flask import Flask, request, render_template, redirect, url_for, flash\n" +
          "import re\n\n" +
          "app = Flask(__name__)\n" +
          "app.secret_key = 'dev-key'\n\n" +
          "@app.route('/register', methods=['GET', 'POST'])\n" +
          "def register():\n" +
          "    errors = {}\n\n" +
          "    if request.method == 'POST':\n" +
          "        username = request.form.get('username', '').strip()\n" +
          "        email = request.form.get('email', '').strip()\n" +
          "        password = request.form.get('password', '')\n" +
          "        confirm = request.form.get('confirm_password', '')\n\n" +
          "        # Валидация каждого поля\n" +
          "        if not username:\n" +
          "            errors['username'] = 'Введи имя пользователя'\n" +
          "        elif len(username) < 3:\n" +
          "            errors['username'] = 'Минимум 3 символа'\n" +
          "        elif not username.isalnum():\n" +
          "            errors['username'] = 'Только буквы и цифры'\n\n" +
          "        if not email or '@' not in email:\n" +
          "            errors['email'] = 'Введи корректный email'\n\n" +
          "        if len(password) < 8:\n" +
          "            errors['password'] = 'Пароль минимум 8 символов'\n" +
          "        elif password != confirm:\n" +
          "            errors['confirm'] = 'Пароли не совпадают'\n\n" +
          "        if not errors:\n" +
          "            # Все данные корректны — сохраняем (здесь просто flash)\n" +
          "            flash(f'Аккаунт {username} создан!', 'success')\n" +
          "            return redirect(url_for('login'))\n\n" +
          "        # Вернуть форму с ошибками И сохранёнными значениями\n" +
          "        return render_template('register.html', errors=errors,\n" +
          "                               username=username, email=email), 400\n\n" +
          "    return render_template('register.html', errors={}, username='', email='')\n\n" +
          "if __name__ == '__main__':\n" +
          "    app.run(debug=True)",
        keyTakeaways: [
          "Всегда валидируй на сервере — клиентская валидация легко обходится.",
          "Словарь ошибок `errors = {}` — удобный паттерн для передачи ошибок в шаблон.",
          "Возвращай введённые данные в шаблон при ошибке — не заставляй перепечатывать.",
        ],
        pitfalls: [
          "`.strip()` при чтении строк — убирает пробелы по краям. Иначе `' '` пройдёт проверку `if username`.",
          "Никогда не храни пароли в открытом виде — только хэш через `werkzeug.security.generate_password_hash`.",
          "Проверяй тип данных: `request.form.get('age', type=int)` — иначе всё приходит строкой.",
        ],
      },
    ],
    cheatSheet: [
      "`request.form.get('field', '')` — безопасное чтение данных формы.",
      "`request.method == 'POST'` — проверить тип запроса.",
      "`redirect(url_for('view_func'))` — перенаправить после POST (паттерн PRG).",
      "`flash('msg', 'category')` + `app.secret_key` — уведомления пользователю.",
      "`get_flashed_messages(with_categories=True)` — получить уведомления в шаблоне.",
      "Валидация: `.strip()`, `len()`, `.isalnum()`, проверка `if not field:`.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fl4-f1",
      title: "Обработка формы: method и form",
      description:
        "Заверши обработчик формы входа: проверь метод запроса и прочитай данные из формы.",
      code:
        "from flask import Flask, request, redirect, url_for\n\n" +
        "app = Flask(__name__)\n\n" +
        "@app.route('/login', methods=['GET', 'POST'])\n" +
        "def login():\n" +
        "    if request.{{0}} == 'POST':\n" +
        "        username = request.{{1}}.get('username', '')\n" +
        "        if username:\n" +
        "            return {{2}}({{3}}('dashboard'))\n" +
        "    return '<form method=post><input name=username><button>Войти</button></form>'",
      answers: [["method"], ["form"], ["redirect"], ["url_for"]],
      hints: [
        "Атрибут request — строка с HTTP-методом текущего запроса ('GET', 'POST', 'PUT', ...).",
        "Атрибут request — словарь с данными из HTML-формы (method=post).",
        "Функция Flask для перенаправления на другой URL (возвращает ответ 302).",
        "Функция для генерации URL по имени view-функции.",
      ],
      explanation: {
        summary:
          "GET/POST в одной функции — стандартный паттерн Flask. POST → обработка → redirect.",
        keyPoints: [
          "`request.method` — строка всегда в ВЕРХНЕМ РЕГИСТРЕ: 'GET', 'POST', 'PUT'.",
          "`request.form` — данные из тела POST-запроса (из HTML-формы с method='post').",
          "redirect(url_for('dashboard')) — PRG паттерн. Предотвращает дублирование при F5.",
        ],
      },
    },
    {
      type: "fill",
      id: "fl4-f2",
      title: "flash-уведомления",
      description:
        "Добавь flash-сообщения для успеха и ошибки входа. Не забудь secret_key.",
      code:
        "from flask import Flask, request, redirect, url_for, {{0}}, render_template\n\n" +
        "app = Flask(__name__)\n" +
        "app.{{1}} = 'my-secret-key'\n\n" +
        "@app.route('/login', methods=['GET', 'POST'])\n" +
        "def login():\n" +
        "    if request.method == 'POST':\n" +
        "        username = request.form.get('username', '')\n" +
        "        if username == 'admin':\n" +
        "            {{0}}('Добро пожаловать!', '{{2}}')\n" +
        "            return redirect(url_for('index'))\n" +
        "        {{0}}('Пользователь не найден', '{{3}}')\n" +
        "    return render_template('login.html')",
      answers: [["flash"], ["secret_key"], ["success"], ["error"]],
      hints: [
        "Функция Flask для добавления одноразового уведомления в сессию.",
        "Атрибут объекта app — обязательный для flash() и сессий.",
        "Категория flash для успешного действия (часто используется для зелёных уведомлений).",
        "Категория flash для ошибки (часто для красных уведомлений).",
      ],
      explanation: {
        summary:
          "flash() хранит уведомления в сессии до следующего GET-запроса. Категории используются для стилизации.",
        keyPoints: [
          "`flash('msg', 'success')` — добавить в сессию. `get_flashed_messages()` — получить в шаблоне.",
          "Flash-сообщения показываются ОДИН РАЗ — после получения удаляются из сессии.",
          "secret_key — обязателен для любой работы с сессиями. Без него RuntimeError.",
        ],
      },
    },
    {
      type: "fill",
      id: "fl4-f3",
      title: "Валидация формы",
      description:
        "Заверши серверную валидацию: проверь что поля не пустые и пароль достаточно длинный.",
      code:
        "from flask import Flask, request, render_template\n\n" +
        "app = Flask(__name__)\n\n" +
        "@app.route('/register', methods=['GET', 'POST'])\n" +
        "def register():\n" +
        "    errors = []\n" +
        "    if request.method == 'POST':\n" +
        "        username = request.form.get('username', '').{{0}}()\n" +
        "        password = request.form.get('password', '')\n\n" +
        "        if {{1}} username:\n" +
        "            errors.append('Введи имя пользователя')\n" +
        "        if {{2}}(password) < 8:\n" +
        "            errors.append('Пароль минимум 8 символов')\n\n" +
        "        if {{1}} errors:\n" +
        "            return 'Успешно!'\n" +
        "    return render_template('register.html', errors=errors)",
      answers: [["strip"], ["not"], ["len"]],
      hints: [
        "Строковый метод для удаления пробелов по краям строки (чтобы ' ' не прошёл проверку).",
        "Оператор отрицания в Python — превращает True в False и наоборот.",
        "Встроенная функция Python для получения длины строки, списка и других коллекций.",
      ],
      explanation: {
        summary:
          "Серверная валидация: .strip() убирает пробелы, not проверяет пустоту, len() — длину.",
        keyPoints: [
          "`.strip()` обязателен — без него `' '` (пробел) пройдёт проверку `if username:`.",
          "`not errors` — проверить что список ошибок пуст (нет ошибок = можно сохранить).",
          "Всегда собирай ВСЕ ошибки перед показом — не показывай по одной по очереди.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "fl4-q1",
      title: "Зачем redirect после POST",
      question:
        "Зачем после обработки POST-запроса (отправки формы) принято делать redirect, а не возвращать ответ напрямую?",
      answers: [
        "чтобы при обновлении страницы браузер не повторял POST-запрос",
        "redirect предотвращает повторную отправку формы при нажатии F5",
        "паттерн PRG предотвращает дублирование данных при обновлении страницы",
        "post redirect get паттерн",
        "f5 не повторит post запрос",
        "при обновлении страницы форма не отправится повторно",
        "предотвращает дублирование данных",
        "PRG pattern prevents duplicate form submission",
        "нельзя отправить форму дважды при обновлении",
        "redirect после post чтобы f5 делал только get",
      ],
      hint: "Что будет если нажать F5 на странице после POST без redirect?",
      explanation:
        "Без redirect: если пользователь нажмёт F5 после отправки формы — браузер снова отправит POST с теми же данными. Если это форма заказа — заказ продублируется.\n\n" +
        "С redirect (паттерн PRG): после POST → redirect на GET → при F5 повторяется только безопасный GET.\n\n" +
        "Браузер обычно показывает предупреждение 'Confirm Form Resubmission', но лучше не доводить до этого.",
    },
    {
      type: "question",
      id: "fl4-q2",
      title: "request.form vs request.args",
      question: "Форма отправлена методом POST. Где Flask хранит данные из полей формы?",
      answers: [
        "в request.form",
        "request.form — данные из тела POST-запроса",
        "request.form",
        "form",
        "request.form — данные формы",
        "данные формы в request.form",
        "тело запроса request form",
        "request form",
        "в теле запроса в request.form",
        "request.form содержит данные формы",
        "form data in request.form",
        "request.form — POST body",
        "данные из тела post запроса",
        "тело пост запроса request form",
        "в объекте request.form",
      ],
      hint: "Данные POST-формы — в теле запроса, не в URL.",
      explanation:
        "`request.form` — данные из тела POST-запроса (HTML форма с method='post').\n\n" +
        "`request.args` — query-параметры из URL (после `?`), обычно в GET-запросах.\n\n" +
        "`request.json` — тело JSON-запроса (для API с `Content-Type: application/json`).\n\n" +
        "При GET с `<form method='get'>` — данные попадут в `request.args`.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fl4-w1",
      title: "Полная форма входа с валидацией и flash",
      task:
        "Создай Flask-приложение с формой входа, валидацией и перенаправлением.\n\n" +
        "━━━ Шаг 1: Настройка приложения ━━━\n" +
        "from flask import Flask, request, redirect, url_for, flash, render_template\n" +
        "app = Flask(__name__)\n" +
        "app.secret_key = 'my-secret'  # ОБЯЗАТЕЛЬНО для flash()\n\n" +
        "━━━ Шаг 2: Маршрут / (главная) ━━━\n" +
        "@app.route('/')\n" +
        "def index():\n" +
        "    return 'Добро пожаловать! <a href=\"/login\">Войти</a>'\n\n" +
        "━━━ Шаг 3: Маршрут /login (GET + POST) ━━━\n" +
        "@app.route('/login', methods=['GET', 'POST'])\n" +
        "def login():\n" +
        "    if request.method == 'POST':\n" +
        "        # Шаг 3а: Читай данные из формы\n" +
        "        username = request.form.get('username', '').strip()\n" +
        "        password = request.form.get('password', '')\n\n" +
        "        # Шаг 3б: Валидация\n" +
        "        if not username or not password:\n" +
        "            flash('Заполни все поля', 'error')\n" +
        "            return redirect(url_for('login'))\n\n" +
        "        # Шаг 3в: Проверка (простая — логин admin, пароль 1234)\n" +
        "        if username == 'admin' and password == '1234':\n" +
        "            flash(f'Привет, {username}!', 'success')\n" +
        "            return redirect(url_for('dashboard'))  # PRG паттерн!\n\n" +
        "        flash('Неверный логин или пароль', 'error')\n" +
        "        return redirect(url_for('login'))\n\n" +
        "    return '<form method=post>...(форма)</form>'\n\n" +
        "━━━ Шаг 4: Маршрут /dashboard ━━━\n" +
        "@app.route('/dashboard')\n" +
        "def dashboard():\n" +
        "    return 'Личный кабинет'\n\n" +
        "━━━ Шаг 5: Точка входа ━━━\n" +
        "if __name__ == '__main__':\n" +
        "    app.run(debug=True)\n\n" +
        "ПРОВЕРЬ: в коде должны быть flash(), redirect(), url_for(), request.form, secret_key.",
      hints: [
        "app.secret_key = 'любая-строка' — без этого flash() не работает (RuntimeError)",
        "request.form.get('username', '').strip() — читаем и убираем пробелы",
        "flash('msg', 'success') затем redirect(url_for('dashboard')) — PRG паттерн",
      ],
      required: [
        "secret_key",
        "request.form",
        "flash(",
        "redirect(",
        "url_for(",
        "methods=['GET', 'POST']",
      ],
      minLines: 22,
      explanation: {
        summary:
          "Полная форма входа: secret_key → flash → redirect. Паттерн PRG предотвращает дублирование.",
        keyPoints: [
          "secret_key — обязателен для сессий и flash(). Должен быть случайным в продакшене.",
          "Паттерн PRG (Post/Redirect/Get) — стандарт для всех форм. F5 повторяет только GET.",
          "flash() хранит сообщение в сессии до следующего запроса, потом автоматически удаляет.",
        ],
        realWorld:
          "В реальных приложениях используют Flask-Login для управления сессиями пользователей и Flask-WTF для форм с CSRF-защитой. Но механизм тот же: read form → validate → flash → redirect.",
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 5 · SQLAlchemy — база данных в Flask
// ─────────────────────────────────────────────────────────────────────────────
const fl5: Round = {
  number: 5,
  title: "Flask · Базы данных с Flask-SQLAlchemy",
  level: "Средний",
  intro:
    "Данные в переменных живут пока запущен сервер. База данных — постоянное хранилище. Flask-SQLAlchemy — ORM, который позволяет работать с базой через Python-классы, без SQL.\n\n" +
    "**Что ты изучишь:**\n" +
    "• Как настроить Flask-SQLAlchemy и создать модели (таблицы)\n" +
    "• CRUD: Create (добавить), Read (прочитать), Update (изменить), Delete (удалить)\n" +
    "• db.session — транзакции и сохранение данных\n" +
    "• Связи между таблицами: один ко многим (ForeignKey)\n\n" +
    "**Что ждёт в упражнениях:** заполнение кода моделей и CRUD-операций, вопросы на ORM vs SQL, задание создать модель с CRUD поэтапно.",
  lesson: {
    title: "Flask-SQLAlchemy: модели, CRUD и связи",
    summary:
      "Подключение Flask-SQLAlchemy; создание моделей (классы = таблицы); CRUD через db.session; db.session.add(), commit(), delete(); фильтрация: filter_by(), first(), all(); связи ForeignKey.",
    readingMinutes: 13,
    sections: [
      {
        heading: "Подключение Flask-SQLAlchemy и первая модель",
        tagline: "Класс Python = таблица в БД. Экземпляр класса = строка в таблице.",
        body:
          "**Установка:**\n\n" +
          "```bash\n" +
          "pip install flask-sqlalchemy\n" +
          "```\n\n" +
          "**Конфигурация — три обязательных шага:**\n\n" +
          "1. Указать URI базы данных: `app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'`\n" +
          "2. Создать объект SQLAlchemy: `db = SQLAlchemy(app)`\n" +
          "3. Создать таблицы: `db.create_all()` — один раз при старте\n\n" +
          "**Типы URI баз данных:**\n" +
          "- `sqlite:///filename.db` — SQLite файл (без сервера, для разработки)\n" +
          "- `postgresql://user:pass@localhost/dbname` — PostgreSQL\n" +
          "- `mysql://user:pass@localhost/dbname` — MySQL\n\n" +
          "**Как создать модель (таблицу):**\n" +
          "- Наследоваться от `db.Model`\n" +
          "- `__tablename__` — имя таблицы (опционально, по умолчанию = имя класса)\n" +
          "- Колонки через `db.Column(тип, опции...)`\n\n" +
          "**Типы колонок:**\n" +
          "- `db.Integer` — целое число\n" +
          "- `db.String(length)` — строка ограниченной длины\n" +
          "- `db.Text` — длинная строка\n" +
          "- `db.Boolean` — True/False\n" +
          "- `db.DateTime` — дата и время\n" +
          "- `db.Float` — число с плавающей точкой\n\n" +
          "**Опции колонок:**\n" +
          "- `primary_key=True` — первичный ключ (уникальный ID)\n" +
          "- `unique=True` — значение должно быть уникальным\n" +
          "- `nullable=False` — поле обязательно (NOT NULL)\n" +
          "- `default=...` — значение по умолчанию",
        code:
          "from flask import Flask\n" +
          "from flask_sqlalchemy import SQLAlchemy\n" +
          "from datetime import datetime\n\n" +
          "app = Flask(__name__)\n\n" +
          "# Настройка БД: SQLite (для разработки)\n" +
          "app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'\n" +
          "app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # отключить лишние логи\n\n" +
          "db = SQLAlchemy(app)\n\n" +
          "# Модель User — таблица 'user' в БД\n" +
          "class User(db.Model):\n" +
          "    __tablename__ = 'user'  # можно опустить — будет 'user' по умолчанию\n\n" +
          "    id = db.Column(db.Integer, primary_key=True)  # ID — автоинкремент\n" +
          "    username = db.Column(db.String(80), unique=True, nullable=False)\n" +
          "    email = db.Column(db.String(120), unique=True, nullable=False)\n" +
          "    bio = db.Column(db.Text, nullable=True)  # опциональное поле\n" +
          "    is_active = db.Column(db.Boolean, default=True)\n" +
          "    created_at = db.Column(db.DateTime, default=datetime.utcnow)\n\n" +
          "    def __repr__(self):\n" +
          "        # Полезно для отладки: print(user) → <User Аня>\n" +
          "        return f'<User {self.username}>'\n\n" +
          "# Создать таблицы (только один раз при инициализации)\n" +
          "with app.app_context():\n" +
          "    db.create_all()\n\n" +
          "if __name__ == '__main__':\n" +
          "    app.run(debug=True)",
        keyTakeaways: [
          "`db = SQLAlchemy(app)` — подключить ORM к приложению.",
          "Класс-наследник `db.Model` = таблица. Атрибуты класса = колонки.",
          "`db.create_all()` — создать все таблицы. Вызывается один раз при старте.",
        ],
        pitfalls: [
          "`SQLALCHEMY_DATABASE_URI` — обязательная настройка. Без неё `RuntimeError`.",
          "`db.create_all()` нужно вызывать в контексте приложения (`with app.app_context()`).",
          "`nullable=False` — если передать None в такую колонку → `IntegrityError`.",
        ],
      },
      {
        heading: "CRUD-операции: добавление, чтение, изменение, удаление",
        tagline: "db.session — транзакция. add() + commit() = сохранить. delete() + commit() = удалить.",
        body:
          "**CREATE — добавить запись:**\n\n" +
          "```python\n" +
          "user = User(username='Аня', email='anya@example.com')\n" +
          "db.session.add(user)   # добавить в транзакцию\n" +
          "db.session.commit()    # сохранить в БД\n" +
          "print(user.id)         # теперь у user есть id (назначен БД)\n" +
          "```\n\n" +
          "**READ — прочитать записи:**\n\n" +
          "```python\n" +
          "# Все пользователи\n" +
          "users = User.query.all()\n\n" +
          "# По id (или None)\n" +
          "user = User.query.get(1)\n\n" +
          "# Фильтрация\n" +
          "user = User.query.filter_by(username='Аня').first()\n\n" +
          "# Сложная фильтрация\n" +
          "users = User.query.filter(User.is_active == True).order_by(User.username).all()\n" +
          "```\n\n" +
          "**UPDATE — изменить запись:**\n\n" +
          "```python\n" +
          "user = User.query.get(1)\n" +
          "user.bio = 'Новое описание'  # просто изменяем атрибут\n" +
          "db.session.commit()          # сохранить изменения\n" +
          "```\n\n" +
          "**DELETE — удалить запись:**\n\n" +
          "```python\n" +
          "user = User.query.get(1)\n" +
          "db.session.delete(user)\n" +
          "db.session.commit()\n" +
          "```\n\n" +
          "**ВАЖНО — rollback при ошибке:**\n" +
          "Если commit() упал → нужно откатить транзакцию:\n" +
          "```python\n" +
          "try:\n" +
          "    db.session.commit()\n" +
          "except Exception:\n" +
          "    db.session.rollback()\n" +
          "    raise\n" +
          "```",
        code:
          "from flask import Flask, request, jsonify\n" +
          "from flask_sqlalchemy import SQLAlchemy\n\n" +
          "app = Flask(__name__)\n" +
          "app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'\n" +
          "db = SQLAlchemy(app)\n\n" +
          "class Todo(db.Model):\n" +
          "    id = db.Column(db.Integer, primary_key=True)\n" +
          "    text = db.Column(db.String(200), nullable=False)\n" +
          "    done = db.Column(db.Boolean, default=False)\n\n" +
          "# CREATE — добавить задачу\n" +
          "@app.route('/todos', methods=['POST'])\n" +
          "def create_todo():\n" +
          "    text = request.form.get('text', '').strip()\n" +
          "    if not text:\n" +
          "        return 'Текст обязателен', 400\n" +
          "    todo = Todo(text=text)\n" +
          "    db.session.add(todo)\n" +
          "    db.session.commit()\n" +
          "    return f'Добавлено: {todo.id}', 201\n\n" +
          "# READ — все задачи\n" +
          "@app.route('/todos')\n" +
          "def get_todos():\n" +
          "    todos = Todo.query.order_by(Todo.id).all()\n" +
          "    result = [{'id': t.id, 'text': t.text, 'done': t.done} for t in todos]\n" +
          "    return jsonify(result)\n\n" +
          "# UPDATE — отметить выполненной\n" +
          "@app.route('/todos/<int:todo_id>/done', methods=['POST'])\n" +
          "def complete_todo(todo_id):\n" +
          "    todo = Todo.query.get_or_404(todo_id)  # 404 если не найдено\n" +
          "    todo.done = True\n" +
          "    db.session.commit()\n" +
          "    return 'Готово'\n\n" +
          "# DELETE — удалить\n" +
          "@app.route('/todos/<int:todo_id>', methods=['DELETE'])\n" +
          "def delete_todo(todo_id):\n" +
          "    todo = Todo.query.get_or_404(todo_id)\n" +
          "    db.session.delete(todo)\n" +
          "    db.session.commit()\n" +
          "    return 'Удалено'\n\n" +
          "with app.app_context():\n" +
          "    db.create_all()\n\n" +
          "if __name__ == '__main__':\n" +
          "    app.run(debug=True)",
        keyTakeaways: [
          "`db.session.add(obj)` + `commit()` = INSERT. Изменить атрибут + `commit()` = UPDATE.",
          "`Model.query.filter_by(field=val).first()` — найти первую запись по фильтру.",
          "`get_or_404(id)` — автоматически вернёт 404 если запись не найдена.",
        ],
        pitfalls: [
          "Забытый `db.session.commit()` → изменения в памяти, не в БД.",
          "`db.session.add()` без `commit()` — данные в транзакции, но не сохранены.",
          "`User.query.get(id)` возвращает None если не найдено — проверяй перед использованием.",
        ],
      },
    ],
    cheatSheet: [
      "`app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.db'` — подключить SQLite.",
      "`db = SQLAlchemy(app)` — создать ORM-объект.",
      "`class Model(db.Model)` — модель = таблица.",
      "`db.session.add(obj); db.session.commit()` — сохранить.",
      "`Model.query.all()` — все записи; `.filter_by(field=val).first()` — с фильтром.",
      "`obj.field = new_val; db.session.commit()` — обновить.",
      "`db.session.delete(obj); db.session.commit()` — удалить.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fl5-f1",
      title: "Модель SQLAlchemy",
      description:
        "Создай модель Product для таблицы продуктов с нужными типами колонок.",
      code:
        "from flask import Flask\n" +
        "from flask_sqlalchemy import {{0}}\n\n" +
        "app = Flask(__name__)\n" +
        "app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shop.db'\n" +
        "db = {{0}}(app)\n\n" +
        "class Product(db.{{1}}):\n" +
        "    id = db.Column(db.{{2}}, primary_key=True)\n" +
        "    name = db.Column(db.{{3}}(100), nullable=False)\n" +
        "    price = db.Column(db.{{4}}, nullable=False)\n" +
        "    in_stock = db.Column(db.{{5}}, default=True)",
      answers: [["SQLAlchemy"], ["Model"], ["Integer"], ["String"], ["Float"], ["Boolean"]],
      hints: [
        "Класс расширения для работы с базами данных в Flask.",
        "Базовый класс от которого наследуются все модели SQLAlchemy.",
        "Тип колонки для целых чисел (id, количество, возраст...).",
        "Тип колонки для строк с ограниченной длиной (принимает максимальную длину).",
        "Тип колонки для чисел с плавающей точкой (цены, координаты...).",
        "Тип колонки для булевых значений (True/False).",
      ],
      explanation: {
        summary: "Каждая модель — Python-класс, каждая колонка — атрибут с db.Column(тип, опции).",
        keyPoints: [
          "primary_key=True — первичный ключ. SQLAlchemy автоматически добавляет автоинкремент для Integer PK.",
          "nullable=False — аналог NOT NULL в SQL. При попытке вставить None → IntegrityError.",
          "default=True — значение по умолчанию на уровне Python (не БД). Для БД-уровня: server_default.",
        ],
      },
    },
    {
      type: "fill",
      id: "fl5-f2",
      title: "CRUD: добавление и чтение",
      description:
        "Заверши маршруты для создания продукта и получения всех продуктов.",
      code:
        "from flask import Flask, request\n" +
        "from flask_sqlalchemy import SQLAlchemy\n\n" +
        "app = Flask(__name__)\n" +
        "app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shop.db'\n" +
        "db = SQLAlchemy(app)\n\n" +
        "class Product(db.Model):\n" +
        "    id = db.Column(db.Integer, primary_key=True)\n" +
        "    name = db.Column(db.String(100))\n\n" +
        "@app.route('/products', methods=['POST'])\n" +
        "def create():\n" +
        "    name = request.form.get('name', '')\n" +
        "    product = Product(name=name)\n" +
        "    db.session.{{0}}(product)\n" +
        "    db.session.{{1}}()\n" +
        "    return f'ID: {product.id}', 201\n\n" +
        "@app.route('/products')\n" +
        "def list_products():\n" +
        "    products = Product.{{2}}.{{3}}()\n" +
        "    return ', '.join(p.name for p in products)",
      answers: [["add"], ["commit"], ["query"], ["all"]],
      hints: [
        "Метод db.session для добавления объекта в текущую транзакцию.",
        "Метод db.session для сохранения всех изменений транзакции в базу данных.",
        "Атрибут модели SQLAlchemy для построения запросов к таблице.",
        "Метод запроса, возвращающий ВСЕ записи в виде списка Python.",
      ],
      explanation: {
        summary: "add() + commit() = INSERT. Model.query.all() = SELECT * FROM table.",
        keyPoints: [
          "После add() данные в транзакции. После commit() — в БД. Без commit() — потеряются.",
          "После commit() у объекта появляется id (назначен базой данных).",
          "query.all() возвращает список Python-объектов — не SQL-строки.",
        ],
      },
    },
    {
      type: "fill",
      id: "fl5-f3",
      title: "Поиск и get_or_404",
      description: "Найди пользователя по username и используй get_or_404 для поиска по id.",
      code:
        "from flask import Flask\n" +
        "from flask_sqlalchemy import SQLAlchemy\n\n" +
        "app = Flask(__name__)\n" +
        "app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'\n" +
        "db = SQLAlchemy(app)\n\n" +
        "class User(db.Model):\n" +
        "    id = db.Column(db.Integer, primary_key=True)\n" +
        "    username = db.Column(db.String(80), unique=True)\n\n" +
        "@app.route('/user/<username>')\n" +
        "def get_by_name(username):\n" +
        "    user = User.query.{{0}}(username=username).{{1}}()\n" +
        "    if not user:\n" +
        "        return 'Не найден', 404\n" +
        "    return user.username\n\n" +
        "@app.route('/user/<int:uid>')\n" +
        "def get_by_id(uid):\n" +
        "    user = User.query.{{2}}(uid)  # 404 если нет\n" +
        "    return user.username",
      answers: [["filter_by"], ["first"], ["get_or_404"]],
      hints: [
        "Метод запроса SQLAlchemy для фильтрации по значению поля (keyword-аргументы).",
        "Метод запроса возвращающий ПЕРВУЮ найденную запись или None.",
        "Метод запроса возвращающий запись по id или автоматически 404 если не найдена.",
      ],
      explanation: {
        summary:
          "filter_by().first() — безопасный поиск с проверкой. get_or_404() — удобный ярлык для поиска по id.",
        keyPoints: [
          "filter_by(username='Аня') эквивалентен SQL: WHERE username = 'Аня'.",
          ".first() — первая запись или None. .all() — список всех. .one() — ровно одна или исключение.",
          "get_or_404(id) — эквивалент `obj = get(id); if not obj: abort(404)`.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "fl5-q1",
      title: "Зачем db.session.commit()",
      question:
        "Ты вызвал `db.session.add(user)` но не вызвал `db.session.commit()`. Что произойдёт с данными?",
      answers: [
        "данные не сохранятся в базе данных",
        "данные останутся в транзакции в памяти, но не запишутся в базу",
        "без commit данные не попадут в базу данных",
        "данные потеряются", "не запишется в бд",
        "останется только в памяти", "не сохранятся",
        "не запишется в sqlite", "данные не будут сохранены",
        "потеряются при завершении запроса", "не попадут в базу",
        "not saved to database without commit",
      ],
      hint: "add() добавляет в транзакцию, commit() — сохраняет транзакцию в БД.",
      explanation:
        "`db.session.add(user)` добавляет объект в текущую транзакцию (в памяти).\n\n" +
        "Только `db.session.commit()` выполняет SQL INSERT и сохраняет данные в файл БД.\n\n" +
        "При ошибке между add() и commit() — данные теряются. При ошибке в commit() — используй `db.session.rollback()` для отката.",
    },
    {
      type: "question",
      id: "fl5-q2",
      title: "filter_by vs filter",
      question:
        "В чём разница между `User.query.filter_by(username='Аня')` и `User.query.filter(User.username == 'Аня')`?",
      answers: [
        "filter_by принимает keyword-аргументы для простых равенств, filter принимает Python-выражения для сложных условий",
        "filter_by проще для равенств, filter позволяет использовать > < != и другие операторы",
        "filter_by для простых сравнений по равенству, filter для сложных условий с операторами",
        "filter_by для равенства, filter для сложных условий",
        "filter_by keyword args, filter python expressions",
        "filter_by проще filter мощнее",
        "filter_by только ==, filter любые операторы",
        "filter_by shorthand, filter for complex queries",
        "filter_by для простого равенства filter для <> != like",
        "filter поддерживает все операторы filter_by только равенство",
      ],
      hint: "filter_by удобнее для простых случаев, filter — для сложной фильтрации.",
      explanation:
        "`filter_by(username='Аня')` — shorthand для простых равенств. Только `==`.\n\n" +
        "`filter(User.username == 'Аня')` — полный вариант. Поддерживает `!=`, `>`, `<`, `>=`, `<=`, `like()`, `in_()`, `and_()`, `or_()`.\n\n" +
        "Пример: `filter(User.age > 18, User.is_active == True)` — такого нет в filter_by.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fl5-w1",
      title: "CRUD для модели Todo",
      task:
        "Создай приложение с моделью Todo и маршрутами для создания, просмотра и удаления задач.\n\n" +
        "━━━ Шаг 1: Импорты и настройка ━━━\n" +
        "from flask import Flask, request, redirect, url_for\n" +
        "from flask_sqlalchemy import SQLAlchemy\n\n" +
        "app = Flask(__name__)\n" +
        "app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'\n" +
        "db = SQLAlchemy(app)\n\n" +
        "━━━ Шаг 2: Модель Todo ━━━\n" +
        "class Todo(db.Model):\n" +
        "    id = db.Column(db.Integer, primary_key=True)\n" +
        "    text = db.Column(db.String(200), nullable=False)\n" +
        "    done = db.Column(db.Boolean, default=False)\n\n" +
        "━━━ Шаг 3: Создать таблицы ━━━\n" +
        "with app.app_context():\n" +
        "    db.create_all()\n\n" +
        "━━━ Шаг 4: Маршруты ━━━\n\n" +
        "GET /todos — вернуть список всех задач:\n" +
        "    todos = Todo.query.all()\n" +
        "    return '\\n'.join(f'{t.id}: {t.text}' for t in todos)\n\n" +
        "POST /todos — создать задачу из form-данных:\n" +
        "    text = request.form.get('text', '')\n" +
        "    todo = Todo(text=text)\n" +
        "    db.session.add(todo); db.session.commit()\n" +
        "    return redirect(url_for('get_todos'))\n\n" +
        "DELETE /todos/<int:id> — удалить задачу по id:\n" +
        "    todo = Todo.query.get_or_404(todo_id)\n" +
        "    db.session.delete(todo); db.session.commit()\n" +
        "    return 'Удалено'\n\n" +
        "━━━ Шаг 5: Точка входа ━━━\n" +
        "if __name__ == '__main__':\n" +
        "    app.run(debug=True)\n\n" +
        "ПРОВЕРЬ: в коде должны быть db.Model, db.Column, db.session.add, db.session.commit, query.all().",
      hints: [
        "Шаг 2: class Todo(db.Model): id = db.Column(db.Integer, primary_key=True)",
        "CREATE: todo = Todo(text=text); db.session.add(todo); db.session.commit()",
        "READ: Todo.query.all() — список всех; .get_or_404(id) — по id или 404",
      ],
      required: [
        "db.Model",
        "db.Column",
        "db.session.add",
        "db.session.commit",
        "query.all",
        "get_or_404",
      ],
      minLines: 28,
      explanation: {
        summary:
          "ORM-паттерн: модель = таблица, экземпляр = строка. CRUD через db.session.",
        keyPoints: [
          "db.create_all() создаёт таблицы на основе моделей. Нужен app_context.",
          "query.all() = SELECT * FROM todo. get_or_404(id) = SELECT WHERE id=? + автоматический 404.",
          "db.session.add() + commit() — атомарная операция. Либо всё сохранится, либо ничего.",
        ],
        realWorld:
          "В продакшене SQLite заменяется PostgreSQL. Вместо прямого создания таблиц используют миграции (Flask-Migrate = Alembic), чтобы безопасно менять схему БД.",
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 6 · Blueprints — модульная архитектура Flask
// ─────────────────────────────────────────────────────────────────────────────
const fl6: Round = {
  number: 6,
  title: "Flask · Blueprints — модульная архитектура",
  level: "Сложный",
  intro:
    "Одного файла app.py для большого проекта недостаточно. Blueprints позволяют разбить приложение на независимые модули — каждый со своими маршрутами, шаблонами и статикой.\n\n" +
    "**Что ты изучишь:**\n" +
    "• Blueprint — что это и зачем (разбивка приложения на модули)\n" +
    "• Как создать Blueprint и зарегистрировать его в app\n" +
    "• url_prefix — все маршруты Blueprint получают общий префикс\n" +
    "• Application Factory — паттерн create_app() для тестируемого кода\n\n" +
    "**Что ждёт в упражнениях:** создание и регистрация Blueprint, вопросы на архитектуру, задание разделить приложение на модули.",
  lesson: {
    title: "Blueprints и Application Factory — масштабируемая архитектура Flask",
    summary:
      "Blueprint — мини-приложение со своими маршрутами; регистрация через app.register_blueprint(); url_prefix; Application Factory (create_app); структура каталогов для крупных проектов.",
    readingMinutes: 11,
    sections: [
      {
        heading: "Что такое Blueprint и зачем он нужен",
        tagline: "Blueprint = мини-Flask-приложение. Регистрируй сколько угодно в main app.",
        body:
          "**Проблема без Blueprints:** в одном `app.py` сотни маршрутов — код нечитаем.\n\n" +
          "**Решение — Blueprints:** разбить на логические модули:\n" +
          "- `auth/` — маршруты авторизации: /login, /logout, /register\n" +
          "- `blog/` — маршруты блога: /posts, /post/<id>, /new-post\n" +
          "- `admin/` — административная панель: /admin, /admin/users\n\n" +
          "**Структура проекта с Blueprints:**\n\n" +
          "```\n" +
          "myapp/\n" +
          "│  __init__.py      ← create_app() — фабрика приложения\n" +
          "│  config.py        ← настройки\n" +
          "│  models.py        ← модели БД\n" +
          "├─ auth/\n" +
          "│    __init__.py    ← Blueprint('auth', ...)\n" +
          "│    routes.py      ← @auth.route('/login')\n" +
          "│    templates/auth/ ← login.html, register.html\n" +
          "├─ blog/\n" +
          "│    __init__.py    ← Blueprint('blog', ...)\n" +
          "│    routes.py      ← @blog.route('/posts')\n" +
          "│    templates/blog/ ← post.html, list.html\n" +
          "└─ static/\n" +
          "```\n\n" +
          "**Как создать Blueprint — три шага:**\n\n" +
          "1. `auth = Blueprint('auth', __name__)` — создать blueprint\n" +
          "2. `@auth.route('/login')` — вместо @app.route, используй @blueprint_name.route\n" +
          "3. `app.register_blueprint(auth, url_prefix='/auth')` — зарегистрировать в app",
        code:
          "# auth/routes.py — Blueprint для авторизации\n" +
          "from flask import Blueprint, render_template, redirect, url_for, flash, request\n\n" +
          "# Создаём Blueprint\n" +
          "# 'auth' — имя (используется в url_for: url_for('auth.login'))\n" +
          "# __name__ — для поиска шаблонов/статики\n" +
          "auth = Blueprint('auth', __name__)\n\n" +
          "# Маршруты Blueprint — @auth.route вместо @app.route\n" +
          "@auth.route('/login')\n" +
          "def login():\n" +
          "    return render_template('auth/login.html')\n\n" +
          "@auth.route('/logout')\n" +
          "def logout():\n" +
          "    flash('Вы вышли', 'info')\n" +
          "    return redirect(url_for('auth.login'))  # 'auth.login' — blueprint.view\n\n" +
          "@auth.route('/register', methods=['GET', 'POST'])\n" +
          "def register():\n" +
          "    if request.method == 'POST':\n" +
          "        # обработка регистрации...\n" +
          "        return redirect(url_for('auth.login'))\n" +
          "    return render_template('auth/register.html')\n\n\n" +
          "# myapp/__init__.py — Application Factory\n" +
          "from flask import Flask\n" +
          "from flask_sqlalchemy import SQLAlchemy\n\n" +
          "db = SQLAlchemy()\n\n" +
          "def create_app(config_name='default'):\n" +
          "    app = Flask(__name__)\n" +
          "    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'\n" +
          "    app.config['SECRET_KEY'] = 'dev-key'\n\n" +
          "    db.init_app(app)\n\n" +
          "    # Регистрация Blueprints\n" +
          "    from auth.routes import auth\n" +
          "    app.register_blueprint(auth, url_prefix='/auth')\n\n" +
          "    from blog.routes import blog\n" +
          "    app.register_blueprint(blog, url_prefix='/blog')\n\n" +
          "    return app",
        keyTakeaways: [
          "`Blueprint('name', __name__)` — создать. `app.register_blueprint(bp, url_prefix='/path')` — подключить.",
          "В Blueprint используй `@bp.route` вместо `@app.route`.",
          "В url_for: `url_for('blueprint_name.view_func')` — через точку.",
        ],
        pitfalls: [
          "url_for внутри Blueprint: `url_for('auth.login')`, не `url_for('login')`.",
          "Имя Blueprint ('auth') — уникальное в приложении. Дублирование = AssertionError.",
          "Шаблоны Blueprint по умолчанию ищутся в папке templates/ главного приложения.",
        ],
        analogy:
          "Blueprint — как отдел в компании. У каждого свои задачи (маршруты) и своя документация (шаблоны). Директор (app) знает обо всех отделах и координирует их.",
      },
    ],
    cheatSheet: [
      "`bp = Blueprint('name', __name__)` — создать blueprint.",
      "`@bp.route('/path')` — маршрут в blueprint.",
      "`app.register_blueprint(bp, url_prefix='/prefix')` — подключить к приложению.",
      "`url_for('blueprint_name.view_func')` — ссылка на view внутри blueprint.",
      "Application Factory: `def create_app(): app = Flask(__name__); ...; return app`.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fl6-f1",
      title: "Создание и регистрация Blueprint",
      description:
        "Создай Blueprint для блога и зарегистрируй его в приложении с нужным префиксом.",
      code:
        "from flask import {{0}}, render_template\n\n" +
        "# Создаём Blueprint для раздела блога\n" +
        "blog = {{0}}('blog', __name__)\n\n" +
        "@blog.{{1}}('/posts')\n" +
        "def post_list():\n" +
        "    return render_template('blog/list.html')\n\n" +
        "@blog.{{1}}('/posts/<int:post_id>')\n" +
        "def post_detail(post_id):\n" +
        "    return render_template('blog/detail.html', post_id=post_id)\n\n" +
        "# В app.py:\n" +
        "from flask import Flask\n" +
        "from blog.routes import blog\n" +
        "app = Flask(__name__)\n" +
        "app.{{2}}_blueprint(blog, {{3}}='/blog')",
      answers: [["Blueprint"], ["route"], ["register"], ["url_prefix"]],
      hints: [
        "Класс Flask для создания мини-приложений с собственными маршрутами.",
        "Декоратор для регистрации маршрута в Blueprint (аналог @app.route).",
        "Метод объекта app для подключения Blueprint к приложению.",
        "Ключевой аргумент определяющий общий URL-префикс для всех маршрутов Blueprint.",
      ],
      explanation: {
        summary:
          "Blueprint создаётся один раз, регистрируется в app. url_prefix добавляется ко всем маршрутам BP.",
        keyPoints: [
          "С `url_prefix='/blog'`: @blog.route('/posts') → доступен по /blog/posts.",
          "Имя Blueprint ('blog') используется в url_for: `url_for('blog.post_list')`.",
          "register_blueprint можно вызывать несколько раз с разными prefix — гибкость.",
        ],
      },
    },
    {
      type: "fill",
      id: "fl6-f2",
      title: "url_for внутри Blueprint",
      description:
        "В Blueprint url_for требует указывать имя blueprint через точку. Заполни правильные имена.",
      code:
        "from flask import Blueprint, url_for, redirect\n\n" +
        "auth = Blueprint('auth', __name__)\n\n" +
        "@auth.route('/login')\n" +
        "def login():\n" +
        "    return '<form>...</form>'\n\n" +
        "@auth.route('/logout')\n" +
        "def logout():\n" +
        "    # url_for в blueprint: 'blueprint_name.view_func'\n" +
        "    return redirect(url_for('{{0}}.{{1}}'))\n\n" +
        "@auth.route('/profile')\n" +
        "def profile():\n" +
        "    # Ссылка на view из ДРУГОГО blueprint (main)\n" +
        "    return redirect(url_for('{{2}}.index'))",
      answers: [["auth"], ["login"], ["main"]],
      hints: [
        "Имя blueprint авторизации (первый аргумент Blueprint('...')).",
        "Имя view-функции для страницы входа внутри blueprint.",
        "Имя другого blueprint (для главной страницы).",
      ],
      explanation: {
        summary:
          "url_for внутри blueprint: 'blueprint_name.view_func'. Имя blueprint — первый аргумент при создании.",
        keyPoints: [
          "url_for('auth.login') → ищет функцию login() в blueprint с именем 'auth'.",
          "Без указания blueprint → url_for('login') — ищет в ТЕКУЩЕМ blueprint.",
          "Для ссылки на другой blueprint явно указывай его имя: url_for('main.index').",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "fl6-q1",
      title: "Зачем Blueprints",
      question:
        "Ты создаёшь большое Flask-приложение с авторизацией, блогом и API. Зачем использовать Blueprints вместо одного app.py?",
      answers: [
        "разделить код на модули с независимыми маршрутами для лучшей организации и масштабируемости",
        "blueprints позволяют разбить приложение на независимые части с отдельными маршрутами и шаблонами",
        "для модульности — каждая функциональная часть в своём blueprint с своими маршрутами",
        "модульность", "разделение кода на части", "организация кода",
        "разбить на модули", "blueprints для разделения функциональности",
        "каждый раздел в своём файле", "better code organization",
        "отдельные файлы для auth blog api", "модульная архитектура",
      ],
      hint: "Подумай о сотнях маршрутов в одном файле.",
      explanation:
        "Blueprints решают проблему масштабируемости:\n" +
        "1. Организация кода по функциональности (auth, blog, admin)\n" +
        "2. Повторное использование — Blueprint можно подключить к разным приложениям\n" +
        "3. Тестируемость — каждый Blueprint тестируется независимо\n" +
        "4. Команды — разные разработчики работают в разных Blueprint без конфликтов",
    },
    {
      type: "question",
      id: "fl6-q2",
      title: "Application Factory",
      question:
        "Что такое паттерн Application Factory (create_app()) и почему он лучше глобального `app = Flask(__name__)`?",
      answers: [
        "функция создающая и настраивающая приложение — позволяет создавать разные экземпляры для разных конфигураций и тестирования",
        "create_app() создаёт новый экземпляр Flask — это позволяет передавать разные настройки для prod и test",
        "фабричная функция позволяет создать несколько экземпляров приложения с разными конфигурациями",
        "factory для создания разных конфигураций",
        "create_app позволяет передавать конфигурацию",
        "фабричный паттерн для разных настроек prod test",
        "функция которая создаёт приложение с нужными настройками",
        "позволяет тестировать с разными конфигурациями",
        "application factory pattern for flexible configuration",
        "creates app instances with different configs for test and prod",
      ],
      hint: "Как протестировать приложение с тестовой базой данных?",
      explanation:
        "Application Factory — функция `create_app(config)`, которая создаёт и возвращает Flask-приложение.\n\n" +
        "Преимущества:\n" +
        "1. Тесты создают отдельный экземпляр с тестовой конфигурацией\n" +
        "2. Разные конфигурации для dev/staging/prod\n" +
        "3. Нет глобального `app` — легче избежать circular imports",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fl6-w1",
      title: "Приложение с двумя Blueprint",
      task:
        "Создай Flask-приложение, разделённое на два Blueprint: main и auth.\n\n" +
        "━━━ Шаг 1: Создай Blueprint 'main' ━━━\n" +
        "from flask import Blueprint, render_template\n" +
        "main = Blueprint('main', __name__)\n\n" +
        "@main.route('/')\n" +
        "def index():\n" +
        "    return '<h1>Главная</h1>'\n\n" +
        "━━━ Шаг 2: Создай Blueprint 'auth' ━━━\n" +
        "auth = Blueprint('auth', __name__)\n\n" +
        "@auth.route('/login')\n" +
        "def login():\n" +
        "    return '<h1>Вход</h1>'\n\n" +
        "@auth.route('/logout')\n" +
        "def logout():\n" +
        "    from flask import redirect, url_for\n" +
        "    return redirect(url_for('main.index'))  # ссылка на другой blueprint!\n\n" +
        "━━━ Шаг 3: Создай главный app.py ━━━\n" +
        "from flask import Flask\n" +
        "app = Flask(__name__)\n" +
        "app.secret_key = 'dev'\n\n" +
        "# Зарегистрируй оба Blueprint:\n" +
        "app.register_blueprint(main)                   # без префикса\n" +
        "app.register_blueprint(auth, url_prefix='/auth') # /auth/login, /auth/logout\n\n" +
        "if __name__ == '__main__':\n" +
        "    app.run(debug=True)\n\n" +
        "ВАЖНО: В url_for внутри blueprint всегда пиши 'blueprint_name.view_func'.",
      hints: [
        "main = Blueprint('main', __name__) — первый аргумент это имя для url_for",
        "app.register_blueprint(auth, url_prefix='/auth') — все маршруты auth получат /auth/ prefix",
        "url_for('main.index') — из auth blueprint ссылаемся на main blueprint",
      ],
      required: [
        "Blueprint(",
        "register_blueprint",
        "url_prefix",
        "@main.route",
        "@auth.route",
        "url_for(",
      ],
      minLines: 24,
      explanation: {
        summary:
          "Два Blueprint + register_blueprint = модульное приложение. url_for('bp.func') — ссылки между модулями.",
        keyPoints: [
          "Blueprint создаётся до регистрации. Регистрация — в основном app.py.",
          "url_prefix='/auth' добавляет /auth к КАЖДОМУ маршруту auth-blueprint.",
          "url_for всегда через 'blueprint_name.function_name'. Без имени blueprint — ищет в текущем контексте.",
        ],
        realWorld:
          "Большие Flask-проекты (Airflow, Superset) разбиты на десятки Blueprint. Application Factory — стандарт для тестируемых приложений.",
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Round 7 · REST API — JSON-ответы и авторизация токеном
// ─────────────────────────────────────────────────────────────────────────────
const fl7: Round = {
  number: 7,
  title: "Flask · REST API — JSON и HTTP-методы",
  level: "Сложный",
  intro:
    "REST API — стандарт взаимодействия фронтенд↔бекенд и бекенд↔бекенд. Flask идеален для создания API: минимум кода, полный контроль над HTTP.\n\n" +
    "**Что ты изучишь:**\n" +
    "• jsonify() — как вернуть JSON из Flask\n" +
    "• request.json — как принять JSON от клиента\n" +
    "• HTTP-методы для CRUD: GET (read), POST (create), PUT/PATCH (update), DELETE (delete)\n" +
    "• Коды статусов HTTP: 200, 201, 400, 401, 404\n" +
    "• CORS — почему фронтенд не может обратиться к API без настройки\n\n" +
    "**Что ждёт в упражнениях:** API-маршруты с jsonify, коды статусов, задание написать полный CRUD-API.",
  lesson: {
    title: "Flask REST API: jsonify, HTTP-методы, статус-коды и CORS",
    summary:
      "jsonify() для JSON-ответов; request.json для входящего JSON; HTTP CRUD: GET/POST/PUT/DELETE; статус-коды 200/201/400/404/422; CORS настройка через flask-cors.",
    readingMinutes: 12,
    sections: [
      {
        heading: "Что такое REST API и как Flask его строит",
        tagline: "REST = ресурсы + HTTP-методы + JSON. Flask даёт полный контроль над каждым.",
        body:
          "**REST (Representational State Transfer)** — архитектурный стиль API:\n" +
          "- Каждый ресурс имеет URL: `/api/users`, `/api/posts/42`\n" +
          "- HTTP-метод определяет действие:\n\n" +
          "| Метод  | Действие  | Пример                         |\n" +
          "| GET    | Прочитать | GET /api/users → список всех   |\n" +
          "| POST   | Создать   | POST /api/users → новый юзер   |\n" +
          "| PUT    | Заменить  | PUT /api/users/1 → заменить    |\n" +
          "| PATCH  | Изменить  | PATCH /api/users/1 → изменить  |\n" +
          "| DELETE | Удалить   | DELETE /api/users/1 → удалить  |\n\n" +
          "**jsonify() — главная функция Flask для API:**\n" +
          "- Принимает Python-объект (dict, list)\n" +
          "- Сериализует в JSON\n" +
          "- Устанавливает заголовок `Content-Type: application/json`\n" +
          "- Возвращает Response объект\n\n" +
          "**request.json — принять JSON:**\n" +
          "- Клиент отправляет `Content-Type: application/json`\n" +
          "- Flask десериализует тело запроса\n" +
          "- `request.json` — словарь Python\n" +
          "- Если тело не JSON — `request.json` будет `None`\n\n" +
          "**Важные HTTP-статусы:**\n" +
          "- `200 OK` — успешный запрос\n" +
          "- `201 Created` — ресурс создан (после POST)\n" +
          "- `204 No Content` — успех, но нет тела (после DELETE)\n" +
          "- `400 Bad Request` — неверные данные от клиента\n" +
          "- `401 Unauthorized` — нет авторизации\n" +
          "- `403 Forbidden` — нет прав\n" +
          "- `404 Not Found` — ресурс не найден\n" +
          "- `422 Unprocessable Entity` — данные получены, но невалидны",
        code:
          "from flask import Flask, jsonify, request, abort\n\n" +
          "app = Flask(__name__)\n\n" +
          "# Простая 'база данных' в памяти\n" +
          "users = [\n" +
          "    {'id': 1, 'name': 'Аня', 'email': 'anya@example.com'},\n" +
          "    {'id': 2, 'name': 'Иван', 'email': 'ivan@example.com'},\n" +
          "]\n\n" +
          "# GET /api/users — список всех\n" +
          "@app.route('/api/users', methods=['GET'])\n" +
          "def get_users():\n" +
          "    return jsonify(users), 200  # 200 OK\n\n" +
          "# GET /api/users/1 — один пользователь\n" +
          "@app.route('/api/users/<int:user_id>', methods=['GET'])\n" +
          "def get_user(user_id):\n" +
          "    user = next((u for u in users if u['id'] == user_id), None)\n" +
          "    if not user:\n" +
          "        return jsonify({'error': 'Пользователь не найден'}), 404\n" +
          "    return jsonify(user), 200\n\n" +
          "# POST /api/users — создать\n" +
          "@app.route('/api/users', methods=['POST'])\n" +
          "def create_user():\n" +
          "    data = request.json\n" +
          "    if not data or not data.get('name') or not data.get('email'):\n" +
          "        return jsonify({'error': 'name и email обязательны'}), 400\n" +
          "    new_user = {'id': len(users) + 1, 'name': data['name'], 'email': data['email']}\n" +
          "    users.append(new_user)\n" +
          "    return jsonify(new_user), 201  # 201 Created!\n\n" +
          "# DELETE /api/users/1 — удалить\n" +
          "@app.route('/api/users/<int:user_id>', methods=['DELETE'])\n" +
          "def delete_user(user_id):\n" +
          "    global users\n" +
          "    user = next((u for u in users if u['id'] == user_id), None)\n" +
          "    if not user:\n" +
          "        return jsonify({'error': 'Не найден'}), 404\n" +
          "    users = [u for u in users if u['id'] != user_id]\n" +
          "    return '', 204  # 204 No Content\n\n" +
          "if __name__ == '__main__':\n" +
          "    app.run(debug=True)",
        keyTakeaways: [
          "`jsonify(data)` — вернуть JSON с правильным Content-Type.",
          "`request.json` — получить JSON-тело запроса (None если не JSON).",
          "Статусы: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found.",
        ],
        pitfalls: [
          "`request.json` — None если клиент не отправил `Content-Type: application/json`.",
          "Возвращай `201` для POST (создание), а не `200`. Это стандарт REST.",
          "CORS: фронтенд на другом домене не может вызвать API без `Access-Control-Allow-Origin`.",
        ],
      },
    ],
    cheatSheet: [
      "`from flask import jsonify` → `return jsonify({'key': val}), 200`.",
      "`data = request.json` — прочитать JSON-тело запроса.",
      "Статусы: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found.",
      "`abort(404)` — быстро вернуть ошибочный статус из любого места.",
      "`pip install flask-cors; CORS(app)` — разрешить CORS для всех origins.",
      "GET — read, POST — create, PUT/PATCH — update, DELETE — delete.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "fl7-f1",
      title: "GET и POST маршруты API",
      description:
        "Заверши API: GET возвращает список, POST принимает JSON и возвращает созданный объект.",
      code:
        "from flask import Flask, {{0}}, request\n\n" +
        "app = Flask(__name__)\n" +
        "items = [{'id': 1, 'name': 'Python'}]\n\n" +
        "@app.route('/api/items', methods=['GET'])\n" +
        "def get_items():\n" +
        "    return {{0}}(items), {{1}}\n\n" +
        "@app.route('/api/items', methods=['POST'])\n" +
        "def create_item():\n" +
        "    data = request.{{2}}\n" +
        "    if not data or 'name' not in data:\n" +
        "        return {{0}}({'error': 'name required'}), 400\n" +
        "    new_item = {'id': len(items)+1, 'name': data['name']}\n" +
        "    items.append(new_item)\n" +
        "    return {{0}}(new_item), {{3}}",
      answers: [["jsonify"], ["200"], ["json"], ["201"]],
      hints: [
        "Функция Flask для сериализации Python-объекта в JSON-ответ.",
        "HTTP-статус для успешного получения данных.",
        "Атрибут request для чтения JSON-тела запроса (словарь Python).",
        "HTTP-статус обозначающий что ресурс был успешно СОЗДАН.",
      ],
      explanation: {
        summary:
          "jsonify() + правильные статус-коды — основа Flask REST API. 200 для GET, 201 для POST.",
        keyPoints: [
          "jsonify() автоматически устанавливает Content-Type: application/json.",
          "request.json — None если клиент не отправил JSON. Всегда проверяй.",
          "201 Created — стандарт для POST, означает 'ресурс создан'. Не 200.",
        ],
      },
    },
    {
      type: "fill",
      id: "fl7-f2",
      title: "PUT и DELETE маршруты",
      description:
        "Заверши API-маршруты для обновления и удаления ресурса с правильными статус-кодами.",
      code:
        "from flask import Flask, jsonify, request\n\n" +
        "app = Flask(__name__)\n" +
        "items = [{'id': 1, 'name': 'Flask', 'done': False}]\n\n" +
        "@app.route('/api/items/<int:item_id>', methods=['{{0}}'])\n" +
        "def update_item(item_id):\n" +
        "    item = next((i for i in items if i['id'] == item_id), None)\n" +
        "    if not item:\n" +
        "        return jsonify({'error': 'Not found'}), {{1}}\n" +
        "    data = request.json or {}\n" +
        "    item.update(data)\n" +
        "    return jsonify(item), {{2}}\n\n" +
        "@app.route('/api/items/<int:item_id>', methods=['{{3}}'])\n" +
        "def delete_item(item_id):\n" +
        "    global items\n" +
        "    items = [i for i in items if i['id'] != item_id]\n" +
        "    return '', {{4}}",
      answers: [["PUT"], ["404"], ["200"], ["DELETE"], ["204"]],
      hints: [
        "HTTP-метод для полной замены ресурса (обновление).",
        "HTTP-статус если запрошенный ресурс не найден.",
        "HTTP-статус для успешного ответа с телом.",
        "HTTP-метод для удаления ресурса.",
        "HTTP-статус для успешного ответа БЕЗ тела (после удаления).",
      ],
      explanation: {
        summary:
          "HTTP методы: PUT для замены, DELETE для удаления. Статусы: 404 если не найдено, 204 после DELETE.",
        keyPoints: [
          "PUT заменяет весь ресурс, PATCH — только указанные поля. Чаще используют PUT для простоты.",
          "204 No Content — тело ответа пустое. `return '', 204` — стандарт для DELETE.",
          "Всегда возвращай 404 если ресурс не найден — не 200 с {error: ...}.",
        ],
      },
    },
    {
      type: "fill",
      id: "fl7-f3",
      title: "abort() и обработчики ошибок",
      description:
        "Используй abort() для быстрых ошибок и зарегистрируй JSON-обработчики ошибок.",
      code:
        "from flask import Flask, jsonify, {{0}}\n\n" +
        "app = Flask(__name__)\n\n" +
        "# Обработчик ошибки 404 — вместо HTML возвращает JSON\n" +
        "@app.{{1}}handler({{2}})\n" +
        "def not_found(e):\n" +
        "    return jsonify({'error': 'Not Found', 'code': 404}), 404\n\n" +
        "@app.{{1}}handler(400)\n" +
        "def bad_request(e):\n" +
        "    return jsonify({'error': 'Bad Request', 'code': 400}), 400\n\n" +
        "@app.route('/api/item/<int:item_id>')\n" +
        "def get_item(item_id):\n" +
        "    if item_id > 100:\n" +
        "        {{0}}({{2}})  # быстро вернуть 404\n" +
        "    return jsonify({'id': item_id})",
      answers: [["abort"], ["error"], ["404"]],
      hints: [
        "Функция Flask для немедленного возврата HTTP-ошибки из любой точки кода.",
        "Начало декоратора для регистрации обработчика ошибки: @app.___handler(code).",
        "HTTP-статус-код для 'ресурс не найден'.",
      ],
      explanation: {
        summary:
          "abort(404) — немедленно прерывает выполнение и возвращает ошибку. errorhandler заменяет HTML-страницу ошибки на JSON.",
        keyPoints: [
          "abort(404) эквивалентен raise NotFound() — прерывает функцию и вызывает errorhandler.",
          "@app.errorhandler(404) — перехватывает все 404 ошибки приложения.",
          "Для API всегда регистрируй JSON-обработчики ошибок — иначе клиент получит HTML.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "fl7-q1",
      title: "Какой статус при создании",
      question:
        "API-endpoint `POST /api/users` успешно создал нового пользователя. Какой HTTP-статус нужно вернуть?",
      answers: [
        "201",
        "201 created",
        "создано",
        "ресурс создан",
        "201 создан",
        "201 созданный",
        "201 — created",
        "http 201",
        "статус 201",
        "201 новый ресурс создан",
        "created 201",
      ],
      hint: "Это не стандартный 200 OK — есть более конкретный статус для создания ресурса.",
      explanation:
        "**201 Created** — стандартный HTTP-статус для успешного создания ресурса через POST.\n\n" +
        "200 OK тоже допустим, но 201 семантически точнее: явно сигнализирует что был создан новый ресурс.\n\n" +
        "По REST-соглашению также добавляют заголовок `Location: /api/users/42` с URL нового ресурса.",
    },
    {
      type: "question",
      id: "fl7-q2",
      title: "request.json vs request.form",
      question:
        "Фронтенд отправляет данные с `Content-Type: application/json`. Где Flask хранит эти данные?",
      answers: [
        "в request.json",
        "request.json — десериализованный Python-объект из JSON-тела",
        "request.json",
        "json",
        "request json",
        "в теле json запроса",
        "тело json",
        "json тело запроса",
        "request.json или request.get_json()",
        "request.get_json",
        "request get_json",
        "в request.json или request.get_json()",
      ],
      hint: "Не request.form (это для HTML-форм) и не request.args (это для URL-параметров).",
      explanation:
        "`request.json` — автоматически десериализованное JSON-тело запроса (Python dict/list).\n\n" +
        "Требует `Content-Type: application/json` от клиента. Если заголовок другой — `request.json` будет `None`.\n\n" +
        "Альтернатива: `request.get_json(force=True)` — парсит JSON независимо от Content-Type.",
    },
    {
      type: "question",
      id: "fl7-q3",
      title: "Что такое CORS",
      question:
        "Твой React-фронтенд на localhost:3000 не может сделать запрос к Flask API на localhost:5000. Почему и как это исправить?",
      answers: [
        "это CORS ограничение браузера — нужно добавить заголовки Access-Control-Allow-Origin через flask-cors",
        "браузер блокирует cross-origin запросы — установить flask-cors и вызвать CORS(app)",
        "CORS policy блокирует запрос — pip install flask-cors затем from flask_cors import CORS; CORS(app)",
        "cors ошибка — добавить cors заголовки",
        "cross origin resource sharing — нужен flask-cors",
        "CORS — разные порты это cross-origin, нужен flask-cors",
        "браузер блокирует запросы между портами — cors",
        "cors блокирует запросы с другого происхождения",
        "cors error — different port means cross origin — need flask-cors",
        "CORS protection blocks cross-origin requests — add Access-Control-Allow-Origin header",
        "добавить Access-Control-Allow-Origin через flask-cors",
      ],
      hint: "Cross-Origin Resource Sharing — политика браузера для запросов на другой домен/порт.",
      explanation:
        "CORS (Cross-Origin Resource Sharing) — политика браузера запрещающая JS-запросы к другому origin (домен/порт/протокол).\n\n" +
        "Исправление:\n" +
        "```bash\n" +
        "pip install flask-cors\n" +
        "```\n\n" +
        "```python\n" +
        "from flask_cors import CORS\n" +
        "CORS(app)  # или CORS(app, origins=['http://localhost:3000'])\n" +
        "```\n\n" +
        "Flask добавит заголовок `Access-Control-Allow-Origin: *` и браузер пропустит запрос.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "fl7-w1",
      title: "Полный CRUD REST API",
      task:
        "Создай REST API для управления задачами (Todo). Полный CRUD через HTTP-методы.\n\n" +
        "━━━ Шаг 1: Настройка ━━━\n" +
        "from flask import Flask, jsonify, request, abort\n\n" +
        "app = Flask(__name__)\n" +
        "todos = []   # простое хранилище в памяти\n" +
        "next_id = 1  # счётчик для id\n\n" +
        "━━━ Шаг 2: GET /api/todos — все задачи ━━━\n" +
        "@app.route('/api/todos', methods=['GET'])\n" +
        "def get_todos():\n" +
        "    return jsonify(todos), 200\n\n" +
        "━━━ Шаг 3: POST /api/todos — создать задачу ━━━\n" +
        "@app.route('/api/todos', methods=['POST'])\n" +
        "def create_todo():\n" +
        "    global next_id\n" +
        "    data = request.json\n" +
        "    if not data or not data.get('title'):  # валидация!\n" +
        "        return jsonify({'error': 'title required'}), 400\n" +
        "    todo = {'id': next_id, 'title': data['title'], 'done': False}\n" +
        "    todos.append(todo)\n" +
        "    next_id += 1\n" +
        "    return jsonify(todo), 201  # 201 Created!\n\n" +
        "━━━ Шаг 4: GET /api/todos/<id> — одна задача ━━━\n" +
        "@app.route('/api/todos/<int:todo_id>', methods=['GET'])\n" +
        "def get_todo(todo_id):\n" +
        "    todo = next((t for t in todos if t['id'] == todo_id), None)\n" +
        "    if not todo:\n" +
        "        abort(404)  # или return jsonify({'error': '...'}), 404\n" +
        "    return jsonify(todo), 200\n\n" +
        "━━━ Шаг 5: PUT /api/todos/<id> — обновить ━━━\n" +
        "Реализуй сам по образцу шага 4 + изменяй данные.\n\n" +
        "━━━ Шаг 6: DELETE /api/todos/<id> — удалить ━━━\n" +
        "Реализуй сам. Статус ответа: 204 (No Content), тело пустое.\n\n" +
        "ПРОВЕРЬ: в коде есть jsonify, request.json, 201, 204, abort или 404.",
      hints: [
        "GET: return jsonify(todos), 200  — вернуть весь список",
        "POST: data = request.json, проверка data.get('title'), создание словаря, return jsonify(todo), 201",
        "DELETE: return '', 204 — пустое тело с кодом 204 No Content",
      ],
      required: [
        "jsonify(",
        "request.json",
        "methods=['GET']",
        "methods=['POST']",
        "201",
        "404",
      ],
      minLines: 28,
      explanation: {
        summary:
          "REST API: каждый ресурс — URL, HTTP-метод определяет действие, JSON — формат данных.",
        keyPoints: [
          "Правильные статус-коды семантически важны: 201 для создания, 204 для удаления, 404 для not found.",
          "request.json может быть None — всегда проверяй перед использованием.",
          "abort(404) прерывает выполнение функции — как raise в Python.",
        ],
        realWorld:
          "Реальные Flask API используют marshmallow или pydantic для валидации схем. Flask-JWT-Extended для JWT-авторизации. Flask-RESTX или Flask-Smorest для автоматической документации (OpenAPI/Swagger).",
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────
export const flaskRounds: Round[] = [fl1, fl2, fl3, fl4, fl5, fl6, fl7];
export const FLASK_ROUNDS = flaskRounds;
export const FLASK_TOTAL_ROUNDS = flaskRounds.length;
