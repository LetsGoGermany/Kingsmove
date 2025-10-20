import { io } from "socket.io-client";

// EIN Socket für die ganze App
const socket = io("http://localhost:1887"); 
export default socket;