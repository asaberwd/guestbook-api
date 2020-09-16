/**
 * Module dependencies.
 */

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const helmet = require("helmet");

const winston = require("winston");
const config = require("./");
const pkg = require("../package.json");

const env = process.env.NODE_ENV || "development";

const cors = require("cors");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


/**
 * Expose
 */

module.exports = function(app) {
  app.use(helmet());


  // Static files middleware
  app.use(express.static(config.root + "/public"));

  // Use winston on production
  let log;
  if (env !== "development") {
    log = {
      stream: {
        write: msg => winston.info(msg)
      }
    };
  } else {
    log = "dev";
  }

  // Don't log during tests
  // Logging middleware
  if (env !== "test") app.use(morgan(log));

  // set views path and default layout
  //app.set('views', config.root + '/app/views');
  //app.set('view engine', 'pug');

  // expose package.json to views
  app.use(function(req, res, next) {
    res.locals.pkg = pkg;
    res.locals.env = env;
    next();
  });
 
  // bodyParser should be above methodOverride
  app.use(
    bodyParser.urlencoded({limit: '5mb', extended: true})
  );
  app.use(bodyParser.json({limit: '5mb', extended: true}));
 
  // allow cors
  app.use(
    cors()
  );


// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "guestbook API",
      description: "guestbook api documentitions",
      contact: {
        name: "AS"
      },
      servers: ["http://localhost:3000"]
    },
    produces: ['application/json'],
    consumes: ['application/json'],
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    security: [{ jwt: [] }],
 
  },
  // ['.routes/*.js']
  apis: ["routes/index.js", "config/express.js", "routes/*.js"],

};


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

};





