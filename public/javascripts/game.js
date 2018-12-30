class Game {
    constructor(board, players) {
        this.board = board;
        this.players = players;
        this.turn = new Turn();
    }
}

class Turn {
    constructor(nPlayers){
        this._nPlayers = nPlayers;
        this.count = 0;
        this.player = 0;
        this.territoriesConquered = 0;
        this.step = "PLACING"
    }

    get nextPlayer(){
        let p = this.player + 1;
        if(p !== this._nPlayers){
            return p;
        }else{
            return 0;
        }
    }

    updateTurn(){
        this.count++;
        this.player = this.nextPlayer;
        this.territoriesConquered = 0;
        this.step = "PLACING";
    }
}

class Board {
    constructor(continents, territories){
        this.continents = continents;
        this.territories = territories;
        this.nTerritories = territories.length;
    }
}

class Continent {
    constructor(name, reward){
        this.name = name;
        this.territoryNames = [];
        this.reward = reward;
        this.owner = null;
    }

    addTerritoryName(t){
        this.territoryNames.push(t);
    }
}

class Territory {
    constructor(name, continent, overlay){
        this.name = name;
        this.continent = continent;
        this.overlay = overlay;
        this.owner = null;
    }

    changeOwner(owner, color){
        this.owner = owner;
        this.overlay.color = color;
    }
}

class Player {
    constructor(name, color){
        this.name = name;
        this.color = color;
    }
}
