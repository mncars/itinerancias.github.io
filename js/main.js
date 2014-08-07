(function(){
  var config = {
    //https://leanpub.com/leaflet-tips-and-tricks/read#leanpub-auto-tile-servers-that-can-be-used-with-leaflet
      tileUrl : 'http://{s}.tiles.mapbox.com/v3/openplans.map-g4j0dszr/{z}/{x}/{y}.png',
      tileAttrib : '',//'Map tiles &copy; Development Seed and OpenStreetMap ',
      initLatLng : new L.LatLng(40.408192, -3.694337), // MNCARS
      mapCenter: new L.LatLng(23.686633, -39.321783), //en mitad del ocenao
      initZoom : 3,
      minZoom : 2,
      maxZoom : 15
  };

  var snapper = new Snap({
    element: document.getElementById('content'),
    touchToDrag: false,
  });

  var exposicionesLayers = L.layerGroup();

  var map = L.map('map', {
    minZoom: config.minZoom,
    maxZoom: config.maxZoom,
    zoomControl: false,
    snapper: snapper,
    exposicionesLayers: exposicionesLayers,
    initZoom: config.initZoom
  });
  new L.Control.Zoom({ position: 'topright' }).addTo(map);
  map.addLayer(new L.TileLayer(config.tileUrl, {attribution: config.tileAttrib}));
  map.setView(config.mapCenter, config.initZoom);

  render();

  function render() {
    for (var i=0; i < exposiciones.length; ++i ) {
      var exposicion = L.createExposicionLayer(exposiciones[i],
        {
          initLatLng: config.initLatLng,
          iconUrl: 'imgs/pin.png',
          snapper: snapper,
        }
      ).addTo(map);
      exposicionesLayers.addLayer(exposicion);
    }
  }

  map.on('click', function(e) {
    map.clearAll();
  });

  $(function() {
    $('#expo2011').click(function() {
      map.clearAll();
      render();
      exposicionesLayers.eachLayer(function (layer) {
        layer.resaltarIconosAnio(2011);
      });
    });

    $('#expo2012').click(function() {
      map.clearAll();
      render();
      exposicionesLayers.eachLayer(function (layer) {
        layer.resaltarIconosAnio(2012);
      });
    });

    $('#expoTodas').click(function() {
      map.clearAll();
      render();

    });

    $('#cerrar').click(function() {
      snapper.close();
    });
  });
}());
