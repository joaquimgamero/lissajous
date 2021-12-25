import fs from 'fs';
import path from 'path';
import JSONStream from 'JSONStream'


var permutation = function (array, slots) {
    var holdingArr = [];
    var recursiveABC = function (singleSolution) {
        if (singleSolution.length > slots - 1) {
            holdingArr.push(singleSolution);
            return;
        }
        for (var i = 0; i < array.length; i++) {
            recursiveABC(singleSolution.concat([array[i]]));
        }
    };
    recursiveABC([]);
    return holdingArr;
};

var permutationWithoutEquals = function (array, slots) {
    var holdingArr = [];
    var recursiveABC = function (singleSolution) {
        if (singleSolution.length > slots - 1) {
            if (singleSolution.some((val, i, arr) => val !== arr[0])) {
                holdingArr.push(singleSolution);
            }
            return;
        }
        for (var i = 0; i < array.length; i++) {
            recursiveABC(singleSolution.concat([array[i]]));
        }
    };
    recursiveABC([]);
    return holdingArr;
};

// let colorPossibilities5 = permutationWithoutEquals(["black", "red", "green", "blue"], 5);
let colorPossibilities4 = permutationWithoutEquals(["black", "red", "green", "blue"], 4);
let colorPossibilities3 = permutationWithoutEquals(["black", "red", "green", "blue"], 3);
let colorPossibilities2 = permutationWithoutEquals(["black", "red", "green", "blue"], 2);
let colorPossibilities1 = permutation(["black", "red", "green", "blue"], 1);
let colorPossibilities = colorPossibilities4.concat(colorPossibilities3).concat(colorPossibilities2).concat(colorPossibilities1);
console.log(colorPossibilities);
console.log('Total color possibilities:', colorPossibilities.length);

let backgroundPossibilities = permutation([true, false], 3);
console.log(backgroundPossibilities);
console.log('Total background corner possibilities:', backgroundPossibilities.length);


let strokeSizePossibilites = permutation(["medium", "thick"], 2);
console.log(strokeSizePossibilites);
console.log('Total stroke size possibilities:', strokeSizePossibilites.length);

let a = Array.from({ length: 10 }, (e, i) => i + 1);
let b = Array.from({ length: 10 }, (e, i) => i + 1);
// let hueRotation = Array.from({length: 361}, (e, i) => i);
// let backgroundHueRotation = Array.from({length: 361}, (e, i) => i);



const data = {
    colors: colorPossibilities,
    background: backgroundPossibilities,
    strokeSizes: strokeSizePossibilites,
    a,
    b,
    hueRotation: [0, 90, 180, 270]
}

console.log(data);

const jsonData = JSON.stringify(data);



fs.writeFile("possibilities.json", jsonData, function (err) {
    if (err) {
        console.log(err);
    }
});




function getCombinations(options, optionIndex, results, current) {
    var allKeys = Object.keys(options);
    var optionKey = allKeys[optionIndex];

    var vals = options[optionKey];

    for (var i = 0; i < vals.length; i++) {
        current[optionKey] = vals[i];

        if (optionIndex + 1 < allKeys.length) {
            getCombinations(options, optionIndex + 1, results, current);
        } else {
            // The easiest way to clone an object.
            var res = JSON.parse(JSON.stringify(current));
            results.push(res);
        }
    }

    return results;
}

var combinations = getCombinations(data, 0, [], {});

console.log(combinations);
console.log('Total combinations: ', combinations.length);




for (let i = 0; i <= combinations.length; i = i + 1000) {
    let start = i;
    let end = i + 1000;
    let fileName = `${start}-${end}`;

    let configs = combinations.slice(start, end);

    fs.writeFileSync(`configs/${fileName}.json`, JSON.stringify(configs))
}







// var transformStream = JSONStream.stringify();
// var outputStream = fs.createWriteStream("config.json");
// transformStream.pipe( outputStream );
// let saved = 0;
// combinations.forEach((comb) => {
//     transformStream.write(comb);

//     console.log('Saving config n. ' +  saved.toString());
//     saved++;
// });
// transformStream.end();

// outputStream.on(
//     "finish",
//     function handleFinish() {
//         console.log("Done");
//     }
// );