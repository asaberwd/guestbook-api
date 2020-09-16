const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const { ensureAuthenticated } = require("./../middleware/auth");



const {
  createMessage, createReply
  } = require("./../app/controllers/messageControllers");


// type   Post
// desc   create user message
router
  .route("/")
  .post( ensureAuthenticated, createMessage )


// type   Post
// desc   create reply
router
  .route("/reply")
  .post( ensureAuthenticated, createReply )




module.exports = router;


