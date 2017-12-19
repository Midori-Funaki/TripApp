const hb = require('express-handlebars');
const axios = require('axios');

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
        req.session.previousURL = "/"
    })

    router.get('/schedule', (req,res) => {
        //Check if of the same user
        console.log("@@@@: ",req.session)
        if(req.sessionID === req.session.uid) {
            req.session.previousURL = "/schedule"
            res.render('trip-list',{ eachTripDay: req.session.tripDays, startDate: req.session.startDate, endDate: req.session.endDate});
        } else {
            //Handle the wrong request ***To be follow up
            req.flash('error_msg', "Incorrect request date");
            res.redirect(req.session.previousURL);
        }
    }) 
    
    router.get('/location', (req, res) => {
        res.render('location',{API_KEY_TWO:process.env.API_KEY_TWO});
    })

    router.post('/trip-list',(req,res)=>{
        //Check sessionID
        //Save tripDays into session
        req.session.tripDays = {};
        start = req.body["start-date"];
        end = req.body["end-date"];
        
        firstDate = new Date(start);
        lastDate = new Date(end);
        today = new Date();

        //Check if valid date input
        if (firstDate < lastDate && firstDate >= today) {
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
                /* end-here TO BE DELETED (SINCE DUPLICATE THE WORK OF SESSION) */


                //Update tripDays object inside session
                req.session.tripDays[dayDate] = {"date": `${year}-${month.padStart(2,"0")}-${date.padStart(2,"0")}`};
                req.session.tripDays[dayDate]["transitArr"] = [], req.session.tripDays[dayDate]['flightArr'] = [], req.session.tripDays[dayDate]['locationArr'] = [];
            }
            console.log("2: ", req.session.tripDays)
        //   res.render('trip-list',{eachTripDay: req.session.tripDays, startDate: req.session.startDate, endDate: req.session.endDate});
            res.redirect('/schedule')
        } else {
            //Handle the wrong request ***To be follow up
            console.log(req.session);
            req.flash('error_msg', "Incorrect request date");
            res.redirect(req.session.previousURL);
        }
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
            newHotelCity = req.body.city;

            //save HOTEL data to postgres

            res.render('trip-list',{eachTripDay: tripDays, newActivityType:"Hotel", newActivityName:newHotelNameUpdate, newActivityLocation:newHotelAddressUpdate, newHotelCheckIn:newHotelCheckInUpdate, newHotelCheckOut:newHotelCheckOutUpdate, newHotelPrice:newHotelPriceUpdate, newHotelRoomTotal:newHotelNoOfRooms, newAdultNumber:newHotelNoOfAdults});
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