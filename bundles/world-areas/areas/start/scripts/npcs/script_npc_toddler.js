'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');

  return  {
    listeners: {
      spawn: state => function () {
        Broadcast.sayAt(this.room, "一个小毛孩急冲冲的跑了进来.");
        Logger.log(`Spawned toddler into Room [${this.room.title}]`);
      },

      /**
       * Toddler tries to use Rend every time it's available
       */
      updateTick: state => function () {
        if (!this.isInCombat()) {
          return;
        }

        const target = [...this.combatants][0];

        const rend = state.SkillManager.get('rend');
        // skills do both of these checks internally but I only want to send
        // this message when execute would definitely succeed
        if (!rend.onCooldown(this) && rend.hasEnoughResources(this)) {
          Broadcast.sayAt(target, "小毛孩狠狠地抓在了你的身上!");
          rend.execute(null, this, target);
        }
      },

      deathblow: state => function (player) {
        Broadcast.sayAt(player.room, `${player.name}被一个小毛孩击败了.`);
      }
    }
  };
};
