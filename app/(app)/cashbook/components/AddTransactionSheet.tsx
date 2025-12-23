import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddTransactionSheet({ open, onOpenChange }: any) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:w-[420px]">
                <SheetHeader>
                    <SheetTitle>Add Transaction</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                    <Input placeholder="Party name" />
                    <Input placeholder="Amount" />
                    <Input placeholder="Notes" />

                    <Button className="w-full mt-4">
                        Save Transaction
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
