"use client";

import { useSociety } from "../context/SocietyContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, activeRole, sosActive, triggerSos, societyName } = useSociety();
  const router = useRouter();

  const handleLogout = (e: any) => {
    e.preventDefault();
    router.push("/");
  };

  const displayName = user?.name || "VIVEK JOSHI";

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md border-b border-sky-100 px-6 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-40">
        {/* Emergency SOS Indicator */}
        <div className="flex items-center space-x-3">
          <span className="text-xs font-black bg-sky-50 text-sky-900 px-3.5 py-1.5 rounded-full border border-sky-200/80 uppercase tracking-wider shadow-sm">
            {societyName}
          </span>
          {sosActive && (
            <button
              onClick={() => triggerSos(true)}
              className="animate-pulse bg-rose-600 hover:bg-rose-700 text-white text-xs font-black px-3.5 py-1.5 rounded-full flex items-center space-x-1.5 shadow-md shadow-rose-600/20 transition"
            >
              <span>🚨</span> <span>EMERGENCY SOS ACTIVE</span>
            </button>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm md:text-sm font-black text-sky-950">{displayName}</div>
            <div className="text-sm text-teal-600 font-extrabold capitalize">{activeRole} Workspace</div>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white font-black flex items-center justify-center text-sm shadow-md shadow-sky-500/20">
            {displayName.charAt(0)}
          </div>

          {sosActive && (
            <button
              onClick={(e: any) => {
                e.preventDefault();
                triggerSos(false);
              }}
              className="bg-sky-100 hover:bg-sky-200 text-sky-900 text-xs font-black px-3.5 py-2 rounded-xl transition border border-sky-200"
            >
              Clear SOS
            </button>
          )}

          <button
            onClick={handleLogout}
            className="text-sm font-black text-sky-800 hover:text-rose-600 bg-sky-50 hover:bg-rose-50 px-3.5 py-2 rounded-xl border border-sky-200/80 transition shadow-sm"
            title="Sign Out"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Emergency SOS Active Helpline Modal */}
      {sosActive && (
        <div className="fixed inset-0 bg-sky-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 md:p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-6 border-2 border-rose-500 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center border-b border-sky-100 pb-4">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-2 animate-bounce">
                🚨
              </div>
              <h2 className="text-xl font-black text-rose-600 tracking-tight">
                EMERGENCY SOS SIGNAL ACTIVATED!
              </h2>
              <p className="text-xs text-sky-700 mt-1 font-bold">
                Emergency signal broadcasted for resident <strong className="text-sky-950 font-black">{displayName}</strong> (Flat: {user?.flat || "A-101"}).
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black text-sky-500 uppercase tracking-wider">
                Emergency Hotline Direct Dial (India)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <a href="tel:112" className="p-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl flex items-center justify-between font-black text-rose-900 transition shadow-sm">
                  <span>👮 Police</span>
                  <span className="font-mono font-black text-sm">112 / 100</span>
                </a>

                <a href="tel:102" className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center justify-between font-black text-emerald-900 transition shadow-sm">
                  <span>🚑 Ambulance</span>
                  <span className="font-mono font-black text-sm">102 / 108</span>
                </a>

                <a href="tel:101" className="p-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl flex items-center justify-between font-black text-amber-900 transition shadow-sm">
                  <span>🚒 Fire Brigade</span>
                  <span className="font-mono font-black text-sm">101</span>
                </a>

                <a href="tel:+919876543210" className="p-3.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-2xl flex items-center justify-between font-black text-sky-900 transition shadow-sm">
                  <span>🛡️ Security</span>
                  <span className="font-mono font-bold text-xs">+91 98765 43210</span>
                </a>
              </div>
            </div>

            <div className="pt-3 flex justify-between items-center border-t border-sky-100">
              <span className="text-xs text-sky-600 font-bold">Security desk alerted</span>
              <button
                onClick={() => triggerSos(false)}
                className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-md shadow-sky-600/20 transition"
              >
                Clear SOS Signal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}