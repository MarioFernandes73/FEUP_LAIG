/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem) {
	if(xmlelem.hasAttribute("args"))
		this.args = xmlelem.getAttribute("args").split(" ");
	
	this.type = xmlelem.getAttribute("type");
	switch (this.type){
		case "rectangle":
			this.displayObject = new MyRectangle(graph.scene, this.args);
			break;
			
		case "sphere":
			this.displayObject = new MySphere(graph.scene, this.args);
			break; 
			
		case "cylinder":
			this.displayObject = new MyCylinder(graph.scene, this.args);
			break;
			
		case "triangle":
			this.displayObject = new MyTriangle(graph.scene, this.args);
			break;
		
		case "patch":
			var lines = [];
			for(let i = 0; i < xmlelem.children.length; i++)
			{
				var cpoints = [];
				for(let j = 0; j < xmlelem.children[i].children.length; j++)
				{
					var coords = [];
					coords.push(parseFloat(xmlelem.children[i].children[j].getAttribute("xx")));
					coords.push(parseFloat(xmlelem.children[i].children[j].getAttribute("yy")));
					coords.push(parseFloat(xmlelem.children[i].children[j].getAttribute("zz")));
					coords.push(parseFloat(xmlelem.children[i].children[j].getAttribute("ww")));
					cpoints.push(coords);
				}
				lines.push(cpoints);
			}
			this.displayObject = new MyPatch(graph.scene, this.args, lines);
			break;
		
		case "board":
			this.displayObject = new MyHexagonalBoard(graph.scene);
			graph.game = new Game(this.displayObject);
			this.displayObject.game = graph.game;
			break;
	}
	
}

MyGraphLeaf.prototype.setAmplifFactor = function(afs, aft) {
	if(this.type == "rectangle" || this.type == "triangle")
		this.displayObject.setAmplifFactor(afs, aft);
}

MyGraphLeaf.prototype.togglePrimitiveType = function(primitiveType=this.scene.gl.TRIANGLES) {
	this.displayObject.primitiveType = primitiveType;
 }