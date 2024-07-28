//board
let board;
let boardwidth=720;
let boardHieght=457.5;
let context;
let startaudio=document.getElementById("start");
let once=false;

//dino
let dinowidth=100;
let dinohieght=150;
let dinoX=75;
let dinoY=boardHieght-dinohieght;
let dinoimg;

let dino={
    x : dinoX,
    y:dinoY,
    width:dinowidth,
    height:dinohieght
}
//cactus
let cactusArr=[];
let cactus1width=55;
let cactus1hieght=95;
 let cactus2width=80;
// let cactus2hieght=120;
 let cactus3width=120;
// let cactus3hieght=110;
let cactusX=650;
let cactusY=boardHieght-cactus1hieght;
let cactus1Img;
 let cactus2Img;
 let cactus3Img;

//jump
let velocityx=-6.5;//cactusmoving left speed
let velocityy=0;//for jump
let gravity=.4;
var jumpaudio=document.getElementById("myAudio");

let gameOver=false;
let endaudio=document.getElementById("endaudio");
let hasplayed=false;
let playagain=document.getElementById("playagain");

//score
let score=0;
let highscore=0;

window.onload=function(){
    board=document.getElementById("board");
    board.height=boardHieght;
    board.width=boardwidth;
    context=board.getContext("2d");//used for drawing on the board
    con=board.getContext("2d");
    //draw initial dino
    // context.fillStyle="green";
    // context.fillRect(dino.x,dino.y,dino.width,dino.height);

    dinoimg=new Image();
    dinoimg.src="./images/Cute-Dino.png";
    dinoimg.onload=function(){
    context.drawImage(dinoimg,dino.x,dino.y,dino.width,dino.height);
    }
    //entry audio
     startaudio.play();
     if(once){
        startaudio.onpause();
     }
     else{
        once=true;
     }

    cactus1Img= new Image();
    cactus1Img.src="./images/cactus.png";
     cactus2Img= new Image();
     cactus2Img.src="./images/cactus2.png";
     cactus3Img= new Image();
    cactus3Img.src="./images/cactus3.png";

    
    requestAnimationFrame(update);
    setInterval(placecactus,1000)//1000millisecs=1sec
    document.addEventListener("keydown",movedino);
    document.addEventListener("touchstart",movedino);
}
function update(){
   requestAnimationFrame(update);
   if(gameOver){
    return;
}

   context.clearRect(0,0,boardwidth,boardHieght);
   //dino
   velocityy+=gravity;
   dino.y=Math.min(dino.y+velocityy,dinoY);//apply gravity
   context.drawImage(dinoimg,dino.x,dino.y,dino.width,dino.height);

   //cactus
   for(let i=0;i<cactusArr.length;i++){
      let cactus=cactusArr[i];
       cactus.x+=velocityx;
       context.drawImage(cactus.img,cactus.x,cactus.y,cactus.width,cactus.height);
       if(collision(dino,cactus)){
        endaudio.play();
           if(hasplayed){
           endaudio.onpause();
           }
           else{
           hasplayed=true;
           }
        playagain.style.visibility="visible";
         playagain.onclick=function(){
            location.reload();
         }
          gameOver=true;
        
       }
   }
  
   //score
     context.fillStyle="black";
     context.font="20px courier";
     score++;
     context.fillText(score,5,20);
   //high score
   if(highscore<score)
    highscore=score;
    context.strokeText(highscore,650,20);
}
   

function movedino(e){
    if(gameOver){
        return;
    }

    if ((e.code=="Space"|| e.code=="ArrowUp" || e.code=="touchstart") && dino.y==dinoY){
       //jump
       jumpaudio.play();
       velocityy=-11.75;
    }

}

function placecactus(){
     //place cactus
     let cactus={
        img:null,
        x:cactusX,
        y:cactusY,
        width:null,
        height:cactus1hieght

     }
     let placecactusChance=Math.random();
     if(placecactusChance>.95){
        cactus.img=cactus3Img;
        cactus.width=cactus3width;
        cactusArr.push(cactus);
     }
     else if(placecactusChance>.70){
        cactus.img=cactus2Img;
        cactus.width=cactus2width;
        cactusArr.push(cactus);
     }

     else if(placecactusChance>.45){
        cactus.img=cactus1Img;
        cactus.width=cactus1width;
        cactusArr.push(cactus);
     }

     if(cactusArr.length>5){
       cactusArr.shift();//removes extra cactus to reduce memory space
     }
}


function collision(a,b){
    return a.x<b.x+b.width && 
           a.x+a.width>b.x &&
           a.y<b.y+b.height &&
           a.y+a.height>b.y;
}
