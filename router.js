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
        let start = req.body["start-date"];
        let end = req.body["end-date"];
        let numberOfDays = ((new Date(end).getTime() - new Date(start).getTime()) / (1000*60*60*24)) + 1;
        let days = ['Mon','Tue','Wed','Thur','Fri','Sat','Sun'];
        let tripDays = [];
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

    router.get('/search-hotels/:checkInDate',(req,res)=>{
        let checkIn = req.params.checkInDate;
        console.log(checkIn);
        checkIn = checkIn.match(/(\d+-\d+-\d+)/g);
        console.log('check in date '+checkIn);
        res.render('search-hotel',{fromDate: checkIn});
    })

    return router;
}