 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor 
    CGFinterface.call(this);
}
;

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the interface.
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui

    this.gui = new dat.GUI();

    /*this.colorGroup = this.gui.addFolder("Color");
    this.colorGroup.add(this.scene, 'currShaderIndex', {'Intermittent shading': 0}).name('Current Shader');
    this.colorGroup.add(this.scene, 'saturatedColor', {'Red': 0, 'Green': 1, 'Blue': 2}).name('Saturated color component');
    this.colorGroup.add(this.scene, 'wireframe').onChange(this.scene.toggleWireframe());
	this.scene.wireframe = false;*/

    
    return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 */
MyInterface.prototype.addLightsGroup = function(lights) {

    var group = this.gui.addFolder("Lights");
    group.open();

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    for (var key in lights) {
        if (lights.hasOwnProperty(key)) {
            this.scene.lightValues[key] = lights[key][0];
            group.add(this.scene.lightValues, key);
        }
    }
    
}

/**
 * Adds a list containing the IDs of the selectable nodes
 */
MyInterface.prototype.addSelectableList = function() {
    //this.colorGroup.add(this.scene, 'currSelectableID', this.scene.graph.selectableNodes).name('Selectable nodes');
}

 MyInterface.prototype.addGameGroup = function() {
     var gameGroup = this.gui.addFolder("Game");
     gameGroup.open();
     gameGroup.add(this.scene.graph.game, 'tempGameMode', {'Human vs Human': 0, 'Human vs CPU': 1, 'CPU vs CPU': 2}).name('Game Mode');
     gameGroup.add(this.scene.graph.game, 'tempCPU1Difficulty', {'Easy': 0, 'Hard': 1}).name('CPU 1 difficulty');
     gameGroup.add(this.scene.graph.game, 'tempCPU2Difficulty', {'Easy': 0, 'Hard': 1}).name('CPU 2 difficulty');
     gameGroup.add(this.scene.graph.game.board, 'undo').name('Undo Play');
     gameGroup.add(this.scene.graph.game, 'start').name('Start Game');
     gameGroup.add(this.scene.graph.game.board, 'cameraAngle', {'Top View': 0, 'Side View': 1}).name('Camera Angle');
     gameGroup.add(this.scene.graph, 'selectedScene', {'Theme 1': 1, 'Theme 2': 2}).name('Scene');

     var gameInfoGroup = this.gui.addFolder("Game Info");
     gameInfoGroup.open();
     gameInfoGroup.add(this.scene.graph.game, 'random1').name('Score');
     gameInfoGroup.add(this.scene.graph.game, 'random2').name('Info');

     var timeGroup = this.gui.addFolder("Time Info");
     timeGroup.open();
     timeGroup.add(this.scene.graph.game, 'random3').name('Player1Time');
     timeGroup.add(this.scene.graph.game, 'random4').name('Player2Time');
 }