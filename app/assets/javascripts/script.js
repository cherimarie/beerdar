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

      //two view modes, accessed by menu:
      // 1- what is open RIGHT NOW and what their deals are
      //2- what are all the happy hours, and what are their hours and deals


      //show what info is coming in:
     // console.log(nearbyLocationData);

      //assign incoming info to variable
      var allmyinfo = nearbyLocationData;
      console.log(allmyinfo);

      //run markerGen to create markers from incoming bar data
      markerGen(allmyinfo);

      function markerGen(info){
        for(i in info){
         //create long string of happy hours
         var happiness = happyTimes(info[i].happy_hours);
         var addy = addy_obvs(info[i].address);

          markerLayer.add_feature({
          geometry: {coordinates: [info[i].longitude, info[i].latitude]},
          properties: {"marker-color": "#EBD023",
                        "marker-size": "medium",
                        "marker-symbol": "beer",
                        title: info[i].name,
                        description: addy + " " + happiness
                      }
          });
        }
      }

      function addy_obvs(address){
        var long_addy = new Array();
       long_addy = address.split(",", 1);
        return long_addy[0];
      }

      function happyTimes(stuff){
       // console.log(stuff[0].days);
       var happiness = '';
          for (i in stuff){
            var deals = bargainGetter(stuff[i].bargains);
            happiness += "<br />" + stuff[i].days + " " + stuff[i].start_time + " - " + stuff[i].end_time + "<br />" + deals;
            }
            return happiness;
      }

      function bargainGetter(stuff){
          var deals = '';
           for(j in stuff){
              deals += stuff[j].deal;
              //console.log(stuff[j].deal);
            }
            return deals;

      }

      markerLayer.add_feature({
      geometry: {coordinates: [lngi, lati]},
      properties: {'marker-color': '#D95A1A',
                   "marker-size": "medium",
                   "marker-symbol": "pitch",
                  description: "You look thirsty."}
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

  //create list of markers in markerfilter area- lots of comments to make this clearer to me
      var container = $('#markerfilters');
      $.each(tilejson.markers.markers(), function(index, m) {
          var s = m.data.properties['marker-symbol'];

              //if the div #markerfilters already contains link to given marker symbol, return
          if (container.find('[href="#' + s + '"]').length) return;

          //creates linky images- adds <a href="#symbol"> tag, appropriate background image, applies class- puts in #markerfilters div
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