'use strict';

/**
 * Represent the race of the character
 */
class Race {
  /**
   * @param {string} id  id corresponding to races/<id>.js file
   * @param {object} config Definition of the race
   */
  constructor(id, config) {
    this.id = id;
    this.name = config.name;
    this.description = config.description || this.name;
    this.config = config;
  }

  /**
   * Set up the character
   * @param {Character} character
   */
  setupCharacter(character) {
    if (typeof this.config.setupCharacter === 'function') {
      this.config.setupCharacter(character);
    }
  }
}

module.exports = Race;
