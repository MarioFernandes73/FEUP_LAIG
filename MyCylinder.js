 function MyCylinder(scene, args) {
 	CGFobject.call(this,scene);
	this.height = parseFloat(args[0]);
	this.bottomRadius = parseFloat(args[1]);
	this.topRadius = parseFloat(args[2]);
	this.stacks = parseInt(args[3]);
	this.slices = parseInt(args[4]);
	this.topCap = parseInt(args[5]);
	this.bottomCap = parseInt(args[6]);
	
	//Used for texCoord
	this.incrementX = 1.0/this.slices;
	this.incrementY = 1.0/this.stacks;

 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {
	var deltaAng = 2*Math.PI / this.slices;
 	this.vertices = [];
	this.indices = [];
	this.texCoords = [];
	this.normals = [];
	var tempRadius = this.bottomRadius;
	var radiusVariation = (this.topRadius - this.bottomRadius) / this.stacks;

	//cycle to push vertexes and normals (runs through "bases" from the bottom to the top; each slice of 1 "base" has 2 points, each with their normals)
	for(let i = 0; i<=this.stacks; i++)
	{
		for(let j = 0; j<= this.slices; j++)
		{
			//We only add one vertex for each iteration
			//Vertex position
			let x = tempRadius*Math.cos(j*deltaAng);
			let y = tempRadius*Math.sin(j*deltaAng);
			let z = this.height/this.stacks * i;
			//Texture coordinates
			let tx = j*this.incrementX;
			let ty = 1 - (i*this.incrementY);
			//Normal
			let nx = Math.cos(j*deltaAng);
			let ny = Math.sin(j*deltaAng);
			let nz = 0;
			let norma = Math.sqrt(Math.pow(nx,2) + Math.pow(ny,2) + Math.pow(nz,2));

			this.vertices.push(x,y,z);			
			this.texCoords.push(tx, ty);
			this.normals.push(nx/norma, ny/norma, nz/norma);		
		}
		tempRadius += radiusVariation;
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
			
			//creates outside faces
			this.indices.push(point1,point2,point3);
			this.indices.push(point3,point2,point4);
			
			//creates inside faces
			this.indices.push(point3,point2,point1);
			this.indices.push(point4,point2,point3);
		}
	}
	
	var indexQuantity = (this.stacks + 1)*(this.slices + 1) - 1;
	
	if(this.bottomCap == 1){
		//Central point
		this.vertices.push(0,0,0);
		this.texCoords.push(0.5,0.5);
		this.normals.push(0,0,-1);
		
		for(let j = 0; j< this.slices; j++)
		{
			//We only add one vertex for each iteration
			//Vertex position
			let x = this.bottomRadius*Math.cos(j*deltaAng);
			let y = this.bottomRadius*Math.sin(j*deltaAng);
			let z = 0;
			//Texture coordinates
			let tx = x/2 + 0.5;
			let ty = 1 - (y/2 + 0.5);
			
			this.vertices.push(x,y,z);
			this.texCoords.push(tx,ty);
			this.normals.push(0,0,-1);
		}

		//Vertex indeces
		for(let j = 1; j <= this.slices; j++)
		{
			let centrePoint = indexQuantity + 1;
			let point1 = j + indexQuantity + 1;
			let point2 = (j==this.slices) ? indexQuantity+2 : indexQuantity+j+2;
			this.indices.push(point2, point1, centrePoint);
		}
		indexQuantity += this.slices+1;
	}
	
	if(this.topCap == 1){
		//Central point
		this.vertices.push(0,0,this.height);
		this.texCoords.push(0.5,0.5);
		this.normals.push(0,0,1);
		
		for(let j = 0; j< this.slices; j++)
		{
			//We only add one vertex for each iteration
			//Vertex position
			let x = this.topRadius*Math.cos(j*deltaAng);
			let y = this.topRadius*Math.sin(j*deltaAng);
			let z = this.height;
			//Texture coordinates
			let tx = x/2 + 0.5;
			let ty = 1 - (y/2 + 0.5);
			
			this.vertices.push(x,y,z);
			this.texCoords.push(tx,ty);
			this.normals.push(0,0,1);
		}

		//Vertex indeces
		for(let j = 1; j <= this.slices; j++)
		{
			let centrePoint = indexQuantity + 1;
			let point1 = j + indexQuantity + 1;
			let point2 = (j==this.slices) ? indexQuantity+2 : indexQuantity+j+2;
			this.indices.push(centrePoint, point1, point2);
		}		
	}
	

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

