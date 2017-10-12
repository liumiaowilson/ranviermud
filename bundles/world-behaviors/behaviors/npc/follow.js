'use strict';

/**
 * A behavior that causes the NPC to follow the player.
 * Options:
 *   message: String, the message when the NPC starts to follow
 */
module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');

  return {
    listeners: {
      playerEnter: state => function (config, player) {
        if (this.following) {
          return;
        }

        let message = config.message || `${this.name} starts to follow you.`;

        Broadcast.sayAt(player, message);
        this.follow(player);
      }
    }
  };
};
