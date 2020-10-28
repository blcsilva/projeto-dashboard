"use strict";

var User = require('../models/User');

var crypto = require('crypto');

var mailHandler = require('../handlers/mailHandlers');

require('dotenv').config({
  path: 'variables.env'
});

exports.login = function (req, res) {
  res.render('login');
};

exports.register = function (req, res) {
  res.render('register');
};

exports.registerAction = function (req, res) {
  var newUser = new User(req.body);
  User.register(newUser, req.body.password, function (error) {
    if (error) {
      req.flash('error', "Ocorreu um erro,verifique os dados informados e tente novamente!");
      res.redirect('/users/register');
      return;
    }

    req.flash('sucess', "Cadastro efetuado com sucesso,verifique seu email!");
    res.redirect('/users/login');
  });
};

exports.loginAction = function (req, res) {
  var auth = User.authenticate();
  auth(req.body.email, req.body.password, function (error, result) {
    if (!result) {
      req.flash('error', "Login não efetuado,verifique seus dados e tente novamente!");
      res.redirect('/users/login');
      return;
    }

    req.login(result, function () {});
    req.flash('sucess', "Seja bem vindo ao painel administrativo!");
    res.redirect('/admin/dashboard');
  });
};

exports.adminDashboard = function (req, res) {
  res.render('adminDashboard');
};

exports.logoutAction = function (req, res) {
  req.logout();
  res.redirect('/');
};

exports.profile = function (req, res) {
  res.render('profile');
};

exports.profileAction = function _callee(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            _id: req.user._id
          }, {
            name: req.body.name,
            email: req.body.email
          }, {
            "new": true,
            runValidators: true
          }));

        case 3:
          user = _context.sent;
          _context.next = 11;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          req.flash('error', "Ocorreu um erro,verifique seus dados e tente novamente!" + _context.t0.message);
          res.redirect('/users/profile');
          return _context.abrupt("return");

        case 11:
          req.flash('success', "Seus dados foram atualizados com sucesso!");
          res.redirect('/users/profile');

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.forget = function (req, res, next) {
  res.render('forget');
};

exports.forgetAction = function _callee2(req, res, next) {
  var user, resetLink, html, text;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }).exec());

        case 2:
          user = _context2.sent;

          if (user) {
            _context2.next = 7;
            break;
          }

          req.flash('error', "Um email foi enviado para você!");
          res.redirect('/users/login');
          return _context2.abrupt("return");

        case 7:
          user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
          user.resetPasswordExpires = Date.now() + 3600000;
          _context2.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          resetLink = "http://".concat(req.headers.host, "/users/reset/").concat(user.resetPasswordToken);
          html = "Clique no link e altere sua senha:<br/><a href=\"".concat(resetLink, "\">Alterar Senha</a>");
          text = "Clique no link e altere sua senha: ".concat(resetLink);
          mailHandler.send({
            to: user.email,
            subject: 'Altere sua senha!',
            html: html,
            text: text
          });
          req.flash('sucess', "Um email foi enviado para voc\xEA!" + resetLink);
          console.log(resetLink);
          res.redirect('/users/login');
          return _context2.abrupt("return");

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.forgetToken = function _callee3(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {
              $gt: Date.now()
            }
          }).exec());

        case 2:
          user = _context3.sent;

          if (user) {
            _context3.next = 7;
            break;
          }

          req.flash('error', "Token Expirado!");
          res.redirect('/users/forget');
          return _context3.abrupt("return");

        case 7:
          res.render('forgetPassword');

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.forgetTokenAction = function _callee5(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {
              $gt: Date.now()
            }
          }).exec());

        case 2:
          user = _context5.sent;

          if (user) {
            _context5.next = 7;
            break;
          }

          req.flash('error', "Token Expirado!");
          res.redirect('/users/forget');
          return _context5.abrupt("return");

        case 7:
          if (!(req.body.password != req.body['password-confirm'])) {
            _context5.next = 11;
            break;
          }

          req.flash('error', "Suas senhas não conferem,verifique seus dados e tente novamente");
          res.redirect('back');
          return _context5.abrupt("return");

        case 11:
          user.setPassword(req.body.password, function _callee4() {
            return regeneratorRuntime.async(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return regeneratorRuntime.awrap(user.save());

                  case 2:
                    req.flash('error', "Suas senha foi alterada com sucesso!");
                    res.redirect('/users/login');

                  case 4:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          });

          exports.loginPost = function (req, res, next) {
            req.assert('email', 'Email is not valid').isEmail();
            req.assert('email', 'Email cannot be blank').notEmpty();
            req.assert('password', 'Password cannot be blank').notEmpty();
            req.sanitize('email').normalizeEmail({
              remove_dots: false
            }); // Check for validation erro

            var errors = req.validationErrors();
            if (errors) return res.status(400).send(errors);
            User.findOne({
              email: req.body.email
            }, function (err, user) {
              if (!user) return res.status(401).send({
                msg: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'
              });
              user.comparePassword(req.body.password, function (err, isMatch) {
                if (!isMatch) return res.status(401).send({
                  msg: 'Invalid email or password'
                }); // Make sure the user has been verified

                if (!user.isVerified) return res.status(401).send({
                  type: 'not-verified',
                  msg: 'Your account has not been verified.'
                }); // Login successful, write token, and send back user

                res.send({
                  token: generateToken(user),
                  user: user.toJSON()
                });
              });
            });
          };
          /**
          * POST /signup
          */


          exports.signupPost = function (req, res, next) {
            req.assert('name', 'Name cannot be blank').notEmpty();
            req.assert('email', 'Email is not valid').isEmail();
            req.assert('email', 'Email cannot be blank').notEmpty();
            req.assert('password', 'Password must be at least 4 characters long').len(4);
            req.sanitize('email').normalizeEmail({
              remove_dots: false
            }); // Check for validation errors    

            var errors = req.validationErrors();

            if (errors) {
              return res.status(400).send(errors);
            } // Make sure this account doesn't already exist


            User.findOne({
              email: req.body.email
            }, function (err, user) {
              // Make sure user doesn't already exist
              if (user) return res.status(400).send({
                msg: 'The email address you have entered is already associated with another account.'
              }); // Create and save the user

              user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
              });
              user.save(function (err) {
                if (err) {
                  return res.status(500).send({
                    msg: err.message
                  });
                } // Create a verification token for this user


                var token = new Token({
                  _userId: user._id,
                  token: crypto.randomBytes(16).toString('hex')
                }); // Save the verification token

                token.save(function (err) {
                  if (err) {
                    return res.status(500).send({
                      msg: err.message
                    });
                  } // Send the email


                  var transporter = nodemailer.createTransport({
                    service: 'Sendgrid',
                    auth: {
                      user: process.env.SENDGRID_USERNAME,
                      pass: process.env.SENDGRID_PASSWORD
                    }
                  });
                  var mailOptions = {
                    from: 'no-reply@yourwebapplication.com',
                    to: user.email,
                    subject: 'Account Verification Token',
                    text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n'
                  };
                  transporter.sendMail(mailOptions, function (err) {
                    if (err) {
                      return res.status(500).send({
                        msg: err.message
                      });
                    }

                    res.status(200).send('A verification email has been sent to ' + user.email + '.');
                  });
                });
              });
            });
          };

          exports.confirmationPost = function (req, res, next) {
            req.assert('email', 'Email is not valid').isEmail();
            req.assert('email', 'Email cannot be blank').notEmpty();
            req.assert('token', 'Token cannot be blank').notEmpty();
            req.sanitize('email').normalizeEmail({
              remove_dots: false
            }); // Check for validation errors    

            var errors = req.validationErrors();
            if (errors) return res.status(400).send(errors); // Find a matching token

            Token.findOne({
              token: req.body.token
            }, function (err, token) {
              if (!token) return res.status(400).send({
                type: 'not-verified',
                msg: 'We were unable to find a valid token. Your token my have expired.'
              }); // If we found a token, find a matching user

              User.findOne({
                _id: token._userId,
                email: req.body.email
              }, function (err, user) {
                if (!user) return res.status(400).send({
                  msg: 'We were unable to find a user for this token.'
                });
                if (user.isVerified) return res.status(400).send({
                  type: 'already-verified',
                  msg: 'This user has already been verified.'
                }); // Verify and save the user

                user.isVerified = true;
                user.save(function (err) {
                  if (err) {
                    return res.status(500).send({
                      msg: err.message
                    });
                  }

                  res.status(200).send("The account has been verified. Please log in.");
                });
              });
            });
          };

          exports.resendTokenPost = function (req, res, next) {
            req.assert('email', 'Email is not valid').isEmail();
            req.assert('email', 'Email cannot be blank').notEmpty();
            req.sanitize('email').normalizeEmail({
              remove_dots: false
            }); // Check for validation errors    

            var errors = req.validationErrors();
            if (errors) return res.status(400).send(errors);
            User.findOne({
              email: req.body.email
            }, function (err, user) {
              if (!user) return res.status(400).send({
                msg: 'We were unable to find a user with that email.'
              });
              if (user.isVerified) return res.status(400).send({
                msg: 'This account has already been verified. Please log in.'
              }); // Create a verification token, save it, and send email

              var token = new Token({
                _userId: user._id,
                token: crypto.randomBytes(16).toString('hex')
              }); // Save the token

              token.save(function (err) {
                if (err) {
                  return res.status(500).send({
                    msg: err.message
                  });
                } // Send the email


                var transporter = nodemailer.createTransport({
                  service: '',
                  auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                  }
                });
                var mailOptions = {
                  from: 'no-reply@codemoto.io',
                  to: user.email,
                  subject: 'Account Verification Token',
                  text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n'
                };
                transporter.sendMail(mailOptions, function (err) {
                  if (err) {
                    return res.status(500).send({
                      msg: err.message
                    });
                  }

                  res.status(200).send('A verification email has been sent to ' + user.email + '.');
                });
              });
            });
          };

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  });
};