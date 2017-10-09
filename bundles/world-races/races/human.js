'use strict';

/**
 * Human race
 */
module.exports = srcPath => {
  const RandomUtil = require(srcPath + 'RandomUtil');

  return {
    name: 'Human',
    description: 'Capable of learning skills and competent in most fields.',

    setupCharacter: character => {
      character.level = character.level || 1;

      const randomValue = base => {
        return base + character.level * 1 + RandomUtil.roll(4, 5);
      };

      character.addAttribute('health', randomValue(90));
      character.addAttribute('energy', randomValue(90));
      character.addAttribute('stamina', randomValue(90));

      character.addAttribute('constitution', randomValue(5));
      character.addAttribute('strength', randomValue(5));
      character.addAttribute('agility', randomValue(5));
      character.addAttribute('perception', randomValue(5));
      character.addAttribute('intellect', randomValue(5));
      character.addAttribute('magic', randomValue(5));
      character.addAttribute('will', randomValue(5));
      character.addAttribute('charisma', randomValue(5));

      character.addAttribute('karma', 0);
      character.addAttribute('fame', 0);
      character.addAttribute('sanity', 0);

      character.addAttribute('armor', 0);
      character.addAttribute('critical', 0);
    }
  };
};
