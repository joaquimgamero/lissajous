import { writeFile } from 'fs';



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

let colorPossibilities = permutation(["black", "white", "red", "green", "blue"], 5);
console.log(colorPossibilities);
console.log('Total color possibilities:', colorPossibilities.length);

let backgroundPossibilities = permutation([true, false], 3);
console.log(backgroundPossibilities);
console.log('Total color possibilities:', backgroundPossibilities.length);


let strokeSizePossibilites = permutation(["small", "medium", "thick"], 2);
console.log(strokeSizePossibilites);
console.log('Total color possibilities:', strokeSizePossibilites.length);

const jsonData = JSON.stringify({colors: colorPossibilities, background: backgroundPossibilities, strokeSizes: strokeSizePossibilites});

writeFile("possibilities.json", jsonData, function(err) {
    if (err) {
        console.log(err);
    }
});