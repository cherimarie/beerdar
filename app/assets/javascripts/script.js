  var lati;
  var lngi;

  window.onload = function()
  {
    getGeoLocation();
  }

  function getGeoLocation() {
    navigator.geolocation.getCurrentPosition(setGeoCookie);
  }

  function setGeoCookie(position) {
    var cookie_val = position.coords.latitude + "|" + position.coords.longitude;
    document.cookie = "lat_lng=" + escape(cookie_val);
    lati = position.coords.latitude;
    lngi = position.coords.longitude;

    //just to show results
   //var latdump = document.getElementById("latlng");
   // latdump.innerHTML = "your location: " + lati + lngi;

    // Create and load map
    $('#map').mapbox('beerdar.map-97fds4u6', function(map, tilejson)
    {

      map.setZoomRange(8, 19);
      var markerLayer = mapbox.markers.layer();
      mapbox.markers.interaction(markerLayer);


      //show what info is coming in:
      console.log(nearbyLocationData);
      //assign incoming info to variable
      var allmyinfo = nearbyLocationData;
      //run markerGen to create markers from incoming bar data

      markerGen(allmyinfo);

      function markerGen(info){
        for(i in info){
         //create long string of happy hours

          happyTimes(info[i].happy_hours);



          markerLayer.add_feature({
          geometry: {coordinates: [info[i].longitude, info[i].latitude]},
          properties: {"marker-color": "#3FCBF2",
                        "marker-size": "medium",
                        "marker-symbol": "beer",
                        "title": info[i].name,
                        "description": info[i].address + " " + happiness
                      }
          });

        }

      }
      var happiness;
      function happyTimes(stuff){
       // console.log(stuff[0].days);

          for (i in stuff){
            var deals = bargainGetter(stuff[i].bargains);
            happiness += stuff[i].days + " " + deals;
            }
            return happiness;

      }

      function bargainGetter(stuff){
          var deals;
           for(j in stuff){
              deals += stuff[j].deal;
              //console.log(stuff[j].deal);
            }
            return deals;

      }


      markerLayer.add_feature({
      geometry: {coordinates: [lngi, lati]},
      properties: {'marker-color': '#EB843F',
                   "marker-size": "medium",
                   "marker-symbol": "pitch",
                  "title": "You",
                  "description": "Here you are. You look thirsty."}
      });

    /*  test marker
      markerLayer.add_feature({
      geometry: {coordinates: [-122.4, 47.58]},
      properties: {'marker-color': '#3FCBF2',
                    "marker-size": "medium",
                    "marker-symbol": "beer",
                    "title": 'Test Bar',
                    "description": 'Happy Hour party time!'}
      });*/


      map.addLayer(markerLayer)
        .setExtent(markerLayer.extent());


      // Add share control
      mapbox.share().map(map).add();

      // Set title and description from tilejson
      document.title = tilejson.name;
      $('h1.map-title').text(tilejson.name);
      $('p.description').text(tilejson.description);


      var container = $('#markerfilters');
      $.each(tilejson.markers.markers(), function(index, m) {
          var s = m.data.properties['marker-symbol'];

          if (container.find('[href="#' + s + '"]').length) return;

          var el = $(document.createElement('a'))
              .addClass('markerfilter')
              .attr('href', '#' + s)
              .css('background-image', 'url(http://a.tiles.mapbox.com/v3/marker/pin-l-'+s+'+000000.png)')
              .bind('click', filter);
          container.append(el);
      });


      $('[href="#all"]').bind('click', filter);


      function filter(e) {
          container.find('a').removeClass('selected');
          var id = $(this).addClass('selected').attr('href').replace('#', '');
          tilejson.markers.filter(function(feature) {
              return feature.properties['marker-symbol'] == id || id == 'all';
          });
          return false;
      }
  });
}
