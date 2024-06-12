class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");

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

        this.map = this.add.tilemap("Azure Title", 16, 16, 60, 25);

        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap tiles");

        //tilemap layers
        this.backgroundLayer = this.map.createLayer("Background", this.tileset, 960, 0);
        this.backgroundLayer.setScale(3);
        this.groundLayer = this.map.createLayer("Platform and Trees", this.tileset, 960, 0);
        this.groundLayer.setScale(2);

        this.tKey = this.input.keyboard.addKey('T');

        this.createAligned(this, 5, 'map', 1)
        
        //credits text
        this.creditsText = this.add.bitmapText(0, 0, 'Blue', `CREDITS`, 20);
        this.creditsText.setOrigin(0.5, 0.5);

        console.log('Tint applied:', this.creditsText.tintTopLeft.toString(16)); // Debugging

        this.creditsGameDesign = this.add.bitmapText(0, 0, 'Monster Friend Fore','Game Design', 12);
        this.creditsGameDesign.setOrigin(0.5, 0.5);

        this.gameDesignText = this.add.bitmapText(0, 0, 'Dogica','Zosia Trela', 6);
        this.gameDesignText.setOrigin(0.5, 0.5);
        
        this.creditsMusic = this.add.bitmapText(0, 0, 'Monster Friend Fore','Audio', 12);
        this.creditsMusic.setOrigin(0.5, 0.5);
        
        this.musicText = this.add.bitmapText(0, 0, 'Dogica','AlkaKrab and Dustyroom', 6);
        this.musicText.setOrigin(0.5, 0.5);

        this.creditsArt = this.add.bitmapText(0, 0, 'Monster Friend Fore','Art', 12);
        this.creditsArt.setOrigin(0.5, 0.5);

        this.artText = this.add.bitmapText(0, 0, 'Dogica','Kenney Assets', 6);
        this.artText.setOrigin(0.5, 0.5);
        
        this.creditsFont = this.add.bitmapText(0, 0, 'Monster Friend Fore','Fonts', 12);
        this.creditsFont.setOrigin(0.5, 0.5);

        this.fontText = this.add.bitmapText(0, 0, 'Dogica','Roberto Mocci and Monster Friend', 6);
        this.fontText.setOrigin(0.5, 0.5);
        
        this.prompt = this.add.bitmapText(0, 0, 'Dogica','Press T to Return to Title', 6);
        this.prompt.setOrigin(0.5, 0.5);

        //camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels * 3, this.map.heightInPixels * 3);
        this.cameras.main.setZoom(4);

    }

    update(){

        this.cameras.main.scrollX += 0.2;

        //looping camera movement
        if (this.cameras.main.scrollX >= this.map.widthInPixels * 3 - this.cameras.main.width) {
            this.cameras.main.scrollX = 0; 
        }

        if (this.tKey.isDown){
            this.scene.start("titleScene");
            this.soundtrack.stop();
        }

        this.updateTextPosition();

    }

    updateTextPosition() {
        //keeping text centered with the camera
        this.creditsText.x = this.cameras.main.scrollX + this.cameras.main.width / 2;
        this.creditsText.y = this.cameras.main.scrollY + this.cameras.main.height / 2 - 60;

        this.creditsGameDesign.x = this.cameras.main.scrollX + this.cameras.main.width / 2;
        this.creditsGameDesign.y = this.cameras.main.scrollY + this.cameras.main.height / 2 - 30;

        this.gameDesignText.x = this.cameras.main.scrollX + this.cameras.main.width / 2;
        this.gameDesignText.y = this.cameras.main.scrollY + this.cameras.main.height / 2 - 15;

        this.creditsMusic.x = this.cameras.main.scrollX + this.cameras.main.width / 2;
        this.creditsMusic.y = this.cameras.main.scrollY + this.cameras.main.height / 2;

        this.musicText.x = this.cameras.main.scrollX + this.cameras.main.width / 2;
        this.musicText.y = this.cameras.main.scrollY + this.cameras.main.height / 2 + 15;

        this.creditsArt.x = this.cameras.main.scrollX + this.cameras.main.width / 2;
        this.creditsArt.y = this.cameras.main.scrollY + this.cameras.main.height / 2 + 30;

        this.artText.x = this.cameras.main.scrollX + this.cameras.main.width / 2;
        this.artText.y = this.cameras.main.scrollY + this.cameras.main.height / 2 + 45;

        this.creditsFont.x = this.cameras.main.scrollX + this.cameras.main.width / 2;
        this.creditsFont.y = this.cameras.main.scrollY + this.cameras.main.height / 2 + 60;

        this.fontText.x = this.cameras.main.scrollX + this.cameras.main.width / 2;
        this.fontText.y = this.cameras.main.scrollY + this.cameras.main.height / 2 + 75;

        this.prompt.x = this.cameras.main.scrollX + this.cameras.main.width / 2;
        this.prompt.y = this.cameras.main.scrollY + this.cameras.main.height / 2 - 90;
    }
    

}
