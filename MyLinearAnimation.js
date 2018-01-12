/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
var X = 0;
var Y = 1;
var Z = 2;
var ANGLE = 3;
var DISTANCE = 4;

function MyLinearAnimation(scene, args) {
	this.scene = scene;
	//tratar xml args
	this.cntrlPoints = args[0];
	this.velocity = args[1];
	this.segmentNum = this.cntrlPoints.length - 1; 

	this.translationVectors = [];
	for(let i = 0; i < this.cntrlPoints.length-1; i++)
	{
		var translationX = this.cntrlPoints[i+1][X] - this.cntrlPoints[i][X];
		var translationY = this.cntrlPoints[i+1][Y] - this.cntrlPoints[i][Y];
		var translationZ = this.cntrlPoints[i+1][Z] - this.cntrlPoints[i][Z];
		var rotationAngle = -Math.atan2(translationZ, translationX);
		var distance = Math.sqrt(Math.pow(translationX, 2) + Math.pow(translationY, 2) + Math.pow(translationZ, 2));
		this.translationVectors.push([translationX, translationY, translationZ, rotationAngle, distance]);
	}
	this.currSegmentIndex = 0;
	this.currSegmentPreceededDistance = 0; //distance preceeded in the current cntrl point segment
	
	this.lastTime; //registers the last time the animation was played
	this.started = false;
	this.finished = false;
	//calculate animation's final matrix (without rotations)
	this.finalMatrix = this.calculateFinalMatrix();
};

MyLinearAnimation.prototype = Object.create(MyAnimation.prototype);
MyLinearAnimation.prototype.constructor=MyLinearAnimation;

MyLinearAnimation.prototype.play = function() {
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
	this.currSegmentPreceededDistance += distanceIncrement;
	var segmentDistance; //current segment length
	var extraDistance = 0; //amount of distance preceeded since the last frame that exceeds the current segment length
	do
	{
		if(extraDistance > 0)
		{ 	
			this.currSegmentIndex++;
			this.currSegmentPreceededDistance = extraDistance;
		}
	
		segmentDistance = this.translationVectors[this.currSegmentIndex][DISTANCE];
		extraDistance = this.currSegmentPreceededDistance - segmentDistance; //difference between the total preceeded distance in the current cntrl point segment and its real value
		if(this.currSegmentIndex == this.segmentNum - 1 && extraDistance >= 0) // declare animation end
		{
			this.currSegmentPreceededDistance = segmentDistance;
			extraDistance = 0;
			this.finished = true;
		}
	}
	while(extraDistance > 0);
	
	var translationX = 0;
	var translationY = 0;
	var translationZ = 0;
	for(let i = 0; i <= this.currSegmentIndex; i++)
	{
		var t = 1;
		if(i == this.currSegmentIndex)
			t = this.currSegmentPreceededDistance/segmentDistance; //percentage of distance preeceded in the current segment
		
		translationX += this.translationVectors[i][X] * t;		
		translationY += this.translationVectors[i][Y] * t;
		translationZ += this.translationVectors[i][Z] * t;
	}	 
	
	var rotation = this.translationVectors[this.currSegmentIndex][ANGLE];
	/*
	1st rotate Y
	2nd translate */
	
	var transformationMatrix = mat4.create();
    mat4.identity(transformationMatrix);
	//we want to apply a rotation followed by translation
	mat4.translate(transformationMatrix, transformationMatrix, vec3.fromValues(translationX, translationY, translationZ));
	mat4.rotate(transformationMatrix, transformationMatrix, rotation, vec3.fromValues(0, 1, 0));
	
	return transformationMatrix;
}

MyLinearAnimation.prototype.calculateFinalMatrix = function() {
	var translationX = 0;
	var translationY = 0;
	var translationZ = 0;
	for(let i = 0; i < this.translationVectors.length; i++)
	{
		translationX += this.translationVectors[i][X];
		translationY += this.translationVectors[i][Y];
		translationZ += this.translationVectors[i][Z]
	}
	
	var transformationMatrix = mat4.create();
    mat4.identity(transformationMatrix);
	mat4.translate(transformationMatrix, transformationMatrix, vec3.fromValues(translationX, translationY, translationZ));

	return transformationMatrix;
}