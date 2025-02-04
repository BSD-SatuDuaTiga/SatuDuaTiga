import { io } from "socket.io-client";

export const newSocket = io("http://localhost:3000", {
  autoConnect: true,
});
