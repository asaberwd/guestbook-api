"use strict";

/*
 * concept server
 */

/**
 * Module dependencies
 */

require("dotenv").config();

// const { getStatus } = require("./app/controllers/campaigncontroller");

const fs = require("fs");
const join = require("path").join;
const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");

// const { generateLeadtoken } = require("./helper/generateToken");

const models = join(__dirname, "app/models");
const port = process.env.PORT || 5000;

const app = express();
const connection = connect();


/**
 * Expose
 */

module.exports = {
  app,
  connection
};


// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.indexOf(".js"))
  .forEach(file => require(join(models, file)));

// Bootstrap routes
require("./config/express")(app);
require("./config/routes")(app);

connection
  .on("error", console.log)
  .on("disconnected", connect)
  .once("open", listen);

function listen() {
  // check if advertisings collection is existed
  connection.db

  if (app.get("env") === "test") return;

  app.listen(port);
  console.log("Express app started on port " + port);
}

function connect() {
  var options = {
    keepAlive: 1,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  };
  mongoose.connect(config.db, options);

  return mongoose.connection;
}
