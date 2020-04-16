function ParticleSystem(graphics, spec) {
    let that = {};
    let particles = [];
    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext("2d");


    function create(spec) {
        let that = {};

        spec.fill = 'rgb(255, 255, 255)';
        spec.stroke = 'rgb(0, 0, 0)';
        spec.alive = 0;
        that.center=spec.center;

        that.update = function(elapsedTime) {
            spec.center.x += (spec.speed * spec.direction.x * elapsedTime);
            spec.center.y += (spec.speed * spec.direction.y * elapsedTime);
            spec.alive += elapsedTime;
            that.center=spec.center;
            spec.rotation += spec.speed * 0.5;

            return spec.alive < spec.lifetime;
        };

        that.draw = function() {
            // graphics.drawRectangle(spec);
            graphics.drawTexture(spec.image, spec.center, spec.rotation, spec.size);
        };

        return that;
    }

    that.update = function(elapsedTime) {
        let keepMe = [];
        for (let particle = 0; particle < particles.length; particle++) {
            if (particles[particle].update(elapsedTime)) {
                keepMe.push(particles[particle]);
            }
        }
        particles = keepMe;
    };
    that.update2 = function(frog) {
        for (let particle = 0; particle < 50; particle++) {
            for (let particle = 0; particle < 5; particle++) {
                let size = Math.abs(Random.nextGaussian(spec.size.mean, spec.size.stdev));
                let p = create({
                    image: spec.image,
                    center: {x:(frog.center.x),
                        y: (frog.center.y) },
                    size: {x: size, y: size},
                    rotation: 0,
                    speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
                    direction: Random.nextCircleVector(),
                    lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
                });

                particles.push(p);
            }
        }
        for (let particle = 0; particle < 50; particle++) {
            for (let particle = 0; particle < 5; particle++) {
                let size = Math.abs(Random.nextGaussian(spec.size.mean, spec.size.stdev));
                let p = create({
                    image: spec.image2,
                    center: {x:(frog.center.x),
                        y: (frog.center.y) },
                    size: {x: size, y: size},
                    rotation: 0,
                    speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
                    direction: Random.nextCircleVector(),
                    lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
                });
                particles.push(p);
            }
        }

    };
    that.update3 = function(frog) {
        for (let particle = 0; particle < 40; particle++) {
            for (let particle = 0; particle < 5; particle++) {
                let size = Math.abs(Random.nextGaussian(spec.size.mean, spec.size.stdev));
                let p = create({
                    image: spec.image,
                    center: {x:(frog.center.x),
                        y: (frog.center.y) },
                    size: {x: size, y: size},
                    rotation: 0,
                    speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
                    direction: Random.nextCircleVector(),
                    lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
                });

                particles.push(p);
            }
        }
        for (let particle = 0; particle < 40; particle++) {
            for (let particle = 0; particle < 5; particle++) {
                let size = Math.abs(Random.nextGaussian(spec.size.mean, spec.size.stdev));
                let p = create({
                    image: spec.image2,
                    center: {x:(frog.center.x),
                        y: (frog.center.y) },
                    size: {x: size, y: size},
                    rotation: 0,
                    speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
                    direction: Random.nextCircleVector(),
                    lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
                });
                particles.push(p);
            }
        }

    };
    that.renderHome = function(mapSize,xCoord) {
        for (let p = particles.length - 1; p >= 0; p--) {
            // let helper = particles[p].x;
            if (particles[p].center.x>(canvas.width/mapSize/2)+xCoord+5) {
                particles[p].draw();
            }
            if (particles[p].center.x<xCoord-(canvas.width/mapSize/2)-5) {
                particles[p].draw();
            }
            if (particles[p].center.y>(canvas.width/mapSize)+5) {
                particles[p].draw();
            }
        }
    };

    that.render = function() {
        for (let p = particles.length - 1; p >= 0; p--) {
            particles[p].draw();
        }
    };

    return that;
}