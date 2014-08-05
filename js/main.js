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

  var colors = ['#DE432A', '#38A2F2', '#27BE89', '#F352A5' , '#FFDB2D'];

  var snapper = new Snap({
    element: document.getElementById('content'),
    touchToDrag: false,
  });

  var map = L.map('map', {minZoom: config.minZoom, maxZoom: config.maxZoom, zoomControl: false});
  new L.Control.Zoom({ position: 'topright' }).addTo(map);
  map.addLayer(new L.TileLayer(config.tileUrl, {attribution: config.tileAttrib}));
  map.setView(config.mapCenter, config.initZoom);

  var exposicionesLayers = [];
  for (var i=0; i < exposiciones.length; ++i ) {
    var exposicion = L.createExposicionLayer(exposiciones[i],
      {
        initLatLng: config.initLatLng,
        iconUrl: 'imgs/pin'+i+'.png',
        color: colors[i],
        snapper: snapper,
      }
    ).addTo(map);
    exposicionesLayers.push(exposicion);
  }

  map.on('click', function(e) {
    snapper.close();
    for (var i=0; i < exposicionesLayers.length; ++i ) {
      exposicionesLayers[i].clearItineranciasLayer();
    }
    map.setZoom(config.initZoom, {animate: true});
  });

  $(function() {
    $('#start').click(function() {
      for (var i=0; i<exposicionesLayers.length; ++i) {
        exposicionesLayers[i].renderItinerancias();
      }
    });
    $('#cerrar').click(function() {
      snapper.close();
    });
  });
}());
