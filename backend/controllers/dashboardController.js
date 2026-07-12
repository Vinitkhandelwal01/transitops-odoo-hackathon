const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");

// ==========================================================
// @route   GET /api/dashboard/kpis
// @desc    Returns the 7 KPI cards shown on the Dashboard
// ==========================================================
exports.getKpis = async (req, res) => {
  try {
    const [
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      totalVehicles,
      activeTrips,
      pendingTrips,
      driversOnDuty,
    ] = await Promise.all([
      Vehicle.countDocuments({ status: "On Trip" }),
      Vehicle.countDocuments({ status: "Available" }),
      Vehicle.countDocuments({ status: "In Shop" }),
      Vehicle.countDocuments({}),
      Trip.countDocuments({ status: "Dispatched" }),
      Trip.countDocuments({ status: "Draft" }),
      Driver.countDocuments({ status: "On Trip" }),
    ]);

    // Fleet Utilization % = vehicles currently on trip / total non-retired vehicles
    const retiredCount = await Vehicle.countDocuments({ status: "Retired" });
    const usableFleet = totalVehicles - retiredCount;
    const fleetUtilization = usableFleet > 0 ? Math.round((activeVehicles / usableFleet) * 100) : 0;

    return res.status(200).json({
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization, // number, e.g. 81 (frontend appends "%")
    });
  } catch (error) {
    console.error("Dashboard KPIs error:", error);
    return res.status(500).json({ message: "Failed to load dashboard KPIs" });
  }
};

// ==========================================================
// @route   GET /api/dashboard/recent-trips
// @desc    Latest trips for the Dashboard table
// Query:   ?limit=5 (optional, default 5)
// ==========================================================
exports.getRecentTrips = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const trips = await Trip.find()
      .populate("vehicle", "registrationNumber name")
      .populate("driver", "name")
      .sort({ createdAt: -1 })
      .limit(limit);

    const formatted = trips.map((trip) => ({
      id: trip.tripNumber,
      vehicle: trip.vehicle?.registrationNumber || trip.vehicle?.name || "--",
      driver: trip.driver?.name || "--",
      status: trip.status,
      eta:
        trip.status === "Draft"
          ? "Awaiting vehicle"
          : trip.status === "Completed"
          ? "--"
          : "In progress",
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Recent trips error:", error);
    return res.status(500).json({ message: "Failed to load recent trips" });
  }
};

// ==========================================================
// @route   GET /api/dashboard/vehicle-status
// @desc    Vehicle status breakdown (Available / On Trip / In Shop / Retired)
//          Returns counts + percentage (of total fleet) for the status bars
// ==========================================================
exports.getVehicleStatus = async (req, res) => {
  try {
    const statuses = ["Available", "On Trip", "In Shop", "Retired"];

    const total = await Vehicle.countDocuments({});

    const counts = await Promise.all(
      statuses.map((status) => Vehicle.countDocuments({ status }))
    );

    const breakdown = statuses.map((label, i) => ({
      label,
      count: counts[i],
      percent: total > 0 ? Math.round((counts[i] / total) * 100) : 0,
    }));

    return res.status(200).json({ total, breakdown });
  } catch (error) {
    console.error("Vehicle status error:", error);
    return res.status(500).json({ message: "Failed to load vehicle status" });
  }
};