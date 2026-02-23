const fs = require('fs');

const mergeFuncs = {

    /**
     * Merge the newly marked words from the interim file back
     * into the original edit list, to produce a new output files
     * arg1 - eidt file
     * arg2 - interim file
     * arg3 - output file
     */
    mergeLists() {
        // Get arguments
        const args = process.argv.slice(2);
        const editFile = args[0];
        const interimFile = args[1];
        const outputFile = args[2];

        // Get the lists
        let editStr = fs.readFileSync(editFile, 'utf8');
        const editList = editStr.split('\n');
        let interimStr = fs.readFileSync(interimFile, 'utf8');
        const interimList = interimStr.split('\n');
        let outputList = [];

        // Get words from interim file
        let editIndex = 0;
        for (let interimSrcWord of interimList) {
            let interimHasStar = false;
            let interimWord = interimSrcWord;
            let p = interimSrcWord.indexOf('*');
            if (p > -1) {
                interimWord = interimSrcWord.substring(0, p);
                interimHasStar = true;
            }

            let editWord = "";
            let editSrcWord = "";
            while (editIndex < editList.length && editWord < interimWord) {
                editSrcWord = editList[editIndex];
                editWord = editSrcWord;
                let p = editSrcWord.indexOf('*');
                let editHasStar = false;
                if (p > -1) {
                    editHasStar = true;
                    editWord = editSrcWord.substring(0, p);
                }
                if (editWord >= interimWord) break;
                outputList.push(editSrcWord);
                ++editIndex;
            }
            if (editWord === interimWord) {
                if (interimHasStar) {
                    outputList.push(interimSrcWord);
                }
                else {
                    outputList.push(editSrcWord);
                }
            }
            else if (editWord > interimWord) {
                // The interim word is an addition
                outputList.push(interimSrcWord);
                // get the next interim word - reget the edit word
            }
        }
        // Output the residue of the edit list
        for (let i = editIndex; i < editList.length; i++) {
            outputList.push(editList[i]);           
        }

        // Save the output
        let outputStr = outputList.join("\n");
        fs.writeFileSync(outputFile, outputStr, 'utf8');
    }
}

// Main Program
mergeFuncs.mergeLists();
