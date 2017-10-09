'use strict';

const sprintf = require('sprintf-js').sprintf;

module.exports = (srcPath, bundlesPath) => {
  const B = require(srcPath + 'Broadcast');
  const Logger = require(srcPath + 'Logger');
  const SkillUtil = require(bundlesPath + 'world-lib/lib/SkillUtil');

  return {
    aliases: ['abilities', 'spells'],
    options: {},
    command: state => (args, player) => {
      const say = message => B.sayAt(player, message);
      say("<b>" + B.center(80, 'Abilities', 'green'));
      say("<b>" + B.line(80, '=', 'green'));

      const skillsData = SkillUtil.getSkillsData(player);
      if(Object.keys(skillsData).length) {
        say("<b>" + B.center(80, 'Skills', 'green'));
        say("<b>" + B.line(80, '-', 'green'));
        B.at(player, sprintf('%-20s %-20s %-20s', 'Skill Name', 'Skill Level', 'Skill Experience'));
        say();
        for(const [ id, data ] of Object.entries(skillsData)) {
          const skill = state.SkillManager.get(id);
          if(skill) {
            B.at(player, sprintf('%-20s %-20s %-20s', skill.name, data.level, data.exp + '%'));
            say();
          }
        }
      }

      const spellsData = SkillUtil.getSpellsData(player);
      if(Object.keys(spellsData).length) {
        say("<b>" + B.center(80, 'Spells', 'green'));
        say("<b>" + B.line(80, '-', 'green'));
        B.at(player, sprintf('%-20s %-20s %-20s', 'Spell Name', 'Spell Level', 'Spell Experience'));
        say();
        for(const [ id, data ] of Object.entries(spellsData)) {
          const spell = state.SpellManager.get(id);
          if(spell) {
            B.at(player, sprintf('%-20s %-20s %-20s', spell.name, data.level, data.exp + '%'));
            say();
          }
        }
      }

      for (const [ level, abilities ] of Object.entries(player.playerClass.abilityTable)) {
        abilities.skills = abilities.skills || [];
        abilities.spells = abilities.spells || [];

        if (!abilities.skills.length && !abilities.spells.length) {
          continue;
        }

        say(`\r\n<bold>Level ${level}</bold>`);
        say(B.line(50));

        let i = 0;
        if (abilities.skills.length) {
          say('\r\n<bold>Skills</bold>');
        }

        for (let skillId of abilities.skills) {
          let skill = state.SkillManager.get(skillId);

          if (!skill) {
            Logger.error(`Invalid skill in ability table: ${player.playerClass.name}:${level}:${skillId}`);
            continue;
          }

          let name = sprintf("%-20s", skill.name);
          if (player.level >= level) {
            name = `<green>${name}</green>`;
          }
          B.at(player, name);

          if (++i % 3 === 0) {
            say();
          }
        }

        if (abilities.spells.length) {
          say('\r\n<bold>Spells</bold>');
        }

        for (let spellId of abilities.spells) {
          let spell = state.SpellManager.get(spellId);

          if (!spell) {
            Logger.error(`Invalid spell in ability table: ${player.playerClass.name}:${level}:${spellId}`);
            continue;
          }

          let name = sprintf("%-20s", spell.name);
          if (player.level >= level) {
            name = `<green>${name}</green>`;
          }
          B.at(player, name);

          if (++i % 3 === 0) {
            say();
          }
        }

        // end with a line break
        say();
      }
    }
  };
};
