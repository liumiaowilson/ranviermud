'use strict';

module.exports = (srcPath, bundlePath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const ItemUtil = require(bundlePath + 'world-lib/lib/ItemUtil');

  return {
    aliases: ['worn'],
    usage: 'equipment',
    options: {},
    command: (state) => (args, player) => {
      if (!player.equipment.size) {
        return Broadcast.sayAt(player, "You are completely naked!");
      }

      Broadcast.sayAt(player, "Currently Equipped:");
      for (const [slot, item] of player.equipment) {
        Broadcast.sayAt(player, `  <${slot}> ${ItemUtil.display(item)}`);
      }

      return true;
    }
  };
};
