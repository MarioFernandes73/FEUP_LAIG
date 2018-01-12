/**
 * MyPrism
 * @constructor
 */
 function MySphere(scene, args) {
 	CGFobject.call(this,scene);
	
	this.radius = parseFloat(args[0]);
	this.stacks = parseInt(args[1]);
	this.slices = parseInt(args[2]);
	
	//Used for texCoord
	this.incrementX = 1.0/this.slices;
	this.incrementY = 1.0/this.stacks;

 	this.initBuffers();
 };

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

 MySphere.prototype.initBuffers = function() {
	var deltaAng = 2*Math.PI / this.slices;
	var deltaFi = Math.PI / this.stacks;
 	this.vertices = [];
	this.indices = [];
	this.texCoords = [];
	this.normals = [];

	//semisphere z > 0
	//cycle to push vertexes and normals (runs through "bases" from the bottom to the top; each slice of 1 "base" has 2 points, each with their normals)
	for(let i = 0; i<=this.stacks; i++)
	{
		for(let j = 0; j<= this.slices; j++)
		{
			//We only add one vertex for each iteration
			//Vertex position
			let x = this.radius * Math.cos(j*deltaAng) * Math.sin(-Math.PI + i*deltaFi);
			let y = this.radius * Math.sin(j*deltaAng) * Math.sin(-Math.PI + i*deltaFi);
			let z = this.radius * Math.cos(-Math.PI + i*deltaFi);
			//Texture coordinates
			let tx = j*this.incrementX;
			let ty = 1 - (i*this.incrementY);
			//Normal
			let nx = Math.cos(j*deltaAng) * Math.sin(-Math.PI + i*deltaFi);
			let ny = Math.sin(j*deltaAng) * Math.sin(-Math.PI + i*deltaFi);
			let nz = Math.cos(-Math.PI + i*deltaFi);
			let norma = Math.sqrt(Math.pow(nx,2) + Math.pow(ny,2) + Math.pow(nz,2));
		
			this.vertices.push(x,y,z);
			this.texCoords.push(tx, ty);	
			this.normals.push(nx/norma, ny/norma, nz/norma);	
		
		}
	}
	//cycle to push indexes (runs through stacks from the bottom to the top; each slice of 1 stack has 4 points -> 2 triangles)
	for(let i = 0; i<this.stacks; i++)
	{
		for(let j = 0; j< this.slices; j++)
		{
			let currentStack = i*(this.slices+1);			// sum of all points up to the start of this stack
			let point1 = j+currentStack;					//1st vertex of the current face
			let point2 = j+1+currentStack;					//2nd vertex of the current face
			let point3 = j+(this.slices+1)+currentStack;	//3rd vertex of the current face
			let point4 = j+1+(this.slices+1)+currentStack;	//4th vertex of the current face
			
			this.indices.push(point1,point2,point3);
			this.indices.push(point3,point2,point4);
		}
	}
	
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

