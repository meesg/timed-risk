let colors = ['#558b2f', '#a52714', '#01579b', '#ffd600', '#673ab7'];

var overlay;

USGSOverlay.prototype = new google.maps.OverlayView();

function USGSOverlay(bounds, image, map) {
  // Now initialize all properties.
  this.bounds_ = bounds;
  this.map_ = map;

  // Define a property to hold the image's div. We'll
  // actually create this div upon receipt of the onAdd()
  // method so we'll leave it null for now.
  this.div_ = null;

  // Explicitly call setMap on this overlay
  this.setMap(map);
}

/**
* onAdd is called when the map's panes are ready and the overlay has been
* added to the map.
*/
USGSOverlay.prototype.onAdd = function() {

var div = document.createElement('div');
div.style.border = 'dotted';
div.style.borderWidth = '5px';
div.style.position = 'absolute';

this.div_ = div;

// Add the element to the "overlayImage" pane.
var panes = this.getPanes();
panes.overlayImage.appendChild(this.div_);
};

USGSOverlay.prototype.draw = function() {

// We use the south-west and north-east
// coordinates of the overlay to peg it to the correct position and size.
// To do this, we need to retrieve the projection from the overlay.
var overlayProjection = this.getProjection();

// Retrieve the south-west and north-east coordinates of this overlay
// in LatLngs and convert them to pixel coordinates.
// We'll use these coordinates to resize the div.
var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

// Resize the image's div to fit the indicated dimensions.
var div = this.div_;
div.style.left = sw.x + 'px';
div.style.top = ne.y + 'px';
div.style.width = (ne.x - sw.x) + 'px';
div.style.height = (sw.y - ne.y) + 'px';
};

USGSOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  };

var map;
function initMap() {
  addApproximateCenterFunction();
  $.getJSON( "maps/Delft.json", function(data) { 
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: data.centre.zoom,
      center: {lat: data.centre.lat, lng: data.centre.lng}
    });

    map.data.addGeoJson(data.geoJSON);

    map.data.setStyle(function(feature) {
      const con = feature.getProperty('continent');
      if(typeof con !== "undefined"){
        const id = data.continents[con].id;
        const color = colors[id];
        return {
          fillColor: color,
          strokeColor: color,
          strokeWeight: 4
        };
      }
    });

    map.data.forEach(function(feature){
      if(feature.getGeometry().getType()=='Polygon'){
        let coord = [];
        feature.getGeometry().forEachLatLng(function(LatLng){
          coord.push(LatLng);
        });
        const poly = new google.maps.Polygon({paths: coord});
        
        new google.maps.Marker({
          position: poly.getApproximateCenter(),
          map: map
        });
        var bounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(62.281819, -150.287132),
          new google.maps.LatLng(62.400471, -150.005608));
        overlay = new USGSOverlay(bounds, map);
      }
    });
  });
}