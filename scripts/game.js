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
    let gameReady=true;
    let numLives=3;
    let cars = [];
    window.addEventListener('keydown', onKeyDownDefault);

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

    let frog = {
        size: { x: canvas.width/MAPSIZE, y: canvas.height/MAPSIZE },     //size of cropped image
        center: { x: (canvas.width/2), y:canvas.height-(canvas.height/MAPSIZE*2) -(canvas.height/MAPSIZE/2)},
        rotation: Math.PI,
        verticalMovementToGo: 0,
        horizontalMovementToGo: 0,
        radius: canvas.width/MAPSIZE/2,
        direction: 1,  //1 is up, 2 is down, 3 is left, for is right
        moveRate: .5,         // how fast bird moves on control
        rotateRate: Math.PI / 1000
    }


    let frogRender = AnimatedModel({
        spriteSheet: 'assets/frogSprites.png',
        spriteCount: 7,
        spriteTime: [40,40,40,55,55,40,40],   // ms per frame
    }, graphics);

    function car(img,speed,length,x,y){
        this.img = img;
        this.speed=speed;
        this.length=length;
        this.x=x;
        this.y=y;
    }
   //todo every few second pop the last few car off the list (as many as spawn in those seconds)
    function checkCollisions(){
        for (let i=0;i<cars.length;i++){
            //TODO make this only work on the road to optimize
            if (cars[i].y+20===frog.center.y){
                let theirRadius=cars[i].length/2;
                let minimumDistance=frog.radius+theirRadius-10;
                let carCollionX=5+cars[i].x+(cars[i].length/2);
                if (Math.abs(frog.center.x-carCollionX)<minimumDistance){
                    console.log("collision detected");
                    handleCollions();
                }

            }
        }
    }
    function handleCollions() {
        frog.center.x=(canvas.width/2);
        frog.center.y=canvas.height-(canvas.height/MAPSIZE*2) -(canvas.height/MAPSIZE/2)
        if(numLives>0){
            numLives--;
        }else{
            alert("you lost!");
        }
    }


    function updateCar(elapsedTime){
        let myRand = Random.nextRange(1,4);
        let timer = performance.now()%5000;
        if (timer>0&&timer<21) {
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
        if (timer>0&&timer<21) {
            let newCar = new car(truck, -.05, 120, canvas.width+45, canvas.height - (canvas.height / MAPSIZE * 5))
            cars.push(newCar);
        }
        timer = performance.now()%1500;
        if (timer>0&&timer<21) {
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
        if (timer>0&&timer<21) {
            let newCar = new car(fireTruck, .07, 90, -200, canvas.height - (canvas.height / MAPSIZE * 7))
            cars.push(newCar);
        }
        timer = performance.now()%5000;
        if (timer>0&&timer<21) {
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



    function processInput(elapsedTime) {
    }

    //------------------------------------------------------------------
    //
    // Update the particles
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
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
        checkCollisions();
        updateCar(elapsedTime);



    }


    function renderFrog(frog) {
        if (frog.ready) {
            context.save();
            context.translate(frog.center.x, frog.center.y);
            context.rotate(frog.rotation);
            context.translate(-frog.center.x, -frog.center.y);
            context.drawImage(
                frog.image,
                frog.center.x - frog.width/2,
                frog.center.y - frog.height/2,
                frog.width, frog.height);
            context.restore();
        }
    }

    //------------------------------------------------------------------
    //
    // Render the particles
    //
    //------------------------------------------------------------------
    function render() {
        // context.clearRect(0, 0, canvas.width, canvas.height);
        graphics.clear();
        // renderFrog(frog);
        renderMaze();
        renderFrog(frog)
        // littleBirdRender.render(littleBird);
        frogRender.render(frog);
        renderCar();
        renderInfoBar();

    }
    function renderInfoBar() {
        let spacing =450;
        for (let i=0; i<numLives; i++){
            context.drawImage(singleFrog,
                i * spacing / MAPSIZE, canvas.height-(canvas.height/MAPSIZE*1.5),
                35, 35);
        }

    }

    function onKeyDownDefault(e) {
        // var code = e;
        if(!gameOver&&gameReady) {
            switch (e.keyCode) {
                case 37: //left
                    frog.direction=3;
                    frogRender.setIndex(1);
                    frog.horizontalMovementToGo-=canvas.height/MAPSIZE
                    frog.rotation=Math.PI/2;
                    break;
                case 38: //up
                    // if (frog.direction!=2) {
                        frog.verticalMovementToGo -= canvas.height / MAPSIZE;
                    // }
                    frog.direction=1;
                    frogRender.setIndex(1);
                    frog.rotation=Math.PI;
                    break;
                case 39: //right
                    frog.direction=4;
                    frogRender.setIndex(1);
                    frog.horizontalMovementToGo+=canvas.height/MAPSIZE;
                    frog.rotation=-Math.PI/2;
                    break;
                case 40: //down
                    // if (frog.direction!=1) {
                        frog.verticalMovementToGo += canvas.height / MAPSIZE;
                    // }
                    frog.rotation=0;
                    frogRender.setIndex(1);
                    frog.direction=2;
                    break;
                default:
                    console.log(code);
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

    function initialize() {
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
        requestAnimationFrame(gameLoop);

    }

    function gameLoop(time) {
        let elapsedTime = (time - lastTimeStamp);
        lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    };





    initialize();
})();