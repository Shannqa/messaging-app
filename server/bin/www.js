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

  socket.emit("connectionResponse", {
    name: "Server",
    text: `User connected: ${username}`,
    users: users,
  });

  // message to "All" room
  socket.on("publicMessage", (data) => {
    console.log(data);
    io.emit("publicMessageResponse", data);
  });

  socket.on("priv", ({ to, from, text }) => {
    const toUser = users.find((user) => user.name === to);

    console.log(toUser);
    io.to(toUser.socketId).emit("privResp", { to, from, text });
  });

  socket.on("fromAsia", ({ text, to, from }) => {
    console.log({ text, to, from });
    io.to(socket.id).emit("fromAndToAsia", { text, to, from });
  });

  socket.on("privateMessageSelf", ({ text, to, from }) => {
    io.to(socket.id).emit("privateMessageSelfResp", {
      text: text,
      to: to,
      from: from,
    });
  });

  socket.on("privateMessageOwn", ({ text, to, from }) => {
    io.emit("privateMessageOwn", { text, to, from });
  });

  socket.on("privateMessageTo", ({ text, to, from }) => {});

  socket.on("privateMessage", ({ text, to, from }) => {
    console.log("to", to);

    console.log("from", from);
    const [user] = users.filter((user) => user.name === to);
    // const [from] = users.filter((user) => user.socketId === socket.id);

    // send the message to self
    io.to(user.socketId).emit("privateMessageResponse", {
      text: text,
      to: user.name,
      from: username,
    });
    // and then, send the message to the recipient
    // io.to(user.socketId).emit("privateMessageResponse", {
    //   text: text,
    //   from: from.user,
    // });
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    socket.emit("disconnectResponse", {
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
