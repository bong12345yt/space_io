const ObjectClass = require('./object');
const Constants = require('../shared/constants');
const Animation = require('./animation');
const shortid = require('shortid');

class Planet extends ObjectClass {
  constructor(x, y, dir) {
    super(shortid(),x, y, dir);
    this.radius = Constants.EXPLOSION_RADIUS;
    this.parentID = null;
    this.anim = new Animation();
    this.anim.FrameRate = 1000;
    this.anim.FramesLimit = 12;
    this.anim.Oscillate = false;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    this.anim.OnAnimate();
    return false;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      //direction: this.direction,
      current_frame: this.anim.CurrentFrame,     
    };
  }
}

module.exports = Planet;
