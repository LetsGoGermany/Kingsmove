import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
        user_id: String,
})

export default mongoose.model("sessions", sessionSchema)
