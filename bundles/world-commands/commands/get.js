'use strict';

module.exports = (srcPath, bundlePath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Parser = require(srcPath + 'CommandParser').CommandParser;
  const ItemType = require(srcPath + 'ItemType');
  const ItemUtil = require(bundlePath + 'world-lib/lib/ItemUtil');
  const SearchUtil = require(bundlePath + 'world-lib/lib/SearchUtil');

  return {
    usage: 'get [container] <item> | get room <item>',
    aliases: [ 'take', 'pick', 'loot' ],
    options: (state, player) => {
      let options = {};

      if(player.room) {
        let containers = Array.from(player.room.items).filter(item => item.type === ItemType.CONTAINER && !item.closed);
        for(let container of containers) {
          let containerKeywords = SearchUtil.listKeywordsOfObject(container);
          let containerOptions = {};
          if(container.inventory) {
            for(let item of container.inventory) {
              if (Array.isArray(item)) {
                item = item[1];
              }

              if(item.properties && item.properties.noPickup) {
                continue;
              }
              let itemKeywords = SearchUtil.listKeywordsOfObject(item);
              containerOptions[itemKeywords] = {};
            }
            containerOptions["all"] = {};
            options[containerKeywords] = containerOptions;
          }
        }

        options["room"] = {};
        for(let item of player.room.items) {
          if(item.properties && item.properties.noPickup) {
            continue;
          }

          let itemKeywords = SearchUtil.listKeywordsOfObject(item);
          options["room"][itemKeywords] = {};
        }
        options["room"]["all"] = {};
      }

      return options;
    },
    command : (state) => (args, player, arg0) => {
      if (!args.length) {
        return Broadcast.sayAt(player, 'Get what?');
      }

      if (!player.room) {
        return Broadcast.sayAt(player, 'You are floating in the nether, there is nothing to get.');
      }

      if (player.isInventoryFull()) {
        return Broadcast.sayAt(player, "You can't hold any more items.");
      }

      // 'loot' is an alias for 'get all'
      if (arg0 === 'loot') {
        args = (args + ' all').trim();
      }

      // get bar 3.foo
      let parts = args.split(' ');

      let source = null, search = null, container = null;
      if (parts[0] === 'room') {
        source = player.room.items;
      } else {
        container = Parser.parseDot(parts[0], [...player.room.items].reverse());
        if (!container) {
          return Broadcast.sayAt(player, "You don't see anything like that here.");
        }

        if (container.type !== ItemType.CONTAINER) {
          return Broadcast.sayAt(player, `${ItemUtil.display(container)} isn't a container.`);
        }

        if (container.closed) {
          return Broadcast.sayAt(player, `${ItemUtil.display(container)} is closed.`);
        }

        source = container.inventory;
      }
      search = parts[1];

      if (search === 'all') {
        if (!source || ![...source].length) {
          return Broadcast.sayAt(player, "There isn't anything to take.");
        }

        for (let item of source) {
          // account for Set vs Map source
          if (Array.isArray(item)) {
            item = item[1];
          }

          if (player.isInventoryFull()) {
            return Broadcast.sayAt(player, "You can't carry any more.");
          }

          pickup(item, container, player);
        }

        return;
      }

      const item = Parser.parseDot(search, source);
      if (!item) {
        return Broadcast.sayAt(player, "You don't see anything like that here.");
      }

      pickup(item, container, player);
    }
  };


  function pickup(item, container, player) {
    if (item.properties.noPickup) {
      return Broadcast.sayAt(player, `${ItemUtil.display(item)} can't be picked up.`);
    }

    if (container) {
      container.removeItem(item);
    } else {
      player.room.removeItem(item);
    }
    player.addItem(item);

    Broadcast.sayAt(player, `<green>You receive loot: </green>${ItemUtil.display(item)}<green>.</green>`);

    item.emit('get', player);
    player.emit('get', item);
  }
};
