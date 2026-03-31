//board
let board;
let boardwidth = 750;
let boardheight = 250;
let context;

//sound
let jumpsound = new Audio("assets/fahh.mp3");
let gameOverSound = new Audio("assets/explosion.mp3");

//player
let playerWidth = 88;
let playerHeight = 94;
let playerX = 50;
let playerY = boardheight - playerHeight;
let playerImg;

let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
}

//obstacle
let obstacleArray = [];

let obstacle1Width = 25;
let obstacle2Width = 30;
let obstacle3Width = 80;

let obstacle1Height = 60;
let obstacleX = 700;
let obstacleY = boardheight - obstacle1Height;

let player1Img;
let player2Img;
let player3Img;

//phsyics
let velocityX = -8; //obstacle moving speed
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = this.document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;

    boardImg = new Image();
    boardImg.src = "assets/board.svg"

    context = board.getContext("2d");

    playerImg = new Image();
    playerImg.src = "assets/pudding.png";
    playerImg.onload = function() {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    obstacle1Img = new Image();
    obstacle1Img.src = "assets/polygon1.svg";

    obstacle2Img = new Image();
    obstacle2Img.src = "assets/polygon2.svg";

    obstacle3Img = new Image();
    obstacle3Img.src = "assets/polygon3.svg";

    requestAnimationFrame(update);
    setInterval(placeObstacle, 1000)
    document.addEventListener("keydown", movePlayer)
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(boardImg, 0, 0, board.width, board.height);

    //player
    velocityY += gravity;
    player.y = Math.min(player.y + velocityY, playerY); //apply gravity to current player.y, making sure it doesnt exceed the ground
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    //obstacle
    for (let i = 0; i < obstacleArray.length; i++) {
        let obstacle = obstacleArray[i];
        obstacle.x += velocityX
        context.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        if (!gameOver && detectCollision(player, obstacle)) {
            gameOver = true;

            document.getElementById("gameOver").style.display = "flex";

            let video = document.getElementById("gameOverVideo");
            video.currentTime = 0;    
            video.play();

            gameOverSound.currentTime = 0;
            gameOverSound.play();

        }
    }

    //score
    context.fillStyle = "black";
    context.font= "20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function movePlayer(e){
    if (gameOver){
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && player.y == playerY) {
        //jump
        velocityY = -10;

        jumpsound.currentTime = 0;
        jumpsound.play();
    }
}

function placeObstacle(){
    if (gameOver){
        return;
    }

    //place obstacle
    let obstacle = {
        img: null,
        x: obstacleX,
        y: obstacleY,
        width: null,
        height: obstacle1Height
    }

    let placeObstacleChance = Math.random(); 
    if(placeObstacleChance > .90) {
        obstacle.img = obstacle3Img;
        obstacle.width = obstacle3Width;
        obstacleArray.push(obstacle);
    }
    else if(placeObstacleChance > .70) {
        obstacle.img = obstacle2Img;
        obstacle.width = obstacle2Width;
        obstacleArray.push(obstacle);
    }
    else if(placeObstacleChance > .50) {
        obstacle.img = obstacle1Img;
        obstacle.width = obstacle1Width;
        obstacleArray.push(obstacle);
    }

    if (obstacleArray.length > 5) {
        obstacleArray.shift(); //remove the first element from the array so that the array doesnt constantly grow
    }
}

function restartGame() {
    location.reload();
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && //a's top left corner doesnt reach b's top right corner
           a.x + a.width > b.x && //a's top right corner passes b's top left corner
           a.y < b.y + b.height && //a's top left corner doesnt reach b's bottom left corner
           a.y + a.height > b.y; //a's bottom left corner passes b's top left corner

}
