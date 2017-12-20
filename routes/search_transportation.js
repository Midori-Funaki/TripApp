const hb = require('express-handlebars');
require('dotenv').config();

module.exports = (express) => {
    const router = express.Router();

    router.get('/:reqDate', (req, res) => {
        //Check sessionID
        let reqDate = req.params.reqDate;
        reqDate = reqDate.match(/(\d+-\d+-\d+)/g);
        if (req.session.tripDays[reqDate]) {
            //SAVE THE PREVIOUS PAGE URL
            req.session.previousURL = "/transportation/"+reqDate
            res.render('transportation', {fromDate: reqDate, API_KEY_TWO:process.env.API_KEY_TWO});
        } else {
            //Handle the wrong request ***To be follow up
            req.flash('error_msg', "Incorrect request date");
            res.redirect(req.session.previousURL);
        }
   
    })

    //post transportation route
    router.post('/add-transportation', (req, res) => {
        let request_date = req.body["request_sent"]
        let map_result = JSON.parse(decodeURI(req.body["result_sent"]));

        //Session store
        //Pushing new options object to transit Arr
        if (req.session.tripDays[request_date]) {
            req.session.tripDays[request_date]["transitArr"].push({"request_date": request_date,
            "map_result": map_result})
            console.log('added new transit >>'+JSON.stringify(req.session.tripDays[request_date]["transitArr"]));
            req.flash('success_msg', "Added new transit route!");
            res.redirect('/schedule')
        } else {
            req.flash('error_msg', "Incorrect request date");
            return res.redirect(req.session.previousURL);
        }
    })

    //GET EDIT PATE


    //SAVE THE UPDATE RESULT
    
    return router;
}