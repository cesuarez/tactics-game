function SpriteState(name, fun) {
	this.name = name;
    this.update = fun;
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
	if (this.state) {this.state.update();}
};

