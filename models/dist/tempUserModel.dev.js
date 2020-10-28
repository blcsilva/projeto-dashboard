"use strict";

require("express");

var mongoose = require('mongoose');

var nev = require('email-verification')(mongoose);

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
  GENERATED_VERIFYING_URL: String,
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  roles: [String],
  confirmation_code: String,
  confirmed: {
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
module.exports = mongoose.model('tempUser', userSchema);