export default async function Page() {
    const res = await fetch("http://localhost:3000/api/hello");
    const data = await res.json();

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold">Mahesh Chavda</h1>
            <p className="mt-4 text-green-600">{data.message}</p>
        </div>
    );
}
