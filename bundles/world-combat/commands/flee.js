'use strict';

module.exports = (srcPath, bundlePath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Random = require(srcPath + 'RandomUtil');
  const say = Broadcast.sayAt;
  const SearchUtil = require(bundlePath + 'world-lib/lib/SearchUtil');

  return {
    usage: 'flee [direction]',
    resource: {
      attribute: 'stamina',
      cost: 10,
    },
    options: (state, player) => {
      let options = {};
      SearchUtil.listExitNames(player).forEach(exit => options[exit] = {});

      return options;
    },
    command: state => (direction, player) => {
      if (!player.isInCombat()) {
        return say(player, "You jump at the sight of your own shadow.");
      }

      let nextRoom = Random.fromArray(player.room.exits).direction;
      if (direction.length) {
        const dirSearch = state.RoomManager.findExit(player.room, direction);
        if (dirSearch) {
          nextRoom = dirSearch.direction;
        }
      }

      player.removeFromCombat();
      state.CommandManager.get('move').execute(nextRoom, player);

      return true;
    }
  };
};
