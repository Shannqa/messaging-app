#!/usr/bin/env node

/**
 * Module dependencies.
 */

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
io.on("connection", (socket) => {
  socket.join(socket.id);
  const user = socket.handshake.query.user;
  users.push({ user: user, socketId: socket.id });
  console.log(`a user connected, username: ${user}, id: ${socket.id}`);
  socket.broadcast.emit("connectionResponse", {
    user: "Socket",
    text: `New user connected: ${user}`,
  });

  io.emit("getUsers", users);

  socket.on("message", (data) => {
    io.emit("messageResponse", data);
  });

  socket.on("private message", ({ text, to }) => {
    const [user] = users.filter((user) => user.user === to);
    console.log(user);
    console.log(text);
    console.log(user.socketId);
    const [from] = users.filter((user) => user.socketId === socket.id);

    // send the message to self
    io.to(socket.id).emit("private message response", {
      text: text,
      from: from.user,
    });
    // and then, send the message to the recipient
    io.to(user.socketId).emit("private message response", {
      text: text,
      from: from.user,
    });
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketID !== socket.id);
    io.emit("getUsers", users);
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
