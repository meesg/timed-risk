ArmiesOverlay.prototype = new google.maps.OverlayView();

/** @constructor */
function ArmiesOverlay(center, map) {
    // Initialize all properties.
    this.center_ = center;
    this.map_ = map;
    this.div_ = null;
    this.color = 'white'

    // Explicitly call setMap on this overlay.
    this.setMap(map);
}

/**
 * onAdd is called when the map's panes are ready and the overlay has been
 * added to the map.
 */
ArmiesOverlay.prototype.onAdd = function() {
    var div = document.createElement('div');
    div.id = "armiesOverlay"; 
    div.innerHTML = "0";
    this.div_ = div;

    // Add the element to the "floatPane" pane.
    var panes = this.getPanes();
    panes.floatPane.appendChild(div);
};

ArmiesOverlay.prototype.draw = function() {
    //Set the location of the div
    var overlayProjection = this.getProjection(); 
    var pixelLocation = overlayProjection.fromLatLngToDivPixel(this.center_);
    this.div_.style.left = (pixelLocation.x-25) + 'px';
    this.div_.style.top = (pixelLocation.y-25) + 'px';
    this.div_.style['background-color'] = this.color;
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
ArmiesOverlay.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
};

google.maps.event.addDomListener(window, 'load', initMap);
