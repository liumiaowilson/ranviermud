'use strict';

/**
 * IP ban a player
 */
module.exports = (srcPath, bundlePath) => {
  const B = require(srcPath + 'Broadcast');
  const Data = require(srcPath + 'Data');
  const PlayerRoles = require(srcPath + 'PlayerRoles');

  return {
    usage: 'ipban <player>',
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

      const bannedFile = srcPath + '../data/banned.json';
      const bannedList = Data.parseFile(bannedFile);
      bannedList.push(target.socket.address().address);
      Data.saveFile(bannedFile, bannedList);

      B.sayAt(target, '<b><red>SLAM! A mighty hammer appears from the sky and crushes you! You have been BANNED!</red></b>');
      say(`<b><red>SLAM! A mighter hammer appears from the sky and crushes ${target.name}! They have been BANNED!</red></b>`);
      target.socket.emit('close');
    }
  };
};
