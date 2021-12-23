// Initial time
let t = 0;

// Lissajous curve info, computed before actual drawing
const curveData = [];

// Resolution (px)
let size = 600;

// Stroke size
let strokeRatioX = 12;
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
  a = 9;
  b = 3;
  colors = ["blue", "green", "red", "blue"];
  hueRotation = 240;

  // 0 => top-left, 1 => top-right, 2 => bottom-left
  backgroundCorners = [true, true, true];
  backgroundHueRotation = 60;

  console.log('Colors:', colors);
  console.log('Hue Rotation:', hueRotation);
  console.log('Background Hue Rotation:', backgroundHueRotation);

  strokeSizeX = calculatePercent(strokeRatioX, size);
  strokeSizeY = calculatePercent(strokeRatioY, size);

  // Randomize colors
  red = random(0, 255);
  green = random(0, 255);
  blue = random(0, 255);

  // ********** Background **********
  const ratio = size / 256;

  // const spice = random(0, 256);
  // const spicePosition = round(random(1, 3));

  createCanvas(size, size);

  // // Rotate background color
  // bgColor = parseColor(backgroundColor);
  // hexBgColor = rgbToHex(bgColor.r, bgColor.g, bgColor.b);
  // rotatedHexBgColor = changeHue(hexBgColor, backgroundHueRotation);
  // finalBgColor = hexToRGB(rotatedHexBgColor);

  // background(finalBgColor.r, finalBgColor.g, finalBgColor.b);

  for(let y = 0; y < height; y++) {
    for(let x = 0; x < width; x++) {
      let distanceFromTopLeft = dist(x, y, 0, 0) / ratio;
      let distanceFromTopRight = dist(x, y, width, 0) / ratio;
      let distanceFromBottomLeft = dist(x, y, 0, height) / ratio;

      if (distanceFromTopLeft > 255) distanceFromTopLeft = 255;
      if (distanceFromTopRight > 255) distanceFromTopRight = 255;
      if (distanceFromBottomLeft > 255) distanceFromBottomLeft = 255;

      // Make a rotation to 60 so initial colors are pure RGB
      const standardColor = hueRotate({r: distanceFromTopLeft, g: distanceFromTopRight, b: distanceFromBottomLeft}, 60);
      // Rotate again by the NFT parameter backgroundHueRotation
      const rotatedColor = hueRotate({r: standardColor.r, g: standardColor.g, b: standardColor.b}, backgroundHueRotation);

      stroke(backgroundCorners[0] ? rotatedColor.r : 0, backgroundCorners[1] ? rotatedColor.g : 0, backgroundCorners[2] ? rotatedColor.b : 0);
      point(x, y);
    }
  }

  // background(0);
}


// --------- DRAW ---------

function draw() {
  // Add first color in the tail so color blend is perfect
  colors.push(getLastColorRepetition());

  // Calculate curve data
  calculateCurveData();


  // Calculate color data
  calculateColorData();


  // Actually paint the curve with both curve and color data already computed
  paintCurve();

  // Save image
  // saveCanvas('myCanvas', 'png');
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

      // text('iX: ' + firstX.toString() + ', iY: ' + firstY.toString(), 10, 20);
      text('a: ' + a.toString() + ', b: ' + b.toString(), 10, 20);
    }

    t += .001;
    particleCounter++;

    if (particleCounter > getCorrectOverlapThreshold() &&
      isInsideThreshold(positionedX, firstX, positionThreshold) &&
      isInsideThreshold(positionedY, firstY, positionThreshold)) {

      firstPositionReached = true;
      particleComputationFinished = true;

      console.log('Curve pre-computing finished at particle n.', particleCounter);

      break;
    }
  }
}

function calculateColorData() {
  console.log('Calculating color data...');

  const numberOfParticles = curveData.length;
  const numberOfVectors = colors.length;
  const colorSteps = calculateNumberOfSteps(numberOfVectors);
  const stepSize = round(numberOfParticles / colorSteps);

  console.log('Number of particles:', numberOfParticles);
  console.log('Number of color steps:', colorSteps);
  console.log('Step size:', stepSize);
  console.log('Number of vectors:', numberOfVectors);

  // Assign color to all particles
  for (let i = 0; i < curveData.length - 1; i++) {
    const currentColorStep = getCurrentColorStep(i, stepSize);
    const nextColorStep = getNextColorStep(i, stepSize);

    curveData[i].color = calculateParticleColor(currentColorStep, nextColorStep, stepSize, i);
  }

  computingPhase++;
}

function paintCurve() {
  for (let i = 0; i < curveData.length - 1; i++) {
    const currentParticle = curveData[i];

    if (currentParticle && currentParticle.color) {
      stroke(currentParticle.color.r, currentParticle.color.g, currentParticle.color.b);
      fill(currentParticle.color.r, currentParticle.color.g, currentParticle.color.b);
      ellipse(currentParticle.x, currentParticle.y, strokeSizeX, strokeSizeY);
    }
  }
}

// ***************************************
// ***************************************
// ********** Helper functions ***********
// ***************************************
// ***************************************   

function getLastColorRepetition() {
  if ((a / b) == (6 / 9)) {
    return colors[colors.length - 1];
  }

  return colors[0];
}

function parseColor(color) {
  if (color == 'black') return { r: 0, g: 0, b: 0 };
  if (color == 'white') return { r: 255, g: 255, b: 255 };
  if (color == 'red') return { r: 255, g: 0, b: 0 };
  if (color == 'green') return { r: 0, g: 255, b: 0 };
  if (color == 'blue') return { r: 0, g: 0, b: 255 };
}

function calculateParticleColor(sourceColorStep, targetColorStep, stepSize, particleIndex) {
  const sourceColor = parseColor(colors[sourceColorStep]);
  const targetColor = parseColor(colors[targetColorStep]);

  if (!sourceColor || !targetColor) return null;

  let r = calculateSingleColor(sourceColor.r, targetColor.r, stepSize, particleIndex);
  let g = calculateSingleColor(sourceColor.g, targetColor.g, stepSize, particleIndex);
  let b = calculateSingleColor(sourceColor.b, targetColor.b, stepSize, particleIndex);

  // Hue Rotation
  const rotatedColor = hueRotate({r, g, b}, hueRotation);

  return rotatedColor;
}

// function applyHueRotation(colorValue) {
//   return (colorValue + hueRotation) % 255;
// }

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
  let nextValue;

  // true => positive, false => negative
  const direction = targetValue > sourceValue;
  const difference = Math.abs(sourceValue - targetValue);
  const stepValue = difference / stepSize;

  if (direction) nextValue = sourceValue + (stepValue * (particleIndex % stepSize));
  else nextValue = sourceValue - (stepValue * (particleIndex % stepSize));

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




// ***************************************
// ***************************************
// ******** Hue Rotation Functions *******
// ***************************************
// ***************************************  



function changeHue(rgb, degree) {
  var hsl = rgbToHSL(rgb);
  hsl.h += degree;
  if (hsl.h > 360) {
    hsl.h -= 360;
  }
  else if (hsl.h < 0) {
    hsl.h += 360;
  }
  return hslToRGB(hsl);
}

// exepcts a string and returns an object
function rgbToHSL(rgb) {
  // strip the leading # if it's there
  rgb = rgb.replace(/^\s*#|\s*$/g, '');

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (rgb.length == 3) {
    rgb = rgb.replace(/(.)/g, '$1$1');
  }

  var r = parseInt(rgb.substr(0, 2), 16) / 255,
    g = parseInt(rgb.substr(2, 2), 16) / 255,
    b = parseInt(rgb.substr(4, 2), 16) / 255,
    cMax = Math.max(r, g, b),
    cMin = Math.min(r, g, b),
    delta = cMax - cMin,
    l = (cMax + cMin) / 2,
    h = 0,
    s = 0;

  if (delta == 0) {
    h = 0;
  }
  else if (cMax == r) {
    h = 60 * (((g - b) / delta) % 6);
  }
  else if (cMax == g) {
    h = 60 * (((b - r) / delta) + 2);
  }
  else {
    h = 60 * (((r - g) / delta) + 4);
  }

  if (delta == 0) {
    s = 0;
  }
  else {
    s = (delta / (1 - Math.abs(2 * l - 1)))
  }

  return {
    h: h,
    s: s,
    l: l
  }
}

// expects an object and returns a string
function hslToRGB(hsl) {
  var h = hsl.h,
    s = hsl.s,
    l = hsl.l,
    c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs((h / 60) % 2 - 1)),
    m = l - c / 2,
    r, g, b;

  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  }
  else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  }
  else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  }
  else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  }
  else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  }
  else {
    r = c;
    g = 0;
    b = x;
  }

  r = normalize_rgb_value(r, m);
  g = normalize_rgb_value(g, m);
  b = normalize_rgb_value(b, m);

  return rgbToHex(r, g, b);
}

function normalize_rgb_value(color, m) {
  color = Math.floor((color + m) * 255);
  if (color < 0) {
    color = 0;
  }
  return color;
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRGB(s) {
  // Remove the #
  s = s.split('#')[1];

  var aRgbHex = s.match(/.{1,2}/g);
  var aRgb = {
    r: parseInt(aRgbHex[0], 16),
    g: parseInt(aRgbHex[1], 16),
    b: parseInt(aRgbHex[2], 16)
  };

  return aRgb;
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hueRotate(color, degrees) {
  let hex = rgbToHex(color.r, color.g, color.b);
  hex = changeHue(hex, degrees);
  return hexToRGB(hex);
}