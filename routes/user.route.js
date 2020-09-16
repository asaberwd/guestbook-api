const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap

const {
  addUser,
  login

} = require("./../app/controllers/userController");

// type   Post
// desc   register new USER
router
  .route("/register")
  .post( addUser )


// type   POST
// desc   user log in
router
  .route("/login")
  .post(
    login
  );



module.exports = router;


