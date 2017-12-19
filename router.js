const hb = require('express-handlebars');
const axios = require('axios');
const https = require('https')
const agent = new https.Agent({  
    rejectUnauthorized: false
  });
require('ssl-root-cas').inject();

require('./assets/polyfill.js');

require('dotenv').config();

module.exports = (express) =>{
    const router = express.Router();
    let start;
    let end;
    let numberOfDays;
    let days = ['Mon','Tue','Wed','Thur','Fri','Sat','Sun'];
    let tripDays = {};
    let dayDate; //To indicate which date it is

    router.get('/',(req,res)=>{
        //Check sessionID
        
        console.log(req.sessionID);
        res.render('trip');
    })

    router.get('/schedule', (req,res) => {
        //Check if of the same user
        console.log("@@@@: ",req.session)
        if(req.sessionID === req.session.uid) {
            res.render('trip-list',{ eachTripDay: req.session.tripDays, startDate: req.session.startDate, endDate: req.session.endDate});
        } else {
            res.status(404).send("WRONG INPUT", req.body.startDate , req.body.endDate, req.body); //To be follow up
        }
    }) 

    router.get('/flight/:flightDate', (req, res) => {
        console.log(req.session.tripDays);
        let reqDate = req.params.flightDate;
        reqDate = reqDate.match(/(\d+-\d+-\d+)/g);

        if (req.session.tripDays[reqDate]) {
            res.render('search-flight', {fromDate: reqDate, endDate: req.session.endDate , API_KEY_THREE:process.env.API_KEY_THREE});
        } else {
            //Handle the wrong request ***To be follow up
            res.send("Incorrect request date");
        }
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
            console.log(err);  //To be follow up
        })
    
    })

    router.post('/add-flight', (req, res) => {
        let data = JSON.parse(decodeURI(req.body["air-route"]));
        let flightResult = data["flight-result"];
        let flightRequest = data["flight-request"];
        let request_date = flightRequest[1].value.split("/").reverse().join("-");
        let request_end_date = flightRequest[2].value.split("/").reverse().join("-");
        
        //Check if the request is within the schedule days
        if (req.session.tripDays[request_date] && req.session.tripDays[request_end_date]) {
            let flightObj = {"request_date": request_date,
                            "request_end_date": request_end_date,
                            "flight_request": flightRequest,
                            "flight_result": flightResult}
            
            tripDays[request_date]["flightArr"].push(flightObj);
        
            req.session.tripDays[request_date]["flightArr"].push(flightObj);

            //Check if single flight
            if (request_date !== request_end_date) {
                tripDays[request_end_date]["flightArr"].push(flightObj);
                req.session.tripDays[request_end_date]["flightArr"].push(flightObj);
            }
        } else {
            res.send("Incorrect request date");  //Wrong input ******To be follow up
        }
        
        console.log("2: ",tripDays); 
        res.redirect('/schedule')
    })

    router.get('/transportation/:reqDate', (req, res) => {
        //Check sessionID
        console.log(req.sessionID);
        let reqDate = req.params.reqDate;
        reqDate = reqDate.match(/(\d+-\d+-\d+)/g);
        res.render('transportation', {fromDate: reqDate, API_KEY_TWO:process.env.API_KEY_TWO});
    })

    //post transportation route
    router.post('/add-transportation', (req, res) => {
        let request_date = req.body["request_sent"]
        let map_result = JSON.parse(decodeURI(req.body["result_sent"]));

        /* start-here TO BE DELETED (SINCE DUPLICATE THE WORK OF SESSION) */
        //Pushing new options object to transit Arr
        tripDays[request_date]["transitArr"].push({"request_date": request_date,
                    "map_result": map_result})
        /* end-here TO BE DELETED (SINCE DUPLICATE THE WORK OF SESSION) */

        //Session store
        //Pushing new options object to transit Arr
        req.session.tripDays[request_date]["transitArr"].push({"request_date": request_date,
        "map_result": map_result})
        
        res.redirect('/schedule')
    })

    router.get('/location/:reqDate', (req, res) => {
        //Check sessionID
        console.log(req.sessionID);
        let reqDate = req.params.reqDate;
        reqDate = reqDate.match(/(\d+-\d+-\d+)/g);
        res.render('location', {fromDate: reqDate, API_KEY_TWO:process.env.API_KEY_TWO});
    })

    router.post('/add-location', (req, res) => {
        let request_date = req.body["request_sent"]
        let map_result = JSON.parse(decodeURI(req.body["result_sent"]));

        /* start-here TO BE DELETED (SINCE DUPLICATE THE WORK OF SESSION) */
        //Pushing new options object to transit Arr
        tripDays[request_date]["locationArr"].push({"request_date": request_date,
                    "map_result": map_result})
        /* end-here TO BE DELETED (SINCE DUPLICATE THE WORK OF SESSION) */

        //Session store
         //Pushing new options object to transit Arr
        req.session.tripDays[request_date]["locationArr"].push({"request_date": request_date,
        "map_result": map_result})
        
        res.redirect('/schedule')
    })

    router.post('/trip-list',(req,res)=>{
        //Check sessionID
        //Save tripDays into session
        req.session.tripDays = {};
        console.log(req.sessionID);
        console.log("1: ", req.session.tripDays)
        start = req.body["start-date"];
        end = req.body["end-date"];
        numberOfDays = ((new Date(end).getTime() - new Date(start).getTime()) / (1000*60*60*24)) + 1;
        //Save Start/End date on session
        req.session.startDate = start
        req.session.endDate = end
        req.session.uid = req.sessionID
        //save DAYS on postgres
        console.log(req.session)
        //save DAYS/CONTAINERS on postgres


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
            
            /* start-here TO BE DELETED (SINCE DUPLICATE THE WORK OF SESSION) */
            tripDays[dayDate] = {"date": `${year}-${month.padStart(2,"0")}-${date.padStart(2,"0")}`};
            //Create event arrObject for each day for multiple events(except for hotel)
            tripDays[dayDate]["transitArr"] = [], tripDays[dayDate]['flightArr'] = [], tripDays[dayDate]['locationArr'] = [];
            //Create even object for hotel
            tripDays[dayDate]['hotelArr']=[];
            /* end-here TO BE DELETED (SINCE DUPLICATE THE WORK OF SESSION) */


            //Update tripDays object inside session
            req.session.tripDays[dayDate] = {"date": `${year}-${month.padStart(2,"0")}-${date.padStart(2,"0")}`};
            req.session.tripDays[dayDate]["transitArr"] = [], req.session.tripDays[dayDate]['flightArr'] = [], req.session.tripDays[dayDate]['locationArr'] = [], req.session.tripDays[dayDate]['hotelArr']=[];
        }
        console.log("2: ", req.session.tripDays)
     //res.render('trip-list',{eachTripDay: req.session.tripDays, startDate: req.session.startDate, endDate: req.session.endDate});
        res.redirect('/schedule')
    })

    router.post('/trip-list-hotel-update',(req,res)=>{
        let newHotelNameUpdate = req.body.hotelName,
            newHotelAddressUpdate = req.body.address,
            newHotelCheckInUpdate = req.body.checkIn,
            newHotelCheckOutUpdate = req.body.checkOut,
            newHotelPriceUpdate = req.body.price,
            newHotelNoOfRooms = req.body.noOfRooms,
            newHotelNoOfAdults = req.body.noOfAdults,
            newHotelCountry = req.body.country,
            newHotelCity = req.body.city,
            newHotelNoOfNights = (new Date(newHotelCheckOutUpdate).getTime() - new Date(newHotelCheckInUpdate).getTime()) / (1000*60*60*24);
        
        console.log('No of nights >>'+newHotelNoOfNights);
        console.log('No of days >>'+numberOfDays);

        let hotelObject = {
            "request_date": newHotelCheckInUpdate,
            "hotelName": newHotelNameUpdate,
            "check_in": newHotelCheckInUpdate,
            "check_out": newHotelCheckOutUpdate,
            "country": newHotelCountry,
            "city": newHotelCity,
            "adult": newHotelNoOfAdults,
            "room_total": newHotelNoOfRooms,
            "price_total": newHotelPriceUpdate
        };
        let stayingDate = newHotelCheckInUpdate;
        console.log('new hotel check in date >>'+newHotelCheckInUpdate);
        //Session store
        if(newHotelNoOfNights > numberOfDays){
            res.send("Incorrect request date");
        } else if(newHotelNoOfNights > 1){
            for(let i=0; i<newHotelNoOfNights; i++){
                req.session.tripDays[stayingDate]["hotelArr"].push(hotelObject);
                stayingDate = addOneDay(stayingDate);
                console.log('next staying date >>'+stayingDate);
                hotelObject["request_date"] = stayingDate;
            }
        } else if (newHotelNoOfNights === 1){
            req.session.tripDays[newHotelCheckInUpdate]["hotelArr"].push(hotelObject);
        }
        function addOneDay (originalDate) {
            var dat = new Date(originalDate);
            dat.setDate(dat.getDate() + 1);
            trimDat = JSON.stringify(dat).replace(/T00:00:00.000Z/g,"");
            console.log('trimDat A>>'+trimDat);
            console.log('trimDat B>>'+JSON.parse(trimDat));
            return JSON.parse(trimDat);
        }            
        
        console.log('3 >>',req.session.tripDays);
        res.redirect('/schedule');

    })

    router.get('/search-hotels/:checkInDate',(req,res)=>{
        let checkIn = req.params.checkInDate;
        //console.log(checkIn);
        checkIn = checkIn.match(/(\d+-\d+-\d+)/g);
        //console.log('check in date '+checkIn);
        res.render('search-hotel',{fromDate: checkIn,API_KEY_TWO:process.env.API_KEY_TWO});
    })

    router.get('/search-hotel-edit',(req,res)=>{
        res.render('search-hotel-edit',{fromDate:"2018-02-05", toDate:"2018-02-07",hotelAddress:"country=Japan&city=Mie",adult:"2",API_KEY_TWO:process.env.API_KEY_TWO});
    })

    return router;
}