import ExcelSheet from "./ExcelSheet";
import React, { useState } from "react";
import { useSalon } from "../context/SalonContext";
import {
  BarChart3,
  TrendingUp,
  Award,
  Scissors,
  Package,
  Calendar,
  Printer,
  DollarSign
} from "lucide-react";

const Reports = () => {
  const { sales, staffTracking, services, inventory, staff } = useSalon();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // "2026-10"

  // Filter sales for selected month
  const monthlySales = sales.filter((s) => s.date.startsWith(selectedMonth));
  const totalMonthlyRevenue = monthlySales.reduce((sum, s) => sum + s.total, 0);

  // Filter staff tracking for selected month
  const monthlyTracking = staffTracking.filter((t) => t.date.startsWith(selectedMonth));
  const totalCommissionsPaid = monthlyTracking.reduce((sum, t) => sum + t.commissionEarned, 0);
  const totalTipsPaid = monthlyTracking.reduce((sum, t) => sum + (t.tipAmount || 0), 0);

  // Service breakdown counter
  const serviceCountMap = {};
  monthlyTracking.forEach((trk) => {
    if (!serviceCountMap[trk.serviceName]) {
      serviceCountMap[trk.serviceName] = { count: 0, revenue: 0 };
    }
    serviceCountMap[trk.serviceName].count += 1;
    serviceCountMap[trk.serviceName].revenue += trk.serviceAmount;
  });

  const sortedServicesReport = Object.entries(serviceCountMap).sort((a, b) => b[1].revenue - a[1].revenue);

  // Payment method breakdown
  const paymentBreakdown = { Cash: 0, GCash: 0, Card: 0 };
  monthlySales.forEach((s) => {
    if (paymentBreakdown[s.paymentMethod] !== undefined) {
      paymentBreakdown[s.paymentMethod] += s.total;
    }
  });

  // Total inventory value
  const totalInventoryValuation = inventory.reduce((acc, i) => acc + i.currentStock * i.unitCost, 0);
  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minStockThreshold).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "10px" }}>
            <BarChart3 size={26} color="var(--accent-rose)" /> Monthly Reports & Analytics Dashboard
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
            Monthly sales analytics, staff performance summaries, service popularity, and inventory valuation.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg-secondary)", padding: "6px 12px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
            <Calendar size={16} color="var(--text-muted)" />
            <input
              type="month"
              className="form-control"
              style={{ height: "36px", fontSize: "13px", border: "none" }}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>

          <button className="btn-secondary" onClick={() => window.print()}>
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon emerald">
            <DollarSign size={26} />
          </div>
          <div className="stat-info">
            <div className="label">Monthly Revenue</div>
            <div className="value">₱{totalMonthlyRevenue.toLocaleString()}</div>
            <div style={{ fontSize: "12px", color: "var(--accent-emerald)", marginTop: "2px", fontWeight: 600 }}>
              {monthlySales.length} Transactions
            </div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon rose">
            <Award size={26} />
          </div>
          <div className="stat-info">
            <div className="label">Stylist Commissions Paid</div>
            <div className="value">₱{totalCommissionsPaid.toLocaleString()}</div>
            <div style={{ fontSize: "12px", color: "var(--accent-rose)", marginTop: "2px", fontWeight: 600 }}>
              +₱{totalTipsPaid.toLocaleString()} Tips
            </div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon sky">
            <Package size={26} />
          </div>
          <div className="stat-info">
            <div className="label">Inventory Asset Valuation</div>
            <div className="value">₱{totalInventoryValuation.toLocaleString()}</div>
            <div style={{ fontSize: "12px", color: "var(--accent-amber)", marginTop: "2px", fontWeight: 600 }}>
              {lowStockCount} Low stock alerts
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: VISUAL REVENUE & PAYMENT METHOD BREAKDOWN */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
        
        {/* Visual Revenue Bar Representation */}
        <div className="glass-card">
          <h3 style={{ fontSize: "16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <TrendingUp size={18} color="var(--accent-emerald)" /> Payment Method Distribution
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "10px" }}>
            {Object.entries(paymentBreakdown).map(([method, amount]) => {
              const pct = totalMonthlyRevenue > 0 ? Math.round((amount / totalMonthlyRevenue) * 100) : 0;
              return (
                <div key={method}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>
                    <span>{method}</span>
                    <span>₱{amount.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div style={{ height: "10px", background: "var(--bg-input)", borderRadius: "99px", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: method === "GCash" ? "#e5a458" : method === "Cash" ? "#8a6f7c" : "#d9963f",
                        borderRadius: "99px",
                        transition: "width 0.4s ease"
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Popular Services */}
        <div className="glass-card">
          <h3 style={{ fontSize: "16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Scissors size={18} color="var(--accent-pink)" /> Service Performance Ranking
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sortedServicesReport.length === 0 ? (
              <div style={{ color: "var(--text-muted)", padding: "16px", textAlign: "center" }}>
                No services logged for this month.
              </div>
            ) : (
              sortedServicesReport.slice(0, 4).map(([name, data]) => (
                <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg-secondary)", borderRadius: "10px", fontSize: "13px" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{name}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{data.count} times performed</div>
                  </div>
                  <div style={{ fontWeight: 800, color: "var(--accent-emerald)" }}>
                    ₱{data.revenue.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* SECTION 2: STAFF PERFORMANCE MONTHLY SUMMARY REPORT TABLE */}
      <div className="glass-card">
        <h3 style={{ fontSize: "16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Award size={18} color="var(--accent-rose)" /> Staff Service & Commission Payout Report ({selectedMonth})
        </h3>

        {(() => {
          const rows = staff.map((stf) => {
            const logs = monthlyTracking.filter((t) => t.staffId === stf.id);
            const revenue = logs.reduce((a, t) => a + t.serviceAmount, 0);
            const comm = logs.reduce((a, t) => a + t.commissionEarned, 0);
            const tips = logs.reduce((a, t) => a + (t.tipAmount || 0), 0);
            return { id: stf.id, name: stf.name, role: stf.role, rate: stf.commissionRate, count: logs.length, revenue, comm, tips, payout: comm + tips };
          });
          const sum = (k) => rows.reduce((a, r) => a + r[k], 0);
          const peso = (n) => `₱${n.toLocaleString()}`;
          return (
            <ExcelSheet
              columns={[
                { key: "name", label: "Stylist Name", style: { fontWeight: 700 } },
                { key: "role", label: "Role", hideMd: true },
                { key: "rate", label: "Commission Rate", num: true, hideSm: true, render: (r) => `${r.rate}%` },
                { key: "count", label: "Services Done", num: true },
                { key: "revenue", label: "Revenue", num: true, render: (r) => peso(r.revenue) },
                { key: "comm", label: "Commission Earned", num: true, render: (r) => peso(r.comm) },
                { key: "tips", label: "Tips Received", num: true, render: (r) => peso(r.tips) },
                { key: "payout", label: "Total Payout", num: true, style: { fontWeight: 700 }, render: (r) => peso(r.payout) }
              ]}
              rows={rows}
              totals={{ name: "TOTAL", count: sum("count"), revenue: peso(sum("revenue")), comm: peso(sum("comm")), tips: peso(sum("tips")), payout: peso(sum("payout")) }}
            />
          );
        })()}
      </div>

    </div>
  );
};

export default Reports;
