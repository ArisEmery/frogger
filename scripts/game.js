//------------------------------------------------------------------
//
// This provides the "game" code.
//
//------------------------------------------------------------------
(function () {
    'use strict';
    const MAPSIZE =15;
    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext("2d");
    let lastTimeStamp = performance.now();
    let gameOver=false;
    let gameWon=false;
    let gameReady=true;
    let numLives=3;
    let cars = [];
    let logs = [];
    let xZonesClone=[];
    let turtles = [];
    let turtleRenders=[];
    let alligators=[];
    let alligatorRenders=[];
    let landingZones =[];
    let done =false;
    let popped=false;
    let timeLeft=60;
    let renderZones=[];
    let insects = [];
    let xZones=[];
    let xHit=0;
    let finalScore=0;
    let upKey=localStorage.getItem('upKey');
    let leftKey=localStorage.getItem('leftKey');
    let rightKey=localStorage.getItem('rightKey');
    let downKey=localStorage.getItem('downKey');
    let music = new Audio("assets/music.wav");
    let squash = new Audio("assets/squash.wav");
    let plunk = new Audio("assets/plunk.wav");
    let victory = new Audio("assets/victory.wav");
    let hop = new Audio("assets/hop.wav");
    let coin = new Audio("assets/coin.wav");
    let furthestPointReached= canvas.height-(canvas.height/MAPSIZE*2) -(canvas.height/MAPSIZE/2);
    window.addEventListener('keydown', onKeyDownDefault);
    window.addEventListener('keydown', onKeyDown);

    let timeBar = createBox({
        left: canvas.width/2+50,
        top: canvas.height-canvas.height/MAPSIZE*1.5,
        width: 200,
        height: 25,
        rotationRate: 2 * Math.PI / 10000,   // rate in ms
        fillStyle: 'rgba(0, 255, 0, 1)'
    });

    let imgGrass = new Image();
    imgGrass.isReady = false;
    imgGrass.onload = function() {
        this.isReady = true;
    };
    imgGrass.src = 'assets/grass.png';

    let imgRoad = new Image();
    imgRoad.isReady = false;
    imgRoad.onload = function() {
        this.isReady = true;
    };
    imgRoad.src = 'assets/road.png';

    let imgWater = new Image();
    imgWater.isReady = false;
    imgWater.onload = function() {
        this.isReady = true;
    };
    imgWater.src = 'assets/water.png';

    let imgLily = new Image();
    imgLily.isReady = false;
    imgLily.onload = function() {
        this.isReady = true;
    };
    imgLily.src = 'assets/lily.png';

    let yellowCar = new Image();
    yellowCar.isReady = false;
    yellowCar.onload = function() {
        this.isReady = true;
    };
    yellowCar.src = 'assets/yellow-car.png';

    let stripedCar = new Image();
    stripedCar.isReady = false;
    stripedCar.onload = function() {
        this.isReady = true;
    };
    stripedCar.src = 'assets/stripe-car.png';

    let blueCar = new Image();
    blueCar.isReady = false;
    blueCar.onload = function() {
        this.isReady = true;
    };
    blueCar.src = 'assets/blue-car.png';

    let truck = new Image();
    truck.isReady = false;
    truck.onload = function() {
        this.isReady = true;
    };
    truck.src = 'assets/truck.png';

    let fireTruck = new Image();
    fireTruck.isReady = false;
    fireTruck.onload = function() {
        this.isReady = true;
    };
    fireTruck.src = 'assets/firetruck.png';

    let truck2 = new Image();
    truck2.isReady = false;
    truck2.onload = function() {
        this.isReady = true;
    };
    truck2.src = 'assets/truck-reverse.png';

    let singleFrog = new Image();
    singleFrog.isReady = false;
    singleFrog.onload = function() {
        this.isReady = true;
    };
    singleFrog.src = 'assets/single-frog.png';

    let smallLog = new Image();
    smallLog.isReady = false;
    smallLog.onload = function() {
        this.isReady = true;
    };
    smallLog.src = 'assets/small-log.png';

    let mediumLog = new Image();
    mediumLog.isReady = false;
    mediumLog.onload = function() {
        this.isReady = true;
    };
    mediumLog.src = 'assets/medium-log.png';

    let largeLog = new Image();
    largeLog.isReady = false;
    largeLog.onload = function() {
        this.isReady = true;
    };
    largeLog.src = 'assets/large-log.png';

    let white = new Image();
    white.isReady = false;
    white.onload = function() {
        this.isReady = true;
    };
    white.src = 'assets/white.jpg';

    let redImg = new Image();
    redImg.isReady = false;
    redImg.onload = function() {
        this.isReady = true;
    };
    redImg.src = 'assets/red.png';

    let blue = new Image();
    blue.isReady = false;
    blue.onload = function() {
        this.isReady = true;
    };
    blue.src = 'assets/blue.jpeg';

    let insect = new Image();
    insect.isReady = false;
    insect.onload = function() {
        this.isReady = true;
    };
    insect.src = 'assets/insect.png';


    let carCrash = ParticleSystem(Graphics, {
        image: singleFrog,
        image2: imgRoad,
        width: Graphics.width*2,
        size: {mean: 5, stdev: .5},
        speed: { mean: .03, stdev: 0.1},
        lifetime: { mean: 150, stdev: 50}
    });
    let splash = ParticleSystem(Graphics, {
        image: imgWater,
        image2: white,
        width: Graphics.width*2,
        size: {mean: 5, stdev: .5},
        speed: { mean: .03, stdev: 0.1},
        lifetime: { mean: 150, stdev: 50}
    });

    let celebration = ParticleSystem(Graphics, {
        image: redImg,
        image2: blue,
        width: Graphics.width*2,
        size: {mean: 5, stdev: .5},
        speed: { mean: .01, stdev: 0.03},
        lifetime: { mean: 1000, stdev: 300}
    });

    let frog = {
        size: { x: canvas.width/MAPSIZE, y: canvas.height/MAPSIZE },     //size of cropped image
        center: { x: (canvas.width/2), y:canvas.height-(canvas.height/MAPSIZE*2) -(canvas.height/MAPSIZE/2)},
        rotation: Math.PI,
        verticalMovementToGo: 0,
        horizontalMovementToGo: 0,
        radius: canvas.width/MAPSIZE/2,
        direction: 1,  //1 is up, 2 is down, 3 is left, for is right
        moveRate: .5,
        rotateRate: Math.PI / 1000,
        swimTime: 500
        // type: 1
    };


    let frogRender = AnimatedModel({
        spriteSheet: 'assets/frogSprites.png',
        spriteCount: 7,
        spriteTime: [40,40,40,55,55,40,40],
        type: 0,
    }, graphics);

    function turtleshell(speed,center,type) {
        this.speed=speed;
        this.center=center;
        this.type=type;
        this.size = { x: canvas.width/MAPSIZE, y: canvas.height/MAPSIZE };   //size of cropped image
        this.rotation= -Math.PI;
        this.rotateRate= Math.PI / 1000;
    }

    function gatorShell(speed,center,type) {
        this.speed=speed;
        this.center=center;
        this.type=type;
        this.size = { x: canvas.width/MAPSIZE, y: canvas.height/MAPSIZE };   //size of cropped image
        this.rotation= -Math.PI;
        this.rotateRate= Math.PI / 1000;
    }

    function car(img,speed,length,x,y){
        this.img = img;
        this.speed=speed;
        this.length=length;
        this.x=x;
        this.y=y;
    }

    function log(img,speed,length,x,y){
        this.img = img;
        this.speed=speed;
        this.length=length;
        this.x=x;
        this.y=y;
    }

    function insectShell(x,y){
        this.img = insect;
        this.length=canvas.width/MAPSIZE/2;
        this.x=x;
        this.y=y;
        this.time=10;
    }

    function createBox(spec) {
        spec.center = {
            x: spec.left + spec.width / 2,
            y: spec.top + spec.height / 2
        };
        spec.orientation = 0;
        return spec;
    }
    function renderInsects() {
        for (let i=0;i<insects.length;i++){
            context.drawImage(insects[i].img,
                insects[i].x, insects[i].y,
                insects[i].length, canvas.height/MAPSIZE/2);
        }
    }

    function updateInsects(){
        if (insects.length===0){
            let rand = Random.nextRange(1,500);
            if (performance.now()%15000<18){
                rand=Random.nextRange(0,landingZones.length);
                let newInsect=new insectShell(landingZones[rand]-(canvas.width/MAPSIZE/4),canvas.height/MAPSIZE/4);
                insects.push(newInsect);
            }

        }else{
            if (performance.now()%1000<18){


                if (insects[0].time<=0){
                    insects.pop();
                }else {
                    insects[0].time--;
                }
            }
        }
    }

    function checkCarCollisions(){
        for (let i=0;i<cars.length;i++){
            //TODO make this only work on the road to optimize
            if (cars[i].y+20===frog.center.y){
                let theirRadius=cars[i].length/2;
                let minimumDistance=frog.radius+theirRadius-10;
                let carCollionX=5+cars[i].x+(cars[i].length/2);
                if (Math.abs(frog.center.x-carCollionX)<minimumDistance){
                    carCrash.update3(frog);
                    squash.play();
                    handleCollisions();
                }

            }
        }
    }
    function checkTurtleCollsions(elapsedTime) {
        for (let i=0;i<turtles.length;i++){
            //TODO make this only work on the road to optimize
            if (Math.abs(turtles[i].center.y-frog.center.y)<(canvas.height/MAPSIZE)-39){
                let theirRadius=canvas.width/MAPSIZE/2;
                if (Math.abs(frog.center.x-turtles[i].center.x)<(canvas.width/MAPSIZE)-10){
                    if (turtles[i].type!=1) {
                        frog.center.x += turtles[i].speed * elapsedTime;
                        frog.swimTime=500;
                    }else{
                        if (turtleRenders[i].getIndex()<8){
                            frog.center.x += turtles[i].speed * elapsedTime;
                            frog.swimTime=500;
                        }{
                            frog.swimTime-=elapsedTime;
                        }
                    }
                }else{
                    frog.swimTime-=elapsedTime;
                }
                if (frog.swimTime<0){
                    splash.update3(frog);
                    plunk.play();
                    handleCollisions();
                }

            }
        }
    }
    function checkAlligatorCollsions(elapsedTime) {
        for (let i = 0; i < alligators.length; i++) {
            //TODO make this only work on the road to optimize
            if (Math.abs(alligators[i].center.y - frog.center.y) < (canvas.height / MAPSIZE) - 39) {
                let theirRadius = canvas.width / MAPSIZE / 2;
                if (Math.abs(frog.center.x - alligators[i].center.x) < (canvas.width / MAPSIZE) - 10) {
                    if (alligatorRenders[i].getIndex() === 1) {
                        frog.center.x += alligators[i].speed * elapsedTime;
                        frog.swimTime = 500;
                    } else {
                        frog.swimTime -= elapsedTime;
                    }


                }else{
                    frog.swimTime-=elapsedTime;
                }
                if (frog.swimTime < 0) {
                    splash.update3(frog);
                    plunk.play();
                    handleCollisions();
                }
            }
        }
    }
    function checkLogCollisions(elapsedTime){
        for (let i=0;i<logs.length;i++){
            //TODO make this only work on the road to optimize
            if (logs[i].y+20===frog.center.y){
                let theirRadius=logs[i].length/2;
                let minimumDistance=frog.radius+theirRadius-10;
                let carCollionX=5+logs[i].x+(logs[i].length/2);
                if (Math.abs(frog.center.x-carCollionX)<minimumDistance){
                    frog.center.x += logs[i].speed * elapsedTime;
                    frog.swimTime=500;
                }else{
                    frog.swimTime-=elapsedTime;
                }
                if (frog.swimTime<0){
                    splash.update3(frog);
                    plunk.play();
                    handleCollisions();
                }
            }
        }
    }
    function handleCollisions() {
        frog.center.x=(canvas.width/2);
        frog.center.y=canvas.height-(canvas.height/MAPSIZE*2) -(canvas.height/MAPSIZE/2);
        frog.swimTime=500;
        timeLeft=60;
        if(numLives>0){
            numLives--;
        }else{
            gameOver=true;
        }
    }
    function updateTurtles(elapsedTime) {
        let timer = performance.now()%5000;
        if (timer>0&&timer<15) {
            let myRand = Random.nextRange(1,5);
            if (myRand===1) {
                let center = {
                    x: 200+canvas.width,
                    y: canvas.height - (canvas.height / MAPSIZE * 13) + (canvas.height / MAPSIZE / 2)
                };
                let newTurtle = new turtleshell(-.05, center,1);
                let turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sink-sprite.png',
                    spriteCount: 11,
                    spriteTime: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
                    type: 3,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
                center = {
                    x: 200+canvas.width - canvas.width / MAPSIZE,
                    y: canvas.height - (canvas.height / MAPSIZE * 13) + (canvas.height / MAPSIZE / 2)
                };
                newTurtle = new turtleshell(-.05, center,1);
                turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sink-sprite.png',
                    spriteCount: 11,
                    spriteTime: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
                    type: 3,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
                center = {
                    x: 200+canvas.width - (canvas.width / MAPSIZE * 2),
                    y: canvas.height - (canvas.height / MAPSIZE * 13) + (canvas.height / MAPSIZE / 2)
                };
                newTurtle = new turtleshell(-.05, center,1);
                turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sink-sprite.png',
                    spriteCount: 11,
                    spriteTime: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
                    type: 3,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
            }
            if (myRand===2) {
                let center = {
                    x: 200+canvas.width,
                    y: canvas.height - (canvas.height / MAPSIZE * 13) + (canvas.height / MAPSIZE / 2)
                };
                let newTurtle = new turtleshell(-.05, center,1);
                let turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sink-sprite.png',
                    spriteCount: 11,
                    spriteTime: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
                    type: 3,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
                center = {
                    x: 200+canvas.width - canvas.width / MAPSIZE,
                    y: canvas.height - (canvas.height / MAPSIZE * 13) + (canvas.height / MAPSIZE / 2)
                };
                newTurtle = new turtleshell(-.05, center,1);
                turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sink-sprite.png',
                    spriteCount: 11,
                    spriteTime: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
                    type: 3,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);

            }
            if (myRand===3) {
                let center = {
                    x: canvas.width+200,
                    y: canvas.height - (canvas.height / MAPSIZE * 13) + (canvas.height / MAPSIZE / 2)
                };
                let newTurtle = new turtleshell(-.05, center,2);
                let turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sprite.png',
                    spriteCount: 2,
                    spriteTime: [200,200],
                    type: 1,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
                center = {
                    x: canvas.width+200 - canvas.width / MAPSIZE,
                    y: canvas.height - (canvas.height / MAPSIZE * 13) + (canvas.height / MAPSIZE / 2)
                };
                newTurtle = new turtleshell(-.05, center,2);
                turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sprite.png',
                    spriteCount: 2,
                    spriteTime: [200,200],
                    type: 1,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
                center = {
                    x: canvas.width+200 - (canvas.width / MAPSIZE * 2),
                    y: canvas.height - (canvas.height / MAPSIZE * 13) + (canvas.height / MAPSIZE / 2)
                };
                newTurtle = new turtleshell(-.05, center,2);
                turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sprite.png',
                    spriteCount: 2,
                    spriteTime: [200,200],
                    type: 1,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
            }
            if (myRand===4) {
                let center = {
                    x: canvas.width+200,
                    y: canvas.height - (canvas.height / MAPSIZE * 13) + (canvas.height / MAPSIZE / 2)
                };
                let newTurtle = new turtleshell(-.05, center,2);
                let turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sprite.png',
                    spriteCount: 2,
                    spriteTime: [200,200],
                    type: 1,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
                center = {
                    x: canvas.width+200 - canvas.width / MAPSIZE,
                    y: canvas.height - (canvas.height / MAPSIZE * 13) + (canvas.height / MAPSIZE / 2)
                };
                newTurtle = new turtleshell(-.05, center,2);
                turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sprite.png',
                    spriteCount: 2,
                    spriteTime: [200,200],
                    type: 1,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
            }
        }
        timer = performance.now()%4000;
        if (timer>0&&timer<15) {
            let myRand = Random.nextRange(1,5);
            if (myRand===1) {
                let center = {
                    x: 200+canvas.width,
                    y: canvas.height - (canvas.height / MAPSIZE * 10) + (canvas.height / MAPSIZE / 2)
                };
                let newTurtle = new turtleshell(-.07, center,1);
                let turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sink-sprite.png',
                    spriteCount: 11,
                    spriteTime: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
                    type: 3,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
                center = {
                    x: 200+canvas.width - canvas.width / MAPSIZE,
                    y: canvas.height - (canvas.height / MAPSIZE * 10) + (canvas.height / MAPSIZE / 2)
                };
                newTurtle = new turtleshell(-.07, center,1);
                turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sink-sprite.png',
                    spriteCount: 11,
                    spriteTime: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
                    type: 3,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
                center = {
                    x: 200+canvas.width - (canvas.width / MAPSIZE * 2),
                    y: canvas.height - (canvas.height / MAPSIZE * 10) + (canvas.height / MAPSIZE / 2)
                };
                newTurtle = new turtleshell(-.07, center,1);
                turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sink-sprite.png',
                    spriteCount: 11,
                    spriteTime: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
                    type: 3,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
            }
            if (myRand===2) {
                let center = {
                    x: 200+canvas.width,
                    y: canvas.height - (canvas.height / MAPSIZE * 10) + (canvas.height / MAPSIZE / 2)
                };
                let newTurtle = new turtleshell(-.07, center,1);
                let turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sink-sprite.png',
                    spriteCount: 11,
                    spriteTime: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
                    type: 3,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
                center = {
                    x: 200+canvas.width - canvas.width / MAPSIZE,
                    y: canvas.height - (canvas.height / MAPSIZE * 10) + (canvas.height / MAPSIZE / 2)
                };
                newTurtle = new turtleshell(-.07, center,1);
                turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sink-sprite.png',
                    spriteCount: 11,
                    spriteTime: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
                    type: 3,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);

            }
            if (myRand===3) {
                let center = {
                    x: canvas.width+200,
                    y: canvas.height - (canvas.height / MAPSIZE * 10) + (canvas.height / MAPSIZE / 2)
                };
                let newTurtle = new turtleshell(-.07, center,2);
                let turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sprite.png',
                    spriteCount: 2,
                    spriteTime: [200,200],
                    type: 1,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
                center = {
                    x: canvas.width+200 - canvas.width / MAPSIZE,
                    y: canvas.height - (canvas.height / MAPSIZE * 10) + (canvas.height / MAPSIZE / 2)
                };
                newTurtle = new turtleshell(-.07, center,2);
                turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sprite.png',
                    spriteCount: 2,
                    spriteTime: [200,200],
                    type: 1,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
                center = {
                    x: canvas.width+200 - (canvas.width / MAPSIZE * 2),
                    y: canvas.height - (canvas.height / MAPSIZE * 10) + (canvas.height / MAPSIZE / 2)
                };
                newTurtle = new turtleshell(-.07, center,2);
                turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sprite.png',
                    spriteCount: 2,
                    spriteTime: [200,200],
                    type: 1,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
            }
            if (myRand===4) {
                let center = {
                    x: canvas.width+200,
                    y: canvas.height - (canvas.height / MAPSIZE * 10) + (canvas.height / MAPSIZE / 2)
                };
                let newTurtle = new turtleshell(-.07, center,2);
                let turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sprite.png',
                    spriteCount: 2,
                    spriteTime: [200,200],
                    type: 1,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
                center = {
                    x: canvas.width+200 - canvas.width / MAPSIZE,
                    y: canvas.height - (canvas.height / MAPSIZE * 10) + (canvas.height / MAPSIZE / 2)
                };
                newTurtle = new turtleshell(-.07, center,2);
                turtleRender = new AnimatedModel({
                    spriteSheet: 'assets/turtle-sprite.png',
                    spriteCount: 2,
                    spriteTime: [200,200],
                    type: 1,
                }, graphics);
                turtleRenders.push(turtleRender);
                turtles.push(newTurtle);
            }
        }
        for (let i=0;i<turtles.length;i++){
            turtleRenders[i].update(elapsedTime);
            turtles[i].center.x+= elapsedTime*turtles[i].speed;
        }
        if (turtles.length>=30){
            turtles.splice(0, 5);
        }
    }

    function updateLogs(elapsedTime){
        let timer = performance.now()%3000;
        if (timer>0&&timer<15) {

            let newLog = new log(smallLog, .05, 60, -65, canvas.height - (canvas.height / MAPSIZE * 11))
            logs.push(newLog);
        }
        timer = performance.now()%5000;
        if (timer>0&&timer<15) {
            let newLog = new log(largeLog, .08, 120, -125, canvas.height - (canvas.height / MAPSIZE * 12))
            logs.push(newLog);
        }
        timer = performance.now()%3000;
        if (timer>0&&timer<15) {
            let rand = Random.nextRange(1,8)
            if (rand===1){
                let center = {
                    x: -95,
                    y: canvas.height - (canvas.height / MAPSIZE * 14) + (canvas.height / MAPSIZE / 2)
                };
                let gator = new gatorShell(.05, center,1);
                let gatorRender = new AnimatedModel({
                    spriteSheet: 'assets/aligator-sprite.png',
                    spriteCount: 2,
                    spriteTime: [4000, 4000],
                    type: 4,
                }, graphics);
                alligatorRenders.push(gatorRender);
                alligators.push(gator);
            }else {
                let newLog = new log(mediumLog, .05, 90, -95, canvas.height - (canvas.height / MAPSIZE * 14))
                logs.push(newLog);
            }
        }
        for (let i=0;i<logs.length;i++){
            logs[i].x+= elapsedTime*logs[i].speed;
        }
        for (let i=0;i<alligators.length;i++){
            alligatorRenders[i].update(elapsedTime);
            alligators[i].center.x+= elapsedTime*alligators[i].speed;
        }
        if (alligators.length>=5){
            alligators.splice(0, 1);
            alligatorRenders.splice(0, 1);
        }
        if (logs.length>=30){
            logs.splice(0, 5);
        }
    }


    function updateCar(elapsedTime){
        let myRand = Random.nextRange(1,4);
        let timer = performance.now()%5000;
        if (timer>0&&timer<15) {
            let myImg=yellowCar;
            if (myRand===2){
                myImg=stripedCar;
            }
            if (myRand===3){
                myImg=blueCar;
            }
            let newCar = new car(myImg, .05, 45, -45, canvas.height - (canvas.height / MAPSIZE * 4))
            cars.push(newCar);
        }
        timer = performance.now()%5500;
        if (timer>0&&timer<15) {
            let newCar = new car(truck, -.05, 120, canvas.width+45, canvas.height - (canvas.height / MAPSIZE * 5))
            cars.push(newCar);
        }
        timer = performance.now()%1500;
        if (timer>0&&timer<15) {
            let myImg=yellowCar;
            if (myRand===2){
                myImg=stripedCar;
            }
            if (myRand===3){
                myImg=blueCar;
            }
            let newCar = new car(myImg, .2, 45, -45, canvas.height - (canvas.height / MAPSIZE * 6))
            cars.push(newCar);
        }
        timer = performance.now()%5000;
        if (timer>0&&timer<15) {
            let newCar = new car(fireTruck, .07, 90, -200, canvas.height - (canvas.height / MAPSIZE * 7))
            cars.push(newCar);
        }
        timer = performance.now()%5000;
        if (timer>0&&timer<15) {
            let newCar = new car(truck2, .07, 120, -45, canvas.height - (canvas.height / MAPSIZE * 8))
            cars.push(newCar);
        }

        for (let i=0;i<cars.length;i++){
            cars[i].x+= elapsedTime*cars[i].speed;
        }
        if (cars.length>=30){
            cars.splice(0, 5);
        }
    }
    function renderCar(){
        for (let i=0;i<cars.length;i++){
            context.drawImage(cars[i].img,
                cars[i].x, cars[i].y,
                cars[i].length, canvas.height/MAPSIZE);
        }
    }

    function renderLogs(){
        for (let i=0;i<logs.length;i++){
            context.drawImage(logs[i].img,
                logs[i].x, logs[i].y,
                logs[i].length, canvas.height/MAPSIZE*.75);
        }
        for (let i=0;i<alligators.length;i++){
            alligatorRenders[i].render(alligators[i])
        }
    }
    function renderTurtles() {
        for (let i=0;i<turtles.length;i++){
            turtleRenders[i].render(turtles[i])
        }
    }
    function renderBox(box) {
        context.save();
        context.translate(box.center.x, box.center.y);
        context.rotate(box.orientation);
        context.translate(-box.center.x, -box.center.y);

        context.fillStyle = box.fillStyle;
        context.fillRect(box.center.x - box.width / 2, box.center.y - box.height / 2, box.width, box.height);

        context.strokeStyle = 'rgb(0, 0, 0)';
        context.strokeRect(box.center.x - box.width / 2, box.center.y - box.height / 2, box.width, box.height);

        context.restore();
    }
    function handleWin() {
        finalScore+=2*timeLeft;
        finalScore+=1000;
        // setHighScores();
    }
    function setHighScores() {
        let scores=[];
        let highScore1=localStorage.getItem('froggerHighScore1');
        let highScore2=localStorage.getItem('froggerHighScore2');
        let highScore3=localStorage.getItem('froggerHighScore3');
        let highScore4=localStorage.getItem('froggerHighScore4');
        let highScore5=localStorage.getItem('froggerHighScore5');
        scores.push(finalScore);
        scores.push(highScore1);
        scores.push(highScore2);
        scores.push(highScore3);
        scores.push(highScore4);
        scores.push(highScore5);
        scores.sort(function(a, b) {
            return b - a;
        });
        window.localStorage.setItem('froggerHighScore1', scores[0]);
        window.localStorage.setItem('froggerHighScore2', scores[1]);
        window.localStorage.setItem('froggerHighScore3', scores[2]);
        window.localStorage.setItem('froggerHighScore4', scores[3]);
        window.localStorage.setItem('froggerHighScore5', scores[4]);
    }

    function checkWin(){
        if (popped===true&&landingZones.length<=0){
            gameOver=true;
            gameWon=true;
            handleWin();
            setHighScores();
        }
        if (frog.center.y<canvas.height/MAPSIZE){
            let found=false;
            for (let i=0;i<landingZones.length;i++){
                if (Math.abs(frog.center.x-landingZones[i])<canvas.width/MAPSIZE/1.9){
                    if(insects.length>0) {
                        if (Math.abs(frog.center.x - insects[0].x) < canvas.width / MAPSIZE / 1.9) {
                            insects.pop();
                            finalScore += 200;
                        }
                    }
                    victory.play();
                    xHit=landingZones[i];
                    celebration.update2(frog);
                    finalScore+=50;
                    found=true;
                    popped=true;
                    renderZones.push(xZones[i]);
                    landingZones.splice(i,1);
                    xZones.splice(i,1);
                    frog.verticalMovementToGo=0;
                    timeLeft=60;
                    frog.center={ x: (canvas.width/2), y:canvas.height-(canvas.height/MAPSIZE*2) -(canvas.height/MAPSIZE/2)}

                }
            }
            if (!found){
                squash.play();
                handleCollisions();
            }
        }
    }

    function update(elapsedTime) {
        if (performance.now()%1000<18){
            timeLeft--;
        }
        if (timeLeft<=0){
            handleCollisions();
        }
        frogRender.update(elapsedTime);
        if (frog.verticalMovementToGo<-5){
            let verticalMovement=frog.moveRate*elapsedTime*-1;
            frog.center.y+=verticalMovement;
            frog.verticalMovementToGo-=verticalMovement;
        }
        else if (frog.verticalMovementToGo>5){
            let verticalMovement=frog.moveRate*elapsedTime;
            frog.center.y+=verticalMovement;
            frog.verticalMovementToGo-=verticalMovement;
        }
        else{
            frog.center.y=frog.center.y+frog.verticalMovementToGo;
            frog.verticalMovementToGo=0;
            if (frog.center.y<furthestPointReached) {
                furthestPointReached = frog.center.y;
            }
        }
        if (frog.horizontalMovementToGo<-5){
            let verticalMovement=frog.moveRate*elapsedTime*-1;
            frog.center.x+=verticalMovement;
            frog.horizontalMovementToGo-=verticalMovement;
        }
        if (frog.horizontalMovementToGo>5){
            let verticalMovement=frog.moveRate*elapsedTime;
            frog.center.x+=verticalMovement;
            frog.horizontalMovementToGo-=verticalMovement;
        }
        ////TODO put all this ^^ in its own thing
        checkCarCollisions();
        checkTurtleCollsions(elapsedTime);
        checkAlligatorCollsions(elapsedTime);
        checkLogCollisions(elapsedTime);
        updateInsects();
        updateCar(elapsedTime);
        updateLogs(elapsedTime);
        updateTurtles(elapsedTime);
        carCrash.update(elapsedTime);
        celebration.update(elapsedTime);
        splash.update(elapsedTime);
        checkWin();

    }

    function render() {
        graphics.clear();
        renderMaze();
        renderCompletions();
        renderCar();
        renderTurtles();
        renderLogs();
        renderInfoBar();
        renderInsects();
        renderBox(timeBar);
        frogRender.render(frog);
        carCrash.render();
        celebration.renderHome(MAPSIZE,xHit);
        splash.render();


    }
    function renderCompletions(){
        for (let i=0;i<renderZones.length;i++){
            context.drawImage(singleFrog,
                renderZones[i]/ MAPSIZE, 0,
                35, 35);
        }
    }
    function renderInfoBar() {
        let spacing =450;
        for (let i=0; i<numLives; i++){
            context.drawImage(singleFrog,
                i * spacing / MAPSIZE, canvas.height-(canvas.height/MAPSIZE*1.5),
                35, 35);
        }if (timeLeft>0) {
            timeBar.width = 200 * (timeLeft / 60);
        }
        context.font="25px Arial";
        context.fillStyle = "white";
        context.fillText(timeLeft, canvas.width-(canvas.width/MAPSIZE),
            canvas.height-(canvas.height/MAPSIZE));
        context.fillText("Score: "+finalScore, canvas.width/3,
            canvas.height-(canvas.height/MAPSIZE));

    }

    function onKeyDownDefault(e) {
        // var code = e;
        if(!gameOver&&gameReady) {
            hop = new Audio("assets/hop.wav");
            hop.play();
            switch (e.keyCode) {
                case 37: //left
                    frog.direction=3;
                    frogRender.setIndex(1);
                    frog.horizontalMovementToGo-=canvas.height/MAPSIZE
                    frog.rotation=Math.PI/2;
                    break;
                case 38: //up
                    frog.verticalMovementToGo -= canvas.height / MAPSIZE;
                    frog.direction=1;
                    frogRender.setIndex(1);
                    frog.rotation=Math.PI;
                    if(frog.center.y-canvas.height/MAPSIZE<furthestPointReached){
                        finalScore+=10;
                    }
                    break;
                case 39: //right
                    frog.direction=4;
                    frogRender.setIndex(1);
                    frog.horizontalMovementToGo+=canvas.height/MAPSIZE;
                    frog.rotation=-Math.PI/2;
                    break;
                case 40: //down
                    console.log(frog.center.y+canvas.height/MAPSIZE);
                    console.log(canvas.height -(canvas.height/MAPSIZE/2));
                    if(!(frog.center.y>=canvas.height-(canvas.height/MAPSIZE*2) -(canvas.height/MAPSIZE/2))) {
                        frog.verticalMovementToGo += canvas.height / MAPSIZE;
                        frog.rotation = 0;
                        frogRender.setIndex(1);
                        frog.direction = 2;
                    }
                    break;
                default:
                    console.log(code);
            }
        }
    }

    function onKeyDown(e) {
        if(!gameOver&&gameReady) {
            hop = new Audio("assets/hop.wav");
            hop.play();
            if (e.key === leftKey) { //left
                frog.direction = 3;
                frogRender.setIndex(1);
                frog.horizontalMovementToGo -= canvas.height / MAPSIZE
                frog.rotation = Math.PI / 2;
            } else if (e.key === upKey) { //up
                frog.verticalMovementToGo -= canvas.height / MAPSIZE;
                frog.direction = 1;
                frogRender.setIndex(1);
                frog.rotation = Math.PI;
                if (frog.center.y - canvas.height / MAPSIZE < furthestPointReached) {
                    finalScore += 10;
                }
            } else if (e.key === rightKey) {//right
                frog.direction = 4;
                frogRender.setIndex(1);
                frog.horizontalMovementToGo += canvas.height / MAPSIZE;
                frog.rotation = -Math.PI / 2;
            }
                else if (e.key===downKey) { //down
                if(!(frog.center.y>=canvas.height-(canvas.height/MAPSIZE*2) -(canvas.height/MAPSIZE/2))) {
                    frog.verticalMovementToGo += canvas.height / MAPSIZE;
                    frog.rotation = 0;
                    frogRender.setIndex(1);
                    frog.direction = 2;
                }
            }
            }
        }


    function renderMaze() {
        for (let row = 0; row < MAPSIZE-2; row++) {
            for (let col = 0; col < MAPSIZE+100; col++) {
                if ((imgGrass.isReady)&&(row===MAPSIZE-3||row===6)) {
                    context.drawImage(imgGrass,
                        col*canvas.width/MAPSIZE, row*canvas.height/MAPSIZE,
                        canvas.width/MAPSIZE,  canvas.height/MAPSIZE);
                }else if ((imgRoad.isReady)&&(row<MAPSIZE-2&&row>6)) {
                    context.drawImage(imgRoad,
                        col*canvas.width/MAPSIZE, row*canvas.height/MAPSIZE,
                        canvas.width/MAPSIZE,  canvas.height/MAPSIZE);
                }else if ((imgWater.isReady)&&(row<6&&row>0)) {
                    context.drawImage(imgWater,
                        col*canvas.width/MAPSIZE, row*canvas.height/MAPSIZE,
                        canvas.width/MAPSIZE,  canvas.height/MAPSIZE);
                }else if ((imgGrass.isReady)&&row===0&&imgLily.isReady) {
                    if (col===1||col===4||col===7||col===10||col===13) {
                        if (!done&&xZones.length<5){
                            xZones.push(col*canvas.width);
                            xZonesClone.push(col*canvas.width);
                            if (xZones.length>=5){
                                done=true;
                            }
                        }
                        context.drawImage(imgLily,
                            col * canvas.width / MAPSIZE, row * canvas.height / MAPSIZE,
                            canvas.width / MAPSIZE, canvas.height / MAPSIZE);
                    }else{
                        context.drawImage(imgGrass,
                            col * canvas.width / MAPSIZE, row * canvas.height / MAPSIZE,
                            canvas.width / MAPSIZE, canvas.height / MAPSIZE);
                    }
                }
            }
        }
    }
    function handleGameOver() {
        music.pause();
        context.font="50px Arial";
        context.fillStyle = "white";
        context.fillText("Game Over...", 150, (canvas.height/2)-25);
    }

    function initialize() {
        music.play();
        music.loop=true;
        coin.play();
        landingZones.push(60);
        landingZones.push(180);
        landingZones.push(300);
        landingZones.push(420);
        landingZones.push(540);

        let newCar = new car(yellowCar, .05, 45, -45, canvas.height - (canvas.height / MAPSIZE * 4))
        cars.push(newCar);
        newCar = new car(blueCar, .05, 45, canvas.width/2, canvas.height - (canvas.height / MAPSIZE * 4))
        cars.push(newCar);
        newCar = new car(truck, -.05, 120, canvas.width/3*2, canvas.height - (canvas.height / MAPSIZE * 5))
        cars.push(newCar);
        newCar = new car(truck, -.05, 120, canvas.width+120, canvas.height - (canvas.height / MAPSIZE * 5))
        cars.push(newCar);
        newCar = new car(stripedCar, .2, 45, canvas.width/2, canvas.height - (canvas.height / MAPSIZE * 6))
        cars.push(newCar);
        newCar = new car(fireTruck, .07, 90, (canvas.width/2)-100, canvas.height - (canvas.height / MAPSIZE * 7))
        cars.push(newCar);
        newCar = new car(fireTruck, .07, 90, -45, canvas.height - (canvas.height / MAPSIZE * 7))
        cars.push(newCar);
        let newLog = new log(smallLog, .05, 60, canvas.width/3, canvas.height - (canvas.height / MAPSIZE * 11))
        logs.push(newLog);
        newLog = new log(smallLog, .05, 60, canvas.width/3*2, canvas.height - (canvas.height / MAPSIZE * 11))
        logs.push(newLog);
        newLog = new log(smallLog, .05, 60, -65, canvas.height - (canvas.height / MAPSIZE * 11))
        logs.push(newLog);
        newLog = new log(largeLog, .08, 120, -25, canvas.height - (canvas.height / MAPSIZE * 12))
        logs.push(newLog);
        newLog = new log(largeLog, .08, 120, (canvas.width/2)+120, canvas.height - (canvas.height / MAPSIZE * 12))
        logs.push(newLog);
        newLog = new log(mediumLog, .05, 90, -5, canvas.height - (canvas.height / MAPSIZE * 14))
        logs.push(newLog);
        newLog = new log(mediumLog, .05, 90, canvas.height/2+100, canvas.height - (canvas.height / MAPSIZE * 14))
        logs.push(newLog);
        requestAnimationFrame(gameLoop);

    }

    function gameLoop(time) {
        let elapsedTime = (time - lastTimeStamp);
        lastTimeStamp = time;
        update(elapsedTime);
        render();
        if (!gameOver) {
            requestAnimationFrame(gameLoop);
        }else{
            handleGameOver();
        }
    };


    initialize();
})();