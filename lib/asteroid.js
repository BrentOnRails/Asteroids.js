(function () {
  var Asteroids;
  if (typeof(window) === 'undefined') {
    Asteroids = global.Asteroids = (global.Asteroids || {});
  } else {
    Asteroids = window.Asteroids = (window.Asteroids || {});
  }

  var Asteroid = Asteroids.Asteroid = function (options) {
    options.radius = Asteroid.RADIUS;
    options.color = Asteroid.GRAY

    Asteroids.MovingObject.call(this, options);
  };

  Asteroid.GRAY = "#555";
  Asteroid.RADIUS = 25;
  Asteroid.SPEED = 4;

  Asteroid.randomAsteroid = function (game) {
    return new Asteroid({
      pos: game.randomPosition(),
      vel: Asteroids.Util.randomVec(Asteroid.SPEED),
      game: game
    });
  };

  Asteroids.Util.inherits(Asteroid, Asteroids.MovingObject);

  Asteroid.prototype.collideWith = function (otherObject) {
    if (otherObject.constructor !== Asteroids.Ship) {
      return;
    }

    otherObject.relocate();
  }
})();
