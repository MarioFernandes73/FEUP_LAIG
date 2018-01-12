/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
var DEGREE_TO_RAD = Math.PI / 180;
var X = 0;
var Y = 1;
var Z = 2;

function MyCircularAnimation(scene, args) {
	this.scene = scene;
	//tratar xml args
	this.centre = args[0];
	this.radius = args[1];
	this.inicialAngle = args[2] * DEGREE_TO_RAD;
	this.rotationAngle = args[3] * DEGREE_TO_RAD;
	this.finalAngle = this.inicialAngle + this.rotationAngle;
	this.velocity = args[4];
	this.perimeter = 2*Math.pow(Math.PI, 2);
	this.currAngle = this.inicialAngle;
	
	this.lastTime; //registers the last time the animation was played
	this.started = false;
	this.finished = false;
	//calculate animation's final matrix (without rotations)
	this.finalMatrix = this.calculateFinalMatrix();
};

MyCircularAnimation.prototype = Object.create(MyAnimation.prototype);
MyCircularAnimation.prototype.constructor=MyCircularAnimation;

MyCircularAnimation.prototype.play = function() {
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
	
	var arcLength = this.velocity * (msDiff / 1000);
	var angleIncrement = (arcLength * 2 * Math.PI)/this.perimeter;
	this.currAngle += angleIncrement;
	if(this.currAngle >= this.finalAngle)
	{
		this.currAngle = this.finalAngle;
		this.finished = true;
	}
	
	var circumferenceX = this.radius * Math.cos(this.inicialAngle);
	var circumferenceY = 0;
	var circumferenceZ = -this.radius * Math.sin(this.inicialAngle);
	
	var angleDiff = this.currAngle - this.inicialAngle;
	/*
	1st translate to circumpherence beggining angle
	2nd rotate Y
	3rd translate according to correct centre*/
	
	var transformationMatrix = mat4.create();
    mat4.identity(transformationMatrix);
	//we want to apply a translation to the circumference point (center in origin) followed by rotation, and, lastly, translate so that the circumference is applied to the right centre
	mat4.translate(transformationMatrix, transformationMatrix, vec3.fromValues(this.centre[X], this.centre[Y], this.centre[Z]));
	mat4.rotate(transformationMatrix, transformationMatrix, angleDiff, vec3.fromValues(0, 1, 0));
	mat4.translate(transformationMatrix, transformationMatrix, vec3.fromValues(circumferenceX, circumferenceY, circumferenceZ));
	
	return transformationMatrix;
}

MyCircularAnimation.prototype.calculateFinalMatrix = function() {
	
	//calculate final circumference position
	var circumferenceX = this.radius * Math.cos(this.finalAngle);
	var circumferenceY = 0;
	var circumferenceZ = -this.radius * Math.sin(this.finalAngle);
	
	var transformationMatrix = mat4.create();
    mat4.identity(transformationMatrix);
	mat4.translate(transformationMatrix, transformationMatrix, vec3.fromValues(this.centre[X], this.centre[Y], this.centre[Z]));
	mat4.translate(transformationMatrix, transformationMatrix, vec3.fromValues(circumferenceX, circumferenceY, circumferenceZ));
	
	return transformationMatrix;
}