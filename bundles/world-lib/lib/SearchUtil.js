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
    if(!player) {
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
    if(!player) {
      return keywords;
    }

    const room = player.room;

    listKeywordsOfList(room.players, predicate).forEach(keyword => keywords.add(keyword));
    listKeywordsOfList(room.npcs, predicate).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywordsOfTargets = listKeywordsOfTargets;

/**
 * List keywords of the items around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {Set}
 */
function listKeywordsOfItems(player, predicate) {
    let keywords = new Set();
    if(!player) {
      return keywords;
    }

    const room = player.room;

    listKeywordsOfList(room.items, predicate).forEach(keyword => keywords.add(keyword));
    listKeywordsOfList(player.inventory, predicate).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywordsOfItems = listKeywordsOfItems;

/**
 * List keywords of the items in the room around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {Set}
 */
function listKeywordsOfRoomItems(player, predicate) {
    let keywords = new Set();
    if(!player) {
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
    if(!player) {
      return keywords;
    }

    const room = player.room;

    listKeywordsOfList(player.inventory, predicate).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywordsOfInventoryItems = listKeywordsOfInventoryItems;

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

    Array.from(player.room.exits).forEach(exit => {
      if(exit.direction) {
        if(typeof predicate === "function" && !predicate(exit)) {
          return;
        }
        names.add(exit.direction);
      }
    });

    return names;
}
exports.listExitNames = listExitNames;
