---
name: settlr
description: >
  Settlr is a premium double-entry digital ledger and transaction settlement app for entrepreneurs.
  Use this skill whenever working on Settlr codebase tasks — adding features, fixing bugs, writing
  queries, modifying the schema, building UI components, or understanding business logic. Trigger
  on any mention of transactions, parties, ledger, cashbook, financial accounts, business settings,
  PDF statements, or anything related to the Settlr app architecture.
---

# Settlr — AI Skill Reference

## 🌐 What Settlr Is
A **premium double-entry ledger app** for entrepreneurs and small business owners. Users manage
multiple Business entities, track financial flows with Parties (customers/suppliers), and maintain
a balanced ledger.

---

## 🛠 Tech Stack (Exact Versions)
| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router + Turbopack) | 16.1.6 |
| UI | React | 19.2.4 |
| ORM | Prisma (PostgreSQL) | 7.4.1 |
| Styling | Tailwind CSS 4 (OKLCH) | 4.2.0 |
| Auth | Better Auth (2FA, RBAC, Sessions) | 1.4.18 |
| Animation | Framer Motion | 12.34.3 |
| Icons | Lucide React | 0.575.0 |
| Validation | Zod | 4.3.6 |
| UI Components | Shadcn UI | 3.8.5 |

> **Always use these exact versions.** Do not suggest upgrades unless asked.

---

## 🎨 Design System
- **Color Space**: OKLCH (Tailwind CSS 4)
- **Primary/Brand**: `oklch(0.541 0.281 293.009)` — purple/violet
- **Background Light**: `oklch(1 0 0)` / **Dark**: `oklch(0.141 0.005 285.823)`
- **Destructive**: `oklch(0.577 0.245 27.325)` — red/orange
- **Income/Positive**: Emerald/Green tones
- **Expense/Negative**: Rose/Red tones
- **Font**: Inter (sans-serif)
- **Border Radius Base**: `0.45rem` scaling to `4xl` for containers
- **Glassmorphism**: `backdrop-blur-sm` on cards and headers
- **Animations**: Framer Motion for micro-interactions

---

## 🧠 Core Database Entities

### FinancialAccount Types
1. **MONEY** — Liquid assets (Cash, Bank accounts)
2. **PARTY** — Linked to a specific customer or supplier
3. **CATEGORY** — Income/Expense categories, Equity, Asset types

### Transaction Model (Key Fields)
```prisma
model Transaction {
  id            String
  amount        Decimal(12, 2)
  date          DateTime
  description   String?
  fromAccountId String  // Credit / Source
  toAccountId   String  // Debit / Destination
  partyId       String? // Optional Party link
  businessId    String  // Data isolation
  userId        String  // Creator
}
```

### Party
- External entity (Customer, Supplier, Other)
- Linked to one `FinancialAccount` of type `PARTY`
- Balance is computed dynamically from transactions

---

## ⚖️ Business Logic Rules

### Double-Entry Principle
Every transaction MUST have:
- `fromAccountId` → where money comes FROM (Credit)
- `toAccountId` → where money goes TO (Debit)
- **Total Debits == Total Credits** at all times

### Transaction Perspective (IN vs OUT)
Defined in `lib/transaction-logic.ts`:
- **IN**: `toAccountId === contextId` (money flowing INTO the context account)
- **OUT**: `fromAccountId === contextId` (money flowing OUT of the context account)

This is the **single source of truth** used across Dashboard, Cashbook, Party Ledgers, and PDF Statements.

### Party Balance Formula
```
Balance = SUM(IN transactions) - SUM(OUT transactions)
```
...from the perspective of the party's linked `FinancialAccount`.

### Data Isolation
All data is scoped to `businessId`. Never query across businesses. Always validate `userId` and
`businessId` in Server Actions to prevent cross-business data leakage.

---

## 🏠 Frontend Route Map
```
(auth)/          → login, signup, forgot-password, 2FA
(app)/dashboard/ → stats (Total IN/OUT), recent activity
(app)/cashbook/  → transactions NOT linked to a party
(app)/parties/   → CRUD customers/suppliers, ledger, PDF export
(app)/accounts/  → FinancialAccount management
(app)/transactions/ → global history, detail view
(app)/settings/  → business config, theme, preferences
```

---

## ⚙️ Backend Patterns

### Server Actions (mutations & queries)
- `transaction.actions.ts` — create, delete, cashbook, recent, party statements
- `parties.actions.ts` — CRUD + auto-create linked FinancialAccount
- `financial-account.actions.ts` — account lifecycle, `isSystem` accounts (e.g. "Cash in Hand")
- `business.actions.ts` — business creation, owner settings

### PDF Generation
- Client-side using `jspdf` + `jspdf-autotable`
- Located in `ExportPDFButton` inside party statement components

---

## 🧩 Key Conventions
1. **Never bypass `lib/transaction-logic.ts`** for balance or direction calculations.
2. **`isSystem` accounts** (like "Cash in Hand") cannot be deleted by users.
3. **`activeBusinessId`** on the User scopes the current session context.
4. **UserSettings** stores `currency` (default: INR), `dateFormat`, `theme`.
5. Use **Tailwind CSS 4 OKLCH variables** for all color references — no hardcoded hex values.
6. All schema changes: run `npx prisma migrate dev` (versioned) or `npx prisma db push` (prototyping).

---

## 📁 Project Structure Reference
```
settlr/
├── app/
│   ├── globals.css          ← Design tokens, OKLCH palette
│   ├── (auth)/              ← Auth flows
│   └── (app)/               ← Protected app routes
├── actions/                 ← Server Actions (mutations/queries)
├── components/
│   └── ui/                  ← Shadcn base components
├── lib/
│   └── transaction-logic.ts ← Core IN/OUT perspective logic
├── prisma/
│   └── schema.prisma        ← Database schema
└── .ai/                     ← AI context files (this folder)
    ├── SKILL.md
    ├── RULES.md
    ├── DEBUG_WORKFLOW.md
    └── TEST_WORKFLOW.md
```
