const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
        user_id: String,
        createdAt: {
                type: Date,
                default: Date.now,
                expires: 10*60,
        }
})


module.exports = mongoose.model("passwordResets", sessionSchema)
