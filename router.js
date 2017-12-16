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
        if(req.checkBody('start-date').exists()){
            console.log('Req.body DOES contain start-date exists....');
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
        }
        numberOfDays = ((new Date(end).getTime() - new Date(start).getTime()) / (1000*60*60*24)) + 1;
        tripDays = [];
        
        //create schdule container on handlebar
        for(let i=0; i<numberOfDays; i++){
            let wholeDate = new Date(new Date(start).getTime() + i*1000*60*60*24);
            let year = wholeDate.getFullYear();
            let month = wholeDate.getMonth()+1+"";
            let date = wholeDate.getDate()+"";
            let day = days[wholeDate.getDay()];
            tripDays.push(`${year}-${month.padStart(2,"0")}-${date.padStart(2,"0")}-${day}`);
        }
        res.render('trip-list',{eachTripDay: tripDays});
    })

    router.get('/trip-list',(req,res)=>{
        /*
        redis.hget('trips','start-date',function(err,data){
            if(err){
                console.log('err',err);
            }
            start = data;
        })
        redis.hget('trips','end-date',function(err,data){
            if(err){
                console.log('err',err);
            }
            end = data;
        })
        */
        numberOfDays = ((new Date(end).getTime() - new Date(start).getTime()) / (1000*60*60*24)) + 1;
        tripDays = [];
        
        //create schdule container on handlebar
        for(let i=0; i<numberOfDays; i++){
            let wholeDate = new Date(new Date(start).getTime() + i*1000*60*60*24);
            let year = wholeDate.getFullYear();
            let month = wholeDate.getMonth()+1+"";
            let date = wholeDate.getDate()+"";
            let day = days[wholeDate.getDay()];
            tripDays.push(`${year}-${month.padStart(2,"0")}-${date.padStart(2,"0")}-${day}`);
        }
        res.render('trip-list',{eachTripDay: tripDays});
    })

    router.post('/trip-list-hotel-update',(req,res)=>{
        redis.hmset('hotels',[
            'name',req.body.name,
            'address',req.body.address,
            'checkIn', req.body.checkIn,
            'checkOut', req.body.checkOut,
            'price', req.body.price
        ],function(err,reply){
            if(err){
                console.log('redis hgetall err',err);
            }
            console.log(reply);
            res.redirect('/trip-list');
        })
    })

    router.get('/search-hotels/:checkInDate',(req,res)=>{
        let checkIn = req.params.checkInDate;
        console.log(checkIn);
        checkIn = checkIn.match(/(\d+-\d+-\d+)/g);
        console.log('check in date '+checkIn);
        res.render('search-hotel',{fromDate: checkIn});
    })

    return router;
}