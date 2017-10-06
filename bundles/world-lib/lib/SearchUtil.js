'use strict';

/**
 * General functions used to faciliate searching
 */

const srcPath = '../../../src/'

/**
 * List keywords of the list
 * @param {List} list
 * @param {Function} predicate
 * @return {List}
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

    listKeywordsOfObject(entry).forEach(keyword => keywords.add(keyword));
  }

  return keywords;
}
exports.listKeywordsOfList = listKeywordsOfList;

/**
 * List keywords of the object
 * @param {Object} object
 * @return {List}
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

  return keywords;
}
exports.listKeywordsOfObject = listKeywordsOfObject;

/**
 * List keywords around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {List}
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
 * List keywords of the items around the player
 * @param {Player} player
 * @param {Function} predicate
 * @return {List}
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
 * @return {List}
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
 * break down the words
 * @param {List} words
 * @return {List}
 */
function breakDown(words) {
    let ret = new Set();
    if(!words) {
      return ret;
    }

    words.forEach(word => {
      if(word) {
        word.split(" ").forEach(item => {
          if(item) {
            item = item.trim().toLowerCase();
            ret.add(item);
          }
        });
      }
    });

    return ret;
}
exports.breakDown = breakDown;
