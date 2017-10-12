'use strict';

/**
 * A behavior that shows messages when players enter or leave the room.
 * Options:
 *   enterMessage: String, message to show when players enter
 *   leaveMessage: String, message to show when players leave
 */
module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');

  return {
    listeners: {
      playerEnter: state => function (config, player) {
        const message = config.enterMessage;
        if(message) {
          Broadcast.sayAt(player);
          Broadcast.sayAt(player, message, 80);
        }
      },

      playerLeave: state => function (config, player) {
        const message = config.leaveMessage;
        if(message) {
          Broadcast.sayAt(player);
          Broadcast.sayAt(player, message, 80);
        }
      }
    }
  };
};
