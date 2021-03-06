/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/


let canvas;
let ctx;

//canvas = document.createElement("canvas");
canvas = document.getElementById("game");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
//canvas.style = "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: auto; border:2px solid blue";
//document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 15;
let elapsedTime = 0;

let w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
//.onload = function () : when the function callback return, it ensured the image had loaded.
function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "img/background.png";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "img/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "img/monster.png";
}

/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

/*
let heroX = canvas.width / 2;
let heroY = canvas.height / 2;
*/
let heroX = 0;
let heroY = 480-32;

let monsterX = 100;
let monsterY = 100;

let score = 0;

/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}


/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  //key code javascript, origin is top-left corner
  if (38 in keysDown) { // Player is holding up key
    if (heroY - 5<-5) { 
      heroY = 450;
    } else {
      heroY -= 5;
    }
  }
  if (40 in keysDown) { // Player is holding down key
    if (heroY + 5>450) { //approximate = 480 - 32 (the height of hero)
      heroY = 0;
    } else {
      heroY += 5;
    }
  }
  if (37 in keysDown) { // Player is holding left key
    if (heroX - 5<-5) { 
      heroX = 482;
    } else {
      heroX -= 5;
    }
  }
  if (39 in keysDown) { // Player is holding right key
    if (heroX + 5>482) { //approximate = 480 - 32 (the height of hero)
      heroX = 0;
    } else {
      heroX += 5;
    }
  }

  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    heroX <= (monsterX + 32)
    && monsterX <= (heroX + 32)
    && heroY <= (monsterY + 32)
    && monsterY <= (heroY + 32)
  ) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    monsterX = getRandomInt(481); //from 0 to 480
    monsterY = getRandomInt(449); //from 0 to 448
    score += 1;
  }
};

/**
 * This function, render, runs as often as possible.
 */
let render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 100);
  document.getElementById("score").innerHTML = `Score: ${score}`;
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
let main = function () {
  document.getElementById("score").innerHTML = `Score: ${score}`;
  update(); 
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  requestAnimationFrame(main);
};

loadImages();
setupKeyboardListeners();
main();

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.


