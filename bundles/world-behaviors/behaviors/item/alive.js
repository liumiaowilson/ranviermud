'use strict';

/**
 * A behavior that turns the weapon into a live one.
 * Options:
 */
module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');

  return {
    listeners: {
      deathblow: state => function (config, target, skipParty, attacker) {
        let weaponLevel = this.properties.weaponLevel || 1;
        let weaponExp = this.properties.weaponExp || 0;
        weaponExp += 1;
        if(weaponExp >= 100) {
          weaponExp = 100;
        }

        this.properties.weaponLevel = weaponLevel;
        this.properties.weaponExp = weaponExp;

        if(attacker && !attacker.isNpc) {
          attacker.save();
        }
      },
    }
  };
};
