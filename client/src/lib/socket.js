import { io } from "socket.io-client";

// EIN Socket für die ganze App
const socket = io("/"); 
export default socket;  