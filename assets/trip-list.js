$(function() {
  /*
  $('.delete-activity').on('click',function(){
    console.log('x clicked >>'+this);
    $(this).find('.swappable-block').css('background-color','black');
  })
  */
  
  let swappable;
  
  for(let i=0; i<document.getElementsByClassName('schedule-activity-blocks').length; i++){
     swappable = new Swappable.default(document.getElementsByClassName('schedule-activity-blocks')[i], {
      draggable: 'li',
    });
    swappable.on('swappable:start', (e) => {
      if ($(e.dragEvent.sensorEvent.target).hasClass('delete-activity')){
        // we know the user clicked delete here
        //console.log('e >>'+JSON.stringify(e));
        //console.log('x clicked >>'+JSON.stringify($(e.dragEvent.sensorEvent.target)));
        //console.log('closest ht >>'+JSON.stringify($(e.dragEvent.sensorEvent.target).find('h5')));
        console.log(JSON.stringify('input content >>'+$(e.dragEvent.sensorEvent.target).children('.hidden-input-data')));
        $(e.dragEvent.sensorEvent.target).parents('.list-group-item').empty();
      }
    });
    swappable.on('swappable:swapped', () => console.log('swappable:swapped'));
    swappable.on('swappable:stop', () => console.log('swappable:stop'));
  }
  
  
});
/*
let days,
    newHotelName,
    newHoteAddress,
    newCheckIn,
    newCheckInDay,
    newCheckOut,
    newCheckOutDay,
    newNoOfNights,
    newNumberOfRooms,
    newNumberOfAdults;

//create new block when new activity is added
if($('#new-activity-type').text().length > 0){
  if($('#new-activity-type').text() === 'Hotel'){
    console.log('new event is hotel..');
    days = ['Mon','Tue','Wed','Thur','Fri','Sat','Sun'];
    newHotelName =  $('.new-activity-name').text();
    newHoteAddress = $('.new-activity-location').text();
    newCheckIn = $('.new-activity-hotel-check-in').text();
    newCheckInDay = days[new Date(newCheckIn).getDay()-1];
    newCheckOut = $('.new-activity-hotel-check-out').text();
    newCheckOutDay = days[new Date(newCheckOut).getDay()-1];
    newNoOfNights = (new Date(newCheckOut).getTime() - new Date(newCheckIn).getTime()) /(1000*60*60*24);
    newNumberOfRooms = $('.new-activity-room-total').text();
    newNumberOfAdults = $('.new-activity-adult-number').text();
    let checkInContainer = $(`.activity-section-${newCheckIn}-${newCheckInDay}`).find('ul');
    //console.log('new check in >>'+newCheckIn);
    //console.log('new check out >>'+newCheckOut);
    //console.log('new no of nights >>'+newNoOfNights);
    //console.log('check in container >>'+checkInContainer);
    let newSwappableActivity = `
      <a href="/search-hotel-edit"><li class="list-group-item swappable-block">
        <div class="row">
            <div class="col-xs-8">
                <h5 class="activity-category">Hotel</h5>
            </div>
            <div class="col-xs-4">
                <i class="fa fa-times fa-1x"></i>
            </div>
        </div>
        <p>${newHotelName}</p>
        <p>${newHoteAddress}</p>
        <p class="invisible-acticity-detail">${newCheckIn}</p>
        <p class="invisible-acticity-detail">${newCheckOut}</p>
        <p class="invisible-acticity-detail">${newNumberOfAdults}</p>
        <p class="invisible-acticity-detail">${newNumberOfRooms}</p>
      </li>
      </a>
    `
    for(let i=0; i<newNoOfNights; i++){
      checkInContainer.append(newSwappableActivity);
      checkInContainer = checkInContainer.next('.schedule-activity-blocks').find('ul');
      //console.log('next acticity container >>'+JSON.stringify(checkInContainer));
    }
    //$('#new-activity-details').find('p').empty();
    //$('#new-activity-type').empty();
  }
}

//edit trip list
$(document).on('click','.swappable-block',function(){
  let activityType = $(this).find('.activity-category').text();
  console.log('clicked activity type is >>'+activityType);
  if (activityType === "Hotel"){
    console.log('hotel name >>'+newHotelName);
  }

})
*/