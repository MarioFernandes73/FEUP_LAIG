/**
 * MyCell class, representing a leaf in the scene graph.
 * @constructor
**/

function MyCell(scene, coords, texture) {
	this.scene = scene;
	//console.log(coords);
	//console.log(X);
	this.x = coords[X];
	this.y = coords[Y];
	this.z = coords[Z];
	this.coords = coords;
	this.texture = texture;
	var args = [1, 1, 1, 3, 6, 1, 1];
	this.hexagon = new MyCylinder(scene, args);
	this.symbol = 'x';
}

MyCell.prototype.display = function(){
	var translationMatrix = mat4.create();
	mat4.identity(translationMatrix);
	mat4.translate(translationMatrix, translationMatrix, vec3.fromValues(this.x, this.y, this.z));
	mat4.rotate(translationMatrix, translationMatrix, Math.PI/2, vec3.fromValues(1, 0, 0));
	
	this.scene.pushMatrix();
	this.scene.multMatrix(translationMatrix);
	this.texture.bind();
	this.hexagon.display();
	this.scene.popMatrix();
}

MyCell.prototype.empty = function(){
	this.symbol = 'x';
}