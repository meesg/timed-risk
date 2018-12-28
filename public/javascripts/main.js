let colors = ['#558b2f', '#a52714', '#01579b', '#ffd600', '#673ab7'];
let map;

function initMap() {
    addApproximateCenterFunction();
    $.getJSON("maps/Delft.json", function(data) { 
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
                
                var bounds = new google.maps.LatLngBounds(
                    poly.getApproximateCenter(),
                    poly.getApproximateCenter());
                overlay = new USGSOverlay(bounds, map);
            }
        });
    });
}