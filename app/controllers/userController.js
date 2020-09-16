const _ = require("lodash");
const User = require("./../models/user");
const { validateUser } = require("./../../helper/validate");
const { hashing } = require("../../helper/hashing");
const message = require("./../../constants/responseMessages")


// add new user
exports.addUser = async function(req, res) {
  
  // validating user attr using joi
  let error = await validateUser(req.body);
  if (error) {
    let er = error.details[0].message.replace(/\"/g, "")
    return res.status(200).json({
      default_response: {
      success: false,
      errors: [ er ],
      message: message.validation
      }});
  }

  const { name, password, email, phone } = req.body;
  let hashedPassword = hashing(password);

  let isExist = await User.findOne({ $or :[ {email}, {phone} ] })
  if(isExist){

    let err
    (isExist.email === email)?err="email":err="phone"

    return res.status(200).json({
      default_response: {
      success: false,
      errors: [ `${err} is already exist` ],
      message: message.validation
      }});
      
  }


  let user = {
    name,
    email,
    phone,
    password : hashedPassword
  }

  let newUser = new User(user);

  newUser
    .save()
    .then(el => {
      return res.status(200).json({
        default_response: {
          success: true,
          errors: [ ],
          message: message.created
          },
        user: _.pick(el, ["name", "email", "_id", "phone"])
      });
    })
    .catch(err => {
      return res.status(200).json({ 
        default_response: {
          success: false,
          errors: [ String(err) ],
          message: message.server
          }
        });
    });
};
