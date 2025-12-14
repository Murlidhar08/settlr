import { ComponentExample } from "@/components/component-example";
import { executePgFunction } from "@/lib/pgFunction";
import { prisma } from "@/lib/prisma";

export default async function Page() {
    const users = await prisma.user.findMany();
    const spUsers = await executePgFunction("get_all_users");
    const fnUsers = await executePgFunction("get_users_except_id", [5]);

    return (
        <>
            <h1>Users</h1>
            <hr />
            <ul>
                {users.map((user, idx: number) => (
                    <li key={idx}>Direct, {user.name}</li>
                ))}
            </ul>

            {/* SP Data */}
            <br />
            <br />
            <h1>Data</h1>
            <hr />
            <ul>
                {spUsers?.map((user, idx: number) => (
                    <li key={idx}>SP, {user.name}</li>
                ))}
            </ul>


            {/* Parameter SP */}
            <br />
            <br />
            <h1>Parameter</h1>
            <hr />
            <ul>
                {fnUsers?.map((user, idx: number) => (
                    <li key={idx}>Parameter, {user.name}</li>
                ))}
            </ul>
        </>
    );
}