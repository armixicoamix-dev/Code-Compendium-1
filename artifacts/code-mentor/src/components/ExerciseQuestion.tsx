import { useState } from "react";
import { QuestionExercise } from "@/data/curriculum";
import { PyCode } from "@/components/PyCode";
import { HintBox } from "@/components/HintBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, ArrowRight, FileQuestion } from "lucide-react";
import { renderInline } from "@/lib/richText";

// ── Flexible answer normalisation ─────────────────────────────────────────
function normalize(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/\(\)/g, "")
    .replace(/[.,;:!?'"«»„"]/g, "")
    .replace(/[-—–]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSet(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .split(/\s*[,;/|]\s*/)
    .map((t) => {
      const trimmed = t.trim();
      if (trimmed === "''" || trimmed === '""') return "__empty_str__";
      return normalize(trimmed);
    })
    .filter(Boolean)
    .sort()
    .join("|");
}

// ── Levenshtein distance for fuzzy matching ────────────────────────────────
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const dp: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    let prev = i + 1;
    for (let j = 0; j < b.length; j++) {
      const val = a[i] === b[j] ? dp[j] : Math.min(dp[j], dp[j + 1], prev) + 1;
      dp[j] = prev;
      prev = val;
    }
    dp[b.length] = prev;
  }
  return dp[b.length];
}

function fuzzyMatch(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return true;
  const maxLen = Math.max(na.length, nb.length);
  if (maxLen <= 4) return levenshtein(na, nb) <= 1;
  if (maxLen <= 8) return levenshtein(na, nb) <= 2;
  if (maxLen <= 15) return levenshtein(na, nb) <= 3;
  return false;
}

// ── Synonym map (RU + EN + abbreviations + casual) ─────────────────────────
const SYNONYMS: Record<string, string[]> = {
  // ── Python base types ──
  str: ["строка", "string", "str", "тип str", "тип строка", "текст", "символы", "символьный тип", "стринг", "строчка"],
  int: ["целое", "целое число", "integer", "int", "тип int", "число", "числовой тип", "число инт", "интежер"],
  float: ["дробное", "дробное число", "вещественное", "float", "тип float", "число с точкой", "число с плавающей точкой", "флоат", "вещественное число"],
  bool: ["булево", "булев", "boolean", "bool", "тип bool", "логическое", "логический тип", "булевый", "буль", "логическое значение"],
  none: ["none", "ничего", "отсутствие значения", "null", "нет значения", "пустое значение", "нонэ", "пусто", "отсутствует"],
  list: ["список", "list", "тип list", "массив", "лист", "перечень", "листик"],
  dict: ["словарь", "dict", "dictionary", "тип dict", "хэш-таблица", "хеш", "дикт", "словарик", "маппинг"],
  tuple: ["кортеж", "tuple", "тип tuple", "туп", "неизменяемый список", "неизменяемая последовательность"],
  set: ["множество", "set", "тип set", "сет", "уникальные элементы"],
  true: ["true", "истина", "да", "правда", "трю"],
  false: ["false", "ложь", "нет", "неправда", "фолс"],

  // ── OOP concepts ──
  class: ["класс", "class", "шаблон", "чертёж", "blueprint", "клас", "тип объекта", "описание объекта"],
  object: ["объект", "object", "экземпляр", "instance", "инстанс", "обьект", "конкретный объект", "экземпляр класса"],
  inheritance: ["наследование", "inheritance", "наследуется", "наследование классов", "дочерний класс", "родительский класс", "расширение класса"],
  polymorphism: ["полиморфизм", "polymorphism", "полиморф", "единый интерфейс", "разное поведение"],
  encapsulation: ["инкапсуляция", "encapsulation", "инкапс", "скрытие данных", "приватные атрибуты", "private"],
  abstraction: ["абстракция", "abstraction", "абстрактный класс", "abc", "абстрактный метод", "abstractmethod"],
  method: ["метод", "method", "функция класса", "функция объекта", "функция в классе"],
  attribute: ["атрибут", "attribute", "свойство", "поле", "аттрибут", "переменная экземпляра", "переменная класса"],
  constructor: ["конструктор", "constructor", "__init__", "инициализатор", "init", "конструктр", "метод инициализации"],
  self: ["self", "ссылка на объект", "текущий объект", "self объект", "ссылка на экземпляр", "сам объект"],
  super: ["super", "родительский класс", "суперкласс", "базовый класс", "super()", "вызов родителя"],
  decorator: ["декоратор", "decorator", "обёртка", "обертка", "деко", "@", "функция-обёртка"],
  property: ["свойство", "property", "@property", "проперти", "проп", "геттер", "сеттер"],
  generator: ["генератор", "generator", "yield", "генераторная функция", "ленивые вычисления", "lazy"],
  iterator: ["итератор", "iterator", "iter", "итератор объект", "__iter__", "__next__"],
  metaclass: ["метакласс", "metaclass", "тип типов", "type", "класс классов"],
  mixin: ["миксин", "mixin", "примесь", "множественное наследование", "примесь функциональности"],

  // ── Flask core ──
  route: ["маршрут", "route", "путь", "endpoint", "эндпоинт", "адрес", "url маршрут", "урл маршрут", "роут", "рут",
    "связывает url", "привязка url", "@app.route", "декоратор маршрута", "url-правило", "правило url"],
  template: ["шаблон", "template", "html файл", "html шаблон", "jinja шаблон", "темплейт", "темплет", "html-шаблон",
    "шаблонный файл", "html-файл"],
  render: ["рендер", "render", "отрисовка", "рендеринг", "render_template", "рендер шаблона", "рендерить",
    "возврат шаблона", "вернуть html", "генерация html"],
  redirect: ["редирект", "redirect", "перенаправление", "перенаправить", "редиректить",
    "перекинуть на другой url", "перейти на", "302"],
  request: ["запрос", "request", "http запрос", "объект запроса", "реквест", "входящий запрос", "request объект"],
  response: ["ответ", "response", "http ответ", "объект ответа", "респонс", "ответ сервера", "response объект"],
  get: ["get", "гет", "http get", "метод get", "get запрос", "гет запрос", "получить данные", "чтение данных"],
  post: ["post", "пост", "http post", "метод post", "post запрос", "пост запрос", "отправка данных", "создать ресурс"],
  put: ["put", "пут", "http put", "метод put", "put запрос", "обновить ресурс", "полное обновление"],
  delete: ["delete", "делит", "http delete", "метод delete", "delete запрос", "удалить ресурс", "удаление"],
  patch: ["patch", "патч", "http patch", "метод patch", "частичное обновление", "частичное изменение"],
  json: ["json", "джейсон", "json данные", "json ответ", "формат json", "джсон", "джейсончик", "data json"],
  session: ["сессия", "session", "сессионные данные", "пользовательская сессия", "сешн", "данные сессии", "хранение между запросами"],
  cookie: ["куки", "cookie", "cookies", "кука", "http cookie", "браузерное хранилище"],
  blueprint: ["блюпринт", "blueprint", "модуль маршрутов", "модуль flask", "чертёж flask", "блупринт",
    "организация маршрутов", "blueprint flask", "разбивка на модули"],
  middleware: ["middleware", "промежуточный слой", "мидлвар", "мидлвэр", "промежуточное по",
    "слой между запросом и ответом", "перехват запроса"],
  orm: ["orm", "object relational mapping", "объектно реляционное отображение", "flask sqlalchemy", "орм",
    "работа с бд через классы", "объектный доступ к бд"],
  flash: ["flash", "флеш", "флэш", "flash сообщение", "flash message", "всплывающее сообщение", "уведомление",
    "одноразовое сообщение", "get_flashed_messages"],
  url_for: ["url_for", "url for", "генерация url", "url generation", "построение url", "урл фор", "функция url_for",
    "динамический url", "url по имени функции", "reverse routing"],
  render_template: ["render_template", "render template", "рендер шаблона", "отрисовка шаблона", "вернуть шаблон", "рендер темплейт",
    "отдать html", "вернуть html страницу"],
  jinja2: ["jinja2", "jinja", "шаблонизатор", "template engine", "движок шаблонов", "джинджа", "шаблонный движок",
    "{{ }}", "{% %}", "темплейт движок", "джинджа2"],
  sqlalchemy: ["sqlalchemy", "flask sqlalchemy", "flask-sqlalchemy", "база данных orm", "скл алхимия", "алхимия",
    "flask_sqlalchemy", "работа с базой данных", "orm flask", "бд flask"],
  abort: ["abort", "прервать запрос", "http исключение", "исключение http", "абортировать", "abort()", "прерывание",
    "вернуть ошибку", "ошибка http"],
  jsonify: ["jsonify", "json ответ", "json response", "вернуть json", "джсонифай", "сериализовать в json",
    "ответ в формате json", "flask json", "application/json"],
  secret_key: ["secret_key", "secret key", "секретный ключ", "ключ шифрования", "ключ сессии", "секрет ключ",
    "app.secret_key", "ключ подписи", "ключ безопасности", "шифрование сессии"],
  cors: ["cors", "cross origin", "cross-origin", "кросс доменный запрос", "flask cors", "flask-cors", "корс",
    "cross origin resource sharing", "межсайтовые запросы"],
  prg: ["prg", "post redirect get", "паттерн prg", "redirect после post", "редирект после пост", "пост редирект гет",
    "избежать повторной отправки формы", "предотвратить дубликат формы"],
  filter_by: ["filter_by", "filter by", "фильтрация по", "запрос по полю", "фильтр", "отбор по условию", ".filter_by("],
  app_context: ["app_context", "app context", "application context", "контекст приложения", "апп контекст",
    "with app.app_context()", "контекст flask приложения"],
  request_form: ["request.form", "request form", "данные формы", "form данные", "тело формы",
    "данные из формы", "данные html формы", "post данные формы"],
  request_json: ["request.json", "request json", "json тело", "json body", "данные json", "json запрос",
    "тело запроса json", "get_json"],
  request_args: ["request.args", "request args", "query параметры", "параметры url", "строка запроса", "query string",
    "параметры из url", "get параметры", "параметры запроса", "query params"],
  app_factory: ["фабрика приложений", "app factory", "create_app", "паттерн фабрика", "application factory",
    "функция создания приложения", "create app функция", "фабричный метод flask"],

  // ── Flask extended ──
  werkzeug: ["werkzeug", "веркзойг", "встроенный сервер", "development server", "devserver", "отладочный сервер",
    "встроенный сервер flask", "локальный сервер", "flask сервер"],
  hot_reload: ["горячая перезагрузка", "hot reload", "auto reload", "авто перезагрузка", "авто-перезагрузка",
    "автоматический перезапуск", "live reload", "автоперезагрузка", "перезапуск при изменении",
    "перезагрузка при изменениях", "обновление без перезапуска", "автоматическое обновление"],
  debug_console: ["дебаггер", "debugger", "интерактивный отладчик", "interactive debugger", "отладчик в браузере",
    "пин отладчика", "werkzeug debugger", "консоль ошибок", "интерактивная консоль"],
  traceback: ["трейсбек", "traceback", "стек вызовов", "stack trace", "стектрейс", "стек ошибки",
    "сообщение об ошибке", "вывод ошибки", "trace"],
  debug_mode: ["debug mode", "режим отладки", "debug=true", "дебаг режим", "режим разработки", "debug=True",
    "режим debug", "режим разработчика", "дебаг", "dev mode", "development mode",
    "перезагрузка и ошибки", "ошибки и перезагрузка"],
  relationship: ["relationship", "связь", "связь между таблицами", "отношение таблиц", "foreign key relationship",
    "db.relationship", "связанные записи", "один ко многим", "many to one", "join"],
  foreignkey: ["foreignkey", "foreign key", "внешний ключ", "db.ForeignKey", "ссылка на таблицу",
    "ключ связи", "fk", "внешний ключ бд"],
  db_commit: ["db.session.commit", "commit", "коммит", "сохранить в бд", "применить изменения",
    "зафиксировать транзакцию", "commit()"],
  db_session: ["db.session", "сессия бд", "сессия базы данных", "orm сессия", "транзакция"],
  db_model: ["db.Model", "модель бд", "модель базы данных", "database model", "flask sqlalchemy model",
    "orm модель", "класс модели", "таблица как класс"],
  login_required: ["login_required", "требует авторизации", "защищённый маршрут", "только для авторизованных",
    "проверка входа", "декоратор авторизации", "требует входа", "@login_required"],
  test_client: ["test client", "тест клиент", "flask test client", "app.test_client()",
    "клиент для тестирования", "тестовый клиент"],
  config_object: ["app.config", "конфигурация приложения", "config объект", "flask config",
    "настройки flask", "конфиг приложения", "app config dict", "словарь конфигурации"],
  wtforms: ["wtforms", "flask-wtf", "flask wtf", "вт формс", "wtf формы", "библиотека форм",
    "web формы", "форм класс", "form class", "FlaskForm"],
  send_file: ["send_file", "отправить файл", "вернуть файл", "файловый ответ", "скачать файл",
    "send_from_directory", "отдать файл"],
  make_response: ["make_response", "создать ответ", "объект ответа", "Response()", "кастомный ответ",
    "ручной ответ"],
  request_method: ["request.method", "метод запроса", "http метод", "тип запроса",
    "определить тип запроса", "get или post"],
  variable_rule: ["переменная в маршруте", "variable rule", "<variable>", "динамический маршрут",
    "параметр url", "параметр маршрута", "<int:id>", "url параметр"],
  g_object: ["g", "flask g", "g объект", "global g", "контекстная переменная g", "flask.g",
    "глобальный контекст запроса", "g переменная"],
  current_app: ["current_app", "текущее приложение", "current app", "app proxy", "application proxy",
    "прокси приложения", "ссылка на приложение"],
  push_context: ["with app.app_context", "app_context push", "контекст приложения", "push context",
    "активировать контекст"],

  // ── Design patterns ──
  singleton: ["синглтон", "singleton", "одиночка", "один экземпляр", "паттерн одиночка", "единственный экземпляр"],
  observer: ["наблюдатель", "observer", "подписчик", "паттерн наблюдатель", "событийная система"],
  factory: ["фабрика", "factory", "фабричный метод", "паттерн фабрика", "создание объектов"],
  strategy: ["стратегия", "strategy", "паттерн стратегия", "взаимозаменяемые алгоритмы"],
  decorator_pattern: ["паттерн декоратор", "decorator pattern", "структурный паттерн", "обёртка функциональности"],
  composition: ["композиция", "composition", "составной объект", "has-a отношение"],

  // ── Python features ──
  comprehension: ["comprehension", "включение", "генераторное выражение", "list comprehension", "списковое включение",
    "компрехеншн", "в одну строку", "генератор списка"],
  lambda: ["лямбда", "lambda", "анонимная функция", "безымянная функция", "лямбда функция", "lambda функция"],
  closure: ["замыкание", "closure", "захват переменной", "замкнутая функция", "вложенная функция"],
  mro: ["mro", "method resolution order", "порядок разрешения методов", "порядок методов", "порядок поиска"],
  duck_typing: ["утиная типизация", "duck typing", "duck_typing", "уточная типизация", "если утка то утка"],
  slots: ["__slots__", "слоты", "slots", "слот", "фиксированные атрибуты"],
  dataclass: ["dataclass", "датакласс", "@dataclass", "класс данных", "data class"],
  context_manager: ["контекст-менеджер", "context manager", "with", "__enter__", "__exit__", "with блок"],
  type_hint: ["аннотация типов", "type hint", "typing", "type annotation", "подсказка типа"],

  // ── Web / API concepts ──
  endpoint: ["endpoint", "эндпоинт", "конечная точка", "api endpoint", "точка входа", "точка api", "енд поинт",
    "адрес api", "url обработчика"],
  authentication: ["аутентификация", "authentication", "auth", "авторизация пользователя", "вход", "логин", "аутентифик",
    "проверка личности", "кто ты", "вход в систему"],
  authorization: ["авторизация", "authorization", "права доступа", "разрешение", "проверка прав",
    "что можешь делать", "доступ к ресурсу"],
  token: ["токен", "token", "jwt", "access token", "jwt токен", "bearer token", "токен доступа", "bearer",
    "токен аутентификации", "json web token"],
  wsgi: ["wsgi", "web server gateway interface", "интерфейс веб сервера", "gunicorn", "uwsgi", "вэсги",
    "интерфейс python веб-сервера"],
  migration: ["миграция", "migration", "alembic", "db migrate", "обновление схемы бд", "миграция бд", "алембик",
    "изменение схемы", "flask db migrate"],
  config: ["конфиг", "config", "configuration", "конфигурация", "настройки приложения", "конфигурировать",
    "параметры приложения"],
  env: ["env", ".env", "environment variable", "переменная окружения", "переменная среды", "окружение", "эн вэ",
    "переменная окружения", "os.environ", "dotenv"],
  form: ["форма", "form", "html форма", "wtforms", "web форма", "вт формс", "форма ввода"],
  validation: ["валидация", "validation", "проверка данных", "wtforms валидация", "проверка ввода", "валидировать",
    "проверка полей", "validators"],
  context_app: ["контекст", "context", "application context", "request context", "flask контекст", "контекст запроса",
    "flask контекст", "текущий контекст"],
  model: ["модель", "model", "database model", "sqlalchemy model", "таблица базы данных", "модель данных", "бд модель",
    "orm модель"],
  db_query: ["запрос к бд", "query", "db query", "запрос базы данных", "sql запрос", "database query", "скл запрос",
    "запрос в бд", "select"],
  view_func: ["вью функция", "view function", "представление", "обработчик", "view", "вью", "обработчик маршрута",
    "функция-обработчик", "flask view"],
  jinja_block: ["блок", "block", "jinja block", "шаблонный блок", "{% block %}", "блок шаблона"],
  jinja_extends: ["наследование шаблона", "template inheritance", "extends", "{% extends %}", "расширение шаблона",
    "базовый шаблон", "родительский шаблон"],
  before_request: ["before_request", "before request", "до запроса", "хук до запроса", "перед запросом", "бифор реквест",
    "@app.before_request", "перед каждым запросом", "хук before_request"],
  after_request: ["after_request", "after request", "после запроса", "хук после запроса", "афтер реквест",
    "@app.after_request", "после каждого запроса"],
  error_handler: ["error_handler", "обработчик ошибки", "errorhandler", "обработка ошибок http", "@app.errorhandler",
    "обработчик исключений", "кастомная страница ошибки", "custom error page"],
  app_run: ["app.run", "запуск сервера", "запустить flask", "app run", "запуск приложения", "flask run",
    "python app.py", "запустить приложение"],
  venv: ["виртуальное окружение", "venv", "virtualenv", "virtual environment", "изолированное окружение", "пивен",
    "python venv", "изолированная среда"],
  testing: ["тестирование", "testing", "test client", "pytest", "тест клиент", "unit test", "юнит тест", "тест",
    "тест flask", "flask testing"],

  // ── HTTP status codes ──
  "200": ["200", "200 ok", "ok", "успех", "успешно", "ок", "всё хорошо", "запрос выполнен"],
  "201": ["201", "201 created", "created", "создано", "ресурс создан", "успешно создано"],
  "204": ["204", "204 no content", "no content", "нет содержимого", "пустой ответ"],
  "301": ["301", "301 moved permanently", "moved permanently", "постоянный редирект", "постоянное перенаправление"],
  "302": ["302", "302 found", "found", "временный редирект", "временное перенаправление", "redirect", "редирект"],
  "400": ["400", "400 bad request", "bad request", "неверный запрос", "плохой запрос", "ошибка запроса",
    "некорректный запрос", "неправильный запрос"],
  "401": ["401", "401 unauthorized", "unauthorized", "не авторизован", "нет авторизации", "не аутентифицирован",
    "требуется вход", "не вошёл в систему"],
  "403": ["403", "403 forbidden", "forbidden", "запрещено", "нет доступа", "доступ запрещён",
    "нет прав", "отказано в доступе"],
  "404": ["404", "404 not found", "not found", "не найдено", "страница не найдена", "ресурс не найден",
    "нет такой страницы", "не существует"],
  "405": ["405", "405 method not allowed", "method not allowed", "метод не разрешён", "метод не поддерживается",
    "нельзя использовать этот метод"],
  "409": ["409", "409 conflict", "conflict", "конфликт", "конфликт данных", "уже существует"],
  "422": ["422", "422 unprocessable entity", "unprocessable entity", "ошибка валидации", "невалидные данные",
    "данные не прошли проверку"],
  "429": ["429", "429 too many requests", "too many requests", "слишком много запросов", "rate limit",
    "превышен лимит запросов"],
  "500": ["500", "500 internal server error", "internal server error", "ошибка сервера", "внутренняя ошибка",
    "ошибка на стороне сервера", "сервер упал"],
  "503": ["503", "503 service unavailable", "service unavailable", "сервис недоступен", "сервер недоступен"],

  // ── Misc ──
  recursion: ["рекурсия", "recursion", "рекурсивная функция", "рекурс", "функция вызывает сама себя"],
  exception: ["исключение", "exception", "ошибка", "try except", "try/except", "обработка исключений",
    "перехват ошибки", "raise", "except"],
  async: ["асинхронный", "async", "async/await", "асинхронность", "асинхронное программирование", "asyncio"],
  thread: ["поток", "thread", "threading", "многопоточность", "параллельный поток"],
  process: ["процесс", "process", "multiprocessing", "многопроцессность", "отдельный процесс"],
  docker: ["докер", "docker", "контейнер", "контейнеризация", "docker container"],
  api: ["апи", "api", "application programming interface", "программный интерфейс", "веб апи", "интерфейс"],
  rest: ["рест", "rest", "restful", "rest api", "рест апи", "representational state transfer", "restful api"],
  sql: ["sql", "structured query language", "язык запросов", "база данных", "бд", "скл"],
  database: ["база данных", "database", "бд", "db", "хранилище данных", "дб"],
  index: ["индекс", "index", "db.Index", "индекс бд", "ускорение запросов", "индексация"],
  transaction: ["транзакция", "transaction", "атомарная операция", "commit rollback", "откат"],
  cache: ["кэш", "cache", "кеш", "кэширование", "кэш данных", "ускорение"],
  pagination: ["пагинация", "pagination", "постраничный вывод", "paginate", "разбивка на страницы"],
  serialization: ["сериализация", "serialization", "marshmallow", "преобразование объекта", "json dumps"],

  // ══════════════════════════════════════════════════════════════════
  // HTML — теги, атрибуты, структура
  // ══════════════════════════════════════════════════════════════════
  doctype: ["doctype", "<!doctype html>", "объявление типа документа", "доктайп", "декларация html",
    "<!DOCTYPE html>", "тип документа", "declaration"],
  html_tag: ["html тег", "html элемент", "тег html", "<html>", "корень документа", "корневой тег",
    "html element", "root element", "root tag"],
  head_tag: ["head", "<head>", "тег head", "шапка документа", "метаданные документа", "заголовок документа",
    "head section", "head element"],
  body_tag: ["body", "<body>", "тег body", "тело документа", "видимая часть", "содержимое страницы",
    "body element", "body section"],
  charset: ["charset", "кодировка", "utf-8", "utf8", "encoding", "символьная кодировка",
    "meta charset", "character encoding"],
  viewport: ["viewport", "вьюпорт", "мета вьюпорт", "meta viewport", "адаптивность мобильных",
    "мобильная версия", "responsive meta", "масштабирование"],
  semantic_html: ["семантика", "семантические теги", "semantic html", "семантическая вёрстка",
    "смысловые теги", "semantic markup", "html5 теги", "семантические элементы"],
  header_tag: ["header", "<header>", "тег header", "шапка сайта", "хедер", "header element",
    "верхняя часть", "вверх страницы"],
  nav_tag: ["nav", "<nav>", "тег nav", "навигация", "меню навигации", "navigation", "nav element",
    "список ссылок", "menu"],
  main_tag: ["main", "<main>", "тег main", "основное содержимое", "главный контент", "main content",
    "основная часть", "main element"],
  article_tag: ["article", "<article>", "тег article", "статья", "самостоятельный контент",
    "пост", "новость", "article element", "self-contained content"],
  section_tag: ["section", "<section>", "тег section", "раздел", "логический раздел", "section element",
    "смысловой блок"],
  aside_tag: ["aside", "<aside>", "тег aside", "боковая панель", "сайдбар", "sidebar",
    "дополнительный контент", "aside element"],
  footer_tag: ["footer", "<footer>", "тег footer", "подвал", "футер", "нижняя часть", "footer element",
    "нижний блок"],
  div_tag: ["div", "<div>", "тег div", "блочный элемент", "контейнер", "блок",
    "block element", "division", "div element"],
  span_tag: ["span", "<span>", "тег span", "строчный элемент", "инлайн контейнер",
    "inline element", "span element"],
  a_tag: ["a", "<a>", "тег a", "ссылка", "гиперссылка", "anchor", "link", "href",
    "anchor tag", "hyperlink"],
  img_tag: ["img", "<img>", "тег img", "изображение", "картинка", "image", "img element",
    "picture tag", "фото"],
  form_tag: ["form", "<form>", "тег form", "форма", "html форма", "веб форма", "form element",
    "input form"],
  input_tag: ["input", "<input>", "тег input", "поле ввода", "поле формы", "input field",
    "text field", "форма ввода"],
  button_tag: ["button", "<button>", "тег button", "кнопка", "button element", "клик",
    "html кнопка"],
  label_tag: ["label", "<label>", "тег label", "метка", "подпись поля", "label element",
    "for attribute", "атрибут for"],
  select_tag: ["select", "<select>", "тег select", "выпадающий список", "список выбора",
    "dropdown", "select element"],
  textarea_tag: ["textarea", "<textarea>", "тег textarea", "многострочный ввод", "текстовая область",
    "multiline input", "textarea element"],
  table_tag: ["table", "<table>", "тег table", "таблица", "html таблица", "table element",
    "табличные данные"],
  ul_tag: ["ul", "<ul>", "маркированный список", "ненумерованный список", "unordered list",
    "список с точками", "ul element", "bullet list"],
  ol_tag: ["ol", "<ol>", "нумерованный список", "упорядоченный список", "ordered list",
    "список с номерами", "ol element"],
  li_tag: ["li", "<li>", "элемент списка", "пункт списка", "list item", "li element"],
  h1_tag: ["h1", "<h1>", "заголовок первого уровня", "главный заголовок", "heading 1",
    "основной заголовок"],
  paragraph: ["p", "<p>", "тег p", "абзац", "параграф", "paragraph", "p element", "текстовый блок"],
  alt_attr: ["alt", "alt атрибут", "альтернативный текст", "текст для картинки",
    "accessibility text", "alt text", "описание изображения"],
  href_attr: ["href", "атрибут href", "ссылка href", "url ссылки", "hyperlink reference",
    "адрес ссылки"],
  src_attr: ["src", "атрибут src", "источник", "путь к файлу", "source attribute",
    "адрес изображения"],
  class_attr: ["class", "атрибут class", "css класс", "класс элемента", "class attribute",
    "имя класса"],
  id_attr: ["id", "атрибут id", "идентификатор элемента", "id attribute", "уникальный идентификатор",
    "element id"],
  data_attr: ["data-", "data атрибут", "пользовательский атрибут", "dataset", "custom attribute",
    "data attribute"],
  html5: ["html5", "хтмл5", "пятая версия html", "modern html", "html 5"],
  meta_tag: ["meta", "<meta>", "тег meta", "мета тег", "метаданные", "meta element",
    "meta information"],
  link_tag: ["link", "<link>", "тег link", "подключение css", "css link", "stylesheet link",
    "rel stylesheet"],
  script_tag: ["script", "<script>", "тег script", "подключение js", "javascript script",
    "script element"],

  // ══════════════════════════════════════════════════════════════════
  // CSS — свойства, значения, модель
  // ══════════════════════════════════════════════════════════════════
  css: ["css", "каскадные таблицы стилей", "стили", "cascading style sheets", "стилизация",
    "css стили", "stylesheet"],
  css_selector: ["селектор", "css selector", "css селектор", "правило css", "выборка элементов",
    "selector"],
  class_selector: ["селектор класса", "class selector", ".class", "точка перед именем",
    "css класс", ".имя"],
  id_selector: ["селектор id", "id selector", "#id", "решётка", "hash selector"],
  element_selector: ["селектор элемента", "element selector", "тег селектор", "type selector"],
  pseudo_class: ["псевдокласс", "pseudo-class", ":hover", ":focus", ":active", ":first-child",
    ":last-child", ":nth-child", "двоеточие"],
  pseudo_element: ["псевдоэлемент", "pseudo-element", "::before", "::after", "::placeholder",
    "двойное двоеточие"],
  specificity: ["специфичность", "specificity", "вес селектора", "приоритет css",
    "css приоритет", "cascade priority"],
  cascade: ["каскад", "cascade", "каскадность", "каскадные стили", "cascading"],
  css_inheritance: ["наследование css", "css inheritance", "наследуемые свойства",
    "inherit", "inherited properties"],
  box_model: ["блочная модель", "box model", "блок css", "css блок", "content padding border margin",
    "боксовая модель"],
  padding_css: ["padding", "внутренний отступ", "внутренние поля", "отступ внутри",
    "padding css", "paddings"],
  margin_css: ["margin", "внешний отступ", "отступ снаружи", "внешние поля",
    "margin css", "margins"],
  border_css: ["border", "граница", "рамка", "border css", "бордер", "border property"],
  border_radius: ["border-radius", "скругление", "скруглённые углы", "радиус скругления",
    "rounded corners", "border radius"],
  box_sizing: ["box-sizing", "border-box", "content-box", "боксинг", "box sizing",
    "расчёт размера"],
  display_css: ["display", "отображение", "display property", "тип отображения",
    "css display", "display css"],
  flexbox: ["flexbox", "флексбокс", "flex", "display flex", "flex контейнер",
    "flex layout", "гибкая разметка", "flex-box"],
  flex_direction: ["flex-direction", "направление flex", "flex direction", "row column",
    "ось флекса"],
  flex_wrap: ["flex-wrap", "перенос flex", "flex wrap", "перенос строк",
    "wrap элементов"],
  justify_content: ["justify-content", "выравнивание по главной оси", "justify content",
    "горизонтальное выравнивание flex", "space-between", "space-around", "space-evenly"],
  align_items: ["align-items", "выравнивание по поперечной оси", "align items",
    "вертикальное выравнивание flex", "stretch", "center flex"],
  flex_grow: ["flex-grow", "рост flex", "flex grow", "расширение элемента"],
  flex_shrink: ["flex-shrink", "сжатие flex", "flex shrink"],
  flex_basis: ["flex-basis", "базовый размер", "flex basis"],
  css_grid: ["css grid", "гриду", "сетка css", "display grid", "grid layout",
    "grid", "табличная сетка", "css сетка"],
  grid_template: ["grid-template-columns", "grid-template-rows", "grid template",
    "шаблон сетки", "колонки сетки", "строки сетки"],
  grid_gap: ["gap", "grid-gap", "отступ между ячейками", "расстояние в сетке",
    "column-gap", "row-gap"],
  grid_area: ["grid-area", "grid area", "область сетки", "размещение в сетке"],
  position_css: ["position", "позиционирование", "position css", "css position"],
  relative: ["relative", "относительное", "position relative", "относительная позиция"],
  absolute: ["absolute", "абсолютное", "position absolute", "абсолютная позиция"],
  fixed: ["fixed", "фиксированное", "position fixed", "фиксированная позиция",
    "прилипание к экрану"],
  sticky: ["sticky", "липкое", "position sticky", "прилипающий элемент",
    "sticky header"],
  z_index: ["z-index", "слой", "z индекс", "порядок наложения", "z index",
    "стек элементов"],
  overflow_css: ["overflow", "переполнение", "overflow css", "overflow hidden",
    "overflow scroll", "прокрутка"],
  width_css: ["width", "ширина", "width css", "ширина элемента"],
  height_css: ["height", "высота", "height css", "высота элемента"],
  max_width: ["max-width", "максимальная ширина", "max width", "ограничение ширины"],
  min_width: ["min-width", "минимальная ширина", "min width"],
  color_css: ["color", "цвет текста", "color css", "цвет", "цвет шрифта"],
  background_css: ["background", "фон", "background css", "background-color",
    "фоновый цвет", "background-image"],
  font_size: ["font-size", "размер шрифта", "font size", "размер текста"],
  font_weight: ["font-weight", "жирность", "font weight", "жирность шрифта", "bold"],
  font_family: ["font-family", "шрифт", "font family", "семейство шрифтов"],
  text_align: ["text-align", "выравнивание текста", "text align", "выравнивание",
    "center text", "text alignment"],
  line_height: ["line-height", "межстрочный интервал", "line height", "высота строки"],
  text_decoration: ["text-decoration", "оформление текста", "text decoration",
    "underline", "none decoration", "подчёркивание"],
  opacity_css: ["opacity", "прозрачность", "opacity css", "непрозрачность"],
  transition_css: ["transition", "переход", "css transition", "анимация перехода",
    "плавный переход", "animation transition"],
  transform_css: ["transform", "трансформация", "css transform", "translate", "rotate",
    "scale transform"],
  animation_css: ["animation", "css animation", "анимация css", "@keyframes",
    "keyframes", "кейфреймы"],
  media_query: ["media query", "медиазапрос", "@media", "адаптивность", "responsive design",
    "брейкпоинт", "breakpoint", "адаптивная вёрстка", "mobile first"],
  css_variable: ["css переменная", "css variable", "--variable", "кастомное свойство",
    "custom property", "var()", "дефис дефис"],
  rem_unit: ["rem", "rem единица", "относительный размер", "rem font"],
  em_unit: ["em", "em единица", "em шрифт", "relative em"],
  vh_vw: ["vh", "vw", "viewport height", "viewport width", "высота экрана", "ширина экрана",
    "проценты экрана"],
  px_unit: ["px", "пиксель", "pixel", "пикс", "pixels"],
  percent_unit: ["%", "процент", "percent", "relative percent", "процентный размер"],
  rgba_color: ["rgba", "цвет rgba", "прозрачность цвета", "rgba color", "alpha channel"],
  hex_color: ["hex", "хекс цвет", "#fff", "#000", "шестнадцатеричный цвет", "hex color"],
  shadow_css: ["box-shadow", "text-shadow", "тень", "shadow", "box shadow"],
  cursor_css: ["cursor", "курсор", "cursor pointer", "указатель мыши"],
  list_style: ["list-style", "list style", "маркер списка", "стиль списка", "list-style-type"],
  outline_css: ["outline", "контур", "outline css", "outline focus"],

  // ══════════════════════════════════════════════════════════════════
  // JavaScript — основы, ES6+
  // ══════════════════════════════════════════════════════════════════
  javascript: ["javascript", "js", "джаваскрипт", "джс", "скриптовый язык",
    "язык программирования js", "ecmascript"],
  variable_js: ["переменная js", "js переменная", "variable javascript", "let const var",
    "объявление переменной"],
  const_js: ["const", "константа js", "неизменяемая переменная", "const js",
    "constant", "константа"],
  let_js: ["let", "блочная переменная", "let js", "let переменная", "блочная область"],
  var_js: ["var", "var js", "переменная var", "устаревший var", "function scope var"],
  function_js: ["функция js", "function", "js функция", "объявление функции",
    "function declaration", "функция"],
  arrow_function: ["стрелочная функция", "arrow function", "=>", "arrow", "стрелка",
    "fat arrow", "лямбда js"],
  template_literal: ["шаблонная строка", "template literal", "шаблонный литерал",
    "backtick", "обратная кавычка", "`${}`", "template string", "интерполяция"],
  destructuring: ["деструктуризация", "destructuring", "деструктуризация объекта",
    "деструктуризация массива", "spread объект", "вытаскивание свойств"],
  spread_operator: ["оператор spread", "spread operator", "...", "три точки", "расширение",
    "spread", "разворачивание"],
  rest_params: ["rest параметры", "rest params", "rest оператор", "...args",
    "оставшиеся аргументы", "rest"],
  array_methods: ["методы массива", "array methods", "map filter reduce", "forEach",
    "методы js массива", "array js"],
  map_method: ["map", "map метод", "преобразование массива", "array map",
    "трансформация элементов"],
  filter_method: ["filter", "filter метод", "фильтрация массива", "array filter",
    "отбор элементов"],
  reduce_method: ["reduce", "reduce метод", "свёртка массива", "array reduce",
    "накопитель"],
  foreach_method: ["foreach", "forEach метод", "перебор массива", "array forEach",
    "итерация массива"],
  find_method: ["find", "find метод", "поиск в массиве", "array find", "findIndex"],
  some_every: ["some", "every", "some every", "проверка элементов", "array some every"],
  includes_method: ["includes", "includes метод", "проверка наличия", "array includes",
    "contains"],
  object_js: ["объект js", "object", "js объект", "объект javascript", "{}",
    "ключ значение", "свойства объекта"],
  object_methods: ["Object.keys", "Object.values", "Object.entries", "методы Object",
    "object methods js", "перебор объекта"],
  class_js: ["класс js", "class", "js класс", "es6 класс", "class javascript",
    "constructor", "конструктор класса"],
  module_js: ["модуль js", "module", "import export", "es модуль", "esm",
    "import js", "export js"],
  import_js: ["import", "импорт js", "import js", "подключение модуля", "import from"],
  export_js: ["export", "экспорт js", "export js", "экспорт модуля", "export default"],

  // ══════════════════════════════════════════════════════════════════
  // DOM — работа с браузером
  // ══════════════════════════════════════════════════════════════════
  dom: ["dom", "document object model", "дом", "объектная модель документа",
    "дерево dom", "html dom", "браузерный dom"],
  queryselector: ["queryselector", "querySelector", "поиск элемента", "нахождение элемента",
    "query selector", "выбор элемента", "document.querySelector"],
  queryselectorall: ["queryselectorall", "querySelectorAll", "поиск всех элементов",
    "query selector all", "список элементов", "nodeList"],
  getelementbyid: ["getelementbyid", "getElementById", "поиск по id", "element by id",
    "document getElementById", "нахождение по id"],
  getelementsbyclassname: ["getelementsbyclassname", "getElementsByClassName",
    "поиск по классу", "elements by class name"],
  innerhtml: ["innerhtml", "innerHTML", "внутренний html", "html содержимое",
    "inner html", "html элемента"],
  textcontent: ["textcontent", "textContent", "текстовое содержимое", "text content",
    "текст элемента", "innerText"],
  classlist: ["classlist", "classList", "список классов", "class list",
    "classList.add", "classList.remove", "classList.toggle", "управление классами"],
  style_prop: ["style", "element.style", "инлайн стиль", "inline style js",
    "стиль через js", "изменение стиля"],
  dataset_prop: ["dataset", "data атрибут js", "dataset js", "пользовательские данные",
    "data property js"],
  addeventlistener: ["addeventlistener", "addEventListener", "подписка на событие",
    "add event listener", "обработчик события", "слушатель события", "listener"],
  removeeventlistener: ["removeeventlistener", "removeEventListener",
    "отписка от события", "удаление обработчика"],
  preventdefault: ["preventdefault", "preventDefault", "предотвращение действия",
    "отмена события", "prevent default", "e.preventDefault"],
  stoppropagation: ["stoppropagation", "stopPropagation", "остановка всплытия",
    "stop propagation", "отмена всплытия"],
  event_object: ["объект события", "event object", "e event", "event", "событие js",
    "аргумент события"],
  event_click: ["click", "событие click", "нажатие", "onclick", "click event",
    "клик"],
  event_submit: ["submit", "событие submit", "отправка формы", "form submit",
    "submit event", "on submit"],
  event_input: ["input", "событие input", "ввод текста", "input event",
    "input handler", "oninput"],
  event_keydown: ["keydown", "событие keydown", "нажатие клавиши", "keyup",
    "keypress", "keyboard event"],
  event_change: ["change", "событие change", "изменение значения", "change event",
    "on change"],
  event_load: ["load", "DOMContentLoaded", "событие загрузки", "load event",
    "страница загружена", "onload"],
  createelement: ["createelement", "createElement", "создание элемента",
    "document createElement", "новый элемент dom"],
  appendchild: ["appendchild", "appendChild", "добавление элемента",
    "append child", "добавление в dom", "append js"],
  removechild: ["removechild", "removeChild", "удаление элемента",
    "remove child", "remove js", "element.remove"],
  parentelement: ["parentelement", "parentElement", "родительский элемент",
    "parent element", "parentNode"],
  children_prop: ["children", "childNodes", "дочерние элементы", "children js",
    "потомки элемента"],
  settimeout_js: ["settimeout", "setTimeout", "задержка", "таймер", "timeout",
    "тайм-аут", "set timeout"],
  setinterval_js: ["setinterval", "setInterval", "интервал", "повтор", "interval js",
    "периодический таймер", "set interval"],
  clearinterval_js: ["clearinterval", "clearInterval", "clearTimeout", "остановка таймера"],

  // ══════════════════════════════════════════════════════════════════
  // Async JS — Fetch, Promise, async/await
  // ══════════════════════════════════════════════════════════════════
  promise: ["promise", "промис", "обещание js", "Promise js", "асинхронный результат",
    "resolve reject", "then catch"],
  async_await: ["async await", "async/await", "асинхронная функция", "async function",
    "await js", "ожидание промиса", "асинхрон"],
  fetch_api: ["fetch", "fetch api", "запрос к серверу", "http запрос js", "xhr",
    "ajax js", "network request", "сетевой запрос", "fetch запрос"],
  then_catch: [".then", ".catch", ".finally", "цепочка промисов", "promise chain",
    "обработка промиса", "then js", "catch js"],
  json_parse: ["json parse", "JSON.parse", "парсинг json", "разбор json",
    "parse json", "строка в объект"],
  json_stringify: ["json stringify", "JSON.stringify", "сериализация json",
    "stringify json", "объект в строку"],
  try_catch_js: ["try catch js", "try/catch js", "обработка ошибок js",
    "try catch finally", "error handling js", "ошибка js"],
  axios: ["axios", "http клиент", "axios js", "axios запрос", "library http"],
  cors_js: ["cors", "cross-origin", "cors ошибка", "allow-origin", "кросс-доменный",
    "cross origin resource sharing", "cors заголовок"],

  // ══════════════════════════════════════════════════════════════════
  // Storage, LocalStorage, SessionStorage
  // ══════════════════════════════════════════════════════════════════
  localstorage: ["localstorage", "localStorage", "локальное хранилище", "local storage",
    "хранение данных браузер", "persistent storage"],
  sessionstorage: ["sessionstorage", "sessionStorage", "хранилище сессии",
    "session storage", "временное хранилище"],
  storage_setitem: ["setItem", "set item", "запись в localstorage", "localStorage.setItem",
    "сохранение в хранилище"],
  storage_getitem: ["getItem", "get item", "чтение из localstorage", "localStorage.getItem",
    "получение из хранилища"],
  storage_removeitem: ["removeItem", "remove item", "удаление из localstorage",
    "localStorage.removeItem"],
  cookies_js: ["cookies", "cookie", "куки браузер", "document.cookie",
    "browser cookie", "хранение куки"],

  // ══════════════════════════════════════════════════════════════════
  // Flask + HTML интеграция
  // ══════════════════════════════════════════════════════════════════
  flask_html: ["flask html", "flask шаблоны", "flask templates", "flask + html",
    "flask frontend", "фласк хтмл"],
  jinja2_tmpl: ["jinja2", "jinja", "шаблонизатор", "template engine", "jinja2 flask",
    "{{ }}", "{% %}", "шаблон flask"],
  flask_static: ["static", "flask static", "статические файлы", "url_for static",
    "css flask", "js flask", "static files flask"],
  flask_route: ["route", "@app.route", "маршрут flask", "flask route", "url flask",
    "роут flask", "декоратор route"],
  flask_render: ["render_template", "рендер шаблона", "render template flask",
    "возврат html flask", "flask template render"],
  flask_request: ["request flask", "request.form", "request.json", "request.args",
    "данные запроса flask", "flask request object"],
  flask_jsonify: ["jsonify", "flask jsonify", "json ответ flask", "return json flask",
    "api endpoint flask"],
  fetch_flask: ["fetch flask", "js fetch flask", "ajax flask", "запрос к flask api",
    "frontend backend fetch", "axios flask"],
  jinja_variable: ["{{ variable }}", "jinja переменная", "шаблонная переменная",
    "jinja variable", "render variable jinja"],
  jinja_if: ["{% if %}", "jinja if", "условие jinja", "jinja условие",
    "if block jinja", "{% endif %}"],
  jinja_for: ["{% for %}", "jinja for", "цикл jinja", "jinja loop",
    "for block jinja", "{% endfor %}"],
  jinja2_extends: ["extends", "{% extends %}", "наследование шаблонов",
    "template inheritance", "базовый шаблон", "base template"],
  jinja2_block: ["block", "{% block %}", "блок jinja", "jinja block",
    "переопределение блока"],
  flask_blueprint: ["blueprint", "flask blueprint", "блюпринт", "flask модуль",
    "разбиение маршрутов"],
  csrf_token: ["csrf", "csrf token", "csrf защита", "cross site request forgery",
    "csrf flask", "wtf csrf"],
};

function resolveSynonym(s: string): string {
  const n = normalize(s);
  for (const [canonical, variants] of Object.entries(SYNONYMS)) {
    if (variants.map(normalize).includes(n)) return canonical;
  }
  return n;
}

// ── Stopwords (RU + EN) ──────────────────────────────────────────────────
const STOPWORDS = new Set([
  "и", "в", "на", "с", "к", "по", "из", "для", "не", "или", "то", "что",
  "это", "как", "так", "же", "при", "его", "её", "их", "но", "а", "если",
  "до", "от", "да", "нет", "ли", "бы", "ещё", "уже", "чем", "тем", "всё",
  "без", "чтобы", "между", "когда", "через", "после", "тоже", "только",
  "используется", "используют", "позволяет", "является", "называется",
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "have", "has",
  "do", "does", "did", "to", "of", "in", "on", "at", "for", "from", "with",
  "by", "that", "this", "which", "when", "where", "how", "what", "and", "or",
  "but", "not", "it", "its", "can", "will", "would", "should", "could", "used",
  "allows", "called", "known", "provides",
]);

function extractKeywords(text: string): string[] {
  return normalize(text)
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

/** Keyword coverage: fraction of accepted's keywords found in user answer */
function keywordCoverage(userAnswer: string, accepted: string): number {
  const acceptedKeys = extractKeywords(accepted);
  if (acceptedKeys.length === 0) return 0;
  const userNorm = normalize(userAnswer);
  const hits = acceptedKeys.filter((k) => {
    // Direct substring
    if (userNorm.includes(k)) return true;
    // Fuzzy match against each user token
    const userTokens = userNorm.split(/\s+/);
    return userTokens.some((ut) => fuzzyMatch(ut, k));
  }).length;
  return hits / acceptedKeys.length;
}

/** Short single-token answer contained as whole token in user answer */
function shortAnswerContained(userAnswer: string, accepted: string): boolean {
  const aN = normalize(accepted);
  if (aN.includes(" ")) return false;
  const userTokens = normalize(userAnswer)
    .split(/[\s,;:—]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  return userTokens.includes(aN);
}

/** Synonym-resolved keyword check */
function synonymKeywordMatch(userAnswer: string, accepted: string): boolean {
  const userKeys = extractKeywords(userAnswer).map(resolveSynonym);
  const acceptedKeys = extractKeywords(accepted).map(resolveSynonym);
  if (acceptedKeys.length === 0 || userKeys.length === 0) return false;
  const hits = acceptedKeys.filter((k) => userKeys.includes(k)).length;
  return hits / acceptedKeys.length >= 0.40; // lowered from 0.50
}

/** Token-level fuzzy synonym: each user token → resolved canonical, match against accepted tokens */
function tokenLevelSynonymMatch(userAnswer: string, accepted: string): boolean {
  const uTokens = normalize(userAnswer).split(/\s+/).filter((t) => t.length >= 3).map(resolveSynonym);
  const aTokens = normalize(accepted).split(/\s+/).filter((t) => t.length >= 3).map(resolveSynonym);
  if (uTokens.length === 0 || aTokens.length === 0) return false;
  const hits = uTokens.filter((ut) => aTokens.some((at) => at === ut || fuzzyMatch(ut, at))).length;
  const threshold = Math.min(uTokens.length, aTokens.length);
  return hits >= 1 && hits / threshold >= 0.50;
}

/** Clause split: accepted has "A и B" → accept user covering any clause */
function clauseMatch(userAnswer: string, accepted: string): boolean {
  const clauses = normalize(accepted).split(/\s(?:и|или|and|or)\s|[,;]/).map((c) => c.trim()).filter((c) => c.length > 3);
  if (clauses.length < 2) return false;
  const uNorm = normalize(userAnswer);
  const covered = clauses.filter((clause) => {
    if (uNorm.includes(clause)) return true;
    const clauseKeys = extractKeywords(clause);
    if (clauseKeys.length === 0) return false;
    const hits = clauseKeys.filter((k) => uNorm.includes(k) || uNorm.split(/\s+/).some((t) => fuzzyMatch(t, k))).length;
    return hits / clauseKeys.length >= 0.55;
  }).length;
  return covered / clauses.length >= 0.50;
}

/** Russian prefix/root: "перезагрузк" matches "перезагрузка" */
function russianRootMatch(userAnswer: string, accepted: string): boolean {
  const uTokens = normalize(userAnswer).split(/\s+/).filter((t) => t.length >= 5);
  const aTokens = normalize(accepted).split(/\s+/).filter((t) => t.length >= 5);
  if (uTokens.length === 0 || aTokens.length === 0) return false;
  const hits = uTokens.filter((ut) =>
    aTokens.some((at) => {
      const len = Math.min(ut.length, at.length, 7);
      return len >= 5 && ut.slice(0, len) === at.slice(0, len);
    })
  ).length;
  return hits > 0 && hits / Math.min(uTokens.length, aTokens.length) >= 0.50;
}

/** Any single resolved user token hits any resolved accepted token */
function anyTokenSynonymHit(userAnswer: string, accepted: string): boolean {
  const uTokens = normalize(userAnswer).split(/\s+/).filter((t) => t.length >= 4).map(resolveSynonym);
  const aTokens = normalize(accepted).split(/\s+/).filter((t) => t.length >= 4).map(resolveSynonym);
  if (uTokens.length === 0 || aTokens.length === 0) return false;
  // Only useful as fallback for very short answers — require ≥50% token hit
  const hits = uTokens.filter((ut) => aTokens.includes(ut)).length;
  const minLen = Math.min(uTokens.length, aTokens.length);
  return minLen <= 2 ? hits >= minLen : hits / minLen >= 0.60;
}

/** Aggressive: user answer contains at least one key concept from accepted */
function singleConceptHit(userAnswer: string, accepted: string): boolean {
  // Only apply when accepted is long (4+ key concepts) — prevents over-matching
  const acceptedKeys = extractKeywords(accepted).map(resolveSynonym);
  if (acceptedKeys.length < 4) return false;
  const userKeys = extractKeywords(userAnswer).map(resolveSynonym);
  if (userKeys.length === 0) return false;
  // User must hit at least 2 concepts AND have ≥ 30% coverage
  const hits = acceptedKeys.filter((k) => userKeys.includes(k)).length;
  return hits >= 2 && hits / acceptedKeys.length >= 0.30;
}

/** Substring containment: accepted phrase appears inside user's longer answer */
function acceptedSubstringOfUser(userAnswer: string, accepted: string): boolean {
  const uN = normalize(userAnswer);
  const aN = normalize(accepted);
  if (aN.length < 4) return false; // too short to be meaningful
  return uN.includes(aN);
}

/** User answer is a substring of accepted (user gave a key part) */
function userSubstringOfAccepted(userAnswer: string, accepted: string): boolean {
  const uN = normalize(userAnswer);
  const aN = normalize(accepted);
  if (uN.length < 4) return false;
  // Only if user answer is at least 60% of accepted length
  if (uN.length / aN.length < 0.55) return false;
  return aN.includes(uN);
}

export function isAnswerCorrect(userAnswer: string, accepted: string[]): boolean {
  if (!userAnswer.trim()) return false;

  const uNorm = normalize(userAnswer);
  const uSet = normalizeSet(userAnswer);
  const uSyn = resolveSynonym(userAnswer);

  for (const a of accepted) {
    const aNorm = normalize(a);
    const aSet = normalizeSet(a);
    const aSyn = resolveSynonym(a);

    // 1. Exact normalized match
    if (uNorm === aNorm) return true;

    // 2. Order-independent set match (comma/semicolon/slash separated lists)
    if (uSet === aSet) return true;

    // 3. Synonym map match (both sides resolved)
    if (uSyn === aSyn || uSyn === aNorm || uNorm === aSyn) return true;

    // 4. Fuzzy single-token match (typos in short words)
    if (!uNorm.includes(" ") && !aNorm.includes(" ")) {
      if (fuzzyMatch(uNorm, aNorm)) return true;
    }

    // 5. Short accepted answer contained as whole token in user answer
    if (shortAnswerContained(userAnswer, a)) return true;

    // 6. Accepted phrase is a substring of user's longer answer
    if (acceptedSubstringOfUser(userAnswer, a)) return true;

    // 7. User's answer is a significant substring of accepted
    if (userSubstringOfAccepted(userAnswer, a)) return true;

    // 8. Keyword coverage ≥ 45% of accepted's keywords (lowered from 55%)
    if (keywordCoverage(userAnswer, a) >= 0.45) return true;

    // 9. Reverse coverage ≥ 65%: concise user answer covers accepted (lowered from 75%)
    const userKeys = extractKeywords(userAnswer);
    if (userKeys.length >= 1) {
      const reverseHits = userKeys.filter((k) => aNorm.includes(k) || aNorm.split(/\s+/).some((t) => fuzzyMatch(t, k))).length;
      if (reverseHits / userKeys.length >= 0.65) return true;
    }

    // 10. Synonym-resolved keyword overlap ≥ 40% (lowered from 50%)
    if (synonymKeywordMatch(userAnswer, a)) return true;

    // 11. Multi-token synonym set match (each token resolved to canonical)
    const uTokensSyn = normalizeSet(userAnswer).split("|").map(resolveSynonym).sort().join("|");
    const aTokensSyn = normalizeSet(a).split("|").map(resolveSynonym).sort().join("|");
    if (uTokensSyn === aTokensSyn) return true;

    // 12. Token-level fuzzy synonym match (per-token resolution + fuzzy)
    if (tokenLevelSynonymMatch(userAnswer, a)) return true;

    // 13. Clause-level match: user covers ≥50% of "A и B" style clauses
    if (clauseMatch(userAnswer, a)) return true;

    // 14. Russian root/prefix match (5+ char common prefix)
    if (russianRootMatch(userAnswer, a)) return true;

    // 15. Any resolved user token hits any resolved accepted token (short answers)
    if (anyTokenSynonymHit(userAnswer, a)) return true;

    // 16. Long-answer: user hits ≥2 concepts + 30% coverage
    if (singleConceptHit(userAnswer, a)) return true;
  }

  return false;
}

export function ExerciseQuestion({
  exercise,
  onComplete,
  initialAnswer = "",
  onInputChange,
}: {
  exercise: QuestionExercise;
  onComplete: (score: number, max: number, meta: { hintsRevealed: number; input?: string | string[] }) => void;
  initialAnswer?: string;
  onInputChange?: (answer: string) => void;
}) {
  const [answer, setAnswer] = useState(initialAnswer);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);

  const handleChange = (val: string) => {
    setAnswer(val);
    if (checked) setChecked(false);
    onInputChange?.(val);
  };

  const doCheck = () => {
    setCorrect(isAnswerCorrect(answer, exercise.answers));
    setChecked(true);
  };

  const onNext = () => {
    onComplete(correct ? 1 : 0, 1, { hintsRevealed, input: answer });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-accent/15 text-accent grid place-items-center flex-shrink-0">
          <FileQuestion className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-accent mb-1">
            Вопрос с открытым ответом
          </div>
          <h3 className="text-xl font-semibold leading-tight">{exercise.title}</h3>
        </div>
      </div>

      {exercise.code && <PyCode code={exercise.code} />}

      <div className="rounded-xl border bg-card p-5">
        <div className="text-base text-foreground leading-relaxed">{renderInline(exercise.question)}</div>
        <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5">
          <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
          Принимается: русский или английский, с кавычками или без, регистр не важен.
          Если несколько значений — напиши через запятую.
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/90">Твой ответ</label>
        <Input
          value={answer}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && answer.trim()) doCheck(); }}
          placeholder="Введи ответ и нажми Enter или «Проверить»"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          className="font-mono text-sm"
          data-testid="input-question-answer"
        />
      </div>

      <HintBox
        hints={[exercise.hint]}
        label="Подсказка"
        onHintReveal={(n) => setHintsRevealed(n)}
      />

      <div className="flex items-center gap-3 flex-wrap">
        {!checked && (
          <Button
            onClick={doCheck}
            disabled={!answer.trim()}
            data-testid="button-check-question"
          >
            Проверить
          </Button>
        )}
        {checked && (
          <>
            <div
              className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-md border ${
                correct
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/30"
              }`}
            >
              {correct ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {correct ? "Верно!" : "Неверно"}
            </div>
            {!correct && (
              <Button variant="outline" size="sm" onClick={() => setChecked(false)}>
                Попробовать ещё раз
              </Button>
            )}
            <Button onClick={onNext} data-testid="button-next-question">
              Дальше
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {checked && (
        <div
          className={`rounded-xl border-l-4 px-4 py-3 text-sm ${
            correct
              ? "border-emerald-500 bg-emerald-500/5"
              : "border-primary bg-primary/5"
          }`}
        >
          <div className={`font-semibold mb-1.5 ${correct ? "text-emerald-400" : "text-primary"}`}>
            {correct ? "Отлично! " : ""}Объяснение
          </div>
          <div className="text-foreground/85 leading-relaxed">{renderInline(exercise.explanation)}</div>
          {!correct && (
            <div className="mt-3 pt-2.5 border-t border-border/40 text-xs text-muted-foreground">
              Верный ответ:{" "}
              <span className="font-mono text-foreground font-medium">
                {exercise.answers[0]}
              </span>
              {exercise.answers.length > 1 && (
                <span className="ml-1 text-muted-foreground/70">
                  (или: {exercise.answers.slice(1, 6).join(", ")})
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
