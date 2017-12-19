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
      Handlebars = require('handlebars');

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


//Use session
app.use(expressSession(session.settings));
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
app.use('/',router);
app.use(cors());

app.engine("handlebars",hb({
    defaultLayout:"main"
}));

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === parseInt(v2)) {
        return options.fn(this);
    }
    return options.inverse(this);
});
/*
Memo: Creating sample data for testing association
User.create({
    firstName: 'Second',
    lastName: 'Second'
})
.then(()=>{
    console.log('user model updated..');
})

Trip.create({
    nightsOfStay: 4,
    startDate: '2018-02-01-Tue',
    endDate:'2018-02-04-Thu',
    noOfAdults: 2,
    noOfKids: 0
})
.then(()=>{
    console.log('trip model updated..');
})

User_trips.create({
    trip_id:1,
    user_id:1
})
.then(()=>{
    console.log('user_trip model updated..');
})

Container.bulkCreate([
    {date: '2018-01-01',trip_id:1},
    {date: '2018-01-02',trip_id:1},
    {date: '2018-01-03',trip_id:1},
    {date: '2018-01-04',trip_id:1},
    {date: '2018-01-05',trip_id:1},
    {date: '2018-02-01',trip_id:2},
    {date: '2018-02-02',trip_id:2},
    {date: '2018-02-03',trip_id:2},
    {date: '2018-02-04',trip_id:2}
])
.then(()=>{
    console.log('container model updated..');
})

Hotel.bulkCreate([
    {name:'Hotel Jan', address:'Block One', nightsOfStay:2, container_id:10, checkInDate:'2018-01-01', checkOutDate:'2018-01-03'},
    {name:'Hotel Jan', address:'Block One', nightsOfStay:2, container_id:11, checkInDate:'2018-01-01', checkOutDate:'2018-01-03'},
    {name:'Hotel Feb', address:'Block Two', nightsOfStay:3, container_id:15, checkInDate:'2018-02-01', checkOutDate:'2018-02-04'},
    {name:'Hotel Feb', address:'Block Two', nightsOfStay:3, container_id:16, checkInDate:'2018-02-01', checkOutDate:'2018-02-04'},
    {name:'Hotel Feb', address:'Block Two', nightsOfStay:3, container_id:17, checkInDate:'2018-02-01', checkOutDate:'2018-02-04'}
])
.then(()=>{
    console.log('hotel model updated..');
})

Transportation.bulkCreate([
    {transportType:'Train',startingLocation:'Wan Chai Station',destination:'Causeway Bay Station',journeyTime:10,container_id:10},
    {transportType:'Bus',startingLocation:'Mt O',destination:'Mt P',journeyTime:120,container_id:15}
])
.then(()=>{
    console.log('transportation model updated..');
})
*/

//checking association function
/*
Container.findById(15).then((container)=>{
   container.getHotel().then((hotel)=>{
        //console.log('Hotel for container 15 >>'+JSON.stringify(hotel.name));
    });
});

Trip.findById(1).then((trip)=>{
    trip.getContainers().then((container)=>{
        //console.log('Number of containers exist >>'+container.length);
    })
})
*/
app.listen(8080,function(){
    console.log('Listening on 8080...');
});