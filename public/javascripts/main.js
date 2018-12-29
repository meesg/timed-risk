let colors = ['#558b2f', '#a52714', '#01579b', '#ffd600', '#673ab7'];
const mapPath = "maps/Delft.json";

let map;

function initMap() {
    addApproximateCenterFunction();
    $.getJSON(mapPath, function(data) { 
        createMap(data);
        styleMap(data);
        createArmiesOverlays();
    });
}

function createMap(data){
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: data.zoom.standard,
        minZoom: data.zoom.min, 
        maxZoom: data.zoom.max,
        center: {lat: data.centre.lat, lng: data.centre.lng}
    });

    map.data.addGeoJson(data.geoJSON);
}

function styleMap(data){
    map.data.setStyle(function(feature) {
        const continent = feature.getProperty('continent');
        if(typeof continent !== "undefined"){
            const id = data.continents[continent].id;
            const color = colors[id];
            return {
                fillColor: color,
                strokeColor: color,
                strokeWeight: 4
            };
        }
    });
}

function createArmiesOverlays(){
    map.data.forEach(function(feature){
        if(feature.getGeometry().getType()=='Polygon'){
            let coord = [];
            feature.getGeometry().forEachLatLng(function(LatLng){
                coord.push(LatLng);
            });
            const poly = new google.maps.Polygon({paths: coord});
            const center = poly.getApproximateCenter();

            armiesOverlay.push(new ArmiesOverlay(center, map));
        }
    });
}
