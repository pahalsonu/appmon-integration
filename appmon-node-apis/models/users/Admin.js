import mongoose from "mongoose";
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: Number,
    required: true,
  },
});

const Admin = new mongoose.model("Admin", adminSchema, "admins");

export default Admin;
