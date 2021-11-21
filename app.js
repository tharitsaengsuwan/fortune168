// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }
require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const mysql = require('mysql2');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const MongoDBStore = require('connect-mongo')
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const fortuneTellersRoutes = require('./routes/fortuneTellers');
const schedulesRoutes = require('./routes/schedules')
const extrainfotypesRoutes = require('./routes/extraInfoTypes');
const extrainfoRoutes = require('./routes/extrainfo');

const dbUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/fortune168';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false
})
const db = mongoose.connection;
db.on("error ", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Mongo database connected!");
})

const pool = mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    database: process.env.SQL_DATABASE,
    password: process.env.SQL_PASSWORD
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

////////////////////////////////////////////////////////////////////////////////////////////////
const secret = process.env.SECRET || 'thisshouldbeasecret!';
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 60 * 60 * 24
});

store.on('error', function(e) {
    console.log("SESSION STORE ERROR ", e)
})

app.set('trust proxy', 1)
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: (process.env.NODE_ENV !== "production") ? false : true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.pool = pool;

app.use('/fortuneTellers', fortuneTellersRoutes);

app.use('/', userRoutes);

app.use('/schedules', schedulesRoutes);

app.use('/extrainfotypes', extrainfotypesRoutes);

app.use('/extrainfo', extrainfoRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Oh No! Something went wrong!!!'
    res.status(status).render('error', { err });
})

app.listen(3000, (req, res) => {
    console.log('listening on port 3000');
})