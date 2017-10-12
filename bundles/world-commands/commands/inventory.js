'use strict';

module.exports = (srcPath, bundlePath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const ItemUtil = require(bundlePath + 'world-lib/lib/ItemUtil');

  return {
    usage: 'inventory',
    options: {},
    command : (state) => (args, player) => {
      if (!player.inventory || !player.inventory.size) {
        return Broadcast.sayAt(player, "You aren't carrying anything.");
      }

      Broadcast.at(player, "You are carrying");
      if (isFinite(player.inventory.getMax())) {
        Broadcast.at(player, ` (${player.inventory.size}/${player.inventory.getMax()})`);
      }
      Broadcast.sayAt(player, ':');

      let items = {};

      for (const [, item ] of player.inventory) {
        let itemData = items[item.name] || {};
        itemData.count = itemData.count || 0;
        itemData.count += 1;
        itemData.item = item;
        items[item.name] = itemData;
      }

      for (const [, itemData ] of Object.entries(items)) {
        const item = itemData.item;
        const count = itemData.count;
        Broadcast.sayAt(player, `${ItemUtil.display(item)} x ${count}`);
      }

      return true;
    }
  };
};
