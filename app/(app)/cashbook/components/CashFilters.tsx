import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function CashFilters() {
    return (
        <div className="mt-6 space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                    placeholder="Search name, phone..."
                    className="h-12 rounded-full pl-10"
                />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {["All", "Cash", "Online", "Date"].map((item) => (
                    <Button
                        key={item}
                        variant={item === "All" ? "default" : "secondary"}
                        size="sm"
                        className="rounded-full shrink-0"
                    >
                        {item}
                    </Button>
                ))}
            </div>
        </div>
    );
}
