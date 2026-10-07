import { useSyncExternalStore } from "react";

// Fix Salon business details (editable on the Business Details page)
const KEY = "glow_salon_businessInfo";

export const DEFAULT_BUSINESS = {
  name: "Fix Salon",
  location: "",
  address: "",
  phone: "",
  facebook: "",
  instagram: ""
};

const OLD_DEFAULT = "123 Metro Manila Ave, PH";
const read = () => {
  try { const b = { ...DEFAULT_BUSINESS, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; if (b.address === OLD_DEFAULT) b.address = ""; return b; } catch { return { ...DEFAULT_BUSINESS }; }
};

let current = read();
const listeners = new Set();

export const saveBusinessInfo = (info) => {
  current = { ...DEFAULT_BUSINESS, ...info };
  try { localStorage.setItem(KEY, JSON.stringify(current)); } catch { /* storage unavailable */ }
  listeners.forEach((l) => l());
};

export const useBusinessInfo = () =>
  useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => current);
