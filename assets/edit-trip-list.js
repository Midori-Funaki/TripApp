$(document).on('click','.list-group-item',function(){
    let activityType = $(this).find('.new-activity-name').text();
    console.log('clicked activity type is >>'+activityType);
})