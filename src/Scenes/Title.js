class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");

    }

    create(){

        //music
        this.titlesoundtrack = this.sound.add('titlesoundtrack', {
            loop: true, 
            volume: 0.1
        });

        this.titlesoundtrack.play();

        this.map = this.add.tilemap("Azure Title", 16, 16, 60, 25);

        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap tiles");

        //SCALE IS TEMP FIX WANT TO ADD PARALLAX LATER
        this.backgroundLayer = this.map.createLayer("Background", this.tileset, 960, 0);
        this.backgroundLayer.setScale(3);
        this.groundLayer = this.map.createLayer("Platform and Trees", this.tileset, 960, 0);
        this.groundLayer.setScale(3);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.sKey = this.input.keyboard.addKey('S');

        this.title = this.add.image(1900, 400, 'title');
        this.title.setScale(4); 

        this.startText = this.add.image(1900, 600, 'start');

        this.cameras.main.setBounds(960, 0, 1920, 800);
        //this.cameras.main.setZoom();

    }

    update(){

        this.groundSpeed = 0.5;
        this.backgroundLayer.tilePositionX += this.groundSpeed;
        this.groundLayer.tilePositionX += this.groundSpeed;

        if (this.sKey.isDown){
            this.scene.start("platformerScene");
            this.titlesoundtrack.stop();
        }

    }

}
