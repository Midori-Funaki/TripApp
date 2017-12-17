$(document).on('click','.swappable-block',function(){
    let activityType = $(this).find('.activity-category').text();
    console.log('clicked activity type is >>'+activityType);
})