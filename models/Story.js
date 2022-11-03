const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true //trim the white space
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private'] //list of possible values of the status. So either public or value
    },
    user: { //we need to know who did what; user connected to each story
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',//to connect to the user model
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now

    }
})

module.exports = mongoose.model('Story', StorySchema)