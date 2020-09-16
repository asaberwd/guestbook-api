/*!
 * Module dependencies
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

/**
 * user schema
 */

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  phone:{
    type: String,
    required: true,
    trim:true,
  },
  // common fields
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  deletedAt: {
    type: Date
  }
});

/**
 * Add
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */


/**
 * Statics
 */


/**
 * Register
 */

let User = mongoose.model("User", UserSchema);
module.exports = User;
