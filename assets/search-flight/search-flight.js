//PICK DATE 
let fromDate, toDate;
$('#from-date-flight, #to-date-flight').pickmeup_twitter_bootstrap();
//The request date
let startDate = new Date($('input[name="request-flight-date"]').val());
//Set the date to the html
pickmeup('#from-date-flight').set_date(startDate);
//Set the return date to be request date + 1
let returnDate = new Date($('input[name="request-flight-date"]').val());
returnDate.setDate(returnDate.getDate() + 1);
pickmeup('#to-date-flight').set_date(returnDate);

//Listening to date change
$('#from-date-flight').on('pickmeup-change', function (e) {
    fromDate = e.detail.formatted_date;
    pickmeup('#from-date-flight').hide();
})

$('#to-date-flight').on('pickmeup-change', function (e) {
    toDate = e.detail.formatted_date;
    pickmeup('#to-date-flight').hide();
   
    $('input[name="optradio-1"]:eq(1)').prop('checked', true);
    $('#to-date-flight').attr('readonly', false);
})

//SET ONEWAY TRIP
$('input[name="optradio-1"]:eq(0)').on('click', function() {
    $('#to-date-flight').attr('readonly', true);
    pickmeup('#to-date-flight').set_date(startDate);
})
//SET ROUND WAY TRIP
$('input[name="optradio-1"]:eq(1)').on('click', function() {
    $('#to-date-flight').attr('readonly', false);
})

//CHECK IF SINGLE/ROUND TRIP


//ADD FLIGHT DETAIL
$(document).on('click', '#flight-detail-input' ,(e) => {
    $('.flight-detail-modal').addClass('show-modal');
})

//Passenger function
$('.val-decrease').on('click', function() {
    let passenger = 0;
    let num = parseInt($(this).siblings('.val-show').html());
    if (($(this).closest('.passenger-group').index() === 0 && num > 1) || ($(this).closest('.passenger-group').index() !== 0 && num > 0)){
        num -= 1;
        $(this).siblings('.val-show').html(num) 
        $.map($('.val-show'),(each) => {
            passenger += Number($(each).html())
        })
        $('#flight-detail-input').val(`${passenger} passenger(s)`)
    }
})

$('.val-increase').on('click', function() {
    let passenger = 0;
    let num = parseInt($(this).siblings('.val-show').html());
    if (num < 20) {
        num +=1 ;
        $(this).siblings('.val-show').html(num) 
        $.map($('.val-show'),(each) => {
            passenger += Number($(each).html())
        })
        $('#flight-detail-input').val(`${passenger} passenger(s)`)
    }
})

$(document).on('click',function(event) { 
    if ($('.flight-detail-modal').css("opacity") !== "0") {
        if(!$(event.target).closest('.flight-detail-modal').length) {           
            $('.flight-detail-modal').removeClass("show-modal");            
        }     
    }      
});

function initMap() {
    let map1 = document.getElementsByClassName('map')[0];
    
    map = new google.maps.Map(map1, {
        center: {lat: -33.86, lng: 151.209},
        zoom: 9,
        mapTypeControl: false
    });

    //get the location input
    let from_locat = document.getElementById('from-locat-flight'),
        to_locat = document.getElementById('to-locat-flight');

    let autocomplete = new google.maps.places.Autocomplete(from_locat),
    autocomplete_to_locate = new google.maps.places.Autocomplete(to_locat);

    autocomplete.bindTo('bounds', map);
    autocomplete_to_locate.bindTo('bounds', map);

    let originPromise, destinationPromise, originSearchPromise, desSearchPromise;

    let poly = new google.maps.Polyline({
        strokeColor: 'IndianRed',
        strokeOpacity: 1.0,
        strokeWeight: 6,
        geodesic: true
    });
    poly.setMap(map);

    let routePoint = [], viewPort = new google.maps.LatLngBounds();

    let infowindow1 = new google.maps.InfoWindow();
    let infowindow2 = new google.maps.InfoWindow();
    let marker1 = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });
    let marker2 = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    //autocomplete evenlistener
    originSearchPromise = new Promise((resolve, reject) => {
        autocomplete.addListener('place_changed', function() {
            originPromise = fillInAddress(autocomplete, map, marker1, infowindow1)  
            originPromise.then((data) => {
                routePoint.splice(0,1,data.geometry.location)
                drawNewRoute(routePoint, poly);
                viewPort.union(data.geometry.viewport);
                map.fitBounds(viewPort);
                return resolve(data)
            }).catch((err) => {
                return reject(err)
            })
        })
    });

    desSearchPromise = new Promise((resolve, reject) => {
        autocomplete_to_locate.addListener('place_changed', function() {
            destinationPromise = fillInAddress(autocomplete_to_locate, map, marker2, infowindow2)  
            destinationPromise.then((data) => {
                routePoint.splice(1,1,data.geometry.location)
                drawNewRoute(routePoint, poly);
                viewPort.union(data.geometry.viewport);
                map.fitBounds(viewPort);
                return resolve(data)
            }).catch((err) => {
                return reject(err)
            })
        
        })
    });

    Promise.all([originSearchPromise, desSearchPromise])
    .then((data) => {
        let latLng = [data[0].geometry.location, data[1].geometry.location]
        let placeLatLng = [[data[0].geometry.location.lat(),data[0].geometry.location.lng()], [data[1].geometry.location.lat(),data[1].geometry.location.lng()]]

        $(document).on('click', "#trans-add-flight", function() {
            getIATA(placeLatLng, routePoint, poly);
            $('#flight-list-group').empty();
            $('#loader').hide()
            $('.detail-controller').css('left', '0')
        })
    }).catch((err) => {
        $('.loader').hide();
        console.log(err);
    }).then(() => {
        $('.loader').show();
    })

    //set google map style
    map.setOptions({styles: styles['retro']});
}

function fillInAddress(autocomplete, map, marker, infowindow) {
    //google autocomplete info window/marker
    infowindow.close();
    marker.setVisible(false);
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    
    return new Promise((resolve, reject) => {
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return reject("No result");
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker.setIcon(({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        
    
        var address = '';
        if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
        return resolve(place)
    })
}

function drawNewRoute(LatLog, poly, marker, infowindow) {
    if (LatLog.length > 1) {
        poly.setPath(LatLog)
    }
}


function getIATA(nameArr, routePoint, poly) {
    let flightReq = $("form[name='search-flight-form']").serializeArray()
    let passenger = {};
    passenger.adults = parseInt($(".val-show:eq(0)").html()),
    passenger.children = parseInt($(".val-show:eq(1)").html()),
    passenger.infants = parseInt($(".val-show:eq(2)").html());
    flightReq.push(passenger);

    $.post('/get-iatacode',
        {
            nameArr: nameArr,
            flightReq: JSON.stringify(flightReq)
        }
    ).done((data) => {
        if (data.airRoute.length) {
            data.airRoute.forEach((route) => {
                //successful result
                displayAirRoute(route, flightReq[6], routePoint, poly, flightReq);
            })
        } else {
            //no result
            $('.loader').hide();
            $('#list-group-container').append($(`<div style="margin-left: 40px; color: grey;">There is no flight on the search requirements</div>`));
        }
    }).fail((err) => {
        console.log(err);
    })  
}

//Display All the airRoutes
function displayAirRoute(route, request, routePoint, poly, flightReq) {
    let resultRow = $(`<div class="routeResult"></div>`);
    let eachFlight = $(`<div class="eachFlight"></div>`);
    let priceGroup = $(`<div class="priceGroup"></div>`);
    let flightPrice = $(`<div class="flightPrice"></div>`);
    let price = route.price,
        fly_duration = route.fly_duration,
        return_duration = route.return_duration;
    let passengerNum = request.adults + request.infants + request.children;

    route.route.forEach((routeIn, index) => {
        //For route display 
        let latFrom = routeIn.latFrom,
            lngFrom = routeIn.lngFrom,
            latTo = routeIn.latTo,
            lngTo = routeIn.lngTo;

        resultRow.attr('latFrom', latFrom);
        resultRow.attr('lngFrom', lngFrom);
        resultRow.attr('latTo', latTo);
        resultRow.attr('lngTo', lngTo);
        let routeInfo = $(`<div class="routeInfo"></div>`);
        let fromBlock = $(`<span class="fromBlock text-center"></span>`),
            durBlock = $(`<span class="durBlock text-center"></span>`),
            toBlock = $(`<span class="toBlock text-center"></span>`)
        let cityFrom = routeIn.cityFrom+" ("+routeIn.flyFrom+")",
            cityTo = routeIn.cityTo+" ("+routeIn.flyTo+")",
            departTime = new Date(routeIn.dTimeUTC),
            arriveTime = new Date(routeIn.aTimeUTC),
            dTime = departTime.getHours().toString().padStart(2,"0") + " : " + departTime.getMinutes().toString().padStart(2,"0"),
            aTime = arriveTime.getHours().toString().padStart(2,"0") + " : " + arriveTime.getMinutes().toString().padStart(2,"0"),
            flight_no = routeIn.flight_no,
            logo = $(`
                        <div class="airLogo">
                            <img src="https://images.kiwi.com/airlines/64/${routeIn.airline}.png" class="airlineLogo">
                            <div class="flight_no">${routeIn.airline} ${flight_no}</div>
                        </div>
                    `);
        
        //Append airline Logo
        routeInfo.append(logo);
        //Create from city
        fromBlock.append(`<p>${dTime}</p><p>${cityFrom}</p>`)
        if (index === 0) {
            durBlock.append(`<p>${fly_duration}</p><i class="material-icons">linear_scale</i>`)
        } else {
            durBlock.append(`<p>${return_duration}</p><i class="material-icons">linear_scale</i>`)
        }
        toBlock.append(`<p>${aTime}</p><p>${cityTo}</p>`)
        
        routeInfo.append(fromBlock);
        routeInfo.append(durBlock);
        routeInfo.append(toBlock);
        eachFlight.append(routeInfo);
        if (route.route.length > 1 && index !== route.route.length-1) {
            eachFlight.append($('<hr>'));
        }
    })
    resultRow.append(eachFlight);

    let flightType = $(`<div class="flightType text-right"></div>`);
    flightType.append($(`<span>${request.adults} Adult(s)</span>`));
    if (request.children > 0) {
        let child;
        if (request.children > 1) {
            child = "Children";
        } else {
            child = "Child"
        }
        flightType.append($(`<span> | ${request.children} ${child}</span>`));
    }
    if (request.infants > 0) {
        flightType.append($(`<span> | ${request.infants} Infant(s)</span>`));
    }

    flightPrice.append(flightType)
    flightPrice.append($(`<div class="price">
                            <div class="priceEach">HK$${Math.floor(price / passengerNum)}</div>
                            <div class="priceTotal text-right">(Total HK$${price})</div>
                        </div>`));

    let result_sent = encodeURI(JSON.stringify({"flight-result": route, "flight-request": flightReq}))
console.log(result_sent)
    let form =   $(`<form class="route-detail" action="/add-flight" method="POST">
                        <input type="hidden" name="air-route" value="${result_sent}" >
                        <input type="submit" value="+">
                    </form>`);

    priceGroup.append(flightPrice)
    priceGroup.append(form);

    resultRow.append(priceGroup);
    $('#flight-list-group').append(resultRow)

    $(document).on('click', '.eachFlight', function() {
        window.open(route.deep_link);
    })

    $(document).on('mouseover', '.routeResult', function() {
        let latFrom = Number($(this).attr('latFrom')), lngFrom = Number($(this).attr('lngFrom')),
            latTo = Number($(this).attr('latTo')), lngTo = Number($(this).attr('lngTo'));
        let newLocat = [new google.maps.LatLng(latFrom,lngFrom),new google.maps.LatLng(latTo,lngTo)]
     
        drawNewRoute(newLocat, poly);
    })
}

//Close the route display
$(document).on('click', '.detail-close', function() {
    $('.detail-controller').css('left', '-320px')
})

