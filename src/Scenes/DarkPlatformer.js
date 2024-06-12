class DarkPlatformer extends Phaser.Scene {
    constructor() {
        super("darkPlatformerScene");
    }

    preload(){
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles')
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
        this.doorCollision = false;
        this.COOLDOWN_DURATION = 1000;
        this.lastSoundTime = 0; 
    }

    create(){

        this.darksoundtrack = this.sound.add('darksoundtrack', {
            loop: true,
            volume: 0
        });
        this.darksoundtrack.play();

        this.time.delayedCall(500, () => {
            this.tweens.add({
                targets: this.darksoundtrack,
                volume: 0.1,
                duration: 3000,
                ease: 'Linear'
            });
        });

        this.jumpSounds = [
            this.sound.add('jumpsound', {volume: 0.2}),
            this.sound.add('jumpsound2', {volume: 0.2})
        ];

        this.fallSound = this.sound.add('fallsound', {volume: 0.5});
        this.collectSound = this.sound.add('collectsound', {volume: 0.5});
        this.lockedSound = this.sound.add('walksound', {volume: 0.5});

        this.physics.world.setBounds(0, 0, 1920, 800);

        // Create a new tilemap game object which uses 16x16 pixel tiles, and is
        // 60 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("Azure Level Dark", 16, 16, 60, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("monochrome_tilemap_packed", "dark tilemap tiles");

        // Create a layer
        this.backgroundLayer = this.map.createLayer("Background", this.tileset, 0, 0);
        this.backgroundLayer.setScale(SCALE);
        this.groundLayer = this.map.createLayer("Platforms", this.tileset, 0, 0);
        this.groundLayer.setScale(SCALE);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        //door group
        this.doors = this.map.createFromObjects("Objects", {
            name: "door",
            key: "door"
            //frame: 58
        });

        //scale door
        this.doors.forEach((door) => {
            door.setScale(SCALE, SCALE); 

            door.x *= 2;
            door.y *= 2;
        });

        this.physics.world.enable(this.doors, Phaser.Physics.Arcade.STATIC_BODY);
        //this will be used for collision detection below.
        this.doorGroup = this.add.group(this.doors);

        //creating spike objects
        this.spikes = this.map.createFromObjects("Objects", {
            name: "spike",
            key: "spike"
        });

        this.spikes.forEach((spike) => {
            spike.setScale(SCALE, SCALE);
            spike.x *= 2;
            spike.y *= 2;
    
            this.physics.world.enable(spike, Phaser.Physics.Arcade.STATIC_BODY);
        });

        this.spikeGroup = this.add.group(this.spikes);

        //play anims for spikes
        this.spikes.forEach((spike) => {
            spike.anims.play('spikeAnimation', true);
        });

       //spikes
        this.keys = this.map.createFromObjects("Objects", {
            name: "key",
            key: "key"
            //frame: 58
        });

        //scale door
        this.keys.forEach((key) => {
            key.setScale(SCALE, SCALE); 

            key.x *= 2;
            key.y *= 2;
        });

        this.physics.world.enable(this.keys, Phaser.Physics.Arcade.STATIC_BODY);
        //this will be used for collision detection below.
        this.keyGroup = this.add.group(this.keys);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 200, "bunny").setScale(SCALE);
        my.sprite.player.setCollideWorldBounds(true);

        //enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        //this.physics.add.collider(my.sprite.player, this.spikeLayer);

        //collision detection with door
        //goes back to title scene
        this.physics.add.overlap(my.sprite.player, this.doorGroup, (obj1, obj2) => {
            this.doorCollision = true;
            //this.scene.start("titleScene");
            //this.darksoundtrack.stop();
        }); 

        //collision detection for player and spike
        this.physics.add.overlap(my.sprite.player, this.spikeGroup, (obj1, obj2) => {
            //this.scene.restart();
            this.fallSound.play();
            my.sprite.player.setPosition(30, 600);
            this.myScore++;
        }); 

        //collecting the key
        this.physics.add.overlap(my.sprite.player, this.keyGroup, (obj1, obj2) => {
            this.keyCollision = true;
            this.collectSound.play();
            obj2.destroy();
        }); 

        //score text
        this.scoreText = this.add.bitmapText(100, 100, 'Monster Friend Fore', `Deaths: ${this.myScore}`, 20);

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

        this.cameras.main.setBounds(0, 0, 1920, 800);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(20, 20);
        this.cameras.main.setZoom(this.SCALE);

        this.animatedTiles.init(this.map);
    }

    update(){

        if (this.keyGroup.getChildren().length == 0 && this.physics.overlap(my.sprite.player, this.doorGroup)) {
            this.scene.start("creditsScene");
            this.darksoundtrack.stop();

        } 
        else if (this.physics.overlap(my.sprite.player, this.doorGroup)) {
            const delay = 500; 
            
            // Check if the sound is already scheduled to avoid repeated scheduling
            if (!this.lockedSoundPlaying) {
                this.lockedSoundPlaying = true;

                this.time.delayedCall(delay, () => {
                    this.lockedSound.play();
                    this.lockedSoundPlaying = false; //reset flag
                }, [], this);
            }
        }
        //resetting flag
        this.doorCollision = false;

        if(cursors.left.isDown || this.aKey.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

            //particle following code
            //my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2-5, false);

            //my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                //my.vfx.walking.start();
                //this.walkSound.play({delay: 100});
            }

        } else if(cursors.right.isDown|| this.dKey.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            //my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-40, my.sprite.player.displayHeight/2-5, false);
            //my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            
            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                //my.vfx.walking.start();
                

            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');

        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            
        }
        
        if(my.sprite.player.body.blocked.down && (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(this.wKey))) {
            //play a random jump sound
            const randomIndex = Phaser.Math.Between(0, this.jumpSounds.length - 1);
            this.jumpSounds[randomIndex].play();
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }

        //reset key
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.darksoundtrack.stop();
            this.scene.restart();
        }

        if (my.sprite.player.y >= 780) {
            this.fallSound.play();
            this.myScore++;
            my.sprite.player.setPosition(30, 600);
            
        }
        this.updateTextPosition()
    }

    //text stays with the camera
    updateTextPosition() {
        //keeping text centered with the camera
        this.scoreText.x = this.cameras.main.scrollX + this.cameras.main.width/2 + 300;
        this.scoreText.y = this.cameras.main.scrollY + this.cameras.main.height/2 -170;

        this.scoreText.setText(`Deaths: ${this.myScore}`);
    }
}