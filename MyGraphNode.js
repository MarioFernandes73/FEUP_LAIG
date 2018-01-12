/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @constructor
**/

function MyGraphNode(graph, nodeID) {
    this.graph = graph;

    this.nodeID = nodeID;

    // IDs of child nodes.
    this.children = [];

    // IDs of child nodes.
    this.leaves = [];

    // The material ID.
    this.materialID = null;

    // The texture ID.
    this.textureID = null;

    this.animations = [];

    this.currentAnimationIndex = 0;

    this.transformMatrix = mat4.create();

    this.displayScene = "";

    mat4.identity(this.transformMatrix);
}

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyGraphNode.prototype.addChild = function (nodeID) {
    this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addLeaf = function (leaf) {
    this.leaves.push(leaf);
}

MyGraphNode.prototype.getMatrix = function () {

    if (this.animations.length == 0) {
        return this.transformMatrix;
    }

    var animationsMatrix = mat4.create();
    mat4.identity(animationsMatrix);

    for (let i = 0; i <= this.currentAnimationIndex; i++) {
        mat4.multiply(animationsMatrix, animationsMatrix, this.animations[i].play());
    }
	
	if(this.animations[this.currentAnimationIndex].finished && this.currentAnimationIndex < this.animations.length - 1)
		this.currentAnimationIndex++;

    return mat4.multiply(animationsMatrix, this.transformMatrix, animationsMatrix);
}
