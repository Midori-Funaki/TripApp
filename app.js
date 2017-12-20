const express = require('express'),
      hb = require('express-handlebars'),
      expressSession = require('express-session'),
      cors = require('cors'),
      bodyParser = require('body-parser'),
      sequelize = require('./sequelize'),
      models = require('./models'),
      session = require('./session'),
      User = models.users,
      Trip = models.trips,
      Container = models.containers,
      Flight = models.flights,
      Hotel = models.hotels,
      Location = models.locations,
      Transportation = models.transportation,
      User_trips = models.user_trips,
      Handlebars = require('handlebars'),
      setupPassport = require('./passport'),
      flash = require('connect-flash'),
      cookieParser = require('cookie-parser'),
      expressValidator = require('express-validator'),
      router = express.Router();
      

const app = express();
      
//Use session
app.use(expressSession(session.settings));
app.set("rejectUnauthorized",false);
const mainRouter = require('./router')(express);
const authRoutes = require('./routes/auth.routes')(express);
const flightRoutes = require('./routes/search_flight')(express);
const transitRoutes = require('./routes/search_transportation')(express);
//const hotelRoutes = require('./routes/search_hotel')(express);
//const locationRoutes = require('./routes/search_location')(express);

//check sequelize connection
sequelize.authenticate()
    .then(() => {
    console.log('Sequelize connection has been established successfully.');
    })
    .catch(err => {
    console.error('Unable to connect to the sequelize database:', err);
    });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ 
    parameterLimit: 100000,
    limit: '5mb',
    extended: false 
}))
// parse application/json
app.use(bodyParser.json())
app.use(express.static("assets"));
app.set("view engine","handlebars");

//Flash
app.use(cookieParser());
app.use(flash());
// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(cors());
setupPassport(app);

//Handlebars
app.engine("handlebars",hb({
    defaultLayout:"main"
}));

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === parseInt(v2)) {
        return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper('JSON2string',function(object){
    return JSON.stringify(object);
});

Handlebars.registerHelper("equal", require("handlebars-helper-equal"))
/*
Handlebars.registerHelper('eq',function(val1, val2, block){
    if(val1 == val2){
        return block;
    }
});
*/

//For different routes/user auth routing
app.use('/',mainRouter);
app.use('/auth',authRoutes);
app.use('/flight',flightRoutes);
app.use('/transportation',transitRoutes);
//app.use('/hotel',hotelRoutes);
//app.use('/location',locationRoutes);

app.listen(8080,function(){
    console.log('Listening on 8080...');
});