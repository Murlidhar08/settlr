export function getInitials(name?: string | null) {
    if (!name) return "?";

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0][0]?.toUpperCase() ?? "?";
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getRoleBadgeColor(role: string) {
    switch (role?.toLowerCase()) {
        case "admin":
            return "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-900/50 dark:text-rose-400";
        case "user":
            return "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900/50 dark:text-blue-400";
        default:
            return "bg-muted text-muted-foreground border-border";
    }
}

export function sendWhatsappMessage(phone: string, message?: string): string {
    if (!phone) return "";
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    return `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function getUniqueUserName(name?: string): string {
    const base = name ? name.toLowerCase().replace(/\s+/g, '_') : 'user';
    const random = Math.floor(Math.random() * 10000);
    return `${base}_${Date.now().toString().slice(-6)}${random}`;
}