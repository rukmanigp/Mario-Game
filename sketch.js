//https://editor.p5js.org/RukmaniG/sketches/NMvFE6Mw5
//https://docs.google.com/spreadsheets/d/1l9mEKhaPOs4EzU5kSbgqSVgfkRStret8vk-A3ehE9HE/edit#gid=0
//https://docs.google.com/spreadsheets/d/e/2PACX-1vRaTpYh7Qpx70S2eKWeJXtCoFCp6kT99RTsClhx7Jxy-9ewH_1zsCKUQviWLzmGYgVdA7qqQTX-VaiG/pubhtml#
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var mario, marioAnim, marioAnim_collided, ground, groundImage, iground;
var cloud, cloudImage, brickImage, bricksGroup;
var obstacleGroup, obstacleImage, obstacle1, obstacle2, obstacle3, obstacle4;
var score = 0,
  highscore = 0;
var gameOver, restart, gameOverImg, restartImg;
var jumpSound, dieSound, checkPointSound;
var brick;

function preload() {
  marioAnim = loadAnimation('mario00.png', 'mario01.png', 'mario02.png', 'mario03.png');
  marioAnim_collided = loadAnimation('collided.png');
  groundImage = loadImage('ground2.png');
  cloudImage = loadImage('bg.png');
  brickImage = loadImage('brick.png');
  obstacle1 = loadImage('obstacle1.png');
  obstacle2 = loadImage('obstacle2.png');
  obstacle3 = loadImage('obstacle3.png');
  obstacle4 = loadImage('obstacle4.png');
  gameOverImg = loadImage('gameOver.png');
  restartImg = loadImage('restart.png');

  jumpSound = loadSound('jump.mp3');
  dieSound = loadSound('die.mp3');
  checkPointSound = loadSound('checkPoint.mp3');
}


function setup() {
  createCanvas(600,400);
  mario = createSprite(100,150,10,10);
  mario.addAnimation('running', marioAnim);

  mario.addAnimation('collided', marioAnim_collided)
  mario.setCollider('rectangle', 0, 0, 30, 30);
  mario.debug = true;
  mario.scale = 2.5;
  mario.height = windowHeight - 175;
  //creating ground so that Mario doesnt go further down
  ground = createSprite(600,400,600,10);
  ground.addImage('g1', groundImage);
  ground.x = ground.width / 2;
  cloud = createSprite(400,300,600,10);
  cloud.addImage('c1', cloudImage);

  cloud.scale = 1.5                              
  //to show forward movement of Mario
  // ground.velocityX = -4;
  //  cloud.velocityX=-20 ;
  //to make Mario collide with the iground to remove the gap between Mario and the ground image and also make visibility false
  iground = createSprite(width - 600, height, 300, 10);

  ground.visible = true;
  iground.visible = false;


  bricksGroup = new Group();
  obstacleGroup = new Group();

  score = 0;
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale =0.5;
  restart = createSprite(300,200);
  restart.addImage(restartImg);
 restart.scale = 0.5;


}

function draw() {

  background('#6185f8');
  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    //console.log(mario.y);
    //mario.y=windowHeight   

    ground.velocityX = -15;
 //cloud.velocityX=-10;








    if (keyDown("space") && mario.y >= 100) {

     mario.velocityY = -5; // to make Mario jump up
      jumpSound.play();
    }

    if (score % 100 === 0 && score > 0) {
      checkPointSound.play();

    }

    //add gravity
    mario.velocityY = mario.velocityY + 0.5;
    if (ground.x < 0) {
      ground.x = ground.width / 2; // to give ground infinite look
    }
      
    if (iground.x < 0) {
      iground.x = iground.width / 2; // to give ground infinite look
    }



    //for displaying objects
    spawnbricks();
    spawnObstacle();

    if (obstacleGroup.isTouching(mario)) {
      gameState = END;

      dieSound.play();
      // mario.velocityY=-12;
      //jumpSound.play();
    }


    for (var i = 0; i < bricksGroup.length; i++) {
      if (bricksGroup.get(i).isTouching(mario)) {
        score = score + 1;
        bricksGroup.get(i).destroy();

      }
    }

  } else {
    if (gameState === END) {
      gameOver.depth = gameOver.depth + 4;
      restart.depth = restart.depth + 4;

      gameOver.visible = true;
      restart.visible = true;

      ground.velocityX = 0;
      cloud.velocityX = 0;
      mario.velocityY = 0;
      if (highscore < score) {
        highscore = score;
      }
      //mario.y = windowHeight - 175;
      mario.changeAnimation('collided', marioAnim_collided)
      obstacleGroup.setLifetimeEach(-1);

      bricksGroup.setLifetimeEach(-1);

      obstacleGroup.setVelocityXEach(0);
      bricksGroup.setVelocityXEach(0);



      if (mousePressedOver(restart)) {
        reset();
      }



    }
  }


  // to make Mario jummp

  mario.collide(ground);




  //console.log(restart.visible)

  drawSprites();


  stroke("black");
  textSize(20);
  fill("black");

  text("Score : " + Math.round(score), 300, 20);
  // text("HighScore : " + Math.round(highscore), 300, 70);

}

function reset() {

  gameState = PLAY;
  obstacleGroup.destroyEach();
  bricksGroup.destroyEach();
  mario.changeAnimation("running", marioAnim);
  score = 0;

}

function spawnbricks() {

  if (frameCount % 100 === 0) {

    brick = createSprite(600,200);
    brick.addImage('b1', brickImage);
    //brick.velocityX = -(4+score/600);
    brick.velocityX = -10;

    brick.y = Math.round(random(240, 200));
    brick.scale = 1.5







    ground.depth = ground.depth + 4;
    cloud.depth = mario.depth;
    mario.depth = mario.depth + 4;
    //brick.depth=brick.depth+4;




    bricksGroup.add(brick);
    brick.lifetime = 300;


  }

}

function spawnObstacle() {

  if (frameCount % 80 === 0) {
    obstacleImage = createSprite(600,200); // width and height not required
    // obstacleImage.velocityX = -(4 + score / 900); //-ve value to make obstacle to move from left to right
    obstacleImage.velocityX = -10
   // obstacleImage.scale = 2

    var r = Math.round(random(1, 4));
    obstacleImage.y = 340
    //console.log("R = "+r);
    switch (r) {
      case 1:
        obstacleImage.addImage('o1', obstacle1);

        break;
      case 2:
        obstacleImage.addImage('o2', obstacle2);

        break;
      case 3:
        obstacleImage.addImage('o3', obstacle3);

        break;
      case 4:
        obstacleImage.addImage('o4', obstacle4);

        break;
      default:
        break;


    }

    obstacleGroup.add(obstacleImage);
    obstacleImage.lifetime = 300;
  }

}