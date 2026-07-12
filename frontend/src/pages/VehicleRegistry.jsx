import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../services/api";
import AddVehicleModal from "../components/AddVehicleModal";
import "./VehicleRegistry.css";

export default function VehicleRegistry() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get("/vehicles", {
        params: {
          search,
          type,
          status
        }
      });

      setVehicles(data);
    } catch (error) {
      console.error("LOAD VEHICLES ERROR:", error);
      console.error(
        "BACKEND RESPONSE:",
        error.response?.data
      );
    }
  };

  useEffect(() => {
    load();
  }, [search, type, status]);

  const save = async (form) => {
    try {
      console.log("VEHICLE FORM:", form);

      if (editing) {
        await api.put(
          `/vehicles/${editing._id}`,
          form
        );
      } else {
        await api.post("/vehicles", form);
      }

      setModal(false);
      setEditing(null);

      await load();
    } catch (error) {
      console.error("SAVE VEHICLE ERROR:", error);
      console.error(
        "BACKEND RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to save vehicle"
      );
    }
  };

  const remove = async (vehicle) => {
    const confirmed = confirm(
      `Delete ${vehicle.registrationNumber}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/vehicles/${vehicle._id}`
      );

      await load();
    } catch (error) {
      console.error("DELETE VEHICLE ERROR:", error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to delete vehicle"
      );
    }
  };

  const money = (number) => {
    return new Intl.NumberFormat("en-IN").format(
      number || 0
    );
  };

  return (
    <main className="content">
      <section className="registry">

        <div className="registry-header">
          <h1>Vehicle Registry</h1>

          <p>
            Manage fleet vehicles and operational status
          </p>
        </div>

        <div className="filters">

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >
            <option value="">
              Type: All
            </option>

            {[
              "Van",
              "Truck",
              "Mini",
              "Bus",
              "Car",
              "Other"
            ].map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="">
              Status: All
            </option>

            {[
              "Available",
              "On Trip",
              "In Shop",
              "Retired"
            ].map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <input
            placeholder="Search reg. no..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button
            className="add"
            onClick={() => {
              setEditing(null);
              setModal(true);
            }}
          >
            <Plus size={17} />

            Add Vehicle
          </button>

        </div>

        <table>
          <thead>
            <tr>
              <th>REG. NO. / UNIQUE</th>
              <th>NAME/MODEL</th>
              <th>TYPE</th>
              <th>CAPACITY</th>
              <th>ODOMETER</th>
              <th>ACQ. COST</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle._id}>

                <td>
                  {vehicle.registrationNumber}
                </td>

                <td>
                  {vehicle.name}
                </td>

                <td>
                  {vehicle.type}
                </td>

                <td>
                  {vehicle.maxLoadCapacity} kg
                </td>

                <td>
                  {money(vehicle.odometer)}
                </td>

                <td>
                  ₹{money(vehicle.acquisitionCost)}
                </td>

                <td>
                  <span
                    className={`badge ${
                      vehicle.status
                        ?.replaceAll(" ", "")
                        .toLowerCase()
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </td>

                <td>
                  <button
                    className="icon"
                    onClick={() => {
                      setEditing(vehicle);
                      setModal(true);
                    }}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="icon danger"
                    onClick={() =>
                      remove(vehicle)
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        <p className="rule">
          Rule: Registration No. must be unique •
          Retired/In Shop vehicles are hidden from Trip
          Dispatcher
        </p>

      </section>

      {modal && (
        <AddVehicleModal
          editing={editing}
          onClose={() => {
            setModal(false);
            setEditing(null);
          }}
          onSave={save}
        />
      )}

    </main>
  );
}