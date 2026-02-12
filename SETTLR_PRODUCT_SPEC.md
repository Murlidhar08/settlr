# Settlr - Product Specification & Application Description

## 1. Application Overview
**Settlr** is a premium, modern business ledger and transaction management application designed for entrepreneurs and small business owners. It provides a sleek, high-fidelity interface to track financial flows, manage multiple business entities, and maintain organized records of dealings with counterparties.

### Problem Statement
Small business owners often struggle with fragmented financial records across paper ledgers, spreadsheets, and banking apps. Identifying "who owes what" and tracking daily cash flows across multiple ventures can be cumbersome and prone to error.

### Value Proposition
- **Unified Management**: Handle multiple business entities under a single secure account.
- **Clarity & Transparency**: Real-time balance tracking for customers and suppliers.
- **Professionalism**: Generate high-quality PDF statements for professional communication.
- **Modern Experience**: A premium, glassmorphic UI that makes financial management engaging rather than a chore.

---

## 2. User Roles and Permissions
Settlr utilizes a Role-Based Access Control (RBAC) system deeply integrated with user sessions and business ownership.

### User Roles
1.  **Business Owner (Default)**:
    - **Access**: Full access to all data within their created businesses.
    - **Permissions**: Create/Edit/Delete businesses, parties, and transactions. Manage security settings (2FA). Export data as PDF.
    - **Restrictions**: Cannot access data belonging to other users' businesses.
2.  **System Administrator (Internal)**:
    - **Access**: Platform-wide monitoring.
    - **Permissions**: Manage users (ban/unban), view platform-wide analytics (anonymized), manage global configurations.

### Access Control Enforcement
- **Session-Based Isolation**: Every request is validated against the user's active session and `activeBusinessId`.
- **Data Scoping**: Database queries are strictly scoped using `where: { businessId: activeBusinessId }` to ensure data isolation.
- **Multi-Factor Authentication**: Sensitive actions and account access can be guarded by 2FA.

---

## 3. Business Logic and Core Workflows
The application is governed by rules that ensure data integrity and financial accuracy.

### End-to-End Workflows
1.  **Onboarding**: User signs up -> Email verification -> Automatic creation of a "Default Business".
2.  **Counterparty Management**: Owner creates a "Party" (Customer/Supplier) -> Assigns type (Customer/Supplier/Both) -> Tracks cumulative balance based on transactions.
3.  **Transaction Entry**: Owner logs a transaction -> Selects direction (IN/OUT) -> Selects mode (CASH/ONLINE) -> (Optional) Link to a Party.
4.  **Statement Generation**: Select a Party -> Filter by date range -> Generate PDF. The system calculates the net balance for the specific period.

### Core Rules
- **Active Business Context**: A user can have multiple businesses but only one "Active" business per session. All transactions are logged against the active business.
- **Soft vs Hard Deletes**: The current implementation supports hard deletion of transactions and parties to maintain a clean ledger, though activity tracking is planned for future audit trails.
- **Balance Calculation**: Party balances are derived dynamically from the sum of IN transactions minus OUT transactions (or vice versa depending on party type).

---

## 4. Feature Breakdown

### Multi-Business Management
- **Purpose**: Allow entrepreneurs to separate personal and professional finances or manage different ventures.
- **Logic**: Users can switch the active business via a global switcher.
- **Data Flow**: `Business` entity serves as a parent to `Parties` and `Transactions`.

### Dynamic Ledger (Cashbook)
- **Purpose**: Track daily cash flows not necessarily linked to a specific party.
- **Logic**: Transactions without a `partyId` are categorized as Cashbook entries.
- **Filters**: Filter by Payment Mode (Cash/Online) and Date.

### Party Management & Tracking
- **Purpose**: Manage debt and credit for periodic settling.
- **Data Flow**: Input (Amount, Date, Party) -> Processing (Update cumulative balance) -> Output (Ledger view, PDF statement).

### Secure Authentication (Better Auth)
- **Purpose**: Industry-standard security for financial data.
- **Features**: OAuth (Google, Discord), Email/Password, Session management, 2FA.

---

## 5. Pages and Navigation Structure
The application follows a mobile-first, sidebar-driven navigation.

- **Dashboard**: High-level summary of total IN/OUT and recent activity.
  - *Access*: All verified users.
- **Cashbook**: View and manage non-party transactions.
  - *Actions*: Add Transaction (Cash/Online switcher).
- **Parties**: List of all customers and suppliers.
  - *Subpages*: `[partyId]` - Detailed ledger for a specific entity.
- **Transactions**: Global history of all entries within the business.
- **Settings**: Business configuration, theme toggle (Light/Dark/Auto), and currency preferences.
- **Profile**: User account management, 2FA setup, and social account linking.

---

## 6. Data Models and Relationships
Settlr uses a relational PostgreSQL schema managed via Prisma.

### Entities
- **User**: The root entity. Has many `Businesses`.
- **Business**: Owned by a `User`. Has many `Parties` and `Transactions`.
- **Party**: Belongs to a `Business`. Has many `Transactions`.
- **Transaction**: Belongs to a `Business`. Optionally linked to a `Party`. Linked to the `User` who created it.
- **TransactionDocument**: Attachments (images/receipts) for a `Transaction`.

### Lifecycle
- **Ownership**: All data is strictly owned by either a `User` or a `Business`.
- **Deletions**: Deleting a `Business` cascades to its `Parties` and `Transactions`.

---

## 7. Security and Access Control
- **Authentication**: Powered by `Better Auth` with support for social providers and password-less options.
- **Authorization**: Middleware-level checks ensuring `userId` matches the data creator and `activeBusinessId` belongs to the user.
- **Audit Trails**: `createdAt` and `updatedAt` on all entities. `userId` logged on every transaction for accountability in shared business scenarios (future).

---

## 8. Non-Functional Requirements
- **Performance**: Built with Next.js 15 and Turbopack for sub-second page loads. Use of React Suspense for skeleton-based loading states.
- **Scalability**: Stateless architecture allowing for horizontal scaling of the Next.js app. Database indexing on `businessId` and `date`.
- **UI/UX**: Tailwind CSS 4 for utility-first styling. Framer Motion for smooth micro-animations. Glassmorphic design for a premium brand feel.
- **PWA**: Fully installable as a Progressive Web App with offline fallback support.

---

## 9. Future Scope and Extensibility
- **Multi-User Collaboration**: Allow owners to invite "Staff" or "Accounts" with limited view-only permissions.
- **Automated Reconciliations**: Integration with bank APIs to auto-import transactions.
- **Inventory Management**: Linking transactions to specific inventory items.
- **Advanced Analytics**: Trend charts, expense forecasting, and tax estimation.
- **Mobile Apps**: React Native or Capacitor-based wrappers for native app stores.

---
**Document Status**: Final  
**Version**: 1.0.0  
**Target Audience**: Developers, Stakeholders, QA Analysts.
