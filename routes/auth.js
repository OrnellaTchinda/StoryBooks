//any app that is not follow with something. All the ones with /

//in other to use this file, go to app.js to link our router file

const express = require('express')
const passport = require('passport') //in this case it's the passport dependency and not the file
const router = express.Router()

//@description   Auth with Google
//@route Get request to/auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))
//limiting the scope to the profile to bring that in and use it in our app

//@description   Google auth callback
//@route Get request to /auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        res.redirect('/dashboard')
    } //if we are unable to log in, we need to make sure that the user is redirected to the homepage and if successful pass them to the dashboard
)

// @descr logout user
//@route /auth/logout
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        res.redirect('/')
    })
    // req.logout(function (err) {
    //     if (err) { return next(err); }
    //     res.redirect('/');
    // });
})

module.exports = router //make sure to export the router