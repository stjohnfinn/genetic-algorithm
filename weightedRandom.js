/**
 * 
 * @param {[][]} array 2D array of values and their relative likeliness out of the total, index 0 is value, index 1 is likeliness
 * 
 * @returns random value out of the provided values, with weightedness taken into account
 */
export function weightedRandom(array) {
    let sampleSpace = 0;

    for (let i = 0; i < array.length; i++) {
        sampleSpace += array[i][1];
    }

    const randNum = Math.random() * sampleSpace;

    let counter = 0;
    let index = -1;
    while (counter <= randNum && index < array.length) {
        index++;
        counter += array[index][1];
    }

    // (async () => {
    //     await setTimeout( () => {let x = 0;}, 250);
    // })

    return array[index][0];
}

/**
 * @param {[]} outputs array of outputs of all trials
 * @returns {[][]} 2D array of corresponding apparent likeliness and values, array at index 0 is a list of the values, array at index 1 is list of apparent likeliness
 */
export function randomnessAnalysis(outputs) {
    let outputArr = [2];
    outputArr[0] = [];
    outputArr[1] = [];

    for (let i = 0; i < outputs.length; i++) {
        if ( !outputArr[0].includes(outputs[i]) ) {
            outputArr[0].push(outputs[i]);
            outputArr[1].push(1);
        } else {
            const index = outputArr[0].indexOf(outputs[i]);
            outputArr[1][index]++;
        }
    }

    for (let i = 0; i < outputArr[0].length; i++) {
        outputArr[1][i] = (outputArr[1][i] / outputs.length).toFixed(2);
    }

    return outputArr;
}

/**
 * 
 * @param {function} callback function to test runtime of
 * @param {number} trials number of trials to run
 * @param { Object } options options for each function call
 * @return {int} average length of each function invocation across all X trials
 */
export function testRuntime(callback, trials, options) {
    let runtimes = [];
    if (options.hasParameters) {
        for (let i = 0; i < trials; i++) {
            const start = Date.now();
            callback(...options.args);
            runtimes.push(Date.now() - start);
        }
    } else {
        for (let i = 0; i < trials; i++) {
            const start = Date.now();
            callback();
            runtimes.push(Date.now() - start);
        }
    }

    let total = 0;
    for (let i = 0; i < runtimes.length; i++) {
        total += runtimes[i];
    }

    return total / trials;
}