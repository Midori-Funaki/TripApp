const hb = require('express-handlebars');
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
    let tripDays = {};
    let dayDate; //To indicate which date it is
    let transitArr = [], flightArr =[] , locationArr = [], hotelArr = []; //For multiples options

    router.get('/',(req,res)=>{
        res.render('trip');
    })

    router.get('/flight/:flightDate', (req, res) => {
        let reqDate = req.params.flightDate;
    
        reqDate = reqDate.match(/(\d+-\d+-\d+)/g);
        res.render('search-flight', {fromDate: reqDate});
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

    router.post('/add-flight', (req, res) => {
        let data = JSON.parse(decodeURI(req.body["air-route"]));
        let flightResult = data["flight-result"];
        let flightRequest = data["flight-request"];
        let request_date = flightRequest[1].value.split("/").reverse().join("-");
        let request_end_date = flightRequest[2].value.split("/").reverse().join("-");
        console.log("FlightRequest: ",flightRequest)
        console.log(request_date);
        console.log("FLightResult: ", flightResult);
        flightArr.push({"request_date": request_date,
                        "request_end_date": request_end_date,
                        "flight_request": flightRequest,
                        "flight_result": flightResult})

        //Check if the input date exist
        if (tripDays[request_date] && tripDays[request_end_date]) {
            tripDays[request_date]["flight"] = flightArr; 
            //Check if single flight
            if (request_date !== request_end_date) {
                 tripDays[request_end_date]["flight"] = flightArr;
            }
        } else {
            res.send("WRONG INPUT");  //Wrong input ******
        }
        
        console.log("2: ",tripDays); 
        res.render('trip-list',{eachTripDay: tripDays})
    })

    router.get('/transportation/:checkInDate', (req, res) => {
        let reqDate = req.params.checkInDate;
        reqDate = reqDate.match(/(\d+-\d+-\d+)/g);
        res.render('transportation', {fromDate: reqDate});
    })

    //post transportation route
    router.post('/add-transportation', (req, res) => {
        let request_date = req.body["request_sent"]
        let map_result = JSON.parse(decodeURI(req.body["result_sent"]));
        //Pushing new options to transit object
        transitArr.push({"request_date": request_date,
                    "map_result": map_result})
        //Save transit object into the set Day
        tripDays[request_date]["transit"] = transitArr;

        console.log("In add-transit2: ", map_result)
        res.render('trip-list',{eachTripDay: tripDays})
    })

    router.get('/location', (req, res) => {
        res.render('location');
    })

    router.post('/trip-list',(req,res)=>{
        start = req.body["start-date"];
        end = req.body["end-date"];
        numberOfDays = ((new Date(end).getTime() - new Date(start).getTime()) / (1000*60*60*24)) + 1;
        //save DAYS on postgres
        
        //create schdule container on handlebar
        for(let i=0; i<numberOfDays; i++){
            let wholeDate = new Date(new Date(start).getTime() + i*1000*60*60*24);
            let year = wholeDate.getFullYear();
            let month = wholeDate.getMonth()+1+"";
            let date = wholeDate.getDate()+"";
            let day = days[wholeDate.getDay()-1];

            //Make everyday an Object that contain the property of date/transit object/hotel object/flight object/location object
            let newDay = new Object();
            //Each day's name is set as each day's Date
            dayDate = `${year}-${month.padStart(2,"0")}-${date.padStart(2,"0")}` ;
            tripDays[dayDate] = {"date": `${year}-${month.padStart(2,"0")}-${date.padStart(2,"0")}`};
            
          //  tripDays.push(newDay);
            console.log("In trip-List: ", tripDays)
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
        
            res.render('trip-list',{eachTripDay: tripDays, newActivityType:"Hotel", newActivityName:newHotelNameUpdate, newActivityLocation:newHotelAddressUpdate, newHotelCheckIn:newHotelCheckInUpdate, newHotelCheckOut:newHotelCheckOutUpdate, newHotelPrice:newHotelPriceUpdate, newHotelRoomTotal:newHotelNoOfRooms, newAdultNumber:newHotelNoOfAdults});
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