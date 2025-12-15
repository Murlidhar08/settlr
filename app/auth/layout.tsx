export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <h1>Auth Layout</h1>
            {children}
        </main>
    );
}
