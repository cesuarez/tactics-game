var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, "Game Name");

var GameState = {
    init: function(){
    },
    preload: function(){
        this.load.spritesheet("erza_idle", "assets/images/erza_idle.png", 90, 200);
        
    },
    create: function(){
        this.cursors = game.input.keyboard.createCursorKeys();
        game.time.advancedTiming = true;
        game.stage.backgroundColor = '#182d3b';
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
        game.scale.pageAlignVertically = true;
        

        this.charsGroup = game.add.group();
        this.erza = this.charsGroup.create(game.world.centerX, game.world.centerY, "erza_idle");
        this.erza.name = "Erza Scarlet";
        this.erza.anchor.setTo(0.5);
        this.erza.animations.add('idle', [0,1,2,3,4], 6, true);
        this.erza.play('idle');

        // Sprite States

        this.erza.addState(new SpriteState("horizontal", horizontalFun), true);
        function horizontalFun(){
            if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                this.sprite.x += 4;
            }
            if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
                this.sprite.x += -4;
            }
            if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
                this.sprite.setActiveState("vertical") ;
            }
        }

        this.erza.addState(new SpriteState("vertical", verticalFun));
        function verticalFun(){
            if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                this.sprite.y += -4;
            }
            if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
                this.sprite.y += 4;
            }
            if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
                this.sprite.setActiveState("horizontal") ;
            }
        }
    },
    update: function(){
    },
    render: function(){
        game.debug.spriteInfo(this.erza, 32, 32);
        game.debug.text("fps: " + game.time.fps, 2, 14);   
    }
};

game.state.add('GameState', GameState);
game.state.start('GameState');