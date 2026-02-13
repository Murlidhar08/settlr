import { getAccounts } from "@/actions/account.actions";
import { AccountList } from "@/components/accounts/account-list";

export default async function AccountsPage() {
    const accounts = await getAccounts();

    return (
        <div className="container mx-auto p-6 space-y-8 max-w-7xl">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Accounts</h1>
                <p className="text-muted-foreground text-lg">Manage your business accounts and view real-time balances.</p>
            </div>

            <AccountList accounts={accounts} />
        </div>
    );
}
