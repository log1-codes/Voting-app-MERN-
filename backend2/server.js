const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000; // Change to 3000 to match frontend


const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    optionsSuccessStatus: 200
  };

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/candidate', require('./routes/candidate'));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});