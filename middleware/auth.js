const jwt = require("jsonwebtoken");

module.exports = {
  ensureAuthenticated: function(req, res, next) {
    let token = req.headers["authorization"];
    if (!token) return res.status(401).json({
      default_response: {
        success: false,
        errors: [ "no token provided" ],
        message: "no token provided"
        }
     });

    token = token.substr(7);
    jwt.verify(token, process.env.JWT_SECRET, async function(err, decoded) {
      if (err)
        return res
          .status(401)
          .json({ 
            default_response: {
              success: false,
              errors: [ `Failed to authenticate token. ${err}` ],
              message: "Failed to authenticate token"
            }
            });
      let data = jwt.decode(token);
      res.locals.decoded = data;
      req.user = data;

      return next();
    });

  }

};
