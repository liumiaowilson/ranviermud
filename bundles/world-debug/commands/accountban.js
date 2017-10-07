'use strict';

/**
 * Ban a player's account. They will still be able to connect to the game
 * and create other accounts.
 */
module.exports = (srcPath, bundlesPath) => {
  const B = require(srcPath + 'Broadcast');
  const PlayerRoles = require(srcPath + 'PlayerRoles');

  return {
    usage: 'accountban <player>',
    requiredRole: PlayerRoles.ADMIN,
    options: (state, player) => {
      let options = {};
      state.PlayerManager.getPlayersAsArray().forEach(player => options[player.name] = {});

      return options;
    },
    command: state => (args, player) => {
      const say = message => B.sayAt(player, message);

      if (!args || !args.length) {
        return say('Must specify an online player to ban.');
      }

      const targetName = args;

      const target = state.PlayerManager.getPlayer(targetName);
      if (!target) {
        return say('No such player online.');
      }

      B.sayAt(target, '<b><red>SLAM! A mighty hammer appears from the sky and crushes you! You have been BANNED!</red></b>');
      say(`<b><red>SLAM! A mighter hammer appears from the sky and crushes ${target.name}! They have been BANNED!</red></b>`);
      target.account.ban();
      target.socket.emit('close');
    }
  };
};
