const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    depotName: {
      type: String,
      default: "Gandhinagar Depot",
    },
    currency: {
      type: String,
      default: "INR (Rs.)",
    },
    distanceUnit: {
      type: String,
      enum: ["Kilometers", "Miles"],
      default: "Kilometers",
    },
  },
  { timestamps: true }
);

// Enforce a single settings document for the whole org (hackathon scope = one org)
settingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model("Settings", settingsSchema);
