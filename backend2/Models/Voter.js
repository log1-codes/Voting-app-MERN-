const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const voterSchema = new mongoose.Schema({
    // _id : mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    aadharCardNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['voter'], default: 'voter' },
    hasVoted : {type:Boolean , default : false},
    image :{type : String}
  
});

 
const Voter = mongoose.model('Voter', voterSchema);

module.exports = Voter;