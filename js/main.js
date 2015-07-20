var game = createHCGame(window.innerWidth, window.innerHeight, Phaser.AUTO, 'Tactics Game', null, false, false);

game.state.add('BattleState', BattleState);
game.state.start('BattleState');
