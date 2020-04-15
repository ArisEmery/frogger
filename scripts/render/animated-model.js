// --------------------------------------------------------------
//
// Renders an animated model based on a spritesheet.
//
// --------------------------------------------------------------
let AnimatedModel = function(spec, graphics) {
    // 'use strict';

    let animationTime = 0;
    let subImageIndex = 0;
    let subTextureWidth = 0;
    let animate=true;
    let image = new Image();
    let isReady = false;  // Can't render until the texture is loaded

    //
    // Load he texture to use for the particle system loading and ready for rendering
    image.onload = function() {
        isReady = true;
        subTextureWidth = image.width / spec.spriteCount;
    }
    image.src = spec.spriteSheet;

    function setIndex(x) {
        subImageIndex=x;
    }
    //------------------------------------------------------------------
    //
    // Update the state of the animation
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        animationTime += elapsedTime;
        //
        // Check to see if we should update the animation frame
        if (animationTime >= spec.spriteTime[subImageIndex]) {
            //
            // When switching sprites, keep the leftover time because
            // it needs to be accounted for the next sprite animation frame;
            let keepgoing =true;
            animationTime -= spec.spriteTime[subImageIndex];
            if (subImageIndex>=spec.spriteCount-1) {
                animate=false;
            }
            else {
                subImageIndex += 1;
                console.log(subImageIndex);

                //
                // Wrap around from the last back to the first sprite as needed
                subImageIndex = subImageIndex % spec.spriteCount; //todo imporant
            }
        }
    }

    //------------------------------------------------------------------
    //
    // Render the specific sub-texture animation frame
    //
    //------------------------------------------------------------------
    function render(model) {
        if (isReady) {
            graphics.drawSubTexture(image, subImageIndex, subTextureWidth, model.center, model.rotation, model.size);
        }
    }

    let api = {
        update: update,
        render: render,
        setIndex: setIndex
    };

    return api;
};
