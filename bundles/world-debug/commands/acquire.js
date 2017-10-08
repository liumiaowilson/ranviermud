'use strict';

module.exports = (srcPath, bundlesPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const PlayerRoles = require(srcPath + 'PlayerRoles');
  const SkillUtil = require(bundlesPath + 'world-lib/lib/SkillUtil');

  return {
    requiredRole: PlayerRoles.ADMIN,
    usage: "acquire <skill/spell> <name>",
    options: (state, player) => {
      let options = {};
      let skillOptions = {};
      for(const [ name, skill ] of state.SkillManager.skills) {
        skillOptions[skill.id] = {};
      }
      let spellOptions = {};
      for(const [ name, spell ] of state.SpellManager.skills) {
        spellOptions[spell.id] = {};
      }
      options["skill"] = skillOptions;
      options["spell"] = spellOptions;

      return options;
    },
    command: (state) => (args, player) => {
      const [ type, name ] = args.split(" ");
      if(type === 'skill') {
        const skill = state.SkillManager.get(name);
        if (!skill) {
          return Broadcast.sayAt(player, "No such skill.");
        }

        let ret = SkillUtil.acquireSkill(player, skill);
        if(ret) {
          return Broadcast.sayAt(player, ret);
        }
        else {
          skill.activate(player);
        }
      }
      else if(type === 'spell') {
        const spell = state.SpellManager.get(name);
        if (!spell) {
          return Broadcast.sayAt(player, "No such spell.");
        }

        let ret = SkillUtil.acquireSpell(player, spell);
        if(ret) {
          return Broadcast.sayAt(player, ret);
        }
      }
      else {
        Broadcast.sayAt(player, "Invalid type.");
      }
    }
  };
};
