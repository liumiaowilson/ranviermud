'use strict';

module.exports = (srcPath, bundlePath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const CommandParser = require(srcPath + 'CommandParser').CommandParser;
  const SearchUtil = require(bundlePath + 'world-lib/lib/SearchUtil');

  return {
    usage: "follow <player> | follow self",
    options: (state, player) => {
      let options = {};
      SearchUtil.listKeywordsOfPlayers(player).forEach(keyword => options[keyword] = {});
      options["self"] = {};

      return options;
    },
    command: state => (arg, player) => {
      if (!arg || !arg.length) {
        return Broadcast.sayAt(player, 'Follow whom?');
      }

      let target = CommandParser.parseDot(arg, player.room.players);

      if (!target) {
        if (arg === 'self') {
          target = player;
        } else {
          return Broadcast.sayAt(player, "You can't find anyone named that.");
        }
      }

      // follow self unfollows the person they're currently following
      if (target === player) {
        if (player.following) {
          Broadcast.sayAt(player.following, `${player.name} stops following you.`);
          Broadcast.sayAt(player, `You stop following ${player.following.name}.`);
          player.unfollow();
        } else {
          Broadcast.sayAt(player, "You can't follow yourself...");
        }

        return;
      }

      Broadcast.sayAt(player, `You start following ${target.name}.`);
      Broadcast.sayAt(target, `${player.name} starts following you.`);
      player.follow(target);
    }
  };
};
