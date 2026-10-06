import React from "react";
import { useSalon } from "../context/SalonContext";
import {
  DollarSign,
  Calendar,
  Users,
  AlertTriangle,
  Award,
  TrendingUp,
  Package,
  PlusCircle,
  ArrowRight,
  Clock,
  CheckCircle2
} from "lucide-react";

const Dashboard = () => {
  const {
    sales,
    appointments,
    clients,
    inventory,
    staffTracking,
    setActiveTab,
    lowStockCount,
    totalSalesToday,
    quickRestockLowStockItems
  } = useSalon();

  // Compute monthly sales
  const currentMonthStr = new Date().toISOString().slice(0, 7); // e.g. "2026-10"
  const monthlySalesTotal = sales
    .filter((s) => s.date.startsWith(currentMonthStr))
    .reduce((sum, s) => sum + s.total, 0);

  // Today's appointments count
  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);

  // Low stock products
  const lowStockProducts = inventory.filter((item) => item.currentStock <= item.minStockThreshold);

  // Top performing staff member this month
  const staffPerformanceMap = {};
  staffTracking.forEach((trk) => {
    if (!staffPerformanceMap[trk.staffName]) {
      staffPerformanceMap[trk.staffName] = { revenue: 0, servicesCount: 0, commission: 0 };
    }
    staffPerformanceMap[trk.staffName].revenue += trk.serviceAmount;
    staffPerformanceMap[trk.staffName].servicesCount += 1;
    staffPerformanceMap[trk.staffName].commission += trk.commissionEarned;
  });

  const topStaffEntry = Object.entries(staffPerformanceMap).sort((a, b) => b[1].revenue - a[1].revenue)[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* LOW STOCK ALERT BANNER IF APPLICABLE */}
      {lowStockCount > 0 && (
        <div className="glass-card highlight-focus" style={{ borderColor: "var(--accent-amber)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ background: "rgba(245, 158, 11, 0.2)", padding: "10px", borderRadius: "12px", color: "#f59e0b" }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 style={{ color: "#fbbf24", fontSize: "16px" }}>
                Low Stock Alert: {lowStockCount} Product{lowStockCount > 1 ? "s" : ""} need restock!
              </h4>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {lowStockProducts.map((p) => `${p.name} (${p.currentStock} ${p.unit} remaining)`).join(", ")}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn-secondary" onClick={() => quickRestockLowStockItems(10)}>
              ⚡ Quick Restock All (+10)
            </button>
            <button className="btn-primary" onClick={() => setActiveTab("inventory")}>
              Manage Inventory <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* KPI METRIC CARDS GRID */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon emerald">
            <DollarSign size={26} />
          </div>
          <div className="stat-info">
            <div className="label">Today's Sales Revenue</div>
            <div className="value">₱{totalSalesToday.toLocaleString()}</div>
            <div style={{ fontSize: "12px", color: "var(--accent-emerald)", marginTop: "2px", fontWeight: 600 }}>
              Monthly: ₱{monthlySalesTotal.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon sky">
            <Calendar size={26} />
          </div>
          <div className="stat-info">
            <div className="label">Today's Appointments</div>
            <div className="value">{todayAppointments.length}</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
              {todayAppointments.filter((a) => a.status === "Completed").length} Completed • {todayAppointments.filter((a) => a.status === "Scheduled").length} Pending
            </div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon purple">
            <Users size={26} />
          </div>
          <div className="stat-info">
            <div className="label">Total Active Clients</div>
            <div className="value">{clients.length}</div>
            <div style={{ fontSize: "12px", color: "var(--accent-purple)", marginTop: "2px", fontWeight: 600 }}>
              {clients.filter((c) => c.vip).length} VIP Members
            </div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon rose">
            <Award size={26} />
          </div>
          <div className="stat-info">
            <div className="label">Top Stylist This Month</div>
            <div className="value" style={{ fontSize: "18px" }}>
              {topStaffEntry ? topStaffEntry[0] : "N/A"}
            </div>
            <div style={{ fontSize: "12px", color: "var(--accent-rose)", marginTop: "2px", fontWeight: 600 }}>
              {topStaffEntry ? `₱${topStaffEntry[1].revenue.toLocaleString()} Revenue` : "No activity"}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK FOCUS SHORTCUTS & CORE FLOW */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        
        {/* MAIN FOCUS 1: STAFF SERVICE TRACKING BANNER */}
        <div className="glass-card" style={{ background: "var(--accent-mint)", border: "1.5px solid var(--accent-gold)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(217, 119, 6, 0.15)", border: "1px solid var(--accent-gold)", padding: "4px 10px", borderRadius: "99px", color: "var(--accent-gold)", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
                <Award size={14} /> MAIN FOCUS #1
              </div>
              <h3 style={{ fontSize: "18px", color: "var(--accent-forest)" }}>Staff Service Tracking</h3>
              <p style={{ fontSize: "13px", color: "var(--text-main)", marginTop: "4px" }}>
                Record services performed, calculate staff commissions automatically & track monthly performance.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button className="btn-primary" onClick={() => setActiveTab("tracking")}>
              <PlusCircle size={18} /> Record New Staff Service
            </button>
          </div>
        </div>

        {/* MAIN FOCUS 2: INVENTORY MANAGEMENT BANNER */}
        <div className="glass-card" style={{ background: "var(--accent-mint)", border: "1.5px solid var(--accent-gold)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(217, 119, 6, 0.15)", border: "1px solid var(--accent-gold)", padding: "4px 10px", borderRadius: "99px", color: "var(--accent-gold)", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
                <Package size={14} /> MAIN FOCUS #2
              </div>
              <h3 style={{ fontSize: "18px", color: "var(--accent-forest)" }}>Inventory & Stock Control</h3>
              <p style={{ fontSize: "13px", color: "var(--text-main)", marginTop: "4px" }}>
                Monitor stock levels, execute Stock In/Out movements, and auto-detect low-stock thresholds.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button className="btn-secondary" style={{ borderColor: "var(--accent-gold)", color: "var(--accent-forest)" }} onClick={() => setActiveTab("inventory")}>
              <TrendingUp size={18} /> View Stock & Low-Stock Alerts
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD BOTTOM GRID: APPOINTMENTS AGENDA & RECENT STAFF SERVICE LOGS */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
        
        {/* Today's Schedule Agenda */}
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}>
              <Clock size={18} color="var(--accent-sky)" /> Today's Schedule & Appointments
            </h3>
            <button className="btn-secondary" style={{ height: "36px", fontSize: "12px" }} onClick={() => setActiveTab("appointments")}>
              View All <ArrowRight size={14} />
            </button>
          </div>

          {todayAppointments.length === 0 ? (
            <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
              No appointments scheduled for today yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14px" }}>
                      {apt.time} - {apt.clientName}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {apt.serviceName} • Stylist: <span style={{ color: "var(--accent-rose)", fontWeight: 600 }}>{apt.staffName}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className={`status-badge ${apt.status.toLowerCase().replace("-", "")}`}>
                      {apt.status}
                    </span>
                    <span style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "14px" }}>
                      ₱{apt.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Staff Service Activity Stream */}
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}>
              <CheckCircle2 size={18} color="var(--accent-emerald)" /> Recent Staff Service Logs
            </h3>
            <button className="btn-secondary" style={{ height: "36px", fontSize: "12px" }} onClick={() => setActiveTab("tracking")}>
              View Tracking <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {staffTracking.slice(0, 4).map((trk) => (
              <div
                key={trk.id}
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  fontSize: "13px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                  <span style={{ color: "var(--accent-rose)" }}>{trk.staffName}</span>
                  <span style={{ color: "var(--accent-emerald)" }}>+₱{trk.commissionEarned} Comm.</span>
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "4px" }}>
                  {trk.serviceName} for {trk.clientName} (₱{trk.serviceAmount.toLocaleString()})
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
