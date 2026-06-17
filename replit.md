# Code Mentor — NaniStitch

Интерактивная платформа для изучения Python, ООП, FastAPI, Flask, HTML/CSS/JS, SQL и PostgreSQL. Тренажёр с офлайн-режимом, живым редактором кода и методичками.

## Run & Operate

- `pnpm --filter @workspace/code-mentor run dev` — запустить фронтенд (порт 21812)
- `pnpm --filter @workspace/api-server run dev` — запустить API сервер (порт 5000)
- `pnpm run typecheck` — полная проверка типов
- `PORT=3000 BASE_PATH=/ pnpm --filter @workspace/code-mentor run build` — production-сборка
- `pnpm --filter @workspace/db run push` — применить миграции БД (только dev)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Radix UI, shadcn/ui, Wouter (routing)
- Python runner: Pyodide 0.25.0 (в браузере), офлайн Flask через локальные `.whl`
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Build: Vite (static SPA)

## Where things live

- `artifacts/code-mentor/src/data/` — все учебные данные (curriculum, методички, упражнения)
  - `fastapi-curriculum.ts` — 10 разделов FastAPI (~6800 строк)
  - `flask-curriculum.ts` — Flask
  - `curriculum.ts` + `curriculum-advanced.ts` — Python ООП (раунды 1-10)
  - `methodology.ts` — финальное задание с методичкой
- `artifacts/code-mentor/src/components/` — все React-компоненты
  - `PythonRunner.tsx` — офлайн Python runner (Pyodide + Flask wheels)
  - `ExerciseWriteFlask.tsx` — Flask тренажёр с двухпанельным редактором
  - `LessonView.tsx` — методичка + скачивание HTML
- `artifacts/code-mentor/public/wheels/` — Flask `.whl` для офлайн-установки
- `artifacts/code-mentor/public/sw.js` — Service Worker (офлайн кэш)
- `render.yaml` — конфиг для деплоя на Render

## Architecture decisions

- **Офлайн Python:** Pyodide загружается с CDN и кэшируется Service Worker. Flask wheels (`flask`, `werkzeug`, `jinja2`, `click`, `itsdangerous`, `blinker`) лежат в `public/wheels/` и устанавливаются через micropip без интернета.
- **Wheel URLs:** Используют `import.meta.env.BASE_URL` для корректной работы при любом base path.
- **vite.config.ts:** `PORT` и `BASE_PATH` опциональны (дефолты `3000` и `/`) — важно для Render-сборки без Replit-окружения.
- **Методички:** Q&A секции заменены на связный объяснительный текст (не вопрос-ответ).
- **Render:** статический хостинг, SPA rewrite `/* → /index.html`, build команда через pnpm workspace filter.

## Product

- Интерактивный тренажёр Python ООП (16 раундов, 181+ задание)
- Курсы FastAPI, Flask, HTML/CSS/JS, SQL, PostgreSQL, Junior/Middle/Senior треки
- Офлайн-режим: работает без интернета после первой загрузки
- Скачивание методичек в HTML-формате с тёмной темой
- Живой редактор кода с Pyodide (Python прямо в браузере)
- Флэшкарты, задания на пропуски, вопросы с открытым ответом

## User preferences

- Общение на русском языке.

## Gotchas

- **Render build:** всегда проверяй что `PORT` и `BASE_PATH` не required в vite.config.ts — или передавай их явно (`BASE_PATH=/ pnpm --filter @workspace/code-mentor run build`).
- **Wheel URLs:** используй `import.meta.env.BASE_URL.replace(/\/$/, "") + "/wheels/"` — не хардкоди `/wheels/`.
- **Service Worker** кэширует Pyodide (~50MB CDN) при первом запуске — нормально, не баг.
- **FastAPI offline:** pydantic/fastapi/httpx/anyio устанавливаются через micropip с интернета (не bundled), только Flask работает офлайн.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
