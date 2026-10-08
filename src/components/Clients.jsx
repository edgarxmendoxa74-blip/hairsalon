import ExportButton from "./ExportButton";
import { useCurrency } from "../context/CurrencyContext";
import CategoryChips from "./CategoryChips";
import React, { useState } from "react";
import { useSalon } from "../context/SalonContext";
import {
  Users,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  History,
  Phone,
  Mail,
  CheckCircle,
  Star,
  MapPin
} from "lucide-react";

const formatAddress = (c) => c.location || "";

const Clients = () => {
  const { money } = useCurrency();
  const { clients, staffTracking, sales, addClient, updateClient, deleteClient } = useSalon();
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientHistory, setSelectedClientHistory] = useState(null);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  const [formData, setFormData] = useState({ name: "", phone: "", email: "", location: "", notes: "", vip: false });

  const [clientCategory, setClientCategory] = useState("ALL");
  const clientCategoryOf = {
    VIP: (c) => c.vip,
    Regular: (c) => !c.vip,
    "With treatment notes": (c) => (c.treatmentRecords || []).length > 0
  };
  const clientCategories = [
    { key: "ALL", label: "All", count: clients.length },
    ...Object.entries(clientCategoryOf).map(([k, fn]) => ({ key: k, label: k, count: clients.filter(fn).length }))
  ];

  const filteredClients = clients.filter(
    (c) =>
      (clientCategory === "ALL" || clientCategoryOf[clientCategory](c)) &&
      (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: "", phone: "", email: "", location: "", notes: "", vip: false });
    setIsAddClientModalOpen(true);
  };

  const openEdit = (client) => {
    setEditingId(client.id);
    setFormData({ name: client.name, phone: client.phone, email: client.email || "", location: client.location || "", notes: client.notes || "", vip: Boolean(client.vip) });
    setIsAddClientModalOpen(true);
  };

  const handleDelete = (client) => {
    if (window.confirm("Remove client " + client.name + "?")) deleteClient(client.id);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (editingId) updateClient(editingId, formData);
    else addClient(formData);
    setEditingId(null);
    setIsAddClientModalOpen(false);
    setFormData({ name: "", phone: "", email: "", location: "", notes: "", vip: false });
  };

  // Get service history logs for selected client
  const clientServiceLogs = selectedClientHistory
    ? staffTracking.filter((trk) => trk.clientId === selectedClientHistory.id)
    : [];

  const clientSalesHistory = selectedClientHistory
    ? sales.filter((s) => s.clientId === selectedClientHistory.id)
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* HEADER BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Users size={26} color="var(--accent-purple)" /> Client Profiles & Service History
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
            Manage customer profiles, phone contacts, VIP loyalty statuses, and complete service histories.
          </p>
        </div>

        <div className="header-actions">
          <ExportButton filename="clients" rows={filteredClients} columns={[{ label: "Client ID", value: (c) => c.id }, { label: "Name", value: (c) => c.name }, { label: "Phone", value: (c) => c.phone }, { label: "Email", value: (c) => c.email }, { label: "Location", value: (c) => formatAddress(c) }, { label: "VIP", value: (c) => (c.vip ? "Yes" : "No") }, { label: "Total Visits", value: (c) => c.totalVisits }, { label: "Total Spent (MOP)", value: (c) => c.totalSpent }, { label: "Registered", value: (c) => c.registeredDate }, { label: "Notes", value: (c) => c.notes }, { label: "Last Treatment Notes", value: (c) => { const r = c.treatmentRecords?.[0]; return r ? [r.productsUsed?.join(", "), r.notes].filter(Boolean).join(" — ") : ""; } }]} />
          <button className="btn-primary" onClick={openAdd}>
            <PlusCircle size={20} /> Register New Client
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="glass-card" style={{ padding: "16px" }}>
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "15px", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search by client name, phone number, email..."
            className="form-control"
            style={{ paddingLeft: "42px", height: "46px", fontSize: "15px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <CategoryChips label="Category" options={clientCategories} value={clientCategory} onChange={setClientCategory} />

      {/* CLIENT CARDS GRID */}
      <div className="client-grid">
        {filteredClients.map((client) => (
          <div key={client.id} className="glass-card client-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                    {client.name}
                    {client.vip && (
                      <span className="status-badge active" style={{ background: "rgba(245, 158, 11, 0.2)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.4)", fontSize: "11px" }}>
                        <Star size={11} fill="#f59e0b" /> VIP Member
                      </span>
                    )}
                  </h3>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                    Client ID: {client.id} • Registered {client.registeredDate}
                  </div>
                </div>
                <div className="card-actions">
                  <button type="button" className="icon-btn" title="Edit client" onClick={() => openEdit(client)}><Edit size={16} /></button>
                  <button type="button" className="icon-btn danger" title="Remove client" onClick={() => handleDelete(client)}><Trash2 size={16} /></button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Phone size={14} color="var(--accent-rose)" /> {client.phone}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Mail size={14} color="var(--accent-sky)" /> {client.email}
                </div>
                {formatAddress(client) && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <MapPin size={14} color="var(--accent-emerald)" /> {formatAddress(client)}
                  </div>
                )}
                {client.treatmentRecords?.[0] && (
                  <div className="client-last-record">
                    <b>Last visit ({new Date(client.treatmentRecords[0].date).toLocaleDateString()}):</b>{" "}
                    {[client.treatmentRecords[0].productsUsed?.join(", "), client.treatmentRecords[0].notes].filter(Boolean).join(" — ") || client.treatmentRecords[0].serviceName}
                  </div>
                )}
                {client.notes && (
                  <div style={{ background: "var(--bg-input)", padding: "8px 12px", borderRadius: "8px", marginTop: "4px", fontSize: "12px", color: "var(--text-main)" }}>
                    <strong>Note:</strong> {client.notes}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", padding: "10px", background: "var(--bg-secondary)", borderRadius: "12px", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Total Visits</div>
                  <div style={{ fontSize: "16px", fontWeight: 800 }}>{client.totalVisits} visits</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Total Spent</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--accent-emerald)" }}>{money(client.totalSpent)}</div>
                </div>
              </div>
            </div>

            <button
              className="btn-secondary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => setSelectedClientHistory(client)}
            >
              <History size={16} /> View Service History ({staffTracking.filter((trk) => trk.clientId === client.id).length})
            </button>
          </div>
        ))}
      </div>

      {/* CLIENT SERVICE HISTORY DRAWER / MODAL */}
      {selectedClientHistory && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "750px" }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <History size={20} color="var(--accent-rose)" /> Service & Purchase History: {selectedClientHistory.name}
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Phone: {selectedClientHistory.phone} • Total Visits: {selectedClientHistory.totalVisits}
                </p>
              </div>
              <button type="button" onClick={() => setSelectedClientHistory(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>

            <div className="modal-body">
              <h4 style={{ fontSize: "15px", marginBottom: "12px" }}>Recorded Services Rendered</h4>
              <div className="custom-table-container" style={{ marginBottom: "20px" }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Service Name</th>
                      <th>Assigned Stylist</th>
                      <th>Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientServiceLogs.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)" }}>
                          No recorded service logs for this client yet.
                        </td>
                      </tr>
                    ) : (
                      clientServiceLogs.map((log) => (
                        <tr key={log.id}>
                          <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                            {new Date(log.date).toLocaleDateString()}
                          </td>
                          <td style={{ fontWeight: 700 }}>{log.serviceName}</td>
                          <td style={{ color: "var(--accent-rose)", fontWeight: 600 }}>{log.staffName}</td>
                          <td style={{ fontWeight: 800 }}>{money(log.serviceAmount)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <h4 style={{ fontSize: "15px", marginBottom: "12px" }}>Treatment Records & Notes</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                {(selectedClientHistory.treatmentRecords || []).length === 0 ? (
                  <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                    No treatment notes yet. They are saved when an appointment is completed.
                  </div>
                ) : (
                  selectedClientHistory.treatmentRecords.map((r) => (
                    <div key={r.id} className="last-record">
                      <div className="last-record-title">{new Date(r.date).toLocaleDateString()} — {r.serviceName} • {r.staffName}</div>
                      {r.request && <div><b>Request:</b> {r.request}</div>}
                      {r.productsUsed?.length > 0 && <div><b>Products / meds used:</b> {r.productsUsed.join(", ")}</div>}
                      {r.notes && <div><b>Notes:</b> {r.notes}</div>}
                    </div>
                  ))
                )}
              </div>

              <h4 style={{ fontSize: "15px", marginBottom: "12px" }}>POS Transactions & Retail Purchases</h4>
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Date</th>
                      <th>Payment Method</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientSalesHistory.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)" }}>
                          No transaction records found.
                        </td>
                      </tr>
                    ) : (
                      clientSalesHistory.map((s) => (
                        <tr key={s.id}>
                          <td style={{ fontWeight: 700 }}>{s.id}</td>
                          <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>{new Date(s.date).toLocaleDateString()}</td>
                          <td>
                            <span className="status-badge completed" style={{ fontSize: "11px" }}>{s.paymentMethod}</span>
                          </td>
                          <td style={{ fontWeight: 800, color: "var(--accent-emerald)" }}>{money(s.total)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedClientHistory(null)}>
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER NEW CLIENT MODAL */}
      {isAddClientModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editingId ? "Edit Customer Profile" : "Register New Customer Profile"}</h3>
              <button type="button" onClick={() => setIsAddClientModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label>Full Customer Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Maria Clara Santos"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="0917-000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="client@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label>Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Makati City"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label>Preferences / Hair Care Notes</label>
                    <textarea
                      className="form-control"
                      placeholder="e.g. Scalp sensitivity, prefers sulphate-free shampoo..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={formData.vip}
                        onChange={(e) => setFormData({ ...formData, vip: e.target.checked })}
                        style={{ width: "18px", height: "18px", accentColor: "var(--accent-rose)" }}
                      />
                      <span>Mark as VIP Member (Eligible for discounts & perks)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAddClientModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  <CheckCircle size={18} /> {editingId ? "Update Profile" : "Register Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Clients;
