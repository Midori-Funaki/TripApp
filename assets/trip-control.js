const sequelize = require('./sequelize'),
    models = require('./models'),
    User = models.users,
    Trip = models.trips,
    Transaction = models.trips,
    User_trips = models.user_trips;

let user_id = 1;
$(document).on('click', '#show_trip', function() {
    
  })

Trip.findAll({
    attributes: ['id', 'nights of stay', 'start date', 'end date', 'tripName'],
    where: { id: user_id },
    
}).then(trip => {
    $('#trip-list').append($(`${trip}`))
    
})

// add trip here 

var newTrip = new Trip();
newTrip.user_id = user_id,
    newTrip.tripName = "new york",
    newTrip.startDate = "2016-08-09",
    newTrip.endDate = "2016-08-09",
    newTrip.nightsOfStay = 3,
    newTrip.noOfAdults = 2,
    newTrip.noOfKids = 0,
    newTrip.createdAt = "2016-08-09 07:42:28",
    newTrip.updatedAt = "2016-08-09 07:42:28"
newTrip.save();

//         Delete trip here
Trip.findOne({
    where: {
        id: trip_id
    }
}).then((trip) => {
    trip.destroy();
});