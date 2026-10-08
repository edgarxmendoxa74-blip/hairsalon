import React from "react";
import { CreditCard, Plus, Trash2, Upload } from "lucide-react";
import { usePaymentMethods, savePaymentMethods, logoFor, DEFAULT_METHODS } from "../utils/paymentMethods";

const BUILT_IN = new Set(DEFAULT_METHODS.map((m) => m.id));

// Shrinks an uploaded image to a small square data URL so it fits in local storage
const toLogo = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = c.height = 96;
        c.getContext("2d").drawImage(img, 0, 0, 96, 96);
        resolve(c.toDataURL("image/png"));
      };
      img.onerror = () => resolve(null);
      img.src = reader.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });

const PaymentMethodsEditor = () => {
  const methods = usePaymentMethods();
  const update = (id, patch) => savePaymentMethods(methods.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  const add = () => savePaymentMethods([...methods, { id: "custom-" + Date.now(), label: "New method", enabled: true }]);
  const remove = (id) => savePaymentMethods(methods.filter((m) => m.id !== id));
  const upload = async (id, file) => {
    if (!file) return;
    const logo = await toLogo(file);
    if (logo) update(id, { logo });
  };

  return (
    <div className="glass-card" style={{ padding: "24px", maxWidth: "720px" }}>
      <h3 style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
        <CreditCard size={18} color="var(--accent-purple)" /> Payment Methods
      </h3>
      <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
        Rename, hide, change the logo of, add or remove the options shown at checkout. Changes save automatically.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {methods.map((m) => {
          const logo = logoFor(m);
          return (
            <div key={m.id} className="pay-edit-row">
              <label className="pay-edit-logo" title="Change logo">
                {logo ? <img src={logo} alt="" width={36} height={36} /> : <Upload size={18} />}
                <input type="file" accept="image/*" hidden onChange={(e) => { upload(m.id, e.target.files[0]); e.target.value = ""; }} />
              </label>
              <input
                type="text"
                className="form-control"
                value={m.label}
                onChange={(e) => update(m.id, { label: e.target.value })}
                onBlur={(e) => { if (!e.target.value.trim()) update(m.id, { label: BUILT_IN.has(m.id) ? m.id : "New method" }); }}
              />
              <label className="pay-edit-toggle">
                <input type="checkbox" checked={m.enabled !== false} onChange={(e) => update(m.id, { enabled: e.target.checked })} /> Show
              </label>
              {BUILT_IN.has(m.id)
                ? (m.logo && <button type="button" className="btn-secondary" onClick={() => update(m.id, { logo: undefined })}>Default logo</button>)
                : <button type="button" className="icon-btn" title="Remove" onClick={() => remove(m.id)}><Trash2 size={16} /></button>}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
        <button type="button" className="btn-secondary" onClick={add}><Plus size={16} /> Add Payment Method</button>
        <button type="button" className="btn-secondary" onClick={() => savePaymentMethods(DEFAULT_METHODS)}>Reset to default</button>
      </div>
    </div>
  );
};

export default PaymentMethodsEditor;
