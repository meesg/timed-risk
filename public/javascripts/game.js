/** @constructor */
class Game {
    constructor(board, players) {
        this.board = board;
        this.players = players;
    }
}

class Turn {
    constructor(nPlayers){
        this._nPlayers = nPlayers;
        this.count = 0;
        this.player = 0;
        this.countriesConquered = 0;
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
        this.countriesConquered = 0;
        this.step = "PLACING";
    }
}

let game = new Game(0, 0);
