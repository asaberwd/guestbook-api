const express = require("express");
const router = express.Router();


const userRoutes = require("./user.route");
const messageRoutes = require("./message.route");


// mount user routes at /user
router.use("/user", userRoutes);
router.use("/message", messageRoutes);




module.exports = router;





