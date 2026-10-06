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
  Edit
} from "lucide-react";

const StaffManagement = () => {
  const { staff, addStaff, updateStaff } = useSalon();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "Hair Stylist",
    phone: "",
    email: "",
    commissionRate: 15,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    specialties: ["Haircut", "Hair Color"]
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addStaff(formData);
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

        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle size={20} /> Add New Staff Member
        </button>
      </div>

      {/* STAFF PROFILES GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {staff.map((member) => (
          <div key={member.id} className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
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
                  <span key={spec} style={{ background: "rgba(244, 63, 94, 0.15)", color: "#f43f5e", border: "1px solid rgba(244, 63, 94, 0.3)", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>
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
              <h3 className="modal-title">Add New Staff Member</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
                  <CheckCircle size={18} /> Save Staff Profile
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
