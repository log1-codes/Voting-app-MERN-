const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000; 


const corsOptions = {
     origin: 'https://voting-app-65gn.onrender.com', 
    optionsSuccessStatus: 200 ,
    credentials: true
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


// Start server
app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
})
