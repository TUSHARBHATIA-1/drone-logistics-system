const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
name: String,
address: String,
location: {
type: {
type: String,
enum: ["Point"],
default: "Point"
},
coordinates: {
type: [Number],
required: true
}
},
user: {
type: mongoose.Schema.Types.ObjectId,
ref: "User"
}
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
