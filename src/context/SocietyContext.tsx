"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  name: string;
  email: string;
  flat?: string;
}

export interface Flat {
  id: string;
  wing: string;
  owner: string;
  phone: string;
  status: "Occupied" | "Rented" | "Vacant";
  balance: number; // Pending Dues Balance
  totalAmount?: number; // Total Amount To Be Paid
  totalPaid?: number; // Total Paid Amount
  lastUpdated?: string;
  lastUpdateLog?: string;
}

export interface Bill {
  id: string;
  flat: string;
  amount: number;
  dueDate: string;
  month: string;
  status: "Paid" | "Unpaid";
  paidOn?: string;
  transactionId?: string;
}

export interface Visitor {
  id: number;
  name: string;
  phone: string;
  flat: string;
  purpose: string;
  entryTime: string;
  checkOutTime?: string;
  status: "IN" | "OUT";
  parkingSlot: string;
  lastUpdated?: string;
  lastUpdateLog?: string;
}

export interface ParkingSlot {
  id: string;
  occupied: boolean;
  assignedTo: string | null;
}

interface SocietyContextType {
  societyName: string;
  setSocietyName: (name: string) => void;
  flats: Flat[];
  bills: Bill[];
  visitors: Visitor[];
  parkingSlots: ParkingSlot[];
  sosActive: boolean;
  activeRole: "admin" | "resident" | "security";
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  setActiveRole: (role: "admin" | "resident" | "security") => void;
  triggerSos: (active: boolean) => void;
  addFlat: (flat: Omit<Flat, "balance">) => void;
  editFlat: (id: string, updated: Partial<Flat>) => void;
  deleteFlat: (id: string) => void;
  addBill: (bill: Omit<Bill, "id">) => Bill;
  editBill: (id: string, updated: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  payBill: (billId: string, paymentMethod?: string) => void;
  addVisitor: (visitor: Omit<Visitor, "id" | "entryTime" | "status">) => void;
  editVisitor: (id: number, updated: Partial<Visitor>) => void;
  toggleVisitorStatus: (id: number) => void;
  deleteVisitor: (id: number) => void;
}

const SocietyContext = createContext<SocietyContextType | undefined>(undefined);

export function SocietyProvider({ children }: { children: ReactNode }) {
  const [societyName] = useState("Vivek Joshi's Residency");
  const [activeRole, setActiveRoleState] = useState<"admin" | "resident" | "security">("admin");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<User | null>({
    name: "VIVEK JOSHI",
    email: "vivekjoshi@ad.com",
    flat: "Admin",
  });
  const [sosActive, setSosActive] = useState(false);

  const setActiveRole = (role: "admin" | "resident" | "security") => {
    setActiveRoleState(role);
    setActiveTab("dashboard");
  };

  const [flats, setFlats] = useState<Flat[]>([
    {
      id: "101",
      wing: "A",
      owner: "VIVEK JOSHI",
      phone: "+91 12345 67890",
      status: "Occupied",
      totalAmount: 5000,
      totalPaid: 2500,
      balance: 2500,
      lastUpdated: "29 Jul 2026, 05:25 PM",
      lastUpdateLog: "Initial system record created",
    },
    {
      id: "102",
      wing: "A",
      owner: "Priya Patel",
      phone: "+91 12345 67890",
      status: "Occupied",
      totalAmount: 2500,
      totalPaid: 2500,
      balance: 0,
      lastUpdated: "28 Jul 2026, 02:10 PM",
      lastUpdateLog: "Phone: +91 98765 43211",
    },
    {
      id: "201",
      wing: "B",
      owner: "Rahul Verma",
      phone: "+91 12345 67890",
      status: "Rented",
      totalAmount: 5000,
      totalPaid: 0,
      balance: 5000,
      lastUpdated: "25 Jul 2026, 11:45 AM",
      lastUpdateLog: "Status: Rented",
    },
    {
      id: "202",
      wing: "B",
      owner: "Vikram Singh",
      phone: "+91 12345 67890",
      status: "Occupied",
      totalAmount: 2500,
      totalPaid: 2500,
      balance: 0,
      lastUpdated: "20 Jul 2026, 09:30 AM",
      lastUpdateLog: "Assigned to Vikram Singh",
    },
  ]);

  const [bills, setBills] = useState<Bill[]>([
    { id: "INV-2026-004", flat: "A-101", amount: 2500, dueDate: "2026-08-31", month: "August 2026", status: "Unpaid" },
    { id: "INV-2026-003", flat: "B-201", amount: 5000, dueDate: "2026-08-05", month: "July 2026", status: "Unpaid" },
    { id: "INV-2026-002", flat: "A-102", amount: 2500, dueDate: "2026-08-05", month: "July 2026", status: "Paid", paidOn: "2026-07-28", transactionId: "TXN9823104912 (UPI)" },
    { id: "INV-2026-001", flat: "A-101", amount: 2500, dueDate: "2026-08-05", month: "July 2026", status: "Paid", paidOn: "2026-07-27", transactionId: "TXN8921034921 (UPI)" },
  ]);

  const [visitors, setVisitors] = useState<Visitor[]>([
    { id: 1, name: "Ramesh Kumar", phone: "+91 98200 12345", flat: "A-101", purpose: "Delivery (Zomato/Swiggy)", entryTime: "10:30 AM", status: "IN", parkingSlot: "P-04", lastUpdated: "29 Jul 2026, 08:00 PM", lastUpdateLog: "Check-in logged" },
    { id: 2, name: "Ananya Deshmukh", phone: "+91 98200 54321", flat: "B-201", purpose: "Guest / Relative", entryTime: "11:15 AM", checkOutTime: "12:30 PM", status: "OUT", parkingSlot: "P-05", lastUpdated: "29 Jul 2026, 12:30 PM", lastUpdateLog: "Departed premises" },
  ]);

  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([
    { id: "P-01", occupied: true, assignedTo: "Flat A-101" },
    { id: "P-02", occupied: false, assignedTo: null },
    { id: "P-03", occupied: true, assignedTo: "Flat A-102" },
    { id: "P-04", occupied: true, assignedTo: "Visitor (Ramesh)" },
    { id: "P-05", occupied: false, assignedTo: null },
    { id: "P-06", occupied: false, assignedTo: null },
  ]);

  const triggerSos = (active: boolean) => setSosActive(active);

  const addFlat = (flatData: Omit<Flat, "balance">) => {
    const timestamp = new Date().toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newFlatRecord: Flat = {
      ...flatData,
      balance: 0,
      totalAmount: 0,
      totalPaid: 0,
      lastUpdated: timestamp,
      lastUpdateLog: `Record created for Flat ${flatData.wing}-${flatData.id}`,
    };

    setFlats((prev) => [...prev, newFlatRecord]);
  };

  const editFlat = (id: string, updated: Partial<Flat>) => {
    const timestamp = new Date().toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setFlats((prevFlats) =>
      prevFlats.map((f) => {
        if (f.id !== id) return f;

        const diff: string[] = [];
        if (updated.owner && updated.owner !== f.owner) diff.push(`Owner: ${updated.owner}`);
        if (updated.wing && updated.wing !== f.wing) diff.push(`Wing: ${updated.wing}`);
        if (updated.phone && updated.phone !== f.phone) diff.push(`Phone: ${updated.phone}`);
        if (updated.status && updated.status !== f.status) diff.push(`Status: ${updated.status}`);
        if (updated.totalAmount !== undefined && updated.totalAmount !== f.totalAmount) diff.push(`Total Amount: ₹${updated.totalAmount}`);
        if (updated.totalPaid !== undefined && updated.totalPaid !== f.totalPaid) diff.push(`Total Paid: ₹${updated.totalPaid}`);
        if (updated.balance !== undefined && updated.balance !== f.balance) diff.push(`Pending Dues: ₹${updated.balance}`);

        const logText = diff.length > 0 ? diff.join(" • ") : "Record updated";

        if (updated.balance !== undefined) {
          const flatKey = `${updated.wing || f.wing}-${f.id}`;
          setBills((prevBills) =>
            prevBills.map((b) =>
              b.flat === flatKey && b.status === "Unpaid" ? { ...b, amount: updated.balance! } : b
            )
          );
        }

        return {
          ...f,
          ...updated,
          lastUpdated: timestamp,
          lastUpdateLog: logText,
        };
      })
    );
  };

  const deleteFlat = (id: string) => {
    setFlats(flats.filter((f) => f.id !== id));
  };

  const addBill = (newBill: Omit<Bill, "id">) => {
    const nextInvoiceIdNum = bills.length + 1;

    if (newBill.flat === "All Flats") {
      const generatedBills: Bill[] = [];
      const newBillsList = [...bills];

      flats.forEach((f, idx) => {
        const flatKey = `${f.wing}-${f.id}`;
        const id = `INV-2026-00${nextInvoiceIdNum + idx}`;
        const billEntry: Bill = {
          ...newBill,
          id,
          flat: flatKey,
        };
        generatedBills.push(billEntry);
        newBillsList.unshift(billEntry);
      });

      setBills(newBillsList);

      setFlats((prevFlats) =>
        prevFlats.map((f) => {
          const currentTotal = f.totalAmount ?? (f.balance + (f.totalPaid ?? 0));
          return {
            ...f,
            totalAmount: currentTotal + newBill.amount,
            balance: f.balance + newBill.amount,
          };
        })
      );

      return generatedBills[0];
    } else {
      const id = `INV-2026-00${nextInvoiceIdNum}`;
      const createdBill = { ...newBill, id };
      setBills([createdBill, ...bills]);

      setFlats((prevFlats) =>
        prevFlats.map((f) => {
          const flatKey = `${f.wing}-${f.id}`;
          if (newBill.flat === flatKey) {
            const currentTotal = f.totalAmount ?? (f.balance + (f.totalPaid ?? 0));
            return {
              ...f,
              totalAmount: currentTotal + newBill.amount,
              balance: f.balance + newBill.amount,
            };
          }
          return f;
        })
      );

      return createdBill;
    }
  };

  const editBill = (id: string, updated: Partial<Bill>) => {
    setBills(bills.map((b) => (b.id === id ? { ...b, ...updated } : b)));
  };

  const deleteBill = (id: string) => {
    setBills(bills.filter((b) => b.id !== id));
  };

  const payBill = (billId: string, paymentMethod: string = "UPI") => {
    const txn = `TXN${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const today = new Date().toISOString().split("T")[0];

    const targetBill = bills.find((b) => b.id === billId);
    if (targetBill) {
      setFlats((prevFlats) =>
        prevFlats.map((f) => {
          const flatKey = `${f.wing}-${f.id}`;
          if (targetBill.flat === flatKey || targetBill.flat === "All Flats") {
            const newPaid = (f.totalPaid ?? 0) + targetBill.amount;
            const newPending = Math.max(0, f.balance - targetBill.amount);
            return {
              ...f,
              totalPaid: newPaid,
              balance: newPending,
            };
          }
          return f;
        })
      );
    }

    setBills(
      bills.map((b) =>
        b.id === billId ? { ...b, status: "Paid", paidOn: today, transactionId: `${txn} (${paymentMethod})` } : b
      )
    );
  };

  const addVisitor = (v: Omit<Visitor, "id" | "entryTime" | "status">) => {
    const timestamp = new Date().toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const entry: Visitor = {
      ...v,
      id: Date.now(),
      entryTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "IN",
      lastUpdated: timestamp,
      lastUpdateLog: "Check-in logged",
    };

    setVisitors([entry, ...visitors]);

    setParkingSlots((slots) =>
      slots.map((s) => (s.id === v.parkingSlot ? { ...s, occupied: true, assignedTo: `Visitor (${v.name})` } : s))
    );
  };

  const editVisitor = (id: number, updated: Partial<Visitor>) => {
    const timestamp = new Date().toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const oldVisitor = visitors.find((v) => v.id === id);

    if (oldVisitor && updated.parkingSlot && updated.parkingSlot !== oldVisitor.parkingSlot) {
      setParkingSlots((slots) =>
        slots.map((s) => {
          if (s.id === oldVisitor.parkingSlot) return { ...s, occupied: false, assignedTo: null };
          if (s.id === updated.parkingSlot) return { ...s, occupied: true, assignedTo: `Visitor (${updated.name || oldVisitor.name})` };
          return s;
        })
      );
    }

    setVisitors((prevVisitors) =>
      prevVisitors.map((v) => {
        if (v.id !== id) return v;

        const diff: string[] = [];
        if (updated.name && updated.name !== v.name) diff.push(`Name: ${updated.name}`);
        if (updated.phone && updated.phone !== v.phone) diff.push(`Phone: ${updated.phone}`);
        if (updated.purpose && updated.purpose !== v.purpose) diff.push(`Purpose: ${updated.purpose}`);
        if (updated.flat && updated.flat !== v.flat) diff.push(`Target Flat: ${updated.flat}`);
        if (updated.parkingSlot && updated.parkingSlot !== v.parkingSlot) diff.push(`Parking: ${updated.parkingSlot}`);

        const logText = diff.length > 0 ? diff.join(" • ") : "Visitor log updated";

        return {
          ...v,
          ...updated,
          lastUpdated: timestamp,
          lastUpdateLog: logText,
        };
      })
    );
  };

  const toggleVisitorStatus = (id: number) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const timestamp = new Date().toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setVisitors((prevVisitors) =>
      prevVisitors.map((v) => {
        if (v.id !== id) return v;

        if (v.status === "IN") {
          setParkingSlots((slots) =>
            slots.map((s) => (s.id === v.parkingSlot ? { ...s, occupied: false, assignedTo: null } : s))
          );
          return {
            ...v,
            status: "OUT",
            checkOutTime: nowTime,
            lastUpdated: timestamp,
            lastUpdateLog: "Departed premises (Checked Out)",
          };
        } else {
          setParkingSlots((slots) =>
            slots.map((s) => (s.id === v.parkingSlot ? { ...s, occupied: true, assignedTo: `Visitor (${v.name})` } : s))
          );
          return {
            ...v,
            status: "IN",
            checkOutTime: undefined,
            lastUpdated: timestamp,
            lastUpdateLog: "Re-entered premises (Checked In)",
          };
        }
      })
    );
  };

  const deleteVisitor = (id: number) => {
    const visitor = visitors.find((v) => v.id === id);
    if (visitor) {
      setParkingSlots((slots) =>
        slots.map((s) => (s.id === visitor.parkingSlot ? { ...s, occupied: false, assignedTo: null } : s))
      );
    }
    setVisitors(visitors.filter((v) => v.id !== id));
  };

  return (
    <SocietyContext.Provider
      value={{
        societyName,
        setSocietyName: () => {},
        flats,
        bills,
        visitors,
        parkingSlots,
        sosActive,
        activeRole,
        activeTab,
        setActiveTab,
        user,
        setUser,
        setActiveRole,
        triggerSos,
        addFlat,
        editFlat,
        deleteFlat,
        addBill,
        editBill,
        deleteBill,
        payBill,
        addVisitor,
        editVisitor,
        toggleVisitorStatus,
        deleteVisitor,
      }}
    >
      {children}
    </SocietyContext.Provider>
  );
}

export function useSociety() {
  const context = useContext(SocietyContext);
  if (!context) throw new Error("useSociety must be used within a SocietyProvider");
  return context;
}
