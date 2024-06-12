class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");

    }

    //creating images for scrolling background
    createAligned(scene, count, texture, scrollFactor) {
        const w = scene.textures.get(texture).getSourceImage().width;
        const totalWidth = scene.scale.width * 10;
        count = Math.ceil(totalWidth / w) * scrollFactor;
        
        let x = 0;
        for (let i = 0; i < count; ++i) {
            const m = scene.add.image(x, scene.scale.height / 2, texture)
                .setOrigin(0, 0.5)
                .setScrollFactor(scrollFactor);
            x += m.width;
        }
    }

    create(){

        //music
        this.titlesoundtrack = this.sound.add('titlesoundtrack', {
            loop: true, 
            volume: 0.15
        });

        this.titlesoundtrack.play();

        //music fades in (so when scenes change it doesnt feel choppy)
        /*
        this.time.delayedCall(500, () => {
            this.tweens.add({
                targets: this.titlesoundtrack,
                volume: 0.2,
                duration: 3000,
                ease: 'Linear'
            });
        });
        */
        

        this.map = this.add.tilemap("Azure Title", 16, 16, 60, 25);

        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap tiles");

        //SCALE IS TEMP FIX WANT TO ADD PARALLAX LATER
        this.backgroundLayer = this.map.createLayer("Background", this.tileset, 960, 0);
        this.backgroundLayer.setScale(3);
        this.groundLayer = this.map.createLayer("Platform and Trees", this.tileset, 960, 0);
        this.groundLayer.setScale(2);

        this.sKey = this.input.keyboard.addKey('S');

        this.createAligned(this, 5, 'map', 1)
        
        this.title = this.add.image(0, 0, 'title');
        this.title.setOrigin(0.5, 0.5);

        this.startText = this.add.bitmapText(0, 0, 'Dogica', `Press S to Start`, 10);
        this.startText.setOrigin(0.5, 0.5);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels * 3, this.map.heightInPixels * 3);
        this.cameras.main.setZoom(4);

    }

    update(){

        this.cameras.main.scrollX += 0.2;

        //looping camera movement
        if (this.cameras.main.scrollX >= this.map.widthInPixels * 3 - this.cameras.main.width) {
            this.cameras.main.scrollX = 0; 
        }

        if (this.sKey.isDown){
            this.scene.start("creditsScene");
            this.titlesoundtrack.stop();
        }

        this.updateTextPosition();

    }

    updateTextPosition() {
        //keeping text centered with the camera
        this.title.x = this.cameras.main.scrollX + this.cameras.main.width / 2;
        this.title.y = this.cameras.main.scrollY + this.cameras.main.height / 2;

        this.startText.x = this.cameras.main.scrollX + this.cameras.main.width / 2;
        this.startText.y = this.cameras.main.scrollY + this.cameras.main.height / 2 + 40;
    }

}
