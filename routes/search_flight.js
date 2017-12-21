const hb = require('express-handlebars');
const axios = require('axios');
require('dotenv').config();

module.exports = (express) => {
    const router = express.Router();

    //GET search Flight page
    router.get('/:flightDate', (req, res) => {
        let reqDate = req.params.flightDate;
        reqDate = reqDate.match(/(\d+-\d+-\d+)/g);

        if (req.session.tripDays[reqDate]) {
            //SAVE THE PREVIOUS PAGE URL
            req.session.previousURL = "/flight/"+reqDate
            res.render('search-flight', {fromDate: reqDate, endDate: req.session.endDate , API_KEY_THREE:process.env.API_KEY_THREE});
        } else {
            //Handle the wrong request ***To be follow up
            req.flash('error_msg', "Incorrect request date");
            res.redirect(req.session.previousURL);
        }
    })

    //AJAX POST for searching airline details
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

    //SAVE THE SEARCH RESULT TO SESSION
    router.post('/add-flight', (req, res) => {
        let data = JSON.parse(decodeURI(req.body["air-route"]));
        let flightResult = data["flight-result"];
        let flightRequest = data["flight-request"];
        let request_date = flightRequest[1].value.split("/").reverse().join("-");
        let request_end_date = flightRequest[2].value.split("/").reverse().join("-");
        
        //Check if the request is within the schedule days
        if (req.session.tripDays[request_date] && req.session.tripDays[request_end_date]) {
            let flightObj = {"type":"Flight",
                            "request_date": request_date,
                            "request_end_date": request_end_date,
                            "flight_request": flightRequest,
                            "flight_result": flightResult}
        
            req.session.tripDays[request_date]["activityArr"].push(flightObj);

            //Check if single flight
            if (request_date !== request_end_date) {
                req.session.tripDays[request_end_date]["activityArr"].push(flightObj);
            }
            res.redirect('/schedule')
        } else {
            req.flash('error_msg', "Incorrect request date");
            res.redirect(req.session.previousURL);  //Wrong input ******To be follow up
        }
    })

    //GET EDIT PATE


    //SAVE THE UPDATE RESULT

    return router;
}