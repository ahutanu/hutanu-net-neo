# hutanu.net neo

This project rebuilds the retro terminal UI of [hutanu.net](https://hutanu.net) using React 18, Bootstrap 5 and TypeScript. Commands such as `help`, `about`, `career`, `contact`, `dark` and `clear` are supported.

Career information is parsed from `Profile.pdf` at runtime using `pdfjs-dist`. Replacing the PDF inside `public/` updates the career data automatically. Static texts are loaded from `public/content.json`.

You can edit the JSON or replace the PDF to update content without touching the source code.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Tests

```bash
npm test
```
