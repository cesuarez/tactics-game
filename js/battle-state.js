
var BattleState = {
    init: function(){
    },
    preload: function(){
        this.load.spritesheet("erza_idle", "assets/images/erza_idle.png", 90, 200);
        
    },
    create: function(){
        // Para evitar la propagación de una Key hacia el browser
        //game.input.keyboard.addKeyCapture(keyCode)


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

        this.erza.addState(new SpriteState("horizontal", function (){}, horizontalKeysEvents()), true);

        function horizontalKeysEvents(){
            var keyEvents = {};

            keyEvents[Phaser.Keyboard.RIGHT] = function(sprite){
                sprite.x += 4;
            };
            keyEvents[Phaser.Keyboard.UP] = function(sprite){
                sprite.y += -4;
            };
            keyEvents[Phaser.Keyboard.ENTER] = function(sprite){
                sprite.setActiveState("vertical");
            };
            return keyEvents;
        }


        this.erza.addState(new SpriteState("vertical", function (){}, verticalKeysEvents()));

        function verticalKeysEvents(){
            var keyEvents = {};
            keyEvents[Phaser.Keyboard.LEFT] = function(sprite){
                sprite.x += -4;
            };
            keyEvents[Phaser.Keyboard.DOWN] = function(sprite){
                sprite.y += 4;
            };
            keyEvents[Phaser.Keyboard.SPACEBAR] = function(sprite){
                sprite.setActiveState("horizontal") ;
            };
            return keyEvents;
        }
    },
    update: function(){
    },
    render: function(){
        game.debug.spriteInfo(this.erza, 32, 32);
        game.debug.text(game.time.fps, 2, 14);   
    }
};



/*
var BattleState = {
    preload: function () {
        game.load.image("background", "assets/images/forest_background.png");
        game.load.image('tile', 'assets/images/grass_tile.png');
        //game.load.image('tile', 'assets/images/water_tile.png');

        // Character Spritesheet
        game.load.spritesheet('ash', 'assets/images/Ash.png', 100, 120);
        
        // Load audio
        game.load.audio('battle_music', 'assets/audio/Trisection.mp3');
        game.load.audio('tile_fx', 'assets/audio/Tile_select.wav');

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
        
        // Character
        ash = game.add.sprite(200,200,'ash');
        ash.anchor.setTo(0.5,0.5);
        // character animations
        ash.animations.add('stand_down', [0,1,2,3,4,5], 10, true);
        ash.animations.add('stand_left', [6,7,8,9,10,11], 10, true);
        ash.animations.add('walking_down', [12,13,14,15,16,17], 10, true);
        ash.animations.add('walking_left', [18,19,20,21,22,23], 10, true);

        ash.animations.add('attacking_down', [24,25,26,27], 10, true);
        ash.animations.add('attacking_left', [30,31,32,33], 10, true);
        ash.animations.add('taking_damage_down', [28,29], 4, true);
        ash.animations.add('taking_damage_left', [34,35], 4, true);
        
        // Character animation play
        ash.animations.play('stand_down');

        // Create a group for our tiles.
        this.isoGroup = game.add.group();

        // Let's make a load of tiles on a grid.
        this.spawnTiles();

        // Provide a 3D position for the cursor
        this.cursorPos = new Phaser.Plugin.Isometric.Point3();

        tile_fx = game.add.audio('tile_fx');


        battle_music = game.add.audio('battle_music');
        battle_music.loop = true
        //battle_music.play();
        // Another way to loop a Phaser.Sound
        //battle_music.loopFull();
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
                // Do a sound fx
                tile_fx.play();
            }
            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;
                game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
        });
        



        // **************** Character update() 
        // Para probar una cosa de las animaciones


        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            ash.animations.play('walking_down');
            ash.scale.x = 1;

        }else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            ash.animations.play('walking_left');
            ash.scale.x = -1;

        }else if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            ash.animations.play('walking_left');
            ash.scale.x = 1;

        }else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            ash.animations.play('walking_down');
            ash.scale.x = -1;

        }else{
            ash.animations.play('stand_down');
        }

        if(game.input.keyboard.isDown(Phaser.Keyboard.FIVE)){
            ash.animations.play('stand_down');
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.SIX)){
            ash.animations.play('stand_left');
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.ONE)){
            ash.animations.play('attacking_down');
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.TWO)){
            ash.animations.play('attacking_left');
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.THREE)){
            ash.animations.play('taking_damage_down');
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.FOUR)){
            ash.animations.play('taking_damage_left');
        }

        // **************** END
        
    },

    render: function () {
        game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
        game.debug.soundInfo(battle_music, 20, 32);
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
*/