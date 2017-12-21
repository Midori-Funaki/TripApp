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

//GOOGLE MAP
function mainInitMap() {
  let map = document.getElementById("day-map");
  
  map = new google.maps.Map(map, {
    center: {lat: -33.86, lng: 151.209},
    zoom: 13,
    mapTypeControl: false
  });

  $('#close-map').on('click', function() {
    $('.day-map-container').fadeOut(1000);
    google.maps.event.trigger(map, 'resize')
  })
  
  $('.fa-map').on('click', function() {
    $('.day-map-container').fadeIn(1000);
    google.maps.event.trigger(map, 'resize')
  })

  //set google map style
  map.setOptions({styles: styles['retro']});
}

