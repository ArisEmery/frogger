MyGame.main=(function() {
    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext("2d");
    let previousTime = performance.now();
    let gameOver=false;
    let gameReady=true;
    // window.addEventListener('keydown', onKeyDownDefault);


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
        horizontalSpeed: 0,
    };
    frog.image = new Image();
    frog.ready = false;
    frog.image.onload = function() {
        let ar = frog.image.width / frog.image.height;
        frog.ready = true;
    };
    frog.image.src = frog.imageSrc;



    function update(elapsedTime) {
        frog.center.y+= frog.verticalMovementToGo;
        frog.verticalMovementToGo=0;
        frog.center.x+=frog.horizontalMovementToGo;
        frog.horizontalMovementToGo=0;

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

    function render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        renderFrog(frog);
    }
    // function onKeyDownDefault(e) {
    //     // var code = e;
    //     if(!gameOver&&gameReady) {
    //         switch (e.keyCode) {
    //             case 37: //left
    //                 frog.horizontalMovementToGo-=frog.width;
    //                 frog.rotation=-Math.PI/2;
    //                 break;
    //             case 38: //up
    //                 frog.verticalMovementToGo-=frog.height;
    //                 frog.rotation=0;
    //                 break;
    //             case 39: //down
    //                 frog.horizontalMovementToGo+=frog.width;
    //                 frog.rotation=Math.PI/2;
    //                 break;
    //             case 40: //down
    //                 frog.verticalMovementToGo+=frog.height;
    //                 frog.rotation=Math.PI;
    //                 break;
    //             default:
    //                 console.log(code);
    //         }
    //     }
    // }

    function gameLoop(time) {
        let elapsedTime = time - previousTime;
        previousTime = time;
        update(elapsedTime);
        render();
        requestAnimationFrame(gameLoop);
    }

    myKeyboard.register('ArrowUp', bigBird.moveForward);
    myKeyboard.register('ArrowLeft', bigBird.rotateLeft);
    myKeyboard.register('ArrowRight', bigBird.rotateRight);

    requestAnimationFrame(gameLoop);
})();