"use strict";

var express = require('express');

var mustache = require('mustache-express');

var router = require('./routes/index');

var helpers = require('./helpers');

require('dotenv').config({
  path: 'variables.env'
});

var cookieParser = require('cookie-Parser');

var session = require('express-session');

var flash = require('express-flash');

var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy; //Configurações


var app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express["static"](__dirname + '/public'));
app.use(cookieParser(process.env.SECRET));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var User = require('./models/User');

app.use(flash()); //Helpers

app.use(function (req, res, next) {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user;
  next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use('/', router);
app.engine('mst', mustache(__dirname + '/views/partials', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname + '/views');
module.exports = app;