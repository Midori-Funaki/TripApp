
$(document).ready(function(){
    let now = new Date();
    let startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 2);

    pickmeup('#start-date', {
        render : function (date) {
            if (date < now) {
                return {disabled : true, class_name : 'date-in-past'};
            }
            return {};
        } 
    })
    pickmeup('#end-date', {
        render : function (date) {
            if (date < now) {
                return {disabled : true, class_name : 'date-in-past'};
            }
            return {};
        } 
    })

     //Set the date to the html
     pickmeup('#start-date').set_date(startDate);
     pickmeup('#end-date').set_date(endDate);

    //Set up the calender select
    $('#start-date, #end-date').pickmeup_twitter_bootstrap();

    $('#start-date').on('pickmeup-change', function (e) {
        startDate = e.detail.formatted_date;
        pickmeup('#start-date').hide();
      
        pickmeup("#end-date").set_date(startDate);
        pickmeup('#end-date').update();
    })

    $('#end-date').on('pickmeup-change', function (e) {
        endDate = e.detail.formatted_date;
        pickmeup('#end-date').hide();
    })
});
