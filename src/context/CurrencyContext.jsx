import React, { createContext, useContext } from "react";
import { formatMoney } from "../utils/currency";

const CurrencyContext = createContext(null);

const value = { currency: "MOP", symbol: "MOP$", money: formatMoney };

export const CurrencyProvider = ({ children }) => (
  <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
);

// eslint-disable-next-line react-refresh/only-export-components
export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
};
