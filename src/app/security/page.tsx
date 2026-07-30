"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useSociety, Visitor } from "../../context/SocietyContext";

export default function SecurityConsole() {
  const { visitors, parkingSlots, flats, activeTab, addVisitor, editVisitor, toggleVisitorStatus, deleteVisitor } = useSociety();

  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);

  const [visitorForm, setVisitorForm] = useState({
    name: "",
    phone: "",
    flat: "A-101",
    purpose: "Delivery (Zomato/Swiggy/Amazon)",
    parkingSlot: "P-02",
  });

  const handleVisitorSubmit = (e: any) => {
    e.preventDefault();
    if (!visitorForm.name || visitorForm.phone.length !== 10) {
      globalThis.alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    addVisitor({
      ...visitorForm,
      phone: `+91 ${visitorForm.phone}`,
    });
    setShowVisitorModal(false);
    setVisitorForm({ name: "", phone: "", flat: "A-101", purpose: "Guest / Relative", parkingSlot: "P-05" });
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

  const sortedParkingOptions = [...parkingSlots].sort((a, b) => {
    if (a.occupied === b.occupied) return a.id.localeCompare(b.id);
    return a.occupied ? 1 : -1;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-sky-50 via-blue-50/60 to-teal-50/80 font-sans text-sky-950 antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">

          {/* Header */}
          <div className="relative bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-500/15 overflow-hidden border border-sky-300/30">
            <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-xs font-semibold text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse"></span>
                  Security Gate Console &bull; Live Gate Operations
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Visitor Gate Console
                </h1>
                <p className="text-xs sm:text-sm text-sky-100 font-medium">
                  Real-time visitor check-in, departure logs, and dynamic parking slot directory.
                </p>
              </div>

              <button
                onClick={() => setShowVisitorModal(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-sky-900 hover:bg-sky-50 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 self-start sm:self-auto shrink-0"
              >
                <span className="text-sm">➕</span>
                <span>Check-In New Visitor</span>
              </button>
            </div>
          </div>

          {/* Gate Activity Section */}
          {(activeTab === "dashboard" || activeTab === "gate") && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-sky-100 space-y-6">
              
              {/* Activity Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 pb-5">
                <div className="flex items-center space-x-3">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                  </span>
                  <div>
                    <h2 className="font-extrabold text-sky-950 text-base sm:text-lg tracking-tight">
                      Live Gate Activity Stream & Visitor Logs
                    </h2>
                    <p className="text-xs text-sky-600 font-medium">
                      Real-time gate check-ins, departure times, and audit trail
                    </p>
                  </div>
                </div>

                <span className="self-start sm:self-center text-xs font-extrabold bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full border border-emerald-200/80 shadow-xs">
                  ● {visitors.filter((v) => v.status === "IN").length} Active Visitors Inside
                </span>
              </div>

              {/* Visitor Cards List */}
              <div className="space-y-4">
                {visitors.map((visitor) => (
                  <div
                    key={visitor.id}
                    className="bg-sky-50/40 hover:bg-white p-5 rounded-3xl border border-sky-100/90 hover:border-sky-300 hover:shadow-md transition-all duration-200 space-y-4"
                  >
                    {/* Avatar, Visitor Main Info, Status, Actions */}
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

          {/* Emergency Hotline */}
          {(activeTab === "dashboard" || activeTab === "emergency") && (
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sky-950 text-base flex items-center gap-2">
                  <span>🚨</span> <span>Emergency Hotline & Direct Desk (India)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <a href="tel:112" className="p-4 rounded-2xl bg-sky-50/60 hover:bg-sky-50 border border-sky-100 transition space-y-1 block">
                    <div className="text-sm font-bold text-sky-950">National Police Emergency</div>
                    <div className="text-sky-700 font-mono text-sm font-bold flex items-center gap-1">
                      <span>📞</span> 112 / 100
                    </div>
                  </a>

                  <a href="tel:101" className="p-4 rounded-2xl bg-sky-50/60 hover:bg-sky-50 border border-sky-100 transition space-y-1 block">
                    <div className="text-sm font-bold text-sky-950">Fire Brigade & Ambulance</div>
                    <div className="text-sky-700 font-mono text-sm font-bold flex items-center gap-1">
                      <span>🚑</span> 101 / 102 (108)
                    </div>
                  </a>

                  <a href="tel:1234567890" className="p-4 rounded-2xl bg-sky-50/60 hover:bg-sky-50 border border-sky-100 transition space-y-1 block">
                    <div className="text-sm font-bold text-sky-950">Society Admin Desk (VIVEK JOSHI)</div>
                    <div className="text-sky-700 font-mono text-sm font-bold flex items-center gap-1">
                      <span>📞</span> +91 1234567890
                    </div>
                  </a>
                </div>
              </div>

              {/* Protocols Guide Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sky-950 text-base flex items-center gap-2">
                  <span>📖</span> <span>Emergency Action Protocols & Response Guide</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-rose-50/80 border border-rose-200/80 rounded-2xl space-y-1.5">
                    <div className="text-sm font-extrabold text-rose-950 flex items-center gap-1.5">
                      <span>🔥</span> <span>Fire & Smoke Response Protocol</span>
                    </div>
                    <p className="text-rose-800 text-sm font-medium leading-relaxed">
                      Trigger manual call point and immediately notify Fire Brigade (101). Clear stairwells and direct residents.
                    </p>
                  </div>

                  <div className="p-4 bg-sky-50/80 border border-sky-200/80 rounded-2xl space-y-1.5">
                    <div className="text-sm font-extrabold text-sky-950 flex items-center gap-1.5">
                      <span>🏥</span> <span>Medical Response Protocol</span>
                    </div>
                    <p className="text-sky-800 text-sm font-medium leading-relaxed">
                      Clear gate barriers immediately to guide incoming ambulance directly to the designated resident flat.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* New Visitor Check-In */}
      {showVisitorModal && (
        <div className="fixed inset-0 bg-sky-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-5 border border-sky-100 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center border-b border-sky-100 pb-3">
              <h3 className="text-base font-extrabold text-sky-950">New Gate Visitor Check-In</h3>
              <button 
                type="button" 
                onClick={() => setShowVisitorModal(false)}
                className="text-sky-400 hover:text-sky-950 font-bold text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVisitorSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-sky-900 block">Visitor Full Name</label>
                <input
                  type="text"
                  value={visitorForm.name}
                  onChange={(e: any) => setVisitorForm({ ...visitorForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
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
                    value={visitorForm.phone}
                    onChange={(e: any) => {
                      const numericOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setVisitorForm({ ...visitorForm, phone: numericOnly });
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
                  value={visitorForm.purpose}
                  onChange={(e: any) => setVisitorForm({ ...visitorForm, purpose: e.target.value })}
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
                    value={visitorForm.flat}
                    onChange={(e: any) => setVisitorForm({ ...visitorForm, flat: e.target.value })}
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
                    value={visitorForm.parkingSlot}
                    onChange={(e: any) => setVisitorForm({ ...visitorForm, parkingSlot: e.target.value })}
                    className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  >
                    {sortedParkingOptions.map((p) => (
                      <option
                        key={p.id}
                        value={p.id}
                        disabled={p.occupied && p.id !== visitorForm.parkingSlot}
                      >
                        {p.id} {p.occupied && p.id !== visitorForm.parkingSlot ? `(Occupied)` : "(Available)"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowVisitorModal(false)} 
                  className="px-5 py-2.5 text-xs font-bold text-sky-700 hover:text-sky-950 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-emerald-600/20 transition"
                >
                  Confirm Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Visitor */}
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
                        {p.id} {p.occupied && p.id !== editingVisitor.parkingSlot ? `(Occupied)` : "(Available ✓)"}
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

    </div>
  );
}