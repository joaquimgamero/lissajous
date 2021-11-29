// Initial time
let t = 0;

// Resolution (px)
let size = 500;

// Stroke size]]]
let strokeRatioX = 19;
let strokeRatioY = 32;

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
let overlapThreshold = 3200;

function setup() {
  // ********** Curves **********
  // Mathematical a, b values
  a = 5;
  b = 6;
  
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

        stroke(red, green, blue);
        fill(red, green, blue);

        ellipse(width/2+x, height/2+y, calculatePercent(7, size), calculatePercent(3, size));
        t += .001;

        reassignColors();

        if (!firstPositionSaved) {
          firstX = x;
          firstY = y;
          
          firstPositionSaved = true;
          
          console.log(firstX);
          console.log(firstY);
        }
        
        console.log('Last X:', round(x), 'Last Y:', round(y));
        
        if (particleCounter > overlapThreshold && (round(x) == firstX && round(y) == firstY)) {
          console.log('Curve stopped at particle number', particleCounter);
          firstPositionReached = true;
          saveCanvas('lissa_jous_test', 'png');
        }
        
        particleCounter++;
      }
    }
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