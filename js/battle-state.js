/*
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, "Game Name");

var GameState = {
    init: function(){
    },
    preload: function(){
        this.load.spritesheet("erza_idle", "assets/images/erza_idle.png", 90, 200);
        
    },
    create: function(){
        //this.cursors = game.input.keyboard.createCursorKeys();
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
*/



var BattleState = {
    preload: function () {
        game.load.image("background", "assets/images/forest_background.png");
        game.load.image('tile', 'assets/images/grass_tile.png');
        //game.load.image('tile', 'assets/images/water_tile.png');

        game.time.advancedTiming = true;

        // Add and enable the plug-in.
        game.plugins.add(new Phaser.Plugin.Isometric(game));

        // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
        // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
        game.iso.anchor.setTo(0.5, 0.2);
    },

    create: function () {
        game.scale.pageAlignVertically = true;

        // Background
        this.background = game.add.sprite(0, 0, 'background');
        this.background.smoothed = false;
        this.background.width = game.width;
        this.background.height = game.height;
        

        // Create a group for our tiles.
        this.isoGroup = game.add.group();

        // Let's make a load of tiles on a grid.
        this.spawnTiles();

        // Provide a 3D position for the cursor
        this.cursorPos = new Phaser.Plugin.Isometric.Point3();
    },

    update: function () {
        // Update the cursor position.
        // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
        // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
        game.iso.unproject(game.input.activePointer.position, this.cursorPos);

        // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
        var that = this;
        this.isoGroup.forEach(function (tile) {
            var inBounds = tile.isoBounds.containsXY(that.cursorPos.x, that.cursorPos.y);
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds) {
                tile.selected = true;
                tile.tint = 0x86bfda;
                game.add.tween(tile).to({ isoZ: 7 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;
                game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
        });
    },

    render: function () {
        game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
    },

    spawnTiles: function () {
        var hypo = this.getHypotenuse('tile');
        for (var x = 0; x < 9; x++) {
            for (var y = 0; y < 9; y++) {
                tile = game.add.isoSprite(hypo * x, hypo * y, 0, 'tile', 0, this.isoGroup);
                tile.anchor.set(0.5, 0);
            }
        }
    },

    getHypotenuse: function(tileName){
        var image = new Phaser.Image(game, 0, 0, tileName);
        var tileWidth = image.width/2;
        var tileHeight = tileWidth/2;
        var hypo = Math.sqrt(tileWidth*tileWidth + tileHeight*tileHeight);
        return hypo;
    }
};