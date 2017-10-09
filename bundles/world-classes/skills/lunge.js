'use strict';

const Combat = require('../../world-combat/lib/Combat');

/**
 * Basic warrior attack
 */
module.exports = (srcPath, bundlesPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Damage = require(srcPath + 'Damage');
  const SkillType = require(srcPath + 'SkillType');
  const SearchUtil = require(bundlesPath + 'world-lib/lib/SearchUtil');
  const SkillUtil = require(bundlesPath + 'world-lib/lib/SkillUtil');

  const damagePercent = 150;
  const energyCost = 20;

  function getDamage(player, skill) {
    return Combat.calculateWeaponDamage(player) * (damagePercent / 100) * SkillUtil.getSkillMagnifier(player, skill);
  }

  return {
    name: '冲击',
    type: SkillType.SKILL,
    requiresTarget: true,
    initiatesCombat: true,
    resource: {
      attribute: 'energy',
      cost: energyCost,
    },
    cooldown: 6,

    commandOptions: (state, player) => {
      let options = {};
      SearchUtil.listKeywordsOfEnemies(player).forEach(keyword => options[keyword] = {});

      return options;
    },

    run: state => function (args, player, target) {
      const damage = new Damage({
        attribute: 'health',
        amount: getDamage(player, this),
        attacker: player,
        type: 'physical',
        source: this
      });

      Broadcast.sayAt(player, '<red>你一个猛冲，使出了有力的一击!</red>');
      Broadcast.sayAtExcept(player.room, `<red>${player.name}狠狠地冲击了${target.name}!</red>`, [player, target]);
      if (!target.isNpc) {
        Broadcast.sayAt(target, `<red>${player.name}狠狠地冲击了你!</red>`);
      }
      damage.commit(target);
    },

    info: (player) => {
      return `对你的目标作出凶猛的冲击，并且造成<bold>${damagePercent}%</bold>的武器伤害.`;
    }
  };
};
