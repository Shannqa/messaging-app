#!/usr/bin/env node

/**
 * Module dependencies.
 */

import { log } from "console";
import app from "../app.js";
import debug from "debug";
import http from "http";
import { Server } from "socket.io";
import sanitizeHtml from "sanitize-html";
import Conversation from "../models/conversationSchema.js";
import User from "../models/userSchema.js";
import Message from "../models/messageSchema.js";
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
    userId: "yyyy", - id from database
    socketId: "xxxxxx"
  },
]
*/
// middleware
io.use((socket, next) => {
  socket.username = sanitizeHtml(socket.handshake.auth.username);
  socket.userId = sanitizeHtml(socket.handshake.auth.userId);
  next();
});

// socket
io.on("connection", (socket) => {
  // join own private message room
  socket.join(socket.id);
  users.push({
    name: socket.username,
    userId: socket.userId,
    socketId: socket.id,
  });
  console.log(
    `a user connected, username: ${socket.username}, userId: ${socket.userId}, socketId: ${socket.id}`
  );

  io.emit("connectionResponse", {
    name: "Server",
    text: `User connected: ${socket.username}`,
    users: users,
  });

  // message to "All" room
  socket.on("publicMessage", ({ name, socketId, text }) => {
    const cleanName = sanitizeHtml(name);
    const cleanId = sanitizeHtml(socketId);
    const cleanText = sanitizeHtml(text);

    io.emit("publicMessageResponse", {
      name: cleanName,
      socketId: cleanId,
      text: cleanText,
    });
  });

  socket.on("privateMsg", ({ to, from, text }) => {
    const cleanTo = sanitizeHtml(to);
    const cleanFrom = sanitizeHtml(from);
    const cleanText = sanitizeHtml(text);
    const toUser = users.find((user) => user.name === to);

    // save conversation in database

    // send socket event to the sender and receipient
    io.to(socket.id).to(toUser.socketId).emit("privateMsgResponse", {
      to: cleanTo,
      from: cleanFrom,
      text: cleanText,
    });

    // check if conversation exists
    const convoExists = Conversation.findOne({
      participants: { $all: [toUser.userId, socket.userId] },
    })
      .exec()
      .then((existingConvo) => {
        if (existingConvo) {
          // conversation exists
          const newMsg = new Message({
            sender: socket.userId,
            text: cleanText,
            conversation: existingConvo.id,
          })
            .save()
            .then((msg) => {
              Conversation.findByIdAndUpdate(
                existingConvo.id,
                {
                  $push: { messages: msg.id },
                },
                { new: true, upsert: true }
              ).exec();
            })
            .catch((err) => console.log(err));
        } else {
          // conversation doesn't exist, create a new one
          const conversation = new Conversation({
            participants: [socket.userId, toUser.userId],
          })
            .save()
            .then((newConvo) => {
              const newMsg = new Message({
                sender: socket.userId,
                text: cleanText,
                conversation: newConvo.id,
              })
                .save()
                .then((msg) => {
                  Conversation.findByIdAndUpdate(
                    existingConvo.id,
                    {
                      $push: { messages: msg.id },
                    },
                    { new: true, upsert: true }
                  ).exec();
                });
            })
            .catch((err) => console.log(err));
        }
      });
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("disconnectResponse", {
      name: "Server",
      text: `User disconnected: ${socket.username}`,
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
