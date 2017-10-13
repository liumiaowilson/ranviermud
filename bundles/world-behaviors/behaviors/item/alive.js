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
      deathblow: state => function (config, target, skipParty) {
        let weaponLevel = config.level || 1;
        let weaponExp = config.exp || 0;
        weaponExp += 1;
        if(weaponExp >= 100) {
          weaponExp = 100;
        }

        config.level = weaponLevel;
        config.exp = weaponExp;
      },
    }
  };
};
