// Amounts are always stored in PHP. USD is a display conversion using a rate the owner sets.
const KEY = "glow_salon_currency";
const DEFAULTS = { code: "PHP", rate: 56 }; // rate = PHP per 1 USD

export const loadCurrency = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && (saved.code === "PHP" || saved.code === "USD") && Number(saved.rate) > 0) return { code: saved.code, rate: Number(saved.rate) };
  } catch { /* ignore */ }
  return { ...DEFAULTS };
};

export const saveCurrency = (settings) => {
  try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { /* storage unavailable */ }
};

export const formatMoneyWith = (settings, amount) => {
  const n = Number(amount) || 0;
  if (settings.code === "USD") {
    return "$" + (n / settings.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return "₱" + n.toLocaleString();
};

// For code outside React (toasts); reads the saved setting
export const formatMoney = (amount) => formatMoneyWith(loadCurrency(), amount);
