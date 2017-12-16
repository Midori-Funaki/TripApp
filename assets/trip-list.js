const swappable = new Swappable.default(document.getElementsByClassName('schedule-activity-blocks')[0], {
  draggable: 'li',
});

swappable.on('swappable:start', () => console.log('swappable:start'))
swappable.on('swappable:swapped', () => console.log('swappable:swapped'));
swappable.on('swappable:stop', () => console.log('swappable:stop'));

if($('#new-activity-type').text().length > 0){
  if($('#new-activity-type').text() === 'Hotel'){
    console.log('new event is hotel..');
    let days = ['Mon','Tue','Wed','Thur','Fri','Sat','Sun'];
    let newHotelNmae =  $('.new-activity-name').text();
    let newHoteAddress = $('.new-activity-location').text();
    let newCheckIn = $('.new-acticity-hotel-check-in').text();
    let newCheckInDay = days[new Date(newCheckIn).getDay()-1];
    let newCheckOut = $('.new-acticity-hotel-check-out').text();
    let newCheckOutDay = days[new Date(newCheckOut).getDay()-1];
    console.log('new check in is >>'+newCheckIn+'-'+newCheckInDay);
  }
}