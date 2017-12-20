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
        map.setZoom(9);  // Why 17? Because it looks good.
    }

    var address = '';
    if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
    }
}

//Calculate and show routes
function calcRoute(request, directionsDisplay, directionsService) {
    return new Promise((resolve, reject) => {
        directionsService.route(request, function(result, status) {
            if (status === 'OK') {
                $('.detail-controller').css('left', '0');
                directionsDisplay.setMap(map);
                resultObj[result.request.travelMode] = result;
                domObj[request.travelMode] = {};
            
                for (var x = 0; x < result.routes.length; x++) {
                    let routeDom = $(`<div class="route-set"></div>`);
                    let routeName = $(`<div class="route-name"></div>`);
                    let route_group = $(`<div class="route-group"></div>`)

                    //Form to pass the data back to server
                    let result_sent = encodeURI(JSON.stringify(result.routes[x]));
                    let request_sent = $('input[name="request-date"]').val();
            
                    console.log(result.routes[x])
                    
                    let form =   $(`<form class="route-detail" action="/transportation/add-transportation" method="POST">
                                        <input type="textarea" name="request_sent" value=${request_sent} class="invisible-input">
                                        <input type="textarea" name="result_sent" value=${result_sent} class="invisible-input">
                                        <input type="submit" value="+" class="transit-addme">
                                    </form>`)
                    
                    //Till here
                    let routeInfo = $(`<div class="route-info text-right">${result.routes[x].legs[0].distance.text}  <i class="material-icons">access_time</i> ${result.routes[x].legs[0].duration.text}</div>`)
                    let button_add = $(`<a class="btn addTrip-btn">+</a>`)
                    route_group.append(routeInfo)
                    route_group.append(form)

                    //Save the routes for display
                    if (result.request.travelMode == "DRIVING") {
                        let ahref = $(`<a href="#" class="list-group-item drive" num=${x}></a>`);
                        ahref.append($(`<div class="option-logo"><i class="material-icons">drive_eta</i><div>`))
                        routeDom.append($(`<i class="material-icons material-transport-icon">drive_eta</i>`));
                        
                        routeName.append($(`<p class="small">via</p><p>${result.routes[x].summary}</p>`));
                        routeDom.append(routeName)
                        ahref.append(routeDom)
                        ahref.append(route_group);
                        $('#transport-list-group').append(ahref)
                    } else if (result.request.travelMode == 'TRANSIT') {
                        let ahref = $(`<a href="#" class="list-group-item public" num=${x}></a>`);
                        ahref.append($(`<div class="option-logo"><i class="material-icons">directions_bus</i><div>`))
                        for(let i of result.routes[x].legs[0].steps) {
                            let symbol = $(`<div class="transfer-logo"></div>`);
                            let text = $(`<div class="transfer-route"></div>`);

                            //Get the logo
                            if (i.travel_mode === "WALKING") {
                                text.append($(`<i class="material-icons ${transferOption.WALK}">${transferOption.WALK}</i>`));
                            } else {
                                if(i.transit.line.vehicle.local_icon) {
                                    text.append($(`<img class="transit-icons" src="${i.transit.line.vehicle.local_icon}">`));
                                } else if (i.transit.line.vehicle.icon) {
                                    text.append($(`<img class="transit-icons" src="${i.transit.line.vehicle.icon}">`));
                                } 
                                if (i.transit.line.short_name) {
                                    let name = $(`<p class="bus-route">${i.transit.line.short_name}</p>`);
                                    if (i.transit.line.color) {
                                        name.css('background-color',i.transit.line.color)
                                    } 
                                    if (i.transit.line.text_color) {
                                        name.css('color',i.transit.line.text_color)
                                    }
                                    text.append(name)
                                }
                            }
                            symbol.append(text)
                            symbol.append(`<p class="route-duration text-center">${i.duration.text}</p>`)
                            routeDom.append(symbol);
                            if (i !== result.routes[x].legs[0].steps[result.routes[x].legs[0].steps.length -1]) {
                                routeDom.append($(`<i class="material-icons small-arrow">keyboard_arrow_right</i>`));
                            }
                        }
                        ahref.append(routeDom)
                        ahref.append(route_group);
                        $('#transport-list-group').append(ahref)
                    } else {
                        let ahref = $(`<a href="#" class="list-group-item walk" num=${x}></a>`);
                        ahref.append($(`<div class="option-logo"><i class="material-icons">directions_walk</i><div>`))
                        routeDom.append($(`<i class="material-icons material-transport-icon">directions_walk</i>`));
                        routeName.append($(`<p class="small">via</p><p>${result.routes[x].summary}</p>`));
                        routeDom.append(routeName)
                        ahref.append(routeDom)
                        ahref.append(route_group);
                        $('#transport-list-group').append(ahref)
                    } 
                    counter ++;
                }
            } else {
                console.log('Directions request failed due to ' + status + request.travelMode);
            }
            resolve(status)
        })
    })
};

