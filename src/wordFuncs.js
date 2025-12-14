const wordFuncs = {
    minWordLength: 6,
    maxWordLength: 14,
    maxPhraseWords: 5,
    wordsSelected: [],
    phrasesSelected: [],
    lettersSelected: "",
    wordArray: [],
    commonLetters: "ETAISONDRCLMPUGBVFHWKXJZQ",
    numWordsLetters: 0,

    initialise() {
        this.wordsSelected = [];
        this.phrasesSelected = [];
    },

    displayWordBlanks() {
        let wordsPanel = document.getElementById("wordsPanel");
        wordsPanel.innerHTML = "";
        let html = "";
        if (this.wordArray.length === 1) {
            html = '<div><table class="wordTable singleTabWord"><tr>';
            let count = 0;
            for (let letterItem of this.wordArray[0]) {
                html += `<td id="cell${count}"></td>`;
                ++count;
            }
            html += "</tr></table></div>";
        }
        else {
            // Phrase - Multi-word
            // Determine the number of words on each line
            let wordCount = this.getWordDistribution();
            let count = 0;
            // For each line of the word count
            // Create the line of the display
            for (let item of wordCount) {
                if (item.wordCount === 1) {
                    html += '<div><table class="wordTable singleTabWord"><tr>';
                    for (let letterItem of this.wordArray[item.wordStart]) {
                        html += `<td id="cell${count}"></td>`;
                        ++count;
                    }
                    html += "</tr></table></div>";
                }
                else {
                    html += '<div class="multiTabRow">';
                    let p = item.wordStart;
                    for (let i = 0; i < item.wordCount; i++) {
                        html += '<table class="wordTable multiTabWord"><tr>';
                        for (let letterItem of this.wordArray[p]) {
                            html += `<td id="cell${count}"></td>`;
                            ++count;
                        }
                        html += '</tr></table>'
                        ++p;
                    }
                    html += '</div>';
                }
            }

        }
        wordsPanel.innerHTML = html;
    },

    getWordDistribution() {
        let wordCount = [];
        let currentWordCount = 0;
        let currentLineLength = 0;
        let currentLineNum = 0;
        let currentStartNum = 0;
        let count = 0;
        for (let w of this.wordArray) {
            // Check whether the current word will fit on the current line
            if (currentLineLength === 0) {
                currentWordCount = 1;
                currentStartNum = count;
                currentLineLength = w.length;
            }
            else if (currentLineLength + 1 + w.length < this.maxWordLength) {
                currentLineLength += w.length + 1;
                currentWordCount += 1;
            }
            else {
                // Word will not fit - start new line
                let lineItem = {
                    wordStart: currentStartNum,
                    wordCount: currentWordCount,
                    length: currentLineLength
                };
                wordCount.push(lineItem);
                currentWordCount = 1;
                currentStartNum = count;
                currentLineLength = w.length;
            }

            // If the last word
            if (count >= this.wordArray.length - 1) {
                let lineItem = {
                    wordStart: currentStartNum,
                    wordCount: currentWordCount,
                    length: currentLineLength
                };
                wordCount.push(lineItem);
            }

            ++count;
        }
        return wordCount;
    },

    makeWordArray(words) {
        this.wordArray = [];
        let wordSet = words.split(" ");
        let id = 0;
        for (let w of wordSet) {
            let letterArray = [];
            for (let c of w) {
                let letterItem = {
                    id: id,
                    letter: c,
                    revealed: false
                }
                ++id;
                letterArray.push(letterItem);
            }
            this.wordArray.push(letterArray);
        }
        this.numWordsLetters = id;
    },

    selectWord() {
        let r = wordList.length;
        let word = null;
        let count = 0;
        let found = false;
        while (!found && count < 100) {
            let p = Math.floor(Math.random() * r);
            word = wordList[p];
            // Check whether word is valid length;
            if (word.length <= this.maxWordLength && word.length >= this.minWordLength) {
                let wordFound = false;
                // Check Whether the word has already been used
                for (let w of this.wordsSelected) {
                    if (w === word) {
                        wordFound = true;
                        break;
                    }
                }
                if (!wordFound) {
                    found = true;
                    break;
                }
            }
            ++count;
        }
        this.wordsSelected.push(word);
        return word.toUpperCase();
    },

    selectPhrase() {
        let r = phraseList.length;
        let phrase = null;
        let count = 0;
        let found = false;
        while (!found && count < 100) {
            let p = Math.floor(Math.random() * r);
            phrase = phraseList[p];
            // Check whether the phrase has already been selected
            let phraseFound = false;
            for (let testPhrase of this.phrasesSelected) {
                if (testPhrase === phrase) {
                    phraseFound = true;
                    break;
                }
            }
            if (!phraseFound) {
                // Check whether the words are valid
                let words = phrase.split(" ");
                if (words.length <= this.maxPhraseWords) {
                    // Check the length of the individual words
                    let invalid = false;
                    for (let w of words) {
                        if (w.length > this.maxWordLength) {
                            invalid = true;
                            break;
                        }
                    }
                    if (!invalid) {
                        found = true;
                        break;
                    }
                }
            }
            ++count;
        }
        this.phrasesSelected.push(phrase);
        return phrase.toUpperCase();
    },

    getSageLetter() {
        let letterOpts = "";
        for (let c of this.commonLetters) {
            if (this.lettersSelected.indexOf(c) === -1) {
                letterOpts += c;
                if (letterOpts.length >= 6) {
                    break;
                }
            }
        }
        let r = Math.floor(Math.random() * letterOpts.length);
        return letterOpts[r];
    },

    submitLetterChoice(letter) {
        // Check whether the letter has already been selected
        if (this.lettersSelected.indexOf(letter) > -1) {
            return false;
        }

        // Check through letters of the word array
        let count = 0;
        let found = false;
        for (let w of this.wordArray) {
            for (let letterItem of w) {
                if (!letterItem.revealed) {
                    if (letterItem.letter === letter) {
                        found = true;
                        cellId = "cell" + count;
                        document.getElementById(cellId).innerText = letter;
                        letterItem.revealed = true;
                    }
                }
                ++count;
            }
        }
        this.lettersSelected += letter;
        return found;
    },

    getWordsOdds() {
        let revealedCount = 0;
        let totalCount = 0;
        for (let w of this.wordArray) {
            for (let letterItem of w) {
                if (letterItem.revealed) ++revealedCount;
                ++totalCount;
            }
        }
        let oddsPay = Math.round(totalCount / revealedCount) * 2;
        let oddsBet = 1;
        return {oddsPay: oddsPay, oddsBet: oddsBet};
    },

    revealWords() {
        let id = 0;
        for (let w of this.wordArray) {
            for (let letterItem of w) {
                if (!letterItem.revealed) {
                    document.getElementById(`cell${id}`).innerText = letterItem.letter;
                }
                ++id;
            }
        }
    },

    countLettersLeft() {
        let count = 0;
        for (let w of this.wordArray) {
            for (let letterItem of w) {
                if (!letterItem.revealed) {
                    ++count;
                }
            }
        }
        return count;
    }

}