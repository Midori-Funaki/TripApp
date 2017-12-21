$(function() {
  let sortable;
  
  for(let i=0; i<document.getElementsByClassName('schedule-activity-blocks').length; i++){
     sortable = new Sortable.default(document.getElementsByClassName('schedule-activity-blocks')[i], {
      draggable: 'li',
    });
    sortable.on('sortable:start', (e) => {
      console.log(e)
      if ($(e.dragEvent.sensorEvent.target).hasClass('delete-activity')){
        //console.log('target element index>>',$(e.data.dragEvent.data.originalSource).index());
        //console.log($(e.data.dragEvent.data.originalSource).parents('.trip-black-container').siblings('h4').text())
        $(e.dragEvent.sensorEvent.target).parents('.list-group-item').empty();
        $.post('/schedule/delete-activity',{
          request_date: $(e.data.dragEvent.data.originalSource).parents('.trip-black-container').siblings('h4').text(),
          index: $(e.data.dragEvent.data.originalSource).index()
        }).done(() => {
          console.log("DONE")
        })
      }
    //  console.log("Origin element index >>> ",$(e.data.dragEvent.data.originalSource).index())
    });
    sortable.on('sortable:swapped', (e) => {
   //   console.log('sortable:swapped')
  //    console.log("Rplaced element index >>> ", $(e.data.swappedElement).index());
   //  console.log('target element index>>',e);
   //   console.log('target element index>>',$(e.data.dragEvent.data.originalSource).index());

  
    });
    sortable.on('sortable:stop', (e) => {
      //console.log($(e.data.dragEvent.data.originalSource).index())
      //console.log($(e.data.dragEvent.data.originalSource).parents('.trip-black-container').siblings('h4').text())
      console.log("BEFORE >>>>>>> ",e.data.oldIndex)
      console.log("AFTER  >>>>>>> ",e.data.newIndex)
      $.post('/schedule/reoder-schedule',{
        request_date: $(e.data.dragEvent.data.originalSource).parents('.trip-black-container').siblings('h4').text(),
        oldIndex: e.data.oldIndex,
        newIndex: e.data.newIndex,
        xhrFields:{
          withCredentials: true
        }
      }).done(()=>{
        console.log('done');
      })
      .catch((err)=>{
        console.log(err);
      })
    });
  }
});