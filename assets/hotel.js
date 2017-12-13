let country, state, city;

$(document).ready(function(){
    let adultTotal = 0;
    let childTotal = 0;
    let checkInSimple = $('input[name=fromDate]').val();
    let checkOut = checkInSimple;
    //Set up the calender select (PICK ME UP)
    $('#toDate').pickmeup_twitter_bootstrap();
    let checkIn = new Date($('input[name=fromDate]').val());
    console.log('check in >> ', checkInSimple);
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
        adultTotal = Number($('input[name = adult-number-radio]:checked').val());
        childTotal = Number($('input[name = child-number-radio]:checked').val());
        console.log('adult total >> '+adultTotal);
        console.log('child total >> '+childTotal);
        //hide guest-room modal
        $('#guest-room-modal').removeClass("show-active");
        $('#room-guest-input').val(`
            1 Room / ${adultTotal} Guests
        `)
    })

    //send api post request
    $(document).on('click','#serach-hotel-btn',function(e){
        e.preventDefault();
        //checkOut = $('input[name=toDate]').val();
        console.log('check out date >> ' ,checkOut);
        console.log('sending request to hotel api');
        searchHotel(checkInSimple,checkOut,adultTotal,childTotal);
    })

    //airhob hotel api post call
    function searchHotel(checkin,checkout,adult,child){
        if(city = ""){
            city = state;
        }
        fetch('https://dev-sandbox-api.airhob.com/sandboxapi/stays/v1/search',{
            method:"POST",
            headers:{
                "apikey": "cac56513-57c1-4",
                "mode": "sandbox",
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                "City": `${city}`, 
                "Country": `${country}`, 
                "Latitude": "", 
                "Longitude": "", 
                "FromDate": `${checkin}`, 
                "ToDate": `${checkout}`, 
                "ClientNationality": "IN", 
                "Currency": "HKD", 
                "Occupancies": [ {
                    "NoOfAdults": adult
                    }] 
            })
        })
        .then((res)=>res.json())
        .then((data)=>{
            //show hotel api data
            //console.log('hotel info: '+JSON.stringify(data));
            let output;
            data.hotelData.forEach((hotel)=>{
                //console.log('each data '+JSON.stringify(hotel));
                console.log('each hotel image url '+JSON.stringify(hotel.hotelImages[0].url));
                console.log('street address '+hotel.hotelAddresss.street);
                output += `
                <div class="row">
                    <div class="col-xs-3">
                        <img class="hotel-image" src=${hotel.hotelImages[0].url}>
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

//Google autocomplete
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

function initAutocomplete() {
// Create the autocomplete object, restricting the search to geographical
// location types.
autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById('autocomplete2')),
    {types: ['geocode']});

// When the user selects an address from the dropdown, populate the address
// fields in the form.
autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
// Get the place details from the autocomplete object.
var place = autocomplete.getPlace();

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
            city = "";
            city += place.address_components[i][componentForm["country"]];
            console.log('state >> '+city);
        }else if (addressType == "administrative_area_level_1"){
            state = place.address_components[i][componentForm["country"]];
            console.log('state >> '+state);
        }
    }
}

}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
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
}