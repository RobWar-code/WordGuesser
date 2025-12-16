const fs = require("fs");
const phraseListSrc = require('./phraseListSrc.js');

function processPhraseList() {
    // Convert to lower case
    let p1 = []
    for (let item of phraseListSrc) {
        p1.push(item.toLowerCase());
    }

    // Sort
    p1.sort();

    // Remove items with non-alpha and de-duplicate
    let p2 = [];
    let lastItem = "";
    for (let item of p1) {
        if (item != lastItem) {
            if (item.indexOf("'") === -1) {
                p2.push(item);
            }
        }
        lastItem = item;
    }

    // Output as json
    let jsonList = JSON.stringify(p2, null, 2);
    fs.writeFile("phraseList.json", jsonList, (err) => {if (err) throw err;});
}

processPhraseList();