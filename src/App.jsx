import React from "react";
import { SalonProvider, useSalon } from "./context/SalonContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import Login from "./components/Login";
import TabletShell from "./components/TabletShell";
import Dashboard from "./components/Dashboard";
import Appointments from "./components/Appointments";
import Clients from "./components/Clients";
import Services from "./components/Services";
import StaffManagement from "./components/StaffManagement";
import StaffServiceTracking from "./components/StaffServiceTracking";
import Inventory from "./components/Inventory";
import Sales from "./components/Sales";
import Reports from "./components/Reports";
import Analytics from "./components/Analytics";
import SmsCenter from "./components/SmsCenter";
import BusinessDetails from "./components/BusinessDetails";

const ActiveTabRenderer = () => {
  const { activeTab } = useSalon();

  switch (activeTab) {
    case "dashboard":
      return <Dashboard />;
    case "appointments":
      return <Appointments />;
    case "clients":
      return <Clients />;
    case "services":
      return <Services />;
    case "staff":
      return <StaffManagement />;
    case "tracking":
      return <StaffServiceTracking />;
    case "inventory":
      return <Inventory />;
    case "sales":
      return <Sales />;
    case "sms":
      return <SmsCenter />;
    case "analytics":
      return <Analytics />;
    case "business":
      return <BusinessDetails />;
    case "reports":
      return <Reports />;
    default:
      return <Dashboard />;
  }
};

const AuthGate = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="login-screen">
        <div className="login-loading">Loading…</div>
      </div>
    );
  }
  if (!session) return <Login />;

  return (
    <CurrencyProvider>
      <SalonProvider>
        <TabletShell>
          <ActiveTabRenderer />
        </TabletShell>
      </SalonProvider>
    </CurrencyProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

export default App;
