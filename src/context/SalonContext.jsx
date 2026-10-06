import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initialStaff,
  initialServices,
  initialClients,
  initialInventory,
  initialInventoryLogs,
  initialAppointments,
  initialStaffServiceTracking,
  initialSales
} from "../data/mockData";

const SalonContext = createContext();

export const SalonProvider = ({ children }) => {
  // Helpers to get initial data from localStorage or fallback
  const getStoredData = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`glow_salon_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error(`Error loading ${key} from storage:`, e);
      return fallback;
    }
  };

  const [staff, setStaff] = useState(() => getStoredData("staff", initialStaff));
  const [services, setServices] = useState(() => getStoredData("services", initialServices));
  const [clients, setClients] = useState(() => getStoredData("clients", initialClients));
  const [inventory, setInventory] = useState(() => getStoredData("inventory", initialInventory));
  const [inventoryLogs, setInventoryLogs] = useState(() => getStoredData("inventoryLogs", initialInventoryLogs));
  const [appointments, setAppointments] = useState(() => getStoredData("appointments", initialAppointments));
  const [staffTracking, setStaffTracking] = useState(() => getStoredData("staffTracking", initialStaffServiceTracking));
  const [sales, setSales] = useState(() => getStoredData("sales", initialSales));

  // UX & Tablet View state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tabletMode, setTabletMode] = useState("ipad-landscape"); // 'ipad-landscape', 'ipad-portrait', 'fullscreen'
  const [themeMode, setThemeMode] = useState("light"); // Default White, Green & Gold theme
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem("glow_salon_staff", JSON.stringify(staff)); }, [staff]);
  useEffect(() => { localStorage.setItem("glow_salon_services", JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem("glow_salon_clients", JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem("glow_salon_inventory", JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem("glow_salon_inventoryLogs", JSON.stringify(inventoryLogs)); }, [inventoryLogs]);
  useEffect(() => { localStorage.setItem("glow_salon_appointments", JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem("glow_salon_staffTracking", JSON.stringify(staffTracking)); }, [staffTracking]);
  useEffect(() => { localStorage.setItem("glow_salon_sales", JSON.stringify(sales)); }, [sales]);

  // Show Toast Notification
  const showToast = (message, type = "success") => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // --- STAFF ACTIONS ---
  const addStaff = (newStaffData) => {
    const newStaff = {
      ...newStaffData,
      id: `STF-${String(staff.length + 1).padStart(3, "0")}`,
      status: "Active"
    };
    setStaff((prev) => [newStaff, ...prev]);
    showToast(`Staff member "${newStaff.name}" added successfully!`);
  };

  const updateStaff = (id, updatedData) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s)));
    showToast(`Staff updated successfully!`);
  };

  const deleteStaff = (id) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    showToast("Staff member removed.", "info");
  };

  // --- SERVICE ACTIONS ---
  const addService = (serviceData) => {
    const newService = {
      ...serviceData,
      id: `SRV-${String(services.length + 1).padStart(3, "0")}`,
      price: Number(serviceData.price),
      duration: Number(serviceData.duration)
    };
    setServices((prev) => [newService, ...prev]);
    showToast(`Service "${newService.name}" created!`);
  };

  const updateService = (id, updatedData) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedData, price: Number(updatedData.price ?? s.price), duration: Number(updatedData.duration ?? s.duration) } : s)));
    showToast(`Service updated successfully!`);
  };

  const deleteService = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast(`Service removed.`, "info");
  };

  // --- CLIENT ACTIONS ---
  const addClient = (clientData) => {
    const newClient = {
      ...clientData,
      id: `CLT-${String(clients.length + 1).padStart(3, "0")}`,
      vip: Boolean(clientData.vip),
      totalVisits: 0,
      totalSpent: 0,
      registeredDate: new Date().toISOString().split("T")[0]
    };
    setClients((prev) => [newClient, ...prev]);
    showToast(`New client "${newClient.name}" registered!`);
    return newClient;
  };

  const updateClient = (id, updatedData) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedData, vip: Boolean(updatedData.vip) } : c)));
    showToast("Client profile updated!");
  };

  const deleteClient = (id) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    showToast("Client removed.", "info");
  };

  // --- INVENTORY MANAGEMENT (MAIN FOCUS #2) ---
  const addInventoryItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: `INV-${String(inventory.length + 1).padStart(3, "0")}`,
      currentStock: Number(itemData.currentStock),
      minStockThreshold: Number(itemData.minStockThreshold),
      unitCost: Number(itemData.unitCost),
      retailPrice: Number(itemData.retailPrice || 0),
      lastRestocked: new Date().toISOString().split("T")[0]
    };
    setInventory((prev) => [newItem, ...prev]);
    showToast(`Inventory item "${newItem.name}" added!`);
  };

  const updateInventoryItem = (id, updatedData) => {
    setInventory((prev) => prev.map((i) => (i.id === id ? {
      ...i,
      ...updatedData,
      currentStock: Number(updatedData.currentStock ?? i.currentStock),
      minStockThreshold: Number(updatedData.minStockThreshold ?? i.minStockThreshold),
      unitCost: Number(updatedData.unitCost ?? i.unitCost),
      retailPrice: Number(updatedData.retailPrice ?? i.retailPrice ?? 0)
    } : i)));
    showToast(`Inventory item updated!`);
  };

  const deleteInventoryItem = (id) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
    showToast("Inventory item removed.", "info");
  };

  // Stock In (Restock)
  const stockInItem = (productId, quantity, supplierNote, performedBy = "Manager Admin") => {
    const qty = Number(quantity);
    if (qty <= 0) return;

    let targetItem = null;

    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          targetItem = item;
          const updatedStock = item.currentStock + qty;
          return {
            ...item,
            currentStock: updatedStock,
            lastRestocked: new Date().toISOString().split("T")[0]
          };
        }
        return item;
      })
    );

    if (targetItem) {
      const newLog = {
        id: `LOG-${Date.now()}`,
        date: new Date().toISOString(),
        productId,
        productName: targetItem.name,
        type: "STOCK_IN",
        quantity: qty,
        previousStock: targetItem.currentStock,
        newStock: targetItem.currentStock + qty,
        staffName: performedBy,
        reason: supplierNote || "Restock Batch Received"
      };
      setInventoryLogs((prev) => [newLog, ...prev]);
      showToast(`Added +${qty} ${targetItem.unit}(s) to "${targetItem.name}" stock.`);
    }
  };

  // Stock Out (Deduct Usage / Sale)
  const stockOutItem = (productId, quantity, reasonNote, performedBy = "Staff") => {
    const qty = Number(quantity);
    if (qty <= 0) return;

    let targetItem = null;
    let errorMsg = null;

    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          targetItem = item;
          if (item.currentStock < qty) {
            errorMsg = `Insufficient stock! Only ${item.currentStock} ${item.unit}(s) available.`;
            return item;
          }
          const updatedStock = item.currentStock - qty;
          return {
            ...item,
            currentStock: updatedStock
          };
        }
        return item;
      })
    );

    if (errorMsg) {
      showToast(errorMsg, "error");
      return false;
    }

    if (targetItem) {
      const newLog = {
        id: `LOG-${Date.now()}`,
        date: new Date().toISOString(),
        productId,
        productName: targetItem.name,
        type: "STOCK_OUT",
        quantity: qty,
        previousStock: targetItem.currentStock,
        newStock: targetItem.currentStock - qty,
        staffName: performedBy,
        reason: reasonNote || "Service usage / Salon operational deduction"
      };
      setInventoryLogs((prev) => [newLog, ...prev]);
      showToast(`Deducted -${qty} ${targetItem.unit}(s) from "${targetItem.name}".`, "info");
      return true;
    }
    return false;
  };

  // Quick Restock All Low Stock Items
  const quickRestockLowStockItems = (addedQtyPerItem = 10) => {
    const lowStockItems = inventory.filter((item) => item.currentStock <= item.minStockThreshold);
    if (lowStockItems.length === 0) {
      showToast("No low-stock items to restock!", "info");
      return;
    }

    lowStockItems.forEach((item) => {
      stockInItem(item.id, addedQtyPerItem, "Automated Bulk Restock Action", "System Admin");
    });
    showToast(`Bulk restocked ${lowStockItems.length} items with +${addedQtyPerItem} units each!`);
  };

  // --- STAFF SERVICE TRACKING (MAIN FOCUS #1) ---
  const recordStaffService = ({
    staffId,
    clientId,
    serviceId,
    serviceAmount,
    tipAmount = 0,
    customDate = null,
    notes = "",
    autoCreateSale = true,
    autoDeductInventoryIds = []
  }) => {
    const staffMember = staff.find((s) => s.id === staffId);
    const clientMember = clients.find((c) => c.id === clientId);
    const serviceMember = services.find((s) => s.id === serviceId);

    if (!staffMember || !clientMember || !serviceMember) {
      showToast("Error recording service: Invalid staff, client, or service selected.", "error");
      return;
    }

    const amt = Number(serviceAmount || serviceMember.price);
    const tip = Number(tipAmount || 0);
    const rate = Number(staffMember.commissionRate || 10);
    const commissionVal = Number(((amt * rate) / 100).toFixed(2));
    const totalEarned = Number((commissionVal + tip).toFixed(2));

    const newTrackingRecord = {
      id: `TRK-${Date.now()}`,
      date: customDate ? new Date(customDate).toISOString() : new Date().toISOString(),
      staffId: staffMember.id,
      staffName: staffMember.name,
      clientId: clientMember.id,
      clientName: clientMember.name,
      serviceId: serviceMember.id,
      serviceName: serviceMember.name,
      serviceAmount: amt,
      tipAmount: tip,
      commissionRate: rate,
      commissionEarned: commissionVal,
      totalEarnings: totalEarned,
      notes
    };

    setStaffTracking((prev) => [newTrackingRecord, ...prev]);

    // Update Client Stats
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientMember.id
          ? {
              ...c,
              totalVisits: c.totalVisits + 1,
              totalSpent: c.totalSpent + amt
            }
          : c
      )
    );

    // Auto-create POS Sale if requested
    if (autoCreateSale) {
      const newSale = {
        id: `INV-${new Date().getFullYear()}-${String(sales.length + 1).padStart(3, "0")}`,
        date: new Date().toISOString(),
        clientId: clientMember.id,
        clientName: clientMember.name,
        items: [
          {
            name: serviceMember.name,
            type: "Service",
            price: amt,
            qty: 1,
            staff: staffMember.name
          }
        ],
        subtotal: amt,
        discount: 0,
        tax: 0,
        total: amt,
        paymentMethod: "Cash",
        recordedBy: staffMember.name,
        status: "Paid"
      };
      setSales((prev) => [newSale, ...prev]);
    }

    // Auto Deduct inventory if selected
    if (autoDeductInventoryIds && autoDeductInventoryIds.length > 0) {
      autoDeductInventoryIds.forEach((invId) => {
        stockOutItem(invId, 1, `Used for ${serviceMember.name} (Client: ${clientMember.name})`, staffMember.name);
      });
    }

    showToast(
      `Service recorded for ${staffMember.name}! Earned ₱${commissionVal.toLocaleString()} commission (+₱${tip} tip).`
    );
    return newTrackingRecord;
  };

  // --- APPOINTMENT ACTIONS ---
  const addAppointment = (aptData) => {
    const client = clients.find((c) => c.id === aptData.clientId);
    const service = services.find((s) => s.id === aptData.serviceId);
    const staffMember = staff.find((s) => s.id === aptData.staffId);

    const newApt = {
      ...aptData,
      id: `APT-${Date.now().toString().slice(-4)}`,
      clientName: client ? client.name : "Walk-in Client",
      clientPhone: client ? client.phone : "",
      serviceName: service ? service.name : "Custom Service",
      staffName: staffMember ? staffMember.name : "Unassigned",
      amount: Number(aptData.amount || (service ? service.price : 0)),
      duration: Number(service ? service.duration : 60),
      status: "Scheduled"
    };

    setAppointments((prev) => [newApt, ...prev]);
    showToast(`Appointment booked for ${newApt.clientName} at ${newApt.time}!`);
  };

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    showToast(`Appointment status updated to "${newStatus}".`, "info");
  };

  // Complete Appointment & Auto Track Service
  const completeAppointmentAndTrack = (aptId, tipAmount = 0, autoDeductProductIds = []) => {
    const apt = appointments.find((a) => a.id === aptId);
    if (!apt) return;

    // Record staff service tracking
    recordStaffService({
      staffId: apt.staffId,
      clientId: apt.clientId,
      serviceId: apt.serviceId,
      serviceAmount: apt.amount,
      tipAmount,
      notes: apt.notes,
      autoCreateSale: true,
      autoDeductInventoryIds: autoDeductProductIds
    });

    // Mark appointment as Completed
    updateAppointmentStatus(aptId, "Completed");
  };

  // --- POS / SALES ACTIONS ---
  const recordPOSSale = ({ clientId, items, discount = 0, paymentMethod = "Cash", recordedBy = "Cashier" }) => {
    const client = clients.find((c) => c.id === clientId);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const total = Math.max(0, subtotal - Number(discount));

    const newSale = {
      id: `INV-${new Date().getFullYear()}-${String(sales.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString(),
      clientId: clientId || "WALK-IN",
      clientName: client ? client.name : "Walk-in Customer",
      items,
      subtotal,
      discount: Number(discount),
      tax: 0,
      total,
      paymentMethod,
      recordedBy,
      status: "Paid"
    };

    setSales((prev) => [newSale, ...prev]);

    // Update client total spent
    if (client) {
      setClients((prev) =>
        prev.map((c) => (c.id === clientId ? { ...c, totalSpent: c.totalSpent + total, totalVisits: c.totalVisits + 1 } : c))
      );
    }

    // Auto deduct inventory items if sale includes products
    items.forEach((item) => {
      if (item.type === "Product" && item.productId) {
        stockOutItem(item.productId, item.qty, `Retail Sale #${newSale.id}`, recordedBy);
      }
    });

    showToast(`Transaction ${newSale.id} completed! Total: ₱${total.toLocaleString()}`);
    return newSale;
  };

  // Computed helper counters
  const lowStockCount = inventory.filter((item) => item.currentStock <= item.minStockThreshold).length;
  const todayAppointmentsCount = appointments.filter((a) => a.date === new Date().toISOString().split("T")[0]).length;
  const totalSalesToday = sales
    .filter((s) => s.date.split("T")[0] === new Date().toISOString().split("T")[0])
    .reduce((acc, s) => acc + s.total, 0);

  return (
    <SalonContext.Provider
      value={{
        staff,
        services,
        clients,
        inventory,
        inventoryLogs,
        appointments,
        staffTracking,
        sales,
        activeTab,
        setActiveTab,
        tabletMode,
        setTabletMode,
        themeMode,
        setThemeMode,
        toastMessage,
        showToast,
        lowStockCount,
        todayAppointmentsCount,
        totalSalesToday,
        // Methods
        addStaff,
        updateStaff,
        deleteStaff,
        addService,
        updateService,
        deleteService,
        addClient,
        updateClient,
        deleteClient,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        stockInItem,
        stockOutItem,
        quickRestockLowStockItems,
        recordStaffService,
        addAppointment,
        updateAppointmentStatus,
        completeAppointmentAndTrack,
        recordPOSSale
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) throw new Error("useSalon must be used within a SalonProvider");
  return context;
};
