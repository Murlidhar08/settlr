# 🏗️ Settlr — Developer Guide & Application Architecture

Welcome to the **Settlr** developer guide. This document provides a comprehensive overview of the application's architecture, core logic, and development workflows.

---

## 🌐 1. What Settlr Is

**Settlr** is a premium, modern digital ledger and transaction settlement application built for entrepreneurs and small business owners. It allows users to manage multiple business entities, track financial flows with counterparties (customers/suppliers), and maintain a balanced ledger using a standardized double-entry system.

### Key Features
- **Multi-Business Management**: Separate personal and professional finances or manage multiple ventures under one account.
- **Double-Entry Ledger**: Every transaction records a source and a destination, ensuring mathematical consistency.
- **Party Tracking**: Real-time balance calculations for customers and suppliers.
- **Modern Tech Stack**: Built with Next.js 16, React 19, Prisma 7, and Tailwind CSS 4.
- **Professional Statements**: Generate and export high-quality PDF statements for parties.
- **Secure by Default**: Multi-factor authentication (2FA), session isolation, and RBAC via Better Auth.

---

## 🛠 2. Technology Stack

Settlr uses a bleeding-edge stack to ensure performance and developer experience:

| Technology | Role | Version |
| :--- | :--- | :--- |
| **Next.js** | Framework (App Router, Turbopack) | `16.1.6` |
| **React** | UI Library | `19.2.4` |
| **Prisma** | ORM (with PostgreSQL) | `7.4.1` |
| **Tailwind CSS** | Styling | `4.2.0` |
| **Better Auth** | Authentication | `1.4.18` |
| **Framer Motion** | Animations | `12.34.3` |
| **Lucide React** | Iconography | `0.575.0` |
| **Zod** | Schema Validation | `4.3.6` |
| **Shadcn UI** | UI Component Library | `3.8.5` |

---

## 🎨 3. Design System & Color Schema

Settlr utilizes a modern design system powered by **Tailwind CSS 4** and **OKLCH** color space for superior color consistency and accessibility.

### 🔹 Color Palette (OKLCH)
The application uses a refined palette defined in `app/globals.css`:

- **Primary**: `oklch(0.541 0.281 293.009)` — A vibrant branding purple/violet. Used for primary actions, accents, and branding.
- **Background**: `oklch(1 0 0)` (Light) / `oklch(0.141 0.005 285.823)` (Dark).
- **Surface (Card/Popover)**: Clean white backgrounds in light mode; deep charcoal in dark mode.
- **Destructive**: `oklch(0.577 0.245 27.325)` — Used for delete actions and warnings.
- **Status Colors**:
  - **Incomes/Positive**: Emerald/Green tones.
  - **Expenses/Negative**: Rose/Red tones.

### 🔹 Typography & UI
- **Font**: Inter (Sans-serif) is the default for a clean, professional look.
- **Glassmorphism**: Subtle backdrop blurs (`backdrop-blur-sm`) are used on cards and headers to provide a premium feel.
- **Border Radius**: Defined with a base of `0.45rem`, scaling up to `4xl` for large container elements.

---

## 🧠 4. Database Design (Prisma)

Settlr uses a relational PostgreSQL schema. Data isolation is maintained at the `Business` level.

### 🔹 Core Entities

#### User & Auth
Managed by **Better Auth**. Includes `User`, `Session`, `Account`, `Verification`, and `TwoFactor`.
- `UserSettings`: Stores preferences like `currency` (default INR), `dateFormat`, and `theme`.

#### Business
The primary container for all financial data.
- A `User` owns multiple `Business` entities.
- Users have an `activeBusinessId` to scope their current session.

#### FinancialAccount
The building blocks of the ledger. Categorized into three types:
1. **MONEY**: Liquid assets (Cash, Bank accounts).
2. **PARTY**: Accounts linked to a specific customer or supplier.
3. **CATEGORY**: Income/Expense categories or Equity/Asset types.

#### Party
External entities (Customers, Suppliers, or "Other").
- Each `Party` is linked to a `FinancialAccount` of type `PARTY`.
- Balances are computed dynamically from transactions involving their linked account.

#### Transaction
The atomic unit of financial data.
```prisma
model Transaction {
  id            String
  amount        Decimal(12, 2)
  date          DateTime
  description   String?
  fromAccountId String // Source (Credit)
  toAccountId   String // Destination (Debit)
  partyId       String? // Optional: Link to a Party
  businessId    String // Scoped to a business
  userId        String // Who created it
}
```

---

## 🧩 5. Core Business Logic

### ⚖️ The Double-Entry Principle
Settlr enforces a strict double-entry system. Every transaction must have:
1. `fromAccountId`: The account where money is coming **from**.
2. `toAccountId`: The account where money is going **to**.

**Consistency Rule**: Total Debits (Receiving) == Total Credits (Sending).

### 🔄 Transaction Perspective (IN vs OUT)
Instead of complex debit/credit rules for different account types, Settlr uses a "Perspective" logic defined in `lib/transaction-logic.ts`:
- **IN**: Money flows **into** the account (`toAccountId === contextId`).
- **OUT**: Money flows **out of** the account (`fromAccountId === contextId`).

This logic is used consistently across the Dashboard, Cashbook, Party Ledgers, and PDF Statements.

### 📌 Party Balance Calculation
Party balances are calculated by summing all `IN` transactions and subtracting all `OUT` transactions from the perspective of the party's linked `FinancialAccount`.

---

## 🏠 6. Frontend Architecture

Settlr uses the **Next.js App Router** with route grouping for logical separation.

### Navigation Structure
- **`(auth)/`**: Handles login, signup, forgot password, and 2FA flows.
- **`(app)/dashboard/`**: Business overview, stats (Total IN/OUT), and recent activity.
- **`(app)/cashbook/`**: View and manage transactions not linked to a party (daily cash flow).
- **`(app)/parties/`**: CRUD for Customers and Suppliers. Includes party-specific ledgers and statement generation.
- **`(app)/accounts/`**: Management of all Financial Accounts (Cash, Bank, Categories).
- **`(app)/transactions/`**: Global history and detailed view of every transaction.
- **`(app)/settings/`**: Business configuration, theme toggle, and personal preferences.

### Core Utilities
- **PDF Generation**: Handled client-side using `jspdf` and `jspdf-autotable`. See `ExportPDFButton` in party statement components.
- **Transaction Logic**: `lib/transaction-logic.ts` contains the shared truth for all balance and direction calculations.

### Design System
- **Styling**: Tailwind CSS 4 with a glassmorphic, premium aesthetic.
- **Animations**: Framer Motion for smooth transitions and micro-interactions.
- **Icons**: Lucide React.
- **Components**: Base UI (via Shadcn) for accessible primitives.

---

## ⚙️ 7. Backend & API Logic

Settlr leverages **Next.js Server Actions** for all data mutations and many queries, providing a type-safe bridge between the frontend and the database.

### Core Action Modules (`/actions`)
- **`transaction.actions.ts`**: Handles creation, deletion, and specialized queries (Cashbook, Recent, Party Statements).
  - *Validation*: Ensures business isolation and prevents cross-business data leakage.
- **`parties.actions.ts`**: CRUD for parties and automatic creation of linked financial accounts.
- **`financial-account.actions.ts`**: Manages the life cycle of ledger accounts (including `isSystem` accounts like "Cash in Hand").
- **`business.actions.ts`**: Handles business creation and owner-level settings.

---

## 🛠 8. Developer Workflow

￼
￼
 bash
 bash
 npmLens Terminal
 account-v2*+
 0 
 0
Antigravity - Settings
Markdown
LF
UTF-8
Spaces: 4
Ln 164, Col 27 (18 selected)
README and Project Analysis
Analyzed
￼
globals.css#L1-129
￼
Thought for 6s


Edited
￼
developer_readme.md
+28
-6
I have updated the 
￼
developer_readme.md
 to include a dedicated section on the Design System & Color Schema, based on the configuration in 
￼
app/globals.css
.

✨ Key Additions:
OKLCH Color Space: Documented the use of the modern OKLCH space for better accessibility and vibrancy.
Primary Branding: Identified the core purple/violet branding color (oklch(0.541 0.281 293.009)).
Status Logic: Explained the consistent use of Emerald (Positive/In) and Rose (Negative/Out) across the UI.
UI Details: Mentioned Glassmorphism effects and the specific Border Radius scale (0.45rem base) that gives the app its premium feel.
The document has also been re-indexed into 9 logical sections for a cleaner structure. You can view the full guide at 
￼
…/Desktop/develop/settlr/developer_readme.md
.

Recent actions
￼
README.md
refere local step section for developer guide for update
￼
developer_readme.md
 point 8 developer workflow section
￼
Thought for 6s


Edited
￼
developer_readme.md
+28
-12
I have updated the Developer Workflow section (Point 8) in 
￼
developer_readme.md
 to be fully consistent with the local setup instructions 
### Prerequisites
- **Node.js**: v20 or later
- **PostgreSQL**: Local instance or Docker
- **Package Manager**: npm, pnpm, or bun

### Getting Started
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Murlidhar08/settlr.git
   cd settlr
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. **Environment Setup**:
   Copy `.env.example` to `.env` and configure your credentials:
   ```bash
   cp .env.example .env
   ```
   **Key variables to update**:
   - `DATABASE_URL`: Your Postgres connection string.
   - `BETTER_AUTH_SECRET`: Generate a random string.
   - `SMTP_*`: Your email service credentials (required for verification/notifications).

4. **Database Initialization**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
5. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to access the app.

### Typical Tasks
- **Adding a Filter**: Update the filter state in the page component and pass it to the corresponding Server Action.
- **Modifying UI**: Check `components/ui` for shared components. Settlr uses Tailwind 4 variables for consistent coloring.
- **Updating Schema**: Modify `prisma/schema.prisma`, then run `npx prisma migrate dev` (for versioned migrations) or `npx prisma db push` (for prototyping).

---

## 🤖 9. Future & Automation
- **AI Categorization**: Suggest categories based on transaction descriptions.
- **Automated Reconciliation**: Import bank statements (CSV/API) and match them to ledger entries.
- **Natural Language Reports**: Generate summaries like "Who are my top 5 debtors this month?".

---

**Last Updated**: February 2026
**Architecture Style**: Monolith (Next.js + Prisma)
**Deployment**: Docker-ready (`Dockerfile` included)
