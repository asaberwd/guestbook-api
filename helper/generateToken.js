const jwt = require("jsonwebtoken");

const generatetoken = async (payload) => {


  let res
  // Sign token
  await jwt.sign( payload, process.env.JWT_SECRET,
    {
      expiresIn: 31556926 // 1 year in seconds
    },
     (err, token) => {
      if(err){
        res = {
          success: false,
          token: null
        };
      }else{
        res = {
          success: true,
          token: "Bearer " + token
        };
      }    

    }
  );
  return res
};

module.exports = { generatetoken };
