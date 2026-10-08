// Amounts are always stored in PHP. MOP (Macau pataca) is a display conversion using a rate the owner sets.
const KEY = "glow_salon_currency";
const DEFAULTS = { code: "PHP", rate: 7 }; // rate = PHP per 1 MOP

export const loadCurrency = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.code === "USD") return { ...DEFAULTS, code: "MOP" }; // old setting from before MOP replaced USD
    if (saved && (saved.code === "PHP" || saved.code === "MOP") && Number(saved.rate) > 0) return { code: saved.code, rate: Number(saved.rate) };
  } catch { /* ignore */ }
  return { ...DEFAULTS };
};

export const saveCurrency = (settings) => {
  try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { /* storage unavailable */ }
};

export const formatMoneyWith = (settings, amount) => {
  const n = Number(amount) || 0;
  if (settings.code === "MOP") {
    return "MOP$" + (n / settings.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return "₱" + n.toLocaleString();
};

// For code outside React (toasts); reads the saved setting
export const formatMoney = (amount) => formatMoneyWith(loadCurrency(), amount);
