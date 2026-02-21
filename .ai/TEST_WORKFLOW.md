# Settlr — Test Workflow

A structured guide for writing and running tests in the Settlr codebase.

---

## 🧭 Testing Philosophy

Settlr is a financial application. **Correctness is critical.** Focus testing effort on:
1. **Business logic** — balance calculations, IN/OUT perspective, double-entry integrity
2. **Server Actions** — validation, authorization, data isolation
3. **Data integrity** — no cross-business leakage, correct `businessId` scoping

UI styling and animations are lower priority for automated testing.

---

## 📂 Test File Placement

```
settlr/
├── __tests__/
│   ├── unit/
│   │   ├── transaction-logic.test.ts    ← Core logic tests
│   │   └── balance-calculation.test.ts
│   ├── integration/
│   │   ├── transaction.actions.test.ts  ← Server Action tests
│   │   ├── parties.actions.test.ts
│   │   └── financial-account.actions.test.ts
│   └── e2e/
│       ├── cashbook.spec.ts             ← End-to-end flows
│       ├── party-ledger.spec.ts
│       └── auth.spec.ts
```

Co-locate component tests next to the component file when testing UI behavior:
```
components/
└── parties/
    ├── PartyCard.tsx
    └── PartyCard.test.tsx
```

---

## ✅ What to Test

### 1. Unit Tests — `lib/transaction-logic.ts`

The most critical file in the codebase. Test every edge case.

**Test cases to cover:**
- `getDirection()` returns `IN` when `toAccountId === contextId`
- `getDirection()` returns `OUT` when `fromAccountId === contextId`
- Party balance: positive when customer owes money
- Party balance: negative when you owe supplier
- Party balance: zero when settled
- Correct aggregation across multiple transactions
- Handles `Decimal` types correctly (no float precision errors)

```ts
// Example unit test structure
describe('transaction-logic', () => {
  describe('getDirection', () => {
    it('returns IN when toAccountId matches context', () => { ... });
    it('returns OUT when fromAccountId matches context', () => { ... });
  });

  describe('calculatePartyBalance', () => {
    it('returns correct balance for mixed IN/OUT transactions', () => { ... });
    it('returns 0 for a party with no transactions', () => { ... });
  });
});
```

### 2. Integration Tests — Server Actions

Test that Server Actions correctly:
- Reject unauthenticated requests
- Reject requests for resources outside the user's businesses
- Validate input with Zod (reject malformed data)
- Persist data correctly via Prisma (use test DB)
- Call `revalidatePath` after mutations

**Key actions to test:**
- `createTransaction()` — double-entry integrity, businessId scoping
- `deleteTransaction()` — auth check, correct cascade
- `createParty()` — auto-creates linked `FinancialAccount` of type `PARTY`
- `deleteFinancialAccount()` — blocks deletion of `isSystem` accounts

### 3. E2E Tests — Critical User Flows

Use **Playwright** for end-to-end testing.

**Flows to cover:**
- [ ] User registers → verifies email → logs in
- [ ] User creates a Business → sets it as active
- [ ] User creates a Party (Customer) → records a sale transaction → verifies balance
- [ ] User records a payment → verifies balance clears
- [ ] User views Cashbook → only sees non-party transactions
- [ ] User exports a Party PDF statement → file downloads

---

## 🔧 Test Environment Setup

```bash
# 1. Create a test database (separate from dev DB)
createdb settlr_test

# 2. Set test DB URL in .env.test
DATABASE_URL="postgresql://user:password@localhost:5432/settlr_test"

# 3. Push schema to test DB
NODE_ENV=test npx prisma db push

# 4. Seed test data
NODE_ENV=test npx ts-node __tests__/helpers/seed.ts
```

### Seed Data Checklist
A minimal test seed should include:
- 1 User with verified email
- 2 Businesses (to test isolation)
- 1 Customer Party + 1 Supplier Party per business
- System accounts (Cash in Hand, etc.)
- At least 5 transactions across both parties

---

## 🚀 Running Tests

```bash
# Unit tests
npm run test:unit

# Integration tests (requires test DB running)
npm run test:integration

# E2E tests (requires dev server running)
npm run test:e2e

# All tests
npm run test

# Watch mode (during development)
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## 📋 Pre-Commit Test Checklist

Before committing any change, verify:

- [ ] `npx tsc --noEmit` passes (no TypeScript errors)
- [ ] `npm run lint` passes
- [ ] Unit tests pass for any file in `lib/` that was modified
- [ ] If a Server Action was modified, its integration test passes
- [ ] If `transaction-logic.ts` was modified, ALL unit tests pass
- [ ] If a Prisma schema was changed, test DB has been migrated and integration tests re-run

---

## 🔑 Test Writing Rules

1. **Never test against the production or development DB.** Always use the test database.
2. **Each test must clean up after itself.** Use `beforeEach`/`afterEach` to reset relevant records.
3. **Test business isolation explicitly.** Every action test should verify that user A cannot
   access user B's data.
4. **Use `Prisma.Decimal` for amount values** in test fixtures — not raw JS numbers.
5. **Mock Better Auth sessions** in Server Action tests. Don't spin up a real auth flow.
6. **Name tests descriptively**: `it('returns 0 balance when all transactions are settled', ...)`

---

## 🚨 Critical Test Scenarios (Never Skip)

These must pass before any production deployment:

| Scenario | Why |
|---|---|
| Cross-business data access returns 403/null | Financial data privacy |
| Double-entry: `fromAccountId !== toAccountId` | Ledger integrity |
| `isSystem` account cannot be deleted | Data integrity |
| Party balance matches sum of transactions | Core financial correctness |
| PDF export contains correct party balance | Customer-facing accuracy |
| 2FA blocks login without valid OTP | Security |
