const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0e8a76066f427c",
    pass: "2187394a9a7b79"
  }



  },{
  from:` ${process.env.SMTP_NAME} <${process.env.SMTP_EMAIL}>`
});

exports.send = async (options)=> {

await transport.sendMail(options);

};