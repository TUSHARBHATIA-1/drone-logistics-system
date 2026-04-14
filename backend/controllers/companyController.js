const Company = require("../models/Company");

exports.createCompany = async (req, res) => {
try {
console.log("BODY:", req.body);
console.log("USER:", req.user);

const { name, address, latitude, longitude } = req.body;

if (!name || !address || !latitude || !longitude) {
  return res.status(400).json({ message: "All fields required" });
}

const company = await Company.create({
  name,
  address,
  location: {
    type: "Point",
    coordinates: [longitude, latitude],
  },
  user: req.user._id || req.user.id, // Handles both _id and id safely
});

res.status(201).json(company);

} catch (error) {
console.error(error);
res.status(500).json({ message: "Server error" });
}
};

exports.getMyCompany = async (req, res) => {
try {
const company = await Company.findOne({ user: req.user._id || req.user.id });
res.json(company);
} catch (error) {
res.status(500).json({ message: "Error fetching company" });
}
};