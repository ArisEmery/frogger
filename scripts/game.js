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




    let frog = {
        size: { x: canvas.width/MAPSIZE, y: canvas.height/MAPSIZE },     //size of cropped image
        center: { x: (canvas.width/2), y:canvas.height-(canvas.height/MAPSIZE*2) -(canvas.height/MAPSIZE/2)},
        rotation: Math.PI,
        verticalMovementToGo: 0,
        horizontalMovementToGo: 0,
        direction: 1,  //1 is up, 2 is down, 3 is left, for is right
        moveRate: .5,         // how fast bird moves on control
        rotateRate: Math.PI / 1000
    }


    let frogRender = AnimatedModel({
        spriteSheet: 'assets/frogSprites.png',
        spriteCount: 7,
        spriteTime: [40,40,40,55,55,40,40],   // ms per frame
    }, graphics);


    function processInput(elapsedTime) {
    }

    //------------------------------------------------------------------
    //
    // Update the particles
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        console.log(frog.center.y);
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
                    let vectorX = Math.cos(Math.PI);
                    let vectorY = Math.sin(Math.PI);
                    //
                    // With the normalized direction vector, move the center of the sprite
                    frog.center.x += (vectorX * spec.moveRate * elapsedTime);
                    frog.center.y += (vectorY * spec.moveRate * elapsedTime);
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
        // let tileX = 0;
        // let tileY = 0;
        // for (let i =0;i<MAPSIZE;i++){
        //     for (let j=0;j<MAPSIZE;j++){
        //         console.log(j);
        //         let img = new Image();
        //         img.isReady = false;
        //         img.onload = function() {
        //             this.isReady = true;
        //         };
        //         img.src = 'assets/grass.png';
        //         // drawCell(image)
        //         context.drawImage()
        //         context.drawImage(
        //             img,
        //             tileX,
        //             tileY,
        //             canvas.width/MAPSIZE,canvas.height/MAPSIZE);
        //         tileX+=canvas.width/MAPSIZE;
        //     }
        //     tileY+=canvas.width/MAPSIZE;
        // }
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