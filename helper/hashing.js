const bcrypt = require('bcryptjs')

exports.hashing = (password)=>{
    let hashedpass = bcrypt.hashSync(password.trim(), 10)
    return hashedpass
}
