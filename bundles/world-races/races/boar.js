'use strict';

/**
 * Human race
 */

module.exports = srcPath => {
  const RandomUtil = require(srcPath + 'RandomUtil');
  const Logger = require(srcPath + 'Logger');

  function setupAttr(character, attr, base, float) {
     if(!character.hasAttribute(attr)) {
       let attrValue = base + (float ? (character.level * 1 + RandomUtil.roll(4, 5)) : 0);
       character.addAttribute(attr, attrValue);
     }
   };

  return {
    name: 'Boar',
    description: 'Wild animals often seen around the village.',

    setupCharacter: character => {
      character.level = character.level || 1;

      setupAttr(character, 'health', 110, true);
      setupAttr(character, 'energy', 50, true);
      setupAttr(character, 'stamina', 100, true);

      setupAttr(character, 'constitution', 7, true);
      setupAttr(character, 'strength', 7, true);
      setupAttr(character, 'agility', 5, true);
      setupAttr(character, 'perception', 5, true);
      setupAttr(character, 'intellect', 1, true);
      setupAttr(character, 'magic', 1, true);
      setupAttr(character, 'will', 1, true);
      setupAttr(character, 'charisma', 1, true);

      setupAttr(character, 'karma', 0);
      setupAttr(character, 'fame', 0);
      setupAttr(character, 'sanity', 0);

      setupAttr(character, 'armor', 0);
      setupAttr(character, 'critical', 0);
    }
  };
};
