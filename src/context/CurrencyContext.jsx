import React, { createContext, useContext, useMemo, useState } from "react";
import { loadCurrency, saveCurrency, formatMoneyWith } from "../utils/currency";

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [settings, setSettings] = useState(loadCurrency);

  const value = useMemo(() => {
    const update = (patch) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        saveCurrency(next);
        return next;
      });
    };
    return {
      currency: settings.code,
      rate: settings.rate,
      symbol: settings.code === "MOP" ? "MOP$" : "₱",
      money: (amount) => formatMoneyWith(settings, amount),
      setCurrency: (code) => update({ code }),
      setRate: (rate) => update({ rate: Number(rate) > 0 ? Number(rate) : settings.rate })
    };
  }, [settings]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
};
