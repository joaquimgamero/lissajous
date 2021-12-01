// Initial time
let t = 0;

// Resolution (px)
let size = 400;

// Stroke size
let strokeRatioX = 2;
let strokeRatioY = 2;

// Directions
// true => ascending, false => descending
let redDir = true;
let greenDir = false;
let blueDir = true;

// Cache 
let firstPositionSaved = false;
let firstPositionReached = false;
let firstX;
let firstY;
let particleCounter = 0;

// Thresholds
let overlapThreshold = 1000;
let positionThreshold = 3;

function setup() {
  // ********** Curves **********
  // Mathematical a, b values
  a = round(random(1, 10));
  b = round(random(1, 10));
  // a = 8;
  // b = 6;

  // Randomize colors
  red = random(0, 255);
  green = random(0, 255);
  blue = random(0, 255);
  
  // ********** Background **********
  const ratio = size / 256;
  
  const spice = random(0, 256);
  const spicePosition = round(random(1, 3));
  
  createCanvas(size, size);
  
  //noSmooth();

  // Create stop button
  button = createButton('stop');
  button.mousePressed(stop);
  
  background(255);
  for(let y = 0; y < height; y++) {
    for(let x = 0; x < width; x++) {
      let distanceFromTopLeft = dist(x, y, 0, 0) / ratio;
      let distanceFromTopRight = dist(x, y, width, 0) / ratio;
      let distanceFromBottomLeft = dist(x, y, 0, height) / ratio;
      
      stroke(spicePosition == 1 ? spice : distanceFromTopLeft, spicePosition == 2 ? spice : distanceFromTopRight, spicePosition == 3 ? spice : distanceFromBottomLeft);

      point(x, y);
    }
  }
}
    
function draw() { 
    if (!firstPositionReached) {
      for (i = 0; i < 1; i++) {
        y = calculatePercent(33, size) * sin(a * t + PI / 2);
        x = calculatePercent(33, size) * sin(b * t);
        positionedX = width / 2 + x;
        positionedY = height / 2 + y;

        stroke(red, green, blue);
        fill(red, green, blue);

        ellipse(positionedX, positionedY, calculatePercent(strokeRatioX, size), calculatePercent(strokeRatioY, size));

        console.log('x: ', positionedX, 'y: ', positionedY, 'p: ', particleCounter, 't: ', t);

        t += .001;

        reassignColors();

        if (!firstPositionSaved) {
          firstX = positionedX;
          firstY = positionedY;
          
          firstPositionSaved = true;
          
          text('iX: ' + firstX.toString() + ', iY: ' + firstY.toString(), 10, 20);
          text('a: ' + a.toString() + ', b: ' + b.toString(), 10, 30);
        }
        
        // console.log('Last X:', round(x), 'Last Y:', round(y));
        
        if (particleCounter > getCorrectOverlapThreshold() &&
          isInsideThreshold(positionedX, firstX, positionThreshold) &&
          isInsideThreshold(positionedY, firstY, positionThreshold)) {
          console.log('Curve stopped at particle number', particleCounter);
          firstPositionReached = true;
          saveCanvas('lissa_jous_test', 'png');
        }
        
        particleCounter++;
      }
    }
}

function stop() {
  firstPositionReached = true;
}

function calculatePercent(percent, num) {
    return (percent / 100) * num;
}

function reassignColors() {
  if (redDir) red = red + random(0, 1);
  else red = red - random(0, 1);
  
  if (greenDir) green = green + random(0, 1);
  else green = green - random(0, 1);
  
  if (blueDir) blue = blue + random(0, 1);
  else blue = blue - random(0, 1);
  
  // Correct directions
  if (red <= 0 || red >= 255) redDir = !redDir;
  if (green <= 0 || green >= 255) greenDir = !greenDir;
  if (blue <= 0 || blue >= 255) blueDir = !blueDir;
}

function isInsideThreshold(number, target, threshold) {
  let negativeEnd = target - threshold;
  let positiveEnd = target + threshold;

  return number >= negativeEnd && number <= positiveEnd;
}

function getCorrectOverlapThreshold() {
  if ((a / b) == 2) {
    return 1600;
  }
  if ((a / b) == 2 / 3 || (a / b) == 4 / 3) {
    return 3200;
  }

  return overlapThreshold;
}