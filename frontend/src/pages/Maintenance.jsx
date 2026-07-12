import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Plus, Search, Calendar, ShieldAlert, Trash2, Pencil, CheckCircle, Ban } from "lucide-react";

export default function Maintenance() {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [formData, setFormData] = useState({
    vehicleId: "",
    serviceType: "",
    maintenanceType: "Scheduled",
    cost: "",
    startDate: "",
    endDate: "",
    odometer: "",
    status: "Scheduled",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchRecords();
    fetchVehicles();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await api.get("/maintenance");
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await api.get("/vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.vehicleId || !formData.serviceType || !formData.cost || !formData.startDate) {
      setError("Please fill in all required fields (Vehicle, Service Type, Cost, Start Date)");
      return false;
    }
    if (Number(formData.cost) < 0) {
      setError("Cost cannot be negative");
      return false;
    }
    if (formData.odometer && Number(formData.odometer) < 0) {
      setError("Odometer cannot be negative");
      return false;
    }
    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End Date cannot precede Start Date");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await api.put(`/maintenance/${editingId}`, formData);
        setSuccess("Maintenance record updated successfully");
      } else {
        await api.post("/maintenance", formData);
        setSuccess("Maintenance record created successfully");
      }

      setFormData({
        vehicleId: "",
        serviceType: "",
        maintenanceType: "Scheduled",
        cost: "",
        startDate: "",
        endDate: "",
        odometer: "",
        status: "Scheduled",
        notes: "",
      });
      setEditingId(null);
      fetchRecords();
      fetchVehicles(); // refresh vehicle list for odometer
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save record");
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    setFormData({
      vehicleId: record.vehicleId?._id || "",
      serviceType: record.serviceType,
      maintenanceType: record.maintenanceType,
      cost: record.cost,
      startDate: record.startDate ? record.startDate.split("T")[0] : "",
      endDate: record.endDate ? record.endDate.split("T")[0] : "",
      odometer: record.odometer || "",
      status: record.status,
      notes: record.notes || "",
    });
    setError("");
    setSuccess("");
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/maintenance/${id}/status`, { status });
      fetchRecords();
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this maintenance record?")) {
      try {
        await api.delete(`/maintenance/${id}`);
        fetchRecords();
        fetchVehicles();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete record");
      }
    }
  };

  const filteredRecords = records.filter((r) => {
    const regNo = r.vehicleId?.registrationNumber || "";
    const name = r.vehicleId?.name || "";
    const service = r.serviceType || "";
    const matchesSearch =
      regNo.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      service.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType ? r.maintenanceType === filterType : true;
    const matchesStatus = filterStatus ? r.status === filterStatus : true;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="page-container">
      <h1 className="page-title">Vehicle Maintenance</h1>

      <div className="dashboard-grid">
        {/* LEFT COLUMN: LOG FORM */}
        <div className="live-board" style={{ height: "fit-content" }}>
          <div className="board-header">
            {editingId ? "Edit Service Record" : "Log Service Record"}
          </div>

          {error && <div className="error-box">{error}</div>}
          {success && (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "8px",
                padding: "16px",
                color: "var(--success-color)",
                fontSize: "14px",
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label>Vehicle *</label>
              <select
                name="vehicleId"
                className="form-control"
                value={formData.vehicleId}
                onChange={handleInputChange}
                disabled={editingId !== null}
              >
                <option value="">Select a Vehicle</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.registrationNumber} - {v.name} ({v.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Service Type (Details) *</label>
              <input
                type="text"
                name="serviceType"
                className="form-control"
                placeholder="e.g. Engine Tuning / Brake Pad replacement"
                value={formData.serviceType}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label>Maintenance Type</label>
                <select
                  name="maintenanceType"
                  className="form-control"
                  value={formData.maintenanceType}
                  onChange={handleInputChange}
                >
                  {["Scheduled", "Preventive", "Corrective", "Other"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Service Cost (INR) *</label>
                <input
                  type="number"
                  name="cost"
                  className="form-control"
                  placeholder="0.00"
                  value={formData.cost}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  className="form-control"
                  value={formData.endDate}
                  onChange={handleInputChange}
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
                  placeholder="Current Reading"
                  value={formData.odometer}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  {["Scheduled", "In Progress", "Completed", "Cancelled"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Service Notes</label>
              <textarea
                name="notes"
                className="form-control"
                rows={3}
                placeholder="Additional notes about the service..."
                value={formData.notes}
                onChange={handleInputChange}
                style={{ resize: "none" }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                {editingId ? "Update Record" : "Save Record"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      vehicleId: "",
                      serviceType: "",
                      maintenanceType: "Scheduled",
                      cost: "",
                      startDate: "",
                      endDate: "",
                      odometer: "",
                      status: "Scheduled",
                      notes: "",
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Workflow Status Bar Legend */}
          <div style={{ marginTop: "24px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
              Workflow Status States
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
              {[
                { name: "Scheduled", desc: "Vehicle booked for service (In Shop)" },
                { name: "In Progress", desc: "Work active (In Shop)" },
                { name: "Completed", desc: "Done (Available)" },
                { name: "Cancelled", desc: "Aborted (Available)" },
              ].map((state) => (
                <div key={state.name} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: "#fff" }}>{state.name}</div>
                  <div style={{ fontSize: "9px", color: "var(--text-secondary)" }}>{state.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SERVICE LOG LIST */}
        <div className="live-board" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="board-header">Service Log</div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
              <input
                className="form-control"
                placeholder="Search reg. no or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", paddingLeft: "36px" }}
              />
              <Search
                size={16}
                color="var(--text-secondary)"
                style={{ position: "absolute", left: "12px", top: "14px" }}
              />
            </div>

            <select
              className="form-control"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ width: "140px" }}
            >
              <option value="">Type: All</option>
              {["Scheduled", "Preventive", "Corrective", "Other"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              className="form-control"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: "140px" }}
            >
              <option value="">Status: All</option>
              {["Scheduled", "In Progress", "Completed", "Cancelled"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Table list */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)", fontSize: "12px" }}>
                  <th style={{ padding: "12px 8px" }}>VEHICLE</th>
                  <th style={{ padding: "12px 8px" }}>SERVICE TYPE</th>
                  <th style={{ padding: "12px 8px" }}>TYPE</th>
                  <th style={{ padding: "12px 8px" }}>COST</th>
                  <th style={{ padding: "12px 8px" }}>START DATE</th>
                  <th style={{ padding: "12px 8px" }}>STATUS</th>
                  <th style={{ padding: "12px 8px" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r) => {
                  const reg = r.vehicleId?.registrationNumber || "Deleted";
                  const date = r.startDate ? new Date(r.startDate).toLocaleDateString() : "N/A";
                  const badgeClass = `badge badge-${r.status.replaceAll(" ", "").toLowerCase()}`;
                  return (
                    <tr key={r._id} style={{ borderBottom: "1px solid var(--border-color)", fontSize: "14px" }}>
                      <td style={{ padding: "16px 8px", fontWeight: "600" }}>{reg}</td>
                      <td style={{ padding: "16px 8px" }}>{r.serviceType}</td>
                      <td style={{ padding: "16px 8px" }}>{r.maintenanceType}</td>
                      <td style={{ padding: "16px 8px", color: "var(--text-primary)" }}>
                        ₹{new Intl.NumberFormat("en-IN").format(r.cost)}
                      </td>
                      <td style={{ padding: "16px 8px" }}>{date}</td>
                      <td style={{ padding: "16px 8px" }}>
                        <span className={badgeClass}>{r.status}</span>
                      </td>
                      <td style={{ padding: "16px 8px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {r.status === "Scheduled" && (
                            <button
                              title="Start Work"
                              onClick={() => handleUpdateStatus(r._id, "In Progress")}
                              className="btn btn-secondary"
                              style={{ padding: "4px 8px", fontSize: "11px" }}
                            >
                              Start
                            </button>
                          )}
                          {r.status === "In Progress" && (
                            <button
                              title="Complete Maintenance"
                              onClick={() => handleUpdateStatus(r._id, "Completed")}
                              className="btn btn-primary"
                              style={{ padding: "4px 8px", fontSize: "11px", backgroundColor: "var(--success-color)" }}
                            >
                              <CheckCircle size={12} /> Complete
                            </button>
                          )}
                          {["Scheduled", "In Progress"].includes(r.status) && (
                            <button
                              title="Cancel"
                              onClick={() => handleUpdateStatus(r._id, "Cancelled")}
                              className="btn btn-secondary"
                              style={{ padding: "4px 8px", fontSize: "11px", color: "var(--danger-color)" }}
                            >
                              <Ban size={12} />
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(r)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--text-secondary)",
                              cursor: "pointer",
                              padding: "4px",
                            }}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(r._id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--danger-color)",
                              cursor: "pointer",
                              padding: "4px",
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "var(--text-secondary)" }}>
                      No service logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
