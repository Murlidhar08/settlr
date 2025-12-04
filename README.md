````markdown
# Settlr 💰

**The Unified Ledger & Daily Expense Tracker for Small Businesses.**

Settlr is a mobile-first financial application designed to bridge the gap between daily operational expenses and customer relationship debt (credit/debit). It allows freelancers, shop owners, and consultants to manage cash flow and customer balances in a single, synchronized interface.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## 🚀 Key Features

* **Unified Ledger Logic:** seamless handling of **General Expenses** (Rent, Food) and **Party Transactions** (Customer payments, Supplier credits).
* **Smart "Linking":** Automatically updates "Cash on Hand" while simultaneously adjusting a specific Customer's debt balance.
* **Party Management (CRM Lite):** Track Customers and Suppliers with contact details and net balance history.
* **Shareable Statements:** Generate unique, public read-only links for customers to view their transaction history and outstanding balance (no app install required for them).
* **Attachments:** Support for capturing and uploading receipt/invoice images for every transaction.
* **Native Feel:** Optimized for Mobile Web Views (Capacitor/Native Wrapper) using touch-friendly UI components.

## 🛠 Tech Stack

**Frontend & Logic**
* **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
* **Icons:** Lucide React

**Backend & Data**
* **Database:** MySQL (PlanetScale / AWS RDS)
* **ORM:** [Prisma](https://www.prisma.io/)
* **API:** Next.js Server Actions
* **Storage:** Vercel Blob / AWS S3 (for image attachments)

## 🗄️ Database Schema (Prisma)

The core logic revolves around the `Transaction` model, which links to a `Party` (optional).

```prisma
model Party {
  id            String        @id @default(cuid())
  name          String
  type          PartyType     // CUSTOMER | SUPPLIER
  transactions  Transaction[]
  cachedBalance Decimal       @default(0.00) // Performance optimization
}

model Transaction {
  id          String   @id @default(cuid())
  amount      Decimal
  type        TxType   // IN | OUT
  
  // The "Magic Link"
  partyId     String?  
  party       Party?   @relation(fields: [partyId], references: [id])
  
  category    String?  // Used if partyId is null (General Expense)
  imageUrl    String?
  date        DateTime @default(now())
}
````

## 📸 Screenshots

*(Add screenshots here once built: Dashboard, Add Transaction Modal, Party List)*

## ⚡ Getting Started

### Prerequisites

  * Node.js 18+
  * A MySQL database instance (local or cloud)

### Installation

1.  **Clone the repo**

    ```bash
    git clone [https://github.com/yourusername/settlr.git](https://github.com/yourusername/settlr.git)
    cd settlr
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:

    ```env
    # Database
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/settlr"

    # Image Storage (Example: Vercel Blob)
    BLOB_READ_WRITE_TOKEN="your_token_here"

    # Auth (NextAuth Secret)
    NEXTAUTH_SECRET="your_secret_key"
    ```

4.  **Database Migration**
    Push the schema to your MySQL instance:

    ```bash
    npx prisma db push
    ```

5.  **Run Locally**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

## 📱 Mobile Wrapper Strategy

This application is built with a "Mobile-First" responsive design intended to be wrapped in a Native Web View.

  * **Viewports:** Disabled zooming and safe-area padding (`pt-safe`, `pb-safe`) are configured in `layout.tsx`.
  * **Interactions:** Active states (`active:scale-95`) are used for touch feedback.
  * **Recommended Wrapper:** [Capacitor.js](https://capacitorjs.com/) for converting this Next.js app into an APK/IPA.

## 🤝 Contributing

Contributions are welcome\! Please fork the repository and submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

```
```
