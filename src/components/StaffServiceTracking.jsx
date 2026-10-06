import ExportButton from "./ExportButton";
import { useCurrency } from "../context/CurrencyContext";
import CategoryChips from "./CategoryChips";
import ExcelSheet from "./ExcelSheet";
import React, { useState, useEffect } from "react";
import { useSalon } from "../context/SalonContext";
import {
  Award,
  PlusCircle,
  Search,
  DollarSign,
  TrendingUp,
  UserCheck,
  CheckCircle,
  Package,
  Calendar,
  Filter,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

const StaffServiceTracking = () => {
  const { money } = useCurrency();
  const {
    staff,
    clients,
    services,
    inventory,
    staffTracking,
    recordStaffService
  } = useSalon();

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaffFilter, setSelectedStaffFilter] = useState("ALL");
  const [logCategory, setLogCategory] = useState("ALL");
  const categoryOfLog = (trk) => services.find((sv) => sv.id === trk.serviceId)?.category || "Other";
  const [selectedMonthFilter, setSelectedMonthFilter] = useState(new Date().toISOString().slice(0, 7)); // e.g. "2026-10"

  // Modal State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  // The record modal has two pages: 1) service details, 2) review, options and notes
  const [recordStep, setRecordStep] = useState(1);
  useEffect(() => {
    if (!isRecordModalOpen) setRecordStep(1);
  }, [isRecordModalOpen]);
  const [formData, setFormData] = useState({
    staffId: staff[0]?.id || "",
    clientId: clients[0]?.id || "",
    serviceId: services[0]?.id || "",
    serviceAmount: services[0]?.price || 0,
    tipAmount: 0,
    customDate: new Date().toISOString().slice(0, 16),
    notes: "",
    autoCreateSale: true,
    selectedInventoryDeductions: []
  });

  // Handle service selection change to update default price
  const handleServiceChange = (srvId) => {
    const srv = services.find((s) => s.id === srvId);
    setFormData((prev) => ({
      ...prev,
      serviceId: srvId,
      serviceAmount: srv ? srv.price : prev.serviceAmount
    }));
  };

  // Toggle inventory item check for auto-deduction
  const toggleInventoryDeduction = (invId) => {
    setFormData((prev) => {
      const exists = prev.selectedInventoryDeductions.includes(invId);
      if (exists) {
        return {
          ...prev,
          selectedInventoryDeductions: prev.selectedInventoryDeductions.filter((id) => id !== invId)
        };
      } else {
        return {
          ...prev,
          selectedInventoryDeductions: [...prev.selectedInventoryDeductions, invId]
        };
      }
    });
  };

  const handleRecordSubmit = (e) => {
    e.preventDefault();
    if (recordStep === 1) {
      setRecordStep(2);
      return;
    }
    recordStaffService({
      staffId: formData.staffId,
      clientId: formData.clientId,
      serviceId: formData.serviceId,
      serviceAmount: Number(formData.serviceAmount),
      tipAmount: Number(formData.tipAmount || 0),
      customDate: formData.customDate,
      notes: formData.notes,
      autoCreateSale: formData.autoCreateSale,
      autoDeductInventoryIds: formData.selectedInventoryDeductions
    });
    setIsRecordModalOpen(false);
  };

  // Calculated staff statistics for selected month
  const filteredTracking = staffTracking.filter((trk) => {
    const trkMonth = trk.date.slice(0, 7);
    const matchesMonth = selectedMonthFilter ? trkMonth === selectedMonthFilter : true;
    const matchesStaff = selectedStaffFilter === "ALL" ? true : trk.staffId === selectedStaffFilter;
    const matchesSearch =
      trk.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trk.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trk.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = logCategory === "ALL" ? true : categoryOfLog(trk) === logCategory;
    return matchesMonth && matchesStaff && matchesSearch && matchesCategory;
  });

  const logCategories = (() => {
    const base = staffTracking.filter((trk) => (selectedMonthFilter ? trk.date.slice(0, 7) === selectedMonthFilter : true));
    const counts = {};
    base.forEach((trk) => { const k = categoryOfLog(trk); counts[k] = (counts[k] || 0) + 1; });
    return [{ key: "ALL", label: "All", count: base.length }, ...Object.keys(counts).sort().map((k) => ({ key: k, label: k, count: counts[k] }))];
  })();

  // Aggregate monthly stats per staff member
  const staffMonthlyStats = staff.map((stf) => {
    const stfLogs = staffTracking.filter((t) => t.staffId === stf.id && (!selectedMonthFilter || t.date.startsWith(selectedMonthFilter)));
    const servicesDone = stfLogs.length;
    const totalRevenue = stfLogs.reduce((sum, t) => sum + t.serviceAmount, 0);
    const totalCommission = stfLogs.reduce((sum, t) => sum + t.commissionEarned, 0);
    const totalTips = stfLogs.reduce((sum, t) => sum + (t.tipAmount || 0), 0);
    const totalPayout = totalCommission + totalTips;

    return {
      ...stf,
      servicesDone,
      totalRevenue,
      totalCommission,
      totalTips,
      totalPayout
    };
  });

  // Top Earner
  const topEarner = [...staffMonthlyStats].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
  const totalCommissionPaidMonth = staffMonthlyStats.reduce((acc, s) => acc + s.totalCommission, 0);
  const totalServicesDoneMonth = staffMonthlyStats.reduce((acc, s) => acc + s.servicesDone, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* HEADER BAR WITH ACTION BUTTON */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Award size={26} color="var(--accent-rose)" /> Staff Service Tracking & Monthly Performance
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
            Record services rendered by salon stylists, calculate commissions reactively, and manage payouts.
          </p>
        </div>

        <div className="header-actions">
          <ExportButton filename="staff-service-logs" label="Export Logs" rows={filteredTracking} columns={[{ label: "Log ID", value: (t) => t.id }, { label: "Date & Time", value: (t) => t.date }, { label: "Stylist", value: (t) => t.staffName }, { label: "Client", value: (t) => t.clientName }, { label: "Service", value: (t) => t.serviceName }, { label: "Service Amount (PHP)", value: (t) => t.serviceAmount }, { label: "Commission Rate (%)", value: (t) => t.commissionRate }, { label: "Commission Earned (PHP)", value: (t) => t.commissionEarned }, { label: "Tip (PHP)", value: (t) => t.tipAmount || 0 }, { label: "Total Earnings (PHP)", value: (t) => t.totalEarnings }]} />
          <ExportButton filename={`staff-performance-${selectedMonthFilter || "all"}`} label="Export Breakdown" rows={staffMonthlyStats} columns={[{ label: "Stylist", value: (r) => r.name }, { label: "Role", value: (r) => r.role }, { label: "Commission Rate (%)", value: (r) => r.commissionRate }, { label: "Services Done", value: (r) => r.servicesDone }, { label: "Revenue (PHP)", value: (r) => r.totalRevenue }, { label: "Commission Earned (PHP)", value: (r) => r.totalCommission }, { label: "Tips (PHP)", value: (r) => r.totalTips }, { label: "Total Payout (PHP)", value: (r) => r.totalPayout }]} />
          <button className="btn-primary" onClick={() => setIsRecordModalOpen(true)}>
            <PlusCircle size={20} /> Record New Staff Service
          </button>
        </div>
      </div>

      {/* MONTHLY SUMMARY METRIC CARDS */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon rose">
            <Award size={26} />
          </div>
          <div className="stat-info">
            <div className="label">Top Performing Stylist</div>
            <div className="value">{topEarner ? topEarner.name : "N/A"}</div>
            <div style={{ fontSize: "12px", color: "var(--accent-rose)", marginTop: "2px", fontWeight: 600 }}>
              {topEarner ? `${money(topEarner.totalRevenue)} Revenue Generated` : "No logs"}
            </div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon emerald">
            <DollarSign size={26} />
          </div>
          <div className="stat-info">
            <div className="label">Total Staff Commissions</div>
            <div className="value">{money(totalCommissionPaidMonth)}</div>
            <div style={{ fontSize: "12px", color: "var(--accent-emerald)", marginTop: "2px", fontWeight: 600 }}>
              For Month ({selectedMonthFilter})
            </div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon sky">
            <TrendingUp size={26} />
          </div>
          <div className="stat-info">
            <div className="label">Services Rendered</div>
            <div className="value">{totalServicesDoneMonth}</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
              Total client service count
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: STAFF MONTHLY PERFORMANCE LEADERBOARD TABLE */}
      <div className="glass-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <UserCheck size={18} color="var(--accent-rose)" /> Staff Performance & Commission Breakdown
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Calendar size={16} color="var(--text-muted)" />
            <input
              type="month"
              className="form-control"
              style={{ height: "38px", fontSize: "13px" }}
              value={selectedMonthFilter}
              onChange={(e) => setSelectedMonthFilter(e.target.value)}
            />
          </div>
        </div>

        <ExcelSheet
          columns={[
            { key: "name", label: "Stylist Name", style: { fontWeight: 700 } },
            { key: "role", label: "Role", hideMd: true },
            { key: "commissionRate", label: "Commission Rate", num: true, hideSm: true, render: (r) => `${r.commissionRate}%` },
            { key: "servicesDone", label: "Services Done", num: true },
            { key: "totalRevenue", label: "Revenue Generated", num: true, render: (r) => `${money(r.totalRevenue)}` },
            { key: "totalCommission", label: "Commission Earned", num: true, render: (r) => `${money(r.totalCommission)}` },
            { key: "totalTips", label: "Tips Received", num: true, render: (r) => `${money(r.totalTips)}` },
            { key: "totalPayout", label: "Total Payout", num: true, style: { fontWeight: 700 }, render: (r) => `${money(r.totalPayout)}` }
          ]}
          rows={staffMonthlyStats}
          totals={(() => {
            const sum = (k) => staffMonthlyStats.reduce((a, r) => a + r[k], 0);
            const peso = (k) => `${money(sum(k))}`;
            return { name: "TOTAL", servicesDone: sum("servicesDone"), totalRevenue: peso("totalRevenue"), totalCommission: peso("totalCommission"), totalTips: peso("totalTips"), totalPayout: peso("totalPayout") };
          })()}
        />
      </div>

      {/* SECTION 2: DETAILED STAFF SERVICE LOGS HISTORY */}
      <div className="glass-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <h3 style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Award size={18} color="var(--accent-sky)" /> Recorded Staff Service Logs
          </h3>

          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search staff, client, service..."
                className="form-control"
                style={{ paddingLeft: "36px", height: "38px", width: "240px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="form-control"
              style={{ height: "38px", width: "180px" }}
              value={selectedStaffFilter}
              onChange={(e) => setSelectedStaffFilter(e.target.value)}
            >
              <option value="ALL">All Staff Members</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <CategoryChips label="Service category" options={logCategories} value={logCategory} onChange={setLogCategory} />
        </div>

        {filteredTracking.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
            No recorded staff services match the selected filter.
          </div>
        ) : (
          <ExcelSheet
            columns={[
              { key: "date", label: "Date & Time", style: { fontSize: "13px", color: "var(--text-muted)" }, render: (t) => new Date(t.date).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) },
              { key: "staffName", label: "Assigned Stylist", style: { fontWeight: 700, color: "var(--accent-rose)" } },
              { key: "clientName", label: "Client" },
              { key: "serviceName", label: "Service Rendered", style: { fontWeight: 600 } },
              { key: "serviceAmount", label: "Service Amount", style: { fontWeight: 700 }, render: (t) => `${money(t.serviceAmount)}` },
              { key: "commissionRate", label: "Commission Rate", render: (t) => `${t.commissionRate}%` },
              { key: "commissionEarned", label: "Commission Earned", style: { fontWeight: 700, color: "var(--accent-emerald)" }, render: (t) => `${money(t.commissionEarned)}` },
              { key: "tipAmount", label: "Tip", style: { color: "var(--accent-amber)" }, render: (t) => `${money(t.tipAmount || 0)}` },
              { key: "totalEarnings", label: "Total Earnings", style: { fontWeight: 800, color: "var(--accent-rose)" }, render: (t) => `${money(t.totalEarnings)}` }
            ]}
            rows={filteredTracking}
          />
        )}
      </div>

      {/* RECORD NEW STAFF SERVICE MODAL */}
      {isRecordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content pos-modal">
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Award size={20} /> Record Completed Staff Service
              </h3>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" }}
              >
                ✕
              </button>
            </div>

            <div className="pos-steps">
              <div className={`pos-step ${recordStep === 1 ? "active" : "done"}`}><span>1</span> Service Details</div>
              <div className="pos-step-line" />
              <div className={`pos-step ${recordStep === 2 ? "active" : ""}`}><span>2</span> Review & Notes</div>
            </div>

            <form onSubmit={handleRecordSubmit}>
              <div className="modal-body">
                {recordStep === 1 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  
                  {/* Select Staff Member */}
                  <div className="form-group">
                    <label>Assigned Staff / Stylist *</label>
                    <select
                      className="form-control"
                      value={formData.staffId}
                      onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                      required
                    >
                      {staff.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.role} - {s.commissionRate}% Comm.)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Client */}
                  <div className="form-group">
                    <label>Client *</label>
                    <select
                      className="form-control"
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      required
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Service */}
                  <div className="form-group">
                    <label>Service Performed *</label>
                    <select
                      className="form-control"
                      value={formData.serviceId}
                      onChange={(e) => handleServiceChange(e.target.value)}
                      required
                    >
                      {services.map((srv) => (
                        <option key={srv.id} value={srv.id}>
                          {srv.name} - {money(srv.price)} ({srv.duration} mins)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Service Charge Amount */}
                  <div className="form-group">
                    <label>Service Price (₱ PHP) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.serviceAmount}
                      onChange={(e) => setFormData({ ...formData, serviceAmount: e.target.value })}
                      required
                    />
                  </div>

                  {/* Tip Amount */}
                  <div className="form-group">
                    <label>Client Tip Amount (₱ PHP)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      value={formData.tipAmount}
                      onChange={(e) => setFormData({ ...formData, tipAmount: e.target.value })}
                    />
                  </div>

                  {/* Service Timestamp */}
                  <div className="form-group">
                    <label>Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={formData.customDate}
                      onChange={(e) => setFormData({ ...formData, customDate: e.target.value })}
                    />
                  </div>
                </div>
                )}

                {recordStep === 2 && (
                <>
                {/* Summary of page 1 */}
                {(() => {
                  const selStaff = staff.find((x) => x.id === formData.staffId);
                  const selClient = clients.find((x) => x.id === formData.clientId);
                  const selService = services.find((x) => x.id === formData.serviceId);
                  return (
                    <div className="pos-totals" style={{ marginBottom: "12px" }}>
                      <div><span>Stylist</span><strong>{selStaff ? selStaff.name : "—"}</strong></div>
                      <div><span>Client</span><strong>{selClient ? selClient.name : "—"}</strong></div>
                      <div><span>Service</span><strong>{selService ? selService.name : "—"}</strong></div>
                      <div><span>Service Price</span><strong>{money(Number(formData.serviceAmount || 0))}</strong></div>
                    </div>
                  );
                })()}

                {/* Calculation Preview Banner */}
                {(() => {
                  const selStaff = staff.find((s) => s.id === formData.staffId);
                  const rate = selStaff ? selStaff.commissionRate : 10;
                  const amt = Number(formData.serviceAmount || 0);
                  const comm = ((amt * rate) / 100).toFixed(2);
                  const total = (Number(comm) + Number(formData.tipAmount || 0)).toFixed(2);
                  return (
                    <div style={{ background: "rgba(138, 111, 124, 0.12)", border: "1px solid var(--accent-rose)", padding: "14px 18px", borderRadius: "12px", marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Calculated Commission ({rate}%):</div>
                        <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--accent-rose)" }}>{money(comm)}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Total Stylist Take-Home (+Tip):</div>
                        <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent-emerald)" }}>{money(total)}</div>
                      </div>
                    </div>
                  );
                })()}

                {/* Automation Toggles */}
                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.autoCreateSale}
                      onChange={(e) => setFormData({ ...formData, autoCreateSale: e.target.checked })}
                      style={{ width: "18px", height: "18px", accentColor: "var(--accent-rose)" }}
                    />
                    <span>Automatically generate Paid POS Transaction receipt</span>
                  </label>

                  <div>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                      Auto-Deduct Used Inventory Stock (Select used products):
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxHeight: "120px", overflowY: "auto", background: "var(--bg-input)", padding: "10px", borderRadius: "10px" }}>
                      {inventory.map((inv) => (
                        <label key={inv.id} style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={formData.selectedInventoryDeductions.includes(inv.id)}
                            onChange={() => toggleInventoryDeduction(inv.id)}
                            style={{ accentColor: "#8a6f7c" }}
                          />
                          <span>{inv.name} ({inv.currentStock} {inv.unit} left)</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: "16px" }}>
                  <label>Service Notes / Client Feedback</label>
                  <textarea
                    className="form-control"
                    placeholder="e.g. Client requested ash blonde shade, happy with cut..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                </>
                )}

              </div>

              <div className="modal-footer">
                {recordStep === 1 ? (
                  <>
                    <button type="button" className="btn-secondary" onClick={() => setIsRecordModalOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Next: Review <ArrowRight size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn-secondary" onClick={() => setRecordStep(1)}>
                      <ArrowLeft size={18} /> Back
                    </button>
                    <button type="submit" className="btn-primary">
                      <CheckCircle size={18} /> Confirm & Save Service Record
                    </button>
                  </>
                )}
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default StaffServiceTracking;
