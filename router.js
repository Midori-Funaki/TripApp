const hb = require('express-handlebars');
const axios = require('axios');
const sequelize = require('./sequelize'),
    models = require('./models'),
    User = models.users,
    Trip = models.trips,
    Transaction = models.transactions,
    User_trips = models.user_trips;
    const Op = sequelize.Op;
    const operatorsAliases = {
        $eq: Op.eq,
        $or: Op.or,
    }
require('./assets/polyfill.js');
require('dotenv').config();

module.exports = (express) => {
    const router = express.Router();
    let start;
    let end;
    let numberOfDays;
    let days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
    let tripDays = {};
    let dayDate; //To indicate which date it is

    router.get('/', (req, res) => {
        //Check sessionID
        console.log(req.sessionID);
        res.render('trip');
        req.session.previousURL = "/"
    })

    router.get('/schedule', (req, res) => {
        //Check if of the same user
        console.log("@@@@: ", req.session)
        if (req.sessionID === req.session.uid) {
            req.session.previousURL = "/schedule"
            //first retieve all the data of the same day
            //push them into an array 
            //all them into a new object like req.session.tripDays

            res.render('trip-list', { eachTripDay: req.session.tripDays, startDate: req.session.startDate, endDate: req.session.endDate });
        } else {
            //Handle the wrong request ***To be follow up
            req.flash('error_msg', "Incorrect request date");
            res.redirect(req.session.previousURL);
        }
    })

    router.get('/save-schedule', (req, res) => {
        //Check if of the same user
        console.log("@@@@: ", req.session)
        if (req.sessionID === req.session.uid) {
            req.session.previousURL = "/save-schedule"
        

            //Delete transaction here
            Transaction.findAll({
                where: {
                    "date": {
                        [Op.or]: Object.keys(req.session.tripDays)
                      }
                }
            }).then((transaction)=>{
                transaction.map(function(e){
                    e.destroy();
                });

 
   
            var newTransactionArr = [];
            console.log("Object.keys(req.session.tripDays)", Object.keys(req.session.tripDays).length);
            for (let i = 0; i < Object.keys(req.session.tripDays).length; i++) {
                let request_date = Object.keys(req.session.tripDays)[i];
                //console.log(Object.keys(req.session.tripDays));
                //console.log('No of days >>' + numberOfDays);
                console.log(request_date);
                console.log(req.session.tripDays[request_date]["activityArr"]);


                for (let j = 0; j < req.session.tripDays[request_date]["activityArr"].length; j++) {

                    var newTransaction = {
                        "trip_id": "1",
                        "date": request_date,
                        "order": j,
                        "activity": req.session.tripDays[request_date]["activityArr"][j],
                        "createdAt": "2016-08-09 07:42:28",
                        "updatedAt": "2016-08-09 07:42:28"
                    }
                    newTransactionArr.push(newTransaction);
                    //save({transaction:t});

                    /*
                                    var newTransaction = new Transaction();
                                    newTransaction.trip_id = 1,
                                    newTransaction.date = request_date,
                                    newTransaction.order = i,
                                    newTransaction.activity = req.session.tripDays[request_date]["activityArr"][i],
                                    newTransaction.createdAt = "2016-08-09 07:42:28",
                                    newTransaction.updatedAt = "2016-08-09 07:42:28"
                                    return newTransaction.save({transaction:t});
                                        */
                }
            }
            //});
            console.log("newTransactionArr:", newTransactionArr);
            sequelize.transaction(function (t) {
                return Transaction.bulkCreate(newTransactionArr, {transaction:t});
            }).then(()=>{  
                res.redirect('/schedule');
            });
        });
        }
        
    })

    router.get('/show-schedule', (req, res) => {
        //Check if of the same user
        console.log("@@@@: ", req.session)
        if (req.sessionID === req.session.uid) {
            req.session.previousURL = "/show-schedule"

            let dateArr = [];
            let promiseArr = [];
            //loop the date
            for (i = 0; i < Object.keys(req.session.tripDays).length; i++) {
                request_date = Object.keys(req.session.tripDays)[i];

                let promise = Transaction.findAll({
                    attributes: ['id', 'order', 'activity'],
                    where: { date: request_date, trip_id: 1 }
                })
                dateArr.push(request_date);
                promiseArr.push(promise);
            }

            Promise.all(promiseArr).then(data => {
                data.map((transaction, index) => {
                    let request_date = dateArr[index];
                    if (transaction.length) {
                        for (let i = 0; i < transaction.length; i++) {
                            req.session.tripDays[request_date]["activityArr"].push(transaction[i].dataValues.activity)
                        }
                    }
                })

                console.log(`promise done`);
                res.redirect('/schedule')

            }).catch(err => console.log(err));





            //







        }
    })

    router.get('/delete-schedule', (req, res) => {
        //Check if of the same user
        console.log("@@@@: ", req.session)
        if (req.sessionID === req.session.uid) {
            req.session.previousURL = "/delete-schedule"
            
            //Delete transaction here
            Transaction.findAll({
                where: {
                    "date": {
                        [Op.or]: Object.keys(req.session.tripDays)
                      }
                }
            }).then((transaction)=>{
                transaction.map(function(e){
                    e.destroy();
                    
                    
                });
                for (let i = 0; i < Object.keys(req.session.tripDays).length; i++) {
                    let request_date = Object.keys(req.session.tripDays)[i];
                    //console.log(Object.keys(req.session.tripDays));
                    //console.log('No of days >>' + numberOfDays);
                    console.log(request_date);
                    req.session.tripDays[request_date]["activityArr"] = [];
                }
                res.redirect('/schedule');
            });
            
        }
    });

    router.get('/location/:reqDate', (req, res) => {
        //Check sessionID
        console.log(req.sessionID);
        let reqDate = req.params.reqDate;
        reqDate = reqDate.match(/(\d+-\d+-\d+)/g);
        res.render('location', { fromDate: reqDate, API_KEY_TWO: process.env.API_KEY_TWO });
    })

    router.post('/add-location', (req, res) => {
        let request_date = req.body["request_sent"]
        let map_result = JSON.parse(decodeURI(req.body["result_sent"]));

        /* start-here TO BE DELETED (SINCE DUPLICATE THE WORK OF SESSION) */
        //Pushing new options object to transit Arr
        //tripDays[request_date]["activityArr"].push({"type":"Location", "request_date": request_date,"map_result": map_result})
        /* end-here TO BE DELETED (SINCE DUPLICATE THE WORK OF SESSION) */

        //Session store
        //Pushing new options object to transit Arr
        req.session.tripDays[request_date]["activityArr"].push({ "type": "Location", "request_date": request_date, "map_result": map_result })

        res.redirect('/schedule')
    })

    router.post('/trip-list', (req, res) => {

        //Check sessionID
        //Save tripDays into session
        req.session.tripDays = {};
        start = req.body["start-date"];
        end = req.body["end-date"];

        console.log(start, end)
        firstDate = new Date(start).getTime();
        lastDate = new Date(end).getTime();
        today = new Date().getTime();
        console.log(firstDate, lastDate, today);
        //Check if valid date input
        if (firstDate <= lastDate && firstDate >= today) {
            numberOfDays = ((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1;
            //Save Start/End date on session
            req.session.startDate = start
            req.session.endDate = end
            req.session.uid = req.sessionID
            //save DAYS on postgres
            console.log(req.session)
            //save DAYS/CONTAINERS on postgres

            //create schdule container on handlebar
            for (let i = 0; i < numberOfDays; i++) {
                let wholeDate = new Date(new Date(start).getTime() + i * 1000 * 60 * 60 * 24);
                let year = wholeDate.getFullYear();
                let month = wholeDate.getMonth() + 1 + "";
                let date = wholeDate.getDate() + "";
                let day = days[wholeDate.getDay() - 1];

                //Make everyday an Object that contain the property of date/transit object/hotel object/flight object/location object
                let newDay = new Object();
                //Each day's name is set as each day's Date
                dayDate = `${year}-${month.padStart(2, "0")}-${date.padStart(2, "0")}`;

                /* start-here TO BE DELETED (SINCE DUPLICATE THE WORK OF SESSION) */
                tripDays[dayDate] = { "date": `${year}-${month.padStart(2, "0")}-${date.padStart(2, "0")}` };
                //Create event arrObject for each day for multiple events(including hotel)
                tripDays[dayDate]["activityArr"] = []
                //tripDays[dayDate]["transitArr"] = [], tripDays[dayDate]['flightArr'] = [], tripDays[dayDate]['locationArr'] = [], tripDays[dayDate]['hotelArr'] = [];
                /* end-here TO BE DELETED (SINCE DUPLICATE THE WORK OF SESSION) */


                //Update tripDays object inside session
                req.session.tripDays[dayDate] = { "date": `${year}-${month.padStart(2, "0")}-${date.padStart(2, "0")}` };
                req.session.tripDays[dayDate]["activityArr"] = []


                //req.session.tripDays[dayDate]["transitArr"] = [], req.session.tripDays[dayDate]['flightArr'] = [], req.session.tripDays[dayDate]['locationArr'] = [], req.session.tripDays[dayDate]['hotelArr'] = [];
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

    router.post('/trip-list-hotel-update', (req, res) => {
        let newHotelNameUpdate = req.body.hotelName,
            newHotelLatUpdate = req.body.lat,
            newHotelLngUpdate = req.body.lng,
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
        let stayingDate = newHotelCheckInUpdate;
        let hotelObject = {
            "type":"Hotel",
            "request_date": stayingDate,
            "booking_details":{
                "hotelName": newHotelNameUpdate,
                "lat": newHotelLatUpdate,
                "lng": newHotelLngUpdate,
                "check_in": newHotelCheckInUpdate,
                "check_out": newHotelCheckOutUpdate,
                "country": newHotelCountry,
                "city": newHotelCity,
                "adult": newHotelNoOfAdults,
                "room_total": newHotelNoOfRooms,
                "price_total": newHotelPriceUpdate}
        };
        console.log('new hotel check in date >>'+newHotelCheckInUpdate);
        //Session store
        
        if(newHotelNoOfNights > numberOfDays){
            res.send("Incorrect request date");
        } else if (newHotelNoOfNights > 1) {
            for (let i = 0; i < newHotelNoOfNights; i++) {
                req.session.tripDays[stayingDate]["activityArr"].push(hotelObject);
                stayingDate = addOneDay(stayingDate);
                console.log('next staying date >>'+stayingDate);
                //hotelObject["request_date"] = stayingDate;
            }
        } else if (newHotelNoOfNights === 1) {
            req.session.tripDays[newHotelCheckInUpdate]["activityArr"].push(hotelObject);
        }          
        
        console.log('3 >>',req.session.tripDays);
        req.flash('success_msg', "Added hotel");
        res.redirect('/schedule');

    })

    router.get('/search-hotels/:checkInDate', (req, res) => {
        let checkIn = req.params.checkInDate;
        //console.log(checkIn);
        checkIn = checkIn.match(/(\d+-\d+-\d+)/g);
        //console.log('check in date '+checkIn);
        res.render('search-hotel', { fromDate: checkIn, endDate: req.session.endDate, API_KEY_TWO: process.env.API_KEY_TWO });
    })

    router.get('/search-hotel-edit', (req, res) => {
        res.render('search-hotel-edit', { fromDate: "2018-02-05", toDate: "2018-02-07", hotelAddress: "country=Japan&city=Mie", adult: "2", API_KEY_TWO: process.env.API_KEY_TWO });
    })

    router.post('/schedule/delete-activity',(req,res)=>{
        //console.log(req.body);
        //console.log("BEFORE DELETE>>>>>>>>",req.session.tripDays[req.body.request_date]["activityArr"]);
        
        req.session.tripDays[req.body.request_date]["activityArr"].splice(req.body.index-1,1);

        //console.log("AFTER DELETE>>>>>>>>",req.session.tripDays[req.body.request_date]["activityArr"]);
        res.json("haha");
    })

    router.post('/schedule/reoder-schedule',(req,res)=>{
        //console.log('data BEFORE sorting >>>',JSON.parse(decodeURI(req.session.tripDays[req.body.request_date]['activityArr'])));
        move(req.body.request_date, req.body.oldIndex, req.body.newIndex);
        function move (date, from, to) {
            let actArr = []
            req.session.tripDays[date]["activityArr"].map(function(el){
                actArr.push(el);
            });
            //console.log(actArr);
            actArr.splice(to, 0, actArr.splice(from, 1)[0]);
            console.log("BEFORE >>>>>>>>",req.session.tripDays[date]["activityArr"])
            req.session.tripDays[date]["activityArr"] = actArr;
            console.log("AFTER >>>>>>>>",req.session.tripDays[date]["activityArr"])
        };
        res.json("haha");
       // console.log('data AFTER sorting >>>',JSON.parse(decodeURI(req.session.tripDays[req.body.request_date]['activityArr'])));
       // res.redirect('/schedule');
    })

    router.get('/schedule/print',(req,res)=>{
        res.render('trip-list-print',{ eachTripDay: req.session.tripDays, startDate: req.session.startDate, endDate: req.session.endDate });
        
    })

    function addOneDay (originalDate) {
        var dat = new Date(originalDate);
        dat.setDate(dat.getDate() + 1);
        trimDat = JSON.stringify(dat).replace(/T00:00:00.000Z/g,"");
        console.log('trimDat A>>'+trimDat);
        console.log('trimDat B>>'+JSON.parse(trimDat));
        return JSON.parse(trimDat);
    }  
    return router;
}