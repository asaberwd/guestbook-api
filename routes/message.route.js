const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const { ensureAuthenticated } = require("./../middleware/auth");



const {
  createMessage, createReply, viewMessages, deleteMessage
  } = require("./../app/controllers/messageControllers");


// type   Post
// desc   create user message
router
  .route("/")
  .post( ensureAuthenticated, createMessage )

  .get(ensureAuthenticated, viewMessages)


// type   Post
// desc   create reply
router
  .route("/reply")
  .post( ensureAuthenticated, createReply )



// type   Delete
// desc   delete institution
router
  .route("/:id")
  .delete( ensureAuthenticated, deleteMessage )




module.exports = router;


