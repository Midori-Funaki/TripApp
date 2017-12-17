const hb = require('express-handlebars'),
      redis = require('./assets/redis')
      ;
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

    router.get('/transportation', (req, res) => {
        res.render('transportation');
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