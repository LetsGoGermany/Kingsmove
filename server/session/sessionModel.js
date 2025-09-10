const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
        user_id: String,
})

module.exports = mongoose.model("sessions", sessionSchema)
