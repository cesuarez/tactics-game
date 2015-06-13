
/////////////////////////////
// Sprite States Class
/////////////////////////////


/*
function createHCGame(width, height, renderer, parent, state, transparent, antialias, physicsConfig){
	var game = new Phaser.Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig);
	
	Phaser.Keyboard.prototype = new HCKeyboard(game);
	//Phaser.Keyboard.prototype.constructor = HCKeyboard;
	return game;
}
*/

// Pressed Keys stored to check events in Sprite States
Phaser.Keyboard.prototype.pressedKeys = {};
Phaser.Keyboard.prototype.onDownCallback = function(event){
	if (!this.pressedKeys[event.keyCode]){
		this.pressedKeys[event.keyCode] = event.keyIdentifier;
	}
};
Phaser.Keyboard.prototype.onUpCallback = function(event){
	delete this.pressedKeys[event.keyCode]
};


function SpriteState(name, updateFun, keyEvents) {
	this.name = name;
    this.update = updateFun;
    this.keyEvents = keyEvents ? keyEvents : {};
    
    this.addKeyEvent = function(keyCode, eventFun){
    	this.keyEvents[keyCode] = eventFun;
    };

    this.checkKeyEvents = function(){
    	var that = this;
    	Object.getOwnPropertyNames(game.input.keyboard.pressedKeys).forEach(function(keyCode){
    		if (that.keyEvents[keyCode]){
    			that.keyEvents[keyCode](that.sprite);
    		}
    	});
    };
};

Phaser.Sprite.prototype.states = {};
Phaser.Sprite.prototype.addState = function(state, active){
	state.game = this.game;
	state.sprite = this;
	this.states[state.name] = state;
	if (active) {this.state = state;}
};
Phaser.Sprite.prototype.setActiveState = function(name){
	this.state = this.states[name];
};
Phaser.Sprite.prototype.stateless = function(){
	delete this.state;
};
Phaser.Sprite.prototype.removeState = function(name){
	if (this.state.name === name) {
		this.stateless;
	}
	delete this.states[name];
};
Phaser.Sprite.prototype.update = function(){
	if (this.state) {
		this.state.checkKeyEvents();
		this.state.update();
	}
};


