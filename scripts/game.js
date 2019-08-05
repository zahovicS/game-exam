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
let upButton;
let up=false;
let leftButton;
let left=false;
let rightButton;
let right=false;
//le damos a la variable game la configuracion antes echa
let game=new Phaser.Game(config);
//creamos la funcion de precarga

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
	this.load.image('gaso','img/gaso-alien.png');
	this.load.image('tube','img/tube-enemies2.png');
	this.load.image('bomb','img/bomb3.png');
	this.load.image('gameover','img/game-over2.png');
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
    platforms.create(800,300,'platforms');
    platforms.create(850,120,'platforms');
    platforms.create(400,90,'tube');

    //configuracion del jugador
    player=this.physics.add.sprite(300,200,'alien');
    //añadimos un grupo: gasolina con fisicas
    gasolina=this.physics.add.group({
    	key: 'gaso',
    	//repetir 4 veces, +1 
    	repeat: 4,
    	//donde lo colocaremos x,y , step, cuanto de x se va a alejar, y cuando de y
    	setXY: { x:10,y:2,stepX:195,stepY:10}
    });
    enemies=this.physics.add.group();
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
    //botones para jugar en mobil begin
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
    //end
    //texto de puntaje
    scoreText = this.add.text(16,16, 'Puntaje: 0',{
    	fontSize: '32px',
    	fill: 'white'
    });
    //establecemos que el jugador podra colisionar con las plataformas
    this.physics.add.collider(player,platforms);
    this.physics.add.collider(gasolina,platforms);
    this.physics.add.collider(enemies,platforms);
    //funcion jugador tocando el objetivo y se ejectua una funcion
    this.physics.add.overlap(player,gasolina,collectGaso,null,this);
    //un colicionador ejecutando una funcion, entre el jugador y el enemigo
    this.physics.add.collider(player,enemies,hitEnemies,null,this);
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
		this.add.image(400,300,'gameover');
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
//funcion para el colicionador entre el objetivo y el jugador
function collectGaso(player,gaso){
	//la clave del sprite gasolina: gaso, se desabilitara cada vez que colectamos la gasolina
	gaso.disableBody(true,true);
	//agregamos 1 puntos mas al score cada vez que recolectmos una gasolina
	score +=10;
	scoreText.setText('Puntaje: '+ score);
	//verificamos si todas las gasolinas en el escenario estan "recolectadas" por el jugador
	if (gasolina.countActive(true) === 0)
	{
		//a los hijos de la gasolina los volvemos a habilitar tal como la primera vez
		gasolina.children.iterate(function(child){
            child.enableBody(true, child.x, 0, true, true);
        });
        //cuando todas las gasolinas esten recolectadas aparecera un enemigo: bomb
		let enemie=enemies.create(400,190,'bomb');
		enemie.setBounce(1);
		enemie.setCollideWorldBounds(true);
		enemie.setVelocity(Phaser.Math.Between(-200,200),50);
		enemie.allowGravity=false;	
	}	
}

//funcion para el colicionador entre el jugador y el enemigo: bomb
function hitEnemies(player,enemies)
{
	//paramos todas las fisicas
	this.physics.pause();
	//al juador po pintamos de un color rojo
	player.setTint(0xff0000);
	//le decimos que ejecutemos la animacion de frente
	player.anims.play('frente');
	//establecemos que el juego se a acabado
	gameOver=true;
}