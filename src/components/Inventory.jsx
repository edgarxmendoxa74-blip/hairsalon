import ExportButton from "./ExportButton";
import { useCurrency } from "../context/CurrencyContext";
import React, { useState } from "react";
import { useSalon } from "../context/SalonContext";
import {
  Package,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Search,
  CheckCircle,
  History,
  Boxes,
  Zap,
  Tag,
  Edit,
  Trash2
} from "lucide-react";

const Inventory = () => {
  const { money } = useCurrency();
  const {
    inventory,
    inventoryLogs,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    stockInItem,
    stockOutItem,
    quickRestockLowStockItems,
    lowStockCount
  } = useSalon();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [lowOnly, setLowOnly] = useState(false);
  const [activeTabSub, setActiveTabSub] = useState("catalog"); // 'catalog' vs 'logs'

  // Modals state
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [isStockOutModalOpen, setIsStockOutModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const emptyItem = {
    name: "",
    category: "Hair Color & Bleach",
    unit: "Tub",
    currentStock: 10,
    minStockThreshold: 5,
    unitCost: 500,
    retailPrice: 0,
    supplier: ""
  };
  const [itemFormData, setItemFormData] = useState({ ...emptyItem });

  const [movementQty, setMovementQty] = useState(1);
  const [movementReason, setMovementReason] = useState("");

  const categories = ["ALL", ...new Set(inventory.map((item) => item.category))];

  const filteredInventory = inventory.filter((item) => {
    const matchesCat = selectedCategory === "ALL" ? true : item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLow = !lowOnly || item.currentStock <= item.minStockThreshold;
    return matchesCat && matchesSearch && matchesLow;
  });

  // Calculate stock valuation
  const totalStockValuation = inventory.reduce((acc, item) => acc + item.currentStock * item.unitCost, 0);

  const openAddItem = () => {
    setEditingId(null);
    setItemFormData({ ...emptyItem });
    setIsAddItemModalOpen(true);
  };

  const openEditItem = (item) => {
    setEditingId(item.id);
    setItemFormData({ ...emptyItem, ...item });
    setIsAddItemModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    if (window.confirm("Remove " + item.name + " from inventory?")) deleteInventoryItem(item.id);
  };

  const handleCreateItemSubmit = (e) => {
    e.preventDefault();
    if (editingId) updateInventoryItem(editingId, itemFormData);
    else addInventoryItem(itemFormData);
    setEditingId(null);
    setIsAddItemModalOpen(false);
    setItemFormData({ ...emptyItem });
  };

  const handleStockInSubmit = (e) => {
    e.preventDefault();
    if (selectedProduct) {
      stockInItem(selectedProduct.id, movementQty, movementReason, "Manager Admin");
      setIsStockInModalOpen(false);
      setSelectedProduct(null);
      setMovementQty(1);
      setMovementReason("");
    }
  };

  const handleStockOutSubmit = (e) => {
    e.preventDefault();
    if (selectedProduct) {
      const success = stockOutItem(selectedProduct.id, movementQty, movementReason, "Manager Admin");
      if (success !== false) {
        setIsStockOutModalOpen(false);
        setSelectedProduct(null);
        setMovementQty(1);
        setMovementReason("");
      }
    }
  };

  return (
    <div className="inventory-page" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* HEADER BAR WITH ACTION BUTTONS */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Package size={26} color="#8a6f7c" /> Inventory Management & Stock Control
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
            Track product quantities, execute Stock In / Stock Out adjustments, and monitor low-stock threshold warnings.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {activeTabSub === "catalog" ? (
            <ExportButton filename="inventory-catalog" rows={filteredInventory} columns={[{ label: "Product ID", value: (i) => i.id }, { label: "Name", value: (i) => i.name }, { label: "Category", value: (i) => i.category }, { label: "Unit", value: (i) => i.unit }, { label: "Current Stock", value: (i) => i.currentStock }, { label: "Min Threshold", value: (i) => i.minStockThreshold }, { label: "Status", value: (i) => (i.currentStock === 0 ? 'Out of Stock' : i.currentStock <= i.minStockThreshold ? 'Low Stock' : 'In Stock') }, { label: "Unit Cost (PHP)", value: (i) => i.unitCost }, { label: "Retail Price (PHP)", value: (i) => i.retailPrice }, { label: "Supplier", value: (i) => i.supplier }]} />
          ) : (
            <ExportButton filename="inventory-movements" label="Export Log" rows={inventoryLogs} columns={[{ label: "Log ID", value: (l) => l.id }, { label: "Date & Time", value: (l) => l.date }, { label: "Product", value: (l) => l.productName }, { label: "Type", value: (l) => l.type }, { label: "Quantity", value: (l) => l.quantity }, { label: "Previous Stock", value: (l) => l.previousStock }, { label: "New Stock", value: (l) => l.newStock }, { label: "Handled By", value: (l) => l.staffName }, { label: "Reason", value: (l) => l.reason }]} />
          )}
          <button className="btn-secondary" onClick={() => quickRestockLowStockItems(10)}>
            <Zap size={18} color="#f59e0b" /> Restock Low Stock (+10)
          </button>
          <button className="btn-primary" onClick={openAddItem}>
            <PlusCircle size={20} /> Add New Product
          </button>
        </div>
      </div>

      {/* DYNAMIC LOW STOCK ALERT BANNER */}
      {lowStockCount > 0 && (
        <div className="glass-card highlight-focus" style={{ borderColor: "var(--accent-gold)", background: "var(--accent-mint)", padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ background: "rgba(217, 119, 6, 0.15)", border: "1px solid var(--accent-gold)", padding: "12px", borderRadius: "14px", color: "var(--accent-gold)" }}>
                <AlertTriangle size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: "17px", color: "var(--accent-forest)" }}>
                  Warning: {lowStockCount} Item{lowStockCount > 1 ? "s" : ""} Below Minimum Threshold!
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-main)", marginTop: "2px" }}>
                  Certain salon products require immediate restocking to prevent service interruptions.
                </p>
              </div>
            </div>
            <button className="btn-secondary" style={{ borderColor: "var(--accent-gold)", color: "var(--accent-forest)" }} onClick={() => { setLowOnly(true); setSelectedCategory("ALL"); setSearchTerm(""); setActiveTabSub("catalog"); }}>
              Review Items
            </button>
          </div>
        </div>
      )}

      {lowOnly && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px" }}>
          <span>Showing {filteredInventory.length} low-stock item{filteredInventory.length === 1 ? "" : "s"} only</span>
          <button type="button" className="btn-secondary" onClick={() => setLowOnly(false)}>Show all items</button>
        </div>
      )}

      {/* KPI STAT CARDS */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon emerald">
            <Boxes size={26} />
          </div>
          <div className="stat-info">
            <div className="label">Total Products In Catalog</div>
            <div className="value">{inventory.length}</div>
            <div style={{ fontSize: "12px", color: "var(--accent-emerald)", marginTop: "2px", fontWeight: 600 }}>
              Across {categories.length - 1} categories
            </div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon amber">
            <AlertTriangle size={26} />
          </div>
          <div className="stat-info">
            <div className="label">Low-Stock Items</div>
            <div className="value" style={{ color: lowStockCount > 0 ? "#f59e0b" : "var(--text-main)" }}>
              {lowStockCount}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
              Needs supplier order
            </div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon sky">
            <Tag size={26} />
          </div>
          <div className="stat-info">
            <div className="label">Total Inventory Valuation</div>
            <div className="value">{money(totalStockValuation)}</div>
            <div style={{ fontSize: "12px", color: "var(--accent-sky)", marginTop: "2px", fontWeight: 600 }}>
              At unit cost basis
            </div>
          </div>
        </div>
      </div>

      {/* SUB TAB CONTROLS (Catalog vs Movement History Logs) */}
      <div className="glass-card" style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className={`btn-secondary ${activeTabSub === "catalog" ? "btn-primary" : ""}`}
              style={{ height: "40px" }}
              onClick={() => setActiveTabSub("catalog")}
            >
              <Package size={16} /> Products Catalog ({inventory.length})
            </button>
            <button
              className={`btn-secondary ${activeTabSub === "logs" ? "btn-primary" : ""}`}
              style={{ height: "40px" }}
              onClick={() => setActiveTabSub("logs")}
            >
              <History size={16} /> Stock In / Out Audit Log ({inventoryLogs.length})
            </button>
          </div>

          {activeTabSub === "catalog" && (
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Search product..."
                  className="form-control"
                  style={{ paddingLeft: "36px", height: "40px", width: "220px" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="form-control"
                style={{ height: "40px", width: "200px" }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat === "ALL" ? "All Categories" : cat}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* VIEW SUB 1: PRODUCTS CATALOG & STOCK CARDS TABLE */}
      {activeTabSub === "catalog" && (
        <div className="glass-card">
          <div className="box-grid">
            {filteredInventory.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                No inventory items found.
              </div>
            ) : (
              filteredInventory.map((item) => {
                const isLowStock = item.currentStock <= item.minStockThreshold;
                const isOutOfStock = item.currentStock === 0;

                return (
                  <div key={item.id} className="log-item" style={isLowStock ? { background: "rgba(245, 158, 11, 0.08)" } : undefined}>
                    <div className="log-item-head">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "15px" }}>{item.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>ID: {item.id} • {item.category}</div>
                      </div>
                      {isOutOfStock ? (
                        <span className="status-badge outstock">Out of Stock</span>
                      ) : isLowStock ? (
                        <span className="status-badge lowstock">Low Stock</span>
                      ) : (
                        <span className="status-badge instock">In Stock</span>
                      )}
                    </div>
                    <div className="log-item-body">
                      <div><span>Current Stock</span><b style={{ fontSize: "15px" }}>{item.currentStock} {item.unit}s</b></div>
                      <div><span>Min Threshold</span><b>{item.minStockThreshold} {item.unit}s</b></div>
                      <div><span>Unit Cost</span><b>{money(item.unitCost)}</b></div>
                      <div><span>Retail Price</span><b style={{ color: item.retailPrice > 0 ? "var(--accent-emerald)" : "var(--text-dim)" }}>{item.retailPrice > 0 ? `${money(item.retailPrice)}` : "Salon Use"}</b></div>
                      <div><span>Supplier</span><b>{item.supplier}</b></div>
                    </div>
                    <div className="row-actions apt-actions">
                      <button className="btn-secondary" style={{ height: "38px", fontSize: "13px", color: "#4d7a4a" }} onClick={() => { setSelectedProduct(item); setIsStockInModalOpen(true); }} title="Stock In / Restock">
                        <TrendingUp size={14} /> Stock In
                      </button>
                      <button className="btn-secondary" style={{ height: "38px", fontSize: "13px", color: "#f87171" }} onClick={() => { setSelectedProduct(item); setIsStockOutModalOpen(true); }} title="Stock Out / Usage">
                        <TrendingDown size={14} /> Stock Out
                      </button>
                      <button type="button" className="icon-btn" title="Edit product" onClick={() => openEditItem(item)}><Edit size={16} /></button>
                      <button type="button" className="icon-btn danger" title="Remove product" onClick={() => handleDeleteItem(item)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW SUB 2: STOCK MOVEMENT LOGS TABLE */}
      {activeTabSub === "logs" && (
        <div className="glass-card">
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Product Name</th>
                  <th>Action Type</th>
                  <th>Qty Changed</th>
                  <th>Stock Change</th>
                  <th>Logged By</th>
                  <th>Reason / Note</th>
                </tr>
              </thead>
              <tbody>
                {inventoryLogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                      No inventory movements logged yet.
                    </td>
                  </tr>
                ) : (
                  inventoryLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                        {new Date(log.date).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td style={{ fontWeight: 700 }}>{log.productName}</td>
                      <td>
                        {log.type === "STOCK_IN" ? (
                          <span className="status-badge completed">
                            <TrendingUp size={12} /> Stock In
                          </span>
                        ) : (
                          <span className="status-badge outstock">
                            <TrendingDown size={12} /> Stock Out
                          </span>
                        )}
                      </td>
                      <td style={{ fontWeight: 800, fontSize: "15px", color: log.type === "STOCK_IN" ? "#4d7a4a" : "#f87171" }}>
                        {log.type === "STOCK_IN" ? `+${log.quantity}` : `-${log.quantity}`}
                      </td>
                      <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                        {log.previousStock} ➔ <strong style={{ color: "var(--text-main)" }}>{log.newStock}</strong>
                      </td>
                      <td style={{ fontWeight: 600 }}>{log.staffName}</td>
                      <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>{log.reason}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW PRODUCT */}
      {isAddItemModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editingId ? "Edit Product" : "Add New Product to Inventory"}</h3>
              <button type="button" onClick={() => setIsAddItemModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <form onSubmit={handleCreateItemSubmit}>
              <div className="modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label>Product Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Keratin Treatment Bottle 1000ml"
                      value={itemFormData.name}
                      onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Hair Treatments"
                      value={itemFormData.category}
                      onChange={(e) => setItemFormData({ ...itemFormData, category: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Packaging Unit *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Bottle, Tub, Box, Piece..."
                      value={itemFormData.unit}
                      onChange={(e) => setItemFormData({ ...itemFormData, unit: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Initial Stock Quantity *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={itemFormData.currentStock}
                      onChange={(e) => setItemFormData({ ...itemFormData, currentStock: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Low-Stock Threshold Alert *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={itemFormData.minStockThreshold}
                      onChange={(e) => setItemFormData({ ...itemFormData, minStockThreshold: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Unit Cost Price (₱ PHP) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={itemFormData.unitCost}
                      onChange={(e) => setItemFormData({ ...itemFormData, unitCost: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Retail Selling Price (₱ PHP) (0 if internal)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={itemFormData.retailPrice}
                      onChange={(e) => setItemFormData({ ...itemFormData, retailPrice: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label>Supplier Name / Contact</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. BeautySupply Co. PH"
                      value={itemFormData.supplier}
                      onChange={(e) => setItemFormData({ ...itemFormData, supplier: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAddItemModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  <CheckCircle size={18} /> {editingId ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: STOCK IN (RESTOCK) */}
      {isStockInModalOpen && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={20} /> Stock In / Restock: {selectedProduct.name}
              </h3>
              <button onClick={() => setIsStockInModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <form onSubmit={handleStockInSubmit}>
              <div className="modal-body">
                <div style={{ background: "var(--bg-input)", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px", fontSize: "13px" }}>
                  Current Stock: <strong>{selectedProduct.currentStock} {selectedProduct.unit}s</strong>
                </div>

                <div className="form-group">
                  <label>Quantity to Add (+)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={movementQty}
                    onChange={(e) => setMovementQty(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Supplier / Batch / Invoice Note</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Restock batch #9921 from L'Oreal PH"
                    value={movementReason}
                    onChange={(e) => setMovementReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsStockInModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ background: "linear-gradient(135deg, #8a6f7c, #6b5566)" }}>
                  Confirm Stock In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: STOCK OUT (USAGE / DEDUCTION) */}
      {isStockOutModalOpen && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: "#f87171", display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingDown size={20} /> Stock Out / Deduct: {selectedProduct.name}
              </h3>
              <button onClick={() => setIsStockOutModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <form onSubmit={handleStockOutSubmit}>
              <div className="modal-body">
                <div style={{ background: "var(--bg-input)", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px", fontSize: "13px" }}>
                  Current Stock: <strong>{selectedProduct.currentStock} {selectedProduct.unit}s</strong>
                </div>

                <div className="form-group">
                  <label>Quantity to Deduct (-)</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct.currentStock}
                    className="form-control"
                    value={movementQty}
                    onChange={(e) => setMovementQty(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Reason for Deduction</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Used in Balayage Service / Damaged bottle..."
                    value={movementReason}
                    onChange={(e) => setMovementReason(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsStockOutModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
                  Confirm Stock Out
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Inventory;
