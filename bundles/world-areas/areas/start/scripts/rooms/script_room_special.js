'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return  {
    listeners: {
      command: state => function (player, commandName, args) {
        Broadcast.sayAt(player, `你刚才用了命令'${commandName}'和参数${args}`);
      }
    }
  };
};
