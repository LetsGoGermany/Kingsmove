const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
        board: Array,
        moves: Array,
        white: String,
        black: String,
        hasStarted: Boolean,
        toMove: String,
        finished: Boolean,
        winner: {
                type: String,
                default: null
        },
        startDate: Date,
        time: Number,
        bonusTime: Number,
        timerPerMove: Boolean,
        gameCode: String
})

module.exports = mongoose.model("games", boardSchema)