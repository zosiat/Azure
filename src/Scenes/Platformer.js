class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 200;
        this.DRAG = 600;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 10;
        //come back and change scale later
        this.SCALE = 2;
        this.myScore = 0;
        this.beeDirection = 1;
        this.beeCollision = false;
        this.COOLDOWN_DURATION = 1000;
        this.lastSoundTime = 0; 
    }

    create() {

        //background music
        this.soundtrack = this.sound.add('soundtrack', {
            loop: true,
            volume: 0.0
        });
        this.soundtrack.play();

        this.time.delayedCall(500, () => {
            this.tweens.add({
                targets: this.soundtrack,
                volume: 0.1,
                duration: 3000,
                ease: 'Linear'
            });
        });

        //this.jumpsound = this.sound.add('jumpsound');
        this.jumpSounds = [
            this.sound.add('jumpsound', {volume: 0.2}),
            this.sound.add('jumpsound2', {volume: 0.2})
        ];

        //use for multiple emitter textures later
        this.heartImages = [
            this.add.image(0, 0, 'hearts'),
            this.add.image(0, 0, 'hearts2'),
            this.add.image(0, 0, 'hearts3')
        ];

        //creating all sounds
        this.fallSound = this.sound.add('fallsound', {volume: 0.5});
        this.collectSound = this.sound.add('collectsound', {volume: 0.5});
        this.landSound = this.sound.add('landsound', {volume: 0.5});
        this.walkSound = this.sound.add('walksound', {volume: 0.5});

        this.physics.world.setBounds(0, 0, 1920, 800);

        // Create a new tilemap game object which uses 16x16 pixel tiles, and is
        // 60 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("Azure Level", 16, 16, 60, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap tiles");

        // Create a layer
        this.backgroundLayer = this.map.createLayer("Background", this.tileset, 0, 0);
        this.backgroundLayer.setScale(SCALE);
        this.cloudLayer = this.map.createLayer("Clouds", this.tileset, 0, 0);
        this.cloudLayer.setScale(SCALE);
        this.groundLayer = this.map.createLayer("Platform and Trees", this.tileset, 0, 0);
        this.groundLayer.setScale(SCALE);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects

        this.flowers = this.map.createFromObjects("Objects", {
            name: "flower",
            key: "flower"
            //frame: 33
        });
        
        //scaling flowers up :) and multiplying the coords because the other layers are also scaled up
        this.flowers.forEach((flower) => {
            flower.setScale(SCALE, SCALE); 

            flower.x *= 2;
            flower.y *= 2;
        });

        //ladder objects
        this.ladders = this.map.createFromObjects("Objects", {
            name: "ladder",
            key: "ladder"
        });

        this.ladders.forEach((ladder) => {
            ladder.setScale(SCALE, SCALE); 

            ladder.x *= 2;
            ladder.y *= 2;
        });
            
        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.flowers, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.ladders, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.flowerGroup = this.add.group(this.flowers);
        this.ladderGroup = this.add.group(this.ladders);
        
        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 600, "bunny").setScale(SCALE);
        my.sprite.player.setCollideWorldBounds(true);

        // set up bee sprite
        my.sprite.bee = this.physics.add.sprite(1210, 200, "bee").setScale(SCALE);
        //my.sprite.bee = this.physics.add.sprite(50, 600, "bee").setScale(SCALE);
        my.sprite.bee.setCollideWorldBounds(true);
        my.sprite.bee.anims.play('bee', true);

        //enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.bee, this.groundLayer);

        //handle collision detection with flowers
        this.physics.add.overlap(my.sprite.player, this.flowerGroup, (obj1, obj2) => {
            this.collectSound.play();
            obj2.destroy();
        });

        //collision detection with ladder
        this.physics.add.overlap(my.sprite.player, this.ladderGroup, (obj1, obj2) => {
            //this.scene.restart();
            this.scene.start("titleScene");
            this.soundtrack.stop();
        }); 

        //bee collision
        this.physics.add.overlap(my.sprite.player, my.sprite.bee, (obj1, obj2) => {
            this.beeCollision = true;
        });
        
        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');
        this.wKey = this.input.keyboard.addKey('W');
        this.aKey = this.input.keyboard.addKey('A');
        this.dKey = this.input.keyboard.addKey('D');


        this.physics.world.drawDebug = false;

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-B', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // movement vfx
        my.vfx.walking = this.add.particles(0,-8, "particles 2", {
            quantity: 1,
            scale: {start: 1.5, end: 1.5},
            maxAliveParticles: 4,
            lifespan: 100,
            alpha: {start: 0.5, end: 0.01}, 
        });

        my.vfx.walking.stop(); 

        //heart emitter
        my.vfx.hearts = this.add.particles(0, 0, "hearts3", {
            lifespan: 500,                 
            frequency: 800,                 
            scale: { start: 1.5, end: 0.5 },
            alpha: { start: 1, end: 0 },    
            gravityY: 100,

        });

        my.vfx.hearts.stop(); 
    
        //camera
        this.cameras.main.setBounds(0, 0, 1920, 800);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(20, 20);
        this.cameras.main.setZoom(this.SCALE);
    
    } 

    update() {

        //bee speed
        //1210
        my.sprite.bee.x += 0.2 * this.beeDirection; 
        //bee movement check
        if (my.sprite.bee.x <= 1160) {
            my.sprite.bee.setFlip(false, false);
            //changes direction when limit is reached
            this.beeDirection = 1;
        } else if (my.sprite.bee.x >= 1230) {
            my.sprite.bee.setFlip(true, false);
            this.beeDirection = -1;
        }

        //bee collision: different sounds and heart emmitter
        const currentTime = Date.now();

        if (this.beeCollision && (currentTime - this.lastSoundTime > this.COOLDOWN_DURATION)) {
            if (this.flowerGroup.getChildren().length <= 1 && this.physics.overlap(my.sprite.player, my.sprite.bee)) {
                if (!this.positiveSoundPlayed) {
                    this.collectSound.play();
                    this.positiveSoundPlayed = true;
                    my.vfx.hearts.setPosition(my.sprite.bee.x, my.sprite.bee.y - 20);
                    my.vfx.hearts.start();
                }
                
            } else if (this.flowerGroup.getChildren().length > 1 && this.physics.overlap(my.sprite.player, my.sprite.bee)){
                if (!this.negativeSoundPlayed) {
                    this.landSound.play();
                    this.negativeSoundPlayed = true;  
                }
            }
            //resetting flags
            this.beeCollision = false;
            this.lastSoundTime = currentTime;
            this.positiveSoundPlayed = false;
            this.negativeSoundPlayed = false;
        }

        //heart emmitter follows bee
        my.vfx.hearts.setPosition(my.sprite.bee.x, my.sprite.bee.y - 20);
    
        if(cursors.left.isDown || this.aKey.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

            //particle following code
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
                //this.walkSound.play({delay: 100});
            }

        } else if(cursors.right.isDown|| this.dKey.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-40, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            
            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
                //this.walkSound.play({delay: 100});

            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            //vfx stop playing 
            my.vfx.walking.stop();
            this.walkSound.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            my.vfx.walking.stop();
            this.walkSound.stop();
        }
        
        if(my.sprite.player.body.blocked.down && (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(this.wKey))) {
            //play a random jump sound
            const randomIndex = Phaser.Math.Between(0, this.jumpSounds.length - 1);
            this.jumpSounds[randomIndex].play();
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }

        //reset key
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.soundtrack.stop();
            this.scene.restart();
        }

        //respawns player if they "fall off" the map (get too low)
        if (my.sprite.player.y >= 780) {
            this.fallSound.play();
            my.sprite.player.setPosition(30, 600);
            my.vfx.hearts.stop();
        }
    }
}