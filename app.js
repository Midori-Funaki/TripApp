const express = require('express'),
      hb = require('express-handlebars'),
      cors = require('cors'),
      bodyParser = require('body-parser'),
      validator = require('express-validator');

const app = express();

const router = require('./router')(express);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//express-validator
app.use(validator());

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