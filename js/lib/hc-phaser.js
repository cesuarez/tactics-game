
/////////////////////////////
// Sprite States Class
/////////////////////////////

function SpriteState(name, updateFun, keyEvents) {
	this.name = name;
    this.update = updateFun;
    this.keyEvents = keyEvents;
    
    this.addKeyEvent = function(keyCode, eventFun){
    	this.keyEvents[keyCode] = eventFun;
    };

    this.checkKeyEvents = function(){
    	this.keyEvents.keys.forEach(function(keyCode){
    		if(game.input.keyboard.isDown(keyCode)){
    			this.keyEvents[keyCode]();
    		}
    	});
    };
};

Phaser.Sprite.prototype.states = {};
Phaser.Sprite.prototype.addState = function(state, active){
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


