let checkInSimple = "2018-02-06",//
    checkOut = "2018-02-07",//
    adult = "1",//
    child,
    country = "Japan",//
    state = "Mie",//
    city = "Mie",//
    hotelId;//


searchHotel(checkInSimple,checkOut,adult,child);

$(document).on('click','.list-group-item',function(){
    hotelId = $(this).attr("id");
    let hotelNameForDetails = $(this).find("h5").text();
    let hotelUrl = $(this).find("img").attr("src");
    console.log('clicked hotel name >>'+JSON.stringify(hotelNameForDetails));
    console.log('clicked hotel img url >>'+JSON.stringify(hotelUrl));
    searchDetails(hotelNameForDetails,hotelUrl);
})

//airhob hotel api post call
function searchHotel(checkin,checkout,adult,child){
    console.log('Calling SEARCH hotel api....');
    if(!city){
        city = state.replace(/\sPrefecture/,"");
    }
    console.log('country >> ',country);
    console.log('state >> ',state);
    console.log('city >> ',city);
    fetch('https://dev-sandbox-api.airhob.com/sandboxapi/stays/v1/search',{
        method:"POST",
        headers:{
            "apikey": "API_KEY_ONE",
            "mode": "sandbox",
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            "City": city, 
            "Country": country, 
            "Latitude": "", 
            "Longitude": "", 
            "FromDate": checkin, 
            "ToDate": checkout, 
            "ClientNationality": "IN", 
            "Currency": "HKD", 
            "Occupancies": [ {
                "NoOfAdults": adult
                }] 
        })
    })
    .then((res)=>res.json())
    .then((data)=>{
        let output;
        data.hotelData.forEach((hotel)=>{
            output += `
            <div id=${JSON.stringify(hotel.HotelCode)} class="row list-group-item">
                <div class="col-xs-3">`
            if(hotel.hotelImages.length > 0){
                    output += `<img class="hotel-image" src=${hotel.hotelImages[0].url}>`
            }else {
                output +=`<img class="hotel-image" src="">`
            }
            output +=`
                </div>
                <div class="col-xs-9">
                    <h5>${JSON.stringify(hotel.fullName).replace(/\"/g, "")}</h5>
                    <p>${JSON.stringify(hotel.hotelAddresss.street).replace(/\"/g, "")}</p>
                    <p>${hotel.price.price_details.net[0].currency} ${hotel.price.price_details.net[0].amount}</p>
                </div>
            </div>
            `
        })
        $('#hotel-list-group').append(output);
    })
    .catch((err)=>{
        console.log('err',err);
    })
}

function searchDetails(hotelName, imageUrl){
    console.log('Calling hotel DETAIL api....');
    $('#hotelDeal-list-group').empty();
    fetch('https://dev-sandbox-api.airhob.com/sandboxapi/stays/v1/properties',{
        method:"POST",
        headers:{
            "apikey": "API_KEY_ONE",
            "mode": "sandbox",
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            "HotelCodes": hotelId, 
            "FromDate": checkInSimple, 
            "ToDate": checkOut, 
            "Currency": "HKD", 
            "Occupancies": [{ 
                "NoOfAdults": adult
            }], 
            "ClientNationality": "IN" 
        })
    })
    .then((res)=>res.json())
    .then((data)=>{
        //console.log(data);
        let output = `
            <h3>Rooms</h3>
            <h4>${hotelName}</h4>
            <img src=${imageUrl}>
        `;
        data.hotel.ratetype.bundledRates.forEach(function(eachDeal){
            //console.log('Each deal >>'+JSON.stringify(eachDeal));
            console.log('Each room type >>'+JSON.stringify(eachDeal.rooms[0].room_type));
            output += `
                <div class="list-group-item">
                    <div class="row">
                        <div class="col-xs-9">
                            <p>Room type      :${JSON.stringify(eachDeal.rooms[0].room_type).replace(/\"/g, "")}</p>
                            <p>Number of Rooms:${JSON.stringify(eachDeal.rooms[0].no_of_rooms).replace(/\"/g, "")}</p>
                            <p>After tax total:${JSON.stringify(eachDeal.price_details.Netprice[0].currency).replace(/\"/g, "")} ${JSON.stringify(eachDeal.price_details.Netprice[0].amount).replace('"',"")}</p>
                        </div>
                        <div class="col-xs-3">
                            <form class="form-group" method="" action="">
                                <input type="submit" class="btn btn-success" value="Book">
                            </form>
                        </div>
                    </div>
                </div>
                `
        })
        $('#hotelDeal-list-group').append(output);
    })
    .catch((err)=>{
        console.log('err',err);
    })
}
