/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
var MyAnimation = function() {
	if (this.constructor === MyAnimation)
		throw new Error("Can't instantiate abstract class!");
};

MyAnimation.prototype.play = function() {
    throw new Error("Abstract method!");
}
