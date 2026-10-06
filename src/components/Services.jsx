import React, { useState } from "react";
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
  const { services, staff, addService, deleteService } = useSalon();
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Hair Care",
    price: 500,
    duration: 45,
    description: "",
    assignedStaff: []
  });

  const categories = ["ALL", ...new Set(services.map((s) => s.category))];

  const filteredServices = services.filter(
    (s) => selectedCategory === "ALL" || s.category === selectedCategory
  );

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    addService(formData);
    setIsAddModalOpen(false);
    setFormData({ name: "", category: "Hair Care", price: 500, duration: 45, description: "", assignedStaff: [] });
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
            Catalog of salon services, pricing in PHP (₱), duration in minutes, and assigned qualified staff.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle size={20} /> Add New Service
        </button>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="glass-card" style={{ padding: "14px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn-secondary ${selectedCategory === cat ? "btn-primary" : ""}`}
              style={{ height: "38px", fontSize: "13px" }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "ALL" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* SERVICE CATALOG CARDS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
        {filteredServices.map((srv) => (
          <div key={srv.id} className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <span className="status-badge active" style={{ fontSize: "11px", background: "rgba(236, 72, 153, 0.15)", color: "#ec4899", border: "1px solid rgba(236, 72, 153, 0.3)" }}>
                  {srv.category}
                </span>
                <button
                  onClick={() => deleteService(srv.id)}
                  style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}
                  title="Remove Service"
                >
                  <Trash2 size={16} />
                </button>
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
                  ₱{srv.price.toLocaleString()}
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
              <h3 className="modal-title">Add New Service to Catalog</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" }}>✕</button>
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
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Hair Care, Nail Care, Barber..."
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Price (₱) *</label>
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
                  <CheckCircle size={18} /> Save Service
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
