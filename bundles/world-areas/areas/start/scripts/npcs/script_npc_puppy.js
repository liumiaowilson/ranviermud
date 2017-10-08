
'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return  {
    listeners: {
      playerEnter: state => function (player) {
        if (this.following) {
          return;
        }

        Broadcast.sayAt(player, '小狗兴奋的叫着，朝你跑了过来.');
        this.follow(player);
      }
    }
  };
};
