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

      map.setZoomRange(13, 19);
      var markerLayer = mapbox.markers.layer();
      mapbox.markers.interaction(markerLayer);

   alert($('#bar_data').data('bar_data'));
      //these hard-coded arrays represent the data that will be sent in about nearest bars
       //then function runs through, creating markers
      var myinfo = {"barname": "bar", "lat": "-122.28", "lon": "47.54","desc": "$2 domestics, $3 micros"};
      var myinfo2 = {"barname": "bar two", "lat": "-122.29", "lon": "47.55", "desc": "$3.50 wells and food under $4"};
      var allmyinfo = new Array (myinfo,myinfo2);

      markerGen(allmyinfo);

      function markerGen(info){
        //test output:
        //console.log(info[0].barname);

        for(i in info){

          markerLayer.add_feature({
          geometry: {coordinates: [info[i].lat, info[i].lon]},
          properties: {"marker-color": "#3FCBF2",
                        "marker-size": "medium",
                        "marker-symbol": "beer",
                        "title": info[i].barname,
                        "description": info[i].desc}
          });

        }

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
