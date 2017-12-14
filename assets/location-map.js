
      function initAutocomplete() {
        var item_array = [];
        var map = new google.maps.Map(document.getElementById('mymap'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('from-locat');
        var searchBox = new google.maps.places.SearchBox(input);
        //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            /*
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));
            */
            
            var item = place.geometry.location;
            var item_name = place.name;
            var item_lat= place.geometry.location.lat();
            var item_lng= place.geometry.location.lng();
            var item_location = place.formatted_address;
            item_array.push(item_name);

            //alert(item_array.join("\n"));

            $('#transport-list-group').append($(`
                        <h1>${item_array.slice(-1)[0]}</h1>
                    `))

            //add search result marker to the map       
            addMarker({coords:{lat:item_lat,lng:item_lng}});
            function addMarker(props){
                var marker = new google.maps.Marker({
                position:props.coords,
                map:map,
                icon: icon,
                animation: google.maps.Animation.DROP,
                //icon:props.iconImage
            }); 
            }
            


            
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);

        });
      }

    