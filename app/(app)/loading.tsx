export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            {/* Main Loading Indicator Area */}
            <div className="flex flex-col gap-4 items-center justify-center bg-background/50 backdrop-blur-sm relative py-20 w-full h-full">
                <div className="relative">
                    <div className="loader border-r-2 rounded-full border-yellow-500 bg-yellow-300 animate-bounce aspect-square w-10 flex justify-center items-center text-yellow-700 font-bold shadow-lg shadow-yellow-500/20">
                        $
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/10 rounded-full blur-[2px] animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Loading</span>
                    <span className="flex gap-1">
                        <span className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1 h-1 rounded-full bg-primary animate-bounce" />
                    </span>
                </div>

                {/* Decorative Background Elements from LoadingScreen */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />
                </div>
            </div>
        </div>
    )
}


