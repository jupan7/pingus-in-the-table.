const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
    console.log("Jugador conectado:", socket.id);

    socket.on("joinRoom", (room) => {
        socket.join(room);
        socket.to(room).emit("playerJoined", socket.id);
    });

    socket.on("gameAction", (data) => {
        socket.to(data.room).emit("gameAction", data.action);
    });

    socket.on("disconnect", () => {
        console.log("Jugador desconectado:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log("Pingus activo en puerto " + PORT);
});
