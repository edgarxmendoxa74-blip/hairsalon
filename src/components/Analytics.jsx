import React from "react";
import { useCurrency } from "../context/CurrencyContext";
import { useSalon } from "../context/SalonContext";
import { LineChart, TrendingUp, Award, Users, Scissors, CalendarCheck } from "lucide-react";

const dayKey = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};

const BarRow = ({ label, value, max, display, color = "var(--mauve-deep)" }) => (
  <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 90px", alignItems: "center", gap: "12px", fontSize: "13px" }}>
    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
    <div style={{ background: "var(--cream-deep)", borderRadius: "6px", height: "12px" }}>
      <div style={{ width: `${max ? (value / max) * 100 : 0}%`, height: "100%", background: color, borderRadius: "6px", transition: "width 0.4s" }} />
    </div>
    <span style={{ textAlign: "right", fontWeight: 600 }}>{display}</span>
  </div>
);

const topN = (map, n = 5) => Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, n);

const Analytics = () => {
  const { money } = useCurrency();
  const { sales, staffTracking, appointments } = useSalon();

  // Last 7 days revenue
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { key: dayKey(d), label: d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }), total: 0 };
  });
  sales.forEach((s) => {
    const d = days.find((x) => x.key === dayKey(s.date));
    if (d) d.total += s.total;
  });
  const weekTotal = days.reduce((a, d) => a + d.total, 0);
  const maxDay = Math.max(...days.map((d) => d.total), 0);

  const totalRevenue = sales.reduce((a, s) => a + s.total, 0);
  const avgTicket = sales.length ? Math.round(totalRevenue / sales.length) : 0;

  const stylist = {}, service = {}, client = {};
  staffTracking.forEach((t) => {
    stylist[t.staffName] = (stylist[t.staffName] || 0) + t.serviceAmount;
    service[t.serviceName] = (service[t.serviceName] || 0) + t.serviceAmount;
  });
  sales.forEach((s) => {
    if (s.clientName) client[s.clientName] = (client[s.clientName] || 0) + s.total;
  });

  const statusCount = {};
  appointments.forEach((a) => { statusCount[a.status] = (statusCount[a.status] || 0) + 1; });
  const completionRate = appointments.length ? Math.round(((statusCount.Completed || 0) / appointments.length) * 100) : 0;

  const peso = (n) => `${money(n)}`;
  const Section = ({ icon: Icon, title, children }) => (
    <div className="glass-card">
      <h3 style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <Icon size={18} /> {title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{children}</div>
    </div>
  );

  const ranked = (map, color) => {
    const rows = topN(map);
    const max = rows[0]?.[1] || 0;
    return rows.length
      ? rows.map(([k, v]) => <BarRow key={k} label={k} value={v} max={max} display={peso(v)} color={color} />)
      : <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No data yet.</p>;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "10px" }}>
          <LineChart size={26} color="var(--accent-rose)" /> Analytics
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
          Revenue trends, top performers, and appointment insights across all time.
        </p>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card"><div className="stat-info"><div className="label">Last 7 Days</div><div className="value">{peso(weekTotal)}</div></div></div>
        <div className="glass-card stat-card"><div className="stat-info"><div className="label">Average Ticket</div><div className="value">{peso(avgTicket)}</div></div></div>
        <div className="glass-card stat-card"><div className="stat-info"><div className="label">Appointment Completion</div><div className="value">{completionRate}%</div></div></div>
      </div>

      <Section icon={TrendingUp} title="Revenue — Last 7 Days">
        {days.map((d) => <BarRow key={d.key} label={d.label} value={d.total} max={maxDay} display={peso(d.total)} color="var(--accent-gold)" />)}
      </Section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <Section icon={Award} title="Top Stylists">{ranked(stylist, "var(--mauve-deep)")}</Section>
        <Section icon={Scissors} title="Top Services">{ranked(service, "var(--accent-gold)")}</Section>
        <Section icon={Users} title="Top Clients">{ranked(client, "var(--mauve-deep)")}</Section>
        <Section icon={CalendarCheck} title="Appointments by Status">
          {Object.entries(statusCount).map(([k, v]) => (
            <BarRow key={k} label={k} value={v} max={appointments.length} display={v} color="var(--accent-gold)" />
          ))}
        </Section>
      </div>
    </div>
  );
};

export default Analytics;
