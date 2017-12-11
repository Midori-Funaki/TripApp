function searchHotel(){
    fetch('https://dev-sandbox-api.airhob.com/sandboxapi/stays/v1/search',{
        method:"POST",
        headers:{
            "apikey": "cac56513-57c1-4",
            "mode": "sandbox",
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            "City": "Manchester", 
            "Country": "United Kingdom", 
            "Latitude": "", 
            "Longitude": "", 
            "FromDate": "2018-04-23", 
            "ToDate": "2018-04-24", 
            "ClientNationality": "IN", 
            "Currency": "USD", 
            "Occupancies": [ {
                "NoOfAdults": 1, 
                "ChildrenAges": [ 5, 7 ] 
                },
                { "NoOfAdults": 2 
            } ] 
        })
    })
    .then((res)=>res.json())
    .then((data)=>{
        console.log('hotel info: '+JSON.stringify(data));
    })
}

searchHotel();