(function (root) {
  var Asteroids;
  if (typeof(window) === 'undefined') {
    Asteroids = global.Asteroids = (global.Asteroids || {});
  } else {
    Asteroids = window.Asteroids = (window.Asteroids || {});
  }

  var Game = Asteroids.Game = function () {
    this.asteroids = [];
    this.bullets = [];
    this.ships = [];
    this.lastTickTime = null;
  };

  Game.DIM_X = 1000;
  Game.DIM_Y = 600;
  Game.FPS = 32;
  Game.NUM_ASTEROIDS = 10;
  Game.BLACK = "#000";

  Game.fromJSON = function (gameJSON) {
    var game = new Game();

    function allFromJSON (Class, data) {
      return data.map(function (datum) {
        return Class.fromJSON(datum, game);
      });
    }

    game.asteroids =
      allFromJSON(Asteroids.Asteroid, gameJSON.asteroids);
    game.bullets =
      allFromJSON(Asteroids.Bullet, gameJSON.bullets);
    game.ships =
      allFromJSON(Asteroids.Ship, gameJSON.ships);
    game.lastTickTime = gameJSON.lastTickTime;

    return game;
  }

  Game.new = function () {
    var game = new this();
    game.addAsteroids(this.NUM_ASTEROIDS);

    return game;
  }

  Game.prototype.add = function (object) {
    if (object.constructor == Asteroids.Asteroid) {
      this.asteroids.push(object);
    } else if (object.constructor == Asteroids.Bullet) {
      this.bullets.push(object);
    } else if (object.constructor == Asteroids.Ship) {
      this.ships.push(object);
    } else {
      throw "wtf?";
    }
  }

  Game.prototype.addAsteroids = function (numAsteroids) {
    for (var i = 0; i < numAsteroids; i++) {
      this.add(Asteroids.Asteroid.randomAsteroid(this));
    }
  };

  Game.prototype.addShip = function () {
    var ship = new Asteroids.Ship({
      pos: this.randomPosition(), game: this
    });

    this.add(ship);

    return ship;
  };

  Game.prototype.allObjects = function () {
    return []
      .concat(this.ships)
      .concat(this.asteroids)
      .concat(this.bullets);
  };

  Game.prototype.checkCollisions = function () {
    var game = this;

    this.allObjects().forEach(function (obj1) {
      game.allObjects().forEach(function (obj2) {
        if (obj1.isCollidedWith(obj2)) {
          obj1.collideWith(obj2);
        }
      });
    });
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BLACK;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] < 0) || (pos[1] < 0)
      || (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  };

  Game.prototype.moveObjects = function () {
    if (!this.lastTickTime) {
      this.lastTickTime = (new Date()).getTime();
    }

    var timeNow = (new Date()).getTime();
    var numTicks = Game.FPS * ((timeNow - this.lastTickTime) / 1000);
    this.lastTickTime = timeNow;

    this.allObjects().forEach(function (object) {
      object.move(numTicks);
    });
  };

  Game.prototype.randomPosition = function () {
    return [
      Game.DIM_X * Asteroids.Util.random(),
      Game.DIM_Y * Asteroids.Util.random()
    ];
  }

  Game.prototype.remove = function (object) {
    if (object.constructor == Asteroids.Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object.constructor == Asteroids.Asteroid) {
      var idx = this.asteroids.indexOf(object);
      this.asteroids[idx] = Asteroids.Asteroid.randomAsteroid(this);
    } else if (object.constructor == Asteroids.Ship) {
      this.ships.splice(this.ships.indexOf(object), 1);
    } else {
      throw "wtf?";
    }
  }

  Game.prototype.step = function () {
    this.moveObjects();
    this.checkCollisions();
  };

  Game.prototype.toJSON = function () {
    function allToJSON (objs) {
      return objs.map(function (obj) { return obj.toJSON() })
    }

    return {
      asteroids: allToJSON(this.asteroids),
      bullets: allToJSON(this.bullets),
      ships: allToJSON(this.ships),
      lastTickTime: this.lastTickTime
    };
  };
})(this);
