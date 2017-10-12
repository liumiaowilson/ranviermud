'use strict';

/**
 * A behavior that starts a quest when a player enters the room
 * Options:
 *   quest: String, the reference of the quest
 */
module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');

  return {
    listeners: {
      playerEnter: state => function (config, player) {
        const questRef = config.quest;
        if(questRef) {
          const quest = state.QuestFactory.create(state, questRef, player);
          if (player.questTracker.canStart(quest)) {
            player.questTracker.start(quest);
          }
        }
      }
    }
  };
};
