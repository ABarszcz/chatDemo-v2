var express = require('express');
var router = express.Router();

// link to the Account model
var Account = require('../models/account');
var passport = require('passport');

// auth check
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/login');
	}
}

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('index', { title: 'Chat Room Demo', user: req.user });
});

// added by takaaki goto
/* GET register page */
router.get('/register', function(req, res, next) {
	res.render('register', {
		title: 'Register',
		user: req.user,
		username: null,
		message: null
	});
});

/* POST register page */
router.post('/register', function(req, res, next) {
	// create account
	Account.register(new Account(
			{
				username: req.body.username,
				onlineStatus: 0
			}),
		req.body.password,
		function(err, account) {
			if (err) {
				console.log(err);
				res.render('register', {
										error: err,
										title: req.body.title,
										user: req.user,
										username: req.body.username,
										message: 'The user already exists'
									});
			} else {
				res.redirect('/login');
			}
		});
});

/* GET login page */
router.get('/login', function(req, res, next) {
	// get session messages if there are any
	var messages = req.session.messages || [];

	res.render('login', {
		title: 'Login',
		messages: messages,
		user: req.user
	});

	// clear the messages out of the session
	req.session.messages = null;
});

/* POST login page */
router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureMessage: 'Invalid Login'
}));

/* GET logout */
router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/login');
});
// added by takaaki goto


module.exports = router;