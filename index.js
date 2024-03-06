const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const trajetRoutes = require('./routes/newTrajet');
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
mongoose.connect(process.env.URL_DATA_BASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});

app.use('/auth', authRoutes);
app.use('/trajet', trajetRoutes);

module.exports = app;


