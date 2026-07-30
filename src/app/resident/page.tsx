"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useSociety, Bill } from "../../context/SocietyContext";

export default function ResidentDashboard() {
  const { bills, flats, payBill, triggerSos, user, activeTab, societyName } = useSociety();

  const activeFlat = user?.flat || "A-101";

  const flatRecord = flats.find((f) => `${f.wing}-${f.id}` === activeFlat) || {
    id: "101",
    wing: "A",
    owner: user?.name || "VIVEK JOSHI",
    phone: "1234567890",
    status: "Occupied",
    balance: 2500,
  };

  const [payingBill, setPayingBill] = useState<Bill | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Bill | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD">("UPI");

  const [cardNumber, setCardNumber] = useState("4532 8901 2341 8921");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("123");

  const handleCardNumberChange = (e: any) => {
    const rawDigits = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = rawDigits.match(/.{1,4}/g)?.join(" ") || rawDigits;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: any) => {
    const rawDigits = e.target.value.replace(/\D/g, "").slice(0, 4);
    let formatted = rawDigits;
    if (rawDigits.length >= 3) {
      formatted = `${rawDigits.slice(0, 2)}/${rawDigits.slice(2, 4)}`;
    }
    setCardExpiry(formatted);
  };

  const handleCvvChange = (e: any) => {
    const rawDigits = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCardCvv(rawDigits);
  };

  const handleConfirmPayment = (e: any) => {
    e.preventDefault();
    if (!payingBill) return;

    payBill(payingBill.id, paymentMethod);
    setPayingBill(null);
  };

  const myBills = bills
    .filter((b) => b.flat === activeFlat || b.flat === "All Flats")
    .sort((a, b) => b.id.localeCompare(a.id));

  const totalPendingDues = myBills
    .filter((b) => b.status === "Unpaid")
    .reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-sky-50 via-blue-50/60 to-teal-50/80 antialiased font-sans text-sky-950">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Header Light Sky & Teal Banner */}
          <div className="relative bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-500/15 overflow-hidden border border-sky-300/30">
            <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute top-0 right-1/4 w-40 h-40 bg-teal-300/20 rounded-full blur-xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-xs font-semibold text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse"></span>
                  Resident Portal &bull; {societyName || "Smart Society"}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Welcome Back, {flatRecord.owner.split(" ")[0]} 👋
                </h1>
                <p className="text-sm text-sky-50 font-medium flex items-center gap-2 flex-wrap">
                  <span>Assigned Residence:</span>
                  <span className="font-bold text-white bg-white/20 border border-white/30 px-2.5 py-0.5 rounded-lg text-xs">
                    Unit {activeFlat}
                  </span>
                  <span className="text-sky-200">&bull;</span>
                  <span>Wing {flatRecord.wing}</span>
                </p>
              </div>

              <button
                onClick={() => triggerSos(true)}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-rose-400/40 self-start lg:self-auto"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <span>Trigger Emergency SOS</span>
              </button>
            </div>
          </div>

          {/* Residence Details Tab */}
          {(activeTab === "residence" || activeTab === "dashboard") && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Unit Ownership Card */}
              <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-100 pb-5">
                  <div>
                    <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full border border-sky-200/80">
                      Primary Ownership Details
                    </span>
                    <h2 className="text-2xl font-black text-sky-950 mt-2">{flatRecord.owner}</h2>
                    <p className="text-xs text-sky-600 font-medium">Registered Flat Owner & Resident</p>
                  </div>
                  
                  <span className={`self-start sm:self-center text-xs font-bold px-3.5 py-1.5 rounded-full border ${
                    flatRecord.status === "Occupied" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    ● {flatRecord.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 transition hover:border-sky-200">
                    <span className="text-[13px] font-extrabold text-sky-500 uppercase tracking-wider">Assigned Unit</span>
                    <div className="text-base font-black text-sky-950 mt-1">{activeFlat}</div>
                  </div>

                  <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 transition hover:border-sky-200">
                    <span className="text-[13px] font-extrabold text-sky-500 uppercase tracking-wider">Building Wing</span>
                    <div className="text-base font-black text-sky-950 mt-1">Wing {flatRecord.wing}</div>
                  </div>

                  <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 transition hover:border-sky-200">
                    <span className="text-[13px] font-extrabold text-sky-500 uppercase tracking-wider">Parking Slot</span>
                    <div className="text-base font-black text-teal-600 mt-1">Slot P-01</div>
                  </div>

                  <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 transition hover:border-sky-200">
                    <span className="text-[13px] font-extrabold text-sky-500 uppercase tracking-wider">Contact Number</span>
                    <div className="text-xs font-mono font-bold text-sky-900 mt-1.5">{flatRecord.phone}</div>
                  </div>

                  <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 transition hover:border-sky-200">
                    <span className="text-[13px] font-extrabold text-sky-500 uppercase tracking-wider">Registered Email</span>
                    <div className="text-xs font-bold text-sky-900 mt-1.5 truncate">{user?.email || "vivekjoshi@ad.com"}</div>
                  </div>

                  <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 transition hover:border-sky-200">
                    <span className="text-[13px] font-extrabold text-sky-500 uppercase tracking-wider">Society Unique ID</span>
                    <div className="text-xs font-mono font-bold text-sky-700 mt-1.5">RES-2026-901</div>
                  </div>
                </div>

                {/* Active Society Dues Light Banner */}
                <div className="p-5 bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md shadow-sky-500/15">
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-base text-white">Active Society Dues Summary</div>
                    <div className="text-sky-100 text-xs font-medium">Pending Statements for Unit {activeFlat}</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-2xl font-black text-white tracking-tight bg-white/20 px-4 py-1.5 rounded-2xl backdrop-blur-sm border border-white/30">
                      ₹{totalPendingDues.toLocaleString("en-IN")}.00
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Helpdesk Directory (No empty gaps) */}
              <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                    <div>
                      <h3 className="font-extrabold text-sky-950 text-base">Helpdesk Directory</h3>
                      <p className="text-[12px] text-sky-500 font-medium">Essential society emergency contacts</p>
                    </div>
                    <span className="text-[12px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">
                      ● Live 24/7
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Contact 1 */}
                    <div className="p-3 bg-sky-50/60 rounded-2xl border border-sky-100/80 hover:bg-sky-50 transition flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-sky-950">Maintenance Office (VIVEK JOSHI)</div>
                        <div className="text-sky-700 font-mono text-xs font-bold mt-0.5 flex items-center gap-1.5">
                          <span>📞</span> 1234567890
                        </div>
                      </div>
                      <a href="tel:1234567890" className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition">
                        Call
                      </a>
                    </div>

                    {/* Contact 2 */}
                    <div className="p-3 bg-sky-50/60 rounded-2xl border border-sky-100/80 hover:bg-sky-50 transition flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-sky-950">Main Gate Security Desk</div>
                        <div className="text-sky-700 font-mono text-xs font-bold mt-0.5 flex items-center gap-1.5">
                          <span>🛡️</span> 1234567890
                        </div>
                      </div>
                      <a href="tel:1234567890" className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition">
                        Call
                      </a>
                    </div>

                    {/* Contact 3 */}
                    <div className="p-3 bg-sky-50/60 rounded-2xl border border-sky-100/80 hover:bg-sky-50 transition flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-sky-950">Clubhouse & Amenities Admin</div>
                        <div className="text-sky-700 font-mono text-xs font-bold mt-0.5 flex items-center gap-1.5">
                          <span>🏊</span> 1234567890
                        </div>
                      </div>
                      <a href="tel:1234567890" className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition">
                        Call
                      </a>
                    </div>

                    {/* Contact 4 */}
                    <div className="p-3 bg-sky-50/60 rounded-2xl border border-sky-100/80 hover:bg-sky-50 transition flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-sky-950">Electrician & Plumber Desk</div>
                        <div className="text-sky-700 font-mono text-xs font-bold mt-0.5 flex items-center gap-1.5">
                          <span>🔧</span> 1234567890
                        </div>
                      </div>
                      <a href="tel:1234567890" className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition">
                        Call
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-sky-50 to-teal-50 rounded-2xl border border-sky-200/70 text-xs text-sky-950 space-y-1">
                  <div className="font-extrabold flex items-center gap-1.5 text-sky-900">
                    <span>✨ Live Digital Sync</span>
                  </div>
                  <p className="text-sky-700 text-[12px] font-medium leading-relaxed">
                    Pay online via UPI or Card for instant official payment receipts with QR verification.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* Monthly Statements Section */}
          {(activeTab === "bills" || activeTab === "dashboard") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sky-950 text-lg tracking-tight">Maintenance Statements</h3>
                  <p className="text-xs text-sky-600 font-medium">Monthly billing breakdown for Unit {activeFlat}</p>
                </div>
                <span className="text-sm font-bold text-sky-700 bg-sky-100/80 px-3 py-1 rounded-full border border-sky-200">
                  {myBills.length} Records
                </span>
              </div>

              {myBills.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-sky-100 text-center text-sky-500 text-sm font-semibold space-y-2">
                  <div className="w-12 h-12 bg-sky-50 text-sky-400 rounded-full flex items-center justify-center mx-auto text-lg font-bold">📄</div>
                  <p>No maintenance statements found for flat {activeFlat}.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {myBills.map((bill) => (
                    <div key={bill.id} className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[13px] font-extrabold text-sky-400 uppercase tracking-wider">{bill.month}</span>
                            <h3 className="text-2xl font-black text-sky-950 mt-0.5">₹{bill.amount.toLocaleString("en-IN")}.00</h3>
                          </div>
                          
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                            bill.status === "Paid" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>
                            {bill.status}
                          </span>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-sky-100 text-xs">
                          <div className="flex justify-between text-sky-600">
                            <span>Invoice Ref:</span>
                            <span className="font-mono font-bold text-sky-900">{bill.id}</span>
                          </div>
                          <div className="flex justify-between text-sky-600">
                            <span>Due Date:</span>
                            <span className="font-semibold text-sky-900">{bill.dueDate}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        {bill.status === "Unpaid" ? (
                          <button
                            onClick={() => setPayingBill(bill)}
                            className="w-full bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white py-3 rounded-2xl text-xs font-bold transition-all duration-200 shadow-md shadow-sky-600/20 active:scale-[0.99]"
                          >
                            Pay Maintenance Bill
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedReceipt(bill)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 active:scale-[0.99]"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                            <span>Download Receipt</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Payment Gateway Modal */}
      {payingBill && (
        <div className="fixed inset-0 bg-sky-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6 border border-sky-100 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center border-b border-sky-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-sky-950">Checkout Gateway</h3>
                <p className="text-xs text-sky-600 font-medium">Complete maintenance bill payment</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                🔒 256-Bit Encrypted
              </span>
            </div>

            <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 text-xs space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-sky-600">Invoice Reference:</span>
                <span className="text-sky-950 font-bold">{payingBill.id} ({payingBill.month})</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-sky-600">Assigned Flat:</span>
                <span className="text-sky-700 font-bold">{payingBill.flat}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-sky-200 text-sky-950">
                <span>Total Amount Payable:</span>
                <span className="text-emerald-600">₹{payingBill.amount.toLocaleString("en-IN")}.00</span>
              </div>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-sky-900 block mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("UPI")}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                      paymentMethod === "UPI" 
                        ? "border-sky-600 bg-sky-50 text-sky-900 shadow-sm" 
                        : "border-sky-100 bg-sky-50/30 text-sky-600 hover:bg-sky-50"
                    }`}
                  >
                    <span>📱</span> <span>UPI / VPA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("CARD")}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                      paymentMethod === "CARD" 
                        ? "border-sky-600 bg-sky-50 text-sky-900 shadow-sm" 
                        : "border-sky-100 bg-sky-50/30 text-sky-600 hover:bg-sky-50"
                    }`}
                  >
                    <span>💳</span> <span>Credit / Debit</span>
                  </button>
                </div>
              </div>

              {paymentMethod === "UPI" ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-sky-900 block">UPI Virtual ID / VPA</label>
                  <input
                    type="text"
                    defaultValue="vivekjoshi@upi"
                    className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-semibold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-sky-900 block">Card Number (16 Digits)</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4532 8901 2341 8921"
                      className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-mono font-bold text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-sky-900 block">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-mono font-bold text-sky-950 text-center focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-sky-900 block">CVV (3 Digits)</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        className="w-full bg-sky-50/50 border border-sky-200 p-3 rounded-2xl text-xs font-mono font-bold text-sky-950 text-center focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setPayingBill(null)} 
                  className="px-5 py-2.5 bg-sky-100/80 hover:bg-sky-200/80 text-sky-800 text-xs font-bold rounded-2xl transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-emerald-600/20 transition"
                >
                  Confirm & Pay ₹{payingBill.amount}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Printable Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-sky-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6 border border-sky-100 printable-receipt animate-in fade-in zoom-in-95 duration-150">
            
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
                <span className="text-sky-600 font-medium">Assigned Unit:</span>
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
                className="px-5 py-2.5 bg-sky-100/80 hover:bg-sky-200/80 text-sky-800 text-xs font-bold rounded-2xl transition"
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