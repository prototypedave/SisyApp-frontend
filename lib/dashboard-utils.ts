export function formatKES(value: string | number): string {
    const amount = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(amount)) {
        return "KES 0";
    }

    return new Intl.NumberFormat(
        "en-KE",
        {
            style: "currency",
            currency: "KES",
            maximumFractionDigits: 0,
        }
    ).format(amount);
}


export function formatNumber( value: number ): string {
    return new Intl.NumberFormat(
        "en-KE"
    ).format(value);
}


export function formatRelativeTime( value: string | null ): string {
    if (!value) { return "";}
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 30) {
        return "Just now";
    }

    if (seconds < 60) {
        return `${seconds}s ago`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days}d ago`;
    }

    return date.toLocaleDateString(
        "en-KE",
        {
            day: "numeric",
            month: "short",
        }
    );
}


export function getCustomerName(
    customer: {
        first_name: string | null;
        last_name: string | null;
    }
): string {
    return [
        customer.first_name,
        customer.last_name,
    ]
        .filter(Boolean)
        .join(" ")
        .trim() || "Unknown customer";
}