"use strict";

const mongoose = require("mongoose");
const os = require("os");

const _SECONDS = 5000;

// Check how many connections
const checkCountConnect = () => {
  const length = mongoose.connections.length;

  console.log(`Numbers of connections: ${length}`);
};

// Check overload of Mongoose
const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const cores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxNumConnections = cores * 5; // Example maximum connections based on num of cores
    console.log(`Active connections: ${numConnections}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);
    if (numConnections > maxNumConnections) {
      console.log("Connect overload detected!");
    }
  }, _SECONDS);
};

module.exports = {
  checkCountConnect,
  checkOverload,
};
