import React, { useState, useEffect } from "react";
import { useSalon } from "../context/SalonContext";
import Navigation from "./Navigation";
import PageSlides from "./PageSlides";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

const TabletShell = ({ children }) => {
  const { toastMessage, activeTab } = useSalon();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formattedDate = currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

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

              <div className="topbar-clock" style={{ textAlign: "right", color: "var(--text-muted)", lineHeight: 1.2 }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 700, color: "var(--ink)" }}>{formattedTime}</div>
                <div style={{ fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>{formattedDate}</div>
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
