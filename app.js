const express = require('express'),
      hb = require('express-handlebars'),
      cors = require('cors');


const app = express();

const router = require('./router')(express);


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