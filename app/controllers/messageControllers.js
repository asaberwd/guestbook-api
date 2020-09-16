
const Message = require("./../models/message");

const { validateMessage } = require("./../../helper/validate");
const { idFromToken } = require("../../helper/idFromToken")
const message = require("./../../constants/responseMessages")


exports.createMessage = async function (req, res) {
    
  // validating message attr using joi
  let error = await validateMessage(req.body);
  if (error) {
    let er = error.details[0].message.replace(/\"/g, "")
    return res.status(400).json({
      default_response: {
      success: false,
      errors: [  er  ],
      message: message.validation
      }});
  }

    const user = idFromToken(req)
console.log('ddd', user, req.body.text)
    let messageData = {
        user,
        text:req.body.text
    }
    
    let newMessage = new Message(messageData);
    
    try{
        let el = await newMessage.save()

        return res.status(200).json({
        default_response: {
            success: true,
            errors: [ ],
            message: message.created
            }
        });

    }
    catch (err) {
        return res.status(400).json({ 
        default_response: {
            success: false,
            errors: [ String(err) ],
            message: message.server
            }
        });
    };

}