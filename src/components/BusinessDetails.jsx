import React, { useState } from "react";
import { Store, CheckCircle } from "lucide-react";
import { useSalon } from "../context/SalonContext";
import PaymentMethodsEditor from "./PaymentMethodsEditor";
import { useBusinessInfo, saveBusinessInfo } from "../utils/businessInfo";

const FIELDS = [
  { key: "name", label: "Business Name", placeholder: "Fix Salon", span: 2 },
  { key: "location", label: "Location", placeholder: "e.g. Makati City" },
  { key: "phone", label: "Phone Number", placeholder: "0917-000-0000" },
  { key: "address", label: "Address", placeholder: "Street, Barangay, City, Province", span: 2 },
  { key: "facebook", label: "Facebook Page", placeholder: "facebook.com/fixsalon" },
  { key: "instagram", label: "Instagram Page", placeholder: "instagram.com/fixsalon" }
];

const BusinessDetails = () => {
  const { showToast } = useSalon();
  const saved = useBusinessInfo();
  const [form, setForm] = useState(saved);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveBusinessInfo(form);
    if (showToast) showToast("Business details saved!");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "10px" }}>
          <Store size={26} color="var(--accent-purple)" /> Business Details
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
          Edit your salon's location, address, phone number and social pages. These appear on receipts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: "24px", maxWidth: "720px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {FIELDS.map((f) => (
            <div key={f.key} className="form-group" style={f.span === 2 ? { gridColumn: "span 2" } : undefined}>
              <label>{f.label}</label>
              <input
                type="text"
                className="form-control"
                placeholder={f.placeholder}
                value={form[f.key] || ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
          <button type="submit" className="btn-primary"><CheckCircle size={18} /> Save Details</button>
          <button type="button" className="btn-secondary" onClick={() => setForm(saved)}>Reset</button>
        </div>
      </form>

      <PaymentMethodsEditor />
    </div>
  );
};

export default BusinessDetails;
