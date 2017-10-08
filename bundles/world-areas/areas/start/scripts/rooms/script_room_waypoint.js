'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return  {
    listeners: {
      playerEnter: state => function (player) {
        Broadcast.sayAt(player);
        Broadcast.sayAt(player, `<b><cyan>提示: 驿站可以将你传送到很远的其他驿站. 用'<white>waypoint save</white>'来保存这个驿站, 用'<white>waypoint home</white>来存你的home驿站. 你可以用'<white>recall</white>'来回到你的home驿站.</cyan></b>`, 80);
      }
    }
  };
};
