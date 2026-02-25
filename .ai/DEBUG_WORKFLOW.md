# Settlr — Debug Workflow

A structured guide for diagnosing and resolving bugs in the Settlr codebase.

---

## 🔍 Step 1: Classify the Bug

Before touching any code, identify the layer:

| Symptom | Likely Layer |
|---|---|
| Wrong balance shown for a party | `lib/transaction-logic.ts` or query |
| Transaction not saving | Server Action validation or Prisma error |
| UI not updating after mutation | Server Action missing `revalidatePath` |
| Auth error / unauthorized | Better Auth session or RBAC |
| Styling broken | Tailwind CSS 4 class or OKLCH variable |
| PDF export incorrect | `jspdf` / `jspdf-autotable` logic |
| Data leaking across businesses | Missing `businessId` scope in query |

---

## 🧱 Step 2: Reproduce the Bug

1. **Identify the exact user action** that triggers the issue.
2. **Note the business context** — which Business and which Party/Account is affected?
3. **Check if it's scoped** — does it happen for all users or specific accounts?
4. **Gather the error**: browser console, Next.js server terminal, or Prisma query logs.

---

## 🔎 Step 3: Trace the Data Flow

Follow the standard Settlr data flow to locate the failure point:

```
User Action (UI)
    → Client Component (form / button)
        → Server Action (actions/*.actions.ts)
            → Zod Validation
                → Prisma Query (schema.prisma)
                    → PostgreSQL
```

**For read/display bugs**, also trace:
```
Page Load → Server Component fetch → Prisma → lib/transaction-logic.ts → UI render
```

---

## 🐛 Step 4: Common Bug Patterns & Fixes

### ❌ Wrong Party Balance
- **Check**: Is the correct `FinancialAccount.id` (type `PARTY`) being used as `contextId`?
- **Check**: Is `lib/transaction-logic.ts` `getDirection()` receiving the right accountId?
- **Fix**: Never recompute balance inline. Delegate to `transaction-logic.ts`.

### ❌ Transaction Not Appearing in Cashbook
- **Check**: Is `partyId` null? Cashbook only shows transactions where `partyId IS NULL`.
- **Check**: Is `businessId` matching the `activeBusinessId`?

### ❌ Server Action Returns Stale Data
- **Check**: Is `revalidatePath()` called after mutation?
- **Fix**: Add `revalidatePath('/relevant-route')` at the end of the mutation action.

### ❌ Unauthorized / Session Error
- **Check**: Is the session fetched at the top of the Server Action?
- **Check**: Does the session `userId` match the resource owner?
- **Fix**:
  ```ts
  const session = await auth.getSession();
  if (!session?.user) throw new Error('Unauthorized');
  ```

### ❌ Prisma Query Error
- **Check**: Run `npx prisma studio` to inspect data state.
- **Check**: Is the relation field included in the `include` clause?
- **Check**: Decimal fields — use `new Prisma.Decimal(value)` not raw floats.

### ❌ UI Color / Style Wrong
- **Check**: Is a hardcoded color used instead of a CSS variable?
- **Check**: Is a Tailwind v3 class being used instead of v4?
- **Fix**: Reference `app/globals.css` for the correct OKLCH variable name.

### ❌ `isSystem` Account Deleted
- **Fix**: Add guard in the action:
  ```ts
  if (account.isSystem) throw new Error('Cannot delete system account');
  ```

---

## 🧪 Step 5: Verify the Fix

1. **Manually test** the exact reproduction steps from Step 2.
2. **Check adjacent flows** — if you touched `transaction-logic.ts`, verify Dashboard, Cashbook,
   Party Ledger, and PDF Statement all still produce correct values.
3. **Check both light and dark mode** for any UI fix.
4. **Verify business isolation** — confirm the fix doesn't expose data from another business.

---

## 📋 Step 6: Document

After fixing, add a comment in the code if the bug had a non-obvious root cause:

```ts
// Note: partyId must be null for cashbook queries — do not remove this filter.
// See DEBUG_WORKFLOW.md for context.
```

---

## 🛠 Useful Debug Commands

```bash
# Inspect DB state visually
npx prisma studio

# Check Prisma client is in sync with schema
npx prisma generate

# View recent DB query logs (requires LOG_LEVEL=query in .env)
# Set in .env: DATABASE_URL="...?connection_limit=1&log=query"

# Reset DB (⚠️ destructive — dev only)
npx prisma migrate reset

# Check for TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint
```

---

## 🚨 Escalation Criteria

Escalate to a senior review if:
- The bug involves incorrect financial calculations affecting multiple businesses.
- A fix requires changes to `lib/transaction-logic.ts` core logic.
- A Prisma schema migration is needed in a production environment.
- The bug suggests data leakage between user accounts or businesses.
