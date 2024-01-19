const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

let userInfo = [];

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("disconnect", () => {
    const user = userInfo.find((c) => c.id == socket.id);
    console.log("user disconnected");
    socket.broadcast.emit("msg", {
      level: "sys",
      msg: user.username + "님이 퇴장하였습니다",
    });
  });

  socket.on("login", (username) => {
    const info = {
      username: username,
      id: socket.id,
    };
    userInfo.push(info);
    io.emit("msg", { level: "sys", msg: username + "님이 입장하였습니다" });
  });

  socket.on("send", ({ username: username, msg: msg1 }) => {
    socket.broadcast.emit("msg", { level: "", msg: msg1, username: username });
  });
});

// 서버 실행
http.listen(process.env.PORT || 5000, () => {
  console.log("connected ");
});
