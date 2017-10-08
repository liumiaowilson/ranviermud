'use strict';

/**
 * General functions to manipulate player skills
 */

const srcPath = '../../../src/'
const SKILLS_DATA_META_NAME = "skillsData";
const SPELLS_DATA_META_NAME = "spellsData";

/**
 * Acquire a skill
 * @param {Player} player
 * @param {Skill} skill
 * @return {String}
 */
function acquireSkill(player, skill) {
  if(!player || !skill) {
    return "No player or skill to acquire.";
  }

  let skillsData = getSkillsData(player);
  if(skillsData[skill.id]) {
    return `Skill ${skill.name} has already been acquired.`;
  }

  skillsData[skill.id] = {
    level: 1,
    exp: 0,
  };
}
exports.acquireSkill = acquireSkill;

/**
 * Can use a skill
 * @param {Player} player
 * @param {Skill} skill
 * @return {Boolean}
 */
function canUseSkill(player, skill) {
  if(!player || !skill) {
    return false;
  }

  let skillsData = getSkillsData(player);
  if(skillsData[skill.id]) {
    return true;
  }

  return player.playerClass.hasAbility(skill.id) && player.playerClass.canUseAbility(player, skill.id);
}
exports.canUseSkill = canUseSkill;

/**
 * Use a skill
 * @param {Player} player
 * @param {Skill} skill
 * @return {String}
 */
function useSkill(player, skill) {
  if(!player || !skill) {
    return "No player or skill to use.";
  }

  let skillsData = getSkillsData(player);
  if(!skillsData[skill.id]) {
    return `Skill ${skill.name} has not been acquired.`;
  }

  let data = skillsData[skill.id];
  data.exp = data.exp + 1;
  if(data.exp >= 100) {
    data.level = data.level + 1;
    data.exp = 0;
  }
}
exports.useSkill = useSkill;

/**
 * Get the player's skills data
 * @param {Player} player
 * @return {Object}
 */
function getSkillsData(player) {
  if(player) {
    let skillsData = player.getMeta(SKILLS_DATA_META_NAME);
    if(!skillsData) {
      skillsData = {};
      player.setMeta(SKILLS_DATA_META_NAME, skillsData);
    }

    return skillsData;
  }
}
exports.getSkillsData = getSkillsData;

/**
 * Get the player's skill data
 * @param {Player} player
 * @param {Skill} skill
 * @return {Object}
 */
function getSkillData(player, skill) {
  if(player && skill) {
    const skillsData = getSkillsData(player);
    return skillsData[skill.id];
  }
}
exports.getSkillData = getSkillData;

/**
 * Acquire a spell
 * @param {Player} player
 * @param {Spell} spell
 * @return {String}
 */
function acquireSpell(player, spell) {
  if(!player || !spell) {
    return "No player or spell to acquire.";
  }

  let spellsData = getSpellsData(player);
  if(spellsData[spell.id]) {
    return `Spell ${spell.name} has already been acquired.`;
  }

  spellsData[spell.id] = {
    level: 1,
    exp: 0,
  };
}
exports.acquireSpell = acquireSpell;

/**
 * Can use a spell
 * @param {Player} player
 * @param {Spell} spell
 * @return {Boolean}
 */
function canUseSpell(player, spell) {
  if(!player || !spell) {
    return false;
  }

  let spellsData = getSpellsData(player);
  if(spellsData[spell.id]) {
    return true;
  }

  return player.playerClass.hasAbility(spell.id) && player.playerClass.canUseAbility(player, spell.id);
}
exports.canUseSpell = canUseSpell;

/**
 * Use a spell
 * @param {Player} player
 * @param {Spell} spell
 * @return {String}
 */
function useSpell(player, spell) {
  if(!player || !spell) {
    return "No player or spell to use.";
  }

  let spellsData = getSpellsData(player);
  if(!spellsData[spell.id]) {
    return `Spell ${spell.name} has not been acquired.`;
  }

  let data = spellsData[spell.id];
  data.exp = data.exp + 1;
  if(data.exp >= 100) {
    data.level = data.level + 1;
    data.exp = 0;
  }
}
exports.useSpell = useSpell;

/**
 * Get the player's spells data
 * @param {Player} player
 * @return {Object}
 */
function getSpellsData(player) {
  if(player) {
    let spellsData = player.getMeta(SPELLS_DATA_META_NAME);
    if(!spellsData) {
      spellsData = {};
      player.setMeta(SPELLS_DATA_META_NAME, spellsData);
    }

    return spellsData;
  }
}
exports.getSpellsData = getSpellsData;

/**
 * Get the player's spell data
 * @param {Player} player
 * @param {Spell} spell
 * @return {Object}
 */
function getSpellData(player, spell) {
  if(player && spell) {
    const spellsData = getSpellsData(player);
    return spellsData[spell.id];
  }
}
exports.getSpellData = getSpellData;
