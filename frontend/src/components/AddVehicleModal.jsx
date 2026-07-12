import { useEffect, useState } from "react";

export default function AddVehicleModal({
  editing,
  onClose,
  onSave
}) {
  const [form, setForm] = useState({
    registrationNumber: "",
    name: "",
    type: "Van",
    maxLoadCapacity: "",
    odometer: "",
    acquisitionCost: "",
    status: "Available"
  });

  useEffect(() => {
    if (editing) {
      setForm({
        registrationNumber: editing.registrationNumber || "",
        name: editing.name || "",
        type: editing.type || "Van",
        maxLoadCapacity: editing.maxLoadCapacity || "",
        odometer: editing.odometer || "",
        acquisitionCost: editing.acquisitionCost || "",
        status: editing.status || "Available"
      });
    }
  }, [editing]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onSave({
      ...form,
      maxLoadCapacity: Number(form.maxLoadCapacity),
      odometer: Number(form.odometer),
      acquisitionCost: Number(form.acquisitionCost)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          {editing ? "Edit Vehicle" : "Add Vehicle"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="registrationNumber"
            placeholder="Registration Number"
            value={form.registrationNumber}
            onChange={handleChange}
            required
          />

          <input
            name="name"
            placeholder="Vehicle Name / Model"
            value={form.name}
            onChange={handleChange}
            required
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            {["Van", "Truck", "Mini", "Bus", "Car", "Other"].map(
              (item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              )
            )}
          </select>

          <input
            type="number"
            name="maxLoadCapacity"
            placeholder="Capacity (kg)"
            value={form.maxLoadCapacity}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="odometer"
            placeholder="Odometer"
            value={form.odometer}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="acquisitionCost"
            placeholder="Acquisition Cost"
            value={form.acquisitionCost}
            onChange={handleChange}
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            {["Available", "On Trip", "In Shop", "Retired"].map(
              (item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              )
            )}
          </select>

          <div className="modal-actions">
            <button type="submit">
              {editing ? "Update Vehicle" : "Add Vehicle"}
            </button>

            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}