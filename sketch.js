// Initial time
let t = 0;

// Lissajous curve info, computed before actual drawing
const curveData = [];

// Resolution (px)
let size = 800;

// Stroke size
let strokeRatioX = 3;
let strokeRatioY = 3;
let strokeSizeX;
let strokeSizeY;

// Directions
// true => ascending, false => descending
let redDir = true;
let greenDir = false;
let blueDir = true;

// Cache 
let firstPositionSaved = false;
let firstPositionReached = false;

// 0 => Compute particle data
// 1 => Compute color data
// 2 => Paint the curve
let computingPhase = 0;

let firstX;
let firstY;
let particleCounter = 0;

// Thresholds
let overlapThreshold = 1000;
let positionThreshold = 1;

// ***************************************
// ***************************************
// ******** p5js Main Functions **********
// ***************************************
// ***************************************        


// --------- SETUP ---------

function setup() {
  noLoop();
  // ********** Curves **********
  // Mathematical a, b values
  a = round(random(1, 10));
  b = round(random(1, 10));
  colors = ["blue", "green", "blue", "red"];
  // a = 1;
  // b = 1;

  strokeSizeX = calculatePercent(strokeRatioX, size);
  strokeRatioY = calculatePercent(strokeRatioY, size);

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
}


// --------- DRAW ---------

function draw() {
  // Add first color in the tail so color blend is perfect
  colors[colors.length] = colors[0];

  // Calculate curve data
  calculateCurveData();


  // Calculate color data
  calculateColorData();


  // Actually paint the curve with both curve and color data already computed
  paintCurve();
}

// ***************************************
// ***************************************
// ********* Curve calculation ***********
// ***************************************
// ***************************************   

function calculateCurveData() {
  let particleComputationFinished = false;

  // Pre-compute the curve's particles
  while (!particleComputationFinished) {
    y = calculatePercent(33, size) * sin(a * t + PI / 2);
    x = calculatePercent(33, size) * sin(b * t);
    positionedX = width / 2 + x;
    positionedY = height / 2 + y;
  
    curveData.push({
      x: positionedX,
      y: positionedY,
      p: particleCounter,
      t
    });
  
    if (!firstPositionSaved) {
        firstX = positionedX;
        firstY = positionedY;
  
        firstPositionSaved = true;
  
        text('iX: ' + firstX.toString() + ', iY: ' + firstY.toString(), 10, 20);
        text('a: ' + a.toString() + ', b: ' + b.toString(), 10, 30);
      }

    t += .001;
    particleCounter++;
  
    if (particleCounter > getCorrectOverlapThreshold() &&
      isInsideThreshold(positionedX, firstX, positionThreshold) &&
      isInsideThreshold(positionedY, firstY, positionThreshold)) {
      
      firstPositionReached = true;
      particleComputationFinished = true;
  
      console.log('Curve pre-computing finished at particle n.', particleCounter);
      console.log(curveData);

      break;
    }
    
    // console.log('Computed particle n.', particleCounter);
  }
}

function calculateColorData() {
  console.log('Calculating color data...');
  console.log(colors);

  const numberOfParticles = curveData.length;
  const numberOfVectors = colors.length;
  const colorSteps = calculateNumberOfSteps(numberOfVectors);
  const stepSize = round(numberOfParticles / colorSteps);

  console.log('Number of particles:', numberOfParticles);
  console.log('Number of color steps:', colorSteps);
  console.log('Step size:', stepSize);
  console.log('Number of vectors:', numberOfVectors);


  // Assign color to all particles
  for (let i = 0; i < curveData.length; i++) {
    const currentColorStep = getCurrentColorStep(i, stepSize);
    const nextColorStep = getNextColorStep(i, stepSize);

    curveData[i].color = calculateParticleColor(currentColorStep, nextColorStep, stepSize, i);
  }

  computingPhase++;
}

function paintCurve() {
  for (let i = 0; i < curveData.length; i++) {
    const currentParticle = curveData[i];

    stroke(currentParticle.color.r, currentParticle.color.g, currentParticle.color.b);
    fill(currentParticle.color.r, currentParticle.color.g, currentParticle.color.b);
    ellipse(currentParticle.x, currentParticle.y, strokeSizeX, strokeSizeY);

    // reassignColors();
  }
}

// ***************************************
// ***************************************
// ********** Helper functions ***********
// ***************************************
// ***************************************   

function parseColor(color) {
  if (color == 'black') return {r: 0, g: 0, b: 0};
  if (color == 'white') return {r: 255, g: 255, b: 255};
  if (color == 'red') return {r: 255, g: 0, b: 0};
  if (color == 'green') return {r: 0, g: 255, b: 0};
  if (color == 'blue') return {r: 0, g: 0, b: 255};
}

function calculateParticleColor(sourceColorStep, targetColorStep, stepSize, particleIndex) {
  const sourceColor = parseColor(colors[sourceColorStep]);
  const targetColor = parseColor(colors[targetColorStep]);

  // console.log(`Source color: ${sourceColorName}, target color: ${targetColorName}`);

  // console.log(`Particle n. ${particleIndex} moves from ${sourceColorName} to ${targetColorName}`);

  const r = calculateSingleColor(sourceColor.r, targetColor.r, stepSize, particleIndex);
  const g = calculateSingleColor(sourceColor.g, targetColor.g, stepSize, particleIndex);
  const b = calculateSingleColor(sourceColor.b, targetColor.b, stepSize, particleIndex);

  return {r, g, b};
}

function calculateNumberOfSteps(colorVectors) {
  if (colorVectors == 0 || colorVectors == 1) return 1;
  if (colorVectors == 2) return 1;

  return colorVectors - 1;
}

function getCurrentColorStep(particleIndex, stepSize) {
  return Math.floor((particleIndex / stepSize));
}

function getNextColorStep(particleIndex, stepSize) {
  return getCurrentColorStep(particleIndex, stepSize) + 1;
}

function calculateSingleColor(sourceValue, targetValue, stepSize, particleIndex) {
  if (sourceValue == targetValue) return sourceValue;

  // true => positive, false => negative
  const direction = targetValue > sourceValue;
  const difference = Math.abs(sourceValue - targetValue);
  const stepValue = difference / stepSize;
  let nextValue;

  if (direction) nextValue = sourceValue + (stepValue * (particleIndex % stepSize));
  else nextValue = sourceValue - (stepValue * (particleIndex % stepSize));

  // console.log(`Calculating color for particle n. ${particleIndex}`);
  // console.log(`Source value: ${sourceValue}, target value: ${targetValue}, direction: ${direction}, difference: ${difference}`);
  // console.log(`Step value: ${stepValue}, Next value: ${nextValue}`);

  // console.log('sourceValue', sourceValue);
  // console.log('stepValue', stepValue);
  // console.log('particleIndex', particleIndex);
  // console.log('stepValue * particleIndex', stepValue * particleIndex);
  // console.log('nextValue', nextValue);

  return nextValue;
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

function calculatePercent(percent, num) {
  return (percent / 100) * num;
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