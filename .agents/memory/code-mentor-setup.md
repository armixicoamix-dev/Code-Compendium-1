---
name: Code Mentor project setup
description: Key decisions and gotchas for the Code Mentor learning platform (Python/FastAPI/Flask trainer).
---

## Wheel URL pattern
Flask `.whl` files live in `public/wheels/`. URL must use:
```ts
window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, "") + "/wheels/"
```
**Why:** `import.meta.env.BASE_URL` is baked in at build time by Vite from the `base` config. Hardcoding `/wheels/` breaks if the app is served from a subdirectory.
**How to apply:** Any component that installs local wheels (PythonRunner.tsx, ExerciseWriteFlask.tsx) must use this pattern.

## vite.config.ts PORT/BASE_PATH
Both are optional with defaults (3000 / "/"). Replit sets them via artifact.toml `[services.env]`, Render doesn't need them.
**Why:** Previously thrown as hard errors — broke `pnpm run build` in any non-Replit CI environment including Render.
**How to apply:** `const port = Number(process.env.PORT ?? 3000); const basePath = process.env.BASE_PATH ?? "/";`

## Offline mode coverage
- Pyodide 0.25.0 from CDN, cached by Service Worker after first load.
- Flask ONLY is fully offline (6 wheels bundled in `public/wheels/`).
- FastAPI/pydantic/httpx/anyio: installed via micropip from PyPI (needs internet).
- SQLAlchemy/sqlite3: sqlite3 bundled in Pyodide, SQLAlchemy via micropip.

## Curriculum content
- All 10 "### Вопросы — Ответы" QA sections in fastapi-curriculum.ts replaced with explanatory prose.
- Other curriculum files had no QA sections — confirmed by full audit.
- TypeScript typecheck passes cleanly after all edits. Production build succeeds.
