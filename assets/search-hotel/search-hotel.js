let country, state, city,fromDate, checkOut;

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
    })

    $('#toDate').on('pickmeup-change', function (e) {
        console.log(e.detail.formatted_date); // New date according to current format
        console.log(e.detail.date);           // New date as Date object
        toDate = e.detail.formatted_date;
        checkOut = e.detail.formatted_date;
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
        searchHotel(checkInSimple,checkOut,adultTotal,childTotal);
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
                <div class="row">
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
    // Get the place details from the autocomplete object.
    infowindow.close();
    marker.setVisible(false);
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
                city += place.address_components[i][componentForm["locality"]];
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