(function (root) {
  var Asteroids;
  if (typeof(window) === 'undefined') {
    Asteroids = global.Asteroids = (global.Asteroids || {});
  } else {
    Asteroids = window.Asteroids = (window.Asteroids || {});
  }

  function randomColor () {
    // rip-off from:
    //     http://stackoverflow.com/questions/1152024/best-way-to-generate-a-random-color-in-javascript
    return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
  }

  var Ship = Asteroids.Ship = function (options) {
    options.radius = Ship.RADIUS;
    options.vel = options.vel || [0, 0];
    options.color = options.color || randomColor();

    Asteroids.MovingObject.call(this, options)
  };

  Ship.RADIUS = 15;

  Asteroids.Util.inherits(Ship, Asteroids.MovingObject);

  Ship.prototype.fireBullet = function () {
    var norm = Asteroids.Util.norm(this.vel);

    if (norm == 0) {
      // can't fire moving still
      return;
    } else {
      var relVel = Asteroids.Util.scale(
        Asteroids.Util.dir(this.vel),
        Asteroids.Bullet.SPEED
      );

      var bulletVel = [
        relVel[0] + this.vel[0], relVel[1] + this.vel[1]
      ];

      var bullet = new Asteroids.Bullet({
        pos: this.pos,
        vel: bulletVel,
        color: this.color,
        game: this.game
      });
      this.game.add(bullet);
    }
  };

  Ship.prototype.power = function (impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
  };

  Ship.prototype.relocate = function () {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
  };
})(this);
