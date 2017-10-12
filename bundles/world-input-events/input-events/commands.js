'use strict';

/**
 * Main command loop. All player input after login goes through here.
 * If you want to swap out the command parser this is the place to do it
 */
module.exports = (src) => {
  const { CommandParser, InvalidCommandError, RestrictedCommandError } = require(src + 'CommandParser');
  const PlayerRoles = require(src + 'PlayerRoles');
  const CommandTypes = require(src + 'CommandType');
  const Broadcast = require(src + 'Broadcast');
  const Logger = require(src + 'Logger');

  return {
    event: state => player => {
      player.socket.once('data', data => {
        function loop () {
          player.socket.emit('commands', player);
        }
        data = data.toString().trim();

        if (!data.length) {
          return loop();
        }

        player._lastCommandTime = Date.now();

        try {
          const result = CommandParser.parse(state, data, player);
          if (!result) {
            throw null;
          }
          switch (result.type) {
            case CommandTypes.COMMAND: {
              const { requiredRole = PlayerRoles.PLAYER } = result.command;
              if (requiredRole > player.role) {
                throw new RestrictedCommandError();
              }
              // commands have no lag and are not queued, just immediately execute them
              result.command.execute(result.args, player, result.originalCommand);
              break;
            }
            case CommandTypes.CHANNEL: {
              if (result.channel.minRequiredRole !== null && result.channel.minRequiredRole > player.role) {
                throw new RestrictedCommandError();
              }
              // same with channels
              result.channel.send(state, player, result.args);
              break;
            }
            case CommandTypes.SKILL: {
              state.CommandManager.get('do').execute(result.skill.id + ' ' + result.args, player);
              break;
            }
          }
        } catch (error) {
          switch(true) {
            case error instanceof InvalidCommandError:
              // check to see if room has a matching context-specific command
              const roomCommands = player.room.getBehavior('commands');
              const [commandName, ...args] = data.split(' ');
              if (roomCommands && roomCommands.includes(commandName)) {
                player.room.emit('command', player, commandName, args.join(' '));
              } else {
                Broadcast.sayAt(player, "Huh?");
                Logger.warn(`WARNING: Player tried non-existent command '${data}'`);
              }
              break;
            case error instanceof RestrictedCommandError:
              Broadcast.sayAt(player, "You can't do that.");
              break;
            default:
              Logger.error(error);
          }
        }

        Broadcast.prompt(player);
        loop();
      });
    }
  };
};
