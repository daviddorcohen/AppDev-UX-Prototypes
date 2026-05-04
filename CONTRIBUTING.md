# How to Add a New Prototype

## Overview

Each prototype is a standalone Vite + React + PatternFly v6 app that lives under `prototypes/{name}/`. The launcher at `launcher/` links to all prototypes. GitHub Actions builds everything and deploys to GitHub Pages.

**Repo**: https://github.com/yuvalgalanti/AppDev-UX-Prototypes (branch: `ux-prototypes`)  
**Live site**: https://yuvalgalanti.github.io/AppDev-UX-Prototypes/

## Two types of prototypes

**Hosted prototype** — built and deployed within this repo (e.g., MTA at `/mta/`). Requires all 5 steps below.

**External prototype** — hosted elsewhere, only needs a launcher card entry with an `externalUrl` (e.g., Podman Desktop). Only requires Step 4.

---

## Step 1 — Copy the template

```bash
cp -R prototypes/_template prototypes/my-prototype
```

This gives you:
- `package.json` — dependencies (React 18, PatternFly v6, react-router-dom v7, Vite 6)
- `vite.config.ts` — needs the base path updated
- `src/main.tsx` — entry point with the "Back to all prototypes" bar
- `src/App.tsx` — starter app shell with PatternFly Page layout

## Step 2 — Update the base paths

Two files need the prototype name:

**`prototypes/my-prototype/vite.config.ts`** — change `PROTOTYPE_NAME` to your folder name:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/AppDev-UX-Prototypes/my-prototype/',
})
```

**`prototypes/my-prototype/src/main.tsx`** — update the `BrowserRouter` basename:

```tsx
<BrowserRouter basename="/AppDev-UX-Prototypes/my-prototype">
```

## Step 3 — Build your prototype

- Edit `src/App.tsx` and add pages under `src/pages/`
- Add an `index.html` at the root of your prototype folder (copy from the template or MTA)
- Add a `tsconfig.json` (copy from the template or MTA)
- Run locally: `cd prototypes/my-prototype && npm install && npm run dev`
- Verify it builds: `npm run build`

**Key rules** (from `.cursor/rules/prototypes.mdc`):
- Use PatternFly v6 components only (`pf-v6-` prefixes)
- No Tailwind — use PF utility classes and design tokens
- Use `Title` for headings, `Content` for body text
- Use semantic design tokens for custom CSS

## Step 4 — Register in the launcher

Edit `launcher/src/prototypes.ts` and add an entry to the `prototypes` array:

**For a hosted prototype:**

```typescript
{
  name: 'My Prototype',
  project: 'The Project Name',
  product: 'RHDH',           // One of: RHDH, MTA, Konflux, TPA, TAS, Podman Desktop, RHCL, DevSpaces
  description: 'A brief description of what this prototype demonstrates.',
  path: '/AppDev-UX-Prototypes/my-prototype/',
  status: 'Active',          // Active, In Progress, or Planned
  lastUpdated: 'May 4, 2026',
},
```

**For an external prototype (hosted elsewhere):**

```typescript
{
  name: 'External Prototype',
  project: 'The Project Name',
  product: 'Podman Desktop',
  description: 'Description of the prototype.',
  externalUrl: 'https://example.com/prototype/',
  path: '',
  status: 'Active',
  lastUpdated: 'May 4, 2026',
},
```

## Step 5 — Wire up the build and deploy pipeline

Three places need to know about your new prototype:

**`package.json`** — add install, build, and assemble steps:

```json
{
  "scripts": {
    "install:all": "... && cd ../my-prototype && npm install",
    "build:my-prototype": "cd prototypes/my-prototype && npm run build",
    "build": "... && npm run build:my-prototype && npm run assemble",
    "assemble": "... && mkdir -p dist/my-prototype && cp -R prototypes/my-prototype/dist/* dist/my-prototype/"
  }
}
```

**`.github/workflows/deploy.yml`** — add a build step and extend the assemble step:

```yaml
      - name: Install and build My Prototype
        working-directory: prototypes/my-prototype
        run: npm install && npm run build
```

And in the "Assemble dist" step:

```yaml
          mkdir -p _site/my-prototype
          cp -R prototypes/my-prototype/dist/* _site/my-prototype/
```

---

## Quick checklist

- [ ] Copied `prototypes/_template/` to `prototypes/{name}/`
- [ ] Updated `vite.config.ts` base to `/AppDev-UX-Prototypes/{name}/`
- [ ] Updated `main.tsx` BrowserRouter basename to `/AppDev-UX-Prototypes/{name}`
- [ ] Added `index.html` and `tsconfig.json`
- [ ] Built successfully with `npm run build`
- [ ] Added entry to `launcher/src/prototypes.ts`
- [ ] Added build step to root `package.json`
- [ ] Added build + assemble steps to `.github/workflows/deploy.yml`
- [ ] Pushed to `ux-prototypes` branch
- [ ] Verified GitHub Actions build passes
- [ ] Verified prototype loads at `https://yuvalgalanti.github.io/AppDev-UX-Prototypes/{name}/`

## File map

```
prototypes/my-prototype/
├── index.html              # HTML entry point
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config with base path
└── src/
    ├── main.tsx            # Entry with back-to-launcher bar + BrowserRouter
    ├── App.tsx             # Root component with PF Page layout
    └── pages/              # Page components
```
