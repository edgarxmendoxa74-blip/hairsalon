import React, { useState } from "react";
import { useSalon } from "../context/SalonContext";
import {
  Calendar,
  PlusCircle,
  Clock,
  UserCheck,
  CheckCircle,
  XCircle,
  PlayCircle,
  Search,
  Check
} from "lucide-react";

const Appointments = () => {
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
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const filteredApts = appointments.filter((apt) => {
    const matchesStatus = filterStatus === "ALL" ? true : apt.status === filterStatus;
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
      completeAppointmentAndTrack(selectedApt.id, Number(checkoutTip), selectedProductIds);
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

        <button className="btn-primary" onClick={() => setIsBookModalOpen(true)}>
          <PlusCircle size={20} /> Book New Appointment
        </button>
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

      {/* APPOINTMENTS CARDS / TABLE GRID */}
      <div className="glass-card">
        <div className="log-column">
          {filteredApts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
              No appointments found.
            </div>
          ) : (
            filteredApts.map((apt) => (
              <div key={apt.id} className="log-item">
                <div className="log-item-head">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "15px" }}>{apt.clientName}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{apt.clientPhone}</div>
                  </div>
                  <span className={`status-badge ${apt.status.toLowerCase().replace("-", "")}`}>{apt.status}</span>
                </div>
                <div className="log-item-body">
                  <div><span>Time & Date</span><b><span style={{ color: "var(--accent-rose)" }}>{apt.time}</span> • {apt.date}</b></div>
                  <div><span>Service</span><b>{apt.serviceName}</b></div>
                  <div><span>Stylist</span><b style={{ color: "var(--accent-purple)" }}>{apt.staffName}</b></div>
                  <div><span>Amount</span><b>₱{apt.amount.toLocaleString()}</b></div>
                </div>
                {(apt.status === "Scheduled" || apt.status === "In-Progress") && (
                  <div className="row-actions apt-actions">
                    {apt.status === "Scheduled" && (
                      <button className="btn-secondary" style={{ height: "38px", fontSize: "13px", color: "#38bdf8" }} onClick={() => updateAppointmentStatus(apt.id, "In-Progress")}>
                        <PlayCircle size={14} /> Start Service
                      </button>
                    )}
                    <button className="btn-primary" style={{ height: "38px", fontSize: "13px" }} onClick={() => { setSelectedApt(apt); setIsCheckoutModalOpen(true); }}>
                      <CheckCircle size={14} /> Complete & Track
                    </button>
                    {apt.status === "Scheduled" && (
                      <button className="btn-secondary btn-danger" style={{ height: "38px", fontSize: "13px" }} onClick={() => updateAppointmentStatus(apt.id, "Cancelled")}>
                        <XCircle size={14} /> Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
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
                        <option key={s.id} value={s.id}>{s.name} - ₱{s.price.toLocaleString()}</option>
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

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label>Special Instructions / Notes</label>
                    <textarea
                      className="form-control"
                      placeholder="e.g. Hair color preference, allergy notes..."
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
                    Assigned Stylist: <strong>{selectedApt.staffName}</strong> • Service Total: <strong style={{ color: "var(--accent-rose)" }}>₱{selectedApt.amount.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="form-group">
                  <label>Client Tip for {selectedApt.staffName} (₱)</label>
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
