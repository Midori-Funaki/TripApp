function searchFlight(){
    fetch("https://dev-sandbox-api.airhob.com/sandboxapi/flights/v1.2/search",{
        method: "POST",
        headers:{
            "apikey": "cac56513-57c1-4",
            "mode": "sandbox",
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
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
        })
    })
    .then((res)=> res.json())
    .then((data)=> {
        let output = '<h2>Flights & Price</h2>';
        data.OneWayAvailabilityResponse.ItinearyDetails[0].Items.forEach(function(flight){
            output += `
                <h4>Flight Info: </h4>
                <p>${JSON.stringify(flight.FlightDetails)}</p>
                <h4 id="flight-price">Total Price: ${flight.FlightDetails[0].CurrencyCode}${flight.FareDescription.PaxFareDetails[0].OtherInfo.GrossAmount}</h4>
            `
        })
        document.getElementById('output').innerHTML = JSON.stringify(output);
    })
}


searchFlight();