'use strict';

module.exports = (srcPath, bundlePath) => {
  const B = require(srcPath + 'Broadcast');
  const Parser = require(srcPath + 'CommandParser').CommandParser;
  const Logger = require(srcPath + 'Logger');
  const SearchUtil = require(bundlePath + 'world-lib/lib/SearchUtil');

  return {
    usage: 'ask <npc>',
    options: (state, player) => {
      let options = {};
      SearchUtil.listKeywordsOfNpcs(player).forEach(keyword => options[keyword] = {});

      return options;
    },
    command : (state) => (args, player) => {
      if (!args.length) {
        return B.sayAt(player, 'Who are you trying to ask?');
      }

      if (!player.room) {
        return B.sayAt(player, 'You are floating in the nether, you cannot speak.');
      }

      let [ npcSearch ] = args.split(' ');

      const npc = Parser.parseDot(npcSearch, player.room.npcs);
      if (!npc) {
        return B.sayAt(player, "You don't see them here.");
      }

      if(!npc.hasBehavior('information')) {
        return B.sayAt(player, "They just ignored you.");
      }

      const informationConfig = npc.getBehavior('information');
      let messages = informationConfig.messages || [];
      for(let message of messages) {
        message = message.replace(/%player%/, player.name);
        B.sayAt(player, `<b><cyan>${message}</cyan></b>`);
      }

      return true;
    }
  };
};
