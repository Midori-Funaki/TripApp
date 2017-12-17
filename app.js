const express = require('express'),
      hb = require('express-handlebars'),
      cors = require('cors'),
      bodyParser = require('body-parser'),
      sequelize = require('./sequelize.js');

const app = express();
app.set("rejectUnauthorized",false);
const router = require('./router')(express);

//check sequelize connection
sequelize
    .authenticate()
    .then(() => {
    console.log('Sequelize connection has been established successfully.');
    })
    .catch(err => {
    console.error('Unable to connect to the sequelize database:', err);
    });

//initialize sequelize models
//sequelize.sync({force:true});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(express.static("assets"));
app.set("view engine","handlebars");
app.use('/',router);
app.use(cors());


app.engine("handlebars",hb({
    defaultLayout:"main"
}));

app.listen(8080,function(){
    console.log('Listening on 8080...');
});