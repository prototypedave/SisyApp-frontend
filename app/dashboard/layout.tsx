import { redirect } from "next/navigation";
import DashboardShell from "./DashboardShell";
import { getCurrentUser } from "@/lib/auth"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/");
    }
    return <DashboardShell>{children}</DashboardShell>;
}