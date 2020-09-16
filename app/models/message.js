/*!
 * Module dependencies
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/**
 * message schema
 */

const MessageSchema = new Schema({
  text:{
    type: String,
    required: true
  },
  replies:[{
    type: String
  }],
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
    },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
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

let Message = mongoose.model('Message', MessageSchema);
module.exports = Message