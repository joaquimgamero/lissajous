



// *****************************************
// ***************** p5js ******************
// *****************************************

const size = 500;

// BACKGROUND

const backgroundSketch = (sketch) => {
  sketch.setup = () => {
    const ratio = size / 256;

    const spice = sketch.random(0, 256);
    const spicePosition = sketch.round(sketch.random(1, 3));

    sketch.createCanvas(size, size);

    //noSmooth();

    for (let y = 0; y < sketch.height; y++) {
      for (let x = 0; x < sketch.width; x++) {
        let distanceFromTopLeft = sketch.dist(x, y, 0, 0) / ratio;
        let distanceFromTopRight = sketch.dist(x, y, sketch.width, 0) / ratio;
        let distanceFromBottomLeft = sketch.dist(x, y, 0, sketch.height) / ratio;
        let distanceFromCenter = sketch.dist(x, y, sketch.width / 2, sketch.height / 2) / ratio;

        sketch.stroke(
          spicePosition == 1 ?
            spice :
            distanceFromTopLeft,
          spicePosition == 2 ?
            spice :
            distanceFromTopRight,
          spicePosition == 3 ?
            spice :
            distanceFromBottomLeft);

        // sketch.stroke(distanceFromTopLeft, distanceFromCenter, spice);

        sketch.point(x, y);
      }
    }
  }

  sketch.draw = () => {

  }
};


// LISSAJOUS

const curveSketch = (sketch) => {
  let t = 0;

  // ********** Curves **********
  // Mathematical a, b values
  const a = 5;
  const b = 3;

  // sketch.randomize colors
  let red = sketch.random(0, 255);
  let green = sketch.random(0, 255);
  let blue = sketch.random(0, 255);
  
  // Directions
  // true => ascending, false => descending
  let redDir = true;
  let greenDir = false;
  let blueDir = true;

  let particleArray = [];


  sketch.setup = () => {
    sketch.createCanvas(size, size);
  }

  sketch.draw = () => {
    sketch.clear();

    y = sketch.width / 2 + 160 * sketch.sin(a * t + sketch.PI / 2);
    x = sketch.height / 2 + 160 * sketch.sin(b * t);

    particleArray.push(new Particle(x, y, red, blue, green, t));

    for (i = 0; i < particleArray.length; i++) {
      particleArray[i].show(t);
    }

    //keep the array short, otherwise it runs very slow
    if (particleArray.length > 3000) {
      console.log('Max particle list size reached');
      particleArray.shift();
    }

    t += .0025;
    sketch.reassignColors();
  }

  sketch.reassignColors = () => {
    if (redDir) red = red + sketch.random(0, 1);
    else red = red - sketch.random(0, 1);

    if (greenDir) green = green + sketch.random(0, 1);
    else green = green - sketch.random(0, 1);

    if (blueDir) blue = blue + sketch.random(0, 1);
    else blue = blue - sketch.random(0, 1);

    // Correct directions
    if (red <= 0 || red >= 255) redDir = !redDir;
    if (green <= 0 || green >= 255) greenDir = !greenDir;
    if (blue <= 0 || blue >= 255) blueDir = !blueDir;
  }

  class Particle {
    constructor(x, y, r, g, b, t) {
      this.x = x;
      this.y = y;

      this.r = r;
      this.g = g;
      this.b = b;

      this.t = t;
      this.opacity = 255;
    };

    show(currentT) {
      // let ratio = t / currentT;
      // let alpha = sketch.map(ratio, 0, 1, 0, 255); //points will fade out as time elaps
      sketch.stroke(this.r, this.g, this.b, this.opacity);
      sketch.fill(this.r, this.g, this.b, this.opacity);
      sketch.ellipse(this.x, this.y, 32, 15, this.opacity);

      if (this.opacity > 10) {
        this.opacity = this.opacity - 0.25;
      }
    };
  }
}

let bg = new p5(backgroundSketch, "background-sketch");
let curve = new p5(curveSketch, "curve");