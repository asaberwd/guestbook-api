const jwt = require('jsonwebtoken')


exports.idFromToken = function(req){

    let token = req.headers['authorization']
    token = token.substr(7)
    let decoded = jwt.decode(token);
    return decoded.id
}
