var map;
let country, state, city,fromDate, checkOut, hotelId;

$(document).ready(function(){
    let adultTotal = 0;
    let childTotal = 0;
    let checkInSimple = $('input[name=fromDate]').val();
    let checkOut = checkInSimple;
    //Set up the calender select (PICK ME UP)
    $('#toDate').pickmeup_twitter_bootstrap();
    let checkIn = new Date($('input[name=fromDate]').val());
    pickmeup('#toDate').set_date(checkIn);

    $('#fromDate').on('pickmeup-change', function (e) {
        console.log(e.detail.formatted_date); // New date according to current format
        console.log(e.detail.date);           // New date as Date object
        fromDate = e.detail.formatted_date;
        pickmeup('#fromDate').hide();
    })

    $('#toDate').on('pickmeup-change', function (e) {
        console.log(e.detail.formatted_date); // New date according to current format
        console.log(e.detail.date);           // New date as Date object
        toDate = e.detail.formatted_date;
        checkOut = e.detail.formatted_date;
        pickmeup('#toDate').hide();
    })

    //show guest-room input modal
    $(document).on('click','#room-guest-input',function(e){
        if(!$('#guest-room-modal').hasClass("show-active")){
            $('#guest-room-modal').addClass("show-active");
        }
    })

    //guest-room search modal
    $(document).on('click','#guest-room-done',function(e){
        e.preventDefault();
        let childAgeArr = [];
        adultTotal = $('input[name = adult-number-radio]:checked').val();
        childTotal = $('input[name = child-number-radio]:checked').val();
        //hide guest-room modal
        $('#guest-room-modal').removeClass("show-active");
        $('#room-guest-input').val(`1 Room / ${adultTotal} Guests`)
    })

    //send api post request
    $(document).on('click','#serach-hotel-btn',function(e){
        e.preventDefault();
        $('.hotel-detail-controller').css('left', '0');
        searchHotel(checkInSimple,checkOut,adultTotal,childTotal);
    })

    //send room detail api
    $(document).on('click','.list-group-item',function(){
        hotelId = $(this).attr("id");
        let hotelNameForDetails = $(this).find("h5").text();
        let hotelUrl = $(this).find("img").attr("src");
        console.log('clicked hotel name >>'+JSON.stringify(hotelNameForDetails));
        console.log('clicked hotel img url >>'+JSON.stringify(hotelUrl));
        $('#hotel-detail-list-group').addClass('show-detail');
        searchDetails(hotelNameForDetails,hotelUrl);
    })
    //Close search result
    $(document).on('click', '.hide-btn', (e) => {
        $('.hotel-detail-controller').css('left', '-320px')
    })
    //Close detail
    $(document).on('click', '.detail-close', function() {
        $('#hotel-detail-list-group').removeClass('show-detail')
    })
    //airhob hotel api post call
    function searchHotel(checkin,checkout,adult,child){
        if(!city){
            city = state.replace(/\sPrefecture/,"");
        }
        console.log('country >> ',country);
        console.log('state >> ',state);
        console.log('city >> ',city);
        fetch('https://dev-sandbox-api.airhob.com/sandboxapi/stays/v1/search',{
            method:"POST",
            headers:{
                "apikey": "cac56513-57c1-4",
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
                
                addMarker({coords:{lat:parseFloat(JSON.stringify(hotel.hotelAddresss.latitude).replace(/\"/g, "")),lng:parseFloat(JSON.stringify(hotel.hotelAddresss.longitude).replace(/\"/g, ""))}});
            })
            $('#hotel-list-group').append(output);
        })
        .catch((err)=>{
            console.log('err',err);
        })
    }

    //Show avaiable rooms of selected hotel
    function searchDetails(hotelName, imageUrl){
        console.log('Calling hotel DETAIL api....');
        $('#hotelDeal-list-group').empty();
        fetch('https://dev-sandbox-api.airhob.com/sandboxapi/stays/v1/properties',{
            method:"POST",
            headers:{
                "apikey": "cac56513-57c1-4",
                "mode": "sandbox",
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                "HotelCodes": hotelId, 
                "FromDate": checkInSimple, 
                "ToDate": checkOut, 
                "Currency": "HKD", 
                "Occupancies": [{ 
                    "NoOfAdults": adultTotal
                }], 
                "ClientNationality": "IN" 
            })
        })
        .then((res)=>res.json())
        .then((data)=>{
            //console.log(data);
            let output = `
                <h3>${hotelName}</h3>
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
            $('#hotel-room-details').append(output);
        })
        .catch((err)=>{
            console.log('err',err);
        })
    }
})

//Google autocomplete VARIABLES
var placeSearch, autocomplete;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

var hotelSerachInputData = {
    checkInDate : 'date',
    checkOutDate : 'date'
};


//GOOGLE MAP AUTOCOMPLETE FUNCTION
function fillInHotelAddress(autocomplete, map, infowindow, marker) {
    country ="";
    state = "";
    city = "";
    // Get the place details from the autocomplete object.
    infowindow.close();
    //marker.setVisible(false);
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(9);  // Why 17? Because it looks good.
    }

    for (var component in componentForm) {
        document.getElementById(component).value = '';
        document.getElementById(component).disabled = false;
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        document.getElementById(addressType).value = val;
            // Get country, state, city data
            if(addressType == "country"){
                country = place.address_components[i][componentForm["country"]];
                console.log('country >> '+country);
            }else if(addressType == "locality"){
                city = place.address_components[i][componentForm["locality"]];
                console.log('state >> '+city);
            }else if (addressType == "administrative_area_level_1"){
                state = place.address_components[i][componentForm["administrative_area_level_1"]];
                console.log('state >> '+state);
            }
        }
    }
}

function initHotelMap() {
    let map2 = document.getElementsByClassName('map')[0];
    
    map = new google.maps.Map(map2, {
        center: {lat: -33.86, lng: 151.209},
        zoom: 13,
        mapTypeControl: false
    });

    let search_hotel = document.getElementById('search-hotel');
    let autocomplete_search_hotel = new google.maps.places.Autocomplete(search_hotel);
  //  autocomplete_search_hotel.bindTo('bounds', map);

    //google autocomplete info window/marker
    let infowindow = new google.maps.InfoWindow();
    let marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete_search_hotel.addListener('place_changed', function() {
        fillInHotelAddress(autocomplete_search_hotel, map, infowindow, marker)
    });
}

function addMarker(props){
    var marker = new google.maps.Marker({
    position:props.coords,
    map:map,
    //icon: icon,
    animation: google.maps.Animation.DROP,
    //icon:props.iconImage
}); 
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    /*
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
        });
    }
    */
}