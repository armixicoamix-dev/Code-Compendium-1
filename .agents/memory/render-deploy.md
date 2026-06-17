---
name: Render deployment config
description: How to deploy Code Mentor to Render as a static site.
---

## render.yaml location
At workspace root: `render.yaml`

## Build command
```
npm install -g pnpm && pnpm install --frozen-lockfile && BASE_PATH=/ pnpm --filter @workspace/code-mentor run build
```
**Why:** Render doesn't have pnpm pre-installed. BASE_PATH must be set for Vite base config.
**How to apply:** Always pass BASE_PATH=/ explicitly; vite.config.ts now defaults it but render.yaml sets it explicitly for clarity.

## Static publish path
`artifacts/code-mentor/dist/public`

## SPA routing
Rewrite `/*` → `/index.html` (in render.yaml routes section).
