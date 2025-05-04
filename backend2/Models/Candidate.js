const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  aadharCardNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["candidate"], default: "candidate" },
  voteCount: { type: Number, default: 0 },
  image :{type : String}
});

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
