const grid = document.querySelector('.grid');
const doodler = document.createElement('img');
doodler.src = './images/wolf.png';
const startBtn = document.querySelector('button');
const para = document.querySelector('p');

// Game Over
const gameEnd = document.createElement('div');
const scoreCount = document.createElement('p');
const goPara = document.createElement('p');
const restart = document.createElement('button');
//  ____

let platforms = [];
let startPoint = 150;
let doodlerLeftSpace = 50;
let doodlerBottomSpace = startPoint;
let isGameOver = false;
let platformCount = 5;
let upTimerId;
let downTimerId;
let isJumping = true;
let isGoingLeft = false;
let isGoingRight = false;
let leftTimerId;
let rightTimerId;
let score = 0;

// Doodler
function createDoodler() {
  grid.appendChild(doodler);
  doodler.classList.add('doodler');
  doodlerLeftSpace = platforms[0].left - 15;
  doodlerBottomSpace = platforms[0].bottom + 25;

  doodler.style.left = doodlerLeftSpace + 'px';
  doodler.style.bottom = doodlerBottomSpace + 'px';
}

// Doodler movement
function fall() {
  let isJumping = false;
  clearInterval(upTimerId);
  downTimerId = setInterval(function() {
    doodlerBottomSpace -= 5;
    doodler.style.bottom = doodlerBottomSpace + 'px';
    if (doodlerBottomSpace <= 0) {
      gameOver();
    }
    platforms.forEach(platform => {
      if ((doodlerBottomSpace >= platform.bottom) &&
          (doodlerBottomSpace <= platform.bottom + 25) &&
          ((doodlerLeftSpace + 100) >= platform.left) &&
          (doodlerLeftSpace <= (platform.left + 100)) && !isJumping) {
        startPoint = doodlerBottomSpace;
        jump();
      }
    });
  }, 15);
}
function jump() {
  let isJumping = true;
  clearInterval(downTimerId);
  upTimerId = setInterval(function() {
    doodlerBottomSpace += 20;
    doodler.style.bottom = doodlerBottomSpace + 'px';
    if (doodlerBottomSpace > startPoint + 300 || doodlerBottomSpace >= 800) {
      fall();
    }
  }, 20);
}

function moveStraight() {
  isGoingLeft = false;
  isGoingRight = false;
  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
}
function moveLeft() {
  isGoingLeft = true;
  clearInterval(leftTimerId);
  if (isGoingRight) {
    clearInterval(rightTimerId);
    isGoingRight = false;
  }
  leftTimerId = setInterval(function() {
    if (doodlerLeftSpace >= 0) {
      doodlerLeftSpace -= 5;
      doodler.style.left = doodlerLeftSpace + 'px';
    } else
      moveRight();
  }, 20);
}

function moveRight() {
  isGoingRight = true;
  clearInterval(rightTimerId);
  if (isGoingLeft) {
    clearInterval(leftTimerId);
    isGoingLeft = false;
  }
  rightTimerId = setInterval(function() {
    if (doodlerLeftSpace <= 400) {
      doodlerLeftSpace += 5;
      doodler.style.left = doodlerLeftSpace + 'px';
    } else
      moveLeft();
  }, 20);
}
// Platforms

// Initialization
class Platform {
  constructor(newPlatBottom) {
    this.bottom = newPlatBottom;
    this.left = Math.random() * 401;
    this.visual = document.createElement('div');

    const visual = this.visual;
    visual.classList.add('platform');
    visual.style.left = this.left + 'px';
    visual.style.bottom = this.bottom + 'px';
    grid.appendChild(visual);
  }
}

function createPlatforms() {
  for (let i = 0; i < platformCount; i++) {
    let platformGap = 800 / platformCount;
    let newPlatBottom = 100 + i * platformGap;
    let newPlatform = new Platform(newPlatBottom);
    platforms.push(newPlatform);
  }
}

// Movement
function movePlatforms() {
  if (doodlerBottomSpace > 200) {
    platforms.forEach(platform => {
      platform.bottom -= 4;
      let visual = platform.visual;
      visual.style.bottom = platform.bottom + 'px';

      if (platform.bottom < 10) {
        let firstPlatform = platforms[0].visual;
        firstPlatform.classList.remove('platform');
        platforms.shift();
        score++;
        let newPlatform = new Platform(800);
        platforms.push(newPlatform);
      }
    });
  }
}

// Game functionality
function control(e) {
  if (e.key === 'ArrowLeft') {
    doodler.style.transform = 'rotateY(180deg)';
    moveLeft();
  } else if (e.key === 'ArrowRight') {
    doodler.style.transform = 'rotateY(360deg)';
    moveRight();
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    moveStraight();
  }
}

function mobileControl(e) {
  console.log();

  if (e.touches[0].clientX > 0 && e.touches[0].clientX < 200) {
    doodler.style.transform = 'rotateY(180deg)';
    moveLeft();
  } else if (e.touches[0].clientX > 320 && e.touches[0].clientX < 600) {
    doodler.style.transform = 'rotateY(360deg)';
    moveRight();
  } else if (e.touches[0].clientX > 200 && e.touches[0].clientX < 320) {
    moveStraight();
  }
}

function gameOver() {
  console.log('Game Over!');
  isGameOver = true;

  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }


  grid.appendChild(gameEnd);

  scoreCount.textContent = score;
  scoreCount.classList.add('score');
  gameEnd.appendChild(scoreCount);


  goPara.textContent = 'Game Over!'
  gameEnd.appendChild(goPara);

  restart.textContent = 'Play Again'
  gameEnd.appendChild(restart);
  restart.addEventListener('click', restartGame);

  clearInterval(upTimerId);
  clearInterval(downTimerId);
  clearInterval(rightTimerId);
  clearInterval(leftTimerId);
}

function start() {
  if (startBtn.parentNode === grid || para.parentNode === grid) {
    grid.removeChild(startBtn);
    grid.removeChild(para);
  }
  if (!isGameOver) {
    createPlatforms();
    createDoodler();
    setInterval(movePlatforms, 30);
    jump();
    document.addEventListener('keyup', control);
    document.addEventListener('touchstart', mobileControl);
  }
}

startBtn.addEventListener('click', start);

function restartGame() {
  score = 0;
  startPoint = 150;
  doodlerLeftSpace = 50;
  doodlerBottomSpace = startPoint;
  isGameOver = false;
  platforms = [];
  grid.removeChild(gameEnd);
  start();
}

// Attach to button
