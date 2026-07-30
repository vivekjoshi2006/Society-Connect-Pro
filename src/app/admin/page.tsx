"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useSociety, Flat, Bill, Visitor } from "../../context/SocietyContext";

export default function AdminDashboard() {
  const {
    flats,
    bills,
    visitors,
    parkingSlots,
    activeTab,
    setActiveTab,
    addBill,
    editBill,
    deleteBill,
    addFlat,
    editFlat,
    deleteFlat,
    addVisitor,
    editVisitor,
    toggleVisitorStatus,
    deleteVisitor,
    societyName,
  } = useSociety();

  const [showBillModal, setShowBillModal] = useState(false);
  const [showAddFlatModal, setShowAddFlatModal] = useState(false);
  const [editingFlat, setEditingFlat] = useState<Flat | null>(null);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<Bill | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Bill | null>(null);

  const [newBill, setNewBill] = useState({
    flat: "A-101",
    amount: 2500,
    dueDate: "2026-08-31",
    month: "August 2026",
    status: "Unpaid" as const,
  });

  const [newFlat, setNewFlat] = useState({
    id: "103",
    wing: "A",
    owner: "VIVEK JOSHI",
    phone: "+91 98765 43210",
    status: "Occupied" as const,
  });

  const handleTargetFlatChange = (selectedFlatKey: string) => {
    if (selectedFlatKey === "All Flats") {
      setNewBill({
        ...newBill,
        flat: "All Flats",
        amount: 2500,
      });
    } else {
      const matchedFlat = flats.find((f) => `${f.wing}-${f.id}` === selectedFlatKey);
      setNewBill({
        ...newBill,
        flat: selectedFlatKey,
        amount: matchedFlat ? matchedFlat.balance || 2500 : 2500,
      });
    }
  };

  const handleBillSubmit = (e: any) => {
    e.preventDefault();
    const created = addBill(newBill);
    setShowBillModal(false);
    setGeneratedInvoice(created);
  };

  const handleAddFlatSubmit = (e: any) => {
    e.preventDefault();
    if (!newFlat.id || !newFlat.owner || !newFlat.phone) {
      globalThis.alert("Please fill in all required flat details.");
      return;
    }

    const existing = flats.find((f) => f.id === newFlat.id && f.wing === newFlat.wing);
    if (existing) {
      globalThis.alert(`Flat ${newFlat.wing}-${newFlat.id} already exists!`);
      return;
    }

    addFlat({
      id: newFlat.id,
      wing: newFlat.wing,
      owner: newFlat.owner,
      phone: newFlat.phone,
      status: newFlat.status,
    });

    setShowAddFlatModal(false);
    setNewFlat({ id: "105", wing: "A", owner: "VIVEK JOSHI", phone: "+91 98765 43210", status: "Occupied" });
  };

  const handleEditFlatSubmit = (e: any) => {
    e.preventDefault();
    if (!editingFlat) return;
    editFlat(editingFlat.id, editingFlat);
    setEditingFlat(null);
  };

  const handleEditBillSubmit = (e: any) => {
    e.preventDefault();
    if (!editingBill) return;
    editBill(editingBill.id, editingBill);
    setEditingBill(null);
  };

  const handleEditVisitorSubmit = (e: any) => {
    e.preventDefault();
    if (!editingVisitor) return;

    const rawDigits = editingVisitor.phone.replace("+91 ", "").replace("+91", "").replace(/\D/g, "").slice(0, 10);
    if (rawDigits.length !== 10) {
      globalThis.alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    editVisitor(editingVisitor.id, {
      ...editingVisitor,
      phone: `+91 ${rawDigits}`,
    });
    setEditingVisitor(null);
  };

  const handleTotalAmountChange = (newVal: number) => {
    if (!editingFlat) return;
    const totalAmt = Math.max(0, newVal);
    const paid = Math.min(editingFlat.totalPaid ?? 0, totalAmt);
    const pending = totalAmt - paid;
    setEditingFlat({
      ...editingFlat,
      totalAmount: totalAmt,
      totalPaid: paid,
      balance: pending,
    });
  };

  const handleTotalPaidChange = (newVal: number) => {
    if (!editingFlat) return;
    const totalAmt = editingFlat.totalAmount ?? (editingFlat.balance + (editingFlat.totalPaid ?? 0));
    const paid = Math.min(Math.max(0, newVal), totalAmt);
    const pending = Math.max(0, totalAmt - paid);
    setEditingFlat({
      ...editingFlat,
      totalPaid: paid,
      balance: pending,
    });
  };

  const handlePendingDuesChange = (newVal: number) => {
    if (!editingFlat) return;
    const pending = Math.max(0, newVal);
    const paid = editingFlat.totalPaid ?? 0;
    const totalAmt = paid + pending;
    setEditingFlat({
      ...editingFlat,
      balance: pending,
      totalAmount: totalAmt,
    });
  };

  const sortedBills = [...bills].sort((a, b) => b.id.localeCompare(a.id));

  const sortedParkingOptions = [...parkingSlots].sort((a, b) => {
    if (a.occupied === b.occupied) return a.id.localeCompare(b.id);
    return a.occupied ? 1 : -1;
  });

  const residentDuesSummary = flats.map((f) => {
    const flatKey = `${f.wing}-${f.id}`;
    const residentBills = bills.filter((b) => b.flat === flatKey || b.flat === "All Flats");
    const paidBillsSum = residentBills.filter((b) => b.status === "Paid").reduce((acc, b) => acc + b.amount, 0);

    const paidTotal = f.totalPaid !== undefined ? f.totalPaid : paidBillsSum;
    const pendingTotal = f.balance;
    const totalAmount = f.totalAmount !== undefined ? f.totalAmount : (paidTotal + pendingTotal);

    const rawUnpaidMonths = residentBills.filter((b) => b.status === "Unpaid").map((b) => b.month);
    const unpaidMonths = Array.from(new Set(rawUnpaidMonths));

    return {
      flatRecord: f,
      flat: flatKey,
      owner: f.owner,
      totalAmount,
      paidTotal,
      unpaidTotal: pendingTotal,
      unpaidMonths,
    };
  });

  const totalUnpaidDues = flats.reduce((acc, f) => acc + f.balance, 0);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-sky-50 via-blue-50/60 to-teal-50/80 text-sky-950 antialiased font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h1 className="text-xl sm:text-2xl font-black text-sky-950 tracking-tight">Admin Control Center</h1>
              </div>
              <p className="text-xs text-sky-600 font-semibold flex items-center space-x-1">
                <span>Logged Admin:</span>
                <span className="font-bold text-sky-900 bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 rounded-md">VIVEK JOSHI</span>
                <span>• Flat Directory & Billing Manager</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowAddFlatModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2 active:scale-95"
              >
                <span>🏢</span> <span>Add New Flat</span>
              </button>

              <button
                onClick={() => setShowBillModal(true)}
                className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center space-x-2 active:scale-95"
              >
                <span>➕</span> <span>Generate Monthly Bill</span>
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              onClick={() => setActiveTab("directory")}
              className={`p-5 rounded-3xl border cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                activeTab === "directory"
                  ? "bg-sky-50/90 border-sky-400 ring-2 ring-sky-500/20"
                  : "bg-white border-sky-100 hover:border-sky-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="text-sky-600 text-xs font-black uppercase tracking-wider">Total Society Flats</div>
                <div className="p-2 bg-sky-100 text-sky-700 rounded-2xl text-base">🏢</div>
              </div>
              <div className="text-3xl font-black text-sky-950 mt-2">{flats.length}</div>
              <div className="text-xs text-emerald-600 font-bold mt-2 flex items-center space-x-1">
                <span>✓</span> <span>100% Units Tracked</span>
              </div>
            </div>

            <div
              onClick={() => setActiveTab("billing")}
              className={`p-5 rounded-3xl border cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                activeTab === "billing"
                  ? "bg-rose-50/90 border-rose-400 ring-2 ring-rose-500/20"
                  : "bg-white border-sky-100 hover:border-sky-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="text-sky-600 text-xs font-black uppercase tracking-wider">Unpaid Monthly Dues</div>
                <div className="p-2 bg-rose-100 text-rose-700 rounded-2xl text-base">💰</div>
              </div>
              <div className="text-3xl font-black text-rose-600 mt-2">
                ₹{totalUnpaidDues.toLocaleString("en-IN")}
              </div>
              <div className="text-xs text-rose-500 font-bold mt-2 flex items-center space-x-1">
                <span>⚠️</span> <span>{flats.filter((f) => f.balance > 0).length} Units Pending Payment</span>
              </div>
            </div>

            <div
              onClick={() => setActiveTab("gate")}
              className={`p-5 rounded-3xl border cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                activeTab === "gate"
                  ? "bg-teal-50/90 border-teal-400 ring-2 ring-teal-500/20"
                  : "bg-white border-sky-100 hover:border-sky-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="text-sky-600 text-xs font-black uppercase tracking-wider">Active Gate Visitors</div>
                <div className="p-2 bg-teal-100 text-teal-700 rounded-2xl text-base">🛂</div>
              </div>
              <div className="text-3xl font-black text-teal-700 mt-2">
                {visitors.filter((v) => v.status === "IN").length}
              </div>
              <div className="text-xs text-sky-600 font-bold mt-2 flex items-center space-x-1">
                <span className="inline-block w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
                <span>Gate Console Sync Active</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="text-sky-600 text-xs font-black uppercase tracking-wider">Occupancy Status</div>
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-2xl text-base">🔑</div>
              </div>
              <div className="text-3xl font-black text-emerald-600 mt-2">
                {flats.filter((f) => f.status !== "Vacant").length} / {flats.length}
              </div>
              <div className="text-xs text-emerald-600 font-bold mt-2">Units Occupied</div>
            </div>
          </div>

          {/* FLAT DIRECTORY */}
          {(activeTab === "dashboard" || activeTab === "directory") && (
            <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden space-y-1">
              <div className="p-6 border-b border-sky-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="font-extrabold text-sky-950 text-base">Society Flat Records Directory</h3>
                  <p className="text-xs text-sky-600 font-medium">Add, edit, or delete resident records with precise edit history.</p>
                </div>
                <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
                  {flats.length} Flats Registered
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-sky-50/80 text-sky-700 uppercase font-extrabold tracking-wider border-b border-sky-100">
                      <th className="p-4 pl-6">Flat No</th>
                      <th className="p-4">Wing</th>
                      <th className="p-4">Owner / Resident</th>
                      <th className="p-4">Contact Phone</th>
                      <th className="p-4">Occupancy Status</th>
                      <th className="p-4">Last Update History</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100 text-sky-900 font-medium">
                    {flats.map((flat) => (
                      <tr key={flat.id} className="hover:bg-sky-50/50 transition-colors">
                        <td className="p-4 pl-6 font-extrabold text-sky-950 text-sm">{flat.wing}-{flat.id}</td>
                        <td className="p-4 font-bold text-sky-700">
                          <span className="bg-sky-50 text-sky-800 px-2.5 py-1 rounded-lg border border-sky-200/80">
                            Wing {flat.wing}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-sky-950">{flat.owner}</td>
                        <td className="p-4 font-mono font-bold text-sky-700">{flat.phone}</td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                              flat.status === "Occupied"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : flat.status === "Rented"
                                ? "bg-sky-50 text-sky-700 border border-sky-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              flat.status === "Occupied" ? "bg-emerald-500" : flat.status === "Rented" ? "bg-sky-500" : "bg-amber-500"
                            }`}></span>
                            {flat.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="text-sky-950 font-semibold">{flat.lastUpdateLog || "Record active"}</div>
                          <div className="text-sky-500 font-mono text-[11px] mt-0.5">{flat.lastUpdated || "N/A"}</div>
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <button
                            onClick={() => setEditingFlat(flat)}
                            className="text-xs font-bold text-sky-700 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-xl border border-sky-200 transition-all"
                          >
                            Edit Flat
                          </button>
                          <button
                            onClick={() => {
                              if (globalThis.confirm(`Are you sure you want to delete Flat ${flat.wing}-${flat.id}?`)) {
                                deleteFlat(flat.id);
                              }
                            }}
                            className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BILLING MANAGER & RESIDENT LEDGER */}
          {(activeTab === "dashboard" || activeTab === "billing") && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sky-100 pb-4 gap-2">
                  <div>
                    <h3 className="font-extrabold text-sky-950 text-base">Resident Maintenance Dues & Payment Ledger</h3>
                    <p className="text-xs text-sky-600 font-medium">Track total amount payable, paid amount, pending dues balance, and unpaid months.</p>
                  </div>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full">
                    Total Dues: ₹{totalUnpaidDues.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-sky-50/80 text-sky-700 uppercase font-extrabold tracking-wider border-b border-sky-100">
                        <th className="p-3.5">Flat</th>
                        <th className="p-3.5">Resident</th>
                        <th className="p-3.5">Total Amount (₹)</th>
                        <th className="p-3.5">Total Paid (₹)</th>
                        <th className="p-3.5">Pending Dues (₹)</th>
                        <th className="p-3.5">Unpaid Months</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100 font-medium">
                      {residentDuesSummary.map((res) => (
                        <tr key={res.flat} className="hover:bg-sky-50/50 transition-colors">
                          <td className="p-3.5 font-extrabold text-sky-700">{res.flat}</td>
                          <td className="p-3.5 font-bold text-sky-950">{res.owner}</td>
                          <td className="p-3.5 font-black text-sky-950">₹{res.totalAmount.toLocaleString("en-IN")}</td>
                          <td className="p-3.5 font-bold text-emerald-600">₹{res.paidTotal.toLocaleString("en-IN")}</td>
                          <td className="p-3.5 font-bold text-rose-600">₹{res.unpaidTotal.toLocaleString("en-IN")}</td>
                          <td className="p-3.5">
                            {res.unpaidMonths.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {res.unpaidMonths.map((m) => (
                                  <span key={m} className="bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-emerald-700 font-bold text-xs bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1">
                              <span>All Clear</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => setEditingFlat(res.flatRecord)}
                              className="bg-sky-50 hover:bg-sky-100 text-sky-700 px-3 py-1 rounded-xl font-bold transition border border-sky-200 text-xs"
                            >
                              Edit Dues
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Issued Invoices */}
              <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-sky-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-sky-950 text-base">Issued Invoices Log (Latest First)</h3>
                    <p className="text-xs text-sky-600 font-medium">History of all generated maintenance statements</p>
                  </div>
                  <button
                    onClick={() => setShowBillModal(true)}
                    className="text-xs bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white px-3.5 py-2 rounded-2xl font-bold transition-all shadow-md shadow-sky-600/20 flex items-center space-x-1"
                  >
                    <span>+</span> <span>Generate New Bill</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-sky-50/80 text-sky-700 uppercase font-extrabold tracking-wider border-b border-sky-100">
                        <th className="p-3.5">Invoice ID</th>
                        <th className="p-3.5">Target Flat</th>
                        <th className="p-3.5">Billing Month</th>
                        <th className="p-3.5">Amount (₹)</th>
                        <th className="p-3.5">Due Date</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100">
                      {sortedBills.map((bill) => (
                        <tr key={bill.id} className="hover:bg-sky-50/50 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-sky-950">{bill.id}</td>
                          <td className="p-3.5 font-bold text-sky-700">{bill.flat}</td>
                          <td className="p-3.5 font-semibold text-sky-900">{bill.month}</td>
                          <td className="p-3.5 font-black text-sky-950">₹{bill.amount.toLocaleString("en-IN")}</td>
                          <td className="p-3.5 font-mono font-semibold text-sky-600">{bill.dueDate}</td>
                          <td className="p-3.5">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block border ${
                              bill.status === "Paid"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-rose-50 border-rose-200 text-rose-700"
                            }`}>
                              {bill.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5">
                            {bill.status === "Paid" && (
                              <button
                                onClick={() => setSelectedReceipt(bill)}
                                className="bg-sky-50 hover:bg-sky-100 text-sky-800 px-3 py-1 rounded-xl font-bold transition border border-sky-200"
                              >
                                📥 Receipt
                              </button>
                            )}
                            <button
                              onClick={() => setEditingBill(bill)}
                              className="bg-sky-50 hover:bg-sky-100 text-sky-700 px-3 py-1 rounded-xl font-bold transition border border-sky-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (globalThis.confirm(`Delete bill ${bill.id}?`)) deleteBill(bill.id);
                              }}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1 rounded-xl font-bold transition border border-rose-200"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ATE ACTIVITY LOG */}
          {(activeTab === "dashboard" || activeTab === "gate") && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-sky-100 space-y-6">
              
              {/* Activity Stream Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 pb-5">
                <div className="flex items-center space-x-3">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                  </span>
                  <div>
                    <h2 className="font-extrabold text-sky-950 text-base sm:text-lg tracking-tight">
                      Live Gate Activity Console & Visitor Log
                    </h2>
                    <p className="text-xs text-sky-600 font-medium">
                      Real-time gate check-ins, departure timestamps & edit history
                    </p>
                  </div>
                </div>

                <span className="self-start sm:self-center text-xs font-extrabold bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full border border-emerald-200/80 shadow-xs">
                  ● {visitors.filter((v) => v.status === "IN").length} Inside Premises
                </span>
              </div>

              {/* Visitor Cards List */}
              <div className="space-y-4">
                {visitors.map((visitor) => (
                  <div
                    key={visitor.id}
                    className="bg-sky-50/40 hover:bg-white p-5 rounded-3xl border border-sky-100/90 hover:border-sky-300 hover:shadow-md transition-all duration-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-sky-100">                
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md shadow-sky-500/20">
                          {visitor.name.charAt(0)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-base text-sky-950">{visitor.name}</h3>
                            <span
                              className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full border ${
                                visitor.status === "IN"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-sky-100/70 text-sky-700 border-sky-200"
                              }`}
                            >
                              ● {visitor.status === "IN" ? "INSIDE PREMISES" : "DEPARTED"}
                            </span>
                          </div>
                          <div className="text-xs font-mono text-sky-600 font-bold mt-0.5">
                            📞 {visitor.phone}
                          </div>
                        </div>
                      </div>

                      {/* Quick Action Controls */}
                      <div className="flex items-center space-x-2 self-start sm:self-auto">
                        {visitor.status === "IN" ? (
                          <button
                            onClick={() => toggleVisitorStatus(visitor.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all border border-rose-200 shadow-xs flex items-center space-x-1.5 active:scale-95"
                          >
                            <span>🚪</span>
                            <span>Check Out</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleVisitorStatus(visitor.id)}
                            className="bg-sky-50 hover:bg-sky-100 text-sky-800 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all border border-sky-200 shadow-xs flex items-center space-x-1.5 active:scale-95"
                            title="Click to Re-Check In"
                          >
                            <span>🔄</span>
                            <span>Re-Check In</span>
                          </button>
                        )}

                        <button
                          onClick={() => setEditingVisitor(visitor)}
                          className="bg-sky-100/80 hover:bg-sky-200 text-sky-900 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border border-sky-200/80 active:scale-95"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteVisitor(visitor.id)}
                          className="text-sky-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-2xl transition-all"
                          title="Delete Entry"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Organized Grid of Visit Metadata */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      
                      {/* Target Unit */}
                      <div className="bg-white p-3 rounded-2xl border border-sky-100/80">
                        <span className="text-[13px] font-extrabold text-sky-400 uppercase tracking-wider block">Target Unit</span>
                        <span className="font-black text-sky-950 text-sm mt-0.5 block">{visitor.flat}</span>
                      </div>

                      {/* Purpose */}
                      <div className="bg-white p-3 rounded-2xl border border-sky-100/80">
                        <span className="text-[13px] font-extrabold text-sky-400 uppercase tracking-wider block">Purpose</span>
                        <span className="font-bold text-sky-900 truncate mt-0.5 block">{visitor.purpose}</span>
                      </div>

                      {/* Parking Slot */}
                      <div className="bg-white p-3 rounded-2xl border border-sky-100/80">
                        <span className="text-[13px] font-extrabold text-sky-400 uppercase tracking-wider block">Parking Slot</span>
                        <span className="font-mono font-black text-teal-700 mt-0.5 block">{visitor.parkingSlot}</span>
                      </div>

                      {/* Entry & Exit Timeline */}
                      <div className="bg-white p-3 rounded-2xl border border-sky-100/80">
                        <span className="text-[13px] font-extrabold text-sky-400 uppercase tracking-wider block">Timeline</span>
                        <div className="text-[13px] font-bold mt-0.5 flex flex-wrap gap-x-2">
                          <span className="text-emerald-700">In: {visitor.entryTime}</span>
                          <span className="text-amber-700">Out: {visitor.checkOutTime || "Inside"}</span>
                        </div>
                      </div>

                    </div>

                    {/* Audit Log Note */}
                    {visitor.lastUpdateLog && (
                      <div className="text-[13px] font-semibold text-amber-900 bg-amber-50/80 border border-amber-200/80 px-3.5 py-1.5 rounded-xl flex items-center justify-between">
                        <span>✏️ <strong>Log Note:</strong> {visitor.lastUpdateLog}</span>
                        <span className="font-mono text-amber-700">{visitor.lastUpdated}</span>
                      </div>
                    )}

                  </div>
                ))}
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Generate Bill */}
      {showBillModal && (
        <div className="fixed inset-0 bg-sky-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-4 border border-sky-100">
            <div className="border-b border-sky-100 pb-3 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-sky-950">Generate Maintenance Invoice</h3>
              <button
                onClick={() => setShowBillModal(false)}
                className="text-sky-400 hover:text-sky-950 font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleBillSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Target Flat Unit</label>
                <select
                  value={newBill.flat}
                  onChange={(e: any) => handleTargetFlatChange(e.target.value)}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                >
                  {flats.map((f) => (
                    <option key={f.id} value={`${f.wing}-${f.id}`}>{`${f.wing}-${f.id} (${f.owner})`}</option>
                  ))}
                  <option value="All Flats">All Flats (Broadcast Bill)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Amount Per Unit (₹)</label>
                <input
                  type="number"
                  value={newBill.amount}
                  onChange={(e: any) => setNewBill({ ...newBill, amount: Number(e.target.value) })}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-bold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  required
                />
              </div>

              {newBill.flat === "All Flats" && (
                <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl text-xs font-bold text-sky-900 space-y-1">
                  <div className="flex justify-between">
                    <span>Target Units Count:</span>
                    <span>{flats.length} Society Flats</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Per Unit:</span>
                    <span>₹{newBill.amount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-xs font-black text-sky-800 pt-1 border-t border-sky-200">
                    <span>Total Cumulative Dues:</span>
                    <span>₹{(flats.length * newBill.amount).toLocaleString("en-IN")}.00</span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Billing Cycle Month</label>
                <select
                  value={newBill.month}
                  onChange={(e: any) => setNewBill({ ...newBill, month: e.target.value })}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                >
                  <option value="August 2026">August 2026</option>
                  <option value="September 2026">September 2026</option>
                  <option value="October 2026">October 2026</option>
                  <option value="November 2026">November 2026</option>
                  <option value="December 2026">December 2026</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={newBill.dueDate}
                  onChange={(e: any) => setNewBill({ ...newBill, dueDate: e.target.value })}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBillModal(false)}
                  className="px-5 py-2.5 text-xs font-bold text-sky-700 hover:text-sky-950 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-sky-600/20 transition-all"
                >
                  Generate & Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Flat */}
      {showAddFlatModal && (
        <div className="fixed inset-0 bg-sky-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-4 border border-sky-100">
            <div className="border-b border-sky-100 pb-3 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-sky-950">Add New Flat Record</h3>
              <button
                onClick={() => setShowAddFlatModal(false)}
                className="text-sky-400 hover:text-sky-950 font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddFlatSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-sky-900 block mb-1">Flat No (e.g. 105)</label>
                  <input
                    type="text"
                    value={newFlat.id}
                    onChange={(e: any) => setNewFlat({ ...newFlat, id: e.target.value })}
                    className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-sky-900 block mb-1">Wing</label>
                  <select
                    value={newFlat.wing}
                    onChange={(e: any) => setNewFlat({ ...newFlat, wing: e.target.value })}
                    className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  >
                    <option value="A">Wing A</option>
                    <option value="B">Wing B</option>
                    <option value="C">Wing C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Resident Name</label>
                <input
                  type="text"
                  value={newFlat.owner}
                  onChange={(e: any) => setNewFlat({ ...newFlat, owner: e.target.value })}
                  placeholder="e.g. VIVEK JOSHI"
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={newFlat.phone}
                  onChange={(e: any) => setNewFlat({ ...newFlat, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Occupancy Status</label>
                <select
                  value={newFlat.status}
                  onChange={(e: any) => setNewFlat({ ...newFlat, status: e.target.value as any })}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                >
                  <option value="Occupied">Occupied</option>
                  <option value="Rented">Rented</option>
                  <option value="Vacant">Vacant</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFlatModal(false)}
                  className="px-5 py-2.5 text-xs font-bold text-sky-700 hover:text-sky-950 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-emerald-600/20 transition-all"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Flat Record & Dues */}
      {editingFlat && (
        <div className="fixed inset-0 bg-sky-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-4 border border-sky-100">
            <div className="border-b border-sky-100 pb-3 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-sky-950">
                Edit Record: Flat {editingFlat.wing}-{editingFlat.id}
              </h3>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
                Admin Edit
              </span>
            </div>

            <form onSubmit={handleEditFlatSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Resident Name</label>
                <input
                  type="text"
                  value={editingFlat.owner}
                  onChange={(e: any) => setEditingFlat({ ...editingFlat, owner: e.target.value })}
                  placeholder="e.g. VIVEK JOSHI"
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={editingFlat.phone}
                  onChange={(e: any) => setEditingFlat({ ...editingFlat, phone: e.target.value })}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Wing</label>
                <select
                  value={editingFlat.wing}
                  onChange={(e: any) => setEditingFlat({ ...editingFlat, wing: e.target.value })}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                >
                  <option value="A">Wing A</option>
                  <option value="B">Wing B</option>
                  <option value="C">Wing C</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Occupancy Status</label>
                <select
                  value={editingFlat.status}
                  onChange={(e: any) => setEditingFlat({ ...editingFlat, status: e.target.value as any })}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                >
                  <option value="Occupied">Occupied</option>
                  <option value="Rented">Rented</option>
                  <option value="Vacant">Vacant</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Total Amount Payable (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editingFlat.totalAmount ?? (editingFlat.balance + (editingFlat.totalPaid ?? 0))}
                  onChange={(e: any) => {
                    const rawDigits = e.target.value.replace(/\D/g, "");
                    handleTotalAmountChange(Number(rawDigits));
                  }}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-black text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Total Paid Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editingFlat.totalPaid ?? 0}
                  onChange={(e: any) => {
                    const rawDigits = e.target.value.replace(/\D/g, "");
                    handleTotalPaidChange(Number(rawDigits));
                  }}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Pending Dues Balance (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editingFlat.balance ?? 0}
                  onChange={(e: any) => {
                    const rawDigits = e.target.value.replace(/\D/g, "");
                    handlePendingDuesChange(Number(rawDigits));
                  }}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFlat(null)}
                  className="px-5 py-2.5 text-xs font-bold text-sky-700 hover:text-sky-950 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-sky-600/20 transition-all"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Bill */}
      {editingBill && (
        <div className="fixed inset-0 bg-sky-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-4 border border-sky-100">
            <div className="border-b border-sky-100 pb-3 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-sky-950">Edit Invoice ({editingBill.id})</h3>
              <button
                onClick={() => setEditingBill(null)}
                className="text-sky-400 hover:text-sky-950 font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditBillSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={editingBill.amount}
                  onChange={(e: any) => setEditingBill({ ...editingBill, amount: Number(e.target.value) })}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-bold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Status</label>
                <select
                  value={editingBill.status}
                  onChange={(e: any) => setEditingBill({ ...editingBill, status: e.target.value as any })}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-sky-900 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={editingBill.dueDate}
                  onChange={(e: any) => setEditingBill({ ...editingBill, dueDate: e.target.value })}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBill(null)}
                  className="px-5 py-2.5 text-xs font-bold text-sky-700 hover:text-sky-950 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-sky-600/20 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Visitor Log */}
      {editingVisitor && (
        <div className="fixed inset-0 bg-sky-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-5 border border-sky-100 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center border-b border-sky-100 pb-3">
              <h3 className="text-base font-extrabold text-sky-950">Edit Visitor Entry Log</h3>
              <button 
                type="button" 
                onClick={() => setEditingVisitor(null)}
                className="text-sky-400 hover:text-sky-950 font-bold text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditVisitorSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-sky-900 block">Visitor Full Name</label>
                <input
                  type="text"
                  value={editingVisitor.name}
                  onChange={(e: any) => setEditingVisitor({ ...editingVisitor, name: e.target.value })}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-sky-900 block">Mobile Phone (10 Digits)</label>
                <div className="flex items-center bg-sky-50/50 border border-sky-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/20">
                  <span className="bg-sky-100/80 text-sky-800 px-3.5 py-3 font-bold text-xs border-r border-sky-200 select-none">
                    +91
                  </span>
                  <input
                    type="text"
                    maxLength={10}
                    value={editingVisitor.phone.replace("+91 ", "").replace("+91", "").replace(/\D/g, "").slice(0, 10)}
                    onChange={(e: any) => {
                      const numericOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setEditingVisitor({ ...editingVisitor, phone: `+91 ${numericOnly}` });
                    }}
                    placeholder="9820012345"
                    className="w-full bg-transparent p-3 text-xs font-semibold text-sky-950 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-sky-900 block">Purpose of Visit</label>
                <select
                  value={editingVisitor.purpose}
                  onChange={(e: any) => setEditingVisitor({ ...editingVisitor, purpose: e.target.value })}
                  className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                >
                  <option value="Delivery (Zomato/Swiggy/Amazon)">Delivery (Zomato/Swiggy/Amazon)</option>
                  <option value="Guest / Relative">Guest / Relative</option>
                  <option value="Cab (Uber/Ola)">Cab (Uber/Ola)</option>
                  <option value="Maintenance / Electrician">Maintenance / Electrician</option>
                  <option value="House Helper / Maid">House Helper / Maid</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-sky-900 block">Target Flat</label>
                  <select
                    value={editingVisitor.flat}
                    onChange={(e: any) => setEditingVisitor({ ...editingVisitor, flat: e.target.value })}
                    className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  >
                    {flats.map((f) => (
                      <option key={f.id} value={`${f.wing}-${f.id}`}>{`${f.wing}-${f.id}`}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-sky-900 block">Parking Slot</label>
                  <select
                    value={editingVisitor.parkingSlot}
                    onChange={(e: any) => setEditingVisitor({ ...editingVisitor, parkingSlot: e.target.value })}
                    className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  >
                    {sortedParkingOptions.map((p) => (
                      <option
                        key={p.id}
                        value={p.id}
                        disabled={p.occupied && p.id !== editingVisitor.parkingSlot}
                      >
                        {p.id} {p.occupied && p.id !== editingVisitor.parkingSlot ? `(Occupied)` : "(Available)"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setEditingVisitor(null)} 
                  className="px-5 py-2.5 bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold rounded-2xl transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-emerald-600/20 transition"
                >
                  Update Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt View */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-sky-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6 border border-sky-100 printable-receipt">
            <div className="text-center border-b border-sky-100 pb-5 space-y-1">
              <div className="w-12 h-12 bg-sky-600 text-white font-black text-xl rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-sky-600/30">
                SC
              </div>
              <h2 className="text-xl font-black text-sky-950">{societyName}</h2>
              <p className="text-[11px] text-sky-500 uppercase tracking-wider font-extrabold">Official Maintenance Payment Receipt</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-sky-100 pb-2">
                <span className="text-sky-600 font-medium">Receipt No:</span>
                <span className="font-mono font-bold text-sky-950">{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between border-b border-sky-100 pb-2">
                <span className="text-sky-600 font-medium">Assigned Flat:</span>
                <span className="font-bold text-sky-700">{selectedReceipt.flat}</span>
              </div>
              <div className="flex justify-between border-b border-sky-100 pb-2">
                <span className="text-sky-600 font-medium">Billing Period:</span>
                <span className="font-bold text-sky-950">{selectedReceipt.month}</span>
              </div>
              <div className="flex justify-between border-b border-sky-100 pb-2">
                <span className="text-sky-600 font-medium">Paid On:</span>
                <span className="font-bold text-sky-950">{selectedReceipt.paidOn || "2026-07-29"}</span>
              </div>
              <div className="flex justify-between border-b border-sky-100 pb-2">
                <span className="text-sky-600 font-medium">Transaction Reference:</span>
                <span className="font-mono text-xs text-sky-800 font-bold">{selectedReceipt.transactionId || "TXN8921034921 (UPI)"}</span>
              </div>
              <div className="flex justify-between text-base font-black pt-2 text-sky-950">
                <span>Amount Paid:</span>
                <span className="text-emerald-600">₹{selectedReceipt.amount.toLocaleString("en-IN")}.00</span>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 font-bold text-center flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              <span>Verified Digital Stamp &bull; Payment Confirmed</span>
            </div>

            <div className="flex justify-between gap-3 pt-2 no-print">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-5 py-2.5 bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold rounded-2xl transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => globalThis.print()}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-sky-600/20 transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}