'use strict';

/**
 * A behavior that causes the NPC to speak the messages when users enter and when NPCs are asked
 * Options:
 *   messages: Array<String>, messages
 */
module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');

  return {
    listeners: {
      playerEnter: state => function (config, player) {
        if (this.hasEffectType('speaking')) {
          return;
        }

        const speak = state.EffectFactory.create('speak', this, {}, {
          messageList: config.messages,
          outputFn: message => {
            message = message.replace(/%player%/, player.name);
            state.ChannelManager.get('say').send(state, this, message);
          }
        });
        this.addEffect(speak);
      },

      playerLeave: state => function (config, player) {
        const speaking = this.effects.getByType('speaking');
        if (speaking) {
          speaking.remove();
        }
      }
    }
  };
};
