var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'Tactics Game', null, true, false);

game.state.add('TheGame', BattleState);
game.state.start('TheGame');