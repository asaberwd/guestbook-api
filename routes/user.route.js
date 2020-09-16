const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap

const {
  addUser,

} = require("./../app/controllers/userController");

// type   Post
// desc   register new USER
router
  .route("/register")
  .post( addUser )

module.exports = router;


