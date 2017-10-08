'use strict';

module.exports = (srcPath, bundlesPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const SearchUtil = require(bundlesPath + 'world-lib/lib/SearchUtil');

  return {
    usage: "cast <spell> <target>",
    options: (state, player) => {
      let options = {};
      SearchUtil.listSpellIds(player, state).forEach(spellId => {
        let spell = state.SpellManager.get(spellId);
        if(typeof spell.commandOptions === "function") {
          options[spellId] = spell.commandOptions(state, player);
        }
        else {
          options[spellId] = spell.commandOptions;
        }
      });

      return options;
    },
    command : state => (args, player) => {
      const [spellName, targetArgs] = args.split(' ');
      const spell = state.SpellManager.find(spellName);

      if (!spell) {
        return Broadcast.sayAt(player, "No such spell.");
      }

      player.queueCommand({
        execute: _ => {
          player.emit('useAbility', spell, targetArgs);
        },
        label: `cast ${args}`,
      }, spell.lag || state.Config.get('skillLag') || 1000);
    }
  };
};
