# AppDev UX Prototypes

A collection of UX prototypes built with PatternFly v6 and React, deployed via GitHub Pages.

**Live site:** [https://yuvalgalanti.github.io/AppDev-UX-Prototypes/](https://yuvalgalanti.github.io/AppDev-UX-Prototypes/)

## Prototypes

| Name | Description | Path |
|------|-------------|------|
| Konveyor / MTA | Migration Toolkit for Applications — Migrate and Analysis wizards | `/mta/` |

## Repo Structure

```
├── launcher/          # Landing page with cards linking to each prototype
├── prototypes/
│   ├── mta/           # Konveyor MTA prototype (Vite + React + PF v6)
│   └── _template/     # Starter template for new prototypes
├── .github/workflows/ # GitHub Pages deployment
└── .cursor/rules/     # Cursor rules for consistency
```

## Adding a New Prototype

1. Copy `prototypes/_template/` to `prototypes/your-name/`
2. Update `vite.config.ts` base path to `/AppDev-UX-Prototypes/your-name/`
3. Register in `launcher/src/prototypes.ts`
4. Add build + assemble steps in root `package.json` and `.github/workflows/deploy.yml`

## Development

```bash
# Install all dependencies
npm run install:all

# Build everything
npm run build

# Dev server for a specific prototype
cd prototypes/mta && npm run dev
```
