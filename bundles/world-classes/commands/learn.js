'use strict';

const sprintf = require('sprintf-js').sprintf;

module.exports = (srcPath, bundlesPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const SearchUtil = require(bundlesPath + 'world-lib/lib/SearchUtil');
  const CommandParser = require(srcPath + 'CommandParser').CommandParser;
  const SkillUtil = require(bundlesPath + 'world-lib/lib/SkillUtil');

  return {
    usage: "learn <tutor> [skill/spell]",
    options: (state, player) => {
      let options = {};

      if(player.room) {
        Array.from(player.room.npcs).forEach(npc => {
          const tutorConfig = npc.getBehavior('tutor');
          if(tutorConfig) {
            let tutorOptions = {};
            if(tutorConfig.skills) {
              for(const [ name, config ] of Object.entries(tutorConfig.skills)) {
                tutorOptions[name] = {};
              }
            }
            if(tutorConfig.spells) {
              for(const [ name, config ] of Object.entries(tutorConfig.spells)) {
                tutorOptions[name] = {};
              }
            }
            let keyword = SearchUtil.listKeywordsOfObject(npc);
            options[keyword] = tutorOptions;
          }
        });
      }

      return options;
    },
    command : state => (args, player) => {
      const say = message => Broadcast.sayAt(player, message);

      const [ tutorName, abilityName ] = args.split(" ");
      if(!tutorName) {
        return say('Learn from which tutor?');
      }

      if(!player.room) {
        return say("You are deep in the void.");
      }

      const tutor = CommandParser.parseDot(tutorName, player.room.npcs);
      if(!tutor || !tutor.getBehavior('tutor')) {
        return say("Cannot find a tutor.");
      }

      const tutorConfig = tutor.getBehavior('tutor');
      if(!abilityName) {
        say("<b>" + Broadcast.center(80, 'Abilities to Teach', 'green'));
        say("<b>" + Broadcast.line(80, '=', 'green'));

        const skillsConfig = tutorConfig.skills;
        const skillsData = SkillUtil.getSkillsData(player);
        if(skillsConfig && Object.keys(skillsConfig).length) {
          say("<b>" + Broadcast.center(80, 'Skills', 'green'));
          say("<b>" + Broadcast.line(80, '-', 'green'));
          Broadcast.at(player, sprintf('%-20s%-20s%-20s%-20s', 'Skill ID', 'Skill Name', 'Max Level', 'Cost'));
          say();
          for(const [ id, config ] of Object.entries(skillsConfig)) {
            const skillData = skillsData[id];
            if(skillData && skillData.level >= config.level) {
              continue;
            }

            const skill = state.SkillManager.get(id);
            if(skill) {
              Broadcast.at(player, sprintf('%-20s%-20s%-20s%-20s', skill.id, skill.name, config.level, config.cost + ' ' + friendlyCurrencyName(config.currency)));
              say();
              Broadcast.at(player, skill.info(player));
              say();
            }
          }
        }

        const spellsConfig = tutorConfig.spells;
        const spellsData = SkillUtil.getSpellsData(player);
        if(spellsConfig && Object.keys(spellsConfig).length) {
          say("<b>" + Broadcast.center(80, 'Spells', 'green'));
          say("<b>" + Broadcast.line(80, '-', 'green'));
          Broadcast.at(player, sprintf('%-20s%-20s%-20s%-20s', 'Spell ID', 'Spell Name', 'Max Level', 'Cost'));
          say();
          for(const [ id, config ] of Object.entries(spellsConfig)) {
            const spellData = spellsData[id];
            if(spellData && spellData.level >= config.level) {
              continue;
            }

            const spell = state.SpellManager.get(id);
            if(spell) {
              Broadcast.at(player, sprintf('%-20s%-20s%-20s%-20s', spell.id, spell.name, config.level, config.cost + ' ' + friendlyCurrencyName(config.currency)));
              say();
              Broadcast.at(player, spell.info(player));
              say();
            }
          }
        }
      }
      else {
        const abilityConfig = getAbilityConfig(tutorConfig, abilityName);
        if(!abilityConfig) {
          return say(`Cannot teach you ${abilityName}.`);
        }

        const currencyKey = 'currencies.' + abilityConfig.currency;
        const playerCurrency = player.getMeta(currencyKey) || 0;
        if (playerCurrency < abilityConfig.cost) {
          return say(`You can't afford that, it costs ${abilityConfig.cost} ${friendlyCurrencyName(abilityConfig.currency)}.`);
        }

        if(tutorConfig.skills && tutorConfig.skills[abilityName]) {
          const skill = state.SkillManager.get(abilityName);
          if(!skill) {
            return say(`Cannot teach you skill ${abilityName}.`);
          }

          SkillUtil.acquireSkill(player, skill);
          say(`You successfully learned ${skill.name}.`);
        }
        else if(tutorConfig.spells && tutorConfig.spells[abilityName]) {
          const spell = state.SpellManager.get(abilityName);
          if(!spell) {
            return say(`Cannot teach you spell ${abilityName}.`);
          }

          SkillUtil.acquireSpell(player, spell);
          say(`You successfully learned ${spell.name}.`);
        }
        else {
          return say(`Nothing to teach you.`);
        }

        player.setMeta(currencyKey, playerCurrency - abilityConfig.cost);
        player.save();
      }
    }
  };

  function friendlyCurrencyName(currency) {
    return currency
      .replace('_', ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
    ;
  }

  function getAbilityConfig(tutorConfig, abilityName) {
    let config;
    if(tutorConfig.skills) {
      config = tutorConfig.skills[abilityName];
    }

    if(!config && tutorConfig.spells) {
      config = tutorConfig.spells[abilityName];
    }

    return config;
  }
};
