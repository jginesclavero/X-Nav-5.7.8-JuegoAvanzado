// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

//stone image

var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

//monster image

var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

var hearthReady = false;
var hearthImage = new Image();
hearthImage.onload = function () {
	hearthReady = false;
};
hearthImage.src = "images/hearth.png";


// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var princessesCaught = localStorage.getItem("princess");
if (princessesCaught == null){
	princessesCaught = 0;
}
var level = localStorage.getItem("level");
if (level == null){
	level = 1;
}
var lives = localStorage.getItem("lives");
if (lives == null){
	lives = 3;
}

var stone ={};
var monster = {};
var hearth = {};
var moves = 0;
var hearth_go = Math.floor((Math.random()*25)+1);


var stone_array = [];
var monster_array = [];

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	stone_array = [];
	monster_array = [];
	

	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	princess.x = 32 + (Math.random() * (canvas.width - 84));
	princess.y = 32 + (Math.random() * (canvas.height - 84));

	if(moves==hearth_go){
		hearth.x = 32 + (Math.random() * (canvas.width - 84));
		hearth.y = 32 + (Math.random() * (canvas.width - 84));
		hearthReady = true;
	}else{
		hearthReady = false;
	}
	

	for(i=0; i<level ;i++){
		var stone_aux = {};
		stone_aux.x = 32 + (Math.random() * (canvas.width - 84));
		stone_aux.y = 32 + (Math.random() * (canvas.height - 84));
		stone_array[i] = stone_aux;
	}

	for(i=0; i<level ;i++){
		var monster_aux = {};
		monster_aux.x = 32 + (Math.random() * (canvas.width - 84));
		monster_aux.y = 32 + (Math.random() * (canvas.height - 84));
		monster_array[i]=monster_aux;
	}
	
	if(((hero.x < stone.x +30) && 
		(hero.x > stone.x-30) && 
		(hero.y < stone.y +30) && 
		(hero.y > stone.y-30))|| 
		((princess.x < stone.x + 30) && 
		(princess.x > stone.x -30 ) &&
		(princess.y < stone.y +30 ) &&
		(princess.y > stone.y -30 ))){

		stone.x = 32 + (Math.random() * (canvas.width - 84));
		stone.y = 32 + (Math.random() * (canvas.height - 84));
	}

};

// Update game objects
var update = function (modifier) {

	var hero_x_last = hero.x;
	var hero_y_last = hero.y;
	

	if (38 in keysDown && hero.y>20) { // Player holding up
		hero.y -= hero.speed * modifier;
	} 
	if (40 in keysDown && hero.y<420) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown && hero.x>20) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown && hero.x<460) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	for(i=0;i<stone_array.length;i++){
		if((hero.x>stone_array[i].x-30) && 
		   (hero.x<stone_array[i].x+30) && 
		   (hero.y>stone_array[i].y-30) && 
		   (hero.y<stone_array[i].y+30)){

			hero.x = hero_x_last;
			hero.y = hero_y_last;
		}	
	}	
	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		moves = moves + 1;
		++princessesCaught;
		localStorage.setItem("princess", princessesCaught);
		reset();
	}

	if (
		hero.x <= (hearth.x + 16)
		&& hearth.x <= (hero.x + 16)
		&& hero.y <= (hearth.y + 16)
		&& hearth.y <= (hero.y + 32)
	) {
		lives = lives + 1;
		localStorage.setItem("lives", lives);
		hearthReady = false;
		hearth.x = 0;
		hearth.y = 0;
		moves = 0;
		reset();
	}

	//monster touch
	for(i=0;i<monster_array.length;i++){
		if (
		hero.x <= (monster_array[i].x + 16)
		&& monster_array[i].x <= (hero.x + 16)
		&& hero.y <= (monster_array[i].y + 16)
		&& monster_array[i].y <= (hero.y + 32)
	) {
		--lives;
		localStorage.setItem("lives", lives);
		
		reset();
	}
	}
	

	if (lives <= 0){
		level=1;
		princessesCaught = 0;
		lives = 3;
		localStorage.setItem("level", level);
		localStorage.setItem("lives", lives);
		localStorage.setItem("princess", princessesCaught);
		reset();
	}

	if (princessesCaught == 5){
		princessesCaught = 0;
		++level;
		localStorage.setItem("level", level);
		localStorage.setItem("princess", princessesCaught);
		reset();

	}

};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);

	}
	if(stoneReady){
		for(i=0;i<stone_array.length;i++){
			ctx.drawImage(stoneImage, stone_array[i].x, stone_array[i].y);
		}
		
	}
	if(monsterReady){
		for(i=0; i<monster_array.length;i++){
			ctx.drawImage(monsterImage, monster_array[i].x, monster_array[i].y);
		}
		
	}

	if (hearthReady) {
		ctx.drawImage(hearthImage, hearth.x, hearth.y);

	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
	ctx.fillText("Level: " + level, 32, 50);
	ctx.fillText("Lives: " + lives, 400, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
