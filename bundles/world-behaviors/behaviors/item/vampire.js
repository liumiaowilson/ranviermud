'use strict';

/**
 * A behavior that causes heal of health on combat hit
 * Options:
 *   chance: Number, chance to trigger the effect
 *   magnitude: Float, the percentage of the health to heal against the damage
 */
module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');
  const Random = require(srcPath + 'RandomUtil');
  const Heal = require(srcPath + 'Heal');

  return {
    listeners: {
      hit: state => function (config, damage, target) {
        if (!damage.attacker) {
          return;
        }

        // Have to be careful in weapon scripts. If you have a weapon script that causes damage and
        // it listens for the 'hit' event you will have to check to make sure that `damage.source
        // !== this` otherwise you could create an infinite loop the weapon's own damage triggering
        // its script

        let chance = config.chance || 50;
        let magnitude = config.magnitude || 0.25;

        if (Random.probability(chance)) {
          let amount = Math.floor(damage.finalAmount * magnitude);
          amount = damage.critical ? amount * 2 : amount;

          const heal = new Heal({
            attribute: 'health',
            amount,
            source: this,
            attacker: damage.attacker
          });

          Broadcast.sayAt(damage.attacker, `<b><white> ${target.name}的鲜血激活了你，你感到越来越有活力.</white></b>`, 80);
          heal.commit(damage.attacker);
        }
      }
    }
  };
};
