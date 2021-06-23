import { io } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: false });

// Catching all events for development aid
socket.onAny((event, ...args) => {
    console.log(event, args);
});

export default socket;