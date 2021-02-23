import mongoose from "mongoose";
const Schema = mongoose.Schema;

const individualChecksSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  successCodes: {
    type: Array,
    required: true
  },
  timeoutSeconds: {
    type: Number,
    required: true
  },
  protocol: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  individual: {
    type: Schema.Types.ObjectId,
    ref: "Individual",
    required: true
  },
  state: {
    type: String
  },
  lastChecked: {
    type: Date
  }
});

const IndividualChecks = new mongoose.model(
  "IndividualChecks",
  individualChecksSchema,
  "individualChecks"
);

export default IndividualChecks;
