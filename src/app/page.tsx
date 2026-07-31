"use client";

import { useSociety } from "../context/SocietyContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { setActiveRole, setUser } = useSociety();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<"admin" | "resident" | "security">("admin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [flat, setFlat] = useState("A-101");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Password show/hide state
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: "admin" as const,
      title: "Admin Workspace",
      desc: "Manage flats, billing cycle, notices & gate console",
      icon: "🛡️",
      iconBg: "bg-sky-50 text-sky-700 border border-sky-200",
      defaultName: "VIVEK JOSHI",
      defaultEmail: "vivekjoshi@admin.com",
      defaultFlat: "Admin",
    },
    {
      id: "resident" as const,
      title: "Resident Portal",
      desc: "Pay monthly dues, download receipts & trigger SOS",
      icon: "🏠",
      iconBg: "bg-teal-50 text-teal-700 border border-teal-200",
      defaultName: "VIVEK JOSHI",
      defaultEmail: "vivek.joshi@resident.com",
      defaultFlat: "A-101",
    },
    {
      id: "security" as const,
      title: "Security Gate Console",
      desc: "Check-in logs, parking allocation & emergency desk",
      icon: "👮",
      iconBg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      defaultName: "Officer",
      defaultEmail: "security@society.in",
      defaultFlat: "Gate 1",
    },
  ];

  const activeRoleData = roles.find((r) => r.id === selectedRole)!;

  const handleSelectRole = (role: "admin" | "resident" | "security", e?: any) => {
    if (e) e.preventDefault();
    setSelectedRole(role);
    const rData = roles.find((r) => r.id === role)!;
    setName(rData.defaultName);
    setEmail(rData.defaultEmail);
    setFlat(rData.defaultFlat);
    setPassword("12345");
    setStep(2);
  };

  const handleLoginSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);

    setActiveRole(selectedRole);
    if (setUser) {
      setUser({ name, email, flat });
    }

    setTimeout(() => {
      router.push(`/${selectedRole}`);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50/60 to-teal-50/80 flex items-center justify-center p-4 relative overflow-hidden font-sans text-sky-950">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl max-w-lg w-full shadow-2xl shadow-sky-900/10 border border-sky-100 relative z-10">

        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-600 to-emerald-600 text-white font-black text-xl shadow-lg shadow-sky-500/20 mb-3">
                Login
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-sky-950 tracking-tight">
                Society Connect Pro
              </h1>
              <p className="text-sky-600 text-xs md:text-sm mt-1 font-semibold">
                Select workspace role to enter dashboard
              </p>
            </div>

            <div className="space-y-3">
              {roles.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e: any) => handleSelectRole(item.id, e)}
                  className="portal-card w-full p-4 rounded-2xl bg-sky-50/60 hover:bg-white text-sky-950 text-left transition-all flex items-center justify-between border border-sky-100 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/10 group"
                >
                  <div className="flex items-center space-x-3.5">
                    <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${item.iconBg}`}>
                      {item.icon}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-sky-950">
                        {item.title}
                      </div>
                      <p className="text-xs text-sky-600 mt-0.5 font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="ml-2 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-sky-100/80 group-hover:bg-sky-600 text-sky-600 group-hover:text-white transition font-bold flex items-center justify-center text-xs">
                      →
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-sky-100">
              <button
                type="button"
                onClick={(e: any) => {
                  e.preventDefault();
                  setStep(1);
                }}
                className="text-xs font-bold text-sky-700 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-xl transition flex items-center space-x-1 border border-sky-200"
              >
                <span>←</span> <span>Change Role</span>
              </button>

              <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 border ${activeRoleData.iconBg}`}>
                <span>{activeRoleData.icon}</span> <span>{activeRoleData.title}</span>
              </span>
            </div>

            <div className="mb-5">
              <h2 className="text-xl font-black text-sky-950 tracking-tight">
                Enter Log In Details
              </h2>
              <p className="text-sm text-sky-600 mt-1 font-medium">
                Log in to grant dashboard access for <strong className="text-sky-900">{activeRoleData.title}</strong>
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-sky-900 mb-1 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                  placeholder="e.g. VIVEK JOSHI"
                  className="w-full bg-sky-50/50 border border-sky-200 rounded-xl py-2.5 px-3.5 text-xs font-bold text-sky-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition shadow-sm"
                />
              </div>

              {selectedRole === "resident" && (
                <div>
                  <label className="block text-xs font-extrabold text-sky-900 mb-1 uppercase tracking-wide">
                    Assigned Flat Unit
                  </label>
                  <select
                    value={flat}
                    onChange={(e: any) => setFlat(e.target.value)}
                    className="w-full bg-sky-50/50 border border-sky-200 rounded-xl p-2.5 text-xs font-bold text-sky-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition shadow-sm"
                  >
                    <option value="A-101">Flat A-101 (VIVEK JOSHI)</option>
                    <option value="A-102">Flat A-102 (Priya Patel)</option>
                    <option value="B-201">Flat B-201 (Rahul Verma)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-sky-900 mb-1 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  placeholder="e.g. vivekjoshi@ad.com"
                  className="w-full bg-sky-50/50 border border-sky-200 rounded-xl py-2.5 px-3.5 text-xs font-bold text-sky-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition shadow-sm"
                />
              </div>

              {/* Password Field with Show/Hide Toggle */}
              <div>
                <label className="block text-xs font-extrabold text-sky-900 mb-1 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    className="w-full bg-sky-50/50 border border-sky-200 rounded-xl py-2.5 pl-3.5 pr-10 text-xs font-bold text-sky-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-600 hover:text-sky-950 transition text-sm focus:outline-none"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-sky-600/20 transition flex items-center justify-center space-x-2 mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Confirm & Enter Workspace</span>
                    <span className="text-sm">→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-sky-100 flex items-center justify-between text-sm text-sky-600 font-semibold">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>System Online</span>
          </div>
          <span>Vivek Joshi's Residency</span>
        </div>

      </div>
    </div>
  );
}
