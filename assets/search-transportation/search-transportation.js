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
    /*
    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);
    */
}

//Calculate and show routes
function calcRoute(request, directionsDisplay, directionsService) {
    directionsService.route(request, function(result, status) {
        if (status === 'OK') {
            $('.detail-controller').css('left', '0');
            directionsDisplay.setMap(map);
         //   directionsDisplay.setDirections(result);
            resultObj[result.request.travelMode] = result;
            domObj[request.travelMode] = {};
        
            for (var x = 0; x < result.routes.length; x++) {
                let routeDom = $(`<div class="route-set"></div>`);
                let routeName = $(`<div class="route-name"></div>`);
                let route_group = $(`<div class="route-group"></div>`)
                let result_sent = JSON.stringify(result.routes[x]);
                console.log(result_sent);
                let form =   $(`<form class="route-detail" action="/add-transportation" method="POST">
                                    <input type="hidden" name="route" value="">
                                    <input type="submit" value="+">
                                </form>`)
                let routeInfo = $(`<div class="route-info text-right">${result.routes[x].legs[0].distance.text}  <i class="material-icons">access_time</i> ${result.routes[x].legs[0].duration.text}</div>`)
                route_group.append(routeInfo)
                route_group.append(form);
                // let addBtn = $(`<a href="#">`)
                //for detail display
                /*
                var summaryPanel = document.createElement('DIV');
                summaryPanel.id = 'my-detail';
                summaryPanel.innerHTML = '';
                */

                let variable = new google.maps.DirectionsRenderer({
                    map: map,
                //  directions: result,
                //  preserveViewport: true,
                    routeIndex: counter,
                    polylineOptions: {
                        strokeColor: 'grey'
                    }
                });
        
                if (result.request.travelMode == "DRIVING") {
                    let ahref = $(`<a href="#" class="list-group-item drive" num=${x}></a>`);
                    ahref.append($(`<div class="option-logo"><i class="material-icons">drive_eta</i><div>`))
                    routeDom.append($(`<i class="material-icons material-transport-icon">drive_eta</i>`));
                    
                    routeName.append($(`<p class="small">via</p><p>${result.routes[x].summary}</p>`));
                    routeDom.append(routeName)
                    ahref.append(routeDom)
                    ahref.append(route_group);
                //    ahref.append($(`<div class="route-info text-right">${result.routes[x].legs[0].distance.text}  <i class="material-icons">access_time</i> ${result.routes[x].legs[0].duration.text}</div>`))
                    $('#transport-list-group').append(ahref)
                   
                    /*
                    console.log(result);
                    $('#transport-list-group').append($(`
                        <a href="#" class="list-group-item drive" num=${x}>
                
                            <span class="route-duration">${result.routes[x].legs[0].duration.text}</span>
                            ${result.routes[x].summary} - ${result.routes[x].legs[0].distance.text} 
                        </a>
                    `))
                    $('#transport-list-group').append(ahref)
                    */
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
                            /*else {
                                text.append($(`<i class="material-icons ${transferOption[i.transit.line.vehicle.type]}">${transferOption[i.transit.line.vehicle.type]}</i>`));
                            }*/
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
               //     ahref.append($(`<div class="route-info text-right">${result.routes[x].legs[0].distance.text}  <i class="material-icons">access_time</i> ${result.routes[x].legs[0].duration.text}${form}</div>`))
                    $('#transport-list-group').append(ahref)
                } else {
                    let ahref = $(`<a href="#" class="list-group-item walk" num=${x}></a>`);
                    ahref.append($(`<div class="option-logo"><i class="material-icons">directions_walk</i><div>`))
                    routeDom.append($(`<i class="material-icons material-transport-icon">directions_walk</i>`));
                    routeName.append($(`<p class="small">via</p><p>${result.routes[x].summary}</p>`));
                    routeDom.append(routeName)
                    ahref.append(routeDom)
                    ahref.append(route_group);
          //          ahref.append($(`<div class="route-info text-right">${result.routes[x].legs[0].distance.text}  <i class="material-icons">access_time</i> ${result.routes[x].legs[0].duration.text}${form}</div>`))
                    $('#transport-list-group').append(ahref)
                } 
                


                /* for detail showing */
                /*
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
                */
                
                //increase counter and append details
                counter ++;
            //    domObj[request.travelMode][x] = summaryPanel;
            }
        } else {
            responseStatus = false;
            console.log('Directions request failed due to ' + status + request.travelMode);
        }
    })
};

