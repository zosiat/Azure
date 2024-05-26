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

        this.sKey = this.input.keyboard.addKey('S');

        this.title = this.add.image(900, 400, 'title');
        this.title.setScale(4); 

        this.startText = this.add.image(900, 600, 'start');
        //this.startText.setScale(0.7); 

        this.cameras.main.setBounds(0, 0, 1920, 800);
        //this.cameras.main.setZoom(this.SCALE);
    }

    update(){

        if (this.sKey.isDown){
            this.scene.start("platformerScene");
            this.titlesoundtrack.stop();
        }

    }

}
