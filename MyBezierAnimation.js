/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
var X = 0;
var Y = 1;
var Z = 2;

function MyBezierAnimation(scene, args) {
	this.scene = scene;
	//curve points
	this.curvePoints = args[0];
	this.velocity = args[1];
	this.curveLength = this.calculateCurveLength(this.curvePoints);
	this.preceededDistance; //registers the distance preeceded through the curve so far 
	
	this.lastPos = this.curvePoints[0];
	this.lastTime; //registers the last time the animation was played
	this.started = false;
	this.finished = false;
	//calculate animation's final matrix (without rotations)
	this.finalMatrix = this.calculateFinalMatrix();
	this.preceededDistance = 0;
};

MyBezierAnimation.prototype = Object.create(MyAnimation.prototype);
MyBezierAnimation.prototype.constructor=MyBezierAnimation;

MyBezierAnimation.prototype.play = function() {
	if(this.finished)
		return this.finalMatrix;
	
	var currTime;
	var msDiff;
	if(!this.started)
	{
		this.lastTime = (new Date()).getTime();
		msDiff = 0;
		this.started = true;
	}
	else
	{
		currTime = (new Date()).getTime();
		msDiff = currTime - this.lastTime;
		this.lastTime = currTime;
	}
	
	var distanceIncrement = this.velocity * (msDiff / 1000);
	this.preceededDistance += distanceIncrement;
	if(this.preceededDistance >= this.curveLength)
	{
		this.preceededDistance = this.curveLength;
		this.finished = true;
	}
	
	var coordX = this.bezierFunction(X);
	var coordY = this.bezierFunction(Y);
	var coordZ = this.bezierFunction(Z);

	var directionVector = [coordX - this.lastPos[X], 0, coordZ - this.lastPos[Z]];
	var rotationAngleY = -Math.atan2(directionVector[Z], directionVector[X]);
	this.lastPos = [coordX, coordY, coordZ];
	/*
	1st translate
	2nd rotate Y*/
	
	var transformationMatrix = mat4.create();
    mat4.identity(transformationMatrix);
	//we want to apply a translation to the bezier curve position and then rotate towards Y axis
	mat4.translate(transformationMatrix, transformationMatrix, vec3.fromValues(coordX, coordY, coordZ));
	//mat4.rotate(transformationMatrix, transformationMatrix, rotationAngleY, vec3.fromValues(0, 1, 0));
	
	return transformationMatrix;
}

MyBezierAnimation.prototype.bezierFunction = function(coordinate) {
    var P1 = this.curvePoints[0][coordinate];
	var P2 = this.curvePoints[1][coordinate];
	var P3 = this.curvePoints[2][coordinate];
	var P4 = this.curvePoints[3][coordinate];
	
	var t = this.preceededDistance / this.curveLength;
	
	ret = Math.pow(1-t, 3) * P1 +
	      3 * t * Math.pow(1-t, 2) * P2 +
	      3 * Math.pow(t, 2) * (1-t) * P3 +
	      Math.pow(t, 3) * P4;
	return ret;
}

MyBezierAnimation.prototype.calculateCurveLength = function(points) { 
	var P1 = points[0]; var P2 = points[1]; var P3 = points[2]; var P4 = points[3];
	initialLength = this.getPointSegmentLength(points);
	
	var H = this.getIntermediatePoint(P2, P3);
	var L1 = P1;
	var L2 = this.getIntermediatePoint(P1, P2);
	var L3 = this.getIntermediatePoint(L2, H);
	var R3 = this.getIntermediatePoint(P3, P4);
	var R2 = this.getIntermediatePoint(H, R3);
	var L4 = this.getIntermediatePoint(L3, R2);
	var R4 = P4;
	var R1 = L4;
	morePreciseLength = this.getPointSegmentLength([L1, L2, L3, L4, R2, R3, R4]);
	
	if(Math.abs(morePreciseLength - initialLength) < 0.0001)
		return morePreciseLength;
	
	return this.calculateCurveLength([L1, L2, L3, L4]) + this.calculateCurveLength([R1, R2, R3, R4]);	
}

MyBezierAnimation.prototype.getIntermediatePoint = function(point1, point2) {
    var intermediatePoint = [(point1[0] + point2[0])/2, (point1[1] + point2[1])/2, (point1[2] + point2[2])/2];
	return intermediatePoint;
}

MyBezierAnimation.prototype.getPointSegmentLength = function(points) {
    var counter = 0;
	for(let i = 0; i < points.length - 1; i++)
		counter += Math.sqrt(Math.pow(points[i+1][X]-points[i][X], 2) + Math.pow(points[i+1][Y]-points[i][Y], 2) + Math.pow(points[i+1][Z]-points[i][Z], 2))
	return counter;
}

MyBezierAnimation.prototype.calculateFinalMatrix = function(points) {
	this.preceededDistance = this.curveLength; //to reach end of curve
	
	var coordX = this.bezierFunction(X);
	var coordY = this.bezierFunction(Y);
	var coordZ = this.bezierFunction(Z);
	var rotationAngleY = -Math.atan2(coordZ, coordX);

	var transformationMatrix = mat4.create();
	mat4.identity(transformationMatrix);
	mat4.translate(transformationMatrix, transformationMatrix, vec3.fromValues(coordX, coordY, coordZ));

	return transformationMatrix;
}