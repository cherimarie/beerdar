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
   // var latdump = document.getElementById("latlng");
    //latdump.innerHTML = "your location: " + lati + lngi;

    // Create and load map
    $('#map').mapbox('beerdar.map-97fds4u6', function(map, tilejson)
    {

        map.setZoomRange(10, 19);
        var markerLayer = mapbox.markers.layer();
        mapbox.markers.interaction(markerLayer);

       markerLayer.add_feature({
        geometry: {coordinates: [lngi, lati]},
        properties: {'marker-color': '#EB843F',
                    'marker-size': "medium",
                    'marker-symbol': "pitch",
                    title: 'You',
                    description: 'Here you are.'}

        });

       //rails needs to run db query, send close results to here
       //then function runs through, creating markers


        markerLayer.add_feature({
        geometry: {coordinates: [-122.32, 47.61]},
        properties: {'marker-color': '#3FCBF2',
                      'marker-size': "medium",
                      'marker-symbol': "beer",
                      title: 'Bar One',
                      description: 'Happy Hour blah blah.'}
        });
        markerLayer.add_feature({
        geometry: {coordinates: [-122.4, 47.58]},
        properties: {'marker-color': '#3FCBF2',
                      'marker-size': "medium",
                      'marker-symbol': "beer",
                      title: 'Bar Two',
                      description: 'Happy Hour c.'}
        });




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
