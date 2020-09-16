const _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./../models/user");

const { validateUser } = require("./../../helper/validate");
const { hashing } = require("../../helper/hashing");
const { generatetoken } = require("../../helper/generateToken");

const message = require("./../../constants/responseMessages")

// add new user
exports.addUser = async function(req, res) {
  
  // validating user attr using joi
  let error = await validateUser(req.body);
  if (error) {
    let er = error.details[0].message.replace(/\"/g, "")
    return res.status(400).json({
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

    return res.status(409).json({
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
      return res.status(500).json({ 
        default_response: {
          success: false,
          errors: [ String(err) ],
          message: message.server
          }
        });
    });
};


// user login
exports.login = async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
  
    if(!email || !password){
      return res.status(400).json({ 
        default_response: {
          success: false,
          errors: [ "email or password not exist" ],
          message: message.validation
          }
       });
    }
  
    // Find user by email
    User.findOne({ email })
      .then(user => {
        // Check if user exists
        if (!user) {
          return res.status(401).json({ 
            default_response: {
              success: false,
              errors: [ "email does not exist" ],
              message: message.validation
              }
           });
        }
        // Check password
        bcrypt.compare(password, user.password).then( isMatch => {
          if (isMatch) {
            // Create JWT Payload
            const payload = {
              id: user.id,
              name: user.name,
              email: user.email
            };

            let tokenObj = generatetoken(payload)
            .then(()=>{
              // response succesfully
              return res.status(200).json({
                default_response: {
                  success: true,
                  errors: [],
                  message: message.retrieved
                },
                user:{_id:user._id, name:user.name, email:user.email, phone:user.phone, isProfileCompleted: user.isProfileCompleted },
                token: tokenObj.token
              });
            }).catch((err)=>{
              return res.status(500).json({ 
                default_response: {
                  success: false,
                  errors: [ "problem saving token" ],
                  message: message.validation
                }
               });
            })
          } else {
            return res.status(401).json({ 
              default_response: {
                success: false,
                errors: ["problem with password"],
                message: message.validation
              }
             });
          }
        });
      })
      .catch(err => {
        console.log('from catch', err)
        return res.status(500).json({
        default_response: {
          success: false,
          errors: [ String(err) ],
          message: message.server
        }
      });
      });
  };