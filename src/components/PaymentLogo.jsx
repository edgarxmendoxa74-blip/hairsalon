import React from "react";
import gcash from "../assets/payments/gcash.png";
import maya from "../assets/payments/maya.png";
import mpay from "../assets/payments/mpay.png";

const LOGOS = { GCash: gcash, PayMaya: maya, MPay: mpay };

// Shows the app logo for GCash / PayMaya / MPay followed by the method name (plain text for Cash and Card)
const PaymentLogo = ({ method, size = 18 }) => (
  <span className="pay-logo">
    {LOGOS[method] && <img src={LOGOS[method]} alt="" width={size} height={size} />}
    {method === "PayMaya" ? "Maya" : method}
  </span>
);

export default PaymentLogo;
