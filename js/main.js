var game = createHCGame(window.innerWidth, window.innerHeight, Phaser.AUTO, 'Tactics Game', null, true, false);

game.state.add('BattleState', BattleState);
game.state.start('BattleState');
