const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    subscribeTopic: { type: String, required: true },
    publishTopic: { type: String, required: true, unique: true },
    status: { type: Number, min: 0, max: 1, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: "000000000000",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: "000000000000",
    },
  },
  { timestamps: true }
);

deviceSchema.index({ userId: "text" });
deviceSchema.index({ deviceId: "text" });

// index for createdAt and updatedAt
deviceSchema.index({ createdAt: 1 });
deviceSchema.index({ updatedAt: 1 });

// reference model
const ModelName = "Device";
const Device = mongoose.model(ModelName, deviceSchema);

module.exports = { Model: Device, name: ModelName };
