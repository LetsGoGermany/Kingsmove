import { io } from "socket.io-client";

// EIN Socket für die ganze App
const socket = io("http://192.168.2.115:1887"); 
export default socket;