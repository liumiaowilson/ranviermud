'use strict';

module.exports = (srcPath, bundlePath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const CommandParser = require(srcPath + 'CommandParser').CommandParser;
  const SearchUtil = require(bundlePath + 'world-lib/lib/SearchUtil');

  return {
    usage: "ditch <follower>",
    options: (state, player) => {
      let options = {};
      SearchUtil.listKeywordsOfFollowers(player).forEach(keyword => options[keyword] = {});

      return options;
    },
    command: state => (arg, player) => {
      if (!arg || !arg.length) {
        return Broadcast.sayAt(player, 'Ditch whom?');
      }

      let target = CommandParser.parseDot(arg, player.followers);

      if (!target) {
        return Broadcast.sayAt(player, "They aren't following you.");
      }

      Broadcast.sayAt(player, `You ditch ${target.name} and they stop following you.`);
      Broadcast.sayAt(target, `${player.name} ditches you and you stop following them.`);
      target.unfollow();

      return true;
    }
  };
};
