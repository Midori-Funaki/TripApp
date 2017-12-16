const swappable = new Swappable.default(document.getElementsByClassName('schedule-activity-blocks')[0], {
  draggable: 'li',
});

swappable.on('swappable:start', () => console.log('swappable:start'))
swappable.on('swappable:swapped', () => console.log('swappable:swapped'));
swappable.on('swappable:stop', () => console.log('swappable:stop'));

if($('#new-activity-type').text().length > 0){
  if($('#new-activity-type').text() === 'Hotel'){
    //console.log('new event is hotel..');
    let days = ['Mon','Tue','Wed','Thur','Fri','Sat','Sun'];
    let newHotelName =  $('.new-activity-name').text();
    let newHoteAddress = $('.new-activity-location').text();
    let newCheckIn = $('.new-activity-hotel-check-in').text();
    let newCheckInDay = days[new Date(newCheckIn).getDay()-1];
    let newCheckOut = $('.new-activity-hotel-check-out').text();
    let newCheckOutDay = days[new Date(newCheckOut).getDay()-1];
    //console.log('new check in is >>'+newCheckIn+'-'+newCheckInDay);
    let newSwappableActivity = `
      <li class="list-group-item swappable-block">
        <div class="row">
            <div class="col-xs-8">
                <h5>Hotel</h5>
            </div>
            <div class="col-xs-4">
                <i class="fa fa-times fa-1x"></i>
            </div>
        </div>
        <p>${newHotelName}</p>
        <p>${newHoteAddress}</p>
      </li>
    `
    $(`.activity-section-${newCheckIn}-${newCheckInDay}`).find('ul').append(newSwappableActivity);
    $('#new-activity-details').find('p').empty();
    $('#new-activity-type').empty();
  }
}