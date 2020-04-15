//------------------------------------------------------------------
//
// This provides the "game" code.
//
//------------------------------------------------------------------
(function () {
    'use strict';
    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext("2d");

    let lastTimeStamp = performance.now();
    let gameOver=false;
    let gameReady=true;
    window.addEventListener('keydown', onKeyDownDefault);



    let frog = {
        size: { x: 100, y: 100 },     //size of cropped image
        center: { x: canvas.width/2, y:canvas.height-(canvas.height/14) },
        rotation: Math.PI,
        verticalMovementToGo: 0,
        horizontalMovementToGo: 0,
        moveRate: .5,         // how fast bird moves on control
        rotateRate: Math.PI / 1000
    }


    let frogRender = AnimatedModel({
        spriteSheet: 'assets/frogSprites.png',
        spriteCount: 7,
        spriteTime: [35,35,35,35,35,35,35],   // ms per frame
    }, graphics);


    function processInput(elapsedTime) {
    }

    //------------------------------------------------------------------
    //
    // Update the particles
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        frogRender.update(elapsedTime);
        console.log(frog.verticalMovementToGo);
        if (frog.verticalMovementToGo<-5){
            let verticalMovement=frog.moveRate*elapsedTime*-1;
            frog.center.y+=verticalMovement;
            frog.verticalMovementToGo-=verticalMovement;
        }
        if (frog.verticalMovementToGo>5){
            let verticalMovement=frog.moveRate*elapsedTime;
            frog.center.y+=verticalMovement;
            frog.verticalMovementToGo-=verticalMovement;
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
        renderFrog(frog)
        // littleBirdRender.render(littleBird);
        frogRender.render(frog);
    }
    function onKeyDownDefault(e) {
        // var code = e;
        if(!gameOver&&gameReady) {
            switch (e.keyCode) {
                case 37: //left
                    frogRender.setIndex(1);
                    frog.horizontalMovementToGo-=canvas.height/14
                    frog.rotation=Math.PI/2;
                    break;
                case 38: //up
                    frogRender.setIndex(1);
                    frog.verticalMovementToGo-=canvas.height/14;
                    frog.rotation=Math.PI;
                    break;
                case 39: //right
                    frogRender.setIndex(1);
                    frog.horizontalMovementToGo+=canvas.height/14;
                    frog.rotation=-Math.PI/2;
                    break;
                case 40: //down
                    frog.verticalMovementToGo+=canvas.height/14;
                    frog.rotation=0;
                    frogRender.setIndex(1);
                    break;
                default:
                    console.log(code);
            }
        }
    }

    //------------------------------------------------------------------
    //
    // This is the Game Loop function!
    //
    //------------------------------------------------------------------
    function gameLoop(time) {
        let elapsedTime = (time - lastTimeStamp);
        lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    };






    requestAnimationFrame(gameLoop);
})();