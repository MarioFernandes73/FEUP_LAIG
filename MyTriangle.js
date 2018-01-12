/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTriangle(scene, args) {
	CGFobject.call(this,scene);
	this.x1 = parseFloat(args[0]);
	this.y1 = parseFloat(args[1]);
	this.z1 = parseFloat(args[2]);
	this.x2 = parseFloat(args[3]);
	this.y2 = parseFloat(args[4]);
	this.z2 = parseFloat(args[5]);
	this.x3 = parseFloat(args[6]);
	this.y3 = parseFloat(args[7]);
	this.z3 = parseFloat(args[8]);
	
	this.v = [this.x2-this.x1, this.y2-this.y1, this.z2-this.z1];    //v = P2-P1
	this.w = [this.x3-this.x1, this.y3-this.y1, this.z3-this.z1];    //w = P3-P1
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

MyTriangle.prototype.initBuffers = function () {
	
	this.vertices = [
            this.x1, this.y1, this.z1,
            this.x2, this.y2, this.z2,
            this.x3, this.y3, this.z3
		];

	this.indices = [
            0, 1, 2
        ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	
	var X = 0;
	var Y = 1;
	var Z = 2;
	
	var nx = (this.v[Y]*this.w[Z])-(this.v[Z]*this.w[Y]);
	var ny = (this.v[Z]*this.w[X])-(this.v[X]*this.w[Z]);
	var nz = (this.v[X]*this.w[Y])-(this.v[Y]*this.w[X]);
	
	this.normals = [
			nx, ny, nz,
			nx, ny, nz,
			nx, ny, nz
	];
	
	this.initGLBuffers();
};

MyTriangle.prototype.setAmplifFactor = function(afs, aft) {
	
	var a = Math.sqrt(Math.pow(this.x3-this.x1,2) + Math.pow(this.y3-this.y1,2) + Math.pow(this.z3-this.z1,2));
	var b = Math.sqrt(Math.pow(this.x3-this.x2,2) + Math.pow(this.y3-this.y2,2) + Math.pow(this.z3-this.z2,2));
	var c = Math.sqrt(Math.pow(this.x2-this.x1,2) + Math.pow(this.y2-this.y1,2) + Math.pow(this.z2-this.z1,2));
	
	var cosBeta = (Math.pow(a,2)-Math.pow(b,2)+Math.pow(c,2))/(2*a*c);
	var sinBeta = Math.sqrt(1-Math.pow(cosBeta,2));
	this.texCoords = [
			0, 0,
			c/afs, 0,
			(c-a*cosBeta)/afs, -(a*sinBeta)/aft,
		];

	this.initBuffers();
}
