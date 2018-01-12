/**
 * MyBall class, representing a game piece that can be moved to a board cell.
 * @constructor
**/

function MyBall(scene, coords, texture) {
	this.scene = scene;
	//console.log(coords);
	//console.log(X);
	this.x = coords[X];
	this.y = coords[Y];
	this.z = coords[Z];
	this.coords = coords;
	this.texture = texture;
	let sphereArgs = [0.5, 20, 20];
	this.shpere = new MySphere(scene, sphereArgs);
	this.animation = null;
	this.undoAnimation = null;
	this.associatedCell = null;
}

MyBall.prototype.display = function(){
    var transformationMatrix = mat4.create();
    mat4.identity(transformationMatrix);

    mat4.translate(transformationMatrix, transformationMatrix, vec3.fromValues(this.x, this.y, this.z));

    if(this.undo){
        mat4.multiply(transformationMatrix, transformationMatrix, this.undoAnimation.play());
    }
    if (this.animation != null) {
		mat4.multiply(transformationMatrix, transformationMatrix, this.animation.play());
    }

	this.scene.pushMatrix();
	this.scene.multMatrix(transformationMatrix);
	this.texture.bind();
	this.shpere.display();
	this.scene.popMatrix();
}

MyBall.prototype.addAnimation = function(cell){
    this.associatedCell = cell;
	let displacementVector = [cell.x - this.x, cell.y - this.y, cell.z - this.z];
	let zDist = Math.abs(cell.z - this.z)/2
	let P1 = [0,0,0];
	let P2 = [0,0,zDist];
	let P3 = [displacementVector[X], displacementVector[Y] + 1, displacementVector[Z]];
	let P4 = displacementVector;
	let curvePoints = [P1,P2,P3,P4];

    let undoDisplacementVector = [this.x - cell.x, this.y - cell.y, this.z - cell.z];
    let undoP1 = [0,0,0];
    let undoP2 = [0,1,0];
    let undoP3 = [undoDisplacementVector[X], undoDisplacementVector[Y], undoDisplacementVector[Z] + zDist];
    let undoP4 = undoDisplacementVector;
	let undoCurvePoints = [undoP1,undoP2,undoP3,undoP4];

    let cellBallDist = Math.sqrt(Math.pow(displacementVector[X],2) + Math.pow(displacementVector[Y],2) + Math.pow(displacementVector[Z],2));
    let travellingTime = 1;
	let animationVelocity = cellBallDist/travellingTime;

	let bezierArgs = [curvePoints, animationVelocity];
    this.animation = new MyBezierAnimation(this.scene, bezierArgs);

    let undoBezierArgs = [undoCurvePoints, animationVelocity];
    this.undoAnimation = new MyBezierAnimation(this.scene, undoBezierArgs);

}

MyBall.prototype.isPositioned = function(){
	if(this.animation == null) {return false;}
	if(!this.undo)
		return this.animation.finished;
	else{//if undo has been activated
        return this.undoAnimation.finished;
	}
}