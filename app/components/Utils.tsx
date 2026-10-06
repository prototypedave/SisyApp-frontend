import { InputHTMLAttributes } from "react";

interface InputFieldProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function InputField({
  label,
  ...props
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        {...props}
        className="text-slate-700 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}


export interface Customer {
    id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    gender?: string;
    mobile: string;
    occupation: string;
    title?: string;
    salary?: string;
    alias?: string;
    alias_mobile?: string;
    company?: string;

    active_loans?: number;
    outstanding?: string;
    next_payment?: string;
    can_record_payment?: boolean;

    status?: "Active" | "Blacklisted" | "Archived";
    loan_status?: "Active" | "Overdue" | "None";

    blacklisted?: boolean;
    archived?: boolean;
}

export const getFullName = (customer: Customer) => [
    customer.first_name,
    customer.middle_name,
    customer.last_name,
  ].filter(Boolean)
  .join(" ");

export const getInitials = (customer: Customer) => `${customer.first_name?.[0] ?? ""}${ customer.last_name?.[0] ?? ""}`.toUpperCase();

export interface Loan {
    id: string;
    client_id: string;
    amount: string;
    interest?: string;
    balance: string;
    pay_date: string;
    created_at?: string;
    paid: boolean;
    status?: string;
    client: string;
    mobile: string;
}


export interface Payment {
    id: string;
    client: string;
    client_id?: string;
    mobile?: string;
    loan_id: string;
    amount: string;
    pay_date: string;
    method?: string;
}

export function Info({ label, value,}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
        </div>
    );
}

export const getMethodLabel = (method?: string) => {
    if (!method) {
        return "M-Pesa";
    }

    const normalized = method
        .trim()
        .toLowerCase();

    switch (normalized) {
        case "mpesa":
        case "m-pesa":
        case "m_pesa":
            return "M-Pesa";

        case "cash":
            return "Cash";

        case "bank":
            return "Bank";

        default:
            return method;
    }
};

export const formatKES = (value: string | number) => {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "KES 0";
    }

    return `KES ${amount.toLocaleString("en-KE", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
};

export const formatDate = (value?: string) => {
    if (!value) {
        return "—";
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-KE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export const getMethodClasses = (method?: string) => {
    switch (getMethodLabel(method)) {
        case "M-Pesa":
            return "bg-green-50 text-green-700 border-green-100";

        case "Cash":
            return "bg-amber-50 text-amber-700 border-amber-100";

        case "Bank":
            return "bg-blue-50 text-blue-700 border-blue-100";

        default:
            return "bg-slate-50 text-slate-600 border-slate-200";
    }
};

export function formatDateTime(value: string | null | undefined): string {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(date);
}