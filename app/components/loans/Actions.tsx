"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";


interface ActionsCardProps {
  title: string;

  iconName: string;           
  color: string;
  description: string;
  onClick?: () => void;
}


export default function Actions({
  title,
  iconName,
  color,
  description,
  onClick
}: ActionsCardProps) {
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcon;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <div className="flex items-start justify-between">
          <button onClick={onClick} className="group w-full flex text-left items-center justify-between rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm"> 
              <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                      <Icon size={22} />
                  </div>
              <div>
                  <h3 className="font-medium text-slate-800">{title}</h3>
                  <p className="text-sm text-slate-500">{description}</p>
              </div>
            </div>
        </button>
    </div>

    </div>
  );
}