import { ComponentExample } from "@/components/component-example";
import { prisma } from "@/lib/prisma";

export default async function Page() {
    const users = await prisma.user.findMany();
    return (
        <>
            <h1>Users</h1>
            <hr />
            <ul>
                {users.map((user, idx: number) => (
                    <li key={idx}>Mahesh, {user.name}</li>
                ))}
            </ul>
        </>
    );
}