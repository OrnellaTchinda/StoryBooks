const path = require('path')
const express = require("express")
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const morgan = require("morgan") //for logging
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')
const { startSession } = require('./models/User')


//Load config
dotenv.config({ path: './config/config.env' })

//passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//Body parser
app.use(express.urlencoded({ extended: false })) //bodyparser middleware
app.use(express.json())


//Method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

//logging so it shows the http method
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')


//handlebars
app.engine(
    '.hbs',
    exphbs.engine({
        helpers: {
            formatDate,
            stripTags,
            truncate,
            editIcon,
            select,
        },
        defaultLayout: 'main',
        extname: '.hbs'
    }));// important to put exphbs.engine for it to work and to avoid the error TypeError: exphbs is not a function at Object.<anonymous>
app.set('view engine', '.hbs');


//Sessions It has to be before passport middleware
app.use(
    session({
        secret: 'keyboard cat',
        resave: false, //we don't want to save the session if nothing is modified
        saveUninitialized: false,//don't create a session unless something is stored
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }) //to store in the database 

    }))


//set the passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})// to help us to access user from within our templates


//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


const PORT = process.env.PORT || 5000

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)