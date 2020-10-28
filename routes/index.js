const express = require('express');
const homeController = require('../controllers/homeController');
const usersController = require('../controllers/usersController');
const aboutController = require('../controllers/aboutController')
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();



router.get('/', homeController.index);

router.get('/users/login', usersController.login);

router.post('/users/login', usersController.loginAction);

router.get('/users/logout', usersController.logoutAction);

router.get('/users/register',usersController.register);

router.get('/users/profile',authMiddleware.isLogged,usersController.profile);


router.post('/users/register',usersController.registerAction);

router.get('/admin/dashboard',usersController.adminDashboard);

router.post('/users/profile',authMiddleware.isLogged,usersController.profileAction);

router.post('/profile/password',authMiddleware.isLogged,authMiddleware.changePassword);

router.get('/users/forget',usersController.forget);
router.post('/users/forget',usersController.forgetAction);

router.get('/users/reset/:token',usersController.forgetToken);
router.get('/sobre', aboutController.sobre);






module.exports = router;

