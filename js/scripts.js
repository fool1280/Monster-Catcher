/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function startGame() {
  let canvas = document.getElementById("game");
  let ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 600;
  let heroWidth = 40;
  let heroHeight = 40;
  let heroX = 280;
  let heroY = 280;
  let monsterX = getRandomInt(canvas.width - heroWidth);
  let monsterY = getRandomInt(canvas.height - heroHeight); 
  let score = 0;
  let bgReady, heroReady, monsterReady;
  let bgImage, heroImage, monsterImage;
  let startTime = Date.now();
  const SECONDS_PER_ROUND = 15;
  let elapsedTime = 0;
  let w = window;
  requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
  //.onload = function () : when the function callback return, it ensured the image had loaded.

  function loadImages() {
    bgImage = new Image();
    bgImage.onload = function () {
      // show the background image
      bgReady = true;
    };
    bgImage.src = "img/game.png";
    heroImage = new Image();
    heroImage.onload = function () {
      // show the hero image
      heroReady = true;
    };
    heroImage.src = "img/main.png";
    monsterImage = new Image();
    monsterImage.onload = function () {
      // show the monster image
      monsterReady = true;
    };
    monsterImage.src = "img/monster.png";
  }

  let keysDown = {};
  function setupKeyboardListeners() {
    addEventListener("keydown", function (key) {
      keysDown[key.keyCode] = true;
    }, false);
    addEventListener("keyup", function (key) {
      delete keysDown[key.keyCode];
    }, false);
  }

  let update = function () {
    // Update the time.
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    //key code javascript, origin is top-left corner
    if (38 in keysDown) { // Player is holding up key
      if (heroY - 5 < -5) { 
        heroY = canvas.height - heroHeight;
      } else {
        heroY -= 5;
      }
    }
    if (40 in keysDown) { // Player is holding down key
      if (heroY + 5 > canvas.height - heroHeight) { 
        heroY = 0;
      } else {
        heroY += 5;
      }
    }
    if (37 in keysDown) { // Player is holding left key
    if (heroX - 5 < -5) { 
        heroX = canvas.width - heroWidth;
      } else {
        heroX -= 5;
      }
    }
    if (39 in keysDown) { // Player is holding right key
      if (heroX + 5 > canvas.width - heroWidth) { 
        heroX = 0;
      } else {
        heroX += 5;
      }
    }
    // Check if player and monster collided. Our images
    // are about 32 pixels big.
    if (
      heroX <= (monsterX + 40)
      && monsterX <= (heroX + 40)
      && heroY <= (monsterY + 40)
      && monsterY <= (heroY + 40)
    ) {
      // Pick a new location for the monster.
      // Note: Change this to place the monster at a new, random location.
      monsterX = getRandomInt(canvas.width - heroWidth);
      monsterY = Math.max(getRandomInt(canvas.height - heroHeight), 20); 
      score += 1;
    }
  };

  let render = function () {
    if (SECONDS_PER_ROUND-elapsedTime>=0) {
      if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
      }
      if (heroReady) {
        ctx.drawImage(heroImage, heroX, heroY);
      }
      if (monsterReady) {
        ctx.drawImage(monsterImage, monsterX, monsterY);
      }
      ctx.font = "30px monospace";
      ctx.textBaseline = "middle"; 
      ctx.fillStyle = "#00FF41";
      ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 10, 20);
      document.getElementById("score").innerHTML = `${score}`
    } else {
      let status = "Game Over!";
      ctx.textBaseline = "middle"; 
      ctx.textAlign = "center";
      ctx.font = "30px monospace";
      ctx.fillStyle = "#00FF41";
      ctx.fillText(status, 300, 300)
    }
  };

  let main = function () {
    update(); 
    render();
    // Request to do this again ASAP. This is a special method
    // for web browsers. 
    requestAnimationFrame(main);
  };

  loadImages();
  setupKeyboardListeners();
  main();
}