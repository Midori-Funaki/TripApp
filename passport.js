const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Models = require('./models');
const User = Models.users;
const bcrypt = require("./bcrypt");
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use('local-login', new localStrategy(
        (email, password, done) => {
            User.findOne({
                where: {
                    'email': email
                }
            }).then((user) => {
                if (user === null) {
                    return done(null, false, { message: 'User not found!' });
                }

                bcrypt.checkPassword(password, user.password).then(result => {
                    if(result) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Invalid password!'});
                    }
                }).catch(err => done(err, false, { message: 'Invalid information'}));
            }).catch((err) => {
                return done(err, false, { message: 'Invalid information'});
            })
        }
    ))

    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                where: {
                    'facebookId': profile.id
                }
            }).then((user) => {
                if (user) {
                    console.log('user is: '+ user);
                    return done(null, user);
                } else {
                    bcrypt.hashPassword(profile.id).then(hash => {
                        let newUser = {
                            username: profile.displayName,
                            email: profile.id+"@facebook.com",
                            facebookId: profile.id,
                            password: hash
                        }

                        User.create(newUser).then((newUser) => {
                            return done(null, newUser)
                        }).catch((err) => {
                            console.log(err);
                        })
                    })
                }
            }).catch((err) => {
                return done(err, false, { message: 'Invalid information'});
            })
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser((id, done) => {
        User.findOne({
            where: {
                "id": id
            }
        }).then((user) => {
            if (user === null) {
                return done(err, false, { message: 'Invalid user ID'});
            }
            done(null, user);
        })
    })
}