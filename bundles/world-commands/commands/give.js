'use strict';

module.exports = (srcPath, bundlePath) => {
  const B = require(srcPath + 'Broadcast');
  const { CommandParser } = require(srcPath + 'CommandParser');
  const dot = CommandParser.parseDot;
  const ItemUtil = require(bundlePath + 'world-lib/lib/ItemUtil');
  const SearchUtil = require(bundlePath + 'world-lib/lib/SearchUtil');

  return {
    usage: 'give <item> <target>',
    resource: {
      attribute: 'stamina',
      cost: 5,
    },
    options: (state, player) => {
      let options = {};
      let itemKeywords = SearchUtil.listKeywordsOfInventoryItems(player);
      let targetKeywords = SearchUtil.listKeywordsOfTargets(player);
      let targetOptions = {};
      targetKeywords.forEach(keyword => {
        targetOptions[keyword] = {};
      });
      itemKeywords.forEach(keyword => {
        options[keyword] = targetOptions;
      });

      return options;
    },
    command: state => (args, player) => {
      if (!args || !args.length) {
        return B.sayAt(player, 'Give what to whom?');
      }

      let [ targetItem, targetRecip ] = args.split(' ');

      if (!targetRecip) {
        return B.sayAt(player, 'Who do you want to give it to?');
      }

      targetItem = dot(targetItem, player.inventory);

      if (!targetItem) {
        return B.sayAt(player, 'You don\'t have that.');
      }

      // prioritize players before npcs
      let target = dot(targetRecip, player.room.players);

      if (!target) {
        target = dot(targetRecip, player.room.npcs);
        if (target) {
          const accepts = target.getBehavior('accepts');
          if (!accepts || !accepts.includes(targetItem.entityReference)) {
            return B.sayAt(player, 'They don\'t want that.');
          }
        }
      }

      if (!target) {
        return B.sayAt(player, 'They aren\'t here.');
      }

      if (target === player) {
        return B.sayAt(player, `<green>You move ${ItemUtil.display(targetItem)} from one hand to the other. That was productive.</green>`);
      }

      if (target.isInventoryFull()) {
        return B.sayAt(player, 'They can\'t carry any more.');
      }

      player.removeItem(targetItem);
      target.addItem(targetItem);

      B.sayAt(player, `<green>You give <white>${target.name}</white>: ${ItemUtil.display(targetItem)}.</green>`);
      if (!target.isNpc) {
        B.sayAt(target, `<green>${player.name} gives you: ${ItemUtil.display(targetItem)}.</green>`);
      }

      return true;
    }
  };
};
