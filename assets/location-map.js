var map, counter = 0, resultArr = [];

//style the map
var styles = {
    default: null,
    retro: [
    {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
    {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{color: '#c9b2a6'}]
    },
    {
        featureType: 'administrative.land_parcel',
        elementType: 'geometry.stroke',
        stylers: [{color: '#dcd2be'}]
    },
    {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [{color: '#ae9e90'}]
    },
    {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
    },
    {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#93817c'}]
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{color: '#a5b076'}]
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#447530'}]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#f5f1e6'}]
    },
    {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{color: '#fdfcf8'}]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#f8c967'}]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#e9bc62'}]
    },
    {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [{color: '#e98d58'}]
    },
    {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.stroke',
        stylers: [{color: '#db8555'}]
    },
    {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{color: '#806b63'}]
    },
    {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
    },
    {
        featureType: 'transit.line',
        elementType: 'labels.text.fill',
        stylers: [{color: '#8f7d77'}]
    },
    {
        featureType: 'transit.line',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#ebe3cd'}]
    },
    {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
    },
    {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{color: '#b9d3c2'}]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#92998d'}]
    }
    ]  
}

//Autocomplete address
function fillInAddress(autocomplete, map, infowindow, marker) {
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
        map.setZoom(10);  // Why 17? Because it looks good.
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
}

//Calculate and show routes
function calcRoute(request, directionsDisplay, directionsService) {
    directionsService.route(request, function(result, status) {
        if (status === 'OK') {
            directionsDisplay.setMap(map);
            
            resultArr.push(result);
           // directionsDisplay.setDirections(result);
           // var summaryPanel = document.getElementById('directions-panel');
           // summaryPanel.innerHTML = '';
            
            for (var x = 0; x < result.routes.length; x++) {
                
                    let variable = new google.maps.DirectionsRenderer({
                        map: map,
                    //directions: result,
                    //    preserveViewport: true,
                        routeIndex: counter,
                        polylineOptions: {
                          strokeColor: 'grey'
                        }
                    });
        
                if (result.request.travelMode == "DRIVING") {
                    $('#transport-list-group').append($(`
                        <a href="#" class="list-group-item drive" num=${x}>
                            <i class="material-icons">drive_eta</i>
                            ${result.routes[x].summary} - ${result.routes[x].legs[0].distance.text} - ${result.routes[x].legs[0].duration.text}
                        </a>
                    `))
                } else if (result.request.travelMode == 'TRANSIT') {
                    let mode = [];
                    for(let i of result.routes[x].legs[0].steps) {
                        mode.push(i.instructions)
                    }
                    $('#transport-list-group').append($(`
                        <a href="#" class="list-group-item public" num=${x}>
                            <i class="material-icons">directions_boat</i>
                            <i class="material-icons">tram</i>
                            <i class="material-icons">subway</i>
                            <i class="material-icons">train</i>
                            <i class="material-icons">directions_walk</i>
                            <i class="material-icons">directions_bus</i>
                            ${mode.join(",")} - ${result.routes[x].legs[0].distance.text} - ${result.routes[x].legs[0].duration.text}
                        </a>
                    `))
                } else {
                    $('#transport-list-group').append($(`
                        <a href="#" class="list-group-item walk" num=${x}>
                            <i class="material-icons">directions_walk</i>
                            ${result.routes[x].summary} - ${result.routes[x].legs[0].distance.text} - ${result.routes[x].legs[0].duration.text}
                        </a>
                    `))
                } 
                counter ++;
           /*   summaryPanel.innerHTML += '<hr><br><b> Route ' + (x + 1) + ':<br>';
              var route = result.routes[x];
              for (var y = 0; y < route.legs.length; y++) {
                var routeSegment = y + 1;
      
                summaryPanel.innerHTML += route.legs[y].start_address + ' to ';
                summaryPanel.innerHTML += route.legs[y].end_address + '<br>';
                summaryPanel.innerHTML += route.legs[y].distance.text + '<br><br>';
      
                var steps = route.legs[y].steps;
                for (var z = 0; z < steps.length; z++) {
                  var nextSegment = steps[z].path;
                  summaryPanel.innerHTML += "<li>" + steps[z].instructions;
      
                  var dist_dur = "";
                  if (steps[z].distance && steps[z].distance.text) dist_dur += steps[z].distance.text;
                  if (steps[z].duration && steps[z].duration.text) dist_dur += "&nbsp;" + steps[z].duration.text;
                  if (dist_dur != "") {
                    summaryPanel.innerHTML += "(" + dist_dur + ")<br /></li>";
                  } else {
                    summaryPanel.innerHTML += "</li>";
                  }
      
                }
      
                summaryPanel.innerHTML += "<br>";
              }
              */
            }
          } else {
            console.log('Directions request failed due to ' + status + request.travelMode);
          }
    })
};

//initialize the map
function initMap() {
    // Create the map with no initial style specified.
    // It therefore has default styling.
    let map1 = document.getElementsByClassName('map')[0];
    
    map = new google.maps.Map(map1, {
        center: {lat: -33.86, lng: 151.209},
        zoom: 13,
        mapTypeControl: false
    });

    //get the location input
    let from_locat = document.getElementById('from-locat');
    let to_locat = document.getElementById('to-locat');
    let autocomplete = new google.maps.places.Autocomplete(from_locat);
    let autocomplete2 = new google.maps.places.Autocomplete(to_locat);
    autocomplete.bindTo('bounds', map);
    autocomplete2.bindTo('bounds', map);

    //google autocomplete
    let infowindow = new google.maps.InfoWindow();
    let infowindow2 = new google.maps.InfoWindow();
    let marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });
    let marker2 = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function() {
        fillInAddress(autocomplete, map, infowindow, marker)  
    });

    autocomplete2.addListener('place_changed', function() {
        fillInAddress(autocomplete2, map, infowindow2, marker2)  
    });

    //Direction service
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();

    $(document).on('click', '#trans-add', function() {
        //Self driving request
        counter = 0;
        let drive_request = {
            origin: from_locat.value,
            destination: to_locat.value,
            travelMode: 'DRIVING',
            provideRouteAlternatives: true
        };
        let public_request = {
            origin: from_locat.value,
            destination: to_locat.value,
            travelMode: 'TRANSIT',
            transitOptions: {
                modes: ['BUS','RAIL','SUBWAY','TRAIN','TRAM'],
                routingPreference: 'LESS_WALKING'
            },
            provideRouteAlternatives: true
        }
        let walk_request = {
            origin: from_locat.value,
            destination: to_locat.value,
            travelMode: 'WALKING',
            provideRouteAlternatives: true
        }
        calcRoute(drive_request, directionsDisplay, directionsService)
        calcRoute(public_request, directionsDisplay, directionsService)
        calcRoute(walk_request, directionsDisplay, directionsService)
    })

    //Show routes when hovering/click the description
    //driving
    $(document).on('click', '.drive', function() {
        let route_num = parseInt($(this).attr("num"));
        directionsDisplay.setDirections(resultArr[0]);
        directionsDisplay.setRouteIndex(route_num);
        $('#transport-detail-list-group').addClass('show-detail');
    })
    $(document).on('mouseover', '.drive', function() {
        let route_num = parseInt($(this).attr("num"));
        directionsDisplay.setDirections(resultArr[0]);
        directionsDisplay.setRouteIndex(route_num);
    })

    //public transport
    $(document).on('click', '.public', function() {
        let route_num = parseInt($(this).attr("num"));
        directionsDisplay.setDirections(resultArr[2]);
        directionsDisplay.setRouteIndex(route_num);
    })
    $(document).on('mouseover', '.public', function() {
        let route_num = parseInt($(this).attr("num"));
        directionsDisplay.setDirections(resultArr[2]);
        directionsDisplay.setRouteIndex(route_num);
    })

    //walking
    $(document).on('click', '.walk', function() {
        let route_num = parseInt($(this).attr("num"));
        directionsDisplay.setDirections(resultArr[1]);
        directionsDisplay.setRouteIndex(route_num);
    })
    $(document).on('mouseover', '.walk', function() {
        let route_num = parseInt($(this).attr("num"));
        directionsDisplay.setDirections(resultArr[1]);
        directionsDisplay.setRouteIndex(route_num);
    })

    //set google map style
    map.setOptions({styles: styles['retro']});
}
