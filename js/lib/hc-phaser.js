function createHCGame(width, height, renderer, parent, state, transparent, antialias, physicsConfig){
	var phaserGame = new Phaser.Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig);
	
	var oldKeyboard = Phaser.Keyboard;
	var keyboard = new Phaser.Keyboard(phaserGame);
	Phaser.Keyboard = function(game){
		keyboard.pressedKeys = {};
		keyboard.onDownCallback = function(event){
			if (!this.pressedKeys[event.keyCode]){
				this.pressedKeys[event.keyCode] = event.keyIdentifier;
				console.log(this.pressedKeys);
			}
		};
		keyboard.onUpCallback = function(event){
			delete this.pressedKeys[event.keyCode]
			console.log(this.pressedKeys);
		};

		return keyboard;
	}

	Object.keys(oldKeyboard).forEach(function(prop){
		Phaser.Keyboard[prop] = oldKeyboard[prop];
	});
	
	return phaserGame;
}


/////////////////////////////
// Sprite States Class
/////////////////////////////


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


