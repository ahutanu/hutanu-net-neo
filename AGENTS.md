# Agent Instructions

This repository contains the code for **hutanu.net neo**, a modern reimplementation of the personal website [https://hutanu.net](https://hutanu.net). The goal is to recreate the original terminal-style interface using modern technologies while ensuring easy maintenance and accessibility.

## Goals

1. **Replicate hutanu.net** with visual parity but modern polish using **React 18**, **Bootstrap 5**, and **TypeScript**.
2. Maintain the terminal/CLI aesthetics including blinking cursor, command history, and tab autocompletion.
3. Mirror all existing commands, pages, routes, and metadata from the live site.
4. Fetch career information from `web/public/Profile.pdf` at runtime so updates require only replacing the PDF file.
5. Keep other content such as "about" and "contact" in JSON or other easily editable files under `web/public` so no code change is needed for updates.
6. Provide a responsive design with dark‑mode support and meet at least WCAG AA accessibility.
7. Ensure test coverage of **90% or more**. Use Jest and React Testing Library. Add Playwright tests to compare the CLI output against the original site.
8. Document setup, development, testing, and deployment steps in the README files.

## Current Status

- The project already includes a basic terminal component and a virtual file system, but command outputs do not yet match the original site.
- Unit tests exist but coverage is below the required 90%.
- Outstanding tasks are tracked in `Tasks.md`.

## Instructions for Codex

- Always review `Tasks.md` for the next uncompleted task and update it upon completion.
- Keep modifications within this repository. Do not attempt to alter external sites.
- When adding or modifying code, run `npm test --silent --coverage --coverageReporters=text-summary` and `npm run build` inside the `web` directory.
- Use Playwright to verify CLI behavior matches [https://hutanu.net](https://hutanu.net) before marking the parity task complete.
- Maintain accessibility by using semantic HTML, ARIA labels, and ensuring color contrast.
- Place all editable content (PDFs, JSON files) under `web/public` so site updates require no code changes.
- Maintain a modern look while preserving the retro terminal feel.
- Ensure the career section automatically parses and displays information from the current `Profile.pdf`.
- Keep documentation up to date so new contributors can easily build, test, and deploy.

Follow these instructions and complete all tasks listed in `Tasks.md` until the project meets the success criteria listed above.
