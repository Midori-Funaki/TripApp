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
        console.log("User not yet authorize redirect to /login");
        res.status(302).redirect('/login');
    }
    
    router.get('/login', (req, res) => {
        res.render('login');
    })

    router.post('/login', passport.authenticate('local-login', {
        failureRedirect: '/'
    }), (req, res) => {
        console.log(req.body.username);
        res.status(302).redirect('/');
    })

    router.get('/facebook', passport.authenticate('facebook', {
        scope: ['user_friends', 'manage_pages']
    }));

    router.get('/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/login'
    }), (req, res) => {
        console.log(req.isAuthenticated());
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
        
        if (password === password_confirmation) {
            User.findOne({
                where: {
                    [Sequelize.Op.or]: [{'email': email},{'username': username}]
                }
            }).then((user) => {
                if (user) {
                    res.send("Username/Email already taken")
                } else {
                    bcrypt.hashPassword(password).then(hash => {
                        const newUser = {
                            username: username,
                            email: email,
                            password: hash
                        }

                        User.create(newUser).then((newUser) => {
                            console.log("successful created user");
                            res.redirect('/')
                        }).catch((err) => {
                            res.send(err);
                        })
                    })
                }
            })
        } else {
            res.send("Password not matching");
        }
    })

    return router;
}