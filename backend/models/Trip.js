const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  tripNumber: { type: String, required: true, unique: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  cargoWeight: { type: Number, required: true },
  plannedDistance: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'], 
    default: 'Draft' 
  }
}, { timestamps: true });

// Pre-validate hook to generate a trip number if not exists
tripSchema.pre('validate', function() {
  if (!this.tripNumber) {
    this.tripNumber = `TR${Math.floor(1000 + Math.random() * 9000)}`;
  }
});

module.exports = mongoose.model('Trip', tripSchema);
