const express = require('express'),
      hb = require('express-handlebars'),
      app = express();

const router = require('./router')(express);


app.use(express.static("assets"));
app.set("view engine","handlebars");
app.use('/',router);

app.engine("handlebars",hb({
    defaultLayout:"main"
}));

app.listen(8080,function(){
    console.log('Listening on 8080...');
});