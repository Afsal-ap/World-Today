// import { Server } from "socket.io";
// import http from "http";

// const server = http.createServer();
// const io = new Server(server, {
//     cors: {
//         origin: "*",
//     },
// });

// io.on("connection", (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     socket.on("join-room", (roomId, isViewer = false) => {
//         socket.join(roomId);
        
//         if (!isViewer) {
//             socket.broadcast.to(roomId).emit("user-joined", socket.id);
//         } else {
//             io.to(roomId).emit("viewer-joined", socket.id);
//         }
//     });

//     socket.on("signal", ({ roomId, signal, from, to }) => {
//         socket.to(to).emit("signal", { signal, from });
//     });

//     socket.on("disconnect", () => {
//         console.log(`User disconnected: ${socket.id}`);
//     });
// });

// server.listen(5001, () => console.log("Post Service Signaling Server running on port 5001"));
