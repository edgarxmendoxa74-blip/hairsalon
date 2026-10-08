import ExportButton from "./ExportButton";
import PaymentLogo from "./PaymentLogo";
import { usePaymentMethods } from "../utils/paymentMethods";
import { useBusinessInfo } from "../utils/businessInfo";
import { useCurrency } from "../context/CurrencyContext";
import CategoryChips, { buildOptions } from "./CategoryChips";
import React, { useState, useEffect } from "react";
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
  Sparkles,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

const Sales = () => {
  const { money } = useCurrency();
  const { sales, clients, services, inventory, recordPOSSale } = useSalon();

  const [searchTerm, setSearchTerm] = useState("");
  const [isPOSModalOpen, setIsPOSModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // POS builder state
  const business = useBusinessInfo();
  const locationOf = (clientId) => clients.find((c) => c.id === clientId)?.location || "";
  const [posClientId, setPosClientId] = useState(clients[0]?.id || "");
  const [cartItems, setCartItems] = useState([]);
  const [discountAmt, setDiscountAmt] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("GCash");
  const payMethods = usePaymentMethods();

  const [paymentFilter, setPaymentFilter] = useState("ALL");

  // POS modal is split into two pages: 1) client + items, 2) review + payment
  const [posStep, setPosStep] = useState(1);
  const [posTab, setPosTab] = useState("services");
  useEffect(() => {
    if (!isPOSModalOpen) { setPosStep(1); setPosTab("services"); }
  }, [isPOSModalOpen]);
  const paymentOptions = buildOptions(sales, (s) => s.paymentMethod);

  const filteredSales = sales.filter(
    (s) =>
      (paymentFilter === "ALL" || s.paymentMethod === paymentFilter) &&
      (s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()))
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
    if (posStep === 1) return;

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
            Checkout point-of-sale register, payment methods (Cash, GCash, PayMaya, MPay, Card), and itemized billing receipts.
          </p>
        </div>

        <div className="header-actions">
          <ExportButton filename="sales" rows={filteredSales} columns={[{ label: "Invoice Ref", value: (t) => t.id }, { label: "Date & Time", value: (t) => t.date }, { label: "Client", value: (t) => t.clientName }, { label: "Location", value: (t) => locationOf(t.clientId) }, { label: "Payment Method", value: (t) => t.paymentMethod }, { label: "Items", value: (t) => t.items.map((i) => i.name + ' (x' + i.qty + ')').join('; ') }, { label: "Subtotal (MOP)", value: (t) => t.subtotal }, { label: "Discount (MOP)", value: (t) => t.discount }, { label: "Tax (MOP)", value: (t) => t.tax }, { label: "Total Paid (MOP)", value: (t) => t.total }]} />
          <button className="btn-primary" onClick={() => setIsPOSModalOpen(true)}>
            <ShoppingBag size={20} /> New POS Transaction
          </button>
        </div>
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

      <CategoryChips label="Payment method" options={paymentOptions} value={paymentFilter} onChange={setPaymentFilter} />

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
                    <td style={{ fontWeight: 700 }}>
                      {s.clientName}
                      {locationOf(s.clientId) && <div style={{ fontWeight: 400, fontSize: "12px", color: "var(--text-muted)" }}>{locationOf(s.clientId)}</div>}
                    </td>
                    <td>
                      <span className="status-badge completed"><PaymentLogo method={s.paymentMethod} size={16} /></span>
                    </td>
                    <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      {s.items.map((i) => `${i.name} (x${i.qty})`).join(", ")}
                    </td>
                    <td style={{ fontWeight: 800, color: "var(--accent-emerald)", fontSize: "15px" }}>
                      {money(s.total)}
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

      {/* MODAL 1: NEW POS TRANSACTION (2 pages) */}
      {isPOSModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content pos-modal">
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShoppingBag size={20} /> Fix Salon Point-of-Sale Register
              </h3>
              <button type="button" onClick={() => setIsPOSModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>

            <div className="pos-steps">
              <div className={`pos-step ${posStep === 1 ? "active" : "done"}`} style={{ cursor: cartItems.length ? "pointer" : "default" }} onClick={() => setPosStep(1)}><span>1</span> Client & Items</div>
              <div className="pos-step-line" />
              <div className={`pos-step ${posStep === 2 ? "active" : ""}`} style={{ cursor: cartItems.length ? "pointer" : "default" }} onClick={() => cartItems.length > 0 && setPosStep(2)}><span>2</span> Review & Payment</div>
            </div>

            <form onSubmit={handlePOSSubmit}>
              <div className="modal-body">
                {posStep === 1 ? (
                  <div className="pos-page">
                    <div className="form-group">
                      <label>Select Client</label>
                      <select className="form-control" value={posClientId} onChange={(e) => setPosClientId(e.target.value)}>
                        <option value="">Walk-in Customer</option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.id}>{c.name} ({c.phone}){c.location ? ` · ${c.location}` : ""}</option>
                        ))}
                      </select>
                    </div>

                    <div className="pos-tabs">
                      <button type="button" className={posTab === "services" ? "active" : ""} onClick={() => setPosTab("services")}>Services ({services.length})</button>
                      <button type="button" className={posTab === "products" ? "active" : ""} onClick={() => setPosTab("products")}>Retail Products ({inventory.length})</button>
                    </div>

                    <div className="pos-picker">
                      {posTab === "services"
                        ? services.map((srv) => (
                            <button key={srv.id} type="button" className="pos-pick" onClick={() => addServiceToCart(srv)}>
                              <span className="pos-pick-name">{srv.name}</span>
                              <strong className="pos-pick-price">+{money(srv.price)}</strong>
                            </button>
                          ))
                        : inventory.map((prod) => (
                            <button key={prod.id} type="button" className="pos-pick" onClick={() => addProductToCart(prod)}>
                              <span className="pos-pick-name">{prod.name}</span>
                              <strong className="pos-pick-price">+{money((prod.retailPrice || prod.unitCost))}</strong>
                            </button>
                          ))}
                    </div>

                    <div className="pos-cart-bar">
                      <span>{cartItems.length} item{cartItems.length === 1 ? "" : "s"} added</span>
                      <strong>{money(cartSubtotal)}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="pos-page">
                    <h4 className="pos-section-title">Order Items</h4>
                    <div className="pos-cart-list">
                      {cartItems.map((item, idx) => (
                        <div key={idx} className="pos-cart-row">
                          <div className="pos-cart-info">
                            <div className="pos-cart-name">{item.name}</div>
                            <div className="pos-cart-type">{item.type}</div>
                          </div>
                          <strong>{money((item.price * item.qty))}</strong>
                          <button type="button" className="icon-btn danger" title="Remove" onClick={() => removeFromCart(idx)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="pos-pay-grid">
                      <div className="form-group">
                        <label>Discount Amount (MOP$)</label>
                        <input type="number" min="0" className="form-control" value={discountAmt} onChange={(e) => setDiscountAmt(e.target.value)} />
                      </div>
                      <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                        <label>Payment Method *</label>
                        <div className="pay-picker">
                          {payMethods.filter((m) => m.enabled !== false).map((m) => (
                            <button key={m.id} type="button" className={"pay-option" + (paymentMethod === m.id ? " active" : "")} onClick={() => setPaymentMethod(m.id)}>
                              <PaymentLogo method={m.id} size={26} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pos-totals">
                      <div><span>Subtotal</span><span>{money(cartSubtotal)}</span></div>
                      <div><span>Discount</span><span>−{money(Number(discountAmt || 0))}</span></div>
                      <div className="pos-total-final"><span>Total Payable</span><span>{money(cartTotal)}</span></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                {posStep === 1 ? (
                  <>
                    <button type="button" className="btn-secondary" onClick={() => setIsPOSModalOpen(false)}>Cancel</button>
                    <button key="pos-next" type="button" className="btn-primary" disabled={cartItems.length === 0} onClick={() => setPosStep(2)}>
                      Next: Review Order <ArrowRight size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn-secondary" onClick={() => setPosStep(1)}>
                      <ArrowLeft size={18} /> Back
                    </button>
                    <button key="pos-pay" type="submit" className="btn-primary" disabled={cartItems.length === 0}>
                      <CheckCircle size={18} /> Process Payment & Complete
                    </button>
                  </>
                )}
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
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "18px" }}>{(business.name || "Fix Salon").toUpperCase()}</h3>
                {business.address && <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>{business.address}</div>}
                {business.location && <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>{business.location}</div>}
                {business.phone && <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Tel: {business.phone}</div>}
                {business.facebook && <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Facebook: {business.facebook}</div>}
                {business.instagram && <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Instagram: {business.instagram}</div>}
                <div style={{ marginTop: "8px", fontWeight: 700 }}>Receipt #{selectedReceipt.id}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>{new Date(selectedReceipt.date).toLocaleString()}</div>
              </div>

              <div style={{ borderTop: "1px dashed var(--border-color)", borderBottom: "1px dashed var(--border-color)", padding: "12px 0", marginBottom: "12px" }}>
                <div>Client: {selectedReceipt.clientName}</div>
                {locationOf(selectedReceipt.clientId) && <div>Location: {locationOf(selectedReceipt.clientId)}</div>}
                <div>Payment Method: {selectedReceipt.paymentMethod}</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                {selectedReceipt.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{item.qty}x {item.name}</span>
                    <span>{money((item.price * item.qty))}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal:</span>
                  <span>{money(selectedReceipt.subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Discount:</span>
                  <span>-{money(selectedReceipt.discount)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 800, marginTop: "6px", color: "var(--accent-emerald)" }}>
                  <span>TOTAL PAID:</span>
                  <span>{money(selectedReceipt.total)}</span>
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
