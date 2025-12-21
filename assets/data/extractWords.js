const fs = require('fs/promises');

async function processWordList() {
    // Get the input and output file names
    const args = process.argv.slice(2);
    const inputFile = args[0];
    const outputFile = args[1];

    // Read in the input file
    let inputString = await fs.readFile(inputFile, 'utf8');

    // Split into a word array
    let wordSource = inputString.split('\n');

    // Select words with "*"
    let wordsSelected = [];
    for (let word of wordSource) {
        if (word.indexOf("*") >= 0) {
            // Remove the *
            let w = word.replace(/\*/g, "");
            wordsSelected.push(w);
        }
    }

    // Output the selected words as json
    wordsJson = JSON.stringify(wordsSelected, null, 2);

    fs.writeFile(outputFile, wordsJson, (err) => {if (err) throw err;});
    
}

processWordList();