const hb = require('express-handlebars');
require('./assets/polyfill.js');
module.exports = (express) =>{
    const router = express.Router();

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
        res.render('temporary-hotel',{fromDate: checkIn});
    })

    return router;
}