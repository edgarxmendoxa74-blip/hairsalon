import React, { useState } from "react";
import { useSalon } from "../context/SalonContext";
import {
  CreditCard,
  PlusCircle,
  Search,
  DollarSign,
  Printer,
  CheckCircle,
  ShoppingBag,
  Trash2,
  Sparkles
} from "lucide-react";

const Sales = () => {
  const { sales, clients, services, inventory, recordPOSSale } = useSalon();

  const [searchTerm, setSearchTerm] = useState("");
  const [isPOSModalOpen, setIsPOSModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // POS builder state
  const [posClientId, setPosClientId] = useState(clients[0]?.id || "");
  const [cartItems, setCartItems] = useState([]);
  const [discountAmt, setDiscountAmt] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("GCash");

  const filteredSales = sales.filter(
    (s) =>
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addServiceToCart = (srv) => {
    setCartItems((prev) => [
      ...prev,
      { name: srv.name, type: "Service", price: srv.price, qty: 1, staff: "Stylist" }
    ]);
  };

  const addProductToCart = (prod) => {
    setCartItems((prev) => [
      ...prev,
      { name: prod.name, type: "Product", price: prod.retailPrice || prod.unitCost, qty: 1, productId: prod.id }
    ]);
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartTotal = Math.max(0, cartSubtotal - Number(discountAmt));

  const handlePOSSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const newSale = recordPOSSale({
      clientId: posClientId,
      items: cartItems,
      discount: discountAmt,
      paymentMethod,
      recordedBy: "Tablet POS Operator"
    });

    setIsPOSModalOpen(false);
    setCartItems([]);
    setDiscountAmt(0);
    setSelectedReceipt(newSale);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "10px" }}>
            <CreditCard size={26} color="var(--accent-emerald)" /> Sales & POS Transaction Register
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
            Checkout point-of-sale register, payment methods (Cash, GCash, Card), and itemized billing receipts.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setIsPOSModalOpen(true)}>
          <ShoppingBag size={20} /> New POS Transaction
        </button>
      </div>

      {/* SEARCH REGISTER */}
      <div className="glass-card" style={{ padding: "16px" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search transaction ID, client name, payment method..."
            className="form-control"
            style={{ paddingLeft: "36px", height: "40px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* SALES REGISTER TABLE */}
      <div className="glass-card">
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Invoice Ref</th>
                <th>Date & Time</th>
                <th>Client Name</th>
                <th>Payment Method</th>
                <th>Items Purchased</th>
                <th>Total Paid</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                    No transaction records found.
                  </td>
                </tr>
              ) : (
                filteredSales.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700 }}>{s.id}</td>
                    <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      {new Date(s.date).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td style={{ fontWeight: 700 }}>{s.clientName}</td>
                    <td>
                      <span className="status-badge completed">{s.paymentMethod}</span>
                    </td>
                    <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      {s.items.map((i) => `${i.name} (x${i.qty})`).join(", ")}
                    </td>
                    <td style={{ fontWeight: 800, color: "var(--accent-emerald)", fontSize: "15px" }}>
                      ₱{s.total.toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="btn-secondary"
                        style={{ padding: "4px 10px", height: "32px", fontSize: "12px" }}
                        onClick={() => setSelectedReceipt(s)}
                      >
                        <Printer size={14} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: NEW POS TRANSACTION */}
      {isPOSModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "800px" }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShoppingBag size={20} color="var(--accent-rose)" /> Fix Salon Point-of-Sale Register
              </h3>
              <button onClick={() => setIsPOSModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>

            <form onSubmit={handlePOSSubmit}>
              <div className="modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  
                  {/* Left Column: Selector */}
                  <div>
                    <div className="form-group">
                      <label>Select Client</label>
                      <select
                        className="form-control"
                        value={posClientId}
                        onChange={(e) => setPosClientId(e.target.value)}
                      >
                        <option value="">Walk-in Customer</option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                        ))}
                      </select>
                    </div>

                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                      Quick Add Services:
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "140px", overflowY: "auto", marginBottom: "16px" }}>
                      {services.map((srv) => (
                        <button
                          key={srv.id}
                          type="button"
                          className="btn-secondary"
                          style={{ justifyContent: "space-between", height: "36px", fontSize: "12px" }}
                          onClick={() => addServiceToCart(srv)}
                        >
                          <span>{srv.name}</span>
                          <strong style={{ color: "var(--accent-rose)" }}>+₱{srv.price}</strong>
                        </button>
                      ))}
                    </div>

                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                      Quick Add Retail Products:
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "140px", overflowY: "auto" }}>
                      {inventory.map((prod) => (
                        <button
                          key={prod.id}
                          type="button"
                          className="btn-secondary"
                          style={{ justifyContent: "space-between", height: "36px", fontSize: "12px" }}
                          onClick={() => addProductToCart(prod)}
                        >
                          <span>{prod.name}</span>
                          <strong style={{ color: "#4d7a4a" }}>+₱{prod.retailPrice || prod.unitCost}</strong>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Cart & Payment */}
                  <div style={{ background: "var(--bg-secondary)", padding: "16px", borderRadius: "14px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h4 style={{ fontSize: "15px", marginBottom: "12px" }}>Selected Order Items</h4>
                      {cartItems.length === 0 ? (
                        <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                          No items added to cart yet.
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "180px", overflowY: "auto", marginBottom: "16px" }}>
                          {cartItems.map((item, idx) => (
                            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-input)", padding: "8px 12px", borderRadius: "8px", fontSize: "13px" }}>
                              <div>
                                <div style={{ fontWeight: 600 }}>{item.name}</div>
                                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.type}</div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <strong>₱{item.price.toLocaleString()}</strong>
                                <button type="button" onClick={() => removeFromCart(idx)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}>✕</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="form-group">
                        <label>Discount Amount (₱)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={discountAmt}
                          onChange={(e) => setDiscountAmt(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Payment Method *</label>
                        <select
                          className="form-control"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                          <option value="Cash">Cash</option>
                          <option value="GCash">GCash / Maya</option>
                          <option value="Card">Credit / Debit Card</option>
                        </select>
                      </div>

                      <div style={{ background: "rgba(16, 185, 129, 0.15)", padding: "12px", borderRadius: "10px", marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600 }}>Total Payable:</span>
                        <span style={{ fontSize: "22px", fontWeight: 800, color: "var(--accent-emerald)" }}>
                          ₱{cartTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsPOSModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={cartItems.length === 0}>
                  <CheckCircle size={18} /> Process Payment & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT PREVIEW MODAL */}
      {selectedReceipt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "450px" }}>
            <div className="modal-header">
              <h3 className="modal-title">Official Receipt</h3>
              <button onClick={() => setSelectedReceipt(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <div className="modal-body" style={{ fontFamily: "monospace", fontSize: "13px" }}>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "18px" }}>FIX SALON · YOUR HAIR SPECIALIST</h3>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>123 Metro Manila Ave, PH</div>
                <div style={{ marginTop: "8px", fontWeight: 700 }}>Receipt #{selectedReceipt.id}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>{new Date(selectedReceipt.date).toLocaleString()}</div>
              </div>

              <div style={{ borderTop: "1px dashed var(--border-color)", borderBottom: "1px dashed var(--border-color)", padding: "12px 0", marginBottom: "12px" }}>
                <div>Client: {selectedReceipt.clientName}</div>
                <div>Payment Method: {selectedReceipt.paymentMethod}</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                {selectedReceipt.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{item.qty}x {item.name}</span>
                    <span>₱{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal:</span>
                  <span>₱{selectedReceipt.subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Discount:</span>
                  <span>-₱{selectedReceipt.discount}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 800, marginTop: "6px", color: "var(--accent-emerald)" }}>
                  <span>TOTAL PAID:</span>
                  <span>₱{selectedReceipt.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => window.print()}>
                <Printer size={16} /> Print Receipt
              </button>
              <button className="btn-primary" onClick={() => setSelectedReceipt(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Sales;
