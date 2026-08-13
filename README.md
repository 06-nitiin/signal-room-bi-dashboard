# Signal Room BI Starter

This is the beginner-friendly starting point for the BI dashboard. It intentionally uses plain React elements and CSS instead of shadcn/ui components or chart libraries.

## Run locally

```bash
pnpm install
pnpm run dev
```

Open the Vite URL shown in the terminal.

## Validate

```bash
pnpm run check
pnpm run build
```

## Main files

- `client/src/pages/Home.tsx` contains the dashboard, local data arrays, navigation, filter, KPI cards, CSS bar chart, donut chart, table, model view, and insights view.
- `client/src/index.css` contains the complete visual styling.
- `client/src/App.tsx` renders the home page.
- `client/src/main.tsx` mounts React.
- `client/index.html` is the browser entry document.
- `package.json` contains the small dependency set and scripts.
- `vite.config.ts` and `tsconfig.json` are the minimum build/type-check configuration.

## Suggested first commit

```bash
git init
git add .
git commit -m "chore: initialize Signal Room BI starter"
```
