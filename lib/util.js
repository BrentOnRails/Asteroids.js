(function (root) {
  var Asteroids;
  if (typeof(window) === 'undefined') {
    Asteroids = global.Asteroids = (global.Asteroids || {});
  } else {
    Asteroids = window.Asteroids = (window.Asteroids || {});
  }

  var Util = Asteroids.Util = {};

  var dir = Util.dir = function (vec) {
    var norm = Util.norm(vec);
    return Util.scale(vec, 1 / norm);
  };

  var dist = Util.dist = function (pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  };

  var norm = Util.norm = function (vec) {
    return Util.dist([0, 0], vec);
  };

  var randomVec = Util.randomVec = function (length) {
    var x = random() - 0.5;
    var y = random() - 0.5;

    var vec = [x, y];
    return Util.scale(vec, length / Util.norm(vec));
  };

  var scale = Util.scale = function (vec, m) {
    return [vec[0] * m, vec[1] * m];
  };

  var inherits = Util.inherits = function (ChildClass, BaseClass) {
    // TODO: hack!
    ChildClass.fromJSON = BaseClass.fromJSON;

    function Surrogate () { this.constructor = ChildClass };
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
  };

  // rip-off from:
  //   http://indiegamr.com/generate-repeatable-random-numbers-in-js
  Util._seed = 0;
  var random = Util.random = function(max, min) {
    max = max || 1;
    min = min || 0;

    Util._seed = (Util._seed * 9301 + 49297) % 233280;
    var rnd = Util._seed / 233280;

    return min + rnd * (max - min);
  }
})(this);
