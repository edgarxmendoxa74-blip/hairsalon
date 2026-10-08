import React, { useState, useEffect } from "react";
import { useCurrency } from "../context/CurrencyContext";
import { useSalon } from "../context/SalonContext";
import Navigation from "./Navigation";
import PageSlides from "./PageSlides";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

const ZONES = {
  PH: { tz: "Asia/Manila" },
  MO: { tz: "Asia/Macau" }
};
const ZONE_KEY = "glow_salon_timezone";
const loadZone = () => {
  try { const z = localStorage.getItem(ZONE_KEY); if (ZONES[z]) return z; } catch { /* ignore */ }
  return "PH";
};

const TabletShell = ({ children }) => {
  const { toastMessage, activeTab } = useSalon();
  const { currency, setCurrency, rate, setRate } = useCurrency();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [zone, setZone] = useState(loadZone);
  const [rateText, setRateText] = useState(String(rate));
  const chooseZone = (z) => {
    setZone(z);
    setCurrency(z === "MO" ? "MOP" : "PHP");
    try { localStorage.setItem(ZONE_KEY, z); } catch { /* storage unavailable */ }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: ZONES[zone].tz });
  const formattedDate = currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: ZONES[zone].tz });

  // Tables that do not fit the screen switch to stacked card rows (labels copied from headers)
  useEffect(() => {
    const root = document.querySelector(".page-body");
    if (!root) return undefined;
    let raf = 0;
    const apply = () => {
      root.querySelectorAll(".custom-table-container").forEach((box) => {
        const table = box.querySelector("table");
        if (!table) return;
        const heads = [...table.querySelectorAll("thead th")].map((th) => th.textContent.trim());
        table.querySelectorAll("tbody tr").forEach((tr) => {
          [...tr.children].forEach((td, i) => {
            if (heads[i] && td.dataset.label !== heads[i]) td.dataset.label = heads[i];
            const empty = td.textContent.trim() === "" && !td.querySelector("button, img, svg, input") ? "1" : "";
            if ((td.dataset.empty || "") !== empty) td.dataset.empty = empty;
          });
        });
        box.classList.remove("stacked");
        if (!box.classList.contains("no-stack") && box.scrollWidth > box.clientWidth + 2) box.classList.add("stacked");
      });
    };
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(apply); };
    schedule();
    const mo = new MutationObserver(schedule);
    mo.observe(root, { childList: true, subtree: true, characterData: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(raf); mo.disconnect(); window.removeEventListener("resize", schedule); };
  }, [activeTab]);

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Dashboard & Salon Overview";
      case "appointments": return "Appointment Scheduling";
      case "clients": return "Client Profiles & Service History";
      case "services": return "Services & Pricing Menu";
      case "staff": return "Staff Profiles & Management";
      case "tracking": return "Staff Service Tracking & Performance";
      case "inventory": return "Inventory & Stock Control";
      case "sales": return "POS & Transaction Register";
      case "sms": return "SMS Center";
      case "analytics": return "Analytics & Trends";
      case "business": return "Business Details";
      case "reports": return "Reports & Analytics";
      default: return "Salon Management";
    }
  };

  return (
    <div className="tablet-viewport-container">
      <div className="tablet-frame">

        {/* Main Application Layout */}
        <div className="tablet-app-layout">
          <Navigation />

          <main className="tablet-main-content">
            {/* Tablet Top Control Bar */}
            <header className="tablet-topbar">
              <div className="topbar-left">
                <h1 className="page-title">{getPageTitle()}</h1>
              </div>

              <div className="currency-switch" title="Display currency. Prices are stored in PHP.">
                <div className="currency-toggle">
                  <button type="button" className={currency === "PHP" ? "active" : ""} onClick={() => setCurrency("PHP")}>₱ PHP</button>
                  <button type="button" className={currency === "MOP" ? "active" : ""} onClick={() => setCurrency("MOP")}>MOP$ MOP</button>
                </div>
                <div className="currency-toggle" title="Display time zone">
                  <button type="button" className={zone === "PH" ? "active" : ""} onClick={() => chooseZone("PH")}>Philippines</button>
                  <button type="button" className={zone === "MO" ? "active" : ""} onClick={() => chooseZone("MO")}>Macau</button>
                </div>
                {currency === "MOP" && (
                  <label className="currency-rate">
                    MOP$1 = ₱
                    <input type="number" min="1" step="0.01" value={rateText} onChange={(e) => { setRateText(e.target.value); if (Number(e.target.value) > 0) setRate(e.target.value); }} onBlur={() => setRateText(String(rate))} />
                  </label>
                )}
              </div>

              <div className="topbar-clock">
                <div className="clock-time">{formattedTime}</div>
                <div className="clock-date">{formattedDate}</div>
              </div>
            </header>

            {/* Page Body View */}
            <div className="page-body">
              <PageSlides pageId={activeTab} />
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Toast Notification Handler */}
      {toastMessage && (
        <div className={`toast-notification ${toastMessage.type}`}>
          {toastMessage.type === "error" ? (
            <AlertTriangle size={20} color="#ef4444" />
          ) : toastMessage.type === "info" ? (
            <Info size={20} color="#3b82f6" />
          ) : (
            <CheckCircle size={20} color="#4d7a4a" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}
    </div>
  );
};

export default TabletShell;
