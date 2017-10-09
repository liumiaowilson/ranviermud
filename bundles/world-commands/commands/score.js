'use strict';

const sprintf = require('sprintf-js').sprintf;
const Combat = require('../../world-combat/lib/Combat');

module.exports = (srcPath) => {
  const B = require(srcPath + 'Broadcast');

  return {
    aliases: [ 'stats' ],
    options: {},
    command : (state) => (args, p) => {
      const say = message => B.sayAt(p, message);

      say('<b>' + B.center(60, `${p.name}, level ${p.level}, ${p.gender}, ${p.age}`, 'green'));
      say('<b>' + B.line(60, '-', 'green'));

      let stats = {
        constitution: 0,
        strength: 0,
        agility: 0,
        perception: 0,
        intellect: 0,
        magic: 0,
        will: 0,
        charisma: 0,

        stamina: 0,
        armor: 0,
        health: 0,
        critical: 0,
        fame: 0,
        karma: 0,
        sanity: 0,
      };

      for (const stat in stats) {
        stats[stat] = {
          current: p.getAttribute(stat),
          base: p.getBaseAttribute(stat),
          max: p.getMaxAttribute(stat),
        };
      }

      B.at(p, sprintf(' %-9s: %12s', 'Health', `${stats.health.current}/${stats.health.max}`));
      say('<b><green>' + sprintf(
        '%36s',
        'Weapon '
      ));

      // class resource
      switch (p.playerClass.id) {
        case 'warrior':
          const energy = {
            current: p.getAttribute('energy'),
            max: p.getMaxAttribute('energy')
          };
          B.at(p, sprintf(' %-9s: %12s', 'Energy', `${energy.current}/${energy.max}`));
          break;
        default:
          B.at(p, B.line(24, ' '));
          break;
      }
      say(sprintf('%35s', '.' + B.line(22)) + '.');

      B.at(p, sprintf(' %-9s: %12s', 'Stamina', `${stats.stamina.current}/${stats.stamina.max}`));

      B.at(p, sprintf('%13s', '|'));
      const weaponDamage = Combat.getWeaponDamage(p);
      const min = Combat.normalizeWeaponDamage(p, weaponDamage.min);
      const max = Combat.normalizeWeaponDamage(p, weaponDamage.max);
      say(sprintf(' %6s:<b>%5s</b> - <b>%-5s</b> |', 'Damage', min, max));
      B.at(p, sprintf('%37s', '|'));
      say(sprintf(' %6s: <b>%12s</b> |', 'Speed', B.center(12, Combat.getWeaponSpeed(p) + ' sec')));

      say(sprintf('%60s', "'" + B.line(22) + "'"));

      say('<b><green>' + sprintf(
        '%-24s',
        ' Stats'
      ) + '</green></b>');
      say('.' + B.line(25) + '.');


      const printStat = (stat, newline = true) => {
        const val = stats[stat];
        const statColor = (val.current > val.base ? 'green' : 'white');
        const str = sprintf(
          `| %-12s : <b><${statColor}>%8s</${statColor}></b> |`,
          stat[0].toUpperCase() + stat.slice(1),
          val.current
        );

        if (newline) {
          say(str);
        } else {
          B.at(p, str);
        }
      };

      printStat('constitution', false); // left
      say('<b><green>' + sprintf('%33s', 'Gold ')); // right
      printStat('strength', false); // left
      say(sprintf('%33s', '.' + B.line(12) + '.')); // right
      printStat('agility', false); // left
      say(sprintf('%19s| <b>%10s</b> |', '', p.getMeta('currencies.gold') || 0)); // right
      printStat('perception', false); // left
      say(sprintf('%33s', "'" + B.line(12) + "'")); // right
      printStat('intellect', false); // left
      say('<b><green>' + sprintf('%33s', 'Medal ')); // right
      printStat('magic', false); // left
      say(sprintf('%33s', '.' + B.line(12) + '.')); // right
      printStat('will', false); // left
      say(sprintf('%19s| <b>%10s</b> |', '', p.getMeta('currencies.medal') || 0)); // right
      printStat('charisma', false); // left
      say(sprintf('%33s', "'" + B.line(12) + "'")); // right

      say(':' + B.line(25) + ':');
      printStat('armor');
      printStat('critical');
      say(':' + B.line(25) + ':');
      printStat('fame');
      printStat('karma');
      printStat('sanity');
      say("'" + B.line(25) + "'");
    }
  };
};
