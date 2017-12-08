$().ready(function(){
    $.ajax({
        type: "POST",
        url: "https://dev-sandbox-api.airhob.com/productionapi/flights/v1.2/search",
        apikey: "3bcd6e75-17c4-4",
        mode: "production",
        Request: "One Way International flights",
        data:   {
                    "TripType": "O",
                    "NoOfAdults": 1,
                    "NoOfChilds": 0,
                    "NoOfInfants": 0,
                    "ClassType": "Economy",
                    "OriginDestination": [
                        {
                            "Origin": "HKG",
                            "Destination": "SYD",
                            "TravelDate": "02/23/2018"
                        }
                    ],
                    "Currency": "HKD"
                }
    }).done(function(data){
        console.log(data);
    })
});