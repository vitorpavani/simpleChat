require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/message", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});


io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
    // socket.on("chat message", (msg) => {
    //   io.emit("chat message", msg);
  });
});

http.listen(process.env.PORT, () => {
  console.log(`listening on port: ${process.env.PORT}`);
});
