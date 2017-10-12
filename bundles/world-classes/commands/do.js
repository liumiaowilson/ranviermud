'use strict';

module.exports = (srcPath, bundlesPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const SearchUtil = require(bundlesPath + 'world-lib/lib/SearchUtil');

  return {
    usage: "do <skill> <target>",
    resource: {
      attribute: 'stamina',
      cost: 5,
    },
    options: (state, player) => {
      let options = {};
      SearchUtil.listSkillIds(player, state).forEach(skillId => {
        let skill = state.SkillManager.get(skillId);
        if(typeof skill.commandOptions === "function") {
          options[skillId] = skill.commandOptions(state, player);
        }
        else {
          options[skillId] = skill.commandOptions;
        }
      });

      return options;
    },
    command : state => (args, player) => {
      const [skillName, targetArgs] = args.split(' ');
      const skill = state.SkillManager.find(skillName);

      if (!skill) {
        return Broadcast.sayAt(player, "No such skill.");
      }

      player.queueCommand({
        execute: _ => {
          player.emit('useAbility', skill, targetArgs);
        },
        label: `do ${args}`,
      }, skill.lag || state.Config.get('skillLag') || 1000);

      return true;
    }
  };
};
