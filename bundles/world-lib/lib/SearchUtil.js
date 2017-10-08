'use strict';

/**
 * General functions used to faciliate searching
 */

const srcPath = '../../../src/'

/**
 * List keywords of the list
 * @param {List} list
 * @param {Function} predicate
 * @return {Set}
 */
function listKeywordsOfList(list, predicate) {
  let keywords = new Set();
  if(!list) {
    return keywords;
  }

  for (let entity of list) {
    let key, entry;
    if (list instanceof Map) {
      [key, entry] = entity;
    } else {
      entry = entity;
    }

    if(typeof predicate === "function" && !predicate(entry)) {
      continue;
    }

    keywords.add(listKeywordsOfObject(entry));
  }

  return keywords;
}
exports.listKeywordsOfList = listKeywordsOfList;

/**
 * List keywords of the object
 * @param {Object} object
 * @return {String}
 */
function listKeywordsOfObject(object) {
  let keywords = new Set();
  if(!object) {
    return keywords;
  }

  if(object.keywords) {
    object.keywords.forEach(keyword => keywords.add(keyword));
  }

  if(object.name) {
    keywords.add(object.name);
  }

  return Array.from(keywords).join(" ");
}
exports.listKeywordsOfObject = listKeywordsOfObject;

/**
 * List keywords around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {Set}
 */
function listKeywords(player, predicate) {
    let keywords = new Set();
    if(!player || !player.room) {
      return keywords;
    }

    const room = player.room;

    listKeywordsOfList(room.items, predicate).forEach(keyword => keywords.add(keyword));
    listKeywordsOfList(room.players, predicate).forEach(keyword => keywords.add(keyword));
    listKeywordsOfList(room.npcs, predicate).forEach(keyword => keywords.add(keyword));
    listKeywordsOfList(player.inventory, predicate).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywords = listKeywords;

/**
 * List keywords of targets around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {Set}
 */
function listKeywordsOfTargets(player, predicate) {
    let keywords = new Set();
    if(!player || !player.room) {
      return keywords;
    }

    const room = player.room;

    listKeywordsOfList(room.players, predicate).forEach(keyword => keywords.add(keyword));
    listKeywordsOfList(room.npcs, predicate).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywordsOfTargets = listKeywordsOfTargets;

/**
 * List keywords of enemies around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {Set}
 */
function listKeywordsOfEnemies(player, predicate) {
    let keywords = new Set();
    if(!player || !player.room) {
      return keywords;
    }

    const room = player.room;
    const enemyPredicate = entity => {
      if(entity === player) {
        return false;
      }

      if(typeof predicate === "function") {
        return predicate(entity);
      }

      return true;
    };

    if(player.getMeta('pvp')) {
      listKeywordsOfList(room.players, enemyPredicate).forEach(keyword => keywords.add(keyword));
    }

    listKeywordsOfList(room.npcs, enemyPredicate).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywordsOfEnemies = listKeywordsOfEnemies;

/**
 * List keywords of npcs around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {Set}
 */
function listKeywordsOfNpcs(player, predicate) {
    let keywords = new Set();
    if(!player || !player.room) {
      return keywords;
    }

    const room = player.room;

    listKeywordsOfList(room.npcs, predicate).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywordsOfNpcs = listKeywordsOfNpcs;

/**
 * List keywords of players around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {Set}
 */
function listKeywordsOfPlayers(player, predicate) {
    let keywords = new Set();
    if(!player || !player.room) {
      return keywords;
    }

    const room = player.room;

    listKeywordsOfList(room.players, predicate).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywordsOfPlayers = listKeywordsOfPlayers;

/**
 * List keywords of followers around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {Set}
 */
function listKeywordsOfFollowers(player, predicate) {
    let keywords = new Set();
    if(!player || !player.room) {
      return keywords;
    }

    const room = player.room;

    listKeywordsOfList(player.followers, predicate).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywordsOfFollowers = listKeywordsOfFollowers;

/**
 * List keywords of the items around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {Set}
 */
function listKeywordsOfItems(player, predicate) {
    let keywords = new Set();
    if(!player || !player.room) {
      return keywords;
    }

    const room = player.room;

    listKeywordsOfList(room.items, predicate).forEach(keyword => keywords.add(keyword));
    listKeywordsOfList(player.inventory, predicate).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywordsOfItems = listKeywordsOfItems;

/**
 * List keywords of the all items including equipment around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {Set}
 */
function listKeywordsOfAllItems(player, predicate) {
    let keywords = new Set();
    if(!player || !player.room) {
      return keywords;
    }

    const room = player.room;

    listKeywordsOfList(room.items, predicate).forEach(keyword => keywords.add(keyword));
    listKeywordsOfList(player.inventory, predicate).forEach(keyword => keywords.add(keyword));
    listKeywordsOfList(player.equipment, predicate).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywordsOfAllItems = listKeywordsOfAllItems;

/**
 * List keywords of the items in the room around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {Set}
 */
function listKeywordsOfRoomItems(player, predicate) {
    let keywords = new Set();
    if(!player || !player.room) {
      return keywords;
    }

    const room = player.room;

    listKeywordsOfList(room.items, predicate).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywordsOfRoomItems = listKeywordsOfRoomItems;

/**
 * List keywords of the items in the inventory around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {Set}
 */
function listKeywordsOfInventoryItems(player, predicate) {
    let keywords = new Set();
    if(!player || !player.room) {
      return keywords;
    }

    const room = player.room;

    listKeywordsOfList(player.inventory, predicate).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywordsOfInventoryItems = listKeywordsOfInventoryItems;

/**
 * List keywords of the equipment items around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {Set}
 */
function listKeywordsOfEquipmentItems(player, predicate) {
    let keywords = new Set();
    if(!player || !player.room) {
      return keywords;
    }

    const room = player.room;

    listKeywordsOfList(player.equipment, predicate).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywordsOfEquipmentItems = listKeywordsOfEquipmentItems;

/**
 * List the exit names of the room around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {Set}
 */
function listExitNames(player, predicate) {
    let names = new Set();
    if(!player || !player.room) {
      return names;
    }

    const room = player.room;

    Array.from(room.exits).forEach(exit => {
      if(exit.direction) {
        if(typeof predicate === "function" && !predicate(exit)) {
          return;
        }
        names.add(exit.direction);
      }
    });

    if(room.coordinates) {
      const coords = room.coordinates;
      const area = room.area;
      const directions = {
        north: [0, 1, 0],
        south: [0, -1, 0],
        east: [1, 0, 0],
        west: [-1, 0, 0],
        up: [0, 0, 1],
        down: [0, 0, -1],
      };

      for (const [dir, diff] of Object.entries(directions)) {
        let nextRoom = area.getRoomAtCoordinates(coords.x + diff[0], coords.y + diff[1], coords.z + diff[2]);
        if(nextRoom) {
          names.add(dir);
        }
      }
    }

    return names;
}
exports.listExitNames = listExitNames;

/**
 * List the skill ids of the player
 * @param {Player} player
 * @param {State} state
 * @param {Function} predicate
 * @return {Set}
 */
function listSkillIds(player, state, predicate) {
    let ids = new Set();
    if(!player || !player.room) {
      return ids;
    }

    for(const [ level, abilities ] of Object.entries(player.playerClass.abilityTable)) {
      abilities.skills = abilities.skills || [];
      for(let skillId of abilities.skills) {
        let skill = state.SkillManager.get(skillId);
        if(skill) {
          if(typeof predicate === "function" && !predicate(skill)) {
            continue;
          }

          ids.add(skill.id);
        }
      }
    }

    return ids;
}
exports.listSkillIds = listSkillIds;

/**
 * List the spell ids of the player
 * @param {Player} player
 * @param {State} state
 * @param {Function} predicate
 * @return {Set}
 */
function listSpellIds(player, state, predicate) {
    let ids = new Set();
    if(!player || !player.room) {
      return ids;
    }

    for(const [ level, abilities ] of Object.entries(player.playerClass.abilityTable)) {
      abilities.spells = abilities.spells || [];
      for(let spellId of abilities.spells) {
        let spell = state.SpellManager.get(spellId);
        if(spell) {
          if(typeof predicate === "function" && !predicate(spell)) {
            continue;
          }

          ids.add(spell.id);
        }
      }
    }

    return ids;
}
exports.listSpellIds = listSpellIds;
