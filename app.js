require('dotenv').config(); // reads .env file and sets env variables in process.env object

//implemnting express
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');

const app = express();
const PORT = 5000 || process.env.PORT; // port number or use default port number for the any other server

// connect to db
connectDB(); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI}),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));



//setting public files
app.use(express.static('public'));

//template engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', './layouts/main');


app.locals.isActiveRoute = isActiveRoute; 


const mainPage = require('./server/routes/main');
app.use('/', mainPage);
app.use('/', require(`./server/routes/admin`))

app.listen(PORT, () => {
    console.log(`listening for port ${PORT}`);  
})
