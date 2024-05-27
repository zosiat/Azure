class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load tilemap information
        this.load.image("tilemap tiles", "tilemap_packed.png");         // Packed tilemap
        this.load.tilemapTiledJSON("Azure Level", "Azure Level.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("Azure Title", "Azure Title.tmj");   // Title Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap sheet", "tilemap_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        
        //loading images
        this.load.image("bunny", "tile_0045.png");
        this.load.image("bunny jump", "tile_0046.png");
        this.load.image("particles 1", "particles_1.png");
        this.load.image("particles 2", "particles_2.png");
        this.load.image("flower", "tile_0033.png");
        this.load.image("ladder", "tile_0036.png");
        this.load.image("title", "Azure Title.png");
        this.load.image("bee", "tile_0051.png");
        this.load.image("bee flap", "tile_0052.png");
        this.load.image("hearts", "heart.png");
        this.load.image("hearts2", "heart2.png");
        this.load.image("hearts3", "heart3.png");
        this.load.image("start", "Start.png");


        //load audio
        this.load.audio('soundtrack', 'Pixel 2.mp3');
        this.load.audio('titlesoundtrack', 'Pixel 3.mp3');

        this.load.audio('jumpsound', "DM-CGS-47.wav");
        this.load.audio('jumpsound2', "DM-CGS-46.wav");
        this.load.audio('fallsound', "DM-CGS-49.wav");
        this.load.audio('collectsound', "DM-CGS-32.wav");
        this.load.audio('landsound', "DM-CGS-20.wav");
        this.load.audio('walksound', "DM-CGS-40.wav");


        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        //this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {

        //jumping animation
        this.anims.create({
            key: 'jump',
            frames: [{ key: 'bunny jump' }],
            repeat: 0
        });

        //idle animation
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'bunny' }],
            repeat: -1
        });

        //walking animation
        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'bunny' },
                { key: 'bunny jump' }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'bee',
            frames: [
                { key: 'bee' },
                { key: 'bee flap' }
            ],
            frameRate: 5,
            repeat: -1
        });

         // ...and pass to the next Scene
         this.scene.start("titleScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}