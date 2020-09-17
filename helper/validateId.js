const mongoose = require("mongoose");

const validateId = id => {
  const result = mongoose.Types.ObjectId.isValid(id);
  return result;
};


module.exports = {
  validateId
};
