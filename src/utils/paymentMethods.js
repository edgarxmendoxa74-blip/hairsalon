import { useSyncExternalStore } from "react";
import gcash from "../assets/payments/gcash.png";
import maya from "../assets/payments/maya.png";
import mpay from "../assets/payments/mpay.png";

// Payment methods shown at checkout (editable on the Business Details page).
// `id` is what gets stored on each sale and never changes; `label` is the editable display name.
const KEY = "glow_salon_paymentMethods";

export const DEFAULT_LOGOS = { GCash: gcash, PayMaya: maya, MPay: mpay };

export const DEFAULT_METHODS = [
  { id: "Cash", label: "Cash", enabled: true },
  { id: "GCash", label: "GCash", enabled: true },
  { id: "PayMaya", label: "Maya", enabled: true },
  { id: "MPay", label: "MPay", enabled: true },
  { id: "Card", label: "Card", enabled: true }
];

const read = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch { /* ignore */ }
  return DEFAULT_METHODS;
};

let current = read();
const listeners = new Set();

export const savePaymentMethods = (methods) => {
  current = methods;
  try { localStorage.setItem(KEY, JSON.stringify(methods)); } catch { /* storage unavailable */ }
  listeners.forEach((l) => l());
};

export const usePaymentMethods = () =>
  useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => current);

export const logoFor = (m) => m.logo || DEFAULT_LOGOS[m.id];
