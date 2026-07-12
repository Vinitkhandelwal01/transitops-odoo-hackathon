import { useEffect, useState } from "react";
import "./DriverSafety.css";

const API = "http://localhost:5000/api/driver-safety";

function DriverSafety() {
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    driverName: "",
    licenseNumber: "",
    category: "LMV",
    licenseExpiryDate: "",
    contact: "",
  });

  const fetchDrivers = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setDrivers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const addDriver = async (e) => {
    e.preventDefault();

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setShowModal(false);
    fetchDrivers();
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      fetchDrivers();
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  return (
    <div className="driver-page">
      <div className="driver-header">
        <div>
          <h1>Drivers & Safety Profiles</h1>
          <p>Manage driver records and safety compliance</p>
        </div>

        <button onClick={() => setShowModal(true)}>
          + Add Driver
        </button>
      </div>

      <div className="driver-table">
        <table>
          <thead>
            <tr>
              <th>Driver</th>
              <th>License</th>
              <th>Category</th>
              <th>License Expiry</th>
              <th>Contact</th>
              <th>Trip Completion</th>
              <th>Safety Status</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((driver) => (
              <tr key={driver._id}>
                <td>{driver.driverName}</td>

                <td>{driver.licenseNumber}</td>

                <td>{driver.category}</td>

                <td>
                  {new Date(driver.licenseExpiryDate) < new Date() ? (
                    <span className="expired">
                      {new Date(driver.licenseExpiryDate).toLocaleDateString()} EXPIRED
                    </span>
                  ) : (
                    new Date(driver.licenseExpiryDate).toLocaleDateString()
                  )}
                </td>

                <td>{driver.contact}</td>

                <td>{driver.tripCompletion}%</td>

                <td>
                  <span className="status">
                    {driver.safetyStatus}
                  </span>
                </td>

                <td>
                  <select
                    value={driver.status}
                    onChange={(e) => updateStatus(driver._id, e.target.value)}
                    className={`status-select ${driver.status
                      ?.toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <form className="driver-modal" onSubmit={addDriver}>
            <h2>Add Driver</h2>

            <input
              placeholder="Driver Name"
              required
              onChange={(e) =>
                setForm({ ...form, driverName: e.target.value })
              }
            />

            <input
              placeholder="License Number"
              required
              onChange={(e) =>
                setForm({
                  ...form,
                  licenseNumber: e.target.value,
                })
              }
            />

            <select
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="LMV">LMV</option>
              <option value="HMV">HMV</option>
            </select>

            <input
              type="date"
              required
              onChange={(e) =>
                setForm({
                  ...form,
                  licenseExpiryDate: e.target.value,
                })
              }
            />

            <input
              placeholder="Contact"
              required
              onChange={(e) =>
                setForm({ ...form, contact: e.target.value })
              }
            />

            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button type="submit">Add Driver</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default DriverSafety;