const passport = require('passport');
const Models = require("../models");
const User = Models.users;
const bcrypt = require('../bcrypt');
const Sequelize = require('sequelize');
const bodyParser = require("body-parser");

module.exports = (express) => {
    const router = express.Router();
     /** user login */
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', "User not yet authorize");
        res.status(302).redirect('/');
    }

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true,
        successFlash: 'Login successful!'
    }), (req, res) => {
        res.redirect('/');
    })

    router.get('/facebook', passport.authenticate('facebook', {
        scope: ['user_friends', 'manage_pages']
    }));

    router.get('/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true,
        successFlash: 'Login successful!'
    }), (req, res) => {
        res.redirect('/');
    })

    /** user sign up */
    router.get('/signup', (req, res) => {
        res.render('signup');
    })

    router.post('/user', (req, res) => {
        let username = req.body.username,
        email = req.body.email,
        password = req.body.password,
        password_confirmation = req.body.password_confirmation
        
        if (username && email && password && password_confirmation) {
            if (password === password_confirmation) {
                User.findOne({
                    where: {
                        [Sequelize.Op.or]: [{'email': email},{'username': username}]
                    }
                }).then((user) => {
                    if (user) {
                        req.flash('error_msg', 'Username/Email already taken!');
                        res.redirect('/')
                    } else {
                        bcrypt.hashPassword(password).then(hash => {
                            const newUser = {
                                username: username,
                                email: email,
                                password: hash
                            }

                            User.create(newUser).then((newUser) => {
                                req.flash('success_msg', 'Successful registered!');
                                res.redirect('/')
                            }).catch((err) => {
                                res.send(err);
                            })
                        })
                    }
                })
            } else {
                req.flash('error_msg', 'Password not matching');
                res.redirect('/');
            }
        } else {
            req.flash('error_msg', 'Please fill in correct information');
            res.redirect('/');
        }
    })

    return router;
}