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
        this.PARTICLE_VELOCITY = 50;
        //come back and change scale later
        this.SCALE = 2;
        this.myScore = 0;
        
    }

    create() {

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

        //enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        //handle collision detection with flowers
        this.physics.add.overlap(my.sprite.player, this.flowerGroup, (obj1, obj2) => {
            obj2.destroy();
        });

        //collision detection with ladder
        this.physics.add.overlap(my.sprite.player, this.ladderGroup, (obj1, obj2) => {
            this.title.visible = true;
        }); 
        
        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
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

        //camera
        this.cameras.main.setBounds(0, 0, 1920, 800);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(20, 20);
        this.cameras.main.setZoom(this.SCALE);

        // Create the title image
        this.title = this.add.image(450, 600, 'title');
        this.title.setScale(SCALE); 
        this.title.visible = false;
    
    } 

    update() {

        if (this.scene.isPaused()) {
            return;
        }

        if(cursors.left.isDown) {
            this.title.visible = false;
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

            //particle following code
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();

            }

        } else if(cursors.right.isDown) {
            this.title.visible = false;
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-40, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();

            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            //vfx stop playing 
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            my.vfx.walking.stop();
        }
        
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }

        //reset key
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

        //respawns player if they "fall off" the map (get too low)
        if (my.sprite.player.y >= 780) {
            my.sprite.player.setPosition(30, 600);
        }
    }
}