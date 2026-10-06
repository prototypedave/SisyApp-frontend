"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (
        message: string,
        type: ToastType = "info"
    ) => {
        const id = Date.now();

        setToasts((prev) => [
            ...prev,
            { id, message, type },
        ]);

        setTimeout(() => {
            setToasts((prev) =>
                prev.filter((toast) => toast.id !== id)
            );
        }, 4000);
    };

    const removeToast = (id: number) => {
        setToasts((prev) =>
            prev.filter((toast) => toast.id !== id)
        );
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <div className="fixed right-5 top-5 z-[100] flex w-full max-w-sm flex-col gap-3">
                {toasts.map((toast) => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({
    toast,
    onClose,
}: {
    toast: Toast;
    onClose: () => void;
}) {
    const config = {
        success: {
            icon: CheckCircle,
            container:
                "border-green-200 bg-green-50 text-green-800",
            iconColor: "text-green-600",
        },
        error: {
            icon: XCircle,
            container:
                "border-red-200 bg-red-50 text-red-800",
            iconColor: "text-red-600",
        },
        warning: {
            icon: AlertCircle,
            container:
                "border-yellow-200 bg-yellow-50 text-yellow-800",
            iconColor: "text-yellow-600",
        },
        info: {
            icon: Info,
            container:
                "border-blue-200 bg-blue-50 text-blue-800",
            iconColor: "text-blue-600",
        },
    };

    const current = config[toast.type];
    const Icon = current.icon;

    return (
        <div
            className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg ${current.container}`}
        >
            <Icon
                className={`mt-0.5 h-5 w-5 shrink-0 ${current.iconColor}`}
            />

            <p className="flex-1 text-sm font-medium">
                {toast.message}
            </p>

            <button
                onClick={onClose}
                className="opacity-60 transition hover:opacity-100"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used inside ToastProvider"
        );
    }

    return context;
}