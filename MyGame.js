StateEnum = {
    Running: 0,
    Over: 1
}

TurnEnum = {
    Player1: 1,
    Player2: 2
}

var Player1Symbol = 'B';
var Player2Symbol = 'P';

var PvP = "0";
var PvE = "1";
var EvE = "2";

var Easy = "0";
var Hard = "1";

class Game {

    constructor(board) {
        this.board = board;
        this.winner = null;
        this.gameState = StateEnum.Running;
        this.currentPlayer = TurnEnum.Player1;
        this.currentMove = null;
        this.waitingForServerResponse = false;
        this.tempGameMode = PvP;
        this.gameMode = PvP;
        this.tempCPU1Difficulty = Easy;
        this.CPU1Difficulty = Easy;
        this.tempCPU2Difficulty = Easy;
        this.CPU2Difficulty = Easy;
        this.score = 'P1 0 - 0 P2';
        this.player1Score = 0;
        this.player2Score = 0;
        this.message = 'Player 1 turn';
        this.player1Time = 0.0;
        this.player2Time = 0.0;
        this.currentTime = new Date();
        this.random1 = function(){};
        this.random2 = function(){};
        this.random3 = function(){};
        this.random4 = function(){};
        this.start = function(){this.startGame();};
    }

    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    getPlayerMove(){
        return this.board.getPlayerMove();
    }

    gameCycle(){
        //se existir uma bola a mover-se para uma peça, apenas deve ser dada continuidade à bola e nada mais.
        //se a bola atual terminou, mudar de jogador
        if(this.isFinished())
        {
            console.log("The game has finished already");
            return -1;
        }

        if(this.waitingForServerResponse || !this.board.isReadyForMove())
        {
            console.log('Waiting for server or piece to move...');
            return -1;
        }
        this.waitingForServerResponse = true;

        switch(this.gameMode)
        {
            case PvP:
                this.playerMove();
                break;
            case PvE:
                if (this.currentPlayer == TurnEnum.Player1)
                    this.playerMove();
                else
                    this.CPUMove();
                break;
            case EvE:
                this.CPUMove();
                break;
        }

    }


    playerMove(){
        let move = this.board.getPlayerMove();
        this.checkIfValidMove(move);
    }

    CPUMove(){
        let CPUDifficulty;
        if(this.gameMode == PvE)
            CPUDifficulty = this.CPU1Difficulty;
        else if (this.gameMode == EvE){
            CPUDifficulty = (this.currentPlayer == TurnEnum.Player1) ? this.CPU1Difficulty : this.CPU2Difficulty;
        }
        this.getCPUMove(CPUDifficulty);
    }
    /*
    Ciclo de jogo:
    -> checkIfValidMove
        -> aplicar move
        -> animar move
        -> checkCapture
            -> aplicar capture
            -> animar capture
        ->checkEndOfGame
            -> aplicar end of game
            -> animar end of game
            ----- acabou aqui ou se nao chegou aqui passa para o proximo passo ------
        ->aplicar mudanca de jogador
        ->animar mudanca de jogador
        ----- volta ao inicio ------
    ->animar jogada invalida
    */

    getCPUMove(difficulty){
        //comunicar com prolog para obter melhor jogada do CPU
        let arg = "";
        switch(difficulty)
        {
            case Easy:
            arg = "newComputerMove(" + this.board.displayBoardSymbols() + "," + 1 + "," + 2 + ")";
                break;
            case Hard:
            arg = "newComputerMove(" + this.board.displayBoardSymbols() + "," + 2 + "," + 2 + ")";
                break;
        }
        this.getPrologRequest(arg, this.handleCPUMove.bind(this));
    }

    //ex: move = [5,0]
    checkIfValidMove(move) {
        let tempMove = this.convertStringToArray(move);
        this.currentMove = tempMove;
        let arg = "checkIfValidMove(" + this.board.displayBoardSymbols() + ",[" + tempMove.toString() + "])";
        this.getPrologRequest(arg, this.handleValidMove.bind(this));
    }

    checkCapture() {
        let arg = "checkCapture(" + this.board.displayBoardSymbols() + ",[" + this.currentMove + "]," + this.currentPlayer + ")";
        this.getPrologRequest(arg, this.handleCheckCapture.bind(this));
    }

    checkEndOfGame() {
        let arg = "checkEndOfGame(" + this.board.displayBoardSymbols() + "," + this.currentPlayer + ")";
        this.getPrologRequest(arg, this.handleEndOfGame.bind(this))
    }




    //receives a boolean: 0 -> isn't a valid move || 1 -> is a valid move
    handleValidMove(data) {
        if (data.target.response == 1) {
            let normalMove = this.board.getNormalCoords(this.currentMove);
            let currentCell = this.board.board[normalMove[0]][normalMove[1]];
            currentCell.symbol = this.getSymbol(this.currentPlayer);
            this.board.prepareNextBall(currentCell);
            this.updatePlayerTime();
            this.board.scene.interface.gui.__folders["Time Info"].__controllers[0].name("Player1: " + this.player1Time.toFixed(2) + " sec");
            this.board.scene.interface.gui.__folders["Time Info"].__controllers[1].name("Player2: " + this.player2Time.toFixed(2) + " sec");
            this.checkCapture();
        } else {
            console.log('The play is not valid');
            this.waitingForServerResponse = false;
        }
    }

    handleCheckCapture(data) {
        if (data.target.response != "[[],[],[],[],[],[]]") {
            //aplicar capture
            //console.log(data.target.response);
        } else {

        }
        
        
        this.checkEndOfGame();
    }

    //Handles the end of game
    //receives a boolean: 0 -> game isn't over || 1 -> game is over
    handleEndOfGame(data) {
        let playCPU = false;
        if (data.target.response == 1) {
            this.winner = this.currentPlayer;
            this.message = "Player " + this.currentPlayer + " wins!";
            this.updateScore();
            this.gameState = StateEnum.Over;
        } else if (data.target.response == 2){
            this.message = "It's a tie!";
            this.gameState = StateEnum.Over;
        } else {
            this.changeTurn();
            this.currentMove = null;
            playCPU = this.callNextPlay();
        }
        this.waitingForServerResponse = false;
        if(playCPU) {this.gameCycle();}
    }

    //Handles CPU Move
    //receives an array with the corresponding move (ex: [5,4])
    handleCPUMove(data){
        console.log('CPU move');
        let move = data.target.response;
        this.checkIfValidMove(move);
    }

    startGame(){
        while(this.waitingForServerResponse);//wait for the current server response

        this.gameState = StateEnum.Running;
        this.gameMode = this.tempGameMode;
        this.currentPlayer = TurnEnum.Player1;
        this.CPU1Difficulty = this.tempCPU1Difficulty;
        this.CPU2Difficulty = this.tempCPU2Difficulty;
        this.board.cleanBoard();
        let mode = (this.gameMode === PvP) ? 'Human vs Human' : (this.gameMode === PvE) ? 'Human vs Computer' : 'Computer vs Computer';
        this.message = 'Player 1 turn';
        this.player1Time = 0;
        this.player2Time = 0;
        this.currentTime = new Date();
        this.board.scene.interface.gui.__folders["Time Info"].__controllers[0].name("Player1: " + this.player1Time.toFixed(2) + " sec");
        this.board.scene.interface.gui.__folders["Time Info"].__controllers[1].name("Player2: " + this.player2Time.toFixed(2) + " sec");
        console.log('Started game in ' + mode + ' mode');
        if(this.gameMode === EvE)
            this.gameCycle();
    }

    callNextPlay(){
        if(this.gameMode === PvP || (this.gameMode === PvE && this.currentPlayer == TurnEnum.Player1))
            return false;
        return true;
    }

    sleep(x){ //sleep for x seconds

        var now = new Date().getTime();
        while(new Date().getTime() < now + x*1000){ /* do nothing */ }
    }

    getSymbol(player){
        let symbol = (player == TurnEnum.Player1) ? Player1Symbol : Player2Symbol;
        return symbol;
    }

    //converts strings of type '[x, y]' to an array a = [x, y]
    convertStringToArray(str){
        let array;
        if(typeof str === 'string') {
            array = JSON.parse(str);
        }
        else
            array = str;

        return array;
    }

    changeTurn(){
        this.currentPlayer = (this.currentPlayer == TurnEnum.Player1) ? TurnEnum.Player2 : TurnEnum.Player1;
        this.message = "Player " + this.currentPlayer + " turn";
    }

    isFinished(){
        return this.gameState == StateEnum.Over;
    }

    updateScore(){
        if(this.currentPlayer == TurnEnum.Player1)
            this.player1Score++;
        else
            this.player2Score++;
    }

    updatePlayerTime(){
        if(this.gameState == 0){
            var seconds = (new Date() - this.currentTime.getTime()) / 1000;
            if(this.currentPlayer == 1)  {
                this.player1Time += Math.round(seconds * 100) / 100;
            } else {
                this.player2Time += Math.round(seconds * 100) / 100;
            };
        }
        this.currentTime = new Date();
        console.log(this.player1Time);
        console.log(this.player2Time);
    }
}
