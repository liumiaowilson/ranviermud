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
    name: 'Human',
    description: 'Capable of learning skills and competent in most fields.',

    setupCharacter: character => {
      character.level = character.level || 1;

      setupAttr(character, 'health', 90, true);
      setupAttr(character, 'energy', 90, true);
      setupAttr(character, 'stamina', 90, true);

      setupAttr(character, 'constitution', 5, true);
      setupAttr(character, 'strength', 5, true);
      setupAttr(character, 'agility', 5, true);
      setupAttr(character, 'perception', 5, true);
      setupAttr(character, 'intellect', 5, true);
      setupAttr(character, 'magic', 5, true);
      setupAttr(character, 'will', 5, true);
      setupAttr(character, 'charisma', 5, true);

      setupAttr(character, 'karma', 0);
      setupAttr(character, 'fame', 0);
      setupAttr(character, 'sanity', 0);

      setupAttr(character, 'armor', 0);
      setupAttr(character, 'critical', 0);
    }
  };
};
