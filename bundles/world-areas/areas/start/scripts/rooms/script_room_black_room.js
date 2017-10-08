'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return  {
    listeners: {
      playerEnter: state => function (player) {
        Broadcast.sayAt(player);
        Broadcast.sayAt(player, `<b><cyan>提示: 你可以先查看一个房间，用'<white>look</white>'，然后用'<white>get</white>'加从哪里和一个合理的关键词 e.g., '<white>get room meat</white>'来获得物品. 有些物品比如木箱子里面可以有其他物品，你可以仔细查看.</cyan></b>`, 80);
      }
    }
  };
};
