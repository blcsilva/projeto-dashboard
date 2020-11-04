const mongoose = require('mongoose');
const User = require('../models/User');
const crypto = require('crypto');
const mailHandler = require('../handlers/mailHandlers');
const { listIndexes } = require('../models/User');
require('dotenv').config({path:'variables.env'});

exports.login = (req, res) => {
res.render('login');

};

exports.register = (req, res) => {
    res.render('register');

};

exports.registerAction = (req,res) => {
    const newUser = new User(req.body);
    User.register(newUser, req.body.password,(error)=>{
if(error){
req.flash('error',"Ocorreu um erro,verifique os dados informados e tente novamente!");
res.redirect('/users/register');
return;
}

req.flash('sucess',"Cadastro efetuado com sucesso,verifique seu email!");
res.redirect('/users/login');

    });
};

exports.loginAction = (req,res) => {
 const auth = User.authenticate();

 auth(req.body.email ,req.body.password ,(error,result)=>{

  if(!result) {

    req.flash('error', "Login não efetuado,verifique seus dados e tente novamente!");
    res.redirect('/users/login');
    return;
  }


  req.login(result, ()=>{


  });
  req.flash('sucess', "Seja bem vindo ao painel administrativo!");
  res.redirect('/admin/dashboard');


 });
};



exports.adminDashboard = (req, res) => {
 res.render('adminDashboard');

};

exports.usersProfile = async (req, res,next) => {
   

   
        let responseJson = {
            users: []
        }
    
        const users = await User.find();
        responseJson.users = users;
        res.render('usersProfile',responseJson);
       
    };

    exports.profileEdit = (req, res) => {
    const name = req.params.name;
    const id = req.params.id;
    const email = req.params.email;
    
    
    
    res.render('profileEdit', {name,email,id});

    };

    exports.editAction = async (req, res) => {
       
        try {
               const user = await User.findOneAndUpdate(
                { _id:req.params.id},

                { profile:req.body.profile},
                {new:true, runValidators:true },

            );

            } catch (e){
            req.flash('error',"Ocorreu um erro,verifique seus dados e tente novamente!"+e.message);
            res.redirect('/admin/dashboard');
            return;
            }
             req.flash('success',"Seus dados foram atualizados com sucesso!");
             res.redirect('/admin/dashboard');

            };

        
    
        

exports.logoutAction = (req,res) => {
    req.logout();
    res.redirect('/')

};

exports.profile = (req, res) => {

res.render('profile')
};

exports.profileAction = async (req, res, next) => {
   
    try {
        
        const user = await User.findOneAndUpdate(
            { _id:req.user._id},
            { name:req.body.name, email:req.body.email},
            {new:true, runValidators:true },
            
        );
        } catch (e){
        req.flash('error',"Ocorreu um erro,verifique seus dados e tente novamente!"+e.message);
        res.redirect('/users/profile');
        return;
        }
         req.flash('success',"Seus dados foram atualizados com sucesso!");
         res.redirect('/users/profile')
    };


exports.forget = (req, res, next) => {
    res.render('forget');
};

exports.forgetAction = async (req, res, next) =>{
const user = await User.findOne({email:req.body.email}).exec();
if (!user) {
req.flash('error',"Um email foi enviado para você!")
res.redirect('/users/login');
return;

}
user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
user.resetPasswordExpires = Date.now() + 3600000;

await user.save();

const resetLink = `http://${req.headers.host}/users/reset/${user.resetPasswordToken}`;
const html = `Clique no link e altere sua senha:<br/><a href="${resetLink}">Alterar Senha</a>`;
const text = `Clique no link e altere sua senha: ${resetLink}`;

mailHandler.send({
to:user.email,
subject: 'Altere sua senha!',
html,
text,


});


req.flash('sucess',`Um email foi enviado para você!` +resetLink);
console.log(resetLink);
res.redirect('/users/login');
return;
};

exports.forgetToken = async (req, res, next) =>{

    const user = await User.findOne({
    resetPasswordToken:req.params.token,
    resetPasswordExpires:{ $gt:Date.now()}
    }).exec();

    if(!user){

    req.flash('error',"Token Expirado!");
    res.redirect('/users/forget');
    return;
    }

    res.render('forgetPassword');




};

exports.forgetTokenAction = async (req,res) => {
    const user = await User.findOne({
        resetPasswordToken:req.params.token,
        resetPasswordExpires:{ $gt:Date.now()}
        }).exec();
    
        if(!user){
    
        req.flash('error',"Token Expirado!");
        res.redirect('/users/forget');
        return;
        }

        if (req.body.password != req.body['password-confirm']) {
            req.flash('error',"Suas senhas não conferem,verifique seus dados e tente novamente");
            res.redirect('back');
            return;
           }
         
           user.setPassword(req.body.password, async ()=> {
           await user.save()
         
           req.flash('error',"Suas senha foi alterada com sucesso!");
           res.redirect('/users/login');
         
         
           });

           exports.loginPost = function(req, res, next) {
            req.assert('email', 'Email is not valid').isEmail();
            req.assert('email', 'Email cannot be blank').notEmpty();
            req.assert('password', 'Password cannot be blank').notEmpty();
            req.sanitize('email').normalizeEmail({ remove_dots: false });
         
            // Check for validation erro
            var errors = req.validationErrors();
            if (errors) return res.status(400).send(errors);
         
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) return res.status(401).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});
         
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (!isMatch) return res.status(401).send({ msg: 'Invalid email or password' });
         
                    // Make sure the user has been verified
                    if (!user.isVerified) return res.status(401).send({ type: 'not-verified', msg: 'Your account has not been verified.' }); 
         
                    // Login successful, write token, and send back user
                    res.send({ token: generateToken(user), user: user.toJSON() });
                });
            });
        };
        /**
* POST /signup
*/
exports.signupPost = function(req, res, next) {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.sanitize('email').normalizeEmail({ remove_dots: false });
  
    // Check for validation errors    
    var errors = req.validationErrors();
    if (errors) { return res.status(400).send(errors); }
  
    // Make sure this account doesn't already exist
    User.findOne({ email: req.body.email }, function (err, user) {
  
      // Make sure user doesn't already exist
      if (user) return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
  
      // Create and save the user
      user = new User({ name: req.body.name, email: req.body.email, password: req.body.password });
      user.save(function (err) {
          if (err) { return res.status(500).send({ msg: err.message }); }
  
          // Create a verification token for this user
          var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
  
          // Save the verification token
          token.save(function (err) {
              if (err) { return res.status(500).send({ msg: err.message }); }
  
              // Send the email
              var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
              var mailOptions = { from: 'no-reply@yourwebapplication.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
              transporter.sendMail(mailOptions, function (err) {
                  if (err) { return res.status(500).send({ msg: err.message }); }
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
    req.sanitize('email').normalizeEmail({ remove_dots: false });
 
    // Check for validation errors    
    var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
 
    // Find a matching token
    Token.findOne({ token: req.body.token }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
 
        // If we found a token, find a matching user
        User.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
};

exports.resendTokenPost = function (req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
 
    // Check for validation errors    
    var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
 
    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });
 
        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
 
        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
 
            // Send the email
            var transporter = nodemailer.createTransport({ service: '', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
            var mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });
 
    });
};

};
