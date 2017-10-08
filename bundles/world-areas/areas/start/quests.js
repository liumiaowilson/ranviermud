'use strict';

const FetchGoal = require('../../../world-quests/lib/FetchGoal');
const EquipGoal = require('../../../world-quests/lib/EquipGoal');
const KillGoal = require('../../../world-quests/lib/KillGoal');
const LevelUtil = require('../../../world-lib/lib/LevelUtil');

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const say = Broadcast.sayAt;

  return {
    "quest_new_journey": {
      config: {
        title: "新的征途开始啦",
        level: 1,
        desc: `欢迎来到这个世界，年轻人. 武装好你自己吧，因为这个世界很危险.

 - 用'<white>open chest</white>'打开箱子
 - 用'<white>get chest sword</white>'和'<white>get chest vest</white>'拿到一些装备.
 - 用'<white>wield sword</white>'和'<white>wear vest</white>'来武装自己吧`,
        autoComplete: true,
        reward: (quest, player) => {
          player.emit('experience', LevelUtil.mobExp(quest.config.level) * 5);
          say(player, `<b><cyan>提示: 你可以使用'<white>tnl</white>'或'<white>level</white>'来查看你需要多少经验升到下一级.</cyan>`, 80);

          say(player);
          say(
            player,
            `<b><yellow>有个小孩可能需要帮忙, 用'<white>quest list toddler</white>'来看看你有什么可以帮他的. 用'<white>quest start toddler 1</white>'来接受任务.</yellow></b>`,
            80
          );
          say(player);
          say(player, `<b><cyan>提示: 使用'<white>look</white>'来查看，在命令行中打<white>[Exits: ...]</white>中的方向来移动.</cyan>`, 80);
        }
      },
      goals: [
        {
          type: FetchGoal,
          config: { title: '拿到武器', count: 1, item: "start:item_rusty_sword" }
        },
        {
          type: FetchGoal,
          config: { title: '拿到防具', count: 1, item: "start:item_leather_vest" }
        },
        {
          type: EquipGoal,
          config: { title: '使用武器', slot: 'wield' }
        },
        {
          type: EquipGoal,
          config: { title: '穿上防具', slot: 'chest' }
        }
      ]
    },

    "quest_find_my_meat": {
      config: {
        title: "我的肉在哪?",
        level: 1,
        desc: `这个小毛孩想找到他丢失的一块肉.

找到这块肉后带给他, 用'<white>quest log</white>'找到任务编号, 用'<white>quest complete #</white>'来完成任务.`,
        repeatable: true,
        reward: (quest, player) => {
          player.emit('experience', LevelUtil.mobExp(quest.config.level) * 3);
          say(player);
          say(player, `<b><cyan>提示: 有任务发布的NPC会在他们的名字前面显示<white>[</white><yellow>!</yellow><white>]</white>, <white>[</white><yellow>?</yellow><white>]</white>意味着你的任务已经可以确认完成, <white>[</white><yellow>%</yellow><white>]</white>意味着你有正在进行的任务.</cyan>`, 80);
        }
      },
      goals: [
        {
          type: FetchGoal,
          config: {
            title: '找到脏脏的肉',
            count: 1,
            item: "start:item_dirty_meat",
            removeItem: true,
          }
        }
      ]
    },

    "quest_self_defense": {
      config: {
        title: "防身技能入门",
        level: 2,
        requires: [ "start:quest_new_journey" ],
        autoComplete: true,
        desc: `现在该开始学习如何防身了. 那边有一些野猪可以给你练习.

- 用'<white>attack boar</white>'来开始攻击野猪
- 一旦你杀了它，它会爆出一些物品. 使用'<white>look corpse</white>'来检查，或'<white>get corpse all</white>'来拿走所有的.`,
        reward: (quest, player) => {
          player.emit('experience', LevelUtil.mobExp(quest.config.level) * 5);

          say(player, `<b><cyan>提示: 用'<white>get corpse <item></white>'来取走物品，不过要快，因为尸体会腐烂的.</cyan>`, 80);
        }
      },
      goals: [
        {
          type: KillGoal,
          config: { title: "杀死野猪", npc: "start:npc_boar", count: 3 }
        }
      ]
    }
  };
};
