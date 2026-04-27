"use client"

import {
    addBusiness,
    deleteBusiness,
    switchBusiness,
    updateBusiness
} from "@/actions/business.actions"
import { BackHeader } from "@/components/back-header"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useSession } from "@/lib/auth/auth-client"
import { Business } from "@/lib/generated/prisma/client"
import { cn } from "@/lib/utils"
import { useBusinessList } from "@/tanstacks/business"
import { AnimatePresence, motion } from "framer-motion"
import { Building2, Check, Loader2, Pencil, Plus, ShieldAlert, Trash2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function BusinessPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const activeId = session?.user?.activeBusinessId || null

    const { data, isLoading, refetch } = useBusinessList()
    const businesses = data ?? [] as Business[]

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState("")
    const [isAdding, setIsAdding] = useState(false)
    const [newName, setNewName] = useState("")
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSwitch = async (id: string) => {
        if (editingId) return;
        try {
            await switchBusiness(id)
            router.push("/dashboard")
            toast.success("Active business switched")
        } catch (error) {
            toast.error("Failed to switch business")
        }
    }

    const handleAdd = async () => {
        if (!newName.trim() || isSubmitting) return
        setIsSubmitting(true)
        try {
            await addBusiness(newName)
            setNewName("")
            setIsAdding(false)
            await refetch()
            toast.success("Business created successfully")
        } catch (error: any) {
            toast.error(error.message || "Failed to create business")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdate = async (id: string) => {
        if (!editName.trim() || isSubmitting) return
        setIsSubmitting(true)
        try {
            await updateBusiness(id, editName)
            setEditingId(null)
            await refetch()
            toast.success("Business updated successfully")
        } catch (error: any) {
            toast.error(error.message || "Failed to update business")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteId || isSubmitting) return
        setIsSubmitting(true)
        try {
            await deleteBusiness(deleteId)
            setDeleteId(null)
            await refetch()
            toast.success("Business deleted successfully")
        } catch (error: any) {
            toast.error(error.message || "Failed to delete business")
        } finally {
            setIsSubmitting(false)
        }
    }

    const businessToDelete = businesses.find(b => b.id === deleteId);

    return (
        <div className="w-full bg-background pb-34">
            <BackHeader title="Manage Businesses" />

            <div className="mx-auto max-w-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold">Your Businesses</h3>
                        <p className="text-sm text-muted-foreground">Manage and organize your business entities</p>
                    </div>
                    {!isAdding && (
                        <Button
                            onClick={() => setIsAdding(true)}
                            className="gap-2 rounded-full shadow-lg hover:shadow-xl transition-all"
                        >
                            <Plus size={18} /> Add New
                        </Button>
                    )}
                </div>

                <AnimatePresence mode="popLayout">
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-8"
                        >
                            <Card className="p-4 border-2 border-primary/20 bg-primary/5 shadow-sm">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                        <Building2 size={14} /> NEW BUSINESS
                                    </h4>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter business name..."
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                            autoFocus
                                            className="h-12 text-lg font-medium rounded-xl"
                                        />
                                        <Button onClick={handleAdd} className="h-12 px-6 rounded-xl font-bold">Create</Button>
                                        <Button variant="ghost" onClick={() => setIsAdding(false)} className="h-12 w-12 rounded-xl text-muted-foreground"><X size={20} /></Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid gap-4">
                    {isLoading ? (
                        [1, 2].map(i => <div key={i} className="h-24 w-full bg-muted animate-pulse rounded-2xl" />)
                    ) : businesses.length === 0 ? (
                        <div className="py-20 text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center text-2xl">🏢</div>
                            <p className="text-muted-foreground font-medium">No businesses found. Add one to get started.</p>
                        </div>
                    ) : (
                        businesses.map((business, index) => (
                            <motion.div
                                key={business.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    className={cn(
                                        "p-4 flex flex-row items-center justify-between group transition-all shadow-sm cursor-pointer border-2",
                                        activeId === business.id
                                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                            : "hover:border-primary/50"
                                    )}
                                    onClick={() => handleSwitch(business.id)}
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={cn(
                                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                                            activeId === business.id ? "bg-primary text-white" : "bg-muted text-primary"
                                        )}>
                                            <Building2 size={24} />
                                        </div>
                                        {editingId === business.id ? (
                                            <div className="flex gap-2 flex-1 max-w-md" onClick={(e) => e.stopPropagation()}>
                                                <Input
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate(business.id)}
                                                    autoFocus
                                                    className="h-10 font-bold text-lg rounded-xl"
                                                />
                                                <Button size="icon" onClick={() => handleUpdate(business.id)} className="h-10 w-10 shrink-0 rounded-xl"><Check size={18} /></Button>
                                                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-10 w-10 shrink-0 rounded-xl"><X size={18} /></Button>
                                            </div>
                                        ) : (
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-xl font-bold tracking-tight">{business.name}</h4>
                                                    {activeId === business.id && (
                                                        <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                                                            <Check size={10} /> Active
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Business ID: #{business.id}</p>
                                            </div>
                                        )}
                                    </div>

                                    {!editingId && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingId(business.id)
                                                    setEditName(business.name)
                                                }}
                                            >
                                                <Pencil size={18} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-xl hover:bg-rose-100 hover:text-rose-600 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteId(business.id)
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="rounded-3xl border-rose-200">
                    <AlertDialogHeader>
                        <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-2">
                            <ShieldAlert size={32} />
                        </div>
                        <AlertDialogTitle className="text-center text-2xl font-black">Hold on!</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-base">
                            This will permanently delete {businessToDelete ? <span className="font-bold text-foreground">"{businessToDelete.name}"</span> : "the business"} and all its associated data (Transactions, Parties, etc.). This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-0">
                        <AlertDialogCancel className="h-12 rounded-2xl font-bold border-none bg-muted">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            disabled={isSubmitting}
                            className="h-12 rounded-2xl font-bold bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200 gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
                            {isSubmitting ? "Deleting..." : "Yes, Delete Business"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
