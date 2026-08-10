import { getUserById } from "@/actions/user.actions";
import { BackHeader } from "@/components/back-header";
import { UserProfileHeader } from "@/components/user/user-profile-header";
import { notFound } from "next/navigation";
import UserForm from "../../components/user-form";

export default async function UserEditPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const user = await getUserById(userId);

    if (!user) notFound();

    return (
        <>
            <BackHeader title="Edit User (Admin)" />

            <div className="flex-1 min-h-screen bg-background/50 p-4 sm:p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* Header Section */}
                    <UserProfileHeader user={user} isEditing={true} />

                    {/* Form Section */}
                    <UserForm initialData={user} />
                </div>
            </div>
        </>
    );
}
