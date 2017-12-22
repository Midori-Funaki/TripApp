$(function() {
  let sortable;
  
  for(let i=0; i<document.getElementsByClassName('schedule-activity-blocks').length; i++){
     sortable = new Sortable.default(document.getElementsByClassName('schedule-activity-blocks')[i], {
      draggable: 'li',
    });
    sortable.on('sortable:start', (e) => {
      console.log(e)
      if ($(e.dragEvent.sensorEvent.target).hasClass('.transit-title')) {
        return ;
      }
      if ($(e.dragEvent.sensorEvent.target).hasClass('delete-activity')){
        //console.log('target element index>>',$(e.data.dragEvent.data.originalSource).index());
        //console.log($(e.data.dragEvent.data.originalSource).parents('.trip-black-container').siblings('h4').text())
        $(e.dragEvent.sensorEvent.target).parent();
        $.post('/schedule/delete-activity',{
          request_date: $(e.data.dragEvent.data.originalSource).parents('.trip-black-container').siblings('h4').text(),
          index: $(e.data.dragEvent.data.originalSource).index()
        }).done(() => {
          console.log("DONE")
        })
      }
    //  console.log("Origin element index >>> ",$(e.data.dragEvent.data.originalSource).index())
    });
   
    sortable.on('sortable:stop', (e) => {
      //console.log($(e.data.dragEvent.data.originalSource).index())
      //console.log($(e.data.dragEvent.data.originalSource).parents('.trip-black-container').siblings('h4').text())
      console.log("BEFORE >>>>>>> ",e.data.oldIndex)
      console.log("AFTER  >>>>>>> ",e.data.newIndex)
      $.post('/schedule/reoder-schedule',{
        request_date: $(e.data.dragEvent.data.originalSource).parents('.trip-black-container').siblings('h4').text(),
        oldIndex: e.data.oldIndex,
        newIndex: e.data.newIndex,
        xhrFields:{
          withCredentials: true
        }
      }).done(()=>{
        console.log('done');
      })
      .catch((err)=>{
        console.log(err);
      })
    });
  }
});

//GOOGLE MAP
let markers = [];
function mainInitMap() {
  let map = document.getElementById("day-map");
  
  map = new google.maps.Map(map, {
    center: {lat: 22.86, lng: 151.209},
    zoom: 13,
    mapTypeControl: false
  });

  //Direction service
  var directionsDisplay = new google.maps.DirectionsRenderer({
      polylineOptions: {
          strokeColor: 'IndianRed',
          geodesic: true,
          strokeWeight: 6
      }
  });

  let poly = new google.maps.Polyline({
    strokeColor: 'IndianRed',
    strokeOpacity: 1.0,
    strokeWeight: 6,
    geodesic: true
  });
  poly.setMap(map);

  //Hide map
  $('#close-map').on('click', function() {
    $('.day-map-container').fadeOut(1000);
    google.maps.event.trigger(map, 'resize')
  })
  
  //Show map
  $('.fa-map').on('click', function() {
   
  })

  $('.transit-title').on('click', function() {
    $('.day-map-container').fadeIn(1000);
    google.maps.event.trigger(map, 'resize')
    let transit_data = [$(this).parent().siblings('input[name="transit-data"]')]
    DrawMap(poly, map, transit_data)
  })

  $('.flight-title').on('click', function() {
    $('.day-map-container').fadeIn(1000);
    google.maps.event.trigger(map, 'resize')
    let flight_data = [$(this).parent().siblings('input[name="flight-data"]')]
    DrawMap(poly, map, flight_data)
  })

  $('.hotel-title').on('click', function() {
    $('.day-map-container').fadeIn(1000);
    google.maps.event.trigger(map, 'resize')
    let hotel_data = [$(this).parent().siblings('input[name="hotel-data"]')]
    DrawMap(poly, map, hotel_data)
  })

  $('.location-title').on('click', function() {
    $('.day-map-container').fadeIn(1000);
    google.maps.event.trigger(map, 'resize')
    let location_data = [$(this).parent().siblings('input[name="location-data"]')]
    DrawMap(poly, map, location_data)
  })

  //set google map style
  map.setOptions({styles: styles['retro']});
}

function DrawMap(poly, map, dataArr) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  console.log(dataArr);
  dataArr.map(element => {
    console.log(element);
    if(element.val()) {
      let infowindow = new google.maps.InfoWindow();
      let marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
      });
      let infowindow1 = new google.maps.InfoWindow();
      let marker1 = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
      });
      markers.push(marker,marker1);
      
      //For tranist route
      let mapresult = JSON.parse(decodeURI(element.val()))["map_result"];
      if (mapresult) {
        console.log(mapresult);
        if (mapresult.bounds) {
          map.fitBounds(mapresult.bounds);
          poly.setPath(mapresult.overview_path)
          marker.setPosition(mapresult.legs[0].start_location);
          marker.setVisible(true);
          infowindow.setContent('<div><strong>' + mapresult.legs[0].start_address + '</strong><br>' + 
                                '<span>'+ mapresult.legs[0].distance.text + '</span> <span>' + mapresult.legs[0].duration.text +'</span>');
          infowindow.open(map, marker);
          
          mapresult.legs[0].steps.map(route => {
            drawPiece(map, route);
          })
        } 

        if (mapresult.lat && mapresult.lng) {
          let southWest = new google.maps.LatLng(mapresult.lat-0.1,mapresult.lng-0.2);
          let northEast = new google.maps.LatLng(mapresult.lat+0.1,mapresult.lng+0.2);
          let bounds = new google.maps.LatLngBounds(southWest,northEast);
          let location = new google.maps.LatLng(mapresult.lat, mapresult.lng);
          map.fitBounds(bounds);
          marker.setPosition(location);
          marker.setVisible(true);
          infowindow.setContent('<div><strong>' + mapresult.name + '</strong><br>' + 
                                '<span>'+ mapresult.address+ '</span>');
          infowindow.open(map, marker);
        }

      
      
      }

      //For airRoute
      let airresult = JSON.parse(decodeURI(element.val()))["flight_result"];
      if (airresult) {
        console.log(airresult);
        let firstPt = new google.maps.LatLng(airresult.route[0].latFrom, airresult.route[0].lngFrom);
        let lastPt = new google.maps.LatLng(airresult.route[0].latTo, airresult.route[0].lngTo)
        let latLng = [firstPt, lastPt]
        poly.setPath(latLng);
        map.setZoom(2);
        marker.setPosition(firstPt)
        marker1.setPosition(lastPt)
        marker.setVisible(true);
        marker1.setVisible(true);
        infowindow.setContent('<div><strong>' + airresult.cityFrom + '</strong><br><br>' + '<div><strong>' + airresult.route[0].flyFrom + '->' + airresult.route[0].flyTo + '</strong><br><br>' +
                            '<p> Fly Duration: '+ airresult.fly_duration + '</p><p>Flight no: ' + airresult.route[0]['flight_no'] + '</p>' );
        infowindow.open(map, marker);
        let return_info = '<div><strong>' + airresult.cityTo + '</strong><br><br>'
        if (airresult.route[1]) {
          return_info += '<div><strong>' + airresult.route[1].flyFrom + '->' + airresult.route[1].flyTo + '</strong><br><br>' 
          return_info += '<p> Return Duration'+ airresult.return_duration + '</p><p>Flight no:' + airresult.route[1]['flight_no'] + '</p>' 
        }
        infowindow1.setContent(return_info);
        infowindow1.open(map, marker1);
      }
  
    }
  });
}

function drawPiece(map, route) {
  let infowindow = new google.maps.InfoWindow();
  let marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });
  markers.push(marker);
  marker.setPosition(route.end_point);
  marker.setVisible(true);
  infowindow.setContent('<div><strong>' + route.instructions + '</strong><br>' + 
                            '<span>'+ route.distance.text + '</span> <span>' + route.duration.text +'</span>');
  infowindow.open(map, marker);
}

