export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center text-center">
      <div>
        <h1 className="text-2xl font-semibold">You’re offline</h1>
        <p className="mt-2 text-muted-foreground">
          Please check your internet connection.
        </p>
      </div>
    </div>
  );
}
