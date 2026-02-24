# Settlr — Workspace Rules

These rules govern all AI-assisted development on the Settlr codebase. Follow them in every task.

---

## 🔒 Data & Security Rules

1. **Business Isolation is mandatory.** Every database query and Server Action MUST be scoped by
   `businessId` AND `userId`. Never expose data across businesses.

2. **Never trust client input directly.** All mutations go through Server Actions with Zod validation.
   Validate shape AND ownership before any write.

3. **Auth context first.** Always retrieve the authenticated session at the top of every Server
   Action before doing any database work. Reject unauthenticated requests immediately.

4. **`isSystem` accounts are read-only.** Never generate code that allows deletion or type-change
   of accounts where `isSystem === true`.

5. **No raw SQL unless absolutely necessary.** Use Prisma ORM. If raw SQL is needed, document why.

---

## ⚖️ Business Logic Rules

6. **Double-entry is non-negotiable.** Every transaction must have both `fromAccountId` and
   `toAccountId`. Never create a one-sided transaction.

7. **Use `lib/transaction-logic.ts` as the single source of truth** for all IN/OUT perspective
   calculations and balance derivations. Never reimplement this logic inline.

8. **Party balances are always computed, never stored.** Do not add a `balance` field to the
   `Party` model. Always derive from transactions.

9. **`activeBusinessId` scopes the session.** When rendering any page, always read `activeBusinessId`
   from the user to determine the correct business context.

---

## 🎨 Frontend & Design Rules

10. **Use OKLCH color variables only.** Never hardcode hex or RGB colors. Reference the CSS custom
    properties defined in `app/globals.css`.

11. **Tailwind CSS 4 syntax.** Use the v4 utility API. Do not use v3-style `theme()` functions or
    `@apply` with deprecated classes.

12. **Glassmorphism is the standard card style.** Use `backdrop-blur-sm` + semi-transparent
    backgrounds for card and header components.

13. **Framer Motion for all transitions.** Do not use CSS `transition` for component mount/unmount
    animations. Use `motion.*` components.

14. **Lucide React for all icons.** Do not introduce other icon libraries.

15. **Shadcn UI for base primitives.** Extend, don't replace. Custom components wrap Shadcn, not
    bypass it.

---

## 🛠 Code Quality Rules

16. **TypeScript strictly typed.** No `any` types without an explicit comment explaining why.
    Prefer Zod-inferred types for validated data shapes.

17. **Server Actions are the only data mutation layer.** Do not create API routes (`/api/*`) for
    operations that can be Server Actions.

18. **File naming convention:**
    - Server Actions: `*.actions.ts`
    - Utility/logic: `lib/*.ts`
    - UI Components: `components/**/*.tsx` (PascalCase)
    - Pages: `app/**/page.tsx`

19. **No `console.log` in production code.** Use structured error handling. Throw errors in Server
    Actions; catch and display in client components.

20. **Prisma migrations are versioned in production.** Use `npx prisma migrate dev` for schema
    changes. Only use `db push` during initial prototyping, never on a shared/production DB.

---

## 📦 Dependency Rules

21. **Pin to documented versions.** Do not bump major versions of Next.js, React, Prisma, or
    Tailwind without an explicit architecture decision.

22. **No new animation libraries.** Framer Motion is the standard; do not add alternatives.

23. **PDF generation stays client-side.** Use `jspdf` + `jspdf-autotable`. Do not add server-side
    PDF libraries.

---

## 🤖 AI Assistance Rules

24. **Always read `SKILL.md` before starting a task** to understand the architecture and conventions.

25. **Suggest, don't auto-apply schema changes.** When a task requires a Prisma schema change,
    present the change and migration command for human review before running it.

26. **Prefer editing existing patterns** over introducing new ones. Match the style and structure
    of the nearest similar file in the codebase.

27. **Explain business logic implications** when modifying anything in `lib/transaction-logic.ts`,
    `actions/transaction.actions.ts`, or any balance-related query.
