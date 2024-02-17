const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    idDriver: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: "waiting" },// waiting, accepted, rejected
    relatedToRoute: { type: Schema.Types.ObjectId, ref: 'Trajet' },
});

const reservation = mongoose.model('Reservation', reservationSchema);

module.exports = reservation;
