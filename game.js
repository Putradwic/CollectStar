const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let player;
let stars;
let platforms;
let score = 0;
let scoreText;

function preload() {
  this.load.image("sky", "assets/image.png");
  this.load.image("ground", "assets/ground.png");
  this.load.image("star", "assets/star.png");
  this.load.spritesheet("dude", "assets/char.png", {
    frameWidth: 80,
    frameHeight: 75,
  });
}

function create() {
    
  // Background
  this.add.image(0, 0, "sky").setScale(1.6);

  // Platforms
  platforms = this.physics.add.staticGroup();
  platforms.create(450, 568, "ground").setScale(2).refreshBody();
  platforms.create(700, 400, "ground").setScale(2);
  platforms.create(600, 500, "ground").setScale(2);
  platforms.create(750, 500, "ground").setScale(2);
  platforms.create(50, 250, "ground").setScale(2);
  platforms.create(750, 220, "ground").setScale(3);
  platforms.create(300, 300, "ground").setScale(1.5);
  platforms.create(85, 600, "ground").setScale(3);
  platforms.create(250, 600, "ground").setScale(3);
  platforms.create(350, 580, "ground").setScale(0.5);

  // Player
  player = this.physics.add.sprite(50, 400, "dude");
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // Stars
  stars = this.physics.add.group({
    key: "star",
    repeat: 11,
    setXY: { x: 18, y: 0, stepX: 70 },
  });

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  // Score
  scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "32px",
    fill: "#ffff",
  });

  // Colliders
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);

  key = {
    cursors: this.input.keyboard.createCursorKeys(),
    keys: this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
    }),
  };
}
function update() {
  const kiri = key.cursors.left.isDown || key.keys.A.isDown;
  const kanan = key.cursors.right.isDown || key.keys.D.isDown;
  const lompat =
    key.cursors.up.isDown || key.keys.W.isDown || key.keys.SPACE.isDown;

  if (kiri) {
    player.setVelocityX(-160);
    player.setFlipX(true);
  } else if (kanan) {
    player.setVelocityX(160);
    player.setFlipX(false);
  } else {
    player.setVelocityX(0);
  }

  if (lompat && player.body.touching.down) {
    player.setVelocityY(-350);
  }
  
}
function collectStar(player, star) {
  star.disableBody(true, true);
  score += 10;
  scoreText.setText("Score: " + score);

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });
  }
}
