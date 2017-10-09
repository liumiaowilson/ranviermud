'use strict';

/**
 * Player class selection event
 */
module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const EventUtil = require(srcPath + 'EventUtil');
  const Config     = require(srcPath + 'Config');

  return {
    event: state => (socket, args) => {
      const say = EventUtil.genSay(socket);
      const write  = EventUtil.genWrite(socket);

      /*
      Player selection menu:
      * Can select existing player
      * Can create new (if less than 3 living chars)
      */
      say('  Pick your gender');
      say(' --------------------------');
      const genders = ["male", "female"];
      for (const gender of genders) {
        say(`[<bold>${gender}</bold>]`);
      }
      write('> ');

      socket.once('data', choice => {
        choice = choice.toString().trim();
        choice = genders.find((gender) => {
          return gender.toLowerCase().startsWith(choice);
        });

        if (!choice) {
          return socket.emit('choose-gender', socket, args);
        }

        args.gender = choice;
        socket.emit('finish-player', socket, args);
      });
    }
  };
};
