const express = require("express");
const Voter = require("../Models/Voter");
const Candidate = require("../Models/Candidate");
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

//configure multer for image upload 

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
  }
});

const upload = multer({storage:storage});
router.get('/test', (req, res) => {
  res.json({ message: 'Test route is working' });
});
// Signup route
router.post("/signup", async (req, res) => {
  let { name, username, email, contact, aadharCardNumber, password, role } =
    req.body;

  try { 
    const saltpass = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(password, saltpass);
    console.log("hashpass",hashpass,password);
    if (role === "voter") {
      const newVoter = new Voter({
        name,
        username,
        email,
        contact,
        aadharCardNumber,
        password:hashpass,
      });
      await newVoter.save();
      return res.status(201).json({ message: "Voter registered successfully" });
    } else if (role === "candidate") {
      const newCandidate = new Candidate({
        name,
        username,
        email,
        contact,
        aadharCardNumber,
        password:hashpass,
      });
      await newCandidate.save();
      return res
        .status(201)
        .json({ message: "Candidate registered successfully" });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  let { aadharCardNumber, password, role } = req.body;

  try {
    let user;
    if (role === "voter") {
      user = await Voter.findOne({ aadharCardNumber });
    } else if (role === "candidate") {
      user = await Candidate.findOne({ aadharCardNumber });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user.password,password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Compare result:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong Password " });
    }
    console.log("User Found");
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        contact: user.contact,
        role: user.role,
        aadharCardNumber: user.aadharCardNumber,
        image: user.image
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
///router for changing the password 
router.put('/change-password', async (req, res) => {
  try {
    const { aadharCardNumber, currentPassword, newPassword } = req.body;

    console.log('Received change password request for Aadhar:', aadharCardNumber);

    // Find the user
    let user = await Voter.findOne({ aadharCardNumber });
    if (!user) {
      user = await Candidate.findOne({ aadharCardNumber });
    }
    
    if (!user) {
      console.log('User not found for Aadhar:', aadharCardNumber);
      // toast.error("User not found for this aadhar number ")
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user.username);

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      console.log('Current password is incorrect for user:', currentPassword," ",isMatch);
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    console.log('Current password verified for user:', user.username);

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    console.log('Password updated successfully for user:', user.username);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Detailed error in change-password route:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});
//router for getting the candidates 
router.get('/candidates', async (req, res) => {
  try {
    console.log("Fetching candidates...");
    let candidates = await Candidate.find({ role: "candidate" });
    console.log("Candidates fetched successfully:", candidates);
    
    if (!candidates || candidates.length === 0) {
      return res.status(404).json({ message: "No candidates found" });
    }
    return res.status(200).json({ candidates });
  } catch (err) {
    console.error("Error in fetching the candidates", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//router for voting 

router.post('/vote', async (req, res) => {
  console.log('Vote route hit');
  const { voterAadharCardNumber, candidateAadharCardNumber } = req.body;
  console.log('Voter Aadhar:', voterAadharCardNumber);
  console.log('Candidate Aadhar:', candidateAadharCardNumber);

  try {
    const voter = await Voter.findOne({ aadharCardNumber: voterAadharCardNumber });
    if (!voter) {
      return res.status(404).json({ message: "Voter not found" });
    }

    if (voter.hasVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    const candidate = await Candidate.findOne({ aadharCardNumber: candidateAadharCardNumber });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Initialize voteCount if it's undefined
    if (typeof candidate.voteCount !== 'number') {
      candidate.voteCount = 0;
    }

    candidate.voteCount += 1;
    await candidate.save();

    voter.hasVoted = true;
    await voter.save();

    console.log(`Vote recorded. New vote count for ${candidate.name}: ${candidate.voteCount}`);
    res.status(200).json({ message: "Vote recorded successfully", newVoteCount: candidate.voteCount });
  } catch (error) {
    console.error("Error in voting:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/results', async (req, res) => {
  try {
    console.log("Fetching  Election results...");
    let candidates = await Candidate.find({role:"candidate"}).sort({voteCount:-1});
    console.log("Election results fetched successfully:", candidates);
    if(!candidates || candidates.length === 0){
      return res.status(404).json({message:"No candidates found"});
    }
    return res.status(200).json({candidates});
  } catch (error) {
    console.error("Error in fetching results:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//edit profile 
router.put('/edit-profile', upload.single('image'), async (req, res) => {
  try {
    const { aadharCardNumber, name, username, email, contact } = req.body;

    let user = await Voter.findOne({ aadharCardNumber });
    if (!user) {
      user = await Candidate.findOne({ aadharCardNumber });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.contact = contact || user.contact;
    
    // Update image if a new one was uploaded
    if (req.file) {
      user.image = req.file.path.replace('\\', '/'); // Ensure correct path format
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        contact: user.contact,
        role: user.role,
        aadharCardNumber: user.aadharCardNumber,
        image: user.image
      }
    });
  } catch (error) {
    console.error('Error in edit-profile route:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

module.exports = router;