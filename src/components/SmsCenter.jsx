import React, { useMemo, useState } from "react";
import { useSalon } from "../context/SalonContext";
import { MessageSquare, Search, Send, Copy, CheckCircle2, Users, Star } from "lucide-react";
import { toPhNumber, smsLink, copyText, formatDate, formatTime } from "../utils/sms";

const TEMPLATES = {
  confirm: {
    label: "Booking confirmation",
    text: "Hi {name}! Confirmed ang booking mo sa Fix Salon sa {date}, {time} - {service} kay {stylist}. See you!"
  },
  reminder: {
    label: "Appointment reminder",
    text: "Hi {name}! Paalala lang po, may appointment ka sa Fix Salon sa {date}, {time} ({service}). See you!"
  },
  promo: {
    label: "Promo / announcement",
    text: "Hi {name}! May promo kami ngayon sa Fix Salon. Mag-message lang po para mag-book. Salamat!"
  },
  custom: { label: "Custom message", text: "Hi {name}, " }
};

const todayStr = () => new Date().toISOString().split("T")[0];
const BOOKING_FIELDS = /\{(date|time|service|stylist)\}/;

const fillMessage = (text, client, apt) =>
  text
    .replace(/\{name\}/g, (client.name || "").split(" ")[0] || "there")
    .replace(/\{fullname\}/g, client.name || "")
    .replace(/\{date\}/g, apt ? formatDate(apt.date) : "")
    .replace(/\{time\}/g, apt ? formatTime(apt.time) : "")
    .replace(/\{service\}/g, apt ? apt.serviceName : "")
    .replace(/\{stylist\}/g, apt ? apt.staffName : "");

const SmsCenter = () => {
  const { clients, appointments, showToast } = useSalon();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState([]);
  const [templateKey, setTemplateKey] = useState("confirm");
  const [message, setMessage] = useState(TEMPLATES.confirm.text);
  const [sentIds, setSentIds] = useState([]);

  // Next upcoming booking per client (used for {date} {time} {service} {stylist})
  const nextApt = useMemo(() => {
    const map = {};
    appointments
      .filter((a) => a.clientId && (a.status === "Scheduled" || a.status === "In-Progress") && a.date >= todayStr())
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .forEach((a) => { if (!map[a.clientId]) map[a.clientId] = a; });
    return map;
  }, [appointments]);

  const visibleClients = clients.filter((c) => {
    const q = search.toLowerCase();
    const matches = !q || c.name.toLowerCase().includes(q) || (c.phone || "").includes(q);
    const passes = filter === "ALL" ? true : filter === "VIP" ? c.vip : filter === "BOOKED" ? Boolean(nextApt[c.id]) : true;
    return matches && passes;
  });

  const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const selectVisible = () => setSelected((prev) => [...new Set([...prev, ...visibleClients.map((c) => c.id)])]);
  const clearAll = () => setSelected([]);

  const chooseTemplate = (key) => {
    setTemplateKey(key);
    setMessage(TEMPLATES[key].text);
  };

  const needsBooking = BOOKING_FIELDS.test(message);
  const recipients = selected
    .map((id) => clients.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => {
      const apt = nextApt[c.id];
      const number = toPhNumber(c.phone);
      let problem = "";
      if (!number) problem = "No phone number";
      else if (needsBooking && !apt) problem = "No upcoming booking";
      return { client: c, apt, number, problem, text: fillMessage(message, c, apt) };
    });

  const sendable = recipients.filter((r) => !r.problem);
  const pending = sendable.filter((r) => !sentIds.includes(r.client.id));
  const segments = message.length <= 160 ? 1 : Math.ceil(message.length / 153);

  const markSent = (id) => setSentIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

  const sendOne = (r) => {
    window.location.href = smsLink(r.number, r.text);
    markSent(r.client.id);
  };

  const copyOne = async (r) => {
    const ok = await copyText(r.text);
    showToast(ok ? `Message for ${r.client.name} copied.` : "Could not copy the message.", ok ? "success" : "error");
    if (ok) markSent(r.client.id);
  };

  const sendNext = () => {
    if (pending[0]) sendOne(pending[0]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "10px" }}>
          <MessageSquare size={26} color="var(--accent-rose)" /> SMS Center
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
          Choose who to message, write or pick a template, then send each one through this device's SMS app.
        </p>
      </div>

      <div className="dash-row sms-layout">
        {/* RECIPIENTS */}
        <div className="glass-card">
          <h3 style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Users size={18} /> Recipients
            <span className="status-badge active" style={{ marginLeft: "auto" }}>{selected.length} selected</span>
          </h3>

          <div style={{ position: "relative", marginBottom: "10px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search name or number..."
              style={{ paddingLeft: "36px", height: "40px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="apt-filters" style={{ marginBottom: "10px" }}>
            {[["ALL", "All"], ["VIP", "VIP"], ["BOOKED", "With upcoming booking"]].map(([k, label]) => (
              <button key={k} type="button" className={`btn-secondary ${filter === k ? "btn-primary" : ""}`} style={{ height: "34px", fontSize: "12px" }} onClick={() => setFilter(k)}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            <button type="button" className="btn-secondary btn-export-sm" onClick={selectVisible}>Select all shown ({visibleClients.length})</button>
            <button type="button" className="btn-secondary btn-export-sm" onClick={clearAll} disabled={!selected.length}>Clear</button>
          </div>

          <div className="sms-list">
            {visibleClients.length === 0 ? (
              <div style={{ padding: "16px", color: "var(--text-muted)", fontSize: "13px", textAlign: "center" }}>No clients found.</div>
            ) : (
              visibleClients.map((c) => (
                <label key={c.id} className={`sms-row ${selected.includes(c.id) ? "on" : ""}`}>
                  <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} style={{ accentColor: "#8a6f7c" }} />
                  <span className="sms-contact">
                    <span className="sms-contact-name">
                      {c.name} {c.vip && <Star size={12} fill="#e9a95a" color="#e9a95a" />}
                    </span>
                    <span className="sms-contact-phone">{c.phone || "No number"}</span>
                    {nextApt[c.id] && (
                      <span className="sms-contact-next">
                        Next: {formatDate(nextApt[c.id].date)} {formatTime(nextApt[c.id].time)}
                      </span>
                    )}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* MESSAGE + QUEUE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: 0 }}>
          <div className="glass-card">
            <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>Message</h3>
            <div className="form-group">
              <label>Template</label>
              <select className="form-control" value={templateKey} onChange={(e) => chooseTemplate(e.target.value)}>
                {Object.entries(TEMPLATES).map(([k, t]) => <option key={k} value={k}>{t.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginTop: "12px" }}>
              <label>Text</label>
              <textarea className="form-control" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                {message.length} characters • about {segments} SMS each. You can use {"{name}"}, {"{fullname}"}, {"{date}"}, {"{time}"}, {"{service}"}, {"{stylist}"}.
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "16px" }}>
                To send ({sendable.length}) <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "12px" }}>• {sentIds.filter((id) => sendable.some((r) => r.client.id === id)).length} sent</span>
              </h3>
              <button type="button" className="btn-primary" disabled={!pending.length} onClick={sendNext}>
                <Send size={16} /> Send next{pending.length ? ` (${pending.length} left)` : ""}
              </button>
            </div>

            {recipients.length === 0 ? (
              <div style={{ padding: "16px", color: "var(--text-muted)", fontSize: "13px", textAlign: "center" }}>
                Tick the clients on the left to add them here.
              </div>
            ) : (
              <div className="sms-queue">
                {recipients.map((r) => {
                  const sent = sentIds.includes(r.client.id);
                  return (
                    <div key={r.client.id} className="log-item" style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "flex-start" }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: "13px" }}>{r.client.name}</div>
                          <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--mauve-deep)" }}>{r.number || "No number"}</div>
                        </div>
                        {r.problem ? (
                          <span className="status-badge lowstock">{r.problem}</span>
                        ) : sent ? (
                          <span className="status-badge completed"><CheckCircle2 size={12} /> Sent</span>
                        ) : (
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button type="button" className="icon-btn" title="Copy message" onClick={() => copyOne(r)}><Copy size={14} /></button>
                            <button type="button" className="btn-primary btn-export-sm" onClick={() => sendOne(r)}><Send size={13} /> Send</button>
                          </div>
                        )}
                      </div>
                      {!r.problem && <div className="sms-preview">{r.text}</div>}
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "10px" }}>
              Each message opens separately in the SMS app, so customers never see each other's numbers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsCenter;
