"use client";

interface SettingsSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function SettingsSection({
    title,
    children,
}: SettingsSectionProps) {
    return (
        <section className="mb-6 md:mb-8">
            <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {title}
            </h2>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {children}
            </div>
        </section>
    );
}