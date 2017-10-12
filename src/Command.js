'use strict';

const CommandType = require('./CommandType');
const PlayerRoles = require('./PlayerRoles');
const Broadcast = require('./Broadcast');
const Damage = require('./Damage');

/**
 * In game command. See the {@link http://ranviermud.com/extending/commands/|Command guide}
 * @property {string} bundle Bundle this command came from
 * @property {CommandType} type
 * @property {string} name
 * @property {function} func Actual function that gets run when the command is executed
 * @property {Array<string>} aliases
 * @property {string} usage
 * @property {PlayerRoles} requiredRole
 */
class Command {
  /**
   * @param {string} bundle Bundle the command came from
   * @param {string} name   Name of the command
   * @param {object} def
   * @param {CommandType} def.type=CommandType.COMMAND
   * @param {function} def.command
   * @param {Array<string>} def.aliases
   * @param {string} def.usage=this.name
   * @param {PlayerRoles} requiredRole=PlayerRoles.PLAYER
   * @param {string} file File the command comes from
   */
  constructor(bundle, name, def, file) {
    this.bundle = bundle;
    this.type = def.type || CommandType.COMMAND;
    this.name = name;
    this.func = def.command;
    this.aliases = def.aliases;
    this.usage = def.usage || this.name;
    this.options = def.options || {};
    this.requiredRole = def.requiredRole || PlayerRoles.PLAYER;
    this.file = file;
    this.resource = def.resource || {
      attribute: 'stamina',
      cost: 0,
    };
  }

  /**
   * @param {string} args   A string representing anything after the command itself from what the user typed
   * @param {Player} player Player that executed the command
   * @param {string} arg0   The actual command the user typed, useful when checking which alias was used for a command
   * @return {*}
   */
  execute(args, player, arg0) {
    if(this.hasEnoughResources(player)) {
      const ret = this.func(args, player, arg0);
      if(ret === true) {
        this.payResourceCosts(player);
      }
      return ret;
    }
    else {
      return Broadcast.sayAt(player, '<red>You do not have enough resources!</red>');
    }
  }

  /**
   * @param {Player} player
   * @return {boolean}
   */
  hasEnoughResources(player) {
    if (Array.isArray(this.resource)) {
      return this.resource.every((resource) => this.hasEnoughResource(player, resource));
    }
    return this.hasEnoughResource(player, this.resource);
  }

  /**
   * @param {Player} player
   * @param {{ attribute: string, cost: number}} resource
   * @return {boolean}
   */
  hasEnoughResource(player, resource) {
    return !resource.cost || (
      player.hasAttribute(resource.attribute) &&
      player.getAttribute(resource.attribute) >= resource.cost
    );
  }

  /**
   * @param {Player} player
   * @return {boolean} If the player has paid the resource cost(s).
   */
  payResourceCosts(player) {
    const hasMultipleResourceCosts = Array.isArray(this.resource);
    if (hasMultipleResourceCosts) {
      for (const resourceCost of this.resource) {
        this.payResourceCost(player, resourceCost);
      }
      return true;
    }

    return this.payResourceCost(player, this.resource);
  }

  // Helper to pay a single resource cost.
  payResourceCost(player, resource) {
    // Resource cost is calculated as damage so effects could potentially reduce resource costs
    const damage = new Damage({
      attribute: resource.attribute,
      amount: resource.cost,
      attacker: null,
      hidden: true,
      source: this
    });

    damage.commit(player);
  }
}

module.exports = Command;
