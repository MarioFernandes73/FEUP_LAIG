/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyRectangle(scene, args) {
	CGFobject.call(this,scene);
	this.x1 = parseFloat(args[0]);
	this.y1 = parseFloat(args[1]);
	this.x2 = parseFloat(args[2]);
	this.y2 = parseFloat(args[3]);
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;

MyRectangle.prototype.initBuffers = function () {
	
	this.vertices = [
            this.x1, this.y2, 0,
            this.x2, this.y2, 0,
            this.x1, this.y1, 0,
            this.x2, this.y1, 0
		];

	this.indices = [
            0, 1, 2, 
			3, 2, 1
        ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	
	this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
	];
	
	this.initGLBuffers();
};

MyRectangle.prototype.setAmplifFactor = function(afs, aft) {
	var distX = Math.abs(this.y1-this.y2);
	var distY = Math.abs(this.x2-this.x1);
	
	var tx = distX/afs;
	var ty = distY/aft;
	
	this.texCoords = [
			0, ty,
			tx, ty,
			0, 0,
			tx, 0
		];
	this.initBuffers();
}
