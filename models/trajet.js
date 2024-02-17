const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const trajetSchema = new Schema({
  startAdress: { type: String },
  departTime: { type: String },
  endAddress: { type: String },
  arrivalTime: { type: String },
  nbrPlaces: { type: Number },
  car: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: "none" },// waiting, reserved, full, none
  nbrOfPlacesAccepted: { type: Number, default: 0 },
});

const Trajet = mongoose.model('Trajet', trajetSchema);

module.exports = Trajet;
