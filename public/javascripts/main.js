let colors = ['#558b2f', '#a52714', '#01579b', '#ffd600', '#673ab7'];
let playerColors = ['#b9ff59', '#59b9ff', '#ff8a59'];
const mapPath = "maps/Delft.json";

let map;

function initMap() {
    addApproximateCenterFunction();
    $.getJSON(mapPath, function(data) { 
        createMap(data);
        styleMap(data);

        const armiesOverlay = createArmiesOverlays();
        board = buildBoard(data.continents, armiesOverlay);

        players = [];
        for(let i = 0; i < 3; i++){
            players.push(new Player("player " + i, playerColors[i]));
        }
        distributeTerritories(players);

        game = createGame(board, players);

        map.data.addListener('mouseover', function(event) {
            if(event.feature.getProperty('type')=='territory'){
                $('#territoryName').html(event.feature.getProperty('name'));
            }
        });
        
        map.data.addListener('click', function(event) {
            if(event.feature.getProperty('type')=='territory'){
                let ter = board.territories[event.feature.getProperty('name')];
                let owner = ter.owner;

                if(players[owner].availableArmies > 0){
                    ter.addArmies(1);
                    players[owner].availableArmies--;
                }
            }
        });
    });
}

function createMap(data){
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: data.zoom.standard,
        minZoom: data.zoom.min, 
        maxZoom: data.zoom.max,
        center: {lat: data.centre.lat, lng: data.centre.lng},
        streetViewControl: false,
        setClickableIcons: false,
        mapTypeControl: false,
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


/** Creates the overlays for the armies number for each territory and returns them. */
function createArmiesOverlays(){
    let armiesOverlay = [];

    map.data.forEach(function(feature){
        if(feature.getGeometry().getType()=='Polygon'){
            let coord = [];
            feature.getGeometry().forEachLatLng(function(LatLng){
                coord.push(LatLng);
            });
            const poly = new google.maps.Polygon({paths: coord});
            const center = poly.getApproximateCenter();

            armiesOverlay[feature.getProperty('name')] = new ArmiesOverlay(center, map);
        }
    });

    return armiesOverlay;
}

function buildBoard(continentsData, armiesOverlay){
    let continents = [];
    let territories = [];

    for (let continentKey in continentsData) {
        if (!continentsData.hasOwnProperty(continentKey)) continue; // skip loop if the property is from prototype
        
        const continent = continentsData[continentKey];
        continents[continent.name] = new Continent(continent.name, continent.reward);
    }
    
    map.data.forEach(function(feature){
        const continentName = feature.getProperty('continent');
        if(typeof continentName === 'undefined') return; // skip if the feature isn't a terrirory (non territories don't have continent property)

        const territoryName = feature.getProperty('name');
        const overlay = armiesOverlay[territoryName];

        territories[territoryName] = new Territory(territoryName, continentName, overlay);
        continents[continentName].addTerritoryName(territoryName);
    });

    return new Board(continents, territories);
}

function distributeTerritories(players){
    let ter = Object.keys(board.territories);

    for(let i = 0; ter.length > 0; i++){
        //Choose random territory
        const rand = Math.floor(Math.random()*ter.length);
        const chosenTer = ter[rand];

        //Check who's turn it is
        const turn = i % players.length;
        const p = players[turn];

        board.territories[chosenTer].changeOwner(turn, p.color);

        //Remove drawn territory
        ter.splice(rand,1);
    }
}

function createGame(board, players){
    players.forEach(function(player){
        player.availableArmies = 3;
    })
    return new Game(board, players);
}
