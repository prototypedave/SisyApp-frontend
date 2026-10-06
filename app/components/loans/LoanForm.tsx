"use client";

export default function CustomerLoan()
 {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
                <h2 className="text-lg font-semibold text-slate-800">Disburse Client Loan</h2>
                <p className="text-sm text-slate-500">Enter client details</p>
            </div>
        </div>
        <form>
            <div className="grid grid-cols-3 gap-6 md:grid-cols-3 xl:grid-cols-3">
                <div className="grid grid-rows-1 gap-4 ">
                    <label className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">First Name</label>
                    <input className="px-6 py-4 text-left"/>
                </div>
                <div className="grid grid-rows-1 gap-4 ">
                    <label className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">Middle Name (optional)</label>
                    <input className="px-6 py-4 text-left"/>
                </div>
                <div className="grid grid-rows-1 gap-4 ">
                    <label className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">Last Name</label>
                    <input className="px-6 py-4 text-left"/>
                </div>
                <div className="grid grid-rows-1 gap-4 ">
                    <label className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">ID Number</label>
                    <input className="px-6 py-4 text-left"/>
                </div>
                <div className="grid grid-rows-1 gap-4 ">
                    <label className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">Gender</label>
                    <input className="px-6 py-4 text-left"/>
                </div>
                <div className="grid grid-rows-1 gap-4 ">
                    <label className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">Mobile</label>
                    <input className="px-6 py-4 text-left"/>
                </div>
                <div className="grid grid-rows-1 gap-4 ">
                    <label className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">Occupation</label>
                    <input className="px-6 py-4 text-left"/>
                </div>
                <div className="grid grid-rows-1 gap-4 ">
                    <label className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">Title (Optional)</label>
                    <input className="px-6 py-4 text-left"/>
                </div>
                <div className="grid grid-rows-1 gap-4 ">
                    <label className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">Salary</label>
                    <input className="px-6 py-4 text-left"/>
                </div>
                <div className="grid grid-rows-1 gap-4 ">
                    <label className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">Alias</label>
                    <input className="px-6 py-4 text-left"/>
                </div>
                <div className="grid grid-rows-1 gap-4 ">
                    <label className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">Alias Mobile</label>
                    <input className="px-6 py-4 text-left"/>
                </div>
            </div>
            <div className="grid grid-cols-1">
                <button className="px-6, py-4 bg-blue-700 justify-center">Submit</button>
            </div>
        </form>
    </div>
  );
}