# GitHub Copilot Instructions for Terrace Kids Food Cart (repository-specific)

These instructions are generated from an analysis of the codebase and existing project files. They are technology- and pattern-specific — follow them exactly when Copilot suggests or generates code for this repository.

WARNING: Only follow guidance below. Do not introduce language features, runtime APIs, or library versions not present in the repository.

## Project snapshot (detected)
- Next.js: `15.5.3`
- React: `19.1.0`
- TypeScript: `^5` (project `tsconfig.json` present, `strict: true`)
- MUI (Material UI): `@mui/material` / `@mui/icons-material` `^7.3.2`
- Tailwind CSS: `^4` (project uses Tailwind alongside MUI)
- Framer Motion: `^12.23.18`
- next-auth: `^4.24.11`
- SQLite via `better-sqlite3`: `^12.4.1`
- Linting: `eslint-config-next` v`15.5.3`

Files used to detect patterns: `package.json`, `tsconfig.json`, `src/` and `src/lib` folder files (notably `src/lib/database/index.ts` & `src/lib/database/dal.ts`).

## High-level architectural guidance (follow exactly)
- Project uses the Next.js App Router (`app/` directory). Default to Server Components unless the file explicitly needs client-side features. When a component uses hooks, browser APIs, state, or animation controls, it must include `'use client'` at the top.
- Follow the current folder structure patterns:
  - `src/app/` — routes, pages & route handlers (API).
  - `src/components/` — reusable UI components (Client Components frequently include `'use client'`).
  - `src/lib/` — shared utilities, database manager, auth helpers, and types.
  - `src/lib/database/` — single SQLite DB manager + DAL (data access layer) patterns.

## Technology & version rules
- Generate code that is strictly compatible with the versions above. Do not use syntax or APIs introduced in later major releases of Next, React, or TypeScript.
- TypeScript compiler options from `tsconfig.json` must be honored: `target: ES2017`, `module: esnext`, `strict: true`. Keep types explicit where the codebase already uses them.
- Use the project alias `@/*` when generating imports (maps to `./src/*` in `tsconfig.json`). E.g. `import dal from '@/lib/database/dal';`.

## Component patterns
- Server vs Client components:
  - Default to Server Components. If component requires interactivity (`useState`, `useEffect`, event handlers), include `'use client'` at the top.
  - Do NOT use `next/dynamic` with `{ ssr: false }` inside a Server Component — this repository follows App Router best practices; instead move interactive logic to a Client Component and import it directly in the Server Component.

- UI libraries:
  - Use MUI v7 primitives and theming (project uses `@mui/material` and `@mui/system`). Follow existing component patterns and props usages found in `src/components/*`.
  - Animations use `framer-motion` — follow existing `AnimationVariants` pattern in `src/lib/types.ts` and reuse variants from `src/components/ui` when present.
  - Tailwind classes exist alongside MUI — prefer the same approach used in similar components (do not replace MUI layout with pure Tailwind unless matching local patterns).

## API routes and server code
- All route handlers under `src/app/api/*` follow the App Router route handler pattern. Export async functions named `GET`, `POST`, `PATCH`, `DELETE` and use the standard `Request` and `Response` APIs.
- Authentication/authorization:
  - Use existing auth helpers (e.g. `requireAdminAuth()`, `requireAuth()`, `getAuthSession()`) found in `src/lib/auth/utils.ts` to protect server handlers.
  - When adding admin-only endpoints, call `requireAdminAuth()` early and use the returned session to access `user_id` for audit/logging.
- Database access:
  - Use the repository's Data Access Layer class in `src/lib/database/dal.ts`. Create a new instance via `const data = new Dal()` or use the exported default where present. Prefer DAL methods (e.g. `getOrdersWithItems`, `updateOrder`, `deleteOrder`) rather than accessing DB internals directly.
  - Use parameterized queries when writing raw SQL; the DAL and DatabaseManager already use parameterized helpers (`executeQuery`, `executeNonQuery`). Mirror that approach.

## Database and migrations (patterns observed)
- Database uses SQLite (better-sqlite3) and a DatabaseManager that executes schema SQL and attempts lightweight `ALTER TABLE` migrations when needed.
- When modifying schema, follow the existing pattern: try `PRAGMA table_info('table')` to check columns then run `ALTER TABLE` guarded in try/catch — do not rely on ORMs. Use `CREATE TABLE IF NOT EXISTS` for new audit tables.
- The DAL uses a transaction wrapper `executeTransaction` that runs `BEGIN/COMMIT/ROLLBACK`. If you change or add multi-step DB operations, implement them inside the transaction wrapper to preserve atomicity.

## Security & data handling patterns
- Input validation: project uses `zod` in some places; but many handlers perform ad-hoc checks. When adding new server handlers, validate required fields (return 400 if missing) and sanitize inputs before use in DB calls.
- Passwords: bcryptjs is used (`bcryptjs` + `@types/bcryptjs`). Follow existing helpers for hashing and verifying passwords found in `src/lib/auth/utils.ts`.
- Avoid exposing secrets in code. Follow the project pattern of using server-side-only functions for secret operations.

## Error handling and responses
- Follow the existing pattern in route handlers: return `NextResponse.json(...)` for success and `new NextResponse(message, { status })` for errors. Map authentication failures to 401 and other unexpected errors to 500.

## Types and TypeScript hints (observed issues)
- `src/lib/types.ts` is the authoritative local type file. When generating code, prefer types declared there (User, Order, MenuItem, etc.). If you add new fields, add/update types in that file.
- Observed mismatch: runtime code uses statuses such as `approved`, `rejected`, `scheduled` but `Order.status` in `src/lib/types.ts` currently lists `'pending' | 'confirmed' | 'picked_up' | 'cancelled'`. When touching order status logic, update `src/lib/types.ts` accordingly to avoid casting (`as any`) in server code.

## Concurrency & transaction edge-cases
- When updating order items / stock, the code restores previous items' stock then applies new items inside a transaction. If you add similar logic, use `executeTransaction` to ensure rollback on error.

## Logging and auditing
- This repo records admin deletions in an audit table `order_deletions` (pattern present in `src/lib/database/dal.ts` and `src/app/api/admin/orders/route.ts`). If you implement operations that require audit logging, follow the same pattern:
  - Ensure audit table exists with `CREATE TABLE IF NOT EXISTS`.
  - Insert audit rows with parameterized SQL including `order_id`, `deleted_by`, `reason`, and `deleted_at`.
  - Prefer to make audit insertion part of same transaction as the state change for true atomicity — the codebase currently performs a best-effort insert from the API layer; consider adding optional parameters to DAL methods to accept `deleted_by` and `reason` so audit insertion can occur inside the transaction.

## Code style & linting
- Follow the repository's ESLint/Next.js style. Keep imports grouped and use the `@/*` alias for local modules.

## Tests
- No unit or integration tests were detected. If tests are added, follow the repository's TypeScript patterns (keep `strict: true`) and mimic test naming, runner, and mocking patterns you introduce. Prefer `react-testing-library` + Jest style when creating UI tests if you add them (this repo uses React 19 and TypeScript).

## Examples & concrete snippets (use these as templates)

API route handler (server-side) pattern:

```ts
// src/app/api/example/route.ts
import { NextResponse } from 'next/server';
import Dal from '@/lib/database/dal';
import { requireAdminAuth } from '@/lib/auth/utils';

const data = new Dal();

export async function POST(req: Request) {
  try {
    await requireAdminAuth();
    const body = await req.json();
    if (!body?.foo) return new NextResponse('Missing foo', { status: 400 });
    const result = await data.someOperation(body.foo);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    if (String(err).toLowerCase().includes('authentication')) return new NextResponse('Unauthorized', { status: 401 });
    return new NextResponse(err.message || 'Internal Server Error', { status: 500 });
  }
}
```

DAL transactional pattern (follow exactly):

```ts
// inside src/lib/database/dal.ts
return this.executeTransaction(async () => {
  // multiple DB operations
  await this.db.updateOne('orders', { order_id }, { is_deleted: 1, deleted_at: now });
  await this.db.executeNonQuery('INSERT INTO order_deletions (...) VALUES (?, ?, ?)', [ ...params ]);
  return { success: true };
});
```

## When NOT to do something
- Do NOT use `next/dynamic` with `{ ssr: false }` inside Server Components. Instead create a separate Client Component and import it.
- Do NOT bypass the DAL for core data operations. The DAL centralizes database access and migrations.

## Minimal checklist for generated code
When Copilot suggests code, ensure all of the following are true before accepting:
1. Imports use the `@/*` alias for internal modules where applicable.
2. TypeScript types used are defined in `src/lib/types.ts` or added there if required.
3. Server handlers validate inputs and call `requireAuth()`/`requireAdminAuth()` where appropriate.
4. Database calls use the DAL methods or parameterized SQL via `DatabaseManager` helpers.
5. Client components include `'use client'` when they use React hooks or browser APIs.
6. No use of language or framework features newer than those declared in `package.json` and `tsconfig.json`.

## Where to look for examples in this repo
- Authentication helpers: `src/lib/auth/utils.ts`
- DAL & DB patterns: `src/lib/database/index.ts` and `src/lib/database/dal.ts`
- Types: `src/lib/types.ts`
- Admin API delete flow: `src/app/api/admin/orders/route.ts` (shows confirm+reason+audit pattern)
- Admin UI patterns: `src/app/admin/orders/page.tsx` and `src/components/admin/*`

---
If you want, I can now: (A) add an explicit rule to prefer atomic audit insertion by updating `dal.deleteOrder` to accept `deleted_by` and `reason` and to insert the audit row inside the transaction, or (B) generate example unit tests for `dal.deleteOrder` following the transaction pattern. Which would you prefer?
