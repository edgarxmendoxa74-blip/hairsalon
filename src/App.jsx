import React from "react";
import { SalonProvider, useSalon } from "./context/SalonContext";
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
    case "reports":
      return <Reports />;
    default:
      return <Dashboard />;
  }
};

function App() {
  return (
    <SalonProvider>
      <TabletShell>
        <ActiveTabRenderer />
      </TabletShell>
    </SalonProvider>
  );
}

export default App;
