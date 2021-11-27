



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

        // stroke(
        //   spicePosition == 1 ?
        //     spice :
        //     distanceFromTopLeft,
        //   spicePosition == 2 ?
        //     spice :
        //     distanceFromTopRight,
        //   spicePosition == 3 ?
        //     spice :
        //     distanceFromBottomLeft);

        sketch.stroke(distanceFromTopLeft, distanceFromCenter, spice);

        sketch.point(x, y);
      }
    }
  }

  sketch.draw = () => {
    // This thing gives the stroke a small shadow
    //background(0, 0, 0, 4);
    //reassignColors();

    // paintLissajous();
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

  sketch.setup = () => {
    sketch.createCanvas(size, size);
  }

  sketch.draw = () => {
    sketch.reassignColors();

    sketch.paintLissajous();
  }

  sketch.paintLissajous = () => {
    for (i = 0; i < 1; i++) {
      let yPos = 160 * sketch.sin(a * t + sketch.PI / 2);
      let xPos = 160 * sketch.sin(b * t);

      sketch.stroke(red, green, blue);
      sketch.fill(red, green, blue);

      sketch.ellipse(sketch.width / 2 + xPos, sketch.height / 2 + yPos, 54, 12);
      t += .001;

      sketch.reassignColors();
    }
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
}

let bg = new p5(backgroundSketch, "background-sketch");
let curve = new p5(curveSketch, "curve");