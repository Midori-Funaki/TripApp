const hb = require('express-handlebars'),
      redis = require('./assets/redis')
      ;
//FOR GETTING AIRPORT IATA CODE
const axios = require('axios');
const https = require('https')
const agent = new https.Agent({  
    rejectUnauthorized: false
  });
require('ssl-root-cas').inject();

require('./assets/polyfill.js');

module.exports = (express) =>{
    const router = express.Router();
    let start;
    let end;
    let numberOfDays;
    let days = ['Mon','Tue','Wed','Thur','Fri','Sat','Sun'];
    let tripDays = [];

    router.get('/',(req,res)=>{
        res.render('trip');
    })

    router.get('/flight', (req, res) => {
        res.render('search-flight');
    })

    
    router.post('/get-iatacode', (req, res) => {
        let result = JSON.parse(req.body.flightReq);
        let orig = req.body['nameArr[0][]'],
            dest = req.body['nameArr[1][]'],
            departFrom = result[1].value,
            returnFrom = result[2].value,
            typeFlight = result[0].value,
            adults = result[6].adults,
            children = result[6].children,
            infants = result[6].infants;
        
        let origPortArr = [], destPortArr = [];        
        let origProm = axios.get(`https://api.skypicker.com/flights?dateFrom=${departFrom}&dateTo=${departFrom}&returnFrom=${returnFrom}&returnTo=${returnFrom}&longitudeFrom=${orig[1]}&latitudeFrom=${orig[0]}&radiusFrom=200&longitudeTo=${dest[1]}&latitudeTo=${dest[0]}&radiusTo=200&typeFlight=${typeFlight}&directFlights=1&adults=${adults}&children=${children}&infants=${infants}&curr=HKD&partner=picky&partner_market=us`);            
        
        origProm.then((data) => {
            res.send({'airRoute': data.data.data})
        }).catch((err) => {
            console.log(err);
        })
    
    })

    router.get('/transportation', (req, res) => {
        res.render('transportation');
    })

    //post transportation route
    router.post('/add-transportation', (req, res) => {
        console.log(req.body.route);
    })

    router.get('/location', (req, res) => {
        res.render('location');
    })

    router.post('/trip-list',(req,res)=>{
        start = req.body["start-date"];
        end = req.body["end-date"];
        //store trip data on redis
        redis.hmset('trips',[
            'start-date',start,
            'end-date',end
        ],function(err,reply){
            if(err){
                console.log(err);
            }
            console.log(reply);
        })
        numberOfDays = ((new Date(end).getTime() - new Date(start).getTime()) / (1000*60*60*24)) + 1;
        tripDays = [];
        
        //create schdule container on handlebar
        for(let i=0; i<numberOfDays; i++){
            let wholeDate = new Date(new Date(start).getTime() + i*1000*60*60*24);
            let year = wholeDate.getFullYear();
            let month = wholeDate.getMonth()+1+"";
            let date = wholeDate.getDate()+"";
            let day = days[wholeDate.getDay()-1];
            tripDays.push(`${year}-${month.padStart(2,"0")}-${date.padStart(2,"0")}-${day}`);
        }
        res.render('trip-list',{eachTripDay: tripDays});
    })

    router.post('/trip-list-hotel-update',(req,res)=>{
        let newHotelNameUpdate = req.body.hotelName,
            newHotelAddressUpdate = req.body.address,
            newHotelCheckInUpdate = req.body.checkIn,
            newHotelCheckOutUpdate = req.body.checkOut,
            newHotelPriceUpdate = req.body.price,
            newHotelNoOfRooms = req.body.noOfRooms,
            newHotelNoOfAdults = req.body.noOfAdults;
        redis.hmset('hotels',[
            'name',req.body.hotelName,
            'address',req.body.address,
            'checkIn', req.body.checkIn,
            'checkOut', req.body.checkOut,
            'price', req.body.price
        ],function(err,reply){
            if(err){
                console.log('saving hotel info err',err);
            }
            console.log(reply);
            //console.log('hotel no of rooms update >>'+newHotelNoOfRooms);
            //console.log('hotel no of adult update >>'+newHotelNoOfAdults);
            res.render('trip-list',{eachTripDay: tripDays, newActivityType:"Hotel", newActivityName:newHotelNameUpdate, newActivityLocation:newHotelAddressUpdate, newHotelCheckIn:newHotelCheckInUpdate, newHotelCheckOut:newHotelCheckOutUpdate, newHotelPrice:newHotelPriceUpdate, newHotelRoomTotal:newHotelNoOfRooms, newAdultNumber:newHotelNoOfAdults});
        })
    })

    router.get('/search-hotels/:checkInDate',(req,res)=>{
        let checkIn = req.params.checkInDate;
        //console.log(checkIn);
        checkIn = checkIn.match(/(\d+-\d+-\d+)/g);
        //console.log('check in date '+checkIn);
        res.render('search-hotel',{fromDate: checkIn});
    })

    router.get('/search-hotel-edit',(req,res)=>{
        res.render('search-hotel-edit',{fromDate:"2018-02-05", toDate:"2018-02-07",hotelAddress:"country=Japan&city=Mie",adult:"2"});
    })

    return router;
}