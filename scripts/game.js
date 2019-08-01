let config=
{
	type: Phaser.AUTO,
	width: 800,
	height:600,
	physics:
	{
		default: 'arcade',
		arcade:
		{
			gravity:
			{
				y:300
			},
			debug: false
		}
	},
	scene:
	{
		preload: preload,
		create: create,
		update: update
	}
};
let player;
let objetives;
let enemies;
let platforms;
let cursors;
let score=0;
let gameOver=false;
let scoreText;
let gameOverText;

let game=new Phaser.Game(config);

function preload(){
	//precargamos las imagenes
	this.load.image('bg','img/escenario2.png');
	this.load.image('platforms','img/platforms.png');
	this.load.image('base1','img/base1.png');
	this.load.image('base2','img/base2.png');
	this.load.spritesheet('alien','img/sprite-aliens.png',{frameWidth:32,frameHeight: 32});
}
function create(){
	//añadimos las imagenes
	this.add.image(400,300,'bg');
	//asociamos las plataformas a un grupo estatico con fisicas
	platforms=this.physics.add.staticGroup();
	//plataforma incial, posicion casi al inferior
    platforms.create(131,550,'base1');
    platforms.create(531,570,'base2');
    //plataformas repartidas por el escenario
    platforms.create(-200,260,'platforms').setScale(2).refreshBody();
    platforms.create(400,130,'platforms');
    platforms.create(800,300,'platforms');
    //configuracion del jugador
    player=this.physics.add.sprite(300,200,'alien');
    //Establecemos un rebote de 0.2 al jugador
    player.setBounce(0.2);
    //Establecemos que el jugador podra tocar las plataformas
    player.setCollideWorldBounds(true);
    //creamos las animaciones en este caso la izquierda
    this.anims.create({
    	//una clave o identificador para llamarlo
    	key: 'izquierda',
    	//generar los frames
    	frames: this.anims.generateFrameNumbers('alien',{ start: 0, end: 2 }),
    	frameRate: 5,
    	repeat: -1
    });
    //ferente
    this.anims.create({
    	key: 'frente',
    	frames: [{key: 'alien', frame: 3}],
    	frameRate: 20
    });
    //derecha
    this.anims.create({
    	key: 'derecha',
    	frames: this.anims.generateFrameNumbers('alien',{ start: 5, end: 6 }),
    	frameRate: 5,
    	repeat: -1
    });
    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player,platforms);
}
function update(){
	
	if (gameOver)
	{
		return;
	}

	if (cursors.left.isDown)
	{
		player.setVelocityX(-160);
		player.anims.play('izquierda',true);
	}
	else if(cursors.right.isDown)
	{
		player.setVelocityX(160);
		player.anims.play('derecha',true);
	}
	else{
		player.setVelocityX(0);
		player.anims.play('frente');
	}
	if (cursors.up.isDown && player.body.touching.down)
	{
		player.setVelocityY(-330);
	}
}