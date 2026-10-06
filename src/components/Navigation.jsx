import React from "react";
import { useSalon } from "../context/SalonContext";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  UserCheck,
  Award,
  Package,
  CreditCard,
  BarChart3,
  LogOut,
  LineChart
} from "lucide-react";

const Navigation = () => {
  const { activeTab, setActiveTab, lowStockCount, todayAppointmentsCount } = useSalon();
  const { signOut } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "appointments", label: "Appointments", icon: Calendar, badge: todayAppointmentsCount > 0 ? todayAppointmentsCount : null, badgeClass: "info" },
    { id: "clients", label: "Clients", icon: Users },
    { id: "services", label: "Services", icon: Scissors },
    { id: "staff", label: "Staff Management", icon: UserCheck },
    { id: "tracking", label: "Staff Service Tracking", icon: Award, highlight: true }, // Main focus
    { id: "inventory", label: "Inventory", icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} Low` : null, badgeClass: "alert", highlight: true }, // Main focus
    { id: "sales", label: "Sales & POS", icon: CreditCard },
    { id: "analytics", label: "Analytics", icon: LineChart },
    { id: "reports", label: "Reports", icon: BarChart3 }
  ];

  return (
    <aside className="tablet-sidebar">
      <div>
        {/* Brand Header */}
        <div className="brand-header">
          <div className="brand-logo">
            <span className="brand-monogram">FS</span>
          </div>
          <div>
            <div className="brand-title">Fix Salon</div>
            <div className="brand-subtitle">your hair specialist</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? "active" : ""} ${item.highlight ? "highlight-tab" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="nav-item-left">
                  <Icon size={20} color={isActive ? "var(--accent-forest)" : item.highlight ? "var(--accent-green)" : "currentColor"} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`nav-badge ${item.badgeClass || "info"}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-user">
        <button type="button" className="signout-btn" onClick={signOut} title="Sign out">
          <LogOut size={18} /> <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Navigation;
