const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value
            }

            try {
                let user = await User.findOne({ googleId: profile.id })
                if (user) {
                    done(null, user)
                } else {
                    user = await User.create(newUser)
                    done(null, user)
                }
            } catch (err) {
                console.error(err)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}
    //     //making sure we are able to pass the userId where it need it to go hiding or showing the userId so we can look it up against the DB
    // passport.serializeUser(function (user, cb) {
    //     process.nextTick(function () {
    //         return cb(null, {
    //             id: user.id,
    //             username: user.username,
    //             picture: user.picture
    //         });
    //     });
    // });

    //     // passport.serializeUser(function (user, done) {
    //     //     done(null, user.id)
    //     // })

    // passport.deserializeUser(function (id, done) {
    //     User.findById(id, function (err, user) {
    //         done(err, user);
    //     });
    // });
    //     passport.deserializeUser(function (user, cb) {
    //         process.nextTick(function () {
    //             return cb(null, user);
    //         });
    //     });

//}