'use strict';

/**
 * Finish player creation. Add the character to the account then add the player
 * to the game world
 */
module.exports = (srcPath) => {
  const EventUtil = require(srcPath + 'EventUtil');
  const Player = require(srcPath + 'Player');
  const RandomUtil = require(srcPath + 'RandomUtil');

  return {
    event: state => (socket, args) => {
      let player = new Player({
        name: args.name,
        account: args.account,
        // TIP:DefaultAttributes: This is where you can change the default attributes for players
        attributes: {
          health: 90 + RandomUtil.roll(4, 5),

          constitution: 5 + RandomUtil.roll(4, 5),
          strength: 5 + RandomUtil.roll(4, 5),
          agility: 5 + RandomUtil.roll(4, 5),
          perception: 5 + RandomUtil.roll(4, 5),
          intellect: 5 + RandomUtil.roll(4, 5),
          magic: 5 + RandomUtil.roll(4, 5),
          will: 5 + RandomUtil.roll(4, 5),
          charisma: 5 + RandomUtil.roll(4, 5),

          stamina: 90 + RandomUtil.roll(4, 5),
          armor: 0,
          critical: 0
        }
      });

      args.account.addCharacter(args.name);
      args.account.save();

      player.setMeta('class', args.playerClass);

      const room = state.RoomManager.startingRoom;
      player.room = room;
      player.save();

      // reload from manager so events are set
      player = state.PlayerManager.loadPlayer(state, player.account, player.name);
      player.socket = socket;

      socket.emit('done', socket, { player });
    }
  };
};
