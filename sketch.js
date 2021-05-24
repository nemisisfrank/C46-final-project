var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boy, boy_running, boy_collided;
var ground, invisibleGround, groundImage;

var lifesGroup, life1, life2, life3, life4;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;


var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound;
var backgroundImg


function preload(){
  boy_running = loadAnimation("b1.png","b2.png","b3.png","b4.png");
  boy_collided = loadAnimation("b5.png");
  
  backgroundImg = loadImage("backgroundImg.png")

  groundImage = loadImage("ground.png");
 // prayerImg = loadImage("praying-hands.png")
  
  life1 = loadImage("pouch.png");
  life2 = loadImage("Books.png");
  life3 = loadImage("graduation.png");
  life4 = loadImage("Books.png");
  //life5 = loadImage("mask2.png");
 // life6 = loadImage("mask2.png");

  
  obstacle1 = loadImage("television.png");
  obstacle2 = loadImage("phone.png");
  obstacle3 = loadImage("controller.png");
  obstacle4 = loadImage("Laptop.png");
  //obstacle5 = loadImage("covid.png");
 // obstacle6 = loadImage("covid3.png");


  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  var message = "This is a message";
  
  boy = createSprite(100,0,20,50);
  boy.addAnimation("running", boy_running);
  boy.addAnimation("collided", boy_collided);
  

  boy.scale = 0.4;
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale = 1;

  gameOver = createSprite(windowWidth/2,windowHeight/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,windowHeight/2-100);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height,width,125);
  invisibleGround.visible = false;
  
  //create Obstacle and life Groups
  obstaclesGroup = createGroup();
  lifesGroup = createGroup();
  
  
  boy.setCollider("rectangle",0,0,boy.width,boy.height);
  boy.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(backgroundImg);
  //displaying score
  textSize(30);
  stroke("white");
  text("Score: "+ score, 30,50);
     //console.log(boy.x)

  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    //ground.velocityX = -5;
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    //score = score + Math.round(getFrameRate()/30);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 

    }
    
    if (ground.x < 0){
      ground.x = ground.width /2;
    }

    //jump when the space key is pressed
    if(keyDown("space")&& boy.y >= 100) {
        boy.velocityY = -12;
        jumpSound.play();
    }
    
    for (var i = 0; i < lifesGroup.length; i++) 
    {
      if (boy.isTouching(lifesGroup.get(i)) )
        {
          lifesGroup.get(i).destroy();                 
          score+=5; 
        }
    } 
    
   
    
    //add gravity
    boy.velocityY = boy.velocityY + 0.8
  
    //spawn the life
    spawnLife();
  
    //spawn obstacles on the ground
    spawnObstacles();


    
    if(obstaclesGroup.isTouching(boy)){
        //boy.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      gameOver.depth+=100
      restart.depth+=100
     
     //change the boy animation
      boy.changeAnimation("collided", boy_collided);
    
      ground.velocityX = 0;
      boy.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    lifesGroup.setLifetimeEach(-1);
 
     
     obstaclesGroup.setVelocityXEach(0);
     lifesGroup.setVelocityXEach(0); 

     
   }
  
  //stop boy from falling down
  boy.collide(invisibleGround);
 
     if(mousePressedOver(restart)) {
      reset();
    }

  drawSprites();
}

function reset(){
 gameState= PLAY;
 boy.changeAnimation("running",boy_running);
 gameOver.visible=false;
 restart.visible=false;
 obstaclesGroup.destroyEach();
   lifesGroup.destroyEach();

  score=0;
   boy.addAnimation("running", boy_running);
  
}


function spawnObstacles(){
 if (frameCount % 80 === 0){
   var obstacle = createSprite(width+20,height-95,20,30);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
    
      default: break;
    }
    
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnLife() {
  //write code here to spawn the life
  if (frameCount % 80 === 0) {
    var life = createSprite(width+20,height-300,40,10);
    life.y = Math.round(random(100, 250));

    //generate random lifes
    var rand = Math.round(random(1,4));

    switch(rand) {
      case 1: life.addImage(life1);
              break;
      case 2: life.addImage(life2);
              break;
      case 3: life.addImage(life3);
              break;
      case 4: life.addImage(life4);
              break;
      
      default: break;
    }
    life.scale = 0.3;
    life.velocityX = -(6 + score/100);
    
     //assign lifetime to the variable
     life.lifetime = 600;
    
    //adjust the depth
    life.depth = boy.depth;
    boy.depth = boy.depth + 1;
    
    //add each life to the group
    lifesGroup.add(life);
  }
}


