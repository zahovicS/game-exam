//empezamos a configurar el enterno del juego
let config=
{
	//escogemos el tipo de configuracion
	type: Phaser.AUTO,
	//un ancho
	width: 800,
	//un alto
	height:600,
	//le indicamos que usaremos fisicas de arcade
	physics:
	{
		default: 'arcade',
		//establecemos un gravedad para el escenario
		arcade:
		{
			gravity:
			{
				y:300
			},
			debug: false
		}
	},
	//establecemos las escenas
	scene:
	{
		preload: preload,
		create: create,
		update: update
	},
	input: {
        activePointers: 3
    }
};
//variable del jugador
let player;
//variable del objetivo: gasolina
let gasolina;
//variable del enimgo(s)
let enemies;
//variable de las plataformas
let platforms;
//variable de los botones de direccion
let cursors;
//variable que contiene el numero de puntaje
let score=0;
//variable de fin del juego
let gameOver=false;
//vriable del texto que contiene el puntaje
let scoreText;
//vriable del texto que se muestra al perder
let gameOverText;
//le damos a la variable game la configuracion antes echa
let game=new Phaser.Game(config);
//creamos la funcion de precarga
let upButton;
let up=false;
let leftButton;
let left=false;
let rightButton;
let right=false;
function preload(){
	//precargamos las imagenes o sprites que vamos a utilizar
				   //una clave, ubicacion
	this.load.image('bg','img/escenario2.png');
	this.load.image('platforms','img/platforms-2.png');
	this.load.image('base1','img/base1.png');
	this.load.image('base2','img/base2.png');			  //ancho del sprite,alto del sprite
	this.load.spritesheet('alien','img/sprite-aliens.png',{frameWidth:32,frameHeight: 32});
	this.load.image('up-arrow','img/up-arrow.png');
	this.load.image('left-arrow','img/left-arrow.png');
	this.load.image('right-arrow','img/right-arrow.png');
}
//creamos la funcion de crear
function create(){
	//añadimos las imagenes
	//     ubicacion x,y   , la clave
	this.add.image(400,300,'bg');

	//asociamos las plataformas a un grupo estatico con fisicas, tambien hay dinamicas
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
    //llamada de los cursores del teclado hacia la funcion cursors
    cursors = this.input.keyboard.createCursorKeys();
    //establecemos que el jugador podra colisionar con las plataformas
    this.physics.add.collider(player,platforms);

    leftButton=this.add.image(70,540,'left-arrow').setInteractive();
    upButton=this.add.image(720,530,'up-arrow').setInteractive();
    rightButton=this.add.image(200,540,'right-arrow').setInteractive();

    leftButton.on('pointerdown',function(){
    	left=true;
    });
    leftButton.on('pointerout',doStop);

    rightButton.on('pointerdown',function(){
    	right=true;
    });
    rightButton.on('pointerout',doStop);
    upButton.on('pointerdown',doJump);
}
//funciones de movimiento
function doGoLeft()
{	
	/*añadimos una velocidad en x negativa
	para asi el jugador se mueva a la izquierda*/
	player.setVelocityX(-160);
	//la animacion del jugador en este caso la posicion de izquierda
	player.anims.play('izquierda', true);
}

function doGoRight()
{
	player.setVelocityX(160);
	player.anims.play('derecha', true);
}

function doStop()
{
	player.setVelocityX(0);
	player.anims.play('frente');
	left=false;
	right=false;
}

function doJump()
{
		//condicionamos si el jugador esta tocando el suelo
	if (player.body.touching.down){
		player.setVelocityY(-330);
	}
}

//creamos la funcion de actualizar
function update(){
	//las condicionales
	//verificamos si el gameOver esta en verdadero, sino no hacemos nada
	if (gameOver)
	{
		return;
	}
	//verificamos que este presionado las teclas establecidas: izquierda
	if (cursors.left.isDown||left)
	{
		doGoLeft();
	}
	//derecha
	else if(cursors.right.isDown||right)
	{
		doGoRight();
	}
	//frente
	else{
		doStop();
	}
	//condicionamos si el jugador esta presionando la tecla arriba
	if (cursors.up.isDown)
	{
		doJump();
	}
}