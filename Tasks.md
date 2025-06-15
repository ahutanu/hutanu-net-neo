# Remaining Work

This repository contains a React 18 implementation of the hutanu.net terminal-style website. The current state includes:

- React + TypeScript setup with Bootstrap styling
- Terminal component supporting `help`, `about`, `career`, `contact`, `clear`, and `dark`
- Career information parsed from `web/public/Profile.pdf`
- Static content loaded from `web/public/content.json`
- Jest tests currently cover about 70% of the code; thresholds require 90%
- Build verified with `npm run build`
- Basic instructions in `README.md` files

## Recent Progress
- Installed dependencies and validated tests and build.
- Ran Playwright against hutanu.net and the local build.
- Removed coverage ignore comment so coverage metrics are reported.
- Outputs for many commands differ from the original site, so full CLI parity has not been achieved yet.

## Outstanding Tasks

1. **Replicate full CLI from hutanu.net**
   - Help command now matches the live site thanks to Playwright-based testing.
   - Remaining differences include the file system structure and some command outputs such as `ls`.
   - Continue comparing with Playwright and update `fs.json` and command logic until all outputs are identical.

2. **Improve career data parsing**
   - Extract structured information from `Profile.pdf` instead of a truncated blob.
   - Allow multi-page PDFs and display sections cleanly.
   - Continue updating automatically when the PDF is replaced.

3. **Mail form accessibility**
   - Recreate the `mail`/`mail.app` commands with a modal form for sending mail.
   - Include proper ARIA labels and keyboard navigation.

4. **Accessibility and responsiveness**
   - Audit color contrast and add ARIA attributes to meet WCAG AA.
   - Verify the layout adapts on small screens and in light/dark mode.

5. **Documentation and deployment**
   - Document all commands and how to update content without code changes.
   - Provide steps to run tests (90%+ coverage) and build for production.
   - Explain how to deploy the Vite build to static hosting.

6. **Maintain high test coverage**
   - Add unit tests for all new commands and components to keep coverage above 90%.

These tasks will complete the modernization while preserving the retro look and ensuring easy maintenance.
