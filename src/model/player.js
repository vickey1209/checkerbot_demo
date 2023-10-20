import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    playerName: {
        type: String,
        require: true
    },
    turn: {
        type: Boolean
    },
    socketid: {
        type: String
    }
})
const players = mongoose.model('players',playerSchema);
module.exports = players;