"use strict";

module.exports.isLogged = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('error', 'Ops! Você não tem permissão para este acesso!');
    res.redirect('/users/login');
    return;
  }

  next();
};

module.exports.changePassword = function (req, res, next) {
  if (req.body.password != req.body['password-confirm']) {
    req.flash('error', "Suas senhas não conferem,verifique seus dados e tente novamente");
    res.redirect('/users/profile');
    return;
  }

  req.user.setPassword(req.body.password, function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(req.user.save());

          case 2:
            req.flash('success', "sua senha foi alterada com sucesso!");
            res.redirect('/');

          case 4:
          case "end":
            return _context.stop();
        }
      }
    });
  });
};