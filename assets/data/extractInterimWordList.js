const fs = require('fs');

const extractionProcess = {

    extractRandomWords() {
        const minWordLen = 6;
        const maxWordLen = 12;

        // Get the input and output file names
        const args = process.argv.slice(2);
        const inputFile = args[0];
        const outputFile = args[1];
    
        // Read in the input file
        let inputString = fs.readFileSync(inputFile, 'utf8');
    
        // Split into a word array
        let wordSource = inputString.split('\n');
        let wordSourceLen = wordSource.length;
        let wordFlags = new Array(wordSourceLen).fill(false);

        // Find the last selected item
        let lastSelected = 0;
        for (let w of wordSource) {
            if (w.indexOf("**") > 0) {
                break;
            }
            ++lastSelected;
        }

        // Select 30,000 random words
        let interimList = [];
        for (let i = 0; i < wordSourceLen; i++) {
            let r = Math.floor(Math.random() * wordSourceLen);
            if (!wordFlags[r]) {
                wordFlags[r] = true;
                let w = wordSource[r];
                if (r > lastSelected || (r <= lastSelected && w.indexOf("*") > 0)) {
                    if (w.indexOf("**") > 0) {
                        if (w.length >= minWordLen + 2  && w.length <= maxWordLen + 2) {
                            interimList.push(w);
                        }
                    }
                    else if (w.indexOf("*") > 0) {
                        if (w.length >= minWordLen + 1 && w.length < maxWordLen + 1) {
                            interimList.push(w);
                        }
                    }
                    else if (w.length >= minWordLen && w.length <= maxWordLen) {
                        interimList.push(w);
                    }

                    if (interimList.length >= 30000) {
                        break;
                    }
                }
            }
        }
        
        // Sort the interim list
        interimList.sort();

        // Save as a txt file
        fs.writeFileSync(outputFile, interimList.join('\n'), "utf8");
    }
} 

// Main Program
extractionProcess.extractRandomWords();