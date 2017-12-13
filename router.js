const hb = require('express-handlebars');
module.exports = (express) =>{
    const router = express.Router();

    router.get('/',(req,res)=>{
        res.render('trip');
    })

    router.get('/add-trip', (req, res) => {
        res.render('search');
    })

    router.post('/trip-list',(req,res)=>{
        let start = req.body["start-date"];
        let end = req.body["end-date"];
        let numberOfDays = ((new Date(end).getTime() - new Date(start).getTime()) / (1000*60*60*24)) + 1;
        let days = ['Mon','Tue','Wed','Thur','Fri','Sat','Sun'];
        let tripDays = [];
        for(let i=0; i<numberOfDays; i++){
            let wholeDate = new Date(new Date(start).getTime() + i*1000*60*60*24);
            let month = wholeDate.getMonth()+1;
            let date = wholeDate.getDate();
            let day = days[wholeDate.getDay()];
            tripDays.push(`${month}-${date}-${day}`);
        }
        res.render('trip-list',{eachTripDay: tripDays});
    })

    router.get('/search-hotels',(req,res)=>{
        
        res.render('search-hotel');
    })

    return router;
}