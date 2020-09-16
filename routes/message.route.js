const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const { ensureAuthenticated } = require("./../middleware/auth");



const {
  createMessage
  } = require("./../app/controllers/messageControllers");


// type   Post
// desc   create user message
router
  .route("/")
  .post( ensureAuthenticated, createMessage )




module.exports = router;


