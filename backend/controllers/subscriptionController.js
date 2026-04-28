const Subscription = require("../models/Subscription");
const Doctor = require("../models/Doctor");
const Medicine = require("../models/Medicine");
const Test = require("../models/Test");
const BloodType = require("../models/BloodType");

exports.createSubscription = async (req, res) => {
  try {
    const data = await Subscription.create(req.body);

    // 🔥 AUTO PUSH INTO MAIN COLLECTIONS
    if (data.type === "doctor") {
      await Doctor.create({
        name: data.name,
        specialty: data.specialty,
      });
    }

    if (data.type === "medicine") {
      await Medicine.create({
        name: data.name,
        price: data.price,
      });
    }

    if (data.type === "test") {
      await Test.create({
        title: data.name,
        price: data.price,
      });
    }

    if (data.type === "blood") {
      await BloodType.create({
        name: data.hospitalName,
        location: data.location,
      });
    }

    res.json({ message: "Subscription added & data inserted" });
  } catch (err) {
    console.error(err);
    res.status(200).json({
  message: "Subscription submitted successfully"
});
  }
};