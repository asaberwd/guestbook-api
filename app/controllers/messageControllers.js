
const Message = require("./../models/message");

const { validateMessage } = require("./../../helper/validate");
const { idFromToken } = require("../../helper/idFromToken")
const message = require("./../../constants/responseMessages")
const { validateId } = require("./../../helper/validateId");


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

exports.createReply = async function (req, res) {
const { reply, messageId } = req.body
    if(reply && messageId){

       try  {
        const user = idFromToken(req)

           let message = await Message.findOneAndUpdate({_id:messageId}, { $push: {replies:{reply, user } }  },
            {  rawResult: true    })
           if(message.lastErrorObject.updatedExisting){
            return res.status(200).json({
                default_response: {
                    success: true,
                    errors: [ ],
                    message: message.created
                    }
                });
           } else {
            return res.status(400).json({
                default_response: {
                success: false,
                errors: [  "message does not exist"  ],
                message: message.validation
                }});
           }

       }catch(err){
        return res.status(400).json({ 
            default_response: {
                success: false,
                errors: [ String(err) ],
                message: message.server
            }
            });
       }
    }

}

// view all messages
exports.viewMessages = async function(req, res) {
    let query = {isActive:true}
    let opt
    let page = parseInt(req.query.page)
    let count = parseInt(req.query.count)

    if (page && count) opt = { skip: count*(page -1) , limit: count }
    
    Message.find(query, null, opt)
    .sort({ createdAt:-1 })
      .then(el => {
        return res.status(200).json({ 
            default_response: {
                success: true,
                errors: [ ],
                message: message.retrieved
                },
                messages:el
            });    
      })
      .catch(err => {
        console.log(err);
        return res.status(200).json({ 
            default_response: {
                success: false,
                errors: [ String(err) ],
                message: message.server
                }
            });      
        });
  
}


// delete message by id
exports.deleteMessage = async (req, res) => {
    // check if id is valid or not
    const id = req.params.id;
    let error = !validateId(id);
    if (error) {
      // when id is not valid send error
      return res.status(200).json({ 
          default_response: {
              success: false,
              errors: [ "unvalid id" ],
              message: message.validation
              }
          }); 
    }

    try {
        // delete message
        const user = idFromToken(req)
        let deleted = await Message.findOneAndUpdate({_id:id, user, isActive:true }, {
        isActive: false,
        deletedAt: Date.now()
        }, {  rawResult: true , new: true     });
      if(!deleted.lastErrorObject.updatedExisting){ 
          return res.status(400).json({ 
              default_response: {
                  success: false,
                  errors: [ "you can not delete others or deleted messages" ],
                  message: message.validation
              }
          }); 
      }
    
      return res.status(200).json({ 
        default_response: {
            success: true,
            errors: [ ],
            message: message.deleted
            }
        });
    } catch (err){
        return res.status(400).json({ 
            default_response: {
                success: false,
                errors: [ String(err) ],
                message: message.server
            }
            });
    }
    
    
};


// update message by id
exports.updateMessage = async (req, res) => {
    let id = req.params.id;
  
    let idError = !validateId(id);
    if (idError) {
      // when id is not valid send error
      return res.status(200).json({ 
        default_response: {
            success: false,
            errors: [ "unvalid message id" ],
            message: message.validation
            }
        });
    }

    try {
        // update message
        const user = idFromToken(req)
        let updated = await Message.findOneAndUpdate({_id:id, user, isActive:true }, {
        text:req.body.text,
        updatedAt: Date.now()
        }, {  rawResult: true , new: true     });
      if(!updated.lastErrorObject.updatedExisting){ 
          return res.status(400).json({ 
              default_response: {
                  success: false,
                  errors: [ "you can not update others messages or non existed messages" ],
                  message: message.validation
              }
          }); 
      }
    
      return res.status(200).json({ 
        default_response: {
            success: true,
            errors: [ ],
            message: message.updated
            }
        });
    } catch (err){
        return res.status(400).json({ 
            default_response: {
                success: false,
                errors: [ String(err) ],
                message: message.server
            }
            });
    }
  
    
  };