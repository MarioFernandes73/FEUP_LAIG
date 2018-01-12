/**
 * MyHexagonalBoard class, representing a leaf in the scene graph.
 * @constructor
**/
var cameraVelocity = 8;
var cameraCoords = [[-1.5, 23, -4], [13, 10, 8]];

function MyHexagonalBoard(scene) {
	this.cameraAngle = 0;
	this.cameraMoving = false;
    this.lastTime; //records the time at which the last frame was created
	this.scene = scene;
	this.playerMove = null;
	this.cellTextures = [this.scene.graph.textures["black"][0], this.scene.graph.textures["grey"][0], this.scene.graph.textures["white"][0]];
    this.ballTextures = [this.scene.graph.textures["white"][0], this.scene.graph.textures["red"][0]];
	this.board = [];
	this.balls = [];
	this.game = null;
	var cellsRow = [5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5];
	var y = 0;
	var initialX = -4;
	var lastRowInitialColor = 0;
	//create board cell
	for(let row = 0; row <= 10; row++)
	{
		var z = -10 + 2*row;
		var currColor = lastRowInitialColor;
		var boardRow = [];
		for(let column = 0; column < cellsRow[row]; column++)
		{
			var x = initialX + 2*column;
			boardRow.push(new MyCell(scene, [x,y,z], this.cellTextures[currColor]));
			currColor = (currColor + 1) % 3;
		}	
		this.board.push(boardRow);
		
		initialX += (row >= 5) ? 1 : -1;
		lastRowInitialColor = (row < 5) ? (lastRowInitialColor + 1) % 3 : lastRowInitialColor - 1;
		if(lastRowInitialColor == -1) lastRowInitialColor = 2;
	}
	//create board pieces (balls)
    y = 3;
	initialX = -4.5;
	for(let i = 0; i < 8; i++)
	{
		let z = -12 - i;
        for (let i = 0; i < 10; i++) {
            currColor = i % 2;
            let x = initialX + i;
            this.balls.push(new MyBall(scene, [x, y, z], this.ballTextures[currColor]));
        }
    }
	this.nextBallIndex = 0;
	this.readyForMove = true;
    this.undo = function(){this.undoPreviousBall();};
}

MyHexagonalBoard.prototype.logPicking = function ()
{
	var customID = -1;
	if (this.scene.pickMode == false) {
		if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
			for (var i=0; i< this.scene.pickResults.length; i++) {
				var obj = this.scene.pickResults[i][0];
				if (obj)
				{
					customID = this.scene.pickResults[i][1];				
					//console.log("Picked object: " + obj + ", with pick id " + customID);
				}
			}
			this.scene.pickResults.splice(0,this.scene.pickResults.length);
		}		
	}
	if(customID > -1)
	{
        this.playerMove = this.getPrologCoords(customID);
        this.checkForReturnedBalls();
        this.analyzeGameState();
        this.game.gameCycle();
	}
}

MyHexagonalBoard.prototype.display = function(){
	this.checkCameraChange();
	this.displayScore();
    this.scene.interface.gui.__folders["Game Info"].__controllers[0].name(this.game.score);
    this.scene.interface.gui.__folders["Game Info"].__controllers[1].name(this.game.message);
	this.logPicking();
	this.scene.clearPickRegistration();
	//display cells and prepare them for pick
	for(let row = 0; row < this.board.length; row++)
	{
		for(let column = 0; column < this.board[row].length; column++)
		{
			var currCell = this.board[row][column];		
			var id = row*10 + column;
			this.scene.registerForPick(id, currCell.hexagon);
			currCell.display();
		}			
	}
	//display balls
	for(let i = 0; i < this.balls.length; i++)
	{
		this.balls[i].display();
	}
}

MyHexagonalBoard.prototype.displayBoardSymbols = function(){
	let tempBoard = "[";
	for(let row = 0; row < this.board.length; row++)
	{
		tempBoard += "[";
		let rowSymbols = "";
		for(let column = 0; column < this.board[row].length; column++)
		{
			rowSymbols += "\'" + this.board[row][column].symbol + "\'"
			if(column != this.board[row].length -1){
				rowSymbols += ",\' \',";
			}
		}
		if (row == 0 || row == 10){
			rowSymbols = "\' \',\' \',\' \',\' \',\' \'," + rowSymbols + ",\' \',\' \',\' \',\' \',\' \'";
		} else if(row == 1 || row == 9){
			rowSymbols = "\' \',\' \',\' \',\' \'," + rowSymbols + ",\' \',\' \',\' \',\' \'";
		} else if(row == 2 || row == 8){
			rowSymbols = "\' \',\' \',\' \'," + rowSymbols + ",\' \',\' \',\' \'";
		} else if(row == 3 || row == 7){
			rowSymbols = "\' \',\' \'," + rowSymbols + ",\' \',\' \'";
		} else if(row == 4 || row == 6){
			rowSymbols = "\' \'," + rowSymbols + ",\' \'";
		}
		tempBoard += rowSymbols + "]";
		if(row != this.board.length -1 ){
			tempBoard += ",";
		}
	}
	tempBoard += "]";
	return tempBoard;
}

MyHexagonalBoard.prototype.getPlayerMove = function(){
	return this.playerMove;
}

MyHexagonalBoard.prototype.getPrologCoords = function(id){
    let prologRow = Math.floor(id / 10);
    let normalColumn = id % 10;
    let initialDistance = Math.abs(5 - prologRow);
    let prologColumn = initialDistance + 2*normalColumn;
	let prologMove = [prologRow, prologColumn];
    return prologMove;
}

MyHexagonalBoard.prototype.getNormalCoords = function(prologCoords){
    let normalRow = prologCoords[0];
    let prologColumn = prologCoords[1];
    let extraDistance = Math.abs(5 - normalRow);
    let normalColumn = (prologColumn - extraDistance) / 2;

    return [normalRow, normalColumn];
}

MyHexagonalBoard.prototype.prepareNextBall = function(cell){
	this.balls[this.nextBallIndex].addAnimation(cell);
    this.nextBallIndex++;
}

MyHexagonalBoard.prototype.analyzeGameState = function(){
	if(this.nextBallIndex > 0)
	{
		let lastPlayedBall = this.balls[this.nextBallIndex - 1];
        this.readyForMove = lastPlayedBall.isPositioned();
    }
    else {this.readyForMove = true;}
}

MyHexagonalBoard.prototype.isReadyForMove = function(){
    return this.readyForMove;
}

MyHexagonalBoard.prototype.cleanBoard = function(){
	//reset all balls to their original position
    for(let i = 0; i < this.balls.length; i++){
    	this.balls[i].animation = null;
	}
    //empty all cells
    for(let row = 0; row < this.board.length; row++){
        for(let column = 0; column < this.board[row].length; column++){
			this.board[row][column].empty();
        }
	}
	this.nextBallIndex = 0;
}

MyHexagonalBoard.prototype.undoPreviousBall = function(){
	if(this.nextBallIndex == 0){
		console.log("No plays have been made yet!");
		return;
	}
	if(this.game.isFinished()){
        console.log("Game has already finished");
        return;
	}
	console.log('oi');
    console.log('bola ' + this.nextBallIndex);
	let undoBall = this.balls[this.nextBallIndex - 1];
	if(!undoBall.undo && undoBall.isPositioned()) {
        undoBall.undo = true;
        undoBall.associatedCell.empty();
        this.game.changeTurn();
    }
}

MyHexagonalBoard.prototype.checkForReturnedBalls = function(){
    if(this.nextBallIndex == 0)
    	return;

    let lastPlayedBall = this.balls[this.nextBallIndex - 1];
    if(lastPlayedBall.undo && lastPlayedBall.isPositioned()) {
        lastPlayedBall.animation = null;
        lastPlayedBall.undoAnimation = null;
        lastPlayedBall.associatedCell = null;
        lastPlayedBall.undo = false;
        this.nextBallIndex--;
    }
}

MyHexagonalBoard.prototype.checkCameraChange = function() {
    let objectiveCameraCoords = cameraCoords[this.cameraAngle];
	let currCameraCoords = [this.scene.camera.position[X], this.scene.camera.position[Y], this.scene.camera.position[Z]];

	if(objectiveCameraCoords[X] === currCameraCoords[X] && objectiveCameraCoords[Y] === currCameraCoords[Y] &&
        objectiveCameraCoords[Z] === currCameraCoords[Z])//if camera position is correct, just skip
    {
        return;
    }

    var currTime;
    var msDiff;
    if(!this.cameraMoving)
    {
        this.lastTime = (new Date()).getTime();
        msDiff = 0;
        this.cameraMoving = true;
    }
    else
    {
        currTime = (new Date()).getTime();
        msDiff = currTime - this.lastTime;
        this.lastTime = currTime;
    }
    var distanceIncrement = cameraVelocity * (msDiff / 1000);
    let displacementVector = [objectiveCameraCoords[X] - currCameraCoords[X],objectiveCameraCoords[Y] - currCameraCoords[Y],objectiveCameraCoords[Z] - currCameraCoords[Z]];
    let distanceLeft = Math.sqrt(Math.pow(displacementVector[X],2) + Math.pow(displacementVector[Y],2) + Math.pow(displacementVector[Z],2));
    let advancePercentage = distanceIncrement/distanceLeft;

    if(advancePercentage >= 1)
	{
        this.scene.camera.position[X] = objectiveCameraCoords[X];
        this.scene.camera.position[Y] = objectiveCameraCoords[Y];
        this.scene.camera.position[Z] = objectiveCameraCoords[Z];
        this.cameraMoving = false;
	}
	else{
    	let vectorIncrement = [displacementVector[X]*advancePercentage, displacementVector[Y]*advancePercentage, displacementVector[Z]*advancePercentage];
        this.scene.camera.position[X] += vectorIncrement[X];
        this.scene.camera.position[Y] += vectorIncrement[Y];
        this.scene.camera.position[Z] += vectorIncrement[Z];
	}
}

MyHexagonalBoard.prototype.displayScore = function(){
	this.game.score = 'P1 ' + this.game.player1Score + ' - ' + this.game.player2Score + ' P2';
}

