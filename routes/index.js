const express = require("express");
const router = express.Router();


const userRoutes = require("./user.route");


// mount user routes at /user
router.use("/user", userRoutes);



module.exports = router;





