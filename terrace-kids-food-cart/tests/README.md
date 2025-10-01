Playwright tests for Terrace Kids Food Cart

Quick start:
1. Install Playwright (if not installed):
   npm i -D @playwright/test
   npx playwright install --with-deps

2. Start the dev server from the project root:
   npm run dev

3. Run the test:
   npx playwright test --project=chromium

Notes:
- Tests assume the app runs on http://localhost:3000
- The login form selectors are heuristics; adjust selectors if your markup differs.
