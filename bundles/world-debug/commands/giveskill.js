'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const SkillFlag = require(srcPath + 'SkillFlag');
  const PlayerRoles = require(srcPath + 'PlayerRoles');

  return {
    requiredRole: PlayerRoles.ADMIN,
    usage: "giveskill <name>",
    options: (state, player) => {
      let options = {};
      for(const [ name, skill ] of state.SkillManager.skills) {
        if(skill.flags.includes(SkillFlag.PASSIVE)) {
          options[skill.id] = {};
        }
      }

      return options;
    },
    command: (state) => (args, player) => {
      if (!args.length) {
        return Broadcast.sayAt(player, 'Give a passive skill. giveskill <name>');
      }

      const skill = state.SkillManager.get(args);
      if (!skill) {
        return Broadcast.sayAt(player, "No such skill.");
      }

      if (!skill.flags.includes(SkillFlag.PASSIVE)) {
        return Broadcast.sayAt(player, "Skill is not passive.");
      }

      skill.activate(player);
    }
  };
};
