import mongoose from "mongoose";
const Schema = mongoose.Schema;

const individualSchema = new Schema({
    role: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: Number,
        required: true
    },
    tos: {
        type: Boolean,
        required: true
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailToken: {
        type: String
    },
    otp : {
        token : {
            type : Number
        },
        timeStamp : {
            type : Number
        }
    },
    checks : [{
        type : Schema.Types.ObjectId,
        ref : "IndividualChecks"
    }]
});

const Individual = new mongoose.model("Individual", individualSchema, 'individuals')

export default Individual;