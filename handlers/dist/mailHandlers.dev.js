"use strict";

var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0e8a76066f427c",
    pass: "2187394a9a7b79"
  }
}, {
  from: " ".concat(process.env.SMTP_NAME, " <").concat(process.env.SMTP_EMAIL, ">")
});

exports.send = function _callee(options) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(transport.sendMail(options));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};