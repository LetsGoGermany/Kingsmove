import mongoose from "mongoose";
import log from "./console.js"

try {
mongoose.connect("mongodb://localhost/RoyalChess")
} catch(err) {
    log.sendMSG(err.message()) 
    }
export default mongoose;
