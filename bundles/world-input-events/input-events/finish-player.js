'use strict';

/**
 * Finish player creation. Add the character to the account then add the player
 * to the game world
 */
module.exports = (srcPath) => {
  const EventUtil = require(srcPath + 'EventUtil');
  const Player = require(srcPath + 'Player');
  const RandomUtil = require(srcPath + 'RandomUtil');
  const Logger = require(srcPath + 'Logger');

  return {
    event: state => (socket, args) => {
      const raceId = 'human';

      let player = new Player({
        name: args.name,
        gender: args.gender || "male",
        age: args.age || 18,
        account: args.account,
        prompt: '[ %health.current%/%health.max% <b>hp</b> %energy.current%/%energy.max% <b>energy</b> ]',
        // TIP:DefaultAttributes: This is where you can change the default attributes for players
        attributes: {
        }
      });

      args.account.addCharacter(args.name);
      args.account.save();

      player.setMeta('class', args.playerClass);
      player.raceId = raceId;
      const race = state.RaceManager.get(raceId);
      race.setupCharacter(player);

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
