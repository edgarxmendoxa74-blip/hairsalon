import ExportButton from "./ExportButton";
import { useCurrency } from "../context/CurrencyContext";
import React, { useState } from "react";
import CategorySlider from "./CategorySlider";
import { loadCustomCategories, saveCustomCategories as persistCategories } from "../utils/serviceCategories";
import { useSalon } from "../context/SalonContext";
import {
  Scissors,
  PlusCircle,
  Clock,
  DollarSign,
  Tag,
  Trash2,
  Edit,
  CheckCircle
} from "lucide-react";

const Services = () => {
  const { money } = useCurrency();
  const { services, staff, addService, updateService, deleteService } = useSalon();
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const emptyForm = {
    name: "",
    category: "Hair Care",
    price: 500,
    duration: 45,
    description: "",
    assignedStaff: []
  };
  const [formData, setFormData] = useState({ ...emptyForm });

  // Categories created here stay even before a service uses them
  const [customCategories, setCustomCategories] = useState(loadCustomCategories);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isNewCategoryInForm, setIsNewCategoryInForm] = useState(false);

  const allCategories = [...new Set([...services.map((s) => s.category), ...customCategories])].filter(Boolean);

  const saveCustomCategories = (list) => {
    setCustomCategories(list);
    persistCategories(list);
  };

  const addCategory = (name) => {
    const existing = allCategories.find((c) => c.toLowerCase() === name.toLowerCase());
    if (!existing) saveCustomCategories([...customCategories, name]);
    setSelectedCategory(existing || name);
    setIsAddingCategory(false);
  };

  const removeCategory = (cat) => {
    if (window.confirm('Remove the empty category "' + cat + '"?')) {
      saveCustomCategories(customCategories.filter((c) => c !== cat));
      if (selectedCategory === cat) setSelectedCategory("ALL");
    }
  };

  const filteredServices = services.filter(
    (s) => selectedCategory === "ALL" || s.category === selectedCategory
  );

  const openAdd = () => {
    setIsNewCategoryInForm(false);
    setEditingId(null);
    setFormData({ ...emptyForm });
    setIsAddModalOpen(true);
  };

  const openEdit = (srv) => {
    setIsNewCategoryInForm(false);
    setEditingId(srv.id);
    setFormData({ ...emptyForm, ...srv });
    setIsAddModalOpen(true);
  };

  const handleDelete = (srv) => {
    if (window.confirm('Remove "' + srv.name + '" from the service menu?')) deleteService(srv.id);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const category = (formData.category || "").trim();
    const known = allCategories.find((c) => c.toLowerCase() === category.toLowerCase());
    const payload = { ...formData, category: known || category };
    if (!known && category) saveCustomCategories([...customCategories, category]);
    if (editingId) updateService(editingId, payload);
    else addService(payload);
    setIsNewCategoryInForm(false);
    setEditingId(null);
    setIsAddModalOpen(false);
    setFormData({ ...emptyForm });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Scissors size={26} color="var(--accent-pink)" /> Service List, Pricing & Duration
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
            Catalog of salon services, pricing in PHP or MOP (switch at the top right), duration in minutes, and assigned qualified staff.
          </p>
        </div>

        <div className="header-actions">
          <ExportButton filename="services" rows={filteredServices} columns={[{ label: "Service ID", value: (v) => v.id }, { label: "Name", value: (v) => v.name }, { label: "Category", value: (v) => v.category }, { label: "Price (PHP)", value: (v) => v.price }, { label: "Duration (min)", value: (v) => v.duration }, { label: "Description", value: (v) => v.description }]} />
          <button type="button" className="btn-secondary" onClick={() => setIsAddingCategory(true)}>
            <PlusCircle size={18} /> Add Category
          </button>
          <button className="btn-primary" onClick={openAdd}>
            <PlusCircle size={20} /> Add New Service
          </button>
        </div>
      </div>

      {/* CATEGORY SLIDER */}
      <CategorySlider
        items={allCategories.map((cat) => {
          const count = services.filter((sv) => sv.category === cat).length;
          return { key: cat, label: cat, count, removable: customCategories.includes(cat) && count === 0 };
        })}
        value={selectedCategory}
        onToggle={(cat) => setSelectedCategory(selectedCategory === cat ? "ALL" : cat)}
        onRemove={removeCategory}
        adding={isAddingCategory}
        onAdd={addCategory}
        onCancelAdd={() => setIsAddingCategory(false)}
      />

      {/* SERVICE CATALOG CARDS GRID */}
      <div key={selectedCategory} className="service-grid slide-in">
        {filteredServices.map((srv) => (
          <div key={srv.id} className="glass-card service-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <span className="status-badge active" style={{ fontSize: "11px", background: "rgba(138, 111, 124, 0.18)", color: "#6b5566", border: "1px solid rgba(138, 111, 124, 0.4)" }}>
                  {srv.category}
                </span>
                <div className="card-actions">
                  <button type="button" className="icon-btn" title="Edit service" onClick={() => openEdit(srv)}><Edit size={16} /></button>
                  <button type="button" className="icon-btn danger" title="Remove service" onClick={() => handleDelete(srv)}><Trash2 size={16} /></button>
                </div>
              </div>

              <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>{srv.name}</h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
                {srv.description}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--bg-secondary)", borderRadius: "12px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                  <Clock size={16} color="var(--accent-sky)" /> {srv.duration} mins
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent-emerald)" }}>
                  {money(srv.price)}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                Qualified Stylists:
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {srv.assignedStaff && srv.assignedStaff.length > 0 ? (
                  srv.assignedStaff.map((stfId) => {
                    const stf = staff.find((s) => s.id === stfId);
                    return (
                      <span key={stfId} style={{ background: "var(--bg-input)", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>
                        {stf ? stf.name : stfId}
                      </span>
                    );
                  })
                ) : (
                  <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>All Stylists</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE SERVICE MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editingId ? "Edit Service" : "Add New Service to Catalog"}</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label>Service Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Hair Rebonding & Gloss"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    {isNewCategoryInForm ? (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input
                          autoFocus
                          type="text"
                          className="form-control"
                          placeholder="New category name"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          required
                        />
                        <button type="button" className="btn-secondary" onClick={() => { setIsNewCategoryInForm(false); setFormData({ ...formData, category: allCategories[0] || "" }); }}>Cancel</button>
                      </div>
                    ) : (
                      <select
                        className="form-control"
                        value={allCategories.includes(formData.category) ? formData.category : ""}
                        onChange={(e) => {
                          if (e.target.value === "__new") { setIsNewCategoryInForm(true); setFormData({ ...formData, category: "" }); }
                          else setFormData({ ...formData, category: e.target.value });
                        }}
                        required
                      >
                        {!allCategories.includes(formData.category) && <option value="" disabled>Select category</option>}
                        {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                        <option value="__new">+ Add new category…</option>
                      </select>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Price (₱ PHP) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Estimated Duration (Minutes) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Brief details of what is included in this service..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  <CheckCircle size={18} /> {editingId ? "Update Service" : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Services;
