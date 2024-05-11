#!/usr/bin/env node

/**
 * Module dependencies.
 */

import { log } from "console";
import app from "../app.js";
import debug from "debug";
import http from "http";
import { Server } from "socket.io";

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/* socket */
let users = [];
/*
users = [
  {
    name: "asia",
    socketId: "xxxxxx"
  },
]
*/

io.on("connection", (socket) => {
  // join own private message room
  socket.join(socket.id);
  const username = socket.handshake.query.user;
  users.push({ name: username, socketId: socket.id });
  console.log(`a user connected, username: ${username}, id: ${socket.id}`);

  io.emit("connectionResponse", {
    name: "Server",
    text: `User connected: ${username}`,
    users: users,
  });

  // message to "All" room
  socket.on("publicMessage", (data) => {
    console.log(data);
    io.emit("publicMessageResponse", data);
  });

  socket.on("privateMsg", ({ to, from, text }) => {
    const toUser = users.find((user) => user.name === to);
    // send socket event to the sender and receipient
    io.to(socket.id)
      .to(toUser.socketId)
      .emit("privateMsgResponse", { to, from, text });
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("disconnectResponse", {
      name: "Server",
      text: `User disconnected: ${username}`,
      users: users,
    });
    socket.disconnect();
  });
});

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

export default io;
