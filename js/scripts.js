/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

let userHistory = {};
let currentUser = "Anonymous";
let bestScore;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


function updateScore () {
  let round = "";
  bestScore = 0;
  if (userHistory !== null) {
    for (let key in userHistory) {
      round += `${key}: ${userHistory[key]}<br>`
      bestScore = Math.max(userHistory[key], bestScore);
    }
    document.getElementById("round").innerHTML = round;
    document.getElementById("best-score").innerHTML = `${bestScore}`;
  }
}

function registerUser() {
  let storeUser = localStorage.getItem("userHistory");
  if (storeUser !== null) {
    userHistory = JSON.parse(storeUser);
  }
  let userName = document.getElementById("user").value;
  userName = userName.trim();
  if (userName != null && userName != "") {
    if (userHistory[userName] === undefined) {
      userHistory[userName] = 0;
    }
    currentUser = userName;
    document.getElementById("user").value = null;
  }
  updateScore();
}


function startGame() {
  updateScore();
  document.getElementById("start").style.visibility = 'hidden';
  let canvas = document.getElementById("game");
  let ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 600;
  let heroWidth = 40;
  let heroHeight = 40;
  let heroX = getRandomInt(canvas.width - heroWidth);
  let heroY = getRandomInt(canvas.height - heroHeight);
  let monsterX = getRandomInt(canvas.width - heroWidth);
  let monsterY = getRandomInt(canvas.height - heroHeight); 
  let score = 0;
  let bgReady, heroReady, monsterReady;
  let bgImage, heroImage, monsterImage;
  let startTime = Date.now();
  const SECONDS_PER_ROUND = 10;
  let elapsedTime = 0;
  let w = window;
  requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
  document.getElementById("reset").style.visibility = 'hidden';
  
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
      if (heroY < 0) { 
        heroY = canvas.height - heroHeight;
      } else {
        heroY -= 10;
      }
      if (monsterX < 0) { //monster go left
        monsterX = canvas.width - heroWidth;
      } else {
        monsterX -= 2;
      }
    }
    if (40 in keysDown) { // Player is holding down key
      if (heroY + 10 > canvas.height - heroHeight) { 
        heroY = 0;
      } else {
        heroY += 10;
      }
      if (monsterX + 2 > canvas.width - heroWidth) { //monster go right
        monsterX = 0;
      } else {
        monsterX += 2;
      }
    }
    if (37 in keysDown) { // Player is holding left key
      if (heroX < 0) { 
        heroX = canvas.width - heroWidth;
      } else {
        heroX -= 10;
      }
      if (monsterY < 0) {  //monster go up
        monsterY = canvas.height - heroHeight;
      } else {
        monsterY -= 2;
      }
    }
    if (39 in keysDown) { // Player is holding right key
      if (heroX + 10 > canvas.width - heroWidth) { 
        heroX = 0;
      } else {
        heroX += 10;
      }
      if (monsterY + 2 > canvas.height - heroHeight) { //monster go down
        monsterY = 0;
      } else {
        monsterY += 2;
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
    } 
  };

  let main = function () {
    if (SECONDS_PER_ROUND-elapsedTime>0) {
      update(); 
      render();
      requestAnimationFrame(main);
    } else if (SECONDS_PER_ROUND-elapsedTime==0) {
      if (!(currentUser in userHistory)) {
        userHistory[currentUser] = score;    
      } else {
        userHistory[currentUser] = Math.max(score, userHistory[currentUser]);
      }
      updateScore();
      document.getElementById("best-score").innerHTML = `${bestScore}`;
      let status = "Game Over!";
      ctx.textBaseline = "middle"; 
      ctx.font = "30px monospace";
      ctx.fillStyle = "#00FF41";
      ctx.textAlign = "center";
      ctx.fillText(status, 300, 300)
      document.getElementById("reset").style.visibility = 'visible';
      localStorage.setItem("userHistory", JSON.stringify(userHistory));
    }
    // Request to do this again ASAP. This is a special method
    // for web browsers. 
  };

  loadImages();
  setupKeyboardListeners();
  main();
}