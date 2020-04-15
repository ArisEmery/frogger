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
        imageSrc: 'assets/frog.png',
        width: canvas.width/14,
        height: canvas.height/14,
        center: { x: canvas.width/2, y:canvas.height-(canvas.height/14) },
        radius: 26,
        rotation: 0,
        verticalMovementToGo: 0,
        horizontalMovementToGo: 0,
        verticalSpeed: -.05,
        horizontalSpeed: 0,  // Radians per second
    };
    frog.image = new Image();
    frog.ready = false;
    frog.image.onload = function() {
        let ar = frog.image.width / frog.image.height;
        frog.ready = true;
    };
    frog.image.src = frog.imageSrc;

    let littleBird = Frog({
        size: { x: 50, y: 50 },       // Size in pixels
        center: { x: 50, y: 150 },
        rotation: 0,
        moveRate: 125 / 1000,         // Pixels per second
        rotateRate: Math.PI / 1000    // Radians per second
    });

    let littleBirdRender = AnimatedModel({
        spriteSheet: 'assets/spritesheet-bird.png',
        spriteCount: 14,
        spriteTime: [40, 40, 40, 40, 40, 40, 40,40, 40, 40, 40, 40, 40, 40],   // ms per frame
    }, graphics);


    function processInput(elapsedTime) {
    }

    //------------------------------------------------------------------
    //
    // Update the particles
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        frog.center.y+= frog.verticalMovementToGo;
        frog.verticalMovementToGo=0;
        frog.center.x+=frog.horizontalMovementToGo;
        frog.horizontalMovementToGo=0;
        littleBirdRender.update(elapsedTime);

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
        renderFrog(frog);

        littleBirdRender.render(littleBird);
    }
    function onKeyDownDefault(e) {
        // var code = e;
        if(!gameOver&&gameReady) {
            switch (e.keyCode) {
                case 37: //left
                    frog.horizontalMovementToGo-=frog.width;
                    frog.rotation=-Math.PI/2;
                    break;
                case 38: //up
                    frog.verticalMovementToGo-=frog.height;
                    frog.rotation=0;
                    break;
                case 39: //down
                    frog.horizontalMovementToGo+=frog.width;
                    frog.rotation=Math.PI/2;
                    break;
                case 40: //down
                    frog.verticalMovementToGo+=frog.height;
                    frog.rotation=Math.PI;
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