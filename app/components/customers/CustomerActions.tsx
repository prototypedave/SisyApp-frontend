"use client";

import {
  ArrowRight,
  UserCog,
  UserMinus,
  UserPlus,
  UserLock
} from "lucide-react";
import { useState } from "react";
import BlacklistModal from "./BlacklistCustomerModal";
import CustomerModal from "./CustomerModal";
import DeleteModal from "./DeleteCustomerModal";
import EditCustomerModal from "./EditCustomerModal";
import BlacklistCustomerModal from "./BlacklistCustomerModal";
import DeleteCustomerModal from "./DeleteCustomerModal";


export default function ClientActions() {
    const [addClientModalOpen, setAddClientModalOpen] = useState(false);
    const [editClientModalOpen, setEditClientModalOpen] = useState(false);
    const [removeClientModalOpen, setRemoveClientModalOpen] = useState(false);
    const [blacklistModalOpen, setBlacklistModalOpen] = useState(false);
    const actions = [
      {
        title: "Add Client",
        description: "New borrower",
        onClick: () => setAddClientModalOpen(true),
        icon: UserPlus,
        color: "bg-blue-100 text-blue-600",
      },
      {
        title: "Edit Client",
        description: "Update Borrowers details",
        onClick: () => setEditClientModalOpen(true),
        icon: UserCog,
        color: "bg-green-100 text-green-600",
      },
      {
        title: "Remove Client",
        description: "Deregister invalid client details",
        onClick: () => setRemoveClientModalOpen(true),
        icon: UserMinus,
        color: "bg-purple-100 text-purple-600",
      },
      {
        title: "Blacklist Client",
        description: "Block client from platform",
        onClick: () => setBlacklistModalOpen(true),
        icon: UserLock,
        color: "bg-red-100 text-red-900",
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
                <EditCustomerModal open={editClientModalOpen} onClose={() => setEditClientModalOpen(false)} customer={null} />
                <BlacklistCustomerModal open={blacklistModalOpen} onClose={() => setBlacklistModalOpen(false)} customer={null} />
                <CustomerModal open={addClientModalOpen} onClose={() => setAddClientModalOpen(false)} />
                <DeleteCustomerModal open={removeClientModalOpen} onClose={() => setRemoveClientModalOpen(false)} customer={null} />
          </div>
      </div>
  );
}