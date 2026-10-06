import React, { useState, useEffect } from "react";
import { useSalon } from "../context/SalonContext";
import Navigation from "./Navigation";
import {
  Tablet,
  Smartphone,
  Maximize2,
  Sun,
  Moon,
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles
} from "lucide-react";

const TabletShell = ({ children }) => {
  const {
    tabletMode,
    setTabletMode,
    themeMode,
    setThemeMode,
    toastMessage,
    lowStockCount,
    todayAppointmentsCount,
    activeTab
  } = useSalon();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formattedDate = currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

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
      case "reports": return "Reports & Analytics";
      default: return "Salon Management";
    }
  };

  return (
    <div className={`tablet-viewport-container ${tabletMode === "fullscreen" ? "fullscreen-mode" : ""} ${themeMode === "light" ? "light-mode" : ""}`}>
      <div className={`tablet-frame ${tabletMode === "portrait" ? "portrait-mode" : ""} ${tabletMode === "fullscreen" ? "fullscreen-mode" : ""}`}>
        
        {/* Tablet Top Hardware / Status Bar */}
        <div className="tablet-top-hardware-bar">
          <div className="time-display">
            <span>{formattedTime}</span> • <span style={{ opacity: 0.8 }}>{formattedDate}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={14} color="#f59e0b" />
            <span style={{ fontSize: "11px", letterSpacing: "0.5px", color: "#ffffff", fontWeight: 700 }}>
              GLOW STUDIO TABLET OS
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {lowStockCount > 0 && (
              <span style={{ color: "#f59e0b", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                <AlertTriangle size={12} /> {lowStockCount} Low Stock
              </span>
            )}
            <span style={{ fontSize: "12px" }}>🔋 98%</span>
          </div>
        </div>

        {/* Main Application Layout */}
        <div className="tablet-app-layout">
          <Navigation />

          <main className="tablet-main-content">
            {/* Tablet Top Control Bar */}
            <header className="tablet-topbar">
              <div className="topbar-left">
                <h1 className="page-title">{getPageTitle()}</h1>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Tablet Frame Controls Switcher */}
                <div className="tablet-mode-controls">
                  <button
                    className={`mode-btn ${tabletMode === "ipad-landscape" ? "active" : ""}`}
                    onClick={() => setTabletMode("ipad-landscape")}
                    title="Tablet Landscape View (1024px+)"
                  >
                    <Tablet size={14} /> Landscape
                  </button>
                  <button
                    className={`mode-btn ${tabletMode === "portrait" ? "active" : ""}`}
                    onClick={() => setTabletMode("portrait")}
                    title="Tablet Portrait View (820px)"
                  >
                    <Smartphone size={14} /> Portrait
                  </button>
                  <button
                    className={`mode-btn ${tabletMode === "fullscreen" ? "active" : ""}`}
                    onClick={() => setTabletMode("fullscreen")}
                    title="Full Screen Mode"
                  >
                    <Maximize2 size={14} /> Full
                  </button>
                </div>

                {/* Dark / Light Theme Toggle */}
                <button
                  className="btn-secondary"
                  style={{ width: "40px", height: "40px", padding: 0, borderRadius: "50%" }}
                  onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
                  title="Toggle Light / Dark Mode"
                >
                  {themeMode === "dark" ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#8b5cf6" />}
                </button>
              </div>
            </header>

            {/* Page Body View */}
            <div className="page-body">
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
            <CheckCircle size={20} color="#10b981" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}
    </div>
  );
};

export default TabletShell;
