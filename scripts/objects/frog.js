//------------------------------------------------------------------
//
// Creates a Bird model based upon the passed in specification.
//
//------------------------------------------------------------------
MyGame.objects.Frog = function(spec) {

    //------------------------------------------------------------------
    //
    // Move in the direction of the rotation.
    //
    //------------------------------------------------------------------

    function moveForward() {
        spec.verticalMovementToGo-=spec.height;
        spec.rotation=0;
    }
    function moveLeft() {
        spec.horizontalMovementToGo-=spec.width;
        spec.rotation=-Math.PI/2;
        console.log("something happened");
    }
    function moveRight() {
        spec.horizontalMovementToGo+=spec.width;
        spec.rotation=Math.PI/2;

    }
    // function moveForward(elapsedTime) {
    //     //
    //     // Create a normalized direction vector
    //     let vectorX = Math.cos(spec.rotation);
    //     let vectorY = Math.sin(spec.rotation);
    //     //
    //     // With the normalized direction vector, move the center of the sprite
    //     spec.center.x += (vectorX * spec.moveRate * elapsedTime);
    //     spec.center.y += (vectorY * spec.moveRate * elapsedTime);
    // }
    //
    // function rotateLeft(elapsedTime) {
    //     spec.rotation -= spec.rotateRate * (elapsedTime);
    // }
    //
    // function rotateRight(elapsedTime) {
    //     spec.rotation += spec.rotateRate * (elapsedTime);
    // }

    let api = {
        // get size() { retu rn spec.size; },
        get center() { return spec.center; },
        get rotation() { return spec.rotation; },
        moveForward: moveForward,
        moveLeft: moveLeft,
        moveRight: moveRight
    };

    return api;
};
