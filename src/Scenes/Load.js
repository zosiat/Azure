class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");
        

        // Load characters spritesheet
        //this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap tiles", "tilemap_packed.png");         // Packed tilemap
        this.load.tilemapTiledJSON("Azure Level", "Azure Level.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap sheet", "tilemap_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        
        //loading player
        this.load.image("bunny", "tile_0045.png");
        this.load.image("bunny jump", "tile_0046.png");

        //jumping animation
        this.anims.create({
            key: 'jump',
            frames: [{ key: 'bunny jump' }],
            frameRate: 10,
            repeat: 0
        });

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        //this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
         // ...and pass to the next Scene
         this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}