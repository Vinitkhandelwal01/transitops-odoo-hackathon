const Expense = require("../models/Expense");
const Vehicle = require("../models/Vehicle");

exports.getExpenses = async (req, res) => {
  try {
    const { vehicleId, expenseType } = req.query;
    const query = {};
    if (vehicleId) query.vehicleId = vehicleId;
    if (expenseType) query.expenseType = expenseType;

    const expenses = await Expense.find(query)
      .populate("vehicleId")
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { vehicleId, expenseType, date, amount, description } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const expense = new Expense({
      vehicleId,
      expenseType,
      date,
      amount,
      description,
    });

    await expense.save();
    res.status(201).json(await expense.populate("vehicleId"));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
