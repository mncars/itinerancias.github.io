L.ItineranciasMap = L.Map.extend({
  initialize: function (id, options) {
    this._exposicionesLayers = options.exposicionesLayers;
    this._snapper = options.snapper;
    this._initZoom = options.initZoom;
    L.Map.prototype.initialize.call(this, id, options);

  },

  clearAll: function () {
    this._snapper.close();
    this._exposicionesLayers.eachLayer(function (layer) {
      layer.clearItineranciasLayer();
    });

    this.setZoom(this._initZoom, {animate: true});
  }
});

L.map = function (id, options) {
  return new L.ItineranciasMap(id, options);
};

L.ItineranciaMarker = L.Marker.extend({
  initialize: function (exposicion, itinerancia, exposicionLayer, snapper, latlngs, options) {
    this._exposicion = exposicion;
    this._itinerancia = itinerancia;
    this._exposicionLayer = exposicionLayer;
    this._snapper = snapper;
    L.Marker.prototype.initialize.call(this, latlngs, options);
  },

  renderExposicion: function () {
    var htmlExposicion = '<h2>' + this._exposicion.titulo + "</h2>" +
      '<div class="fecha-lugar">' + this._exposicion.fechas + '<br>' +
        this._exposicion.lugar + '</div>' +
      '<img src="'+this._exposicion.imagen+'" class="img-responsive">' +
      '<span class="label">Comisariado:</span> ' + this._exposicion.comisario + "<br>" +
      '<span class="label">Organización:</span> ' + this._exposicion.organizacion + "<br>" +
      '<h3>Itinerancias</h3>';

    for (var j=0; j < this._exposicion.itinerancia.length; ++j ) {
      itinerancia = this._exposicion.itinerancia[j];
      htmlExposicion += '<div class="itinerancia"><a href="' + itinerancia.url + '" target="_blank">' + itinerancia.lugar + '</a>' +
        '<div class="itinerancia-lugar">' + itinerancia.fechas + '</div></div>';
    }

    $(".exposicionThumbnail").html(htmlExposicion);
    console.log(this._snapper);
    this._snapper.open('right');
  },

  renderItinerancias: function () {
    this._exposicionLayer.renderItinerancias();
    this.renderExposicion();
    this._map.fitBounds(this._exposicionLayer.getBounds(),
      {
        animate: true,
        maxZoom: 6,
        paddingTopLeft: [220, 220]
      }
    );
  }
});

L.itineranciaMarker = function (exposicion, itinerancia, exposicionLayer, snapper, latlngs, options) {
  return new L.ItineranciaMarker(exposicion, itinerancia, exposicionLayer, snapper, latlngs, options);
};


/**
 * Representa una exposicion y sus itinerancias
 */
L.ExposicionLayer = L.LayerGroup.extend({
  options: {
    initLatLng: [],
    iconUrl: 'imgs/pin.png',
    iconUrlResaltado: 'imgs/pin0.png'
  },

  initialize: function (exposicion, options) {
    this._exposicion = exposicion;
    this._initLatLng = options.initLatLng;
    this._snapper = options.snapper;
    this._itineranciasLayer = L.layerGroup();
    this._markers = [];

    this._icon = L.icon({
      iconUrl: options.iconUrl,
      iconSize: [24, 24],
      iconAnchor: [12, 22],
      popupAnchor: [0, -22]
    });
    this._iconResaltado = L.icon({
      iconUrl: 'imgs/pin0.png',
      iconSize: [24, 24],
      iconAnchor: [12, 22],
      popupAnchor: [0, -22]
    });

    L.LayerGroup.prototype.initialize.call(this);
  },

  onAdd: function (map) {
    L.LayerGroup.prototype.onAdd.call(this, map);
    this.addLayer(this._itineranciasLayer);

    for (var j=0; j < this._exposicion.itinerancia.length; ++j ) {
      itinerancia = this._exposicion.itinerancia[j];
      var marker = L.itineranciaMarker(this._exposicion, itinerancia, this, this._snapper, [itinerancia.lat, itinerancia.lng], {
          icon: this._icon,
        });
      this._markers.push(marker);
      marker.on('click', renderItinerancias);
      this.addLayer(marker);
    }
  },

  getBounds: function () {
    var group = new L.featureGroup(this._markers);
    return group.getBounds();
  },

  renderItinerancias: function() {
    this._map.clearAll();
    this._itineranciasLayer.clearLayers();

    var marker = L.marker(this._initLatLng, {
          icon: this._icon,
        });
    this._itineranciasLayer.addLayer(marker);
    this._markers.push (marker);

    for (var j=0; j < this._exposicion.itinerancia.length; ++j ) {
      itinerancia = this._exposicion.itinerancia[j];
      this._itineranciasLayer.addLayer(
        L.polyline(
          [this._initLatLng, [itinerancia.lat, itinerancia.lng]],
          {
            color: "#c8353e",
            weight: 3,
          }
        )
      );
    }
    this.resaltarIconos();
  },

  resaltarIconos: function() {
    for (var i=0; i < this._markers.length; ++i) {
      this._markers[i].setIcon(this._iconResaltado);
    }
  },

  resaltarIconosAnio: function(anio) {
    if (this._exposicion.anio == anio) {
      this.resaltarIconos();
    }
  },

  clearResaltarIconos: function() {
    for (var i=0; i < this._markers.length; ++i) {
      this._markers[i].setIcon(this._icon);
    }
  },

  clearItineranciasLayer: function() {
    this.clearResaltarIconos();
    this._itineranciasLayer.clearLayers();
  },

});

L.createExposicionLayer = function (exposicion, options) {
  return new L.ExposicionLayer(exposicion, options);
};

function renderItinerancias(e) {
  e.target.renderItinerancias();
}
