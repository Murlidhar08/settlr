<div align="center">
  <img src="public/images/logo/light_logo.svg" width="120" height="120" alt="Settlr Logo">
  <h1>Settlr</h1>
  <p><b>Premium Ledger & Transaction Management</b></p>
</div>

Settlr is a premium, modern business ledger and transaction management application designed for entrepreneurs and small business owners. It provides a sleek interface to track financial flows, manage multiple business entities, and generate professional PDF statements.

![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-39827E?style=for-the-badge&logo=Prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better_Auth-FF4154?style=for-the-badge&logo=auth0&logoColor=white)

---

## ✨ Key Features

- **Multi-Business Management**: Organize multiple business entities under a single account.
- **Counterparty Tracking**: Manage Customers and Suppliers with dedicated balance tracking.
- **Dynamic Ledger**: High-fidelity transaction logging for inward and outward payments.
- **Pro PDF Statements**: Generate and download professional financial statements for parties.
- **Advanced Security**: Session management, link multiple social accounts, and two-factor authentication.
- **Modern UI/UX**: Built with Tailwind CSS 4, Framer Motion animations, and a premium glassmorphic design.
- **PWA Support**: Installable as a web app on mobile and desktop devices.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router & Turbopack)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://www.better-auth.com/) (Google, Discord, Email/Pass)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/) + [Lucide Icons](https://lucide.dev/)
- **Utility**: `date-fns`, `jspdf`, `sonner`, `zod`

---

## 🚀 Local Setup (Developers)

### Prerequisites

- **Node.js**: v20 or later
- **PostgreSQL**: Local instance or Docker
- **Package Manager**: npm, pnpm, or bun

### 1. Clone the repository
```bash
git clone https://github.com/Murlidhar08/settlr.git
cd settlr
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and fill in your credentials.
```bash
cp .env.example .env
```
Key variables to update:
- `DATABASE_URL`: Your Postgres connection string.
- `BETTER_AUTH_SECRET`: Generate a random string.
- `SMTP_*`: Your email service credentials for verification/notifications.

### 4. Database Initialization
```bash
npx prisma db push
npx prisma generate
```

### 5. Run Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to access the app.

---

## 🐳 Docker Setup

Settlr is containerized for easy deployment and testing.

### Running with Docker Compose (Recommended)

This setup starts both the Settlr application and a PostgreSQL database.

1. **Prepare Environment**: Update `.env.production` (or `.env`) with your production settings.
2. **Launch Services**:
   ```bash
   docker-compose up -d --build
   ```
3. **Access Application**:
   The app will be available at [http://localhost:3000](http://localhost:3000).

### Using your own Database

If you have an external database, use the standard `docker-compose.yml`:
1. Update `docker-compose.yml` with your `DATABASE_URL`.
2. Run:
   ```bash
   docker-compose up -d
   ```

---

## 📄 License

This project is private and for internal use. Refer to the project owner for licensing terms.

---

Built with ❤️ by the Settlr Team.
