let board;
let boardwidth=360;
let boardheight=576;
let context;

let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardwidth/2 - doodlerWidth/2;
let doodlerY = boardheight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;


let doodler ={
    img :null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}

let velocityX = 0;
let velocityY =0; //jump speed
let initialvelocityY = -8; 
let gravity = 0.4;


let platformArray=[];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score=0;
let maxScore=0;
let gameover=false;


//loading stuff
window.onload = function(){
    board = document.getElementById("board");
    board.height=boardheight;
    board.width=boardwidth;
    context= board.getContext("2d");

    // context.fillStyle = "green";
    // context.fillRect(doodler.x, doodler.y, doodler.width,doodlerHeight);

    doodlerRightImg = new Image();
    doodlerRightImg.src = "./Assets/doodler-right.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function() {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./Assets/doodler-left.png";

    platformImg = new Image();
    platformImg.src = "./Assets/platform.png";

    velocityY = initialvelocityY;

    placeplatforms();
    requestAnimationFrame(update);
    document.addEventListener('keydown', moveDoodler)
}


//updates it everyframe
function update(){
    requestAnimationFrame(update)

    if(gameover){
        return;
    }
    context.clearRect(0, 0, boardwidth, boardheight)

    doodler.x +=velocityX;

    if(doodler.x>boardwidth){
        doodler.x =0;
    }
    else if(doodler.x + doodler.width < 0){
        doodler.x=boardwidth;
    }

    velocityY +=gravity;
    doodler.y +=velocityY;
    if(doodler.y>board.height){
        gameover=true;
    }

    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    for(let i=0;i<platformArray.length; i++){
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardheight*3/4){
            platform.y -=initialvelocityY; //slide all the platforms down while the doodler is above 
        }
        if (detectCollision(doodler, platform) &&  velocityY>=0){
            velocityY = initialvelocityY; // jump off
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height)
    }

    //clear outs old platforms and generates new ones
    while(platformArray.length>0 && platformArray[0].y >= boardheight){
        platformArray.shift(); //shift removes the first element of array
        newPlatform();
    }

    updatescore();
    context.fillStyle="black";
    context.font="16px sans-sarif";
    context.fillText(score, 5,20);

    if(gameover){
        context.fillText("Game Over: Press Space To ReStart", boardwidth/7, boardheight*7/8)
    }
}



function moveDoodler(e) {
    if(e.code == "ArrowRight" || e.code == "KeyD") { //move right
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }

    else if (e.code == "ArrowLeft" || e.code == "KeyA"){ //move left
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }

    else if (e.code=="Space" && gameover){
        //reset
        doodler ={
            img :doodlerRightImg,
            x : doodlerX,
            y : doodlerY,
            width : doodlerWidth,
            height : doodlerHeight
        }

        velocityX=0;
        velocityY=initialvelocityY;
        score=0;
        maxScore=0;
        gameover=false;
        placeplatforms();
    }
}



function placeplatforms(){
    platformArray = [];
// starting platform
    let platform ={
        img : platformImg,
        x : boardwidth/2,
        y : boardheight-50,
        width: platformWidth,
        height: platformHeight
    }

    platformArray.push(platform);

    // platform ={
    //     img : platformImg,
    //     x : boardwidth/2,
    //     y : boardheight-150,
    //     width: platformWidth,
    //     height: platformHeight
    // }

    // platformArray.push(platform);

    for(let i =0;i<6;i++)
    {
        let randomX = Math.floor(Math.random() * boardwidth*3/4);// (0-1)*boardwidth*3/4
        let platform ={
            img : platformImg,
            x : randomX,
            y : boardheight-75*i -150,
            width: platformWidth,
            height: platformHeight
        }
    
        platformArray.push(platform);
    }
}




function newPlatform(){
    let randomX = Math.floor(Math.random() * boardwidth*3/4);// (0-1)*boardwidth*3/4
    let platform ={
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width: platformWidth,
        height: platformHeight
    }

    platformArray.push(platform);
}



function detectCollision(a,b){
    return a.x < b.x + b.width && // a's top left corner doesnt reach b's right
    a.x + a.width > b.x && // a's top right corner doesn reach b's left
    a.y < b.y + b.height && // a's top left doesnt reach b's bottom left
    a.y + a.height > b.y; // a's bottom left passes b's top left 
}


function updatescore(){
    let points = Math.floor(50*Math.random());
    if(velocityY<0 )//going up
    maxScore+=points;
    if(score<maxScore){
        score=maxScore;
    }
    else if(velocityY>=0){
        maxScore -=points;
    }
}