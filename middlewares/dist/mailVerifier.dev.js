"use strict";

nev.configure({
  verificationURL: 'http://localhost/email-verification/${URL}',
  persistentUserModel: User,
  tempUserCollection: 'dashboard_tempusers',
  transportOptions: {
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "0e8a76066f427c",
      pass: "2187394a9a7b79"
    }
  },
  verifyMailOptions: {
    from: 'Do Not Reply <myawesomeemail_do_not_reply@gmail.com>',
    subject: 'Please confirm account',
    html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
    text: 'Please confirm your account by clicking the following link: ${URL}'
  }
}, function (error, options) {});