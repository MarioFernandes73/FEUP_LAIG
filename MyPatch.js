function MyPatch(scene, args, cplines) {
	CGFobject.call(this,scene);
	this.scene = scene;
	
	this.uDivs = parseFloat(args[0]);
	this.vDivs = parseFloat(args[1]);
	this.cplines = cplines;
	this.createSurface();
};

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.createSurface = function() {
	var uDegree = this.cplines.length - 1;
	var vDegree = this.cplines[0].length - 1;
	var uKnots = this.getKnots(uDegree);
	var vKnots = this.getKnots(vDegree);
	
	var nurbsSurface = new CGFnurbsSurface(uDegree, vDegree, uKnots, vKnots, this.cplines);
	
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.uDivs, this.vDivs);
}

MyPatch.prototype.getKnots = function(degree) {
	var knots = new Array();
	//fulfill the first half with zeros
	for(let i = 0; i <= degree; i++)
		knots.push(0);
	//fulfill the second half with zeros
	for(let i = degree; i <= degree*2; i++)
		knots.push(1);
	return knots;
}

MyPatch.prototype.display = function() {
	this.obj.display();
}