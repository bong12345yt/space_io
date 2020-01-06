const Constants = require('../shared/constants');
const Player = require('./player');
const applyCollisions = require('./collisions');
const applyCollisionsItem = require('./collisionItem');
const ItemHeath = require('./itemHeath');
const ItemGun = require('./itemGun');
const Sparkling = require('./Sparkling');
const Explosion = require('./explosion');
class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.heathItems = [];
    this.gunItems = [];
    this.sparklings =[];
    this.explosions =[];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, data) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, data.UserName, x, y, data.ShipType);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  handleMousePos(socket, dis) {
    if (this.players[socket.id]) {
      this.players[socket.id].setMousePos(dis);
    }
  }

  handleMouseLeftClick(socket) {
    if (this.players[socket.id]) {
      this.players[socket.id].speedUp();
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each bullet
    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
      }
    });
    this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

    const SparklingToRemove = [];
    this.sparklings.forEach(sparkling => {
      if (sparkling.update(dt)) {
        // Destroy this sparkling
        SparklingToRemove.push(sparkling);
      }
    });
    this.sparklings = this.sparklings.filter(sparkling => !SparklingToRemove.includes(sparkling));

    const ExplosionToRemove = [];
    this.explosions.forEach(Explosion => {
      if (Explosion.update(dt)) {
        // Destroy this sparkling
        ExplosionToRemove.push(Explosion);
      }
    });
    this.explosions = this.explosions.filter(Explosion => !ExplosionToRemove.includes(Explosion));

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const newBullets = player.update(dt);
      if (newBullets) {
        for (let i = 0; i < newBullets.length; i++) {
          this.bullets.push(newBullets[i]);
        }
      }

    });

    // Apply collisions, give players score for hitting bullets
    const destroyedBullets = applyCollisions(Object.values(this.players), this.bullets);
    destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();
        this.sparklings.push(new Sparkling(b.x,b.y, 0));
      }
    });
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));

    // Apply collisions, give players score for heath items
    const destroyedHeathItems = applyCollisionsItem(Object.values(this.players), this.heathItems);
    destroyedHeathItems.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].takeHeal();
      }
    });
    this.heathItems = this.heathItems.filter(item => !destroyedHeathItems.includes(item));

    // Apply collisions, give players score for gun items
    const destroyedGunItems = applyCollisionsItem(Object.values(this.players), this.gunItems);
    destroyedGunItems.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].takeGun();
      }
    });
    this.gunItems = this.gunItems.filter(item => !destroyedGunItems.includes(item));

    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        var random = Math.floor(Math.random() * 2);
        if(random){
          this.heathItems.push(new ItemHeath(player.x, player.y, 0));
        }
        this.explosions.push(new Explosion(player.x, player.y, 0));
        this.gunItems.push(new ItemGun( player.x + Constants.ITEM_MAX_ALIGN_X, player.y, 0));
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = true;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    const nearbyHeathItems = this.heathItems.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    const nearbyGunItems = this.gunItems.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    const nearbySparkling = this.sparklings.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    const nearbyExplosion = this.explosions.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      heathitems: nearbyHeathItems.map(b => b.serializeForUpdate()),
      gunitems: nearbyGunItems.map(b => b.serializeForUpdate()),
      sparklings: nearbySparkling.map(b => b.serializeForUpdate()),
      explosions: nearbyExplosion.map(b => b.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
