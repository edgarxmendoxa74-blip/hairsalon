import ExcelSheet from "./ExcelSheet";
import { useCurrency } from "../context/CurrencyContext";
import CategoryChips from "./CategoryChips";
import ExportButton from "./ExportButton";
import React, { useState } from "react";
import { useSalon } from "../context/SalonContext";
import {
  Calendar,
  PlusCircle,
  Clock,
  UserCheck,
  CheckCircle,
  Search,
  Check
} from "lucide-react";

const Appointments = () => {
  const { money, symbol } = useCurrency();
  const {
    appointments,
    clients,
    services,
    staff,
    inventory,
    addAppointment,
    updateAppointmentStatus,
    completeAppointmentAndTrack
  } = useSalon();

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);

  // Form states
  const [bookForm, setBookForm] = useState({
    clientId: clients[0]?.id || "",
    serviceId: services[0]?.id || "",
    staffId: staff[0]?.id || "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    notes: ""
  });

  const [checkoutTip, setCheckoutTip] = useState(100);
  const [treatmentNotes, setTreatmentNotes] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const [aptCategory, setAptCategory] = useState("ALL");
  const categoryOfApt = (apt) => services.find((sv) => sv.id === apt.serviceId)?.category || "Other";
  const aptCategories = (() => {
    const counts = {};
    appointments.forEach((a) => { const k = categoryOfApt(a); counts[k] = (counts[k] || 0) + 1; });
    return [{ key: "ALL", label: "All", count: appointments.length }, ...Object.keys(counts).sort().map((k) => ({ key: k, label: k, count: counts[k] }))];
  })();

  const filteredApts = appointments.filter((apt) => {
    const matchesStatus = filterStatus === "ALL" ? true : apt.status === filterStatus;
    if (aptCategory !== "ALL" && categoryOfApt(apt) !== aptCategory) return false;
    const matchesSearch =
      apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.staffName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleBookSubmit = (e) => {
    e.preventDefault();
    addAppointment(bookForm);
    setIsBookModalOpen(false);
  };

  const handleConfirmCheckout = (e) => {
    e.preventDefault();
    if (selectedApt) {
      completeAppointmentAndTrack(selectedApt.id, Number(checkoutTip), selectedProductIds, treatmentNotes);
      setTreatmentNotes("");
      setIsCheckoutModalOpen(false);
      setSelectedApt(null);
      setSelectedProductIds([]);
    }
  };

  const toggleProductSelect = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* HEADER BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Calendar size={26} color="var(--accent-sky)" /> Appointment Scheduling & Booking
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
            Manage client bookings, assigned stylists, appointment status workflow, and direct service completion.
          </p>
        </div>

        <div className="header-actions">
          <ExportButton filename="appointments" rows={filteredApts} columns={[{ label: "Appointment ID", value: (a) => a.id }, { label: "Date", value: (a) => a.date }, { label: "Time", value: (a) => a.time }, { label: "Client", value: (a) => a.clientName }, { label: "Phone", value: (a) => a.clientPhone }, { label: "Service", value: (a) => a.serviceName }, { label: "Stylist", value: (a) => a.staffName }, { label: "Duration (min)", value: (a) => a.duration }, { label: "Amount (MOP)", value: (a) => a.amount }, { label: "Status", value: (a) => a.status }]} />
          <button className="btn-primary" onClick={() => setIsBookModalOpen(true)}>
            <PlusCircle size={20} /> Book New Appointment
          </button>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="glass-card" style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div className="apt-filters">
            {["ALL", "Scheduled", "In-Progress", "Completed", "Cancelled"].map((status) => (
              <button
                key={status}
                className={`btn-secondary ${filterStatus === status ? "btn-primary" : ""}`}
                style={{ height: "38px", fontSize: "13px" }}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "11px", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search client, service, stylist..."
              className="form-control"
              style={{ paddingLeft: "36px", height: "38px", width: "260px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <CategoryChips label="Service category" options={aptCategories} value={aptCategory} onChange={setAptCategory} />

      {/* APPOINTMENTS CARDS / TABLE GRID */}
      <div className="glass-card">
        {filteredApts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
            No appointments found.
          </div>
        ) : (
          <ExcelSheet
            columns={[
              { key: "when", label: "Time & Date", style: { whiteSpace: "nowrap" }, render: (a) => (<><div style={{ fontWeight: 700, color: "var(--accent-rose)" }}>{a.time}</div><div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{a.date}</div></>) },
              { key: "clientName", label: "Client Name", style: { fontWeight: 700 } },
              { key: "clientPhone", label: "Phone Number", style: { whiteSpace: "nowrap" }, render: (a) => a.clientPhone || <span style={{ color: "var(--text-dim)" }}>No number</span> },
              { key: "serviceName", label: "Service Booked", render: (a) => (<><div style={{ fontWeight: 600 }}>{a.serviceName}</div>{(a.notes || a.treatmentNotes) && (<div className="apt-note" title={[a.notes, a.treatmentNotes].filter(Boolean).join(" | ")}>📝 {a.treatmentNotes || a.notes}</div>)}</>) },
              { key: "staffName", label: "Assigned Stylist", style: { fontWeight: 600, color: "var(--accent-purple)" } },
              { key: "amount", label: `Amount (${symbol})`, style: { fontWeight: 800 }, render: (a) => `${money(a.amount)}` },
              { key: "status", label: "Status", render: (a) => (<><span className={`status-badge ${a.status.toLowerCase().replace("-", "")}`}>{a.status}</span></>) },
              { key: "actions", label: "Actions", render: (a) => {
                const canStart = a.status === "Scheduled";
                const canComplete = a.status === "Scheduled" || a.status === "In-Progress";
                const canCancel = a.status === "Scheduled";
                if (!canStart && !canComplete && !canCancel) {
                  return <span style={{ color: "var(--text-dim)", fontSize: "13px" }}>No actions</span>;
                }
                return (
                  <select
                    className="form-control action-select"
                    aria-label={"Actions for " + a.clientName}
                    value=""
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "start") updateAppointmentStatus(a.id, "In-Progress");
                      else if (v === "complete") { setSelectedApt(a); setIsCheckoutModalOpen(true); }
                      else if (v === "cancel") {
                        if (window.confirm("Cancel the appointment for " + a.clientName + "?")) updateAppointmentStatus(a.id, "Cancelled");
                      }
                    }}
                  >
                    <option value="" disabled>Select action…</option>
                    {canStart && <option value="start">Start Service</option>}
                    {canComplete && <option value="complete">Complete &amp; Track</option>}
                    {canCancel && <option value="cancel">Cancel Appointment</option>}
                  </select>
                );
              } }
            ]}
            rows={filteredApts}
          />
        )}
      </div>

      {/* MODAL 1: BOOK APPOINTMENT */}
      {isBookModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Book New Client Appointment</h3>
              <button onClick={() => setIsBookModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <form onSubmit={handleBookSubmit}>
              <div className="modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  
                  <div className="form-group">
                    <label>Select Client *</label>
                    <select
                      className="form-control"
                      value={bookForm.clientId}
                      onChange={(e) => setBookForm({ ...bookForm, clientId: e.target.value })}
                      required
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Select Service *</label>
                    <select
                      className="form-control"
                      value={bookForm.serviceId}
                      onChange={(e) => setBookForm({ ...bookForm, serviceId: e.target.value })}
                      required
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} - {money(s.price)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Assigned Stylist / Staff *</label>
                    <select
                      className="form-control"
                      value={bookForm.staffId}
                      onChange={(e) => setBookForm({ ...bookForm, staffId: e.target.value })}
                      required
                    >
                      {staff.map((st) => (
                        <option key={st.id} value={st.id}>{st.name} ({st.role})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Appointment Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={bookForm.date}
                      onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Time Slot *</label>
                    <input
                      type="time"
                      className="form-control"
                      value={bookForm.time}
                      onChange={(e) => setBookForm({ ...bookForm, time: e.target.value })}
                      required
                    />
                  </div>

                  {(() => {
                    const c = clients.find((x) => x.id === bookForm.clientId);
                    const last = c?.treatmentRecords?.[0];
                    if (!last) return null;
                    return (
                      <div className="last-record" style={{ gridColumn: "span 2" }}>
                        <div className="last-record-title">Last visit record — {new Date(last.date).toLocaleDateString()} ({last.serviceName})</div>
                        {last.request && <div><b>Request:</b> {last.request}</div>}
                        {last.productsUsed?.length > 0 && <div><b>Products / meds used:</b> {last.productsUsed.join(", ")}</div>}
                        {last.notes && <div><b>Notes:</b> {last.notes}</div>}
                      </div>
                    );
                  })()}

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label>Special Instructions / Customer Requests</label>
                    <textarea
                      className="form-control"
                      placeholder="e.g. Hair color preference, allergy notes, requested treatment..."
                      value={bookForm.notes}
                      onChange={(e) => setBookForm({ ...bookForm, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsBookModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: COMPLETE APPOINTMENT & AUTO-TRACK SERVICE */}
      {isCheckoutModalOpen && selectedApt && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle size={20} /> Complete & Track Service: {selectedApt.clientName}
              </h3>
              <button onClick={() => setIsCheckoutModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <form onSubmit={handleConfirmCheckout}>
              <div className="modal-body">
                <div style={{ background: "var(--bg-input)", padding: "14px", borderRadius: "12px", marginBottom: "16px" }}>
                  <div style={{ fontWeight: 700, fontSize: "15px" }}>{selectedApt.serviceName}</div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Assigned Stylist: <strong>{selectedApt.staffName}</strong> • Service Total: <strong style={{ color: "var(--accent-rose)" }}>{money(selectedApt.amount)}</strong>
                  </div>
                </div>

                <div className="form-group">
                  <label>Client Tip for {selectedApt.staffName} (MOP$)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={checkoutTip}
                    onChange={(e) => setCheckoutTip(e.target.value)}
                  />
                </div>

                <div style={{ marginTop: "16px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                    Auto-Deduct Inventory Products Used:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxHeight: "120px", overflowY: "auto", background: "var(--bg-input)", padding: "10px", borderRadius: "10px" }}>
                    {inventory.map((inv) => (
                      <label key={inv.id} style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(inv.id)}
                          onChange={() => toggleProductSelect(inv.id)}
                          style={{ accentColor: "#8a6f7c" }}
                        />
                        <span>{inv.name} ({inv.currentStock} {inv.unit} left)</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: "16px" }}>
                  <label>Treatment Notes (products / meds used, reactions, next-visit reminders)</label>
                  <textarea
                    className="form-control"
                    placeholder="e.g. Used 20vol developer + ash brown dye, mild scalp sensitivity. Prefers no ammonia next time."
                    value={treatmentNotes}
                    onChange={(e) => setTreatmentNotes(e.target.value)}
                  />
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Saved to {selectedApt.clientName}'s client record, together with the products ticked above.
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsCheckoutModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ background: "linear-gradient(135deg, #8a6f7c, #6b5566)" }}>
                  <Check size={18} /> Confirm Completion & Record Commission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Appointments;
