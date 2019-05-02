
function setup() {
    let canvas = createCanvas(560, 560);
    Object.assign(canvas.elt, { id: 'canvas' })
    select(".canvas-holder").elt.appendChild(canvas.elt);
    background(255);
}

let mouseIconPossition = 28;
function draw() {
    strokeWeight(20);
    stroke(0);

    if (mouseIsPressed) {
        line(mouseX, mouseY + mouseIconPossition, pmouseX, pmouseY + mouseIconPossition);
    }
}

let sketchSample = function (p) {


    let tag = p._userNode

    let pressed = function () {
        let sampleImage;
        let category = clocks;
        switch (tag) {
            case 'sampleClock': category = clocks; break;
            case 'sampleCloud': category = clouds; break;
            case 'sampleApple': category = apples; break;
        }

        let pool = category.testing;//.training
        let randomIndex = Math.random() * pool.length | 0;
        sampleImage = pool[randomIndex];

        let img = createImage(28, 28, RGB)
        img.loadPixels();
        for (var x = 0; x < img.width; x++) {
            for (var y = 0; y < img.height; y++) {
                var i = x + y * img.width;
                var index = i * 4;
                var pixel = 255 - sampleImage[i];
                img.pixels[index + 0] = pixel;
                img.pixels[index + 1] = pixel;
                img.pixels[index + 2] = pixel;
                img.pixels[index + 3] = 255;
            }
        }

        img.updatePixels();
        img.resize(p.width, p.height);
        p.image(img, 0, 0)  
    }

    p.setup = function () {
        let canvas = p.createCanvas(140, 140);
        Object.assign(canvas.elt, { id: tag, width: 140, height: 140, onclick: sampleOnClick.bind(p)})
        let el = select(".sample-holder").elt
        el.insertBefore(canvas.elt, el.firstChild)
        p.background(255);

        let buttonRandoom = select(".random");
        buttonRandoom.mouseClicked(pressed)
    };


    p.draw = function () {
        
    };
};

let sample1 = new p5(sketchSample, 'sampleClock');
let sample2 = new p5(sketchSample, 'sampleCloud');
let sample3 = new p5(sketchSample, 'sampleApple');

function sampleOnClick (event) {
    let img = this.get()
    img.resize(width, height);
    image(img, 0, 0)
}