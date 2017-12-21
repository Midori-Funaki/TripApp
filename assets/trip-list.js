$(function() {
  let swappable;
  
  for(let i=0; i<document.getElementsByClassName('schedule-activity-blocks').length; i++){
     swappable = new Swappable.default(document.getElementsByClassName('schedule-activity-blocks')[i], {
      draggable: 'li',
    });
    swappable.on('swappable:start', (e) => {
      if ($(e.dragEvent.sensorEvent.target).hasClass('delete-activity')){
        //console.log('target element index>>',$(e.data.dragEvent.data.originalSource).index());
        //console.log($(e.data.dragEvent.data.originalSource).parents('.trip-black-container').siblings('h4').text())
        $(e.dragEvent.sensorEvent.target).parents('.list-group-item').css('background-color','red');
        $.post('/schedule/delete-activity',{
          request_date:  $(e.data.dragEvent.data.originalSource).parents('.trip-black-container').siblings('h4').text(),
          index: $(e.data.dragEvent.data.originalSource).index()
        })
      }
    });
    swappable.on('swappable:swapped', () => console.log('swappable:swapped'));
    swappable.on('swappable:stop', (e) => {
    //console.log($(e.data.dragEvent.data.originalSource).index())
    //console.log($(e.data.dragEvent.data.originalSource).parents('.trip-black-container').siblings('h4').text())
    //console.log($(e.data.dragEvent.data.originalSource))
    });
  }
  
  
});