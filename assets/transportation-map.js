//style the map
var styles = {
    default: null,
    retro: [
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "saturation": "-100"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text",
            "stylers": [
                {
                    "color": "#545454"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "saturation": "-87"
                },
                {
                    "lightness": "-40"
                },
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#f0f0f0"
                },
                {
                    "saturation": "-22"
                },
                {
                    "lightness": "-16"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "saturation": "-52"
                },
                {
                    "hue": "#00e4ff"
                },
                {
                    "lightness": "-16"
                }
            ]
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
    
    /*
    marker.setIcon(({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    */

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
            
            resultObj[result.request.travelMode] = result;
            domObj[request.travelMode] = {};
            for (var x = 0; x < result.routes.length; x++) {
                //for detail display
                var summaryPanel = document.createElement('DIV');
                summaryPanel.id = 'my-detail';
                summaryPanel.innerHTML = '';

                let variable = new google.maps.DirectionsRenderer({
                    map: map,
                //directions: result,
                //  preserveViewport: true,
                    routeIndex: counter,
                    polylineOptions: {
                        strokeColor: 'grey'
                    }
                });
        
                if (result.request.travelMode == "DRIVING") {
                    $('#transport-list-group').append($(`
                        <a href="#" class="list-group-item drive" num=${x}>
                            <i class="material-icons">drive_eta</i>
                            <span class="route-duration">${result.routes[x].legs[0].duration.text}</span>
                            ${result.routes[x].summary} - ${result.routes[x].legs[0].distance.text} 
                        </a>
                    `))
                } else if (result.request.travelMode == 'TRANSIT') {
                    console.log(result);
                    let mode = [];
                    for(let i of result.routes[x].legs[0].steps) {
                        if (i.travel_mode === "WALKING") {
                            mode.push([transferOption.WALK, i.duration.text]);
                        } else {
                            mode.push([transferOption[i.transit.line.vehicle.type], i.duration.text, i.transit.line.short_name])
                        }
                    }

                    let symbol = '';
                    for(let i of mode) {
                        symbol += `<i class="material-icons">${i[0]}</i>`
                        symbol += `<span class="route-duration">${i[1]}</span>`
                        if (i[2]) {
                            symbol += `<span class="bus-route">Route: ${i[2]}</span>`
                        }
                    }
                    $('#transport-list-group').append($(`
                        <a href="#" class="list-group-item public" num=${x}>
                            ${symbol}  ${result.routes[x].legs[0].distance.text} - ${result.routes[x].legs[0].duration.text}
                        </a>
                    `))
                } else {
                    $('#transport-list-group').append($(`
                        <a href="#" class="list-group-item walk" num=${x}>
                            <i class="material-icons">directions_walk</i>
                            <span class="route-duration">${result.routes[x].legs[0].duration.text}</span>
                            ${result.routes[x].summary} - ${result.routes[x].legs[0].distance.text} 
                        </a>
                    `))
                } 
                

                summaryPanel.innerHTML += '<span class="glyphicon glyphicon-remove detail-close"></span>'
                summaryPanel.innerHTML += '<br><b> Route ' + (x + 1) + ':<br>';
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
                
                //increase counter and append details
                counter ++;
                domObj[request.travelMode][x] = summaryPanel;
            }
        } else {
            console.log('Directions request failed due to ' + status + request.travelMode);
        }
    })
};

