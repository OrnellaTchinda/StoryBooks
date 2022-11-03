//any app that is not follow with something. All the ones with /

//in other to use this file, go to app.js to link our router file

const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/Story') // to bring in our model


//@description   Show add page
//@route Get request to/stories/add

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

//@description   Process add form
//@route Post request to /stories

router.post('/', ensureAuth, async (req, res) => {
    try {

        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

//@description   Show all stories
//@route Get request to/stories

router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        res.render('stories/index', { stories, })

    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

//@description   Show single page
//@route Get request to/stories/:id

router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean()

        if (!story) {
            return res.render('error/404')
        }

        res.render('stories/show', {
            story
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})


//@description   Show edit page
//@route Get request to/stories/edit/:id

router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()

        if (!story) { // if the story is not there, show error page
            return res.render('error/404')
        }

        if (story.user != req.user.id) { //if the story user is not the same as the user logged in
            res.redirect('/stories')
        } else {
            res.render('stories/edit', {
                story,
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }

})

//@description   Update stories
//@route PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {//if the story user is not the same as the user logged in
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,//creat a new one if it doesn't exist
                runValidators: true,//check if our mongoose field are valid
            })

            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})


//@description   Delete story
//@route DELETE to/stories/:id

router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})


//@description   User stories
//@route GET to/stories/user/:userId

router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
            .populate('user')
            .lean()
        res.render('stories/index', {
            stories
        })
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})


module.exports = router 