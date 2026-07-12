import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Plus, Download, Fuel, CreditCard, Search, FileText } from "lucide-react";

export default function FuelExpenses() {
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [costsSummary, setCostsSummary] = useState({
    fuelCost: 0,
    maintenanceCost: 0,
    otherExpenses: 0,
    totalOperationalCost: 0,
  });

  const [fuelModal, setFuelModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);

  const [fuelForm, setFuelForm] = useState({
    vehicleId: "",
    driverId: "",
    odometer: "",
    fuelQty: "",
    cost: "",
    station: "",
    fuelType: "",
    notes: "",
  });

  const [expenseForm, setExpenseForm] = useState({
    vehicleId: "",
    expenseType: "Toll",
    amount: "",
    date: "",
    description: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedVehicle) {
      fetchCostsSummary(selectedVehicle);
    } else {
      calculateFleetCosts();
    }
  }, [selectedVehicle, fuelLogs, expenses]);

  const fetchData = async () => {
    try {
      const [fuelRes, expenseRes, vehicleRes, driverRes] = await Promise.all([
        api.get("/fuel"),
        api.get("/expenses"),
        api.get("/vehicles"),
        api.get("/trips/drivers/available"), // Reuse existing endpoint
      ]);
      setFuelLogs(fuelRes.data);
      setExpenses(expenseRes.data);
      setVehicles(vehicleRes.data);
      setDrivers(driverRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCostsSummary = async (vehicleId) => {
    try {
      const res = await api.get(`/reports/vehicle-costs/${vehicleId}`);
      setCostsSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateFleetCosts = () => {
    const totalFuel = fuelLogs.reduce((acc, curr) => acc + curr.cost, 0);
    const totalMaint = 0; // Maintenance total could be fetched, but let's summarize based on what we have locally or sum fuel + expenses
    const totalOther = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    
    // Quick estimation for display when no specific vehicle is selected
    setCostsSummary({
      fuelCost: totalFuel,
      maintenanceCost: 0, // placeholder for all fleet maintenance
      otherExpenses: totalOther,
      totalOperationalCost: totalFuel + totalOther,
    });
  };

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { vehicleId, driverId, odometer, fuelQty, cost } = fuelForm;

    if (!vehicleId || !driverId || !odometer || !fuelQty || !cost) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      await api.post("/fuel", fuelForm);
      setFuelForm({
        vehicleId: "",
        driverId: "",
        odometer: "",
        fuelQty: "",
        cost: "",
        station: "",
        fuelType: "",
        notes: "",
      });
      setFuelModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log fuel");
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { vehicleId, expenseType, amount } = expenseForm;

    if (!vehicleId || !expenseType || !amount) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      await api.post("/expenses", expenseForm);
      setExpenseForm({
        vehicleId: "",
        expenseType: "Toll",
        amount: "",
        date: "",
        description: "",
      });
      setExpenseModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense");
    }
  };

  const handleExportCSV = () => {
    const url = `http://localhost:5000/api/reports/export/csv${selectedVehicle ? `?vehicleId=${selectedVehicle}` : ""}`;
    window.open(url, "_blank");
  };

  const handleExportPDF = () => {
    const url = `http://localhost:5000/api/reports/export/pdf${selectedVehicle ? `?vehicleId=${selectedVehicle}` : ""}`;
    window.open(url, "_blank");
  };

  const money = (n) => new Intl.NumberFormat("en-IN").format(n);

  return (
    <div className="page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="page-title">Fuel & Expense Management</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={handleExportCSV} className="btn btn-secondary">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={handleExportPDF} className="btn btn-secondary">
            <FileText size={16} /> Export PDF Report
          </button>
        </div>
      </div>

      {/* FILTER & COST SUMMARY CARD */}
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)" }}>FILTER VEHICLE:</span>
            <select
              className="form-control"
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              style={{ width: "220px" }}
            >
              <option value="">All Vehicles</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.registrationNumber} - {v.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button className="btn btn-primary" onClick={() => { setError(""); setFuelModal(true); }}>
              <Fuel size={16} /> Log Fuel
            </button>
            <button className="btn btn-primary" onClick={() => { setError(""); setExpenseModal(true); }}>
              <CreditCard size={16} /> Add Expense
            </button>
          </div>
        </div>

        {/* COST TILES */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginTop: "8px" }}>
          <div style={{ background: "var(--bg-dark)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>Total Fuel Cost</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--accent-color)", marginTop: "8px" }}>₹{money(costsSummary.fuelCost)}</div>
          </div>
          {selectedVehicle && (
            <div style={{ background: "var(--bg-dark)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>Maintenance Cost</div>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--warning-color)", marginTop: "8px" }}>₹{money(costsSummary.maintenanceCost)}</div>
            </div>
          )}
          <div style={{ background: "var(--bg-dark)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>Other Expenses</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginTop: "8px" }}>₹{money(costsSummary.otherExpenses)}</div>
          </div>
          <div style={{ background: "var(--bg-dark)", border: "2px solid rgba(16, 185, 129, 0.4)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--success-color)", textTransform: "uppercase" }}>Total Operational Cost</div>
            <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--success-color)", marginTop: "8px" }}>₹{money(costsSummary.totalOperationalCost)}</div>
          </div>
        </div>
      </div>

      {/* TABLES ROW */}
      <div className="dashboard-grid">
        {/* FUEL LOGS */}
        <div className="live-board">
          <div className="board-header" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Fuel size={18} /> Fuel Logs
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)", fontSize: "12px" }}>
                  <th style={{ padding: "12px 8px" }}>VEHICLE</th>
                  <th style={{ padding: "12px 8px" }}>DATE</th>
                  <th style={{ padding: "12px 8px" }}>LITERS</th>
                  <th style={{ padding: "12px 8px" }}>FUEL COST</th>
                  <th style={{ padding: "12px 8px" }}>STATION</th>
                </tr>
              </thead>
              <tbody>
                {fuelLogs
                  .filter((log) => !selectedVehicle || log.vehicleId?._id === selectedVehicle)
                  .map((log) => (
                    <tr key={log._id} style={{ borderBottom: "1px solid var(--border-color)", fontSize: "14px" }}>
                      <td style={{ padding: "16px 8px", fontWeight: "600" }}>{log.vehicleId?.registrationNumber || "N/A"}</td>
                      <td style={{ padding: "16px 8px" }}>{new Date(log.date).toLocaleDateString()}</td>
                      <td style={{ padding: "16px 8px" }}>{log.fuelQty} L</td>
                      <td style={{ padding: "16px 8px", fontWeight: "600" }}>₹{money(log.cost)}</td>
                      <td style={{ padding: "16px 8px", color: "var(--text-secondary)" }}>{log.station || "N/A"}</td>
                    </tr>
                  ))}
                {fuelLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "var(--text-secondary)" }}>No fuel logs recorded</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* OTHER EXPENSES */}
        <div className="live-board">
          <div className="board-header" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CreditCard size={18} /> Other Expenses
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)", fontSize: "12px" }}>
                  <th style={{ padding: "12px 8px" }}>VEHICLE</th>
                  <th style={{ padding: "12px 8px" }}>TYPE</th>
                  <th style={{ padding: "12px 8px" }}>DATE</th>
                  <th style={{ padding: "12px 8px" }}>AMOUNT</th>
                  <th style={{ padding: "12px 8px" }}>DESC</th>
                </tr>
              </thead>
              <tbody>
                {expenses
                  .filter((exp) => !selectedVehicle || exp.vehicleId?._id === selectedVehicle)
                  .map((exp) => (
                    <tr key={exp._id} style={{ borderBottom: "1px solid var(--border-color)", fontSize: "14px" }}>
                      <td style={{ padding: "16px 8px", fontWeight: "600" }}>{exp.vehicleId?.registrationNumber || "N/A"}</td>
                      <td style={{ padding: "16px 8px" }}>
                        <span className={`badge badge-${exp.expenseType.toLowerCase()}`} style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#fff" }}>
                          {exp.expenseType}
                        </span>
                      </td>
                      <td style={{ padding: "16px 8px" }}>{new Date(exp.date).toLocaleDateString()}</td>
                      <td style={{ padding: "16px 8px", fontWeight: "600" }}>₹{money(exp.amount)}</td>
                      <td style={{ padding: "16px 8px", color: "var(--text-secondary)" }}>{exp.description || "N/A"}</td>
                    </tr>
                  ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "var(--text-secondary)" }}>No expenses recorded</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FUEL MODAL */}
      {fuelModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 100, padding: "20px"
        }}>
          <div className="live-board" style={{ width: "100%", maxWidth: "500px" }}>
            <div className="board-header">Log Fuel Purchase</div>
            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleFuelSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group">
                <label>Vehicle *</label>
                <select
                  className="form-control"
                  value={fuelForm.vehicleId}
                  onChange={(e) => setFuelForm({ ...fuelForm, vehicleId: e.target.value })}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v._id} value={v._id}>{v.registrationNumber} - {v.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Driver *</label>
                <select
                  className="form-control"
                  value={fuelForm.driverId}
                  onChange={(e) => setFuelForm({ ...fuelForm, driverId: e.target.value })}
                >
                  <option value="">Select Driver</option>
                  {drivers.map((d) => (
                    <option key={d._id} value={d._id}>{d.name} ({d.licenseNumber})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>Odometer Reading (km) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={fuelForm.odometer}
                    onChange={(e) => setFuelForm({ ...fuelForm, odometer: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Fuel Qty (Liters) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={fuelForm.fuelQty}
                    onChange={(e) => setFuelForm({ ...fuelForm, fuelQty: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>Total Cost (INR) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={fuelForm.cost}
                    onChange={(e) => setFuelForm({ ...fuelForm, cost: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Fuel Station</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. HP Petrol"
                    value={fuelForm.station}
                    onChange={(e) => setFuelForm({ ...fuelForm, station: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Log</button>
                <button type="button" className="btn btn-secondary" onClick={() => setFuelModal(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPENSE MODAL */}
      {expenseModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 100, padding: "20px"
        }}>
          <div className="live-board" style={{ width: "100%", maxWidth: "500px" }}>
            <div className="board-header">Record Miscellaneous Expense</div>
            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleExpenseSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group">
                <label>Vehicle *</label>
                <select
                  className="form-control"
                  value={expenseForm.vehicleId}
                  onChange={(e) => setExpenseForm({ ...expenseForm, vehicleId: e.target.value })}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v._id} value={v._id}>{v.registrationNumber} - {v.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>Expense Type *</label>
                  <select
                    className="form-control"
                    value={expenseForm.expenseType}
                    onChange={(e) => setExpenseForm({ ...expenseForm, expenseType: e.target.value })}
                  >
                    {["Toll", "Maintenance", "Insurance", "Parking", "Repair", "Other"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount (INR) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  style={{ resize: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Expense</button>
                <button type="button" className="btn btn-secondary" onClick={() => setExpenseModal(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
