const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoute = require('./routes/auth');
const threatRoute = require('./routes/threatintel'); // <--- ADD THIS

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/threat', threatRoute); // <--- AND THIS

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT, () => {
      console.log(`Backend Server Running on Port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));
