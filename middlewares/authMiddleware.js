module.exports.isLogged = (req, res, next) => {
  if (!req.isAuthenticated()) {
      req.flash('error','Ops! Você não tem permissão para este acesso!')
      res.redirect('/users/login');
      return;
  }

  next();

};

module.exports.changePassword = (req, res, next) => {
  if (req.body.password != req.body['password-confirm']) {
   req.flash('error',"Suas senhas não conferem,verifique seus dados e tente novamente");
   res.redirect('/users/profile');
   return;
  }

  req.user.setPassword(req.body.password, async ()=> {
   await req.user.save()

 req.flash('success',"sua senha foi alterada com sucesso!");
 res.redirect('/');


  });
}