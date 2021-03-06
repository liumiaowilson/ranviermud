'use strict';

module.exports = (srcPath, bundlePath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const { CommandParser: Parser } = require(srcPath + 'CommandParser');
  const { EquipSlotTakenError } = require(srcPath + 'EquipErrors');
  const ItemUtil = require(bundlePath + 'world-lib/lib/ItemUtil');
  const Logger = require(srcPath + 'Logger');
  const say = Broadcast.sayAt;
  const SearchUtil = require(bundlePath + 'world-lib/lib/SearchUtil');

  return {
    aliases: [ 'wield' ],
    usage: 'wear <item>',
    resource: {
      attribute: 'stamina',
      cost: 5,
    },
    options: (state, player) => {
      let options = {};
      SearchUtil.listKeywordsOfInventoryItems(player, item => item.slot)
          .forEach(keyword => options[keyword] = {});

      return options;
    },
    command : (state) => (arg, player) => {
      arg = arg.trim();

      if (!arg.length) {
        return say(player, 'Wear what?');
      }

      const item = Parser.parseDot(arg, player.inventory);

      if (!item) {
        return say(player, "You aren't carrying anything like that.");
      }

      if (!item.slot) {
        return say(player, `You can't wear ${ItemUtil.display(item)}.`);
      }

      if (item.properties.level > player.level) {
        return say(player, "You can't use that yet.");
      }

      try {
        player.equip(item);
      } catch (err) {
        if (err instanceof EquipSlotTakenError) {
          const conflict = player.equipment.get(item.slot);
          return say(player, `You will have to remove ${ItemUtil.display(conflict)} first.`);
        }

        return Logger.error(err);
      }

      say(player, `<green>You equip:</green> ${ItemUtil.display(item)}<green>.</green>`);
      return true;
    }
  };
};
