// All amounts are entered, stored and shown in MOP (Macau pataca).
export const formatMoneyWith = (_settings, amount) => {
  const n = Number(amount) || 0;
  return "MOP$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// For code outside React (toasts)
export const formatMoney = (amount) => formatMoneyWith(null, amount);
