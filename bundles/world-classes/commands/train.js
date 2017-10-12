'use strict';

const ATTR_NAMES = [
  "constitution",
  "strength",
  "agility",
  "perception",
  "intellect",
  "magic",
  "will",
  "charisma"
];

module.exports = (srcPath, bundlesPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');

  return {
    usage: "train <attr> [points]",
    resource: {
      attribute: 'stamina',
      cost: 50,
    },
    options: (state, player) => {
      let options = {};
      ATTR_NAMES.forEach(name => options[name] = {});

      return options;
    },
    command : state => (args, player) => {
      let [attrName, points] = args.split(' ');
      points = parseInt(points, 10) || 1;
      if(!ATTR_NAMES.includes(attrName)) {
        return Broadcast.sayAt(player, "Invalid attribute name.");
      }

      let medals = player.getMeta('currencies.medal') || 0;
      if(medals < points) {
        return Broadcast.sayAt(player, "No enough medals.");
      }

      let base = player.getBaseAttribute(attrName);
      base += points;
      medals -= points;
      player.setAttributeBase(attrName, base);
      player.setMeta('currencies.medal', medals);

      player.save(_ => {
        Broadcast.sayAt(player, `<green>You have successfully trained your ${attrName} by ${points} point(s).</green>`)
      });

      return true;
    }
  };
};
