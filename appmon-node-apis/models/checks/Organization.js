import mongoose from "mongoose";
const Schema = mongoose.Schema;

const organizationChecksSchema = new Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  },
  name: {
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
  url: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  state: {
    type: String
  },
  lastChecked: {
    type: Date
  }
});

let OrganizationChecks = new mongoose.model(
  "OrganizationChecks",
  organizationChecksSchema,
  "organizationChecks"
);

export default OrganizationChecks;
