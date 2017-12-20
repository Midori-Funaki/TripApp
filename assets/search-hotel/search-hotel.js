var map;
var markers = [];
let country, state, city,fromDate, checkOut, hotelId, showDetails;
let now = new Date();
let checkoutDay = new Date($('input#toDate').val());

pickmeup('input[name="toDate"]', {
    render : function (date) {
        if (date < now) {
            return {disabled : true, class_name : 'date-in-past'};
        }
        return {};
    } 
})

pickmeup('#toDate').set_date(checkoutDay);

$(document).ready(function(){
    let adultTotal = 0;
    let childTotal = 0;
    let checkInSimple = $('input[name=fromDate]').val();
    let checkOut = $('input#toDate').val();
    //Set up the calender select (PICK ME UP)
    $('#toDate').pickmeup_twitter_bootstrap();
    let checkIn = new Date($('input[name=fromDate]').val());
   
    $('#fromDate').on('pickmeup-change', function (e) {
        fromDate = e.detail.formatted_date;
        pickmeup('#fromDate').hide();
    })

    $('#toDate').on('pickmeup-change', function (e) {
        toDate = e.detail.formatted_date;
        checkOut = e.detail.formatted_date;
        pickmeup('#toDate').hide();
    })

    //show guest-room input modal
    $(document).on('focus','#room-guest-input',function(e){
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

    //hover hotel show marker
    $(document).on('mouseover', '.list-group-item', function() {
        if (!showDetails){
        clearMarkers()
        addMarker({coords:{lat:parseFloat($(this).find('input[name=lat]').val()),lng:parseFloat($(this).find('input[name=lng]').val())}});    
        };
    })
    
    //hover hotel show marker
    $(document).on('mouseout', '.list-group-item', function() {
        if (!showDetails){showMarkers();};
    })


    //send room detail api
    $(document).on('click','.hotel-item-list',function(){
        clearMarkers()
        addMarker({coords:{lat:parseFloat($(this).find('input[name=lat]').val()),lng:parseFloat($(this).find('input[name=lng]').val())}});    
        showDetails = true;
        hotelId = $(this).attr("id");
        let hotelNameForDetails = JSON.stringify($(this).find("h5").text());
        
        let hotelUrl = JSON.stringify($(this).find(".hotel-image").css("background-image").replace(/^url\(['"](.+)['"]\)/, '$1'));
 
        let clickedHotelAddress = JSON.stringify($(this).find("p:eq(0)").text());
        console.log('clicked hotel address >>'+clickedHotelAddress);
        //console.log('clicked hotel name >>'+JSON.stringify(hotelNameForDetails));
        //console.log('clicked hotel img url >>'+JSON.stringify(hotelUrl));
        $('#hotel-detail-list-group').addClass('show-detail');
        searchDetails(hotelNameForDetails,hotelUrl,clickedHotelAddress);
        //searchDetails();
    })
    //Close search result
    $(document).on('click', '.hide-btn', (e) => {
        $('.hotel-detail-controller').css('left', '-320px')
    })
    //Close detail
    $(document).on('click', '.detail-close', function() {
        $('#hotel-detail-list-group').removeClass('show-detail')
        showDetails = false;
    })
    //airhob hotel api post call
    function searchHotel(checkin,checkout,adult,child){
        if(checkIn && checkout && adult && child && (city!= null)) {
            $('.hotel-detail-controller').css('left', '0');
            if(!city){
                city = state.replace(/\sPrefecture/,"");
            }
            console.log('checkout', checkout, checkIn, adult, child)
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
                if (data.hotelData.length) {
                    let output = "";
                    data.hotelData.forEach((hotel)=>{
                        
                        output += `
                        <a id=${JSON.stringify(hotel.HotelCode)} class="row list-group-item hotel-item-list">
                            <div>`
                        console.log("IMAGE: ",hotel.hotelImages)
                        if(hotel.hotelImages.length && hotel.hotelImages[0].url != ""){
                                output += `<div class="hotel-image" style="background-image: url(${hotel.hotelImages[0].url});"></div>`
                        }else {
                            output +=`<div class="hotel-image"></div>`
                        }
                        output +=`
                            </div>
                            <div>
                                <h5>${JSON.stringify(hotel.fullName).replace(/\"/g, "")}</h5>
                                <p class="hotel-address">${JSON.stringify(hotel.hotelAddresss.street).replace(/\"/g, "")}</p>
                                <p class="hotel-price">${hotel.price.price_details.net[0].currency} ${hotel.price.price_details.net[0].amount}</p>
                                <input type="hidden" name="lat" value=${JSON.stringify(hotel.hotelAddresss.latitude).replace(/\"/g, "")}>
                                <input type="hidden" name="lng" value=${JSON.stringify(hotel.hotelAddresss.longitude).replace(/\"/g, "")}>
                            </div>
                        </a>
                        `
                        
                        addMarker({coords:{lat:parseFloat(JSON.stringify(hotel.hotelAddresss.latitude).replace(/\"/g, "")),lng:parseFloat(JSON.stringify(hotel.hotelAddresss.longitude).replace(/\"/g, ""))}});
                    })
                    $('#hotel-list-group').html(output);
                } else {
                    $('#hotel-list-group').html($(`<div style="margin-left: 40px; color: grey;">There is no flight on the search requirements</div>`));
                }
            })
            .catch((err)=>{
                console.log('err',err);
            })
        } 
    }





    //Show avaiable rooms of selected hotel
    function searchDetails(hotelName, imageUrl, hotelAddress){
        console.log('Calling hotel DETAIL api....');
        $('#hotelDeal-list-group').empty();
        $('#hotel-room-details').empty();

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
            console.log("detailss: ",data);
            $('#hotel-detail-list-group').addClass('show-detail');
            let output = `
                <h3 class="hotel-main-name text-center">${hotelName.replace(/[\"]/g, "")}</h3>
                <div class="main-hotel-image"></div>
            `;
            
            data.hotel.ratetype.bundledRates.forEach(function(eachDeal){
                //console.log('Each deal >>'+JSON.stringify(eachDeal));
                console.log('Each room type before >>'+eachDeal.rooms[0].room_type);
                console.log('Each room type >>'+JSON.stringify(eachDeal.rooms[0].room_type));
                let clickedRoomType = JSON.stringify(eachDeal.rooms[0].room_type).replace(/\"/g, "");
                let clickedNoOfRooms = JSON.stringify(eachDeal.rooms[0].no_of_rooms).replace(/\"/g, "");
                let afterTaxTotal = JSON.stringify(eachDeal.price_details.Netprice[0].currency).replace(/\"/g, "") + JSON.stringify(eachDeal.price_details.Netprice[0].amount).replace('"',"");
                output += `
                    <a class="list-group-item hotel-detail-info">
                        <div class="row">
                            <div class="col-xs-9">
                                <p class="room-type">${clickedRoomType}</p>
                                <p class="room-night">${data["no_of_nights"]} Night(s)</p>
                                <p class="room-total">${afterTaxTotal} (After tax)</p>
                            </div>
                            <div class="col-xs-3">
                                <form class="form-group" method="POST" action="/trip-list-hotel-update">
                                    <input class="invisible-input" name="hotelName" type="text" value=${hotelName}>
                                    <input class="invisible-input" name="url" type="text" value=${imageUrl}>
                                    <input class="invisible-input" name="address" type="text" value=${hotelAddress}>
                                    <input class="invisible-input" name="country" type="text" value=${country}>
                                    <input class="invisible-input" name="city" type="text" value=${city}>
                                    <input class="invisible-input" name="noOfRooms" type="text" value="${clickedNoOfRooms}">
                                    <input class="invisible-input" name="noOfAdults" type="text" value="${adultTotal}">
                                    <input class="invisible-input" name="rooomType" type="text" value=${clickedRoomType}>
                                    <input class="invisible-input" name="price" type="text" value=${afterTaxTotal}>
                                    <input class="invisible-input" name="checkIn" type="text" value=${checkInSimple}>
                                    <input class="invisible-input" name="checkOut" type="text" value=${checkOut}>
                                    <input type="submit" class="btn btn-primary" value="Book">
                                </form>
                            </div>
                        </div>
                    </a>
                    `
            })
            $('#hotel-room-details').html(output);
            if (imageUrl) {
                $('.main-hotel-image').css('background-image', 'url('+ imageUrl + ')')
            }
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
    //Refresh country, state, city data
    country = "";
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

    //set google map style
    map.setOptions({styles: styles['retro']});
}
// Adds a marker to the map and push to the array.
function addMarker(props){
    var marker = new google.maps.Marker({
    position:props.coords,
    map:map,
    icon: props.iconurl,
    //icon:props.iconImage
}); 
markers.push(marker);
}
// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
  }

  // Shows any markers currently in the array.
  function showMarkers() {
    setMapOnAll(map);
  }

  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    clearMarkers();
    markers = [];
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