//any app that is not follow with something. All the ones with /

//in other to use this file, go to app.js to link our router file

const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story') // to bring in our model


//@description   Login/Landing page
//@route Get request to/

router.get('/', ensureGuest, (req, res) => { //only a guest can see, someone who is not logged in
    res.render('login', {
        layout: 'login',
    }) //send some text to the client saying login
})

//@description   Dashboard
//@route Get request to /dashboard


router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        console.log(req.user.id)
        console.log(req.user.firstName)
        console.log(stories)
        res.render('dashboard', {
            name: req.user.firstName,
            stories,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// router.get('/dashboard', ensureAuth, async (req, res) => {
//     try {
//         const stories = await Story.find({ user: req.user.id }).lean() //.lean() to pass in data to a handlebar template and render it as a json object. limit to the user logged in we use user:req.user.id
//         console.log(req.user.firstName)
//         res.render('dashboard', {
//             name: req.user.firstName,
//             stories
//         })
//     } catch (err) {
//         console.error(err)
//         res.render('error/500')
//     }
// res.render('dashboard', {
//     name: req.user,

// }), console.log("email:" + JSON.stringify(user.user.firstName)) //send some text to the client saying login and make layout false as if there is no layout folder.Maybe I will need to find a way to connect my layout folder here
//})
//make sure to export the router
module.exports = router 