$().ready(function(){
    $.ajax({
        type: "POST",
        url: "https://dev-sandbox-api.airhob.com/sandboxapi/flights/v1.2/search",
        apikey: "cac56513-57c1-4",
        mode: "sandbox",
        contentType: "application/json",
        data:   {
                    "TripType": "O",
                    "NoOfAdults": 1,
                    "NoOfChilds": 0,
                    "NoOfInfants": 0,
                    "ClassType": "Economy",
                    "OriginDestination": [
                        {
                            "Origin": "SFO",
                            "Destination": "LAX",
                            "TravelDate": "04/23/2018"
                        }
                    ],
                    "Currency": "USD"
                }
    }).done(function(data){
        console.log(data);
    }).fail(function(err){
        console.log('err ',err);
    })
});