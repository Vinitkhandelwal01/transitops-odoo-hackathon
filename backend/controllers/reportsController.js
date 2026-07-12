const mongoose = require("mongoose");
const FuelLog = require("../models/FuelLog");
const Maintenance = require("../models/Maintenance");
const Expense = require("../models/Expense");
const Vehicle = require("../models/Vehicle");
const PDFDocument = require("pdfkit");

// Get operational costs summary for a specific vehicle
exports.getVehicleCosts = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    const vId = new mongoose.Types.ObjectId(vehicleId);

    const fuelCostRes = await FuelLog.aggregate([
      { $match: { vehicleId: vId } },
      { $group: { _id: null, total: { $sum: "$cost" } } },
    ]);
    const maintCostRes = await Maintenance.aggregate([
      { $match: { vehicleId: vId } },
      { $group: { _id: null, total: { $sum: "$cost" } } },
    ]);
    const expenseCostRes = await Expense.aggregate([
      { $match: { vehicleId: vId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const fuelCost = fuelCostRes[0]?.total || 0;
    const maintenanceCost = maintCostRes[0]?.total || 0;
    const otherExpenses = expenseCostRes[0]?.total || 0;
    const totalOperationalCost = fuelCost + maintenanceCost + otherExpenses;

    res.json({
      vehicleId,
      fuelCost,
      maintenanceCost,
      otherExpenses,
      totalOperationalCost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all logs as CSV
exports.exportCSV = async (req, res) => {
  try {
    const { vehicleId } = req.query;
    const query = {};
    if (vehicleId && mongoose.Types.ObjectId.isValid(vehicleId)) {
      query.vehicleId = new mongoose.Types.ObjectId(vehicleId);
    }

    const [fuelLogs, maintenances, expenses] = await Promise.all([
      FuelLog.find(query).populate("vehicleId", "registrationNumber name"),
      Maintenance.find(query).populate("vehicleId", "registrationNumber name"),
      Expense.find(query).populate("vehicleId", "registrationNumber name"),
    ]);

    let csvContent = "";

    // 1. Fuel logs
    csvContent += "=== FUEL LOGS ===\n";
    csvContent += "Vehicle,Date,Odometer (km),Fuel Qty (L),Cost (INR),Station,Notes\n";
    fuelLogs.forEach((log) => {
      const reg = log.vehicleId?.registrationNumber || "N/A";
      const date = log.date.toISOString().split("T")[0];
      const notes = (log.notes || "").replace(/,/g, " ");
      csvContent += `${reg},${date},${log.odometer},${log.fuelQty},${log.cost},${log.station || "N/A"},${notes}\n`;
    });

    // 2. Maintenances
    csvContent += "\n=== MAINTENANCE LOGS ===\n";
    csvContent += "Vehicle,Service Type,Type,Cost (INR),Start Date,End Date,Status,Notes\n";
    maintenances.forEach((m) => {
      const reg = m.vehicleId?.registrationNumber || "N/A";
      const sDate = m.startDate.toISOString().split("T")[0];
      const eDate = m.endDate ? m.endDate.toISOString().split("T")[0] : "N/A";
      const notes = (m.notes || "").replace(/,/g, " ");
      csvContent += `${reg},${m.serviceType},${m.maintenanceType},${m.cost},${sDate},${eDate},${m.status},${notes}\n`;
    });

    // 3. Expenses
    csvContent += "\n=== OTHER EXPENSES ===\n";
    csvContent += "Vehicle,Expense Type,Date,Amount (INR),Description\n";
    expenses.forEach((e) => {
      const reg = e.vehicleId?.registrationNumber || "N/A";
      const date = e.date.toISOString().split("T")[0];
      const desc = (e.description || "").replace(/,/g, " ");
      csvContent += `${reg},${e.expenseType},${date},${e.amount},${desc}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="transitops_operational_report.csv"');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export Report as PDF using PDFKit
exports.exportPDF = async (req, res) => {
  try {
    const { vehicleId } = req.query;
    const query = {};
    let vehicleInfo = "All Fleet Vehicles";

    if (vehicleId && mongoose.Types.ObjectId.isValid(vehicleId)) {
      query.vehicleId = new mongoose.Types.ObjectId(vehicleId);
      const vObj = await Vehicle.findById(vehicleId);
      if (vObj) {
        vehicleInfo = `${vObj.name} (${vObj.registrationNumber})`;
      }
    }

    const [fuelLogs, maintenances, expenses] = await Promise.all([
      FuelLog.find(query).populate("vehicleId", "registrationNumber"),
      Maintenance.find(query).populate("vehicleId", "registrationNumber"),
      Expense.find(query).populate("vehicleId", "registrationNumber"),
    ]);

    // Calculate totals
    const totalFuel = fuelLogs.reduce((acc, curr) => acc + curr.cost, 0);
    const totalMaint = maintenances.reduce((acc, curr) => acc + curr.cost, 0);
    const totalOther = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const grandTotal = totalFuel + totalMaint + totalOther;

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="transitops_operational_report.pdf"');
    doc.pipe(res);

    // Document Header
    doc.fontSize(24).font("Helvetica-Bold").text("TransitOps Fleet Report", { align: "center" });
    doc.fontSize(10).font("Helvetica").text(`Generated on: ${new Date().toLocaleString()}`, { align: "center" });
    doc.moveDown(1.5);

    // Summary Card
    doc.fontSize(12).font("Helvetica-Bold").text(`Vehicle Filter: ${vehicleInfo}`);
    doc.moveDown(0.5);
    doc.font("Helvetica").text(`Total Fuel Cost: INR ${totalFuel.toLocaleString()}`);
    doc.text(`Total Maintenance Cost: INR ${totalMaint.toLocaleString()}`);
    doc.text(`Total Miscellaneous Expenses: INR ${totalOther.toLocaleString()}`);
    doc.font("Helvetica-Bold").text(`Grand Total Operational Cost: INR ${grandTotal.toLocaleString()}`);
    doc.moveDown(1.5);

    // 1. Maintenance Section
    doc.fontSize(14).font("Helvetica-Bold").text("Maintenance Log Summary", { underline: true });
    doc.moveDown(0.5);
    if (maintenances.length === 0) {
      doc.fontSize(10).font("Helvetica").text("No maintenance logs found.");
      doc.moveDown();
    } else {
      maintenances.forEach((m, idx) => {
        const sDate = m.startDate.toISOString().split("T")[0];
        doc.fontSize(10).font("Helvetica-Bold").text(`${idx + 1}. ${m.serviceType} - ${m.vehicleId?.registrationNumber || "N/A"}`);
        doc.font("Helvetica").text(`   Type: ${m.maintenanceType} | Cost: INR ${m.cost} | Start: ${sDate} | Status: ${m.status}`);
        doc.moveDown(0.3);
      });
      doc.moveDown();
    }

    // 2. Fuel Log Section
    doc.fontSize(14).font("Helvetica-Bold").text("Fuel Log Summary", { underline: true });
    doc.moveDown(0.5);
    if (fuelLogs.length === 0) {
      doc.fontSize(10).font("Helvetica").text("No fuel logs found.");
      doc.moveDown();
    } else {
      fuelLogs.forEach((log, idx) => {
        const date = log.date.toISOString().split("T")[0];
        doc.fontSize(10).font("Helvetica-Bold").text(`${idx + 1}. Fuel Purchase - ${log.vehicleId?.registrationNumber || "N/A"}`);
        doc.font("Helvetica").text(`   Qty: ${log.fuelQty}L | Cost: INR ${log.cost} | Odometer: ${log.odometer} km | Date: ${date}`);
        doc.moveDown(0.3);
      });
      doc.moveDown();
    }

    // 3. Other Expenses Section
    doc.fontSize(14).font("Helvetica-Bold").text("Miscellaneous Expenses Log", { underline: true });
    doc.moveDown(0.5);
    if (expenses.length === 0) {
      doc.fontSize(10).font("Helvetica").text("No miscellaneous expenses found.");
    } else {
      expenses.forEach((e, idx) => {
        const date = e.date.toISOString().split("T")[0];
        doc.fontSize(10).font("Helvetica-Bold").text(`${idx + 1}. ${e.expenseType} - ${e.vehicleId?.registrationNumber || "N/A"}`);
        doc.font("Helvetica").text(`   Amount: INR ${e.amount} | Date: ${date} | Desc: ${e.description || "N/A"}`);
        doc.moveDown(0.3);
      });
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
