function createHCGame(width, height, renderer, parent, state, transparent, antialias, physicsConfig){
    var phaserGame = new Phaser.Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig);
    
    var oldKeyboard = Phaser.Keyboard;
    var keyboard = new Phaser.Keyboard(phaserGame);
    Phaser.Keyboard = function(game){
        keyboard.pressedKeys = {};
        keyboard.onDownCallback = function(event){
            if (!this.pressedKeys[event.keyCode]){
                this.pressedKeys[event.keyCode] = event.keyIdentifier;
            }
        };
        keyboard.onUpCallback = function(event){
            delete this.pressedKeys[event.keyCode]
        };

        return keyboard;
    }

    Object.keys(oldKeyboard).forEach(function(prop){
        Phaser.Keyboard[prop] = oldKeyboard[prop];
    });
    
    return phaserGame;
}


/////////////////////////////
// Windows
/////////////////////////////


function Window(game, x, y, width, height, texture, group, draggable){
    this.game = game;
    
    // Borders Spaces
    this.horizontalBorderSpace = 30;
    this.verticalBorderSpace = 30;

    this.componentsList = [];

    this.display = new Phaser.TileSprite(game, x, y, width, height, texture);
    this.display.inputEnabled = true;
    this.display.input.priorityID = 100;
    if (draggable) this.display.input.enableDrag();
    if (group) group.add(this.display);

    this.getUsableWidth = function(){
        return this.display.width - (this.horizontalBorderSpace * 2)
    }

    this.getUsableHeight = function(){
        return this.display.height - (this.verticalBorderSpace * 2)
    }

    this._addComponent = function(component, col, row){
        component.inputEnabled = true;
        component.input.priorityID = this.display.input.priorityID + 1;

        /* // Agregar estas cosas a los componentes
        component.events.onInputDown.add(onDown, this.game.state);
        function onDown(sprite, pointer) {
            console.log("CLICKIE COMP");
        }
        */

        // Agregar la propiedad arrangement a la Window si se quiere acomodar
        // el componente automaticamente
        if (this.arrangement) {
            this.arrangement.placeComponent(this, component);
        } else {
            var col = col || 0;
            var row = row || 0;
            component.x = this.horizontalBorderSpace + col * this.getUsableWidth() / 100;
            component.y = this.verticalBorderSpace + row * this.getUsableHeight() / 100;
        }
        this.display.addChild(component);
    };

    this.getAlignment = function(compAlign){
        return compAlign !== undefined 
               ? compAlign 
               : (this.arrangement ? this.arrangement.alignment : 0);
    }

    this.addImageComponent = function (imageKey, align, col, row){
        var imageComp = new WindowImage(this.game, imageKey, this.getAlignment(align));
        this._addComponent(imageComp, col, row);
        return imageComp;
    };

    this.addSpriteComponent = function (imageKey, align, col, row){
        var spriteComp = new WindowSprite(this.game, imageKey, this.getAlignment(align));
        this._addComponent(spriteComp, col, row);
        return spriteComp;
    };

    this.addVerticalListComponent = function (align, col, row){
        var listBack = this.game.make.bitmapData(this.getUsableWidth(), this.getUsableHeight() - 100);
        listBack.fill(0, 0, 0);
        var listComp = new WindowList(this.game, listBack, this.getAlignment(align));
        listComp.alpha = 0.2;
        this._addComponent(listComp, col, row);

        // Lo inicializo despues de tener el Anchor seteado
        listComp.initChildren();

        return listComp;
    };
}


///// alignment /////

var START_ALIGN = 0;
var CENTER_ALIGN = 50;
var END_ALIGN = 100;

function VERTICAL_ARRANGE(spacing, alignment){
    this.spacing = spacing || 15;
    this.alignment = alignment || END_ALIGN;

    this.placeComponent = function(window, comp){
        // Porcentaje horizontal sin tener en cuenta los Border Space
        var alignment = comp.alignment;
        comp.anchor.setTo(alignment / 100, 0);
        comp.x = window.horizontalBorderSpace + 
                 alignment * window.getUsableWidth() / 100;
        //comp.x = window.horizontalBorderSpace;
        if (window.display.children.length > 0){
            var lastChild = window.display.children[window.display.children.length - 1];
            comp.y = lastChild.y + lastChild.height + this.spacing;
        } else {
            comp.y = window.verticalBorderSpace;
        }
    };
}

function HORIZONTAL_ARRANGE(spacing, alignment){
    this.spacing = spacing || 10;
    this.alignment = alignment || CENTER_ALIGN;

    this.placeComponent = function(window, comp){
        // Porcentaje horizontal sin tener en cuenta los Border Space
        var alignment = comp.alignment;
        comp.anchor.setTo(0, alignment / 100);
        comp.y = window.verticalBorderSpace + 
                 alignment * (window.display.height - (window.verticalBorderSpace * 2)) / 100;
        //comp.x = window.horizontalBorderSpace;
        if (window.display.children.length > 0){
            var lastChild = window.display.children[window.display.children.length - 1];
            comp.x = lastChild.x + lastChild.width + this.spacing;
        } else {
            comp.x = window.horizontalBorderSpace;
        }
    }
}

// http://phaser.io/examples/v2/bitmapdata/alpha-mask

///// Components /////

function WindowImage(game, imageKey, align) {
    Phaser.Image.call(this, game, 0, 0, imageKey);
    this.alignment = align;
}
WindowImage.prototype = Object.create(Phaser.Image.prototype);
WindowImage.prototype.constructor = WindowImage;

function WindowSprite(game, imageKey, align) {
    Phaser.Sprite.call(this, game, 0, 0, imageKey);
    this.alignment = align;
}
WindowSprite.prototype = Object.create(Phaser.Sprite.prototype);
WindowSprite.prototype.constructor = WindowSprite;

function WindowList(game, bitmapData, align) {
    Phaser.Image.call(this, game, 0, 0, bitmapData);
    this.alignment = align;

    this.initChildren = function(){
        var scrollBitmapData = this.game.make.bitmapData(12, this.height - 40);
        scrollBitmapData.fill(0, 0, 0);
        var scrollX = this.width - 20;
        var scrollY = 20 - this.height * this.anchor.y;
        this.scrollbar = new Phaser.Image(this.game, scrollX, scrollY, scrollBitmapData);
        this.addChild(this.scrollbar);
    }
}
WindowList.prototype = Object.create(Phaser.Image.prototype);
WindowList.prototype.constructor = WindowList;


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
Phaser.Sprite.prototype.addState = function(name, updateFun, keyEvents, active){
    var state = new SpriteState(name, updateFun, keyEvents);
    state.game = this.game;
    state.sprite = this;
    this.states[state.name] = state;
    if (active) {this.state = state;}
    return state;
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
    this.children.forEach(function(child){
        child.update();
    });
    
    if (this.state) {
        this.state.checkKeyEvents();
        if (this.state.update) this.state.update(this);
    }
};


