export interface DocSection {
  id: string;
  category: "html" | "css" | "js";
  level: "beginner" | "intermediate" | "advanced";
  title: string;
  body: string;
  html?: string;
  css?: string;
  js?: string;
  tips: string[];
}

export const WEB_DOCS: DocSection[] = [
  // ─────────────────── HTML ───────────────────
  {
    id: "html-structure",
    category: "html",
    level: "beginner",
    title: "Структура HTML-документа",
    body: `HTML (HyperText Markup Language) — язык разметки веб-страниц. Каждый HTML-документ начинается с декларации <!DOCTYPE html>, которая говорит браузеру: «это современный HTML5».

**Основная структура:**
• <!DOCTYPE html> — тип документа, всегда первая строка
• <html lang="ru"> — корневой элемент, язык влияет на читалки и поисковики
• <head> — служебная информация: заголовок, стили, скрипты, мета-теги. Пользователь это не видит
• <body> — всё что отображается на странице

**Зачем lang на html?** Браузеры используют атрибут lang для правильного переноса слов, читалки для слепых — для правильного произношения, поисковики — для определения языка контента.

**charset=UTF-8** — без этой строки в head кириллица превратится в «кракозябры». UTF-8 поддерживает все языки мира.

**viewport** для мобильных: без этого тега страница на телефоне будет зумированной как на десктопе. width=device-width делает ширину страницы равной ширине экрана.`,
    html: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Моя первая страница</title>
</head>
<body>
  <h1>Привет, мир!</h1>
  <p>Это моя первая HTML-страница.</p>
</body>
</html>`,
    css: `body {
  font-family: system-ui, sans-serif;
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
  color: #e8eaed;
  background: #1a1d23;
}
h1 { color: #6366f1; }`,
    js: `// Структура загружена!
console.log('Document ready!');
console.log('Title:', document.title);
console.log('Language:', document.documentElement.lang);`,
    tips: [
      "Всегда начинай с <!DOCTYPE html> — без него браузер включает «режим совместимости» и рендерит страницу по-старому",
      "Добавляй lang='ru' на тег <html> — это важно для SEO и accessibility",
      "Мета-тег viewport обязателен для мобильных устройств",
      "В <head> ставь CSS (link rel='stylesheet') перед скриптами — это ускоряет отрисовку",
    ],
  },
  {
    id: "html-headings-text",
    category: "html",
    level: "beginner",
    title: "Текст: заголовки, параграфы, форматирование",
    body: `HTML предоставляет богатый набор тегов для работы с текстом. Правильный выбор тегов влияет на SEO и доступность.

**Заголовки h1–h6:** Создают иерархию контента. h1 — главный заголовок страницы (должен быть один!). h2 — подразделы, h3 — подподразделы и т.д. Поисковики активно используют заголовки для понимания структуры.

**Параграф <p>:** Стандартный контейнер для текста. Браузер автоматически добавляет отступы сверху и снизу. Никогда не используй <br> для создания пространства между параграфами.

**Строчное форматирование:**
• <strong> — важный текст (жирный + семантика важности)
• <em> — акцентированный текст (курсив + семантика акцента)
• <mark> — выделение как маркером
• <code> — компьютерный код (моноширинный шрифт)
• <small> — мелкий текст (подписи, сноски)
• <del> — зачёркнутый (удалённый) текст
• <ins> — подчёркнутый (вставленный) текст
• <sup> и <sub> — верхний и нижний индексы`,
    html: `<h1>Главный заголовок страницы</h1>
<h2>Раздел второго уровня</h2>
<h3>Подраздел</h3>

<p>Это обычный параграф с <strong>важным текстом</strong>,
<em>акцентированным текстом</em> и <mark>выделением</mark>.</p>

<p>Пример кода: <code>console.log("Привет")</code></p>

<p>Вода: H<sub>2</sub>O. Площадь: 5<sup>2</sup> = 25 м²</p>

<p><del>Было: 1000₽</del> <ins>Стало: 750₽</ins></p>

<p><small>* Акция действует до конца месяца</small></p>`,
    css: `body { font-family: system-ui; max-width: 600px; margin: 1rem auto; padding: 1rem; background:#1a1d23; color:#e8eaed; }
h1 { color: #6366f1; }
h2 { color: #a855f7; }
h3 { color: #22c55e; }
code { background: #2a2d36; padding: 0.1em 0.4em; border-radius: 4px; font-size: 0.9em; }
mark { background: #fbbf24; color: #000; padding: 0 0.2em; border-radius: 2px; }`,
    js: ``,
    tips: [
      "h1 должен быть один на страницу — это важно для SEO",
      "Не используй заголовки для стилизации! h2 не потому что «большой», а потому что подраздел",
      "<strong> ≠ <b>: strong означает важность, b — просто жирный стиль без семантики",
      "Используй em для курсива со смысловым акцентом, i — для технических терминов или иностранных слов",
    ],
  },
  {
    id: "html-links-images",
    category: "html",
    level: "beginner",
    title: "Ссылки <a> и изображения <img>",
    body: `**Ссылки <a href="...">** — основа гипертекста. Атрибут href задаёт адрес назначения.

**Типы href:**
• Абсолютный URL: href="https://example.com"
• Относительный: href="about.html" или href="../pages/contact.html"
• Якорь: href="#section-2" (прокрутка к элементу с id="section-2")
• Email: href="mailto:email@example.com"
• Телефон: href="tel:+79001234567"

**target="_blank"** открывает в новой вкладке. Всегда добавляй rel="noopener noreferrer" — это безопасность: без него открытая вкладка может управлять родительской через window.opener.

**Изображения <img>:**
• src — путь к файлу
• alt — альтернативный текст для читалок и когда картинка не загрузилась
• width, height — размеры в пикселях (резервируют место и предотвращают «прыжки» при загрузке)
• loading="lazy" — ленивая загрузка: изображение загружается только когда попадает в viewport

**Форматы:** JPEG — фото, PNG — с прозрачностью, WebP — современный универсальный, SVG — иконки и векторная графика.`,
    html: `<h2>Ссылки</h2>
<a href="https://google.com" target="_blank" rel="noopener noreferrer">
  Открыть в новой вкладке
</a>
<br>
<a href="#section2">Перейти к разделу 2</a>
<br>
<a href="mailto:test@example.com">Написать письмо</a>
<br>
<a href="tel:+79001234567">+7 900 123-45-67</a>

<h2 id="section2">Изображения</h2>
<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMTUwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzYzNjZmMSIgcng9IjQiLz48cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIxODAiIGhlaWdodD0iMTQiIHJ4PSI3IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iLjQiLz48cmVjdCB4PSIyMCIgeT0iNDQiIHdpZHRoPSIxMjAiIGhlaWdodD0iMTAiIHJ4PSI1IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iLjI1Ii8+PGNpcmNsZSBjeD0iMjU4IiBjeT0iNzUiIHI9IjQwIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iLjEiLz48L3N2Zz4="
     alt="Пример изображения 300x150"
     width="300" height="150"
     loading="lazy">

<figure>
  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzIyYzU1ZSIgcng9IjQiLz48cmVjdCB4PSIxNCIgeT0iMTUiIHdpZHRoPSIxMTAiIGhlaWdodD0iMTIiIHJ4PSI2IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iLjQiLz48cmVjdCB4PSIxNCIgeT0iMzYiIHdpZHRoPSI3MCIgaGVpZ2h0PSI5IiByeD0iNCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9Ii4yNSIvPjwvc3ZnPg=="
       alt="Изображение с подписью" width="200" height="100">
  <figcaption>Подпись к изображению через figcaption</figcaption>
</figure>`,
    css: `body { font-family: system-ui; max-width: 600px; margin: 1rem auto; padding: 1rem; background:#1a1d23; color:#e8eaed; }
a { color: #6366f1; text-decoration: none; }
a:hover { text-decoration: underline; }
img { border-radius: 8px; display: block; margin: 0.5rem 0; }
figcaption { font-size: 0.85em; color: #9aa0aa; margin-top: 0.25rem; }
figure { display: inline-block; }`,
    js: ``,
    tips: [
      "Всегда заполняй alt у img: 'alt=\"\"' для декоративных изображений, описание — для смысловых",
      "target='_blank' без rel='noopener noreferrer' — уязвимость безопасности",
      "Указывай width и height у img — браузер резервирует место и страница не 'прыгает' при загрузке",
      "Используй loading='lazy' для всех img ниже первого экрана — экономит трафик",
    ],
  },
  {
    id: "html-lists",
    category: "html",
    level: "beginner",
    title: "Списки: ul, ol, dl",
    body: `В HTML три вида списков — каждый для своего случая.

**<ul> — ненумерованный список (Unordered List):** Пункты без порядка, со «буллетами» (•). Используй когда порядок не важен: список продуктов, набор функций, навигационное меню.

**<ol> — нумерованный список (Ordered List):** Пункты с числами. Используй когда порядок важен: шаги инструкции, рейтинг, рецепт. Атрибуты: start (начало нумерации), reversed (обратный порядок), type (тип маркера: 1, A, a, I, i).

**<dl> — список определений (Description List):** Пары «термин → определение». Идеален для глоссариев, FAQ, метаданных.

**Вложенность:** Списки можно вкладывать друг в друга — любой <li> может содержать новый <ul> или <ol>.

Семантически важно использовать правильный тип: навигационное меню — <nav><ul>, шаги алгоритма — <ol>, глоссарий — <dl>.`,
    html: `<h3>Ненумерованный список</h3>
<ul>
  <li>Python</li>
  <li>JavaScript
    <ul>
      <li>React</li>
      <li>Vue.js</li>
    </ul>
  </li>
  <li>TypeScript</li>
</ul>

<h3>Нумерованный список</h3>
<ol>
  <li>Установи Node.js</li>
  <li>Создай проект: <code>npm init</code></li>
  <li>Установи зависимости</li>
  <li>Запусти сервер</li>
</ol>

<h3>Список определений</h3>
<dl>
  <dt>HTML</dt>
  <dd>Язык разметки гипертекста</dd>
  <dt>CSS</dt>
  <dd>Каскадные таблицы стилей</dd>
  <dt>API</dt>
  <dd>Программный интерфейс приложения</dd>
</dl>`,
    css: `body { font-family: system-ui; max-width: 500px; margin: 1rem auto; padding: 1rem; background:#1a1d23; color:#e8eaed; }
ul { list-style: disc; }
ul ul { list-style: circle; margin-top: 0.3rem; }
ol { list-style: decimal; }
li { margin: 0.3rem 0; line-height: 1.5; }
code { background: #2a2d36; padding: 0.1em 0.4em; border-radius: 4px; }
dt { font-weight: bold; color: #6366f1; margin-top: 0.8rem; }
dd { margin-left: 1.5rem; color: #9aa0aa; }`,
    js: ``,
    tips: [
      "Для навигации используй <nav><ul><li><a>...</a></li></ul></nav> — это семантически правильно",
      "CSS позволяет полностью стилизовать списки: list-style: none убирает маркеры",
      "ol с type='A' даёт нумерацию A, B, C... Полезно для юридических документов",
      "dl идеален для ключ-значение данных: адрес, характеристики товара, FAQ",
    ],
  },
  {
    id: "html-tables",
    category: "html",
    level: "beginner",
    title: "Таблицы: thead, tbody, th, td",
    body: `Таблицы предназначены для табличных данных (расписания, прайс-листы, сравнение). Никогда не используй таблицы для вёрстки — для этого есть CSS Flexbox и Grid.

**Структура таблицы:**
• <table> — контейнер
• <thead> — шапка (заголовки колонок)
• <tbody> — тело (данные)
• <tfoot> — подвал (итоги)
• <tr> — строка (table row)
• <th> — ячейка заголовка (жирная, по центру, семантика колонки)
• <td> — ячейка данных

**Объединение ячеек:**
• colspan="N" — ячейка занимает N колонок по горизонтали
• rowspan="N" — ячейка занимает N строк по вертикали

**Атрибут scope у <th>:** scope="col" или scope="row" помогает читалкам для слепых понять что заголовок относится к колонке или строке.

**<caption>** — подпись таблицы, важна для accessibility. Ставится сразу после <table>.`,
    html: `<table>
  <caption>Сравнение языков программирования</caption>
  <thead>
    <tr>
      <th scope="col">Язык</th>
      <th scope="col">Тип</th>
      <th scope="col">Сложность</th>
      <th scope="col">Применение</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Python</td>
      <td>Динамический</td>
      <td>⭐⭐</td>
      <td>Data Science, Web, AI</td>
    </tr>
    <tr>
      <td>JavaScript</td>
      <td>Динамический</td>
      <td>⭐⭐⭐</td>
      <td>Web Front/Back, Mobile</td>
    </tr>
    <tr>
      <td>Rust</td>
      <td>Статический</td>
      <td>⭐⭐⭐⭐⭐</td>
      <td>Системное ПО, WebAssembly</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="4">Оценка сложности субъективна для новичков</td>
    </tr>
  </tfoot>
</table>`,
    css: `body { font-family: system-ui; max-width: 700px; margin: 1rem auto; padding: 1rem; background:#1a1d23; color:#e8eaed; }
table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
caption { font-weight: bold; margin-bottom: 0.5rem; color: #6366f1; }
th { background: #2a2d36; color: #e8eaed; padding: 0.7rem 1rem; text-align: left; }
td { padding: 0.6rem 1rem; border-bottom: 1px solid #2a2d36; }
tr:hover td { background: #1e2128; }
tfoot td { color: #9aa0aa; font-size: 0.85em; font-style: italic; border-top: 2px solid #2a2d36; }`,
    js: ``,
    tips: [
      "border-collapse: collapse убирает двойные границы между ячейками",
      "Никогда не используй table для вёрстки! Только для реальных табличных данных",
      "colspan и rowspan помогают объединять ячейки для сложных таблиц",
      "thead/tbody/tfoot позволяют браузеру прокручивать только tbody когда таблица очень длинная",
    ],
  },
  {
    id: "html-forms-basics",
    category: "html",
    level: "beginner",
    title: "Формы: <form>, <input> и типы полей",
    body: `Формы — основной способ получить данные от пользователя. <form> — контейнер, внутри которого живут поля ввода.

**Атрибуты <form>:**
• action — URL куда отправятся данные (на сервер)
• method="GET" — данные в URL строке (для поиска, фильтров)
• method="POST" — данные в теле запроса (для логина, регистрации)

**<input type="...">** — самый универсальный элемент ввода:
• text — обычная строка
• email — с валидацией email
• password — скрытый ввод
• number — только числа
• tel — телефон (на мобильных открывает цифровую клавиатуру)
• date — выбор даты
• checkbox — флажок (да/нет)
• radio — переключатель (выбор одного из нескольких)
• range — ползунок
• file — загрузка файла
• submit — кнопка отправки
• hidden — скрытое поле

**<label>** связывает подпись с полем. Атрибут for должен совпадать с id поля. Это увеличивает область клика и помогает читалкам.

**placeholder** — текст-подсказка внутри поля (не замена label!).`,
    html: `<form action="#" method="POST">
  <div class="field">
    <label for="name">Имя *</label>
    <input type="text" id="name" name="name" placeholder="Иван Иванов" required>
  </div>
  <div class="field">
    <label for="email">Email *</label>
    <input type="email" id="email" name="email" placeholder="user@example.com" required>
  </div>
  <div class="field">
    <label for="age">Возраст</label>
    <input type="number" id="age" name="age" min="0" max="120" value="18">
  </div>
  <div class="field">
    <label for="range">Уровень (1-10): <span id="range-val">5</span></label>
    <input type="range" id="range" name="level" min="1" max="10" value="5">
  </div>
  <div class="field">
    <label><input type="checkbox" name="agree" required> Согласен с условиями</label>
  </div>
  <button type="submit">Отправить</button>
</form>`,
    css: `body { font-family: system-ui; max-width: 400px; margin: 1rem auto; padding: 1rem; background:#1a1d23; color:#e8eaed; }
.field { margin-bottom: 1rem; }
label { display: block; margin-bottom: 0.3rem; font-size: 0.9rem; color: #9aa0aa; }
input[type="text"], input[type="email"], input[type="number"] {
  width: 100%; padding: 0.5rem 0.7rem; border: 1px solid #3a3d46;
  border-radius: 6px; background: #2a2d36; color: #e8eaed; font-size: 1rem;
}
input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,0.3); }
input[type="range"] { width: 100%; cursor: pointer; accent-color: #6366f1; }
button { width: 100%; padding: 0.6rem; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; }
button:hover { background: #4f46e5; }`,
    js: `const range = document.getElementById('range');
const val = document.getElementById('range-val');
range.addEventListener('input', () => val.textContent = range.value);

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  console.log('Форма отправлена:');
  for (const [key, value] of data) console.log(' ' + key + ':', value);
});`,
    tips: [
      "Всегда связывай label с input через id/for — это увеличивает кликабельную область",
      "required, minlength, maxlength, pattern — HTML5 валидация без JavaScript",
      "placeholder — это подсказка, НЕ замена label. Без label форма не доступна",
      "type='email' и type='tel' на мобильных открывают правильную клавиатуру",
    ],
  },
  {
    id: "html-semantic",
    category: "html",
    level: "intermediate",
    title: "Семантические теги HTML5",
    body: `Семантические теги описывают смысл контента, а не только его внешний вид. Это важно для SEO, accessibility и читаемости кода.

**Структурные теги:**
• <header> — шапка страницы или секции (логотип, навигация, заголовок)
• <nav> — блок навигации (меню, хлебные крошки)
• <main> — основной контент страницы (один на страницу!)
• <aside> — боковая колонка, связанная с основным контентом
• <footer> — подвал страницы или секции
• <section> — тематический раздел с заголовком
• <article> — самодостаточный независимый контент (пост, новость, комментарий)

**Разница section vs article:** Article может быть вырван из контекста и останется понятным (блог-пост). Section — это просто тематическая группировка внутри страницы.

**Другие семантические теги:**
• <time datetime="2024-01-15"> — дата/время (машиночитаемый формат в datetime)
• <address> — контактная информация автора или организации
• <blockquote cite="url"> — длинная цитата
• <figure> + <figcaption> — медиаконтент с подписью
• <details> + <summary> — раскрываемый блок (аккордеон без JS!)`,
    html: `<header>
  <nav>
    <a href="/">Главная</a>
    <a href="/blog">Блог</a>
    <a href="/about">О нас</a>
  </nav>
</header>

<main>
  <article>
    <h1>Как стать разработчиком</h1>
    <time datetime="2024-01-15">15 января 2024</time>
    <p>Путь к профессии начинается с базовых знаний.</p>

    <figure>
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzYzNjZmMSIgcng9IjQiLz48cmVjdCB4PSIyNCIgeT0iMjgiIHdpZHRoPSIyMjAiIGhlaWdodD0iMTYiIHJ4PSI4IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iLjQiLz48cmVjdCB4PSIyNCIgeT0iNTQiIHdpZHRoPSIxNTAiIGhlaWdodD0iMTIiIHJ4PSI2IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iLjI1Ii8+PGNpcmNsZSBjeD0iMzIwIiBjeT0iMTAwIiByPSI2MCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9Ii4xIi8+PC9zdmc+"
           alt="Разработчик за работой" width="400" height="200">
      <figcaption>Разработчик за работой</figcaption>
    </figure>

    <blockquote cite="https://example.com">
      Лучший способ учиться — практика каждый день.
    </blockquote>

    <details>
      <summary>Что нужно изучить первым?</summary>
      <p>Начни с HTML и CSS, затем JavaScript.</p>
    </details>
  </article>

  <aside>
    <h3>Рекомендуемые статьи</h3>
    <ul>
      <li><a href="#">JavaScript за 30 дней</a></li>
      <li><a href="#">CSS Grid туториал</a></li>
    </ul>
  </aside>
</main>

<footer>
  <address>
    Связаться: <a href="mailto:info@example.com">info@example.com</a>
  </address>
</footer>`,
    css: `body { font-family: system-ui; margin: 0; background:#1a1d23; color:#e8eaed; }
header { background: #2a2d36; padding: 1rem 2rem; }
nav a { margin-right: 1rem; color: #6366f1; text-decoration: none; }
nav a:hover { text-decoration: underline; }
main { display: flex; gap: 2rem; max-width: 800px; margin: 1.5rem auto; padding: 0 1rem; }
article { flex: 1; }
aside { width: 200px; background: #2a2d36; padding: 1rem; border-radius: 8px; height: fit-content; }
aside h3 { margin-top: 0; color: #a855f7; font-size: 0.9rem; }
aside ul { padding-left: 1rem; }
aside li { margin: 0.4rem 0; font-size: 0.9rem; }
aside a { color: #6366f1; }
time { font-size: 0.85rem; color: #9aa0aa; }
figure { margin: 1rem 0; }
figcaption { font-size: 0.85rem; color: #9aa0aa; margin-top: 0.3rem; }
blockquote { border-left: 3px solid #6366f1; margin-left: 0; padding-left: 1rem; color: #9aa0aa; font-style: italic; }
details { background: #2a2d36; padding: 0.5rem 1rem; border-radius: 6px; margin-top: 1rem; }
summary { cursor: pointer; font-weight: bold; color: #6366f1; }
footer { background: #2a2d36; padding: 1rem 2rem; margin-top: 2rem; }
address { font-style: normal; color: #9aa0aa; font-size: 0.9rem; }`,
    js: ``,
    tips: [
      "<main> должен быть один на странице, <header> и <footer> могут быть у каждой <section>/<article>",
      "details/summary — встроенный аккордеон без JavaScript. Добавь атрибут open чтобы раскрыть по умолчанию",
      "<article> должен иметь смысл если его вырезать из страницы и показать отдельно",
      "Поисковые системы (Google) активно используют семантические теги для понимания структуры страницы",
    ],
  },
  {
    id: "html-meta",
    category: "html",
    level: "intermediate",
    title: "Мета-теги: SEO, Open Graph, viewport",
    body: `Мета-теги находятся в <head> и невидимы пользователю, но критически важны для SEO и соцсетей.

**Обязательные мета-теги:**
• charset — кодировка (всегда UTF-8)
• viewport — адаптивность для мобильных
• description — описание для поисковиков (150-160 символов)
• title — заголовок вкладки и в результатах поиска

**Open Graph (og:)** — протокол Facebook/Meta для красивого предпросмотра при шаринге в соцсетях:
• og:title — заголовок при шаринге
• og:description — описание при шаринге
• og:image — картинка предпросмотра (минимум 1200×630px)
• og:url — канонический URL страницы
• og:type — тип (website, article, video)

**Twitter Cards** — аналог для Twitter/X, похожий синтаксис.

**robots** — инструкции для поисковых роботов:
• index/noindex — индексировать ли страницу
• follow/nofollow — следовать ли по ссылкам

**canonical** — указывает основную версию страницы (важно для дублированного контента).`,
    html: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO -->
  <title>Изучение HTML | Code Mentor</title>
  <meta name="description" content="Полный курс HTML от основ до продвинутых тем. Практические задания и примеры кода.">
  <meta name="keywords" content="HTML, обучение, курс, веб-разработка">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://example.com/html-course">

  <!-- Open Graph для соцсетей -->
  <meta property="og:title" content="Изучение HTML | Code Mentor">
  <meta property="og:description" content="Полный курс HTML от основ до продвинутых тем.">
  <meta property="og:image" content="https://example.com/preview.jpg">
  <meta property="og:url" content="https://example.com/html-course">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ru_RU">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Изучение HTML | Code Mentor">
  <meta name="twitter:description" content="Полный курс HTML.">

  <!-- PWA -->
  <meta name="theme-color" content="#6366f1">
  <link rel="manifest" href="/manifest.json">
</head>
<body>
  <h1>Страница с правильными мета-тегами</h1>
  <p>Открой DevTools → Elements → &lt;head&gt; чтобы посмотреть мета-теги</p>
</body>
</html>`,
    css: `body { font-family: system-ui; max-width: 600px; margin: 2rem auto; padding: 1rem; background:#1a1d23; color:#e8eaed; }
h1 { color: #6366f1; }`,
    js: `// Читаем мета-теги через JavaScript
const metas = document.querySelectorAll('meta');
console.log('Мета-теги на странице:');
metas.forEach(m => {
  const name = m.getAttribute('name') || m.getAttribute('property');
  const content = m.getAttribute('content') || m.getAttribute('charset');
  if (name) console.log(' ' + name + ': ' + content);
});`,
    tips: [
      "description должна быть 150-160 символов — это ограничение сниппета в поиске Google",
      "og:image минимум 1200×630px для красивого отображения при шаринге в Facebook и Telegram",
      "Используй Lighthouse в Chrome DevTools для аудита SEO мета-тегов",
      "canonical важен когда одна страница доступна по нескольким URL (с/без www, с/без слеша)",
    ],
  },
  // ─────────────────── CSS ───────────────────
  {
    id: "css-intro",
    category: "css",
    level: "beginner",
    title: "Основы CSS: подключение и синтаксис",
    body: `CSS (Cascading Style Sheets) — язык стилей для HTML. Он описывает как элементы должны выглядеть.

**Синтаксис правила CSS:**
\`\`\`
селектор {
  свойство: значение;
  свойство2: значение2;
}
\`\`\`

**Три способа добавить CSS:**
1. **Внешний файл** (рекомендуется): <link rel="stylesheet" href="style.css"> в <head>
2. **Тег <style>** в <head>: <style>p { color: red; }</style>
3. **Атрибут style** (инлайн, избегай!): <p style="color: red;">

**Почему инлайн-стили плохи?**
• Смешивают структуру (HTML) и оформление (CSS)
• Их нельзя переопределить из внешнего CSS (они имеют наивысший приоритет)
• Невозможно использовать псевдоклассы (:hover и т.д.)
• Тяжело поддерживать

**Комментарии в CSS:** /* это комментарий */

**Единицы измерения:**
• px — пиксели (абсолютные)
• em — относительно размера шрифта родителя
• rem — относительно размера шрифта корневого элемента
• % — процент от родителя
• vw / vh — процент от ширины/высоты окна`,
    html: `<h1>Заголовок</h1>
<p class="intro">Вводный параграф</p>
<p>Обычный параграф</p>
<p id="special">Особый параграф</p>
<div class="box">Блок с рамкой</div>`,
    css: `/* Глобальные стили */
body {
  font-family: system-ui, sans-serif;
  max-width: 500px;
  margin: 1rem auto;
  padding: 1rem;
  background: #1a1d23;
  color: #e8eaed;
  line-height: 1.6;
}

/* Стиль по тегу */
h1 {
  color: #6366f1;
  font-size: 2rem;
}

/* Стиль по классу */
.intro {
  font-size: 1.1rem;
  color: #a855f7;
  font-weight: 500;
}

/* Стиль по ID */
#special {
  background: #2a2d36;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border-left: 3px solid #22c55e;
}

/* Стиль по тегу */
.box {
  margin-top: 1rem;
  padding: 1rem;
  border: 2px dashed #6366f1;
  border-radius: 8px;
  text-align: center;
}`,
    js: ``,
    tips: [
      "Всегда используй внешние CSS файлы — разделяй структуру (HTML) и оформление (CSS)",
      "rem лучше em для размеров шрифтов: rem всегда относительно корня, em — относительно родителя (может накапливаться)",
      "Не злоупотребляй ID в CSS — ID слишком специфичны. Классы предпочтительнее",
      "Комментируй сложные правила: /* Прячем скроллбар, но оставляем прокрутку */",
    ],
  },
  {
    id: "css-selectors",
    category: "css",
    level: "beginner",
    title: "CSS-селекторы: класс, ID, атрибуты, комбинаторы",
    body: `Селекторы определяют к каким HTML-элементам применяется CSS-правило.

**Основные селекторы:**
• \`*\` — все элементы
• \`div\` — все элементы div
• \`.class\` — элементы с классом
• \`#id\` — элемент с ID
• \`[attr]\` — элементы с атрибутом
• \`[attr="val"]\` — атрибут равен значению
• \`[attr^="val"]\` — атрибут начинается с val
• \`[attr$="val"]\` — атрибут заканчивается на val
• \`[attr*="val"]\` — атрибут содержит val

**Комбинаторы (отношения между элементами):**
• \`A B\` — B внутри A (любой уровень вложенности)
• \`A > B\` — B прямой дочерний элемент A
• \`A + B\` — B стоит сразу после A (сосед)
• \`A ~ B\` — все B стоящие после A (братья)

**Группировка:** несколько селекторов через запятую — применяется к каждому:
\`h1, h2, h3 { color: blue; }\`

**Специфичность (приоритет):** ID > класс > тег. Если конфликт — побеждает более специфичное правило.`,
    html: `<nav class="menu">
  <a href="/" class="active">Главная</a>
  <a href="/blog">Блог</a>
  <a href="/about">О нас</a>
</nav>

<div class="card">
  <h2 class="card-title">Карточка 1</h2>
  <p class="card-body">Текст карточки</p>
  <a href="#" class="btn btn-primary">Подробнее</a>
</div>

<input type="text" placeholder="Имя">
<input type="email" placeholder="Email">
<input type="submit" value="Отправить">

<p>Параграф <em>с</em> выделением</p>
<p>Ещё один параграф</p>`,
    css: `body { font-family: system-ui; max-width: 500px; margin: 1rem auto; padding: 1rem; background:#1a1d23; color:#e8eaed; }

/* Тег + класс */
.menu a { text-decoration: none; margin-right: 1rem; color: #9aa0aa; }
.menu a.active { color: #6366f1; font-weight: bold; }
.menu a:hover { color: #e8eaed; }

/* Карточка */
.card { background: #2a2d36; padding: 1.2rem; border-radius: 10px; margin: 1rem 0; }
.card-title { margin: 0 0 0.5rem; color: #a855f7; }
.card-body { margin: 0 0 1rem; color: #9aa0aa; }

/* Комбинаторы */
.card > .btn { display: inline-block; }

/* Атрибутные селекторы */
input[type="text"], input[type="email"] {
  display: block; width: 100%; margin: 0.5rem 0;
  padding: 0.5rem 0.7rem; background: #2a2d36; border: 1px solid #3a3d46;
  border-radius: 6px; color: #e8eaed;
}
input[type="submit"] {
  padding: 0.5rem 1.2rem; background: #6366f1; color: white;
  border: none; border-radius: 6px; cursor: pointer;
}

/* Братья ~ */
p ~ p { color: #9aa0aa; }

/* Кнопки */
.btn { padding: 0.4rem 0.9rem; border-radius: 6px; text-decoration: none; font-size: 0.9rem; }
.btn-primary { background: #6366f1; color: white; }`,
    js: ``,
    tips: [
      "Не используй ID для стилей — классы гибче и не создают проблем специфичности",
      "[attr^='https'] выбирает все ссылки на внешние сайты — удобно для добавления иконки",
      "Оператор > полезен когда нужно стилизовать только прямые потомки, не затрагивая вложенные",
      "Специфичность: 0-0-1 для тегов, 0-1-0 для классов, 1-0-0 для ID. Считай по разрядам",
    ],
  },
  {
    id: "css-pseudo",
    category: "css",
    level: "beginner",
    title: "Псевдоклассы и псевдоэлементы",
    body: `**Псевдоклассы** — состояния или положение элементов в дереве. Записываются через двоеточие :

**Интерактивные:**
• :hover — мышь над элементом
• :focus — элемент в фокусе (поле ввода)
• :active — в момент клика
• :visited — посещённая ссылка

**Структурные:**
• :first-child — первый дочерний элемент
• :last-child — последний дочерний
• :nth-child(n) — каждый n-й элемент. Примеры: (2), (even), (odd), (3n+1)
• :not(selector) — элементы НЕ соответствующие селектору
• :empty — пустые элементы

**Для форм:**
• :required — обязательные поля
• :valid / :invalid — прошедшие/не прошедшие валидацию
• :disabled / :checked

**Псевдоэлементы** — создают «виртуальные» части элементов. Записываются через ::

• ::before — вставить контент перед элементом
• ::after — вставить контент после элемента
• ::first-line — первая строка текста
• ::first-letter — первая буква
• ::placeholder — стиль placeholder в input
• ::selection — стиль выделенного текста`,
    html: `<ul class="list">
  <li>Первый элемент</li>
  <li>Второй элемент</li>
  <li>Третий элемент</li>
  <li>Четвёртый</li>
  <li>Пятый (последний)</li>
</ul>

<div class="card-demo">Наведи на меня</div>

<input type="text" class="fancy-input" placeholder="Наведи и введи текст">

<p class="dropcap">Давным-давно, в далёкой-далёкой галактике... жил-был веб-разработчик
который любил CSS псевдоэлементы.</p>

<a href="#" class="btn-link">Ссылка с иконкой →</a>`,
    css: `body { font-family: system-ui; max-width: 500px; margin: 1rem auto; padding: 1rem; background:#1a1d23; color:#e8eaed; }

/* :nth-child полосатая таблица */
.list { padding: 0; }
.list li { list-style: none; padding: 0.5rem 0.8rem; border-radius: 4px; }
.list li:nth-child(even) { background: #2a2d36; }
.list li:first-child { color: #6366f1; font-weight: bold; }
.list li:last-child { color: #22c55e; }
.list li:hover { background: #3a3d46; cursor: pointer; }
.list li:not(:last-child) { border-bottom: 1px solid #2a2d36; }

/* :hover и ::before */
.card-demo {
  margin: 1rem 0;
  padding: 1rem;
  background: #2a2d36;
  border-radius: 8px;
  text-align: center;
  position: relative;
  transition: all 0.3s;
  cursor: pointer;
}
.card-demo:hover { background: #3a3d46; transform: translateY(-2px); }
.card-demo::before { content: '✨ '; }
.card-demo::after { content: ' ✨'; }

/* :focus и ::placeholder */
.fancy-input {
  width: 100%; padding: 0.5rem 0.8rem; border: 1px solid #3a3d46;
  border-radius: 6px; background: #2a2d36; color: #e8eaed;
  display: block; margin: 1rem 0;
  outline: none; transition: border-color 0.2s;
}
.fancy-input:focus { border-color: #6366f1; }
.fancy-input::placeholder { color: #5a5d66; font-style: italic; }

/* ::first-letter dropcap */
.dropcap::first-letter {
  font-size: 3em; float: left; margin-right: 0.1em;
  color: #a855f7; font-weight: bold; line-height: 0.8;
}

/* ::after для иконки */
.btn-link { color: #6366f1; text-decoration: none; }
.btn-link::after { content: ' →'; opacity: 0; transition: opacity 0.2s; }
.btn-link:hover::after { opacity: 1; }`,
    js: ``,
    tips: [
      "::before и ::after требуют content: '' — даже пустая строка обязательна",
      ":nth-child(even) и :nth-child(odd) удобны для полосатых таблиц",
      ":not() мощен для исключений: li:not(:last-child) { border-bottom: ... } — рамка у всех кроме последнего",
      "::placeholder позволяет стилизовать placeholder в input — меняй цвет и шрифт",
    ],
  },
  {
    id: "css-box-model",
    category: "css",
    level: "beginner",
    title: "Блочная модель: margin, padding, border, box-sizing",
    body: `Блочная модель (Box Model) — фундамент CSS-вёрстки. Каждый HTML-элемент — это прямоугольная коробка с четырьмя слоями.

**Структура изнутри наружу:**
1. **content** — содержимое (текст, изображение). Размер задаётся width и height
2. **padding** — внутренний отступ (между контентом и рамкой)
3. **border** — рамка вокруг padding
4. **margin** — внешний отступ (расстояние до других элементов)

**Сокращённая запись:**
\`\`\`
/* Одно значение — все стороны */
margin: 10px;
/* Два значения — верх/низ | лево/право */
padding: 10px 20px;
/* Четыре значения — по часовой стрелке: верх право низ лево */
border-width: 1px 2px 3px 4px;
\`\`\`

**box-sizing: border-box** — ОБЯЗАТЕЛЬНО ставь всегда! По умолчанию (content-box) width=300px не включает padding и border — ширина элемента реально будет 300 + padding + border. С border-box: width=300px включает всё.

**Схлопывание margin:** вертикальные margin соседних блочных элементов «схлопываются» — итоговый отступ равен БОЛЬШЕМУ из двух. Горизонтальные margin не схлопываются.`,
    html: `<div class="box-demo">
  <div class="inner">Содержимое</div>
</div>

<div class="boxes-row">
  <div class="box box-1">content-box<br>width: 150px<br>padding: 20px</div>
  <div class="box box-2">border-box<br>width: 150px<br>padding: 20px</div>
</div>

<div class="margin-demo">Блок 1 (margin-bottom: 30px)</div>
<div class="margin-demo">Блок 2 (margin-top: 20px)<br>Итого между ними: 30px (схлопывание!)</div>`,
    css: `*, *::before, *::after { box-sizing: border-box; }
body { font-family: system-ui; max-width: 600px; margin: 1rem auto; padding: 1rem; background:#1a1d23; color:#e8eaed; font-size: 0.9rem; }

.box-demo {
  background: #2a2d36;
  padding: 20px;
  border: 3px solid #6366f1;
  margin: 1rem 0;
}
.inner {
  background: #6366f1;
  color: white;
  padding: 10px;
  text-align: center;
}

.boxes-row { display: flex; gap: 1rem; margin: 1rem 0; }
.box {
  width: 150px; padding: 20px; background: #2a2d36;
  border: 3px solid #a855f7; text-align: center; line-height: 1.6;
}
.box-1 { box-sizing: content-box; }
.box-2 { box-sizing: border-box; }

.margin-demo {
  background: #2a2d36;
  padding: 0.8rem 1rem;
  border-radius: 6px;
  border-left: 3px solid #22c55e;
}
.margin-demo:first-of-type { margin-bottom: 30px; }
.margin-demo:last-of-type { margin-top: 20px; }`,
    js: `// Посмотрим реальные размеры
const box1 = document.querySelector('.box-1');
const box2 = document.querySelector('.box-2');
const r1 = box1.getBoundingClientRect();
const r2 = box2.getBoundingClientRect();
console.log('content-box реальная ширина:', r1.width + 'px (150 + 40 padding + 6 border = 196px)');
console.log('border-box реальная ширина:', r2.width + 'px (ровно 150px!)');`,
    tips: [
      "Всегда добавляй: *, *::before, *::after { box-sizing: border-box; } в начало CSS",
      "margin: auto центрирует блочный элемент по горизонтали (если задана ширина)",
      "Схлопывание margin — частая ошибка новичков. Используй flexbox/grid или padding вместо margin",
      "outline не влияет на box model — удобно для дебаггинга: outline: 1px solid red",
    ],
  },
  {
    id: "css-colors-typography",
    category: "css",
    level: "beginner",
    title: "Цвета, фоны и типографика",
    body: `**Цвета в CSS:**
• \`#rrggbb\` или \`#rgb\` — шестнадцатеричный (hex): #6366f1, #fff
• \`rgb(r, g, b)\` — красный, зелёный, синий (0-255)
• \`rgba(r, g, b, a)\` — + прозрачность (0-1)
• \`hsl(h, s%, l%)\` — тон, насыщенность, светлота (удобнее всего!)
• \`hsla(h, s%, l%, a)\` — + прозрачность
• Именованные: red, blue, transparent, white...
• currentColor — текущий цвет шрифта

**Фон:**
• background-color — цвет фона
• background-image — изображение/градиент
• linear-gradient(угол, цвет1, цвет2)
• radial-gradient(форма, цвет1, цвет2)
• background-size: cover/contain/100%
• background-position: center/left top/50% 50%
• background-repeat: no-repeat/repeat/repeat-x

**Типографика:**
• font-family: 'Inter', system-ui, sans-serif (стек из нескольких)
• font-size: 16px / 1rem / 1.2em
• font-weight: 100-900 или normal/bold
• line-height: 1.5 (безразмерное значение — лучший вариант)
• text-align: left/center/right/justify
• letter-spacing: 0.05em
• text-transform: uppercase/lowercase/capitalize
• text-decoration: none/underline/line-through`,
    html: `<div class="color-swatches">
  <div class="swatch s1">hex</div>
  <div class="swatch s2">rgb</div>
  <div class="swatch s3">hsl</div>
  <div class="swatch s4">rgba</div>
  <div class="swatch s5">gradient</div>
</div>

<div class="bg-demo">
  <p>Фон с градиентом</p>
</div>

<div class="typography-demo">
  <h2 class="t-heading">Заголовок с letter-spacing</h2>
  <p class="t-lead">Вводный текст с увеличенным line-height для комфортного чтения длинных абзацев.</p>
  <p class="t-mono"><code>font-family: monospace;</code></p>
  <p class="t-caps">Все буквы заглавные</p>
</div>`,
    css: `body { font-family: system-ui; max-width: 500px; margin: 1rem auto; padding: 1rem; background:#1a1d23; color:#e8eaed; }

.color-swatches { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
.swatch { padding: 0.5rem 1rem; border-radius: 6px; color: white; font-size: 0.8rem; }
.s1 { background: #6366f1; }
.s2 { background: rgb(168, 85, 247); }
.s3 { background: hsl(160, 84%, 39%); }
.s4 { background: rgba(239, 68, 68, 0.8); }
.s5 { background: linear-gradient(135deg, #6366f1, #a855f7); }

.bg-demo {
  background:
    linear-gradient(135deg, rgba(99,102,241,0.8), rgba(168,85,247,0.8)),
    url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iODAiPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iODAiIGZpbGw9IiM2MzY2ZjEiIHJ4PSI0Ii8+PC9zdmc+");
  background-size: cover;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.t-heading { letter-spacing: 0.1em; text-transform: uppercase; font-size: 1.2rem; color: #6366f1; margin: 0 0 0.5rem; }
.t-lead { line-height: 1.8; color: #9aa0aa; font-size: 1.05rem; margin: 0 0 0.5rem; }
.t-mono { font-family: 'Courier New', monospace; background: #2a2d36; padding: 0.3rem 0.7rem; border-radius: 4px; }
.t-caps { text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.85rem; color: #a855f7; }`,
    js: ``,
    tips: [
      "HSL удобнее всего для работы с цветом: легко менять яркость не трогая тон — hsl(250, 90%, 60%) → hsl(250, 90%, 40%)",
      "line-height без единиц измерения (1.5 а не 1.5em) наследуется правильно — всегда используй безразмерное значение",
      "Стек шрифтов: 'Inter', system-ui, -apple-system, sans-serif — если Inter не загрузился, используется системный",
      "currentColor очень удобен: border: 1px solid currentColor наследует цвет текста",
    ],
  },
  {
    id: "css-flexbox",
    category: "css",
    level: "intermediate",
    title: "Flexbox: выравнивание и раскладка",
    body: `Flexbox — одномерная система раскладки. Идеальна для строк элементов (навбар, карточки, кнопки).

**Контейнер (display: flex):**
• flex-direction: row (по умолчанию) | column | row-reverse | column-reverse
• justify-content: выравнивание по главной оси
  - flex-start | flex-end | center | space-between | space-around | space-evenly
• align-items: выравнивание по поперечной оси
  - flex-start | flex-end | center | stretch (по умолчанию) | baseline
• flex-wrap: nowrap | wrap | wrap-reverse
• gap: 1rem (отступы между элементами, лучше чем margin)
• align-content: выравнивание строк при wrap (как justify-content но для строк)

**Элементы внутри flex-контейнера:**
• flex-grow: N — насколько растягивается относительно других (0 = не растягивается)
• flex-shrink: N — насколько сжимается (0 = не сжимается)
• flex-basis: 200px — исходный размер до grow/shrink
• flex: 1 === flex: 1 1 0 (краткая запись grow shrink basis)
• align-self: auto | flex-start | flex-end | center | stretch
• order: N — порядок отображения (по умолчанию 0)

**Центрирование по обоим осям:**
\`display: flex; justify-content: center; align-items: center;\``,
    html: `<div class="flex-demo">
  <h3>justify-content: space-between</h3>
  <div class="flex-row space-between">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
  </div>

  <h3>justify-content: center + gap</h3>
  <div class="flex-row jc-center">
    <div class="item">A</div>
    <div class="item">B</div>
    <div class="item">C</div>
  </div>

  <h3>Карточки с flex: 1</h3>
  <div class="flex-cards">
    <div class="card-item">Карточка 1 с длинным текстом</div>
    <div class="card-item">Карточка 2</div>
    <div class="card-item">Карточка 3 тоже</div>
  </div>

  <h3>Навбар с flex</h3>
  <nav class="navbar">
    <div class="logo">🚀 Logo</div>
    <ul class="nav-links">
      <li><a href="#">Главная</a></li>
      <li><a href="#">О нас</a></li>
    </ul>
    <button class="nav-btn">Войти</button>
  </nav>

  <h3>Центрирование</h3>
  <div class="center-box">Я в центре!</div>
</div>`,
    css: `body { font-family: system-ui; background:#1a1d23; color:#e8eaed; padding: 1rem; }
.flex-demo h3 { font-size: 0.85rem; color: #9aa0aa; margin: 1.2rem 0 0.5rem; letter-spacing: 0.05em; }

.flex-row { display: flex; background: #2a2d36; padding: 0.5rem; border-radius: 8px; }
.space-between { justify-content: space-between; }
.jc-center { justify-content: center; gap: 1rem; }
.item { background: #6366f1; color: white; padding: 0.5rem 1rem; border-radius: 6px; }

.flex-cards { display: flex; gap: 0.8rem; flex-wrap: wrap; }
.card-item { flex: 1; min-width: 100px; background: #2a2d36; padding: 0.8rem; border-radius: 8px; }

.navbar {
  display: flex; align-items: center; justify-content: space-between;
  background: #2a2d36; padding: 0.7rem 1rem; border-radius: 8px;
}
.logo { font-weight: bold; color: #6366f1; }
.nav-links { display: flex; gap: 1rem; list-style: none; margin: 0; padding: 0; }
.nav-links a { color: #9aa0aa; text-decoration: none; }
.nav-links a:hover { color: #e8eaed; }
.nav-btn { padding: 0.3rem 0.8rem; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; }

.center-box {
  height: 80px; background: #2a2d36; border-radius: 8px;
  display: flex; justify-content: center; align-items: center;
  color: #6366f1; font-weight: bold;
}`,
    js: ``,
    tips: [
      "gap в flex — самый чистый способ задать отступы между элементами, лучше margin у дочерних",
      "flex: 1 делает все элементы одинаковой ширины — идеально для равных колонок",
      "flex-wrap: wrap + flex-basis: 250px = адаптивная сетка без медиазапросов!",
      "align-items: baseline выравнивает элементы по базовой линии текста — полезно для навбара с разным размером шрифта",
    ],
  },
  {
    id: "css-grid",
    category: "css",
    level: "intermediate",
    title: "CSS Grid: двумерная сетка",
    body: `CSS Grid — двумерная система раскладки. Работает одновременно по горизонтали И вертикали. Лучший инструмент для страниц и сложных раскладок.

**Контейнер (display: grid):**
• grid-template-columns — определяет колонки: 200px 1fr 2fr
  - fr (fraction) — доля свободного места
  - repeat(3, 1fr) — три равные колонки
  - repeat(auto-fill, minmax(200px, 1fr)) — автоадаптивные колонки
  - minmax(min, max) — ограничение размера
• grid-template-rows — аналогично для строк
• gap — отступы между ячейками (row-gap и column-gap)
• grid-template-areas — именованные области

**Размещение элементов:**
• grid-column: 1 / 3 — с первой по третью линию
• grid-column: 1 / -1 — от начала до конца (все колонки)
• grid-row: 1 / 3
• grid-area: header — если задан template-areas

**auto-fill vs auto-fit:** auto-fill создаёт пустые колонки, auto-fit схлопывает их — auto-fit + minmax обычно лучший выбор.`,
    html: `<div class="page-grid">
  <header class="g-header">Header</header>
  <nav class="g-nav">Nav</nav>
  <main class="g-main">
    <h2>Основной контент</h2>
    <p>Здесь живёт главный контент страницы.</p>
  </main>
  <aside class="g-aside">Sidebar</aside>
  <footer class="g-footer">Footer</footer>
</div>

<h3 style="color:#9aa0aa;font-size:.85rem;margin-top:1.5rem">Адаптивная сетка карточек</h3>
<div class="card-grid">
  <div class="g-card">Карточка 1</div>
  <div class="g-card">Карточка 2</div>
  <div class="g-card">Карточка 3</div>
  <div class="g-card">Карточка 4</div>
  <div class="g-card">Карточка 5</div>
  <div class="g-card">Карточка 6</div>
</div>`,
    css: `body { font-family: system-ui; background:#1a1d23; color:#e8eaed; padding: 1rem; }

.page-grid {
  display: grid;
  grid-template-columns: 150px 1fr 150px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer";
  gap: 8px;
  height: 250px;
}

.g-header { grid-area: header; background: #6366f1; }
.g-nav { grid-area: nav; background: #a855f7; }
.g-main { grid-area: main; background: #2a2d36; }
.g-aside { grid-area: aside; background: #22c55e; }
.g-footer { grid-area: footer; background: #f59e0b; }

.g-header, .g-nav, .g-main, .g-aside, .g-footer {
  padding: 0.7rem 1rem; border-radius: 6px; color: white;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold;
}
.g-main { color: #e8eaed; align-items: flex-start; justify-content: flex-start; flex-direction: column; }

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}
.g-card {
  background: #2a2d36;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #3a3d46;
  transition: border-color 0.2s;
}
.g-card:hover { border-color: #6366f1; }`,
    js: ``,
    tips: [
      "repeat(auto-fit, minmax(250px, 1fr)) — одно правило создаёт адаптивную сетку без медиазапросов",
      "grid-template-areas делает раскладку страницы читаемой как ASCII-арт — отличная документация",
      "grid-column: 1 / -1 растягивает элемент на все колонки (баннер, футер)",
      "Flexbox для компонентов (кнопки в строку, список навигации), Grid для страниц и раскладки",
    ],
  },
  {
    id: "css-positioning",
    category: "css",
    level: "intermediate",
    title: "Позиционирование: static, relative, absolute, fixed, sticky",
    body: `**position** управляет как элемент размещается в потоке документа.

**static (по умолчанию):** Элемент в нормальном потоке. top/left/right/bottom не работают.

**relative:** Элемент остаётся в потоке, но смещается относительно своего исходного места. Создаёт контекст позиционирования для дочерних absolute-элементов.

**absolute:** Элемент вырывается из потока (другие элементы его «не видят»). Позиционируется относительно ближайшего предка с position != static. Если такого нет — относительно viewport.

**fixed:** Позиционируется относительно viewport. Остаётся на месте при прокрутке. Идеально для навбара, кнопки «вверх», чата.

**sticky:** Гибрид relative и fixed. Ведёт себя как relative пока не достигнет заданного top/bottom, затем «прилипает». Отлично для заголовков таблиц, навигации секций.

**z-index:** Управляет перекрытием позиционированных элементов (position != static). Работает только с позиционированными элементами. Выше z-index — поверх.`,
    html: `<div class="positioning-demo">
  <!-- relative + absolute -->
  <div class="parent-relative">
    <span>Родитель (relative)</span>
    <div class="badge">NEW</div>
  </div>

  <!-- fixed кнопка -->
  <button class="fixed-btn" onclick="alert('fixed!')">📌 Fixed</button>

  <!-- sticky заголовок -->
  <div class="scroll-container">
    <div class="sticky-header">🔒 Sticky заголовок</div>
    <div class="scroll-content">
      <p>Прокрути вниз →</p>
      <p>Контент 1</p><p>Контент 2</p><p>Контент 3</p>
      <p>Контент 4</p><p>Контент 5</p>
    </div>
  </div>
</div>`,
    css: `body { font-family: system-ui; max-width: 500px; margin: 1rem auto; padding: 1rem; background:#1a1d23; color:#e8eaed; }

.positioning-demo { position: relative; }

/* relative + absolute */
.parent-relative {
  position: relative;
  display: inline-block;
  background: #2a2d36;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.badge {
  position: absolute;
  top: -8px; right: -8px;
  background: #ef4444; color: white;
  font-size: 0.65rem; font-weight: bold;
  padding: 2px 6px; border-radius: 10px;
}

/* fixed */
.fixed-btn {
  position: fixed;
  bottom: 1rem; right: 1rem;
  background: #6366f1; color: white;
  border: none; border-radius: 8px;
  padding: 0.5rem 0.8rem; cursor: pointer;
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(99,102,241,0.4);
}

/* sticky */
.scroll-container {
  height: 150px; overflow-y: auto;
  border: 1px solid #3a3d46; border-radius: 8px;
}
.sticky-header {
  position: sticky; top: 0;
  background: #2a2d36; padding: 0.5rem 1rem;
  border-bottom: 1px solid #3a3d46;
  font-weight: bold; color: #6366f1;
}
.scroll-content { padding: 0.5rem 1rem; }
.scroll-content p { margin: 0.5rem 0; color: #9aa0aa; }`,
    js: ``,
    tips: [
      "Родитель с position: relative — это 'якорь' для absolute дочерних элементов",
      "z-index работает только на позиционированных элементах (не static)",
      "sticky + top: 0 — прилипающие заголовки таблиц и секций без JS",
      "Избегай position: absolute для раскладки — используй flex/grid. absolute для наложения и декора",
    ],
  },
  {
    id: "css-transitions-animations",
    category: "css",
    level: "intermediate",
    title: "Переходы (transition) и анимации (@keyframes)",
    body: `**CSS Transitions** — плавное изменение свойств при смене состояния (:hover, :focus, добавлении класса).

\`transition: свойство длительность функция задержка;\`
• свойство: color, transform, opacity, background, all (осторожно!)
• длительность: 0.3s, 300ms
• функция: ease (по умолчанию), linear, ease-in, ease-out, ease-in-out, cubic-bezier(...)
• задержка: 0s, 0.1s

**Что лучше анимировать:** transform и opacity — они анимируются на GPU без перерисовки страницы. Избегай анимации width, height, margin, padding — они вызывают layout recalculation.

**CSS Animations (@keyframes):** для сложных многошаговых анимаций.

\`\`\`css
@keyframes имя {
  from { ... } /* 0% */
  to { ... }   /* 100% */
}
/* или */
@keyframes имя {
  0% { ... }
  50% { ... }
  100% { ... }
}
\`\`\`

\`animation: имя длительность функция задержка счётчик направление fill-mode;\`
• счётчик: 1, 3, infinite
• направление: normal, reverse, alternate (туда-обратно)
• fill-mode: forwards (остаётся в конечном состоянии)`,
    html: `<div class="anim-showcase">
  <div class="hover-card">Наведи на меня!</div>

  <button class="ripple-btn" id="ripple">Волновой эффект</button>

  <div class="loader-container">
    <div class="spinner"></div>
    <div class="pulse-dot"></div>
    <div class="bounce-ball"></div>
  </div>

  <div class="slide-text">← Анимированный текст →</div>

  <button id="toggle-anim">Запустить анимацию</button>
  <div class="animated-box" id="anim-box">Кликни кнопку!</div>
</div>`,
    css: `body { font-family: system-ui; background:#1a1d23; color:#e8eaed; padding: 1rem; }
.anim-showcase { display: flex; flex-direction: column; gap: 1.5rem; max-width: 400px; margin: 0 auto; }

/* transition */
.hover-card {
  background: #2a2d36; padding: 1.5rem;
  border-radius: 10px; text-align: center; cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  border: 1px solid #3a3d46;
}
.hover-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 30px rgba(99,102,241,0.3);
  background: #2d3040;
}

/* button */
.ripple-btn {
  padding: 0.8rem 2rem; background: #6366f1; color: white;
  border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;
  transition: transform 0.15s, background 0.2s;
  align-self: flex-start;
}
.ripple-btn:active { transform: scale(0.95); background: #4f46e5; }

/* loaders */
.loader-container { display: flex; gap: 1.5rem; align-items: center; }

@keyframes spin { to { transform: rotate(360deg); } }
.spinner {
  width: 30px; height: 30px;
  border: 3px solid #3a3d46;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.7; } }
.pulse-dot {
  width: 20px; height: 20px; border-radius: 50%;
  background: #a855f7;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
.bounce-ball {
  width: 20px; height: 20px; border-radius: 50%;
  background: #22c55e;
  animation: bounce 0.8s ease-in-out infinite;
}

/* text */
@keyframes shimmer { 0% { background-position: -200px; } 100% { background-position: 200px; } }
.slide-text {
  font-weight: bold; font-size: 1.1rem;
  background: linear-gradient(90deg, #6366f1, #a855f7, #22c55e, #6366f1);
  background-size: 200px;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  animation: shimmer 2s linear infinite;
}

/* controlled animation */
.animated-box {
  padding: 1rem; background: #2a2d36; border-radius: 8px; text-align: center;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.5s;
}
.animated-box.active { transform: scale(1.1) rotate(5deg); background: #6366f1; color: white; }

button#toggle-anim { padding: 0.5rem 1rem; background: #2a2d36; color: #e8eaed; border: 1px solid #3a3d46; border-radius: 6px; cursor: pointer; }`,
    js: `document.getElementById('toggle-anim').addEventListener('click', () => {
  document.getElementById('anim-box').classList.toggle('active');
});`,
    tips: [
      "Анимируй только transform и opacity — они работают на GPU без перерисовки. Всё остальное медленнее",
      "cubic-bezier(0.34, 1.56, 0.64, 1) — пружинный эффект. Используй cubic-bezier.com для создания своих",
      "animation-fill-mode: forwards — анимация останется в конечном состоянии",
      "prefers-reduced-motion: Всегда добавляй @media (prefers-reduced-motion: reduce) для пользователей с чувствительностью к движению",
    ],
  },
  {
    id: "css-media-queries",
    category: "css",
    level: "intermediate",
    title: "Media queries: адаптивный дизайн",
    body: `Media queries позволяют применять разные стили для разных устройств и размеров экрана.

**Синтаксис:**
\`\`\`css
@media условие { ... }
\`\`\`

**Типы медиа:** screen (экран), print (печать), all (все)

**Операторы:** and, or (запятая), not

**Точки перелома (breakpoints) — популярные:**
• 480px — маленькие телефоны
• 768px — планшеты
• 1024px — ноутбуки
• 1280px — десктоп
• 1536px — широкий экран

**Mobile First подход** (рекомендуется): пишешь стили для мобильных, затем добавляешь max-width для больших экранов. Или min-width для увеличения размера.

**Mobile First:**
\`\`\`css
.container { width: 100%; } /* мобильные */
@media (min-width: 768px) { .container { max-width: 960px; } }
\`\`\`

**Desktop First (устаревший):**
\`\`\`css
.container { max-width: 1200px; } /* десктоп */
@media (max-width: 768px) { .container { width: 100%; } }
\`\`\`

**Медиа для других характеристик:**
• orientation: landscape/portrait
• prefers-color-scheme: dark/light
• prefers-reduced-motion: reduce
• hover: none/hover`,
    html: `<div class="responsive-demo">
  <header class="resp-header">
    <div class="logo">📱 Logo</div>
    <nav class="resp-nav">
      <a href="#">Главная</a>
      <a href="#">Услуги</a>
      <a href="#">Портфолио</a>
      <a href="#">Контакты</a>
    </nav>
    <button class="menu-toggle" onclick="this.textContent = this.textContent === '☰' ? '✕' : '☰'">☰</button>
  </header>

  <div class="resp-grid">
    <main class="resp-main">
      <h2>Адаптивный контент</h2>
      <p>Измени размер окна — раскладка перестроится!</p>
    </main>
    <aside class="resp-sidebar">
      Сайдбар (скрыт на мобильных)
    </aside>
  </div>

  <div class="resp-cards">
    <div class="resp-card">Карточка 1</div>
    <div class="resp-card">Карточка 2</div>
    <div class="resp-card">Карточка 3</div>
    <div class="resp-card">Карточка 4</div>
  </div>
</div>`,
    css: `/* Mobile First */
*, *::before, *::after { box-sizing: border-box; }
body { font-family: system-ui; margin: 0; background:#1a1d23; color:#e8eaed; font-size: 14px; }

/* Header */
.resp-header {
  display: flex; align-items: center; justify-content: space-between;
  background: #2a2d36; padding: 0.7rem 1rem; position: sticky; top: 0; z-index: 10;
}
.logo { font-weight: bold; color: #6366f1; }
.resp-nav { display: none; gap: 1rem; }  /* скрыт на мобильных */
.resp-nav a { color: #9aa0aa; text-decoration: none; font-size: 0.9rem; }
.menu-toggle { background: none; border: 1px solid #3a3d46; color: #e8eaed; border-radius: 4px; padding: 0.3rem 0.6rem; cursor: pointer; }

/* Layout */
.resp-grid { display: flex; flex-direction: column; padding: 1rem; gap: 1rem; }
.resp-sidebar { display: none; background: #2a2d36; padding: 1rem; border-radius: 8px; }

/* Cards — 1 колонка на мобильных */
.resp-cards { display: grid; grid-template-columns: 1fr; gap: 0.8rem; padding: 0 1rem 1rem; }
.resp-card { background: #2a2d36; padding: 1rem; border-radius: 8px; text-align: center; }

/* Планшеты: 768px+ */
@media (min-width: 768px) {
  .resp-nav { display: flex; }
  .menu-toggle { display: none; }
  .resp-grid { flex-direction: row; }
  .resp-main { flex: 1; }
  .resp-sidebar { display: block; width: 200px; }
  .resp-cards { grid-template-columns: 1fr 1fr; }
}

/* Десктоп: 1024px+ */
@media (min-width: 1024px) {
  .resp-cards { grid-template-columns: repeat(4, 1fr); }
  body { font-size: 16px; }
}

/* Тёмная тема OS */
@media (prefers-color-scheme: light) {
  body { background: #f5f5f5; color: #1a1a1a; }
}`,
    js: `// Определяем текущую точку перелома
function getBreakpoint() {
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}
console.log('Текущий breakpoint:', getBreakpoint());
window.addEventListener('resize', () => {
  console.log('Ширина:', window.innerWidth + 'px, breakpoint:', getBreakpoint());
});`,
    tips: [
      "Mobile First — лучший подход: min-width queries более производительны чем max-width",
      "Используй rem для breakpoints вместо px — адаптируется к настройкам размера шрифта пользователя",
      "@media (hover: none) — определяет тач-устройства без мыши. Полезно для hover-эффектов",
      "Tailwind CSS и Bootstrap — популярные фреймворки с готовыми breakpoints и утилитами",
    ],
  },
  {
    id: "css-variables",
    category: "css",
    level: "intermediate",
    title: "CSS-переменные (Custom Properties)",
    body: `CSS Custom Properties (переменные) позволяют хранить значения и переиспользовать их по всему CSS.

**Объявление:** двойное тире + имя: \`--primary-color: #6366f1;\`
**Использование:** \`color: var(--primary-color);\`
**Резервное значение:** \`var(--my-var, #fallback)\`

**Где объявлять:**
• :root — глобальные переменные (доступны везде)
• .component — локальные (только внутри компонента)

**Преимущества перед SASS-переменными:**
• Работают в браузере, можно менять из JavaScript
• Наследуются по DOM-дереву
• Поддерживают медиазапросы (can change based on breakpoint)
• Работают с calc()

**Динамическая тема через JS:**
\`\`\`js
document.documentElement.style.setProperty('--primary', '#ff5500');
\`\`\`

**Паттерн дизайн-системы:** объявляй все цвета, размеры, радиусы в :root — так менять тему можно в одном месте.`,
    html: `<div class="themed-app">
  <h2>Приложение с темами</h2>

  <div class="theme-switcher">
    <button class="btn-theme" onclick="setTheme('purple')">💜 Фиолетовая</button>
    <button class="btn-theme" onclick="setTheme('green')">💚 Зелёная</button>
    <button class="btn-theme" onclick="setTheme('orange')">🧡 Оранжевая</button>
  </div>

  <div class="card-themed">
    <h3>Карточка</h3>
    <p>Цвета автоматически меняются через CSS-переменные</p>
    <button class="btn-primary">Кнопка</button>
  </div>

  <div class="spacing-demo">
    <div class="box-sm">Маленький</div>
    <div class="box-md">Средний</div>
    <div class="box-lg">Большой</div>
  </div>
</div>`,
    css: `:root {
  /* Цветовая палитра */
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --primary-light: rgba(99, 102, 241, 0.15);

  /* Нейтральные */
  --bg: #1a1d23;
  --surface: #2a2d36;
  --border: #3a3d46;
  --text: #e8eaed;
  --text-muted: #9aa0aa;

  /* Размеры */
  --radius: 8px;
  --radius-lg: 12px;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;

  /* Тени */
  --shadow: 0 4px 16px rgba(0,0,0,0.3);
}

body {
  font-family: system-ui;
  background: var(--bg);
  color: var(--text);
  padding: var(--spacing-md);
}

.themed-app { max-width: 500px; margin: 0 auto; }
h2 { color: var(--primary); margin: 0 0 var(--spacing-md); }

.theme-switcher { display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-md); flex-wrap: wrap; }
.btn-theme {
  padding: 0.4rem 0.8rem; border: 1px solid var(--border);
  background: var(--surface); color: var(--text);
  border-radius: var(--radius); cursor: pointer; font-size: 0.85rem;
  transition: border-color 0.2s;
}
.btn-theme:hover { border-color: var(--primary); }

.card-themed {
  background: var(--surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow);
}
.card-themed h3 { color: var(--primary); margin: 0 0 0.5rem; }
.card-themed p { color: var(--text-muted); margin: 0 0 var(--spacing-md); }

.btn-primary {
  padding: 0.5rem 1.2rem;
  background: var(--primary);
  background-image: linear-gradient(135deg, var(--primary), color-mix(in hsl, var(--primary), #a855f7 40%));
  color: white; border: none;
  border-radius: var(--radius); cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}
.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

.spacing-demo { display: flex; gap: var(--spacing-sm); align-items: flex-end; }
.box-sm, .box-md, .box-lg {
  background: var(--primary-light);
  border: 1px solid var(--primary);
  border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary); font-size: 0.8rem;
}
.box-sm { width: 60px; height: 60px; }
.box-md { width: 80px; height: 80px; }
.box-lg { width: 100px; height: 100px; }`,
    js: `const themes = {
  purple: { '--primary': '#6366f1', '--primary-hover': '#4f46e5', '--primary-light': 'rgba(99,102,241,0.15)' },
  green:  { '--primary': '#22c55e', '--primary-hover': '#16a34a', '--primary-light': 'rgba(34,197,94,0.15)'  },
  orange: { '--primary': '#f59e0b', '--primary-hover': '#d97706', '--primary-light': 'rgba(245,158,11,0.15)' },
};

function setTheme(name) {
  const theme = themes[name];
  for (const [prop, val] of Object.entries(theme)) {
    document.documentElement.style.setProperty(prop, val);
  }
  console.log('Тема изменена на:', name);
}`,
    tips: [
      "CSS-переменные наследуются! Объяви тему на :root, переопредели на .dark-theme",
      "var(--color, #fallback) — запасное значение если переменная не определена",
      "Используй calc() с переменными: margin: calc(var(--spacing) * 2)",
      "JavaScript + CSS-переменные = динамические темы без перезагрузки страницы",
    ],
  },
  // ─────────────────── JavaScript ───────────────────
  {
    id: "js-variables",
    category: "js",
    level: "beginner",
    title: "Переменные: let, const, var и области видимости",
    body: `JavaScript имеет три способа объявить переменную — и выбор важен.

**var (устаревший):** не используй в современном коде.
• Функциональная область видимости (видна во всей функции)
• Hoisting — поднимается в начало функции (переменная существует, но undefined)
• Можно переобъявить: var x = 1; var x = 2; — ошибки нет

**let:** Для изменяемых переменных.
• Блочная область видимости (виден только внутри {} )
• Нельзя переобъявить в одной области
• Есть hoisting, но в «мёртвой зоне» (temporal dead zone)

**const:** Для неизменяемых привязок. ИСПОЛЬЗУЙ ПО УМОЛЧАНИЮ.
• Блочная область видимости
• Нельзя переназначить (const x = 1; x = 2 — TypeError!)
• Но объект/массив можно ИЗМЕНЯТЬ: const arr = []; arr.push(1); — OK!

**Правило:** всегда начинай с const. Если нужна переназначить — меняй на let. var — никогда.

**Области видимости (Scope):**
• Глобальный — видны везде
• Блочный — внутри {}
• Функциональный — внутри function
• Модульный — внутри ES6 модуля`,
    html: `<div id="output" style="font-family:monospace;white-space:pre-line;"></div>`,
    css: `body { background:#1a1d23; color:#e8eaed; padding: 1rem; font-family: system-ui; }
#output { background: #2a2d36; padding: 1rem; border-radius: 8px; color: #22c55e; font-size: 0.9rem; }`,
    js: `const out = document.getElementById('output');
function log(...args) {
  out.textContent += args.join(' ') + '\n';
  console.log(...args);
}

// const — нельзя переназначить, но можно изменять объект
const name = 'Алиса';
log('const name:', name);
// name = 'Боб'; // TypeError!

const arr = [1, 2, 3];
arr.push(4); // OK — мутируем массив
log('const arr после push:', arr);

const obj = { x: 1 };
obj.x = 10; // OK — мутируем объект
log('const obj после изменения:', JSON.stringify(obj));

// let — блочная видимость
let count = 0;
if (true) {
  let blockVar = 'виден только внутри if';
  count = 5;
  log('blockVar внутри блока:', blockVar);
}
// log(blockVar); // ReferenceError!
log('count после блока:', count);

// Hoisting с var
log('\n--- Hoisting ---');
log('typeof hoistedVar перед объявлением:', typeof hoistedVar); // undefined, не ошибка!
var hoistedVar = 'поднятая переменная';

// Замыкание и scope
function createCounter() {
  let count = 0; // локальная, не видна снаружи
  return {
    inc: () => ++count,
    get: () => count
  };
}
const counter = createCounter();
counter.inc(); counter.inc();
log('\nЗамыкание — счётчик:', counter.get());`,
    tips: [
      "Правило: const по умолчанию → let только если нужно переназначение → var никогда",
      "const с объектом/массивом не замораживает их содержимое — только привязку",
      "Блочная видимость let/const предотвращает ошибки в циклах и условиях",
      "Object.freeze(obj) — замораживает объект полностью (нельзя изменять свойства)",
    ],
  },
  {
    id: "js-types-operators",
    category: "js",
    level: "beginner",
    title: "Типы данных, операторы и приведение типов",
    body: `JavaScript имеет 7 примитивных типов и один тип-объект.

**Примитивные типы:**
• string: 'текст', "текст", \`шаблон \${x}\`
• number: 42, 3.14, NaN, Infinity
• boolean: true, false
• null: явное отсутствие значения (typeof null === 'object' — известный баг JS!)
• undefined: переменная не инициализирована
• bigint: 9007199254740993n (для больших чисел)
• symbol: уникальные идентификаторы

**typeof:** возвращает строку с типом. typeof undefined === 'undefined', typeof null === 'object' (!!), typeof [] === 'object'.

**== vs ===:**
• == — нестрогое равенство с приведением типов: '5' == 5 → true (плохо!)
• === — строгое равенство: '5' === 5 → false (всегда используй ===)
• !== — строгое неравенство

**Falsy-значения (приводятся к false в условии):** false, 0, '', null, undefined, NaN

**Операторы короткого замыкания:**
• && — возвращает первый falsy или последний truthy
• || — возвращает первый truthy или последний falsy
• ?? (nullish coalescing) — только если null или undefined (не 0, '')`,
    html: `<div id="output"></div>`,
    css: `body { background:#1a1d23; color:#e8eaed; padding: 1rem; }
#output { background: #2a2d36; padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem; white-space: pre-line; color: #22c55e; }`,
    js: `const out = document.getElementById('output');
const log = (...a) => { out.textContent += a.join(' ') + '\n'; };

// Типы
log('=== Типы ===');
log('typeof 42:', typeof 42);
log('typeof "text":', typeof "text");
log('typeof true:', typeof true);
log('typeof null:', typeof null); // object — баг!
log('typeof undefined:', typeof undefined);
log('typeof []:', typeof []); // object — используй Array.isArray()
log('Array.isArray([]):', Array.isArray([]));

// == vs ===
log('\n=== Сравнение ===');
log("'5' == 5:", '5' == 5);   // true (!)
log("'5' === 5:", '5' === 5); // false
log("null == undefined:", null == undefined);   // true
log("null === undefined:", null === undefined); // false

// Короткое замыкание
log('\n=== Операторы ===');
const user = null;
log('null || "Гость":', user || 'Гость');  // 'Гость'
log('null ?? "Гость":', user ?? 'Гость');  // 'Гость'
log("0 || 'default':", 0 || 'default');    // 'default' (0 = falsy!)
log("0 ?? 'default':", 0 ?? 'default');    // 0 (0 не null/undefined)

// Тернарный оператор
const age = 20;
const status = age >= 18 ? 'совершеннолетний' : 'несовершеннолетний';
log('\nTернарный:', age, '->', status);

// NaN
log('\nNaN проверки:');
log("isNaN('abc'):", isNaN('abc'));           // true
log("Number.isNaN('abc'):", Number.isNaN('abc')); // false (только реальный NaN)
log("Number.isNaN(NaN):", Number.isNaN(NaN));     // true`,
    tips: [
      "Всегда используй === вместо ==. == с приведением типов — источник непредсказуемых багов",
      "?? (nullish coalescing) лучше || для дефолтных значений когда 0 и '' допустимы",
      "Number.isNaN() надёжнее isNaN() — isNaN('abc') === true хотя 'abc' не NaN",
      "typeof null === 'object' — исторический баг JS. Для проверки на null используй value === null",
    ],
  },
  {
    id: "js-functions",
    category: "js",
    level: "beginner",
    title: "Функции: объявление, выражения, стрелки, замыкания",
    body: `Функции — строительные блоки JavaScript.

**Function Declaration (объявление):**
\`\`\`js
function greet(name) { return 'Привет, ' + name; }
\`\`\`
Особенность: hoisting — функция доступна до строки объявления.

**Function Expression (выражение):**
\`\`\`js
const greet = function(name) { return 'Привет, ' + name; };
\`\`\`
Нет hoisting — используй после объявления.

**Arrow Functions (стрелочные ES6):**
\`\`\`js
const greet = (name) => 'Привет, ' + name;
const greet = name => 'Привет, ' + name; // 1 параметр — скобки необязательны
const sum = (a, b) => a + b; // неявный return для выражений
const complex = (x) => { const y = x * 2; return y + 1; }; // {} требует return
\`\`\`
Стрелочные функции не имеют своего this — берут this из окружения.

**Параметры:**
• Значения по умолчанию: function(x = 0)
• Rest-параметр: function(...args) — массив всех аргументов
• Деструктуризация: function({ name, age })

**Замыкание (closure):** функция «запоминает» переменные из области видимости где была создана.`,
    html: `<div id="output"></div>`,
    css: `body { background:#1a1d23; color:#e8eaed; padding: 1rem; }
#output { background: #2a2d36; padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem; white-space: pre-line; color: #22c55e; }`,
    js: `const out = document.getElementById('output');
const log = (...a) => { out.textContent += a.join(' ') + '\n'; };

// Function Declaration
function add(a, b = 0) { return a + b; }
log('add(2, 3):', add(2, 3));
log('add(5):', add(5)); // b = 0 по умолчанию

// Arrow Function
const multiply = (a, b) => a * b;
const square = x => x ** 2;
log('multiply(4, 5):', multiply(4, 5));
log('square(7):', square(7));

// Rest параметры
const sum = (...nums) => nums.reduce((acc, n) => acc + n, 0);
log('sum(1,2,3,4,5):', sum(1, 2, 3, 4, 5));

// Деструктуризация параметров
function greetUser({ name, age, role = 'user' }) {
  return \`\${name} (\${age} лет, \${role})\`;
}
log('greetUser:', greetUser({ name: 'Алиса', age: 25, role: 'admin' }));

// Замыкание
function makeCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
    reset: () => { count = start; }
  };
}
const c = makeCounter(10);
c.increment(); c.increment(); c.decrement();
log('\nЗамыкание-счётчик:', c.value()); // 11

// Высшие функции
const double = x => x * 2;
const addTen = x => x + 10;
const compose = (...fns) => x => fns.reduceRight((v, fn) => fn(v), x);
const transform = compose(addTen, double);
log('compose(addTen, double)(5):', transform(5)); // double(5)=10, addTen(10)=20`,
    tips: [
      "Стрелочные функции для коллбеков, обычные — для методов объектов (нужен this)",
      "Всегда называй функции — это помогает в stack trace при ошибках",
      "Замыкания — основа модульного паттерна, счётчиков, кэширования, partial application",
      "Параметры по умолчанию вычисляются при каждом вызове: function(date = new Date()) всегда свежая дата",
    ],
  },
  {
    id: "js-arrays",
    category: "js",
    level: "beginner",
    title: "Массивы: методы, map, filter, reduce",
    body: `Массивы — основная структура данных в JavaScript. Они имеют богатый набор методов.

**Создание:** \`const arr = [1, 2, 3];\` или \`new Array(3).fill(0)\`

**Базовые методы (мутируют массив):**
• push/pop — добавить/убрать с конца
• unshift/shift — добавить/убрать с начала
• splice(start, deleteCount, ...items) — вставить/удалить в середине
• sort(fn) — сортировка (мутирует!)
• reverse() — перевернуть (мутирует!)

**Методы без мутации (возвращают новый массив):**
• map(fn) — преобразовать каждый элемент
• filter(fn) — оставить элементы где fn вернула true
• reduce(fn, initial) — свернуть в одно значение
• slice(start, end) — вырезать часть
• concat(arr2) — объединить
• flat(depth) — развернуть вложенные массивы
• flatMap(fn) — map + flat(1)

**Поиск:**
• find(fn) — первый элемент где fn === true
• findIndex(fn) — индекс первого найденного
• includes(val) — содержит ли значение
• indexOf(val) — индекс значения или -1
• some(fn) — хотя бы один соответствует
• every(fn) — все соответствуют`,
    html: `<div id="output"></div>`,
    css: `body { background:#1a1d23; color:#e8eaed; padding: 1rem; }
#output { background: #2a2d36; padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem; white-space: pre-line; color: #22c55e; }`,
    js: `const out = document.getElementById('output');
const log = (...a) => { out.textContent += a.join(' ') + '\n'; };

const users = [
  { name: 'Алиса', age: 25, active: true  },
  { name: 'Боб',   age: 17, active: true  },
  { name: 'Виктор',age: 30, active: false },
  { name: 'Галя',  age: 22, active: true  },
];

// map — трансформация
const names = users.map(u => u.name);
log('names:', names.join(', '));

// filter — фильтрация
const adults = users.filter(u => u.age >= 18);
log('adults:', adults.map(u => u.name).join(', '));

const activeAdults = users.filter(u => u.active && u.age >= 18);
log('activeAdults:', activeAdults.map(u => u.name).join(', '));

// reduce — агрегация
const totalAge = users.reduce((sum, u) => sum + u.age, 0);
log('totalAge:', totalAge, '| avg:', (totalAge / users.length).toFixed(1));

// Группировка через reduce
const byStatus = users.reduce((acc, u) => {
  const key = u.active ? 'active' : 'inactive';
  (acc[key] = acc[key] || []).push(u.name);
  return acc;
}, {});
log('byStatus:', JSON.stringify(byStatus));

// find / some / every
const alice = users.find(u => u.name === 'Алиса');
log('\nfind Алиса:', alice?.age);
log('some inactive:', users.some(u => !u.active));
log('every active:', users.every(u => u.active));

// sort (мутирует! — используй копию)
const sorted = [...users].sort((a, b) => a.age - b.age);
log('\nсортировка по возрасту:', sorted.map(u => u.name + '(' + u.age + ')').join(', '));

// flat и flatMap
const nested = [[1, 2], [3, 4], [5, 6]];
log('\nflat:', nested.flat().join(', '));
log('flatMap(*2):', nested.flatMap(arr => arr.map(x => x * 2)).join(', '));`,
    tips: [
      "map/filter/reduce не мутируют исходный массив — они безопасны",
      "sort мутирует! Всегда сортируй копию: [...arr].sort(...)",
      "Цепочки: users.filter(u=>u.active).map(u=>u.name).sort() — читаемо и декларативно",
      "reduce мощный: можно получить объект, массив, число — всё что угодно",
    ],
  },
  {
    id: "js-objects",
    category: "js",
    level: "beginner",
    title: "Объекты, деструктуризация, spread и методы",
    body: `Объекты — пары ключ-значение. Основная структура данных для хранения связанных данных.

**Создание:**
\`\`\`js
const user = { name: 'Алиса', age: 25 };
\`\`\`

**Доступ:** user.name или user['name'] (вариант со скобками для динамических ключей)

**Методы объекта:**
• Object.keys(obj) — массив ключей
• Object.values(obj) — массив значений
• Object.entries(obj) — массив [ключ, значение]
• Object.assign(target, ...sources) — копирование свойств
• Object.fromEntries(entries) — из массива [ключ, значение]
• { ...spread } — spread оператор (поверхностная копия)

**Деструктуризация:**
\`\`\`js
const { name, age } = user;
const { name: userName } = user; // переименование
const { role = 'user' } = user;  // значение по умолчанию
\`\`\`

**Shorthand (краткая запись):**
\`\`\`js
const name = 'Алиса';
const user = { name, age: 25 }; // вместо { name: name, age: 25 }
\`\`\`

**Вычисляемые свойства:**
\`\`\`js
const key = 'name';
const obj = { [key]: 'Алиса' }; // { name: 'Алиса' }
\`\`\``,
    html: `<div id="output"></div>`,
    css: `body { background:#1a1d23; color:#e8eaed; padding: 1rem; }
#output { background: #2a2d36; padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem; white-space: pre-line; color: #22c55e; }`,
    js: `const out = document.getElementById('output');
const log = (...a) => { out.textContent += a.join(' ') + '\n'; };

const user = { name: 'Алиса', age: 25, role: 'admin', city: 'Москва' };

// Деструктуризация
const { name, age, role = 'user', city: location } = user;
log('Деструктуризация:', name, age, role, location);

// Spread — поверхностная копия
const updated = { ...user, age: 26, email: 'alice@example.com' };
log('Spread обновление:', JSON.stringify(updated));

// Вложенная деструктуризация
const data = { user: { profile: { name: 'Боб', scores: [90, 85, 92] } } };
const { user: { profile: { name: pName, scores: [first, ...rest] } } } = data;
log('\nВложенная деструктуризация:', pName, '| первый балл:', first, '| остальные:', rest);

// Object.entries + map
const prices = { apple: 100, banana: 50, cherry: 200 };
const doubled = Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, v * 2])
);
log('\nObject.entries + fromEntries:', JSON.stringify(doubled));

// Методы в объекте
const calc = {
  value: 0,
  add(n) { this.value += n; return this; }, // цепочка
  multiply(n) { this.value *= n; return this; },
  result() { return this.value; }
};
const res = calc.add(5).multiply(3).add(2).result();
log('\nFluent API (цепочка):', res); // (5*3)+2 = 17

// Вычисляемые ключи
const fields = ['name', 'email', 'phone'];
const form = Object.fromEntries(fields.map(f => [f, '']));
log('\nВычисляемые ключи:', JSON.stringify(form));`,
    tips: [
      "{ ...obj } создаёт поверхностную копию. Для глубокой — structuredClone(obj) (ES2022)",
      "Object.entries() + Object.fromEntries() — трансформация объекта без мутации",
      "Shorthand методы { method() {} } работают с super, в отличие от стрелочных функций",
      "Для проверки существования ключа используй 'key' in obj, не obj.key !== undefined",
    ],
  },
  {
    id: "js-dom",
    category: "js",
    level: "beginner",
    title: "DOM: выборка, изменение, создание элементов",
    body: `DOM (Document Object Model) — программное представление HTML в виде дерева объектов. JavaScript может читать и изменять DOM в реальном времени.

**Выборка элементов:**
• document.getElementById('id') — один элемент по ID
• document.querySelector('#id .class') — первый по CSS-селектору
• document.querySelectorAll('p') — все по селектору (NodeList)
• element.closest('.parent') — ближайший предок по селектору

**Изменение содержимого:**
• element.textContent = 'текст' — только текст (безопасно, без HTML)
• element.innerHTML = '<b>HTML</b>' — HTML (осторожно с XSS!)
• element.value — для input элементов

**Изменение стилей и классов:**
• element.style.color = 'red' — инлайн стиль
• element.classList.add('active') — добавить класс
• element.classList.remove('active') — убрать класс
• element.classList.toggle('active') — переключить класс
• element.classList.contains('active') — проверить класс

**Атрибуты:**
• element.setAttribute('src', 'image.jpg')
• element.getAttribute('href')
• element.removeAttribute('disabled')
• element.dataset.myValue — data-my-value атрибут

**Создание и добавление:**
• document.createElement('div')
• parent.appendChild(child) или parent.append(child, child2)
• element.remove() — удалить элемент`,
    html: `<div id="app">
  <h2 id="title">Управление DOM</h2>
  <div id="counter-display">0</div>
  <div class="buttons">
    <button id="dec">−</button>
    <button id="inc">+</button>
    <button id="reset">Reset</button>
  </div>
  <div id="list-container">
    <input id="new-item" type="text" placeholder="Добавить элемент">
    <button id="add-item">Добавить</button>
    <ul id="items-list"></ul>
  </div>
  <div id="theme-container">
    <button id="toggle-theme">Переключить тему</button>
  </div>
</div>`,
    css: `body { font-family: system-ui; background:#1a1d23; color:#e8eaed; padding: 1rem; }
#title { color: #6366f1; }
#counter-display { font-size: 3rem; font-weight: bold; text-align: center; padding: 1rem; background: #2a2d36; border-radius: 10px; margin: 1rem 0; transition: color 0.3s; }
.buttons { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
button { padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; background: #3a3d46; color: #e8eaed; font-size: 1rem; transition: background 0.2s; }
button:hover { background: #4a4d56; }
#inc { background: #22c55e; color: white; }
#dec { background: #ef4444; color: white; }
#reset { background: #6366f1; color: white; }
#list-container { margin: 1rem 0; }
#new-item { padding: 0.4rem 0.7rem; background: #2a2d36; border: 1px solid #3a3d46; border-radius: 6px; color: #e8eaed; margin-right: 0.5rem; }
#items-list { list-style: none; padding: 0; margin-top: 0.5rem; }
#items-list li { padding: 0.4rem 0.8rem; background: #2a2d36; border-radius: 4px; margin: 0.3rem 0; display: flex; justify-content: space-between; align-items: center; }
#items-list li button { padding: 0.2rem 0.5rem; font-size: 0.75rem; background: #ef4444; }
.dark-mode { background: #000 !important; }`,
    js: `// Выборка элементов
const display = document.getElementById('counter-display');
const title = document.getElementById('title');

// Счётчик
let count = 0;
function updateDisplay() {
  display.textContent = count;
  display.style.color = count > 0 ? '#22c55e' : count < 0 ? '#ef4444' : '#e8eaed';
}

document.getElementById('inc').addEventListener('click', () => { count++; updateDisplay(); });
document.getElementById('dec').addEventListener('click', () => { count--; updateDisplay(); });
document.getElementById('reset').addEventListener('click', () => { count = 0; updateDisplay(); });

// Создание и добавление элементов
document.getElementById('add-item').addEventListener('click', () => {
  const input = document.getElementById('new-item');
  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement('li');
  li.textContent = text;

  const btn = document.createElement('button');
  btn.textContent = '✕';
  btn.addEventListener('click', () => li.remove());
  li.appendChild(btn);

  document.getElementById('items-list').appendChild(li);
  input.value = '';
  input.focus();
});

// Enter в input
document.getElementById('new-item').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('add-item').click();
});

// Изменение атрибутов
document.getElementById('toggle-theme').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  title.textContent = document.body.classList.contains('dark-mode') ? 'Тёмная тема!' : 'Управление DOM';
});`,
    tips: [
      "querySelector гибче getElementById — используй CSS-селекторы которые уже знаешь",
      "textContent безопаснее innerHTML — не выполняет HTML. Используй innerHTML только для доверенного контента",
      "classList.toggle возвращает boolean — true если класс добавлен, false если убран",
      "document.createElement + appendChild — всегда предпочтительнее innerHTML для динамического контента (безопаснее)",
    ],
  },
  {
    id: "js-events",
    category: "js",
    level: "beginner",
    title: "События: addEventListener, делегирование, объект event",
    body: `События — механизм реакции на действия пользователя и браузера.

**Добавление обработчика:**
\`element.addEventListener('тип', функция, [опции])\`

**Распространённые типы событий:**
• click, dblclick — клики
• mouseenter, mouseleave, mousemove, mouseover, mouseout
• keydown, keyup, keypress (устарел)
• change, input — изменение значения
• submit — отправка формы
• focus, blur — фокус
• scroll, resize — прокрутка и resize окна
• load, DOMContentLoaded — загрузка страницы
• touchstart, touchend, touchmove — touch-события

**Объект Event:**
• e.target — элемент на котором произошло событие
• e.currentTarget — элемент с обработчиком
• e.preventDefault() — отменить поведение браузера
• e.stopPropagation() — остановить всплытие
• e.key, e.code — нажатая клавиша
• e.clientX, e.clientY — координаты мыши
• e.type — тип события

**Делегирование событий:** вместо обработчиков на каждый элемент — один на родителя. Использует всплытие событий (bubbling). Эффективно для динамических списков.`,
    html: `<div id="event-demo">
  <h3>Клавиатура</h3>
  <input id="key-input" type="text" placeholder="Нажимай клавиши">
  <div id="key-display" class="display">...</div>

  <h3>Мышь</h3>
  <div id="mouse-area" class="mouse-box">Двигай мышь здесь</div>

  <h3>Делегирование событий</h3>
  <button id="add-btn">Добавить кнопку</button>
  <div id="btn-container" class="btn-container"></div>

  <h3>Форма</h3>
  <form id="demo-form">
    <input type="email" placeholder="Email" required>
    <button type="submit">Отправить</button>
  </form>
  <div id="form-result" class="display"></div>
</div>`,
    css: `body { font-family: system-ui; background:#1a1d23; color:#e8eaed; padding: 1rem; }
h3 { color: #6366f1; margin: 1rem 0 0.5rem; font-size: 0.9rem; }
.display { background: #2a2d36; padding: 0.5rem 0.8rem; border-radius: 6px; font-family: monospace; min-height: 1.5rem; margin-top: 0.3rem; font-size: 0.85rem; color: #22c55e; }
input[type="text"], input[type="email"] { padding: 0.4rem 0.7rem; background: #2a2d36; border: 1px solid #3a3d46; border-radius: 6px; color: #e8eaed; width: 100%; margin-bottom: 0.3rem; }
.mouse-box { background: #2a2d36; padding: 1.5rem; text-align: center; border-radius: 8px; cursor: crosshair; user-select: none; color: #9aa0aa; transition: background 0.2s; }
.btn-container { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; min-height: 2rem; }
button { padding: 0.4rem 0.9rem; border: none; border-radius: 6px; cursor: pointer; background: #3a3d46; color: #e8eaed; }
#add-btn { background: #6366f1; color: white; }
form { display: flex; gap: 0.5rem; margin-top: 0.3rem; }
form button { background: #22c55e; color: white; white-space: nowrap; }`,
    js: `// Клавиатурные события
document.getElementById('key-input').addEventListener('keydown', (e) => {
  const display = document.getElementById('key-display');
  display.textContent = \`Клавиша: \${e.key} | Код: \${e.code} | Ctrl: \${e.ctrlKey} | Shift: \${e.shiftKey}\`;
  if (e.key === 'Escape') { e.target.value = ''; display.textContent = 'Поле очищено (Escape)'; }
});

// Событие мыши
const mouseArea = document.getElementById('mouse-area');
mouseArea.addEventListener('mousemove', (e) => {
  const rect = mouseArea.getBoundingClientRect();
  const x = Math.round(e.clientX - rect.left);
  const y = Math.round(e.clientY - rect.top);
  mouseArea.textContent = \`x: \${x}, y: \${y}\`;
  const hue = Math.round((x / rect.width) * 360);
  mouseArea.style.background = \`hsl(\${hue}, 60%, 20%)\`;
});
mouseArea.addEventListener('mouseleave', () => {
  mouseArea.textContent = 'Двигай мышь здесь';
  mouseArea.style.background = '';
});

// Делегирование событий — один обработчик для динамических кнопок
let btnCount = 0;
document.getElementById('add-btn').addEventListener('click', () => {
  btnCount++;
  const btn = document.createElement('button');
  btn.textContent = 'Кнопка ' + btnCount;
  btn.dataset.id = btnCount;
  document.getElementById('btn-container').appendChild(btn);
});

// Один обработчик на контейнер — работает для ВСЕХ кнопок включая новые
document.getElementById('btn-container').addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    e.target.style.background = '#ef4444';
    e.target.textContent = '✕ ' + e.target.dataset.id;
    setTimeout(() => e.target.remove(), 500);
    console.log('Нажата кнопка:', e.target.dataset.id);
  }
});

// Форма
document.getElementById('demo-form').addEventListener('submit', (e) => {
  e.preventDefault(); // Отменяем стандартную отправку
  const email = e.target.querySelector('input[type="email"]').value;
  document.getElementById('form-result').textContent = 'Получен email: ' + email;
  e.target.reset();
});`,
    tips: [
      "Делегирование событий — обязательный паттерн для динамических списков. Один обработчик на родителе вместо N на детях",
      "e.preventDefault() для ссылок и форм, e.stopPropagation() для остановки всплытия",
      "{ once: true } в addEventListener — обработчик срабатывает один раз и удаляется автоматически",
      "DOMContentLoaded лучше load: не ждёт картинки и стили, только HTML-дерево",
    ],
  },
  {
    id: "js-async",
    category: "js",
    level: "intermediate",
    title: "async/await, Promises и Fetch API",
    body: `JavaScript однопоточный, но асинхронные операции (сеть, файлы, таймеры) не блокируют основной поток.

**Promise (обещание):**
Объект представляющий результат асинхронной операции. Три состояния: pending → fulfilled или rejected.
\`\`\`js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('данные'), 1000);
});
p.then(data => console.log(data)).catch(err => console.error(err));
\`\`\`

**async/await (ES2017) — синтаксический сахар над Promise:**
\`\`\`js
async function getData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
\`\`\`
async функция ВСЕГДА возвращает Promise.

**Fetch API:**
\`\`\`js
const res = await fetch('url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' })
});
if (!res.ok) throw new Error('HTTP ' + res.status);
const data = await res.json(); // или .text(), .blob()
\`\`\`

**Promise.all:** ждёт ВСЕ промисы параллельно
**Promise.race:** ждёт ПЕРВЫЙ завершившийся
**Promise.allSettled:** ждёт все, не выбрасывает ошибку`,
    html: `<div id="async-demo">
  <h3>Fetch + async/await</h3>
  <button id="fetch-users">Загрузить пользователей</button>
  <div id="users-container" class="container"></div>

  <h3>Promise.all (параллельно)</h3>
  <button id="fetch-parallel">Загрузить параллельно</button>
  <div id="parallel-result" class="container"></div>

  <h3>Таймеры как Промисы</h3>
  <button id="timer-btn">Запустить таймеры</button>
  <div id="timer-result" class="container"></div>
</div>`,
    css: `body { font-family: system-ui; background:#1a1d23; color:#e8eaed; padding: 1rem; }
h3 { color: #6366f1; margin: 1rem 0 0.5rem; font-size: 0.9rem; }
button { padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 0.5rem; }
button:hover { background: #4f46e5; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
.container { background: #2a2d36; border-radius: 8px; padding: 0.7rem; min-height: 2rem; font-size: 0.85rem; }
.user-card { background: #1a1d23; border-radius: 6px; padding: 0.5rem 0.8rem; margin: 0.3rem 0; display: flex; gap: 0.5rem; align-items: center; }
.avatar { width: 32px; height: 32px; border-radius: 50%; background: #6366f1; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem; flex-shrink: 0; }`,
    js: `// delay helper
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Fetch пользователей
document.getElementById('fetch-users').addEventListener('click', async (e) => {
  e.target.disabled = true;
  e.target.textContent = 'Загрузка...';
  const container = document.getElementById('users-container');
  container.textContent = '';

  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users?_limit=4');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const users = await res.json();

    users.forEach(user => {
      const card = document.createElement('div');
      card.className = 'user-card';
      const initials = user.name.split(' ').map(n => n[0]).join('').slice(0,2);
      card.innerHTML = \`
        <div class="avatar">\${initials}</div>
        <div>
          <strong>\${user.name}</strong>
          <div style="color:#9aa0aa;font-size:0.8rem">\${user.email}</div>
        </div>
      \`;
      container.appendChild(card);
    });
  } catch (err) {
    container.textContent = '❌ Ошибка: ' + err.message;
    console.error(err);
  } finally {
    e.target.disabled = false;
    e.target.textContent = 'Загрузить пользователей';
  }
});

// Promise.all
document.getElementById('fetch-parallel').addEventListener('click', async (e) => {
  e.target.disabled = true;
  const el = document.getElementById('parallel-result');
  el.textContent = '⏳ Загружаю параллельно...';
  const t0 = performance.now();
  try {
    const [posts, todos] = await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/posts?_limit=3').then(r => r.json()),
      fetch('https://jsonplaceholder.typicode.com/todos?_limit=3').then(r => r.json()),
    ]);
    const ms = Math.round(performance.now() - t0);
    el.innerHTML = \`✅ Загружено за \${ms}мс<br>Posts: \${posts.length}, Todos: \${todos.length}\`;
  } catch (err) { el.textContent = '❌ ' + err.message; }
  e.target.disabled = false;
});

// Таймеры как промисы
document.getElementById('timer-btn').addEventListener('click', async () => {
  const el = document.getElementById('timer-result');
  el.textContent = '';
  const add = (t) => { el.textContent += t + '\n'; };
  add('Начало');
  await delay(500); add('500мс: первый таймер');
  await delay(500); add('1000мс: второй таймер');
  await delay(500); add('1500мс: готово! ✅');
});`,
    tips: [
      "async функция ВСЕГДА возвращает Promise — даже если return просто значение",
      "Всегда проверяй res.ok после fetch — статус 404/500 не выбрасывает ошибку!",
      "Promise.all vs Promise.allSettled: all падает при первой ошибке, allSettled — нет",
      "Не await в цикле for (await delay) — это последовательно. Promise.all(arr.map(fn)) — параллельно",
    ],
  },
  {
    id: "js-classes",
    category: "js",
    level: "intermediate",
    title: "Классы ES6: ООП в JavaScript",
    body: `JavaScript классы (ES6) — синтаксический сахар над прототипным наследованием. Делают ООП-код читаемее.

**Структура класса:**
\`\`\`js
class Animal {
  #name; // приватное поле (ES2022)

  constructor(name) { this.#name = name; }
  get name() { return this.#name; }  // геттер
  set name(v) { this.#name = v; }    // сеттер
  speak() { return 'звук'; }
  static create(name) { return new Animal(name); } // статический метод
}
\`\`\`

**Наследование:**
\`\`\`js
class Dog extends Animal {
  constructor(name, breed) {
    super(name); // ОБЯЗАТЕЛЬНО первым в constructor
    this.breed = breed;
  }
  speak() { return 'Гав!'; } // переопределение
  info() { return \`\${super.name}, \${this.breed}\`; } // вызов родительского
}
\`\`\`

**Публичные и приватные поля:**
• #field — приватное (только внутри класса)
• field — публичное (можно снаружи)

**Статические методы/свойства:** принадлежат классу, не экземплярам. Вызываются как Animal.create().

**Применение:** классы хорошо подходят для UI-компонентов, моделей данных, сервисов, паттернов Builder/Factory.`,
    html: `<div id="oop-demo">
  <h3>Демо: класс BankAccount</h3>
  <div class="account-card" id="account1"></div>
  <div class="account-card" id="account2"></div>
  <div id="oop-log" class="log"></div>
</div>`,
    css: `body { font-family: system-ui; background:#1a1d23; color:#e8eaed; padding: 1rem; }
h3 { color: #6366f1; margin: 0 0 0.8rem; }
.account-card { background: #2a2d36; border-radius: 10px; padding: 1rem; margin-bottom: 0.8rem; border: 1px solid #3a3d46; }
.account-card h4 { margin: 0 0 0.4rem; color: #a855f7; }
.balance { font-size: 1.8rem; font-weight: bold; color: #22c55e; }
.balance.negative { color: #ef4444; }
.log { background: #2a2d36; border-radius: 8px; padding: 0.8rem; font-family: monospace; font-size: 0.82rem; white-space: pre-line; color: #9aa0aa; max-height: 150px; overflow-y: auto; }`,
    js: `class BankAccount {
  #balance;
  #owner;
  #transactions = [];
  static #nextId = 1000;
  #id;

  constructor(owner, initialBalance = 0) {
    this.#owner = owner;
    this.#balance = initialBalance;
    this.#id = ++BankAccount.#nextId;
    this.#transactions.push({ type: 'Открытие счёта', amount: initialBalance, date: new Date().toLocaleDateString() });
  }

  deposit(amount) {
    if (amount <= 0) throw new Error('Сумма должна быть положительной');
    this.#balance += amount;
    this.#transactions.push({ type: 'Пополнение', amount, date: new Date().toLocaleDateString() });
    this.#render();
    return this;
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error('Недостаточно средств');
    this.#balance -= amount;
    this.#transactions.push({ type: 'Снятие', amount: -amount, date: new Date().toLocaleDateString() });
    this.#render();
    return this;
  }

  transfer(other, amount) {
    this.withdraw(amount);
    other.deposit(amount);
    log(\`Перевод \${amount}₽ с \${this.#owner} → \${other.owner}\`);
    return this;
  }

  get balance() { return this.#balance; }
  get owner() { return this.#owner; }
  get id() { return this.#id; }

  toString() { return \`Счёт #\${this.#id} (\${this.#owner}): \${this.#balance}₽\`; }

  #render() {
    const card = document.getElementById('account' + (this.#owner === 'Алиса' ? 1 : 2));
    if (!card) return;
    card.innerHTML = \`
      <h4>🏦 Счёт #\${this.#id} — \${this.#owner}</h4>
      <div class="balance \${this.#balance < 0 ? 'negative' : ''}">\${this.#balance.toLocaleString()}₽</div>
      <div style="margin-top:.4rem;font-size:.8rem;color:#9aa0aa">
        \${this.#transactions.slice(-2).map(t => \`\${t.type}: \${t.amount}₽\`).join(' | ')}
      </div>
    \`;
  }
}

const logEl = document.getElementById('oop-log');
const log = (msg) => { logEl.textContent += msg + '\n'; };

const alice = new BankAccount('Алиса', 5000);
const bob   = new BankAccount('Боб',   2000);
alice.#render?.(); // render initial

alice.deposit(3000);
log(String(alice));
bob.withdraw(500);
log(String(bob));
alice.transfer(bob, 1500);
log('После перевода:');
log(String(alice));
log(String(bob));

try { bob.withdraw(99999); }
catch(e) { log('Ошибка: ' + e.message); }`,
    tips: [
      "#privateField — приватные поля класса (ES2022). Защищены от доступа снаружи",
      "Всегда вызывай super() первым в constructor дочернего класса — иначе ReferenceError",
      "Статические методы для фабричных функций и утилит: User.fromJSON(data), Color.fromHex('#fff')",
      "Геттеры/сеттеры делают свойства управляемыми: можно добавить валидацию и side-effects",
    ],
  },
  {
    id: "js-localstorage",
    category: "js",
    level: "intermediate",
    title: "localStorage, sessionStorage и JSON",
    body: `Web Storage API позволяет хранить данные в браузере пользователя.

**localStorage:**
• Хранит данные ПОСТОЯННО (до явной очистки)
• Привязан к домену (origin)
• Объём: ~5MB
• Синхронный API
• Не передаётся на сервер (в отличие от cookies)

**sessionStorage:**
• Хранит данные только в текущей вкладке и сессии
• Очищается при закрытии вкладки
• Идеально для временного состояния (форм, шагов)

**API:**
\`\`\`js
localStorage.setItem('key', 'value'); // только строки!
localStorage.getItem('key');          // null если нет
localStorage.removeItem('key');
localStorage.clear(); // очистить всё
localStorage.length, localStorage.key(i) // перебор
\`\`\`

**Хранение объектов — JSON:**
\`\`\`js
// Сохранить
localStorage.setItem('user', JSON.stringify({ name: 'Алиса' }));
// Прочитать
const user = JSON.parse(localStorage.getItem('user') ?? '{}');
\`\`\`

**JSON:**
• JSON.stringify(obj) — объект → строка
• JSON.parse(str) — строка → объект
• JSON.stringify(obj, null, 2) — форматированный вывод`,
    html: `<div id="storage-demo">
  <h3>Заметки (localStorage)</h3>
  <textarea id="note-input" placeholder="Пиши заметки — они сохраняются автоматически!"></textarea>
  <div class="storage-info">
    <span id="save-status">Сохранено</span>
    <button id="clear-note">Очистить</button>
  </div>

  <h3>Настройки темы</h3>
  <div class="settings">
    <label><input type="color" id="accent-color" value="#6366f1"> Цвет акцента</label>
    <label><input type="range" id="font-size" min="12" max="20" value="16"> Размер шрифта</label>
    <button id="reset-settings">Сброс настроек</button>
  </div>

  <h3>Содержимое localStorage</h3>
  <div id="storage-view" class="storage-view"></div>
</div>`,
    css: `body { font-family: system-ui; background:#1a1d23; color:#e8eaed; padding: 1rem; --accent: #6366f1; font-size: 16px; }
h3 { color: var(--accent); margin: 1rem 0 0.5rem; font-size: 0.9rem; }
textarea { width: 100%; height: 80px; background: #2a2d36; border: 1px solid #3a3d46; border-radius: 8px; color: #e8eaed; padding: 0.7rem; resize: vertical; font-family: inherit; }
.storage-info { display: flex; justify-content: space-between; align-items: center; margin: 0.3rem 0; font-size: 0.85rem; color: #9aa0aa; }
button { padding: 0.3rem 0.8rem; background: #3a3d46; color: #e8eaed; border: none; border-radius: 5px; cursor: pointer; font-size: 0.85rem; }
button:hover { background: #4a4d56; }
.settings { display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem; }
.settings label { display: flex; align-items: center; gap: 0.5rem; }
input[type="range"] { accent-color: var(--accent); flex: 1; }
.storage-view { background: #2a2d36; border-radius: 8px; padding: 0.8rem; font-family: monospace; font-size: 0.8rem; white-space: pre-wrap; color: #9aa0aa; max-height: 120px; overflow-y: auto; }`,
    js: `const KEYS = { note: 'demo_note', color: 'demo_color', fontSize: 'demo_fontSize' };

function updateStorageView() {
  const items = {};
  for (const [k, v] of Object.entries(KEYS)) {
    const val = localStorage.getItem(v);
    if (val !== null) items[v] = val.length > 40 ? val.slice(0,40) + '...' : val;
  }
  document.getElementById('storage-view').textContent =
    Object.keys(items).length ? JSON.stringify(items, null, 2) : '(пусто)';
}

function applySettings() {
  const color = localStorage.getItem(KEYS.color) || '#6366f1';
  const size = localStorage.getItem(KEYS.fontSize) || '16';
  document.documentElement.style.setProperty('--accent', color);
  document.body.style.fontSize = size + 'px';
  document.getElementById('accent-color').value = color;
  document.getElementById('font-size').value = size;
}

// Заметки
const noteInput = document.getElementById('note-input');
noteInput.value = localStorage.getItem(KEYS.note) || '';

let saveTimer;
noteInput.addEventListener('input', () => {
  clearTimeout(saveTimer);
  document.getElementById('save-status').textContent = '⏳ Сохраняю...';
  saveTimer = setTimeout(() => {
    localStorage.setItem(KEYS.note, noteInput.value);
    document.getElementById('save-status').textContent = '✅ Сохранено';
    updateStorageView();
  }, 500);
});

document.getElementById('clear-note').addEventListener('click', () => {
  noteInput.value = '';
  localStorage.removeItem(KEYS.note);
  updateStorageView();
});

// Настройки
document.getElementById('accent-color').addEventListener('input', (e) => {
  localStorage.setItem(KEYS.color, e.target.value);
  applySettings();
  updateStorageView();
});
document.getElementById('font-size').addEventListener('input', (e) => {
  localStorage.setItem(KEYS.fontSize, e.target.value);
  applySettings();
  updateStorageView();
});
document.getElementById('reset-settings').addEventListener('click', () => {
  localStorage.removeItem(KEYS.color);
  localStorage.removeItem(KEYS.fontSize);
  applySettings();
  updateStorageView();
});

applySettings();
updateStorageView();`,
    tips: [
      "localStorage только строки! JSON.stringify/parse для объектов — обязательно",
      "Обёртка с try/catch: приватный режим Safari выбрасывает исключение при setItem",
      "IndexedDB для больших данных (>5MB): файлы, изображения, структурированные данные",
      "Дебаунс при сохранении (setTimeout) — не пиши в localStorage при каждом нажатии клавиши",
    ],
  },
  {
    id: "js-error-handling",
    category: "js",
    level: "intermediate",
    title: "Обработка ошибок: try/catch, Error, отладка",
    body: `Грамотная обработка ошибок — признак профессионального кода.

**try/catch/finally:**
\`\`\`js
try {
  // рискованный код
  const data = JSON.parse(userInput);
} catch (error) {
  // error.name — тип ошибки (TypeError, ReferenceError, SyntaxError...)
  // error.message — сообщение
  // error.stack — стек вызовов
  console.error(error);
} finally {
  // выполняется ВСЕГДА (даже при return в try/catch)
  // идеально для очистки ресурсов
}
\`\`\`

**Создание ошибок:**
\`\`\`js
throw new Error('Общая ошибка');
throw new TypeError('Неверный тип');
throw new RangeError('Значение вне диапазона');
// Кастомные ошибки:
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}
\`\`\`

**Глобальные обработчики:**
• window.onerror — необработанные sync ошибки
• window.addEventListener('unhandledrejection', ...) — необработанные Promise rejection

**Инструменты отладки:**
• console.log, .warn, .error, .table, .group, .time
• debugger; — точка останова в коде
• Chrome DevTools: Sources → Breakpoints`,
    html: `<div id="error-demo">
  <h3>Безопасный JSON.parse</h3>
  <input id="json-input" type="text" value='{"name":"Алиса","age":25}' placeholder="Введи JSON">
  <button id="parse-btn">Разобрать JSON</button>
  <div id="parse-result" class="result"></div>

  <h3>Пользовательские ошибки</h3>
  <input id="age-input" type="number" placeholder="Возраст (0-150)" value="25">
  <input id="name-input" type="text" placeholder="Имя (мин 2 символа)" value="Алиса">
  <button id="validate-btn">Валидировать</button>
  <div id="validate-result" class="result"></div>
</div>`,
    css: `body { font-family: system-ui; background:#1a1d23; color:#e8eaed; padding: 1rem; }
h3 { color: #6366f1; margin: 1rem 0 0.5rem; font-size: 0.9rem; }
input { display: block; width: 100%; padding: 0.4rem 0.7rem; background: #2a2d36; border: 1px solid #3a3d46; border-radius: 6px; color: #e8eaed; margin-bottom: 0.4rem; }
button { padding: 0.4rem 0.9rem; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; }
.result { margin-top: 0.5rem; padding: 0.6rem 0.8rem; border-radius: 6px; font-size: 0.85rem; font-family: monospace; white-space: pre-wrap; }
.result.ok { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; }
.result.error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; }`,
    js: `// Кастомный класс ошибки
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// Безопасный JSON.parse
document.getElementById('parse-btn').addEventListener('click', () => {
  const input = document.getElementById('json-input').value;
  const result = document.getElementById('parse-result');
  try {
    const data = JSON.parse(input);
    result.className = 'result ok';
    result.textContent = '✅ Успех!\n' + JSON.stringify(data, null, 2);
    console.log('Разобранные данные:', data);
  } catch (e) {
    result.className = 'result error';
    result.textContent = '❌ SyntaxError: ' + e.message;
  }
});

// Валидация с кастомными ошибками
function validateUser(name, age) {
  if (typeof name !== 'string' || name.trim().length < 2) {
    throw new ValidationError('Имя должно быть минимум 2 символа', 'name');
  }
  const ageNum = Number(age);
  if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
    throw new ValidationError('Возраст должен быть от 0 до 150', 'age');
  }
  return { name: name.trim(), age: ageNum };
}

document.getElementById('validate-btn').addEventListener('click', () => {
  const name = document.getElementById('name-input').value;
  const age = document.getElementById('age-input').value;
  const result = document.getElementById('validate-result');
  try {
    const user = validateUser(name, age);
    result.className = 'result ok';
    result.textContent = '✅ Валидно: ' + JSON.stringify(user);
  } catch (e) {
    result.className = 'result error';
    if (e instanceof ValidationError) {
      result.textContent = '❌ ValidationError в поле "' + e.field + '": ' + e.message;
    } else {
      result.textContent = '❌ Неожиданная ошибка: ' + e.message;
    }
  }
});

// Глобальный обработчик
window.addEventListener('unhandledrejection', (e) => {
  console.error('Необработанный Promise rejection:', e.reason);
});`,
    tips: [
      "finally выполняется ВСЕГДА — идеально для закрытия соединений, скрытия loader'а",
      "instanceof для типизированной обработки: if (e instanceof ValidationError) { e.field ... }",
      "Никогда не делай пустой catch {}! Минимум console.error(e) — иначе ошибки теряются",
      "Error.cause (ES2022): new Error('Операция не выполнена', { cause: originalError }) — цепочка ошибок",
    ],
  },
  {
    id: "js-modules",
    category: "js",
    level: "advanced",
    title: "ES Modules: import, export, динамические импорты",
    body: `Модули позволяют разделять код на независимые файлы с явными зависимостями.

**Named exports (именованный экспорт):**
\`\`\`js
// utils.js
export function formatDate(date) { ... }
export const PI = 3.14159;
export class Timer { ... }
\`\`\`

**Default export (экспорт по умолчанию):**
\`\`\`js
// Button.js
export default function Button({ text }) { ... }
\`\`\`

**Импорт:**
\`\`\`js
import { formatDate, PI } from './utils.js';
import { formatDate as fd } from './utils.js'; // псевдоним
import * as utils from './utils.js'; // весь модуль
import Button from './Button.js'; // default
import Button, { buttonStyles } from './Button.js'; // default + named
\`\`\`

**Динамический импорт (lazy loading):**
\`\`\`js
const module = await import('./heavy-module.js');
// или
import('./heavy-module.js').then(m => m.default());
\`\`\`
Используется для загрузки кода по требованию (code splitting).

**В HTML:** \`<script type="module" src="app.js">\`
• Модули автоматически deferred (не блокируют рендер)
• Строгий режим ('use strict') по умолчанию
• Своя область видимости (нет утечки в global)`,
    html: `<div id="module-demo">
  <h3>Динамические импорты</h3>
  <button id="load-chart">Загрузить Chart (динамически)</button>
  <div id="chart-area"></div>

  <h3>Паттерн Module</h3>
  <div id="module-log" class="log"></div>
</div>`,
    css: `body { font-family: system-ui; background:#1a1d23; color:#e8eaed; padding: 1rem; }
h3 { color: #6366f1; margin: 1rem 0 0.5rem; font-size: 0.9rem; }
button { padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 0.5rem; }
button:disabled { opacity: 0.5; }
#chart-area { background: #2a2d36; border-radius: 8px; padding: 1rem; min-height: 80px; }
.log { background: #2a2d36; border-radius: 8px; padding: 0.8rem; font-family: monospace; font-size: 0.82rem; white-space: pre-line; color: #22c55e; }`,
    js: `// Эмуляция паттерна модуля (IIFE)
const UserModule = (() => {
  // Приватное состояние
  const users = new Map();
  let nextId = 1;

  // Приватные функции
  function validateUser(data) {
    if (!data.name || data.name.length < 2) throw new Error('Неверное имя');
    if (!data.email?.includes('@')) throw new Error('Неверный email');
    return true;
  }

  // Публичный API
  return {
    create(data) {
      validateUser(data);
      const id = nextId++;
      users.set(id, { id, ...data, createdAt: Date.now() });
      return id;
    },
    get(id) { return users.get(id); },
    list() { return [...users.values()]; },
    remove(id) { return users.delete(id); },
    count() { return users.size; }
  };
})();

const logEl = document.getElementById('module-log');
const log = (m) => { logEl.textContent += m + '\n'; };

// Используем модуль
const id1 = UserModule.create({ name: 'Алиса', email: 'alice@example.com' });
const id2 = UserModule.create({ name: 'Боб', email: 'bob@example.com' });
log('Создано пользователей: ' + UserModule.count());
log('Пользователь 1: ' + JSON.stringify(UserModule.get(id1)));

UserModule.remove(id1);
log('После удаления: ' + UserModule.count());

try { UserModule.create({ name: 'X', email: 'bad' }); }
catch(e) { log('Ошибка валидации: ' + e.message); }

// Динамический импорт
document.getElementById('load-chart').addEventListener('click', async (e) => {
  e.target.disabled = true;
  e.target.textContent = '⏳ Загружаю...';
  try {
    // Эмуляция динамического импорта внешнего модуля
    const el = document.getElementById('chart-area');
    el.innerHTML = '<div style="color:#9aa0aa">Загружаю модуль визуализации...</div>';
    await new Promise(r => setTimeout(r, 800));
    const data = [65, 85, 45, 90, 70, 80, 60];
    const max = Math.max(...data);
    el.innerHTML = '<div style="display:flex;gap:4px;align-items:flex-end;height:60px">' +
      data.map((v, i) =>
        \`<div style="flex:1;background:hsl(\${200+i*20},70%,60%);height:\${(v/max*100)}%;border-radius:3px 3px 0 0;transition:height .5s"
              title="\${v}"></div>\`
      ).join('') + '</div><div style="font-size:.75rem;color:#9aa0aa;margin-top:.3rem">Данные загружены динамически</div>';
    log('\nДинамический модуль загружен ✅');
  } finally {
    e.target.disabled = false;
    e.target.textContent = 'Загрузить Chart (динамически)';
  }
});`,
    tips: [
      "Динамический import() — основа code splitting: грузи тяжёлые модули только когда нужны",
      "ES Modules автоматически в строгом режиме — нет неявных глобальных переменных",
      "<script type='module'> всегда deferred — не нужен атрибут defer",
      "Один default export на файл, именованных — сколько угодно. Предпочитай именованные для явности",
    ],
  },
  {
    id: "js-click-counter",
    category: "js",
    level: "beginner",
    title: "Счётчик кликов: пошаговый разбор от нуля",
    body: `Счётчик кликов — один из самых наглядных примеров взаимодействия HTML, CSS и JavaScript. Разберём полностью, шаг за шагом.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 ЧТО ПРОИСХОДИТ «ПОД КАПОТОМ»
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. HTML создаёт кнопку <button> и элемент для отображения числа
2. JavaScript «слушает» нажатия на кнопку (addEventListener)
3. При каждом клике значение переменной увеличивается
4. JS обновляет текст на экране (textContent)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 ПЕРЕМЕННАЯ — ХРАНИЛИЩЕ ЧИСЛА
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

\`\`\`js
let count = 0;
\`\`\`
• \`let\` — переменная, значение которой можно менять
• \`count\` — имя (можно назвать что угодно: clicks, score, n)
• \`= 0\` — начальное значение (ноль)

Переменная живёт в памяти браузера. Обновляешь страницу — она сбрасывается в 0.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 НАЙТИ ЭЛЕМЕНТ В HTML
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

\`\`\`js
const btn = document.getElementById('my-btn');
const display = document.getElementById('count-display');
\`\`\`
• \`document\` — весь HTML-документ
• \`getElementById('id')\` — найти элемент по id
• \`const\` — переменная-ссылка на элемент (не меняется)

Важно: id в HTML и id в JS должны совпадать символ в символ!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👂 ОБРАБОТЧИК КЛИКА
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

\`\`\`js
btn.addEventListener('click', function() {
  count++;               // count = count + 1
  display.textContent = count;
});
\`\`\`
• \`addEventListener('click', fn)\` — «слушать» клики
• Функция внутри — это то, что выполняется при каждом клике
• \`count++\` — короткая запись count = count + 1
• \`display.textContent = count\` — показать число на странице

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
➕ ПОЛНЫЙ РАБОЧИЙ КОД (минимальный)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**HTML:**
\`\`\`html
<button id="my-btn">Нажми меня!</button>
<p>Кликов: <span id="count-display">0</span></p>
\`\`\`

**JS:**
\`\`\`js
let count = 0;
const btn = document.getElementById('my-btn');
const display = document.getElementById('count-display');

btn.addEventListener('click', function() {
  count++;
  display.textContent = count;
});
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 УСОВЕРШЕНСТВОВАННАЯ ВЕРСИЯ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Добавляем кнопку сброса, уменьшение, анимацию:

\`\`\`js
let count = 0;

function updateDisplay() {
  const display = document.getElementById('count-display');
  display.textContent = count;
  // Цвет зависит от значения
  if (count > 0) display.style.color = '#22c55e';      // зелёный
  else if (count < 0) display.style.color = '#ef4444'; // красный
  else display.style.color = '#e8eaed';                // белый
  // Анимация
  display.style.transform = 'scale(1.3)';
  setTimeout(() => { display.style.transform = 'scale(1)'; }, 150);
}

document.getElementById('btn-plus').addEventListener('click', () => { count++; updateDisplay(); });
document.getElementById('btn-minus').addEventListener('click', () => { count--; updateDisplay(); });
document.getElementById('btn-reset').addEventListener('click', () => { count = 0; updateDisplay(); });
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐛 ЧАСТЫЕ ОШИБКИ НОВИЧКОВ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ Забыли \`let count = 0\` — переменная не объявлена, ошибка ReferenceError
❌ \`getElemenById\` (опечатка) — ошибка, проверь каждую букву
❌ id в HTML: \`count-display\`, в JS: \`countDisplay\` — не найдёт элемент!
❌ \`display.textContent = count++\` — сначала покажет старое значение, потом прибавит
❌ \`const count = 0\` вместо \`let\` — нельзя менять константу, ошибка TypeError`,
    html: `<div class="counter-app">
  <h2>🎯 Счётчик кликов</h2>
  <div class="display-wrapper">
    <div id="count-display" class="count-display">0</div>
    <div class="count-label">кликов</div>
  </div>
  <div class="btn-row">
    <button id="btn-minus" class="btn btn-red">−</button>
    <button id="btn-plus" class="btn btn-green">+</button>
  </div>
  <button id="btn-reset" class="btn-reset">🔄 Сброс</button>
  <div id="history" class="history"></div>
</div>`,
    css: `body { font-family: system-ui; background: #1a1d23; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
.counter-app { background: #252830; border-radius: 20px; padding: 2rem; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.5); min-width: 280px; }
h2 { color: #e8eaed; margin-bottom: 1.5rem; }
.display-wrapper { margin: 1rem 0; }
.count-display { font-size: 5rem; font-weight: 900; color: #e8eaed; transition: transform 0.15s, color 0.3s; line-height: 1; }
.count-label { color: #9aa0aa; font-size: 0.85rem; margin-top: 0.3rem; }
.btn-row { display: flex; gap: 1rem; justify-content: center; margin: 1.5rem 0 0.75rem; }
.btn { width: 60px; height: 60px; border: none; border-radius: 50%; font-size: 2rem; cursor: pointer; transition: transform 0.1s, box-shadow 0.1s; font-weight: bold; }
.btn:active { transform: scale(0.9); }
.btn-green { background: #22c55e; color: white; box-shadow: 0 4px 20px rgba(34,197,94,0.4); }
.btn-red { background: #ef4444; color: white; box-shadow: 0 4px 20px rgba(239,68,68,0.4); }
.btn-reset { background: transparent; border: 1px solid #3a3d46; color: #9aa0aa; padding: 0.5rem 1.2rem; border-radius: 8px; cursor: pointer; font-size: 0.85rem; }
.btn-reset:hover { background: #3a3d46; color: #e8eaed; }
.history { margin-top: 1rem; font-size: 0.75rem; color: #6b7280; min-height: 1.2rem; }`,
    js: `// ✅ ШАГ 1: Объявляем переменную-счётчик
let count = 0;
const history = [];

// ✅ ШАГ 2: Находим элементы HTML по их id
const display = document.getElementById('count-display');
const historyEl = document.getElementById('history');
const btnPlus = document.getElementById('btn-plus');
const btnMinus = document.getElementById('btn-minus');
const btnReset = document.getElementById('btn-reset');

// ✅ ШАГ 3: Функция обновления экрана
function updateDisplay(action) {
  // Показываем число
  display.textContent = count;

  // Цвет числа зависит от знака
  if (count > 0) display.style.color = '#22c55e';
  else if (count < 0) display.style.color = '#ef4444';
  else display.style.color = '#e8eaed';

  // Анимация «прыжок»
  display.style.transform = 'scale(1.4)';
  setTimeout(() => { display.style.transform = 'scale(1)'; }, 150);

  // История действий
  if (action) {
    history.unshift(action + ' → ' + count);
    if (history.length > 3) history.pop();
    historyEl.textContent = history.join('  |  ');
  }
}

// ✅ ШАГ 4: Добавляем обработчики кликов
btnPlus.addEventListener('click', () => {
  count++;               // count = count + 1
  updateDisplay('+1');
});

btnMinus.addEventListener('click', () => {
  count--;               // count = count - 1
  updateDisplay('−1');
});

btnReset.addEventListener('click', () => {
  count = 0;             // сбрасываем в ноль
  history.length = 0;
  updateDisplay(null);
  historyEl.textContent = '';
});

console.log('Счётчик инициализирован. Нажимай кнопки!');`,
    tips: [
      "let count = 0 — ВСЕГДА объявляй переменную ДО обработчика, иначе ReferenceError",
      "count++ это сокращение count = count + 1. Аналогично: count-- = count - 1",
      "textContent заменяет текст внутри элемента. innerHTML позволяет вставить HTML-теги",
      "Вынеси повторяющийся код в функцию updateDisplay() — принцип DRY (Don't Repeat Yourself)",
      "Храни все getElementById() в константах в начале — не ищи элементы внутри обработчика",
    ],
  },
  {
    id: "js-text-color",
    category: "js",
    level: "beginner",
    title: "Изменение цвета текста и фона через JavaScript",
    body: `JavaScript позволяет менять любые CSS-свойства «на лету» — прямо во время работы страницы. Разберём всё детально.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 КАК JS МЕНЯЕТ ЦВЕТА
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Каждый HTML-элемент имеет свойство \`style\` — это объект, содержащий все CSS-свойства. Через него JS может изменить любое свойство:

\`\`\`js
const element = document.getElementById('my-text');

// Цвет текста
element.style.color = 'red';
element.style.color = '#ff0000';
element.style.color = 'rgb(255, 0, 0)';
element.style.color = 'hsl(0, 100%, 50%)';

// Цвет фона
element.style.backgroundColor = 'blue';
element.style.backgroundColor = '#1a1d23';
\`\`\`

⚠️ Важно: в CSS пишем \`background-color\`, в JS — \`backgroundColor\` (camelCase, без дефиса)!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ТАБЛИЦА СООТВЕТСТВИЙ CSS → JS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| CSS-свойство        | JS-свойство           |
|---------------------|-----------------------|
| color               | style.color           |
| background-color    | style.backgroundColor |
| font-size           | style.fontSize        |
| font-weight         | style.fontWeight      |
| border-color        | style.borderColor     |
| text-decoration     | style.textDecoration  |
| border-radius       | style.borderRadius    |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 ПЕРЕКЛЮЧЕНИЕ КЛАССОВ (лучший способ)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Вместо прямого изменения style лучше добавлять/убирать CSS-классы:

\`\`\`js
element.classList.add('highlight');     // добавить класс
element.classList.remove('highlight');  // убрать класс
element.classList.toggle('highlight');  // включить/выключить
element.classList.contains('active');   // проверить наличие → true/false
\`\`\`

В CSS:
\`\`\`css
.highlight { color: yellow; background: #333; }
\`\`\`

Это чище, потому что стили остаются в CSS (не в JS), и анимации через transition работают автоматически.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌈 ДИНАМИЧЕСКИЕ ЦВЕТА
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Цвет можно вычислять динамически — например, случайный цвет:

\`\`\`js
// Случайный HEX цвет
function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}
element.style.color = randomColor();

// Случайный HSL цвет (более контролируемый)
function randomHsl() {
  const hue = Math.floor(Math.random() * 360);
  return \`hsl(\${hue}, 70%, 60%)\`;
}
element.style.color = randomHsl();

// Цвет из массива
const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'];
let colorIndex = 0;
btn.addEventListener('click', () => {
  element.style.color = colors[colorIndex % colors.length];
  colorIndex++;
});
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 ЦВЕТ ИЗ <input type="color">
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Браузер имеет встроенный выбор цвета:

**HTML:**
\`\`\`html
<input type="color" id="color-picker" value="#6366f1">
<p id="my-text">Этот текст меняет цвет</p>
\`\`\`

**JS:**
\`\`\`js
const picker = document.getElementById('color-picker');
const text = document.getElementById('my-text');

// Меняем цвет при каждом изменении выбора
picker.addEventListener('input', (e) => {
  text.style.color = e.target.value;
});
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ПЛАВНЫЕ ПЕРЕХОДЫ (transition)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Чтобы цвет менялся плавно — добавь CSS transition:

\`\`\`css
p {
  transition: color 0.4s ease, background-color 0.4s ease;
}
\`\`\`

После этого любое изменение color или background-color через JS будет анимированным автоматически.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐛 ЧАСТЫЕ ОШИБКИ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ \`element.style.background-color\` — дефис нельзя! Только camelCase
❌ \`element.style.color = red\` — без кавычек. Нужно: \`'red'\`
❌ \`element.style.color = '#abc'\` — короткий HEX работает, но \`#aabbcc\` надёжнее
❌ Изменяешь стиль, а ничего не меняется? Проверь, нашёлся ли элемент: \`console.log(element)\``,
    html: `<div class="app">
  <h2 id="main-title">🎨 Управление цветами</h2>
  <p id="demo-text" class="demo-text">
    Этот текст меняет цвет по нажатию кнопок.<br>
    Попробуй все варианты!
  </p>

  <section>
    <h3>Выбрать цвет текста</h3>
    <div class="palette" id="text-palette">
      <button class="swatch" data-color="#ef4444" style="background:#ef4444"></button>
      <button class="swatch" data-color="#f97316" style="background:#f97316"></button>
      <button class="swatch" data-color="#eab308" style="background:#eab308"></button>
      <button class="swatch" data-color="#22c55e" style="background:#22c55e"></button>
      <button class="swatch" data-color="#06b6d4" style="background:#06b6d4"></button>
      <button class="swatch" data-color="#6366f1" style="background:#6366f1"></button>
      <button class="swatch" data-color="#ec4899" style="background:#ec4899"></button>
      <button class="swatch" data-color="#e8eaed" style="background:#e8eaed"></button>
    </div>
  </section>

  <section>
    <h3>Произвольный цвет</h3>
    <div class="row">
      <input type="color" id="text-color-picker" value="#6366f1">
      <span class="label">Цвет текста</span>
      <input type="color" id="bg-color-picker" value="#1a1d23">
      <span class="label">Фон</span>
    </div>
  </section>

  <section>
    <h3>Быстрые действия</h3>
    <div class="row">
      <button id="btn-random">🎲 Случайный цвет</button>
      <button id="btn-rainbow">🌈 Радуга</button>
      <button id="btn-reset-color">↩️ Сброс</button>
    </div>
  </section>
</div>`,
    css: `body { font-family: system-ui; background: #1a1d23; color: #e8eaed; padding: 1.5rem; margin: 0; }
.app { max-width: 520px; margin: 0 auto; }
h2 { text-align: center; margin-bottom: 1.5rem; }
h3 { color: #9aa0aa; font-size: 0.82rem; text-transform: uppercase; letter-spacing: .05em; margin: 1.2rem 0 0.6rem; }
.demo-text { font-size: 1.2rem; line-height: 1.7; background: #252830; padding: 1.2rem 1.5rem; border-radius: 12px; color: #e8eaed; transition: color 0.4s ease, background-color 0.4s ease; margin-bottom: 1rem; }
.palette { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.swatch { width: 36px; height: 36px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; transition: transform 0.15s, border-color 0.15s; }
.swatch:hover { transform: scale(1.2); border-color: white; }
.row { display: flex; align-items: center; gap: 0.7rem; flex-wrap: wrap; }
.label { font-size: 0.8rem; color: #9aa0aa; }
input[type="color"] { width: 48px; height: 36px; border: none; border-radius: 8px; cursor: pointer; padding: 2px; background: #2a2d36; }
button { padding: 0.5rem 1rem; background: #3a3d46; color: #e8eaed; border: none; border-radius: 8px; cursor: pointer; font-size: 0.85rem; transition: background 0.15s; }
button:hover { background: #4a4d56; }
section { background: #252830; border-radius: 12px; padding: 0.8rem 1rem; margin-bottom: 0.7rem; }`,
    js: `const text = document.getElementById('demo-text');
const title = document.getElementById('main-title');

// ──── Палитра: клик по цветовому кружку ────
document.getElementById('text-palette').addEventListener('click', (e) => {
  if (e.target.classList.contains('swatch')) {
    // Меняем цвет текста (style.color принимает любой CSS-цвет)
    text.style.color = e.target.dataset.color;
    console.log('Цвет текста:', e.target.dataset.color);
  }
});

// ──── Color picker для текста ────
document.getElementById('text-color-picker').addEventListener('input', (e) => {
  // e.target.value содержит HEX-цвет, например '#ff6b6b'
  text.style.color = e.target.value;
});

// ──── Color picker для фона ────
document.getElementById('bg-color-picker').addEventListener('input', (e) => {
  // backgroundColor — camelCase! (не background-color)
  text.style.backgroundColor = e.target.value;
});

// ──── Случайный цвет ────
document.getElementById('btn-random').addEventListener('click', () => {
  // HSL удобнее: контролируем яркость (60%) для читаемости
  const hue = Math.floor(Math.random() * 360);
  const color = \`hsl(\${hue}, 80%, 65%)\`;
  text.style.color = color;
  title.style.color = color;
  console.log('Случайный цвет:', color);
});

// ──── Радуга (автоматически меняющийся цвет) ────
let rainbowInterval = null;
let rainbowHue = 0;

document.getElementById('btn-rainbow').addEventListener('click', () => {
  if (rainbowInterval) {
    // Уже работает — останавливаем
    clearInterval(rainbowInterval);
    rainbowInterval = null;
    return;
  }
  // Запускаем: каждые 50мс меняем оттенок HSL
  rainbowInterval = setInterval(() => {
    rainbowHue = (rainbowHue + 3) % 360;
    text.style.color = \`hsl(\${rainbowHue}, 80%, 65%)\`;
  }, 50);
});

// ──── Сброс к исходному виду ────
document.getElementById('btn-reset-color').addEventListener('click', () => {
  text.style.color = '';           // пустая строка = убрать inline стиль
  text.style.backgroundColor = '';
  title.style.color = '';
  if (rainbowInterval) {
    clearInterval(rainbowInterval);
    rainbowInterval = null;
  }
});`,
    tips: [
      "CSS-свойства в JS пишутся camelCase: background-color → backgroundColor, font-size → fontSize",
      "element.style.color = '' (пустая строка) убирает inline-стиль и возвращает CSS-класс",
      "classList.toggle('active') — чище, чем менять style напрямую. Стили остаются в CSS",
      "Для плавных переходов добавь в CSS: transition: color 0.3s ease — работает автоматически",
      "HSL-цвета удобны для генерации: hsl(hue, 70%, 60%) — только меняй hue от 0 до 360",
    ],
  },
  {
    id: "js-text-input",
    category: "js",
    level: "beginner",
    title: "Поля ввода: input, textarea — чтение, запись, события",
    body: `Поля ввода (<input> и <textarea>) — главный способ получать данные от пользователя. Разберём полностью.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ТИПЫ ПОЛЕЙ ВВОДА
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

\`\`\`html
<!-- Однострочный ввод -->
<input type="text" id="name" placeholder="Введи имя">
<input type="number" id="age" min="0" max="150" value="18">
<input type="email" id="email" placeholder="user@mail.ru">
<input type="password" id="pass" placeholder="Пароль">

<!-- Многострочный ввод -->
<textarea id="comment" rows="4" placeholder="Комментарий..."></textarea>
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 ЧИТАЕМ ТО, ЧТО НАПИСАЛ ПОЛЬЗОВАТЕЛЬ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

\`\`\`js
const input = document.getElementById('name');

// Прочитать текущее значение
const value = input.value;
console.log(value); // всё что написано в поле

// Проверить что поле не пустое
if (input.value.trim() === '') {
  alert('Поле не должно быть пустым!');
}
\`\`\`

⚠️ \`.value\` — всегда строка, даже для \`type="number"\`!
Для чисел: \`const num = Number(input.value)\` или \`parseInt(input.value)\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ ЗАПИСЫВАЕМ ЗНАЧЕНИЕ В ПОЛЕ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

\`\`\`js
input.value = 'Привет!';   // вставить текст
input.value = '';           // очистить поле
input.focus();              // поставить курсор
input.select();             // выделить весь текст
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👂 СОБЫТИЯ ПОЛЕЙ ВВОДА
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Событие   | Когда срабатывает                           |
|-----------|---------------------------------------------|
| input     | При КАЖДОМ изменении (каждая буква)         |
| change    | После потери фокуса (если значение изменилось) |
| focus     | Когда кликнули в поле                       |
| blur      | Когда ушли из поля                          |
| keydown   | Когда нажали клавишу                        |
| keyup     | Когда отпустили клавишу                     |

\`\`\`js
// Реагируем на каждый вводимый символ (лучше для live-preview)
input.addEventListener('input', (e) => {
  console.log('Сейчас в поле:', e.target.value);
  preview.textContent = e.target.value;
});

// Реагируем на Enter
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    console.log('Нажат Enter! Значение:', input.value);
  }
});
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔢 ЧИСЛОВОЙ INPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

\`\`\`js
const numInput = document.getElementById('qty');

numInput.addEventListener('input', () => {
  // ВАЖНО: value — всегда строка, конвертируем в число
  const qty = parseInt(numInput.value, 10);

  if (isNaN(qty)) {
    result.textContent = 'Введи число';
  } else if (qty < 1) {
    result.textContent = 'Минимум 1';
  } else {
    result.textContent = \`Итого: \${qty * 150} ₽\`;
  }
});
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧹 ОЧИСТКА И ВАЛИДАЦИЯ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

\`\`\`js
function validate(input) {
  const val = input.value.trim(); // trim() убирает пробелы по краям
  if (val === '') {
    input.style.borderColor = '#ef4444'; // красная рамка
    return false;
  }
  input.style.borderColor = '#22c55e';   // зелёная рамка
  return true;
}

// Ограничение длины (дополнение к maxlength в HTML)
input.addEventListener('input', () => {
  if (input.value.length > 50) {
    input.value = input.value.slice(0, 50); // обрезаем
  }
  counter.textContent = \`\${input.value.length}/50\`;
});
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐛 ЧАСТЫЕ ОШИБКИ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ \`input.textContent\` — не работает для input! Только \`.value\`
❌ Сравниваешь \`input.value == 5\` для числового поля — value это '5' (строка), не 5. Используй Number()
❌ Забыл \`.trim()\` — " Привет " !== "Привет". Пробелы невидимы, но ломают сравнение
❌ Событие \`change\` не срабатывает пока поле в фокусе — используй \`input\` для мгновенной реакции
❌ \`textarea.value\` не \`textarea.textContent\` — они разные! Value — то что введено сейчас`,
    html: `<div class="app">
  <h2>⌨️ Работа с полями ввода</h2>

  <!-- Секция 1: Живой предпросмотр -->
  <section>
    <h3>Живой предпросмотр</h3>
    <input type="text" id="name-input" class="field" placeholder="Введи своё имя...">
    <div class="preview-box">
      Привет, <span id="name-preview" class="highlight">мир</span>! 👋
    </div>
  </section>

  <!-- Секция 2: Счётчик символов -->
  <section>
    <h3>Textarea с счётчиком</h3>
    <textarea id="comment" class="field" rows="3"
              placeholder="Напиши комментарий (макс. 100 символов)..."></textarea>
    <div class="counter-row">
      <span id="char-count">0</span>/100 символов
      <span id="len-status"></span>
    </div>
  </section>

  <!-- Секция 3: Числовое поле -->
  <section>
    <h3>Калькулятор цены</h3>
    <div class="calc-row">
      <input type="number" id="qty-input" class="field field-sm"
             value="1" min="1" max="99" placeholder="Кол-во">
      <span>× 250 ₽ =</span>
      <span id="total" class="total">250 ₽</span>
    </div>
  </section>

  <!-- Секция 4: Форма с валидацией -->
  <section>
    <h3>Мини-форма</h3>
    <input type="text" id="form-name" class="field" placeholder="Имя (обязательно)">
    <input type="email" id="form-email" class="field" placeholder="Email (обязательно)">
    <button id="submit-btn" class="btn">Отправить</button>
    <div id="form-result" class="result"></div>
  </section>
</div>`,
    css: `body { font-family: system-ui; background: #1a1d23; color: #e8eaed; padding: 1.5rem; margin: 0; }
.app { max-width: 460px; margin: 0 auto; }
h2 { text-align: center; margin-bottom: 1.2rem; }
h3 { color: #9aa0aa; font-size: 0.8rem; text-transform: uppercase; letter-spacing: .05em; margin: 0 0 0.6rem; }
section { background: #252830; border-radius: 12px; padding: 1rem; margin-bottom: 0.8rem; }
.field { width: 100%; box-sizing: border-box; padding: 0.6rem 0.8rem; background: #1a1d23; border: 1.5px solid #3a3d46; border-radius: 8px; color: #e8eaed; font-size: 0.9rem; font-family: inherit; margin-bottom: 0.5rem; outline: none; transition: border-color 0.2s; }
.field:focus { border-color: #6366f1; }
textarea.field { resize: vertical; min-height: 70px; }
.field-sm { width: 90px; }
.preview-box { background: #1a1d23; border-radius: 8px; padding: 0.7rem 1rem; font-size: 1rem; border-left: 3px solid #6366f1; }
.highlight { color: #6366f1; font-weight: 600; }
.counter-row { display: flex; align-items: center; gap: 0.7rem; font-size: 0.8rem; color: #9aa0aa; }
#char-count { font-weight: 700; color: #e8eaed; }
#len-status { font-size: 0.75rem; }
.calc-row { display: flex; align-items: center; gap: 0.7rem; }
.total { font-size: 1.3rem; font-weight: 700; color: #22c55e; }
.btn { padding: 0.6rem 1.4rem; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9rem; width: 100%; margin-top: 0.5rem; }
.btn:hover { background: #5254cc; }
.result { margin-top: 0.7rem; padding: 0.5rem 0.8rem; border-radius: 8px; font-size: 0.9rem; display: none; }
.result.success { display: block; background: #14532d; color: #4ade80; }
.result.error { display: block; background: #450a0a; color: #f87171; }`,
    js: `// ═══════════════════════════════════════
// СЕКЦИЯ 1: Живой предпросмотр имени
// ═══════════════════════════════════════
const nameInput = document.getElementById('name-input');
const namePreview = document.getElementById('name-preview');

// 'input' срабатывает на КАЖДЫЙ введённый символ
nameInput.addEventListener('input', () => {
  // .value — то, что написано в поле прямо сейчас
  const name = nameInput.value.trim();
  namePreview.textContent = name || 'мир'; // если пусто — показать 'мир'
});

// ═══════════════════════════════════════
// СЕКЦИЯ 2: Счётчик символов в textarea
// ═══════════════════════════════════════
const comment = document.getElementById('comment');
const charCount = document.getElementById('char-count');
const lenStatus = document.getElementById('len-status');
const MAX_LEN = 100;

comment.addEventListener('input', () => {
  const len = comment.value.length;

  // Показываем счётчик
  charCount.textContent = len;

  // Если превышен лимит — обрезаем
  if (len > MAX_LEN) {
    comment.value = comment.value.slice(0, MAX_LEN);
    charCount.textContent = MAX_LEN;
    lenStatus.textContent = '⛔ Лимит!';
    lenStatus.style.color = '#ef4444';
  } else if (len > MAX_LEN * 0.8) {
    lenStatus.textContent = '⚠️ Осторожно';
    lenStatus.style.color = '#eab308';
  } else {
    lenStatus.textContent = '';
  }
});

// ═══════════════════════════════════════
// СЕКЦИЯ 3: Калькулятор цены
// ═══════════════════════════════════════
const qtyInput = document.getElementById('qty-input');
const totalEl = document.getElementById('total');
const PRICE = 250;

qtyInput.addEventListener('input', () => {
  // .value всегда строка! Конвертируем в число
  const qty = parseInt(qtyInput.value, 10);

  if (isNaN(qty) || qty < 1) {
    totalEl.textContent = '— ₽';
    totalEl.style.color = '#ef4444';
  } else {
    totalEl.textContent = (qty * PRICE).toLocaleString('ru') + ' ₽';
    totalEl.style.color = '#22c55e';
  }
});

// ═══════════════════════════════════════
// СЕКЦИЯ 4: Валидация формы
// ═══════════════════════════════════════
const formName = document.getElementById('form-name');
const formEmail = document.getElementById('form-email');
const submitBtn = document.getElementById('submit-btn');
const formResult = document.getElementById('form-result');

function setFieldState(field, isValid) {
  field.style.borderColor = isValid ? '#22c55e' : '#ef4444';
}

submitBtn.addEventListener('click', () => {
  const name = formName.value.trim();
  const email = formEmail.value.trim();
  let ok = true;

  // Проверяем имя
  if (name === '') { setFieldState(formName, false); ok = false; }
  else { setFieldState(formName, true); }

  // Проверяем email: должен содержать @
  if (!email.includes('@') || email.length < 5) {
    setFieldState(formEmail, false); ok = false;
  } else { setFieldState(formEmail, true); }

  // Показываем результат
  formResult.className = ok ? 'result success' : 'result error';
  formResult.textContent = ok
    ? \`✅ Отправлено! Имя: \${name}, Email: \${email}\`
    : '❌ Заполни все поля правильно';

  // Очищаем форму при успехе
  if (ok) {
    setTimeout(() => {
      formName.value = '';
      formEmail.value = '';
      formResult.className = 'result';
      [formName, formEmail].forEach(f => f.style.borderColor = '');
    }, 2500);
  }
});

// Enter в любом поле = нажать кнопку
[formName, formEmail].forEach(field => {
  field.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitBtn.click();
  });
});

console.log('✅ Демо поля ввода готово!');`,
    tips: [
      "input.value — всегда строка. Для чисел используй Number(input.value) или parseInt/parseFloat",
      "Событие 'input' срабатывает мгновенно при каждом символе. 'change' — только после потери фокуса",
      "trim() убирает пробелы по краям: '  Привет  '.trim() === 'Привет'",
      "Для textarea.value работает так же как для input.value — разницы нет",
      "input.focus() — программно ставит курсор. input.select() — выделяет весь текст",
    ],
  },
];
