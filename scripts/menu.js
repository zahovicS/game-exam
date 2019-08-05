class MenuPrincipal extends Phaser.Scene{
	constructor(){
		super({
			key: "menu"
		});
	}
	create(){
		let titulo=this.add.text(400,100, 'Juego :)');
		let btnPlay=this.add.image(400,300,'img/play.png').setInteractive();

		menuNumber= -1;

		menuNumber.on('pointerdown',function(ev)
			{
				menuNumber=0;
			});
	}
	update(){
		if (
			menuNumber===0)
		{
			this.scene.start("scripts/game.js");
		}
	}
}