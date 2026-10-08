import React from "react";
import { usePaymentMethods, logoFor } from "../utils/paymentMethods";

// Shows the logo (if any) and display name of a payment method id; old/unknown ids fall back to plain text
const PaymentLogo = ({ method, size = 18 }) => {
  const methods = usePaymentMethods();
  const m = methods.find((x) => x.id === method) || { id: method, label: method };
  const logo = logoFor(m);
  return (
    <span className="pay-logo">
      {logo && <img src={logo} alt="" width={size} height={size} />}
      {m.label}
    </span>
  );
};

export default PaymentLogo;
