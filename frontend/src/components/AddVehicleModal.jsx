import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddVehicleModal({ editing, onClose, onSave }) {
  const [formData, setFormData] = useState({
    registrationNumber: "",
    name: "",
    type: "Van",
    maxLoadCapacity: "",
    odometer: "",
    acquisitionCost: "",
    status: "Available",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) {
      setFormData({
        registrationNumber: editing.registrationNumber || "",
        name: editing.name || "",
        type: editing.type || "Van",
        maxLoadCapacity: editing.maxLoadCapacity || "",
        odometer: editing.odometer || 0,
        acquisitionCost: editing.acquisitionCost || 0,
        status: editing.status || "Available",
      });
    }
  }, [editing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { registrationNumber, name, type, maxLoadCapacity } = formData;

    if (!registrationNumber || !name || !type || !maxLoadCapacity) {
      setError("Please fill in all required fields (Registration No, Name, Type, Capacity)");
      return;
    }

    if (Number(formData.maxLoadCapacity) <= 0) {
      setError("Capacity must be greater than 0");
      return;
    }

    if (Number(formData.odometer) < 0 || Number(formData.acquisitionCost) < 0) {
      setError("Odometer and Acquisition Cost cannot be negative");
      return;
    }

    onSave(formData);
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 100, padding: "20px"
    }}>
      <div className="live-board" style={{ width: "100%", maxWidth: "500px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div className="board-header">{editing ? "Edit Vehicle" : "Add New Vehicle"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group">
            <label>Registration Number *</label>
            <input
              type="text"
              name="registrationNumber"
              className="form-control"
              placeholder="e.g. MH-12-AB-1234"
              value={formData.registrationNumber}
              onChange={handleChange}
              disabled={editing !== null}
            />
          </div>

          <div className="form-group">
            <label>Model Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Tata Ultra / Mahindra Supro"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label>Vehicle Type *</label>
              <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
                {["Van", "Truck", "Mini", "Bus", "Car", "Other"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Max Load Capacity (kg) *</label>
              <input
                type="number"
                name="maxLoadCapacity"
                className="form-control"
                placeholder="e.g. 1500"
                value={formData.maxLoadCapacity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label>Odometer (km)</label>
              <input
                type="number"
                name="odometer"
                className="form-control"
                placeholder="0"
                value={formData.odometer}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Acquisition Cost (INR)</label>
              <input
                type="number"
                name="acquisitionCost"
                className="form-control"
                placeholder="0"
                value={formData.acquisitionCost}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Vehicle Status</label>
            <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
              {["Available", "On Trip", "In Shop", "Retired"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {editing ? "Save Changes" : "Register Vehicle"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
