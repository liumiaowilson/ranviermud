'use strict';

/**
 * General functions used to faciliate searching
 */

const srcPath = '../../../src/'

/**
 * List keywords of the list
 * @param List list
 * @return List
 */
function listKeywordsOfList(list) {
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

    if(entry.keywords) {
      entry.keywords.forEach(keyword => keywords.add(keyword));
    }

    if(entry.name) {
      keywords.add(entry.name);
    }
  }

  return keywords;
}
exports.listKeywordsOfList = listKeywordsOfList;

/**
 * List keywords around the player
 * @param {Player} player
 * @return List
 */
function listKeywords(player) {
    let keywords = new Set();
    if(!player) {
      return keywords;
    }

    const room = player.room;

    listKeywordsOfList(room.items).forEach(keyword => keywords.add(keyword));
    listKeywordsOfList(room.players).forEach(keyword => keywords.add(keyword));
    listKeywordsOfList(room.npcs).forEach(keyword => keywords.add(keyword));
    listKeywordsOfList(player.inventory).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywords = listKeywords;

/**
 * List keywords of the items around the player
 * @param {Player} player
 * @return List
 */
function listKeywordsOfItems(player) {
    let keywords = new Set();
    if(!player) {
      return keywords;
    }

    const room = player.room;

    listKeywordsOfList(room.items).forEach(keyword => keywords.add(keyword));
    listKeywordsOfList(player.inventory).forEach(keyword => keywords.add(keyword));

    return keywords;
}
exports.listKeywordsOfItems = listKeywordsOfItems;

/**
 * break down the words
 * @param {List} words
 * @return List
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
