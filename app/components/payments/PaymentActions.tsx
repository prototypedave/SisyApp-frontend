"use client";

import {
  ArrowRight,
  DollarSign,
  SearchIcon,
} from "lucide-react";
import { useState } from "react";
import PaymentModal from "./Payments";
import PaymentSearchModal from "./PaymentSearchModal";


export default function PaymentActions() {
    const [makePaymentModalOpen, setMakePaymentModalOpen] = useState(false);
    const [searchPaymentModalOpen, setSearchPaymentModalOpen] = useState(false);
    const actions = [
      {
        title: "Make Payment",
        description: "Loan repayment",
        onClick: () => setMakePaymentModalOpen(true),
        icon: DollarSign,
        color: "bg-blue-100 text-blue-600",
      },
      {
        title: "Search Payment",
        description: "Search Payment records for individual borrower",
        onClick: () => setSearchPaymentModalOpen(true),
        icon: SearchIcon,
        color: "bg-green-100 text-green-600",
      },
    ];
    return (
        <div className="bg-white border border-slate-200 rounded-2xl">
            <div className="p-4 space-y-3 text-sm md:text-base">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <button key={action.title} onClick={action.onClick} className="group flex items-center text-left w-full justify-between rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}>
                                    <Icon size={22} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-800"> {action.title}</h3>
                                    <p className="font-medium text-slate-800"> {action.description}</p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="text-slate-400 transition-transform group-hover:translate-x-1"/>
                        </button>
                    );
                })}
                <PaymentModal open={makePaymentModalOpen} onClose={() => setMakePaymentModalOpen(false)} />
                <PaymentSearchModal open={searchPaymentModalOpen} onClose={() => setSearchPaymentModalOpen(false)} />
          </div>
      </div>
  );
}