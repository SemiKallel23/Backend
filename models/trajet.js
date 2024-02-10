const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trajetSchema = new Schema({
  startAdress: { type: String },
  departTime: { type: String },
  endAddress: { type: String },
  arrivalTime: { type: String },
  nbrPlaces: { type: String },
  car: { type: String },
});

const Trajet = mongoose.model('Trajet', trajetSchema);

module.exports = Trajet;
