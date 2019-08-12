const express = require('express');
    session = require('express-session'),
    FileStore = require('session-file-store')(session),
    path = require('path');
    cookieParser = require('cookie-parser');
    logger = require('morgan');
    cors = require('cors');

const indexRouter = require('./routes/index');
    usersRouter = require('./routes/users');
    JobBoardRouter = require('./routes/JobBoard');
    employeeRouter = require('./routes/employee');
    sprayChartRouter = require('./routes/sprayChart');
    JobTypeRouter = require('./routes/jobType');
    YourCourseRouter = require('./routes/yourCourse');
    passport = require('./services/passport')

const corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTION",
    "preflightContinue": true,
    "optionsSuccessStatus": 204,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
};

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

// app.use(session({
//     store: new FileStore(),
//     secret: 'get rad',
//     resave: false,
//     saveUninitialized: true,
//     is_logged_in: false
// }));
passport(app);
app.use('/jobboard', JobBoardRouter);
app.use('/employee', employeeRouter);
app.use('/spraychart', sprayChartRouter);
app.use('/jobtype', JobTypeRouter);
app.use('/yourcourse', YourCourseRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
