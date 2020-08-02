require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
 // res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

http.listen(process.env.PORT, () => {
  console.log(`listening on port: ${process.env.PORT}`);
});
