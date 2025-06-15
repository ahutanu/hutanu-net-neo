# hutanu.net neo

React-based reimplementation of the personal site with terminal aesthetics.
See `web/` for the source code.

## Development

```bash
cd web
npm install
npm run dev
```

## Build

```bash
npm run build
```

To update career information, replace `web/public/Profile.pdf` with a new export.
Static text like the about and contact sections are stored in `web/public/content.json` so no code changes are required for edits.
Run `npm test` inside `web` to verify the code. Tests require at least 90% coverage.
