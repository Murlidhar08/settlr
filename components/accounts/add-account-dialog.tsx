"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { createAccount } from "@/actions/account.actions";
import { PlusCircle } from "lucide-react";
import { AccountType } from "@/lib/generated/prisma/client";

// Define schema matching the AccountType enum
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    type: z.enum([
        "CASH", "BANK", "PARTY", "EXPENSE", "INCOME", "CAPITAL", "LOAN", "FUND", "OTHER"
    ] as [string, ...string[]]), // Zod enum trick for strict typing if needed, or just list them
    openingBalance: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddAccountDialog() {
    const [open, setOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "CASH",
            openingBalance: 0,
        },
    });

    const { control, handleSubmit, register, formState: { errors }, reset } = form;

    async function onSubmit(values: FormValues) {
        try {
            await createAccount({
                name: values.name,
                type: values.type as AccountType,
                openingBalance: values.openingBalance,
            });
            toast.success("Account created successfully");
            setOpen(false);
            reset();
        } catch (error) {
            toast.error("Failed to create account");
            console.error(error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Account
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Account</DialogTitle>
                    <DialogDescription>
                        Create a new account to track transactions.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Account Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Account Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Petty Cash"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Account Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Controller
                            control={control}
                            name="type"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CASH">Cash</SelectItem>
                                        <SelectItem value="BANK">Bank</SelectItem>
                                        <SelectItem value="PARTY">Party (Customer/Supplier)</SelectItem>
                                        <SelectItem value="EXPENSE">Expense</SelectItem>
                                        <SelectItem value="INCOME">Income</SelectItem>
                                        <SelectItem value="CAPITAL">Capital</SelectItem>
                                        <SelectItem value="LOAN">Loan</SelectItem>
                                        <SelectItem value="FUND">Fund</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.type && (
                            <p className="text-sm font-medium text-destructive">{errors.type.message}</p>
                        )}
                    </div>

                    {/* Opening Balance */}
                    <div className="space-y-2">
                        <Label htmlFor="openingBalance">Opening Balance</Label>
                        <Input
                            id="openingBalance"
                            type="number"
                            step="0.01"
                            {...register("openingBalance")}
                        />
                        {errors.openingBalance && (
                            <p className="text-sm font-medium text-destructive">{errors.openingBalance.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit">Create Account</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
