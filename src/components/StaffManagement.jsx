import ExportButton from "./ExportButton";
import CategorySlider from "./CategorySlider";
import { loadCustomCategories, saveCustomCategories } from "../utils/serviceCategories";
import React, { useState } from "react";
import { useSalon } from "../context/SalonContext";
import {
  UserCheck,
  PlusCircle,
  Award,
  Phone,
  Mail,
  Percent,
  CheckCircle,
  Edit,
  Trash2,
  Upload
} from "lucide-react";

const StaffManagement = () => {
  const { staff, services, addStaff, updateStaff, deleteStaff } = useSalon();
  const [staffCategory, setStaffCategory] = useState("ALL");

  // A stylist belongs to every service category they are assigned to
  const staffCategoriesOf = (member) => [...new Set(services.filter((sv) => (sv.assignedStaff || []).includes(member.id)).map((sv) => sv.category))];
  const [customCategories, setCustomCategories] = useState(loadCustomCategories);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const categoryNames = [...new Set([...services.map((sv) => sv.category), ...customCategories])].filter(Boolean).sort();
  const staffCategories = categoryNames.map((k) => {
    const count = staff.filter((m) => staffCategoriesOf(m).includes(k)).length;
    return { key: k, label: k, count, removable: customCategories.includes(k) && !services.some((sv) => sv.category === k) };
  });

  const addCategory = (name) => {
    const existing = categoryNames.find((c) => c.toLowerCase() === name.toLowerCase());
    if (!existing) {
      const next = [...customCategories, name];
      setCustomCategories(next);
      saveCustomCategories(next);
    }
    setStaffCategory(existing || name);
    setIsAddingCategory(false);
  };

  const removeCategory = (cat) => {
    if (window.confirm('Remove the empty category "' + cat + '"?')) {
      const next = customCategories.filter((c) => c !== cat);
      setCustomCategories(next);
      saveCustomCategories(next);
      if (staffCategory === cat) setStaffCategory("ALL");
    }
  };
  const visibleStaff = staffCategory === "ALL" ? staff : staff.filter((m) => staffCategoriesOf(m).includes(staffCategory));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    name: "",
    role: "Hair Stylist",
    phone: "",
    email: "",
    commissionRate: 15,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    specialties: ["Haircut", "Hair Color"]
  };
  const [formData, setFormData] = useState({ ...emptyForm });

  const openAdd = () => {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setIsAddModalOpen(true);
  };

  const openEdit = (member) => {
    setEditingId(member.id);
    setFormData({ ...emptyForm, ...member });
    setIsAddModalOpen(true);
  };

  // Resize to 256px max and store as a data URL so it persists in localStorage
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 256 / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        setFormData((prev) => ({ ...prev, avatar: canvas.toDataURL("image/jpeg", 0.85) }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (member) => {
    if (window.confirm("Remove " + member.name + " from staff?")) deleteStaff(member.id);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, commissionRate: Number(formData.commissionRate) };
    if (editingId) updateStaff(editingId, payload);
    else addStaff(payload);
    setEditingId(null);
    setIsAddModalOpen(false);
    setFormData({
      name: "",
      role: "Hair Stylist",
      phone: "",
      email: "",
      commissionRate: 15,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      specialties: ["Haircut", "Hair Color"]
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "10px" }}>
            <UserCheck size={26} color="var(--accent-rose)" /> Staff Profiles & Assigned Services
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
            Stylist & technician profiles, commission rates, specializations, and contact details.
          </p>
        </div>

        <div className="header-actions">
          <ExportButton filename="staff" rows={staff} columns={[{ label: "Staff ID", value: (m) => m.id }, { label: "Name", value: (m) => m.name }, { label: "Role", value: (m) => m.role }, { label: "Phone", value: (m) => m.phone }, { label: "Email", value: (m) => m.email }, { label: "Commission Rate (%)", value: (m) => m.commissionRate }, { label: "Specialties", value: (m) => (m.specialties || []).join('; ') }, { label: "Status", value: (m) => m.status }]} />
          <button type="button" className="btn-secondary" onClick={() => setIsAddingCategory(true)}>
            <PlusCircle size={18} /> Add Category
          </button>
          <button className="btn-primary" onClick={openAdd}>
            <PlusCircle size={20} /> Add New Staff Member
          </button>
        </div>
      </div>

      <CategorySlider
        items={staffCategories}
        value={staffCategory}
        onToggle={(cat) => setStaffCategory(staffCategory === cat ? "ALL" : cat)}
        onRemove={removeCategory}
        adding={isAddingCategory}
        onAdd={addCategory}
        onCancelAdd={() => setIsAddingCategory(false)}
      />

      {/* STAFF PROFILES GRID */}
      <div className="staff-grid">
        {visibleStaff.map((member) => (
          <div key={member.id} className="glass-card staff-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <img
                  src={member.avatar}
                  alt={member.name}
                  style={{ width: "54px", height: "54px", borderRadius: "18px", objectFit: "cover", border: "2px solid var(--accent-rose)" }}
                />
                <div>
                  <h3 style={{ fontSize: "18px" }}>{member.name}</h3>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{member.role}</div>
                </div>
                <div className="card-actions">
                  <button type="button" className="icon-btn" title="Edit staff" onClick={() => openEdit(member)}><Edit size={16} /></button>
                  <button type="button" className="icon-btn danger" title="Remove staff" onClick={() => handleDelete(member)}><Trash2 size={16} /></button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Phone size={14} color="var(--accent-rose)" /> {member.phone}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Mail size={14} color="var(--accent-sky)" /> {member.email}
                </div>
              </div>

              <div style={{ padding: "12px", background: "var(--bg-secondary)", borderRadius: "12px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Commission Rate</span>
                  <span className="status-badge active" style={{ fontSize: "12px" }}>
                    <Percent size={12} /> {member.commissionRate}% Commission
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                Specialities / Assigned Services:
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {member.specialties.map((spec) => (
                  <span key={spec} style={{ background: "rgba(138, 111, 124, 0.18)", color: "#6b5566", border: "1px solid rgba(138, 111, 124, 0.4)", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD STAFF MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editingId ? "Edit Staff Member" : "Add New Staff Member"}</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label>Profile Photo</label>
                    <div className="avatar-upload">
                      <img src={formData.avatar} alt="Profile preview" />
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <label className="btn-secondary" style={{ cursor: "pointer", margin: 0 }}>
                          <Upload size={16} /> Upload Image
                          <input type="file" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        <button type="button" className="btn-secondary" onClick={() => setFormData({ ...formData, avatar: emptyForm.avatar })}>
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label>Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Maria Santos"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Role / Position *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Senior Stylist, Barber..."
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Commission Rate (%) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.commissionRate}
                      onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="0917-000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="staff@glowsalon.ph"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  <CheckCircle size={18} /> {editingId ? "Update Profile" : "Save Staff Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffManagement;
