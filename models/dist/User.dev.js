"use strict";

require("express");

var mongoose = require('mongoose');

var passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;
var userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  name: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  roles: [String],
  confirmation_code: String,
  isVerified: {
    type: Boolean,
    "default": false
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
}, {
  timestamps: true
});
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});
module.exports = mongoose.model('User', userSchema);