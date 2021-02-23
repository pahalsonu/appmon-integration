import mongoose from "mongoose";
const Schema = mongoose.Schema;

const individualProfileSchema = new Schema({
    userName: String,
    dateOfBirth: Date,
    gravatarUrl: String,
    address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        country: String,
        zipCode: Number
    },
    website: String,
    bio: String,
    social: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedIn: String,
        github: String
    },
    lastLoggedIn: { type: Date, default: Date.now() },
    individual: {
        type: Schema.Types.ObjectId,
        ref: "Individual",
        required: true
    }
});

const IndividualProfile = new mongoose.model('IndividualProfile', individualProfileSchema, 'individualProfiles');
export default IndividualProfile;