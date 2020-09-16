const jwt = require("jsonwebtoken");

const generatetoken = async (payload) => {

  // Sign token
  try{
    let token = await jwt.sign( payload, process.env.JWT_SECRET, { expiresIn: '1h' } );
    return { token: 'Bearer ' + token , success: true }
  }catch(err) {
    return { token: null, success: false }
  }

};

module.exports = { generatetoken };
