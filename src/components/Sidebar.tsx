"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSociety } from "../context/SocietyContext";

export default function Sidebar() {
  const pathname = usePathname();
  const {
    activeRole,
    activeTab,
    setActiveTab,
    societyName,
    visitors,
    bills,
    parkingSlots,
    sosActive,
    user,
  } = useSociety();

  if (pathname === "/" || pathname === "/login") {
    return null;
  }

  // Live Counts
  const activeVisitorsCount = visitors?.filter((v) => v.status === "IN").length || 0;
  const unpaidBillsCount = bills?.filter((b) => b.status === "Unpaid").length || 0;
  const freeParkingCount = parkingSlots?.filter((s) => !s.occupied).length || 0;

  return (
    <aside className="w-full md:w-64 bg-white/95 backdrop-blur-xl text-sky-950 p-5 flex flex-col justify-between shrink-0 border-r border-sky-100 h-screen sticky top-0 overflow-y-auto shadow-sm transition-all z-30">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 pb-3 border-b border-sky-100">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-600 to-emerald-600 flex items-center justify-center font-black text-white text-lg shadow-md shadow-sky-500/20 shrink-0">
            SC
          </div>
          <div className="overflow-hidden">
            <h2 className="font-black text-sm tracking-tight text-sky-950 truncate">
              {societyName}
            </h2>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-sm text-sky-700 font-bold capitalize truncate">
                {activeRole} Workspace
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5 text-xs font-bold">
          <div className="px-3 py-1.5 text-[13px] font-black text-sky-500 uppercase tracking-wider flex justify-between items-center">
            <span>{activeRole} Navigation</span>
            <span className="text-[13px] bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-bold">
              Live
            </span>
          </div>

          {/* ADMIN NAVIGATION */}
          {activeRole === "admin" && (
            <>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold shadow-md shadow-sky-600/20 translate-x-1"
                    : "text-sky-800 hover:text-sky-950 hover:bg-sky-50/80 hover:translate-x-1 font-bold"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">📊</span> <span className="text-xs md:text-sm">Dashboard Overview</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("directory")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                  activeTab === "directory"
                    ? "bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold shadow-md shadow-sky-600/20 translate-x-1"
                    : "text-sky-800 hover:text-sky-950 hover:bg-sky-50/80 hover:translate-x-1 font-bold"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">🏢</span> <span className="text-xs md:text-sm">Flat Directory</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("billing")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                  activeTab === "billing"
                    ? "bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold shadow-md shadow-sky-600/20 translate-x-1"
                    : "text-sky-800 hover:text-sky-950 hover:bg-sky-50/80 hover:translate-x-1 font-bold"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">💳</span> <span className="text-xs md:text-sm">Billing & Ledger</span>
                </div>
                {unpaidBillsCount > 0 && (
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-black ${
                    activeTab === "billing" ? "bg-white/20 text-white" : "bg-rose-100 text-rose-800"
                  }`}>
                    {unpaidBillsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("gate")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                  activeTab === "gate"
                    ? "bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold shadow-md shadow-sky-600/20 translate-x-1"
                    : "text-sky-800 hover:text-sky-950 hover:bg-sky-50/80 hover:translate-x-1 font-bold"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">🛡️</span> <span className="text-xs md:text-sm">Gate Activity Log</span>
                </div>
                {activeVisitorsCount > 0 && (
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-black ${
                    activeTab === "gate" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {activeVisitorsCount} In
                  </span>
                )}
              </button>
            </>
          )}

          {/* RESIDENT NAVIGATION */}
          {activeRole === "resident" && (
            <>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold shadow-md shadow-sky-600/20 translate-x-1"
                    : "text-sky-800 hover:text-sky-950 hover:bg-sky-50/80 hover:translate-x-1 font-bold"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">📊</span> <span className="text-xs md:text-sm">Dashboard</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("residence")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                  activeTab === "residence"
                    ? "bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold shadow-md shadow-sky-600/20 translate-x-1"
                    : "text-sky-800 hover:text-sky-950 hover:bg-sky-50/80 hover:translate-x-1 font-bold"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">🏠</span> <span className="text-xs md:text-sm">My Profile</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("bills")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                  activeTab === "bills"
                    ? "bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold shadow-md shadow-sky-600/20 translate-x-1"
                    : "text-sky-800 hover:text-sky-950 hover:bg-sky-50/80 hover:translate-x-1 font-bold"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">📰</span> <span className="text-xs md:text-sm">Bills & Statements</span>
                </div>
              </button>
            </>
          )}

          {/* SECURITY NAVIGATION */}
          {activeRole === "security" && (
            <>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold shadow-md shadow-sky-600/20 translate-x-1"
                    : "text-sky-800 hover:text-sky-950 hover:bg-sky-50/80 hover:translate-x-1 font-bold"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">📊</span> <span className="text-xs md:text-sm">Dashboard</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("gate")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                  activeTab === "gate"
                    ? "bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold shadow-md shadow-sky-600/20 translate-x-1"
                    : "text-sky-800 hover:text-sky-950 hover:bg-sky-50/80 hover:translate-x-1 font-bold"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">🛡️</span> <span className="text-xs md:text-sm">Gate Check-In Logs</span>
                </div>
                {activeVisitorsCount > 0 && (
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-black ${
                    activeTab === "gate" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {activeVisitorsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("parking")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                  activeTab === "parking"
                    ? "bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold shadow-md shadow-sky-600/20 translate-x-1"
                    : "text-sky-800 hover:text-sky-950 hover:bg-sky-50/80 hover:translate-x-1 font-bold"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">🚗</span> <span className="text-xs md:text-sm">Parking Slots</span>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-black ${
                  activeTab === "parking" ? "bg-white/20 text-white" : "bg-sky-100 text-sky-800"
                }`}>
                  {freeParkingCount} Free
                </span>
              </button>

              <button
                onClick={() => setActiveTab("emergency")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                  activeTab === "emergency"
                    ? "bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold shadow-md shadow-sky-600/20 translate-x-1"
                    : "text-sky-800 hover:text-sky-950 hover:bg-sky-50/80 hover:translate-x-1 font-bold"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">🚨</span> <span className="text-xs md:text-sm">Emergency Hotline</span>
                </div>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="pt-4 space-y-3">
        <div className="p-3.5 bg-gradient-to-tr from-sky-50/80 via-blue-50/40 to-teal-50/80 rounded-2xl border border-sky-200/80 text-xs space-y-2 shadow-sm">
          <div className="flex items-center justify-between font-black text-sky-950">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-sm">System Live</span>
            </span>
          </div>

          {sosActive ? (
            <div className="p-2 bg-rose-100 border border-rose-300 rounded-xl text-rose-800 font-black text-xs flex items-center justify-between animate-pulse">
              <span>🚨 SOS ACTIVE!</span>
              <span>112</span>
            </div>
          ) : (
            <div className="text-sm text-sky-700 font-bold">
              Unit: <span className="font-black text-sky-900">{user?.flat || "Admin"}</span> • {user?.name || "User"}
            </div>
          )}
        </div>

        <Link
          href="/"
          className="flex items-center space-x-3 text-sky-800 hover:text-rose-600 hover:bg-rose-50 p-3 rounded-2xl transition-all font-black text-sm border border-transparent hover:border-rose-200"
        >
          <span>🚪</span> <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
