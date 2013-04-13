// Create and load map
$('#map').mapbox('beerdar.map-97fds4u6', function(map, tilejson) {

    map.setZoomRange(10, 19);
    //test Friday morning 
    var markerLayer = mapbox.markers.layer();
    mapbox.markers.interaction(markerLayer);
 

      markerLayer.features({
        geometry: {coordinates: [-122.52, 47.6]},
        properties: {'marker-color': '#000',
      				'marker-size': "medium",
          			'marker-symbol': "bus",
          			title: 'Bar One',
          			description: 'Happy Hour blah blah.'}
    }, {geometry: {coordinates: [-122.32, 47.9]},
              properties: {'marker-color': '#000',
      				'marker-size': "medium",
          			'marker-symbol': "bus",
          			title: 'Bar Two',
          			description: 'Happy Hour cha cha cha.'}
    }).
    markerLayer.factory(function(f) {
    // Define a new factory function. This takes a GeoJSON object
    // as its input and returns an element - in this case an image -
    // that represents the point.
        var img = document.createElement('img');
        img.className = 'marker-image';
        img.setAttribute('src', f.properties.image);
        img.style.pointerEvents = 'all';
        return img;
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
