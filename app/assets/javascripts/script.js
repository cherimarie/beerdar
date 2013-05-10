window.onload = function()
{
  getGeoLocation();

}

var lati;
var lngi;


  function getGeoLocation() {
    navigator.geolocation.getCurrentPosition(setGeoCookie);
  }

  function setGeoCookie(position) {
    var cookie_val = position.coords.latitude + "|" + position.coords.longitude;
    document.cookie = "lat_lng=" + escape(cookie_val);
    lati = position.coords.latitude;
    lngi = position.coords.longitude;

    //just to show results
    var latdump = document.getElementById("latlng");
    latdump.innerHTML = "your location: " + cookie_val;
  }


// Create and load map
$('#map').mapbox('beerdar.map-97fds4u6', function(map, tilejson)
{
    map.setZoomRange(10, 19);
    var markerLayer = mapbox.markers.layer();
    mapbox.markers.interaction(markerLayer);

    markerLayer.add_feature({
    geometry: {coordinates: [-122.32, 47.61]},
    properties: {'marker-color': '#000',
                  'marker-size': "medium",
                  'marker-symbol': "bus",
                  title: 'Bar One',
                  description: 'Happy Hour blah blah.'}
    });
    markerLayer.add_feature({
    geometry: {coordinates: [-122.4, 47.58]},
    properties: {'marker-color': '#000',
                  'marker-size': "medium",
                  'marker-symbol': "bus",
                  title: 'Bar Two',
                  description: 'Happy Hour c.'}
    });
    markerLayer.add_feature({
    geometry: {coordinates: [-122.38, 47.55]},
    properties: {'marker-color': '#000',
                'marker-size': "medium",
                'marker-symbol': "bus",
                title: 'Bar Three',
                description: 'Happy Hour rulezzzz'}
    });
   markerLayer.add_feature({
    geometry: {coordinates: [-122.321, 47.624]},
    properties: {'marker-color': '#E01B6A',
                'marker-size': "medium",
                'marker-symbol': "bus",
                title: 'You',
                description: 'Here you are.'}
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
