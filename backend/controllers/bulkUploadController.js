const fs = require("fs");
const csv = require("csv-parser");

const Doctor = require("../models/Doctor");
const Medicine = require("../models/Medicine");
const Test = require("../models/Test");
const BloodType = require("../models/BloodType");

/* =============================
   GENERIC CSV READER
============================= */
const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};

/* =============================
   DOCTORS BULK UPLOAD
============================= */
exports.uploadDoctors = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No CSV file uploaded" });
    }

    const rows = await readCSV(req.file.path);

    const doctors = rows
      .map((r) => ({
        name: r.name || r.Name || r.doctorName,
        specialty: r.specialty || r.Specialty || r.specialization,
        languages: r.languages
          ? r.languages.split(",").map((l) => l.trim())
          : [],
        fee: r.fee ? Number(r.fee) : undefined,
      }))
      .filter((d) => d.name); // remove invalid rows

    if (!doctors.length) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "CSV has no valid doctor data" });
    }

    await Doctor.insertMany(doctors, { ordered: false });

    fs.unlinkSync(req.file.path);

    res.json({
      message: `${doctors.length} doctors uploaded successfully`,
    });
  } catch (err) {
    console.error("DOCTOR UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =============================
   MEDICINES BULK UPLOAD
============================= */
exports.uploadMedicines = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No CSV file uploaded" });
    }

    const rows = await readCSV(req.file.path);

    const medicines = rows
      .map((r) => ({
        name: r.name || r.Name,
        price: r.price ? Number(r.price) : 0,
        discount: r.discount ? Number(r.discount) : 0,
      }))
      .filter((m) => m.name);

    if (!medicines.length) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "CSV has no valid medicines" });
    }

    await Medicine.insertMany(medicines, { ordered: false });

    fs.unlinkSync(req.file.path);

    res.json({
      message: `${medicines.length} medicines uploaded successfully`,
    });
  } catch (err) {
    console.error("MEDICINES UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =============================
   TESTS BULK UPLOAD
============================= */
exports.uploadTests = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No CSV file uploaded" });
    }

    const rows = await readCSV(req.file.path);

    const tests = rows
      .map((r) => ({
        title: r.title || r.name || r.Test,
        description: r.description || "",
        price: r.price ? Number(r.price) : 0,
        category: r.category || "healthTest",
      }))
      .filter((t) => t.title);

    if (!tests.length) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "CSV has no valid tests" });
    }

    await Test.insertMany(tests, { ordered: false });

    fs.unlinkSync(req.file.path);

    res.json({
      message: `${tests.length} tests uploaded successfully`,
    });
  } catch (err) {
    console.error("TESTS UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =============================
   BLOOD BANKS BULK UPLOAD
============================= */
exports.uploadBloodBanks = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No CSV file uploaded" });
    }

    const rows = await readCSV(req.file.path);

    const bloodBanks = rows
      .map((r) => ({
        centerName: r.centerName || r.name,
        location: r.location || "",
        available: r.available === "true" || r.available === true,
        bloodTypes: r.bloodTypes
          ? r.bloodTypes.split(",").map((b) => b.trim())
          : [],
      }))
      .filter((b) => b.centerName);

    if (!bloodBanks.length) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "CSV has no valid blood banks" });
    }

    await BloodType.insertMany(bloodBanks, { ordered: false });

    fs.unlinkSync(req.file.path);

    res.json({
      message: `${bloodBanks.length} blood banks uploaded successfully`,
    });
  } catch (err) {
    console.error("BLOOD BANK UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};