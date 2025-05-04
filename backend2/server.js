const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000; // Change to 3000 to match frontend

// CORS options for allowing frontend requests
const corsOptions = {
  origin: 'https://voting-app-65gn.onrender.com',  // Replace with your frontend URL
  optionsSuccessStatus: 200,  // Some legacy browsers choke on 204
  credentials: true  // Allow cookies and credentials to be sent
};

// Middleware for CORS (Apply CORS options)
app.use(cors(corsOptions));

// Middleware to parse JSON data and serve static files (uploads)
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle preflight (OPTIONS) requests for all routes
app.options('*', cors(corsOptions));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
// You can uncomment and add other routes like:
  // app.use('/api/candidate', require('./routes/candidate'));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
