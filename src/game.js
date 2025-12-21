const game = {
    startMoney: 200,
    bankMoney: 0,
    potMoney: 0,
    winBank: 5000,
    wordGuessOddsPay: 100,
    wordGuessOddsBet: 1,
    sageMinBid: 40,
    playerGuessMinBid: 10,
    magicSelectorMinBid: 5,
    selectorBidAmount: 0,
    words: "",
    selectorIntervalId: 0,
    wordGuessCount: 0,
    blockSubmit: false,
    remainingLetterMin: 3,

    initialise() {
        this.bankMoney = this.startMoney;
        this.potMoney = 0;
        wordFuncs.initialise();
    },

    startWord() {
        document.getElementById("wordsDiv").style.display = "flex";
        this.wordGuessOddsPay = 100;
        this.wordGuessOddsBet = 1;
        this.wordGuessCount = 0;
        wordFuncs.lettersSelected = "";
        // Select a word or phrase
        let isPhrase = false;
        if (Math.random() < 0.66) {
            this.words = wordFuncs.selectWord();
        }
        else {
            isPhrase = true;
            this.words = wordFuncs.selectPhrase();
        }
        wordFuncs.makeWordArray(this.words)
        wordFuncs.displayWordBlanks();

        document.getElementById("initialBidDiv").style.display = "flex";

        // Display the bank details
        this.displayMoney();
    },

    brokeRestart() {
        document.getElementById("brokeDiv").style.display = "none";
        this.initialise();
        this.startWord();
    },

    winRestart() {
        document.getElementById("winGameDiv").style.display = "none";
        this.initialise();
        this.startWord();
    },

    rebidWord() {
        document.getElementById("initialBidDiv").style.display = "flex";
    },

    displayMoney() {
        document.getElementById("bankAmount").innerText = this.bankMoney;
        document.getElementById("potAmount").innerText = this.potMoney;
        document.getElementById("odds").innerText = this.wordGuessOddsPay + ":" + this.wordGuessOddsBet;
    },

    doInitialBid() {
        let amount = parseInt(document.getElementById("initialBid").value);
        if (isNaN(amount)) {
            this.statusReport("Bid amount is invalid");
            return;
        }
        if (amount <= 0) {
            this.statusReport("Amount must be greater than 0");
            return;
        }
        if (amount > this.bankMoney) {
            this.statusReport("Amount must not exceed bank");
            return;
        }
        this.statusReport("");
        this.potMoney = amount;
        this.bankMoney -= amount;
        this.displayMoney();
        document.getElementById("initialBidDiv").style.display = "none";
        this.displayMainOptions();
    },

    displayMainOptions() {
        // Check the number of letters unrevealed
        let remainingLetterCount = wordFuncs.countLettersLeft();
        if (remainingLetterCount >= wordFuncs.numWordsLetters/2) {
            document.getElementById("mainOptionsDiv").style.display = "flex";
        }
        else {
            document.getElementById("guessWordOptOnlyDiv").style.display = "flex";
        }
    },

    doSageOpt() {
        // Check whether the player has enough money
        if (this.bankMoney < this.sageMinBid) {
            let message = "You have insufficient funds for the Sage";
            this.statusReport(message);
            return;
        }
        document.getElementById("mainOptionsDiv").style.display = "none";
        document.getElementById("sageDiv").style.display = "flex";
        document.getElementById("sageChoiceDiv").style.display = "none";

    },

    doSageBid() {
        let amount = parseInt(document.getElementById("sageBid").value);
        if (isNaN(amount)) {
            let message = "You have entered an invalid bid amount";
            this.statusReport(message);
            return;
        }
        if (amount < this.sageMinBid) {
            let message = "Minimum bid is 40";
            this.statusReport(message);
            return;
        }
        else if (amount > this.bankMoney) {
            let message = "You have insufficient funds for bid";
            this.statusReport(message);
            return;
        }
        let letter = wordFuncs.getSageLetter();
        document.getElementById("sageChoiceDiv").style.display = "block";
        document.getElementById("sageLetter").innerText = letter;
        this.bankMoney -= amount;
        let letterFound = wordFuncs.submitLetterChoice(letter);
        if (letterFound) {
            let message = "The sage is wise";
            this.statusReport(message);
            this.potMoney += amount;
            let oddsObj = wordFuncs.getWordsOdds();
            this.wordGuessOddsPay = oddsObj.oddsPay;
            this.wordGuessOddsBet = oddsObj.oddsBet;
        }
        else {
            let message = "Your letter is not present - try again"
            this.statusReport(message);
        }
        this.displayMoney();
        this.blockSubmit = true;
        // Clear the sage display after a time delay
        setTimeout(() => {
            document.getElementById("sageDiv").style.display = "none";
            this.blockSubmit = false;
            this.displayMainOptions();
        }, 5000);
    },

    doPlayerLetterGuessOpt() {
        if (this.bankMoney < this.playerGuessMinBid) {
            this.statusReport("You have insufficient funds for this option");
            return;
        }
        document.getElementById("mainOptionsDiv").style.display = "none";
        document.getElementById("playerGuessDiv").style.display = "flex";
    },

    doPlayerLetterGuess() {
        // Check the amount bid
        let bidAmount = parseInt(document.getElementById("playerGuessBid").value);
        if (isNaN(bidAmount)) {
            let message = "Bid amount must be a valid number";
            this.statusReport(message);
            return;
        }
        if (bidAmount < this.playerGuessMinBid) {
            let message = "Bid amount less than the minimum (10)";
            this.statusReport(message);
            return;
        }
        if (this.bankMoney < bidAmount) {
            let message = "Bid amount exceeds your bank";
            this.statusReport(message);
            return;
        }
        // Check the letter guess
        let letter = document.getElementById("playerGuessLetter").value;
        if (letter.length > 1) {
            let message = "Your letter guess should only be one letter";
            this.statusReport(message);
            return;
        }
        if (letter === "") {
            let message = "You have not entered a letter guess";
            this.statusReport(message);
            return;
        }
        letter = letter.toUpperCase();
        if (letter < "A" || letter > "Z") {
            let message = "You have entered an invalid character for your letter guess";
            this.statusReport(message);
            return;
        }
        this.bankMoney -= bidAmount;
        let letterFound = wordFuncs.submitLetterChoice(letter);
        if (!letterFound) {
            let message = "The letter is not present, choose an option to try again";
            this.statusReport(message);
        }
        else {
            let message = "Good guess";
            this.statusReport(message);
            this.potMoney += bidAmount;
            let oddsObj = wordFuncs.getWordsOdds();
            this.wordGuessOddsPay = oddsObj.oddsPay;
            this.wordGuessOddsBet = oddsObj.oddsBet;
        }
        this.displayMoney();
        this.blockSubmit = true;
        setTimeout(() => {
            this.statusReport("");
            this.blockSubmit = false;
            document.getElementById("playerGuessDiv").style.display = "none";
            this.displayMainOptions();
        }, 5000);

    },

    doMagicSelectorOpt() {
        if (this.bankMoney < this.magicSelectorMinBid) {
            this.statusReport("You have insufficient funds for this option");
            return;
        }
        document.getElementById("mainOptionsDiv").style.display = "none";
        document.getElementById("magicSelectorDiv").style.display = "flex";
        document.getElementById("selectorBidDiv").style.display = "block";
        document.getElementById("selectorLetterDiv").style.display = "none";
    },

    doSelectorBid() {
        let bidAmount = parseInt(document.getElementById("selectorBid").value);
        if (isNaN(bidAmount)) {
            this.statusReport("Bid amount is invalid");
            return;
        }
        if (bidAmount < this.magicSelectorMinBid) {
            this.statusReport("The minimum bid amount is 5");
            return;
        }
        if (bidAmount > this.bankMoney) {
            this.statusReport("Your bid is greater than your funds");
            return;
        }
        this.statusReport("");
        this.selectorBidAmount = bidAmount;
        document.getElementById("selectorBidDiv").style.display = "none";
        document.getElementById("selectorLetterDiv").style.display = "block";

        // Get the letters for the selector
        let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        // Remove the letters already selected
        let selections = "";
        for (let c of alphabet) {
            if (wordFuncs.lettersSelected.indexOf(c) === -1) {
                selections += c;
            }
        }
        // Display the characters in intervals (upto 12)
        let count = 0;
        let selectorIntervalId = setInterval(() => {
            let r = Math.floor(Math.random() * selections.length);
            let c = selections[r];
            document.getElementById("selectorCell").innerText = c;
            ++count;
            if (count > 12) clearInterval(selectorIntervalId);
        }, 1500);
        this.selectorIntervalId = selectorIntervalId;
    },

    doMagicSelection() {
        // Get the letter
        let letter = document.getElementById("selectorCell").innerText;
        let letterFound = wordFuncs.submitLetterChoice(letter);
        this.bankMoney -= this.selectorBidAmount;
        if (!letterFound) {
            this.statusReport("Bad Luck this time");
        }
        else {
            this.potMoney += this.selectorBidAmount;
            let oddsObj = wordFuncs.getWordsOdds();
            this.wordGuessOddsPay = oddsObj.oddsPay;
            this.wordGuessOddsBet = oddsObj.oddsBet;
        }
        this.displayMoney();
        clearInterval(this.selectorIntervalId);
        this.blockSubmit = true;
        setTimeout(() => {
            this.blockSubmit = false;
            this.statusReport("");
            document.getElementById("magicSelectorDiv").style.display = "none";
            this.displayMainOptions();
        }, 5000);
    },

    doWordGuessOpt() {
        document.getElementById("mainOptionsDiv").style.display = "none";
        document.getElementById("guessWordOptOnlyDiv").style.display = "none";
        document.getElementById("wordGuessDiv").style.display = "flex";
    },

    doWordGuess() {
        // Get the guess and check it
        let wordGuess = document.getElementById("wordGuess").value;
        if (wordGuess === "") {
            this.statusReport("You have not entered any guess");
            return;
        }
        wordGuess = wordGuess.toUpperCase();
        // Check for invalid characters
        let invalid = false;
        for (let c of wordGuess) {
            if (!(c === " " || (c >= "A" && "Z" >= c))) {
                invalid = true;
                break;
            }
        }
        if (invalid) {
            this.statusReport("Your guess contains invalid characters");
            return;
        }

        if (this.words != wordGuess) {
            this.potMoney = 0;
            if (this.wordGuessCount >= 1) {
                if (this.bankMoney > 0) {
                    this.statusReport("Bad Luck - you have used up your word guesses - next word coming up");
                    wordFuncs.revealWords();
                    setTimeout(() => {
                        this.statusReport("");
                        document.getElementById("wordGuessDiv").style.display = "none";
                        this.startWord();
                    }, 5000);
                }
                else {
                    // Last Guess and player broke
                    this.statusReport("Bad Luck - your last guess and cash");
                    wordFuncs.revealWords();
                    this.blockSubmit = true;
                    setTimeout(() => {  
                        this.statusReport("");
                        this.blockSubmit = false;
                        document.getElementById("wordGuessDiv").style.display = "none";
                        this.displayBroke();
                    }, 5000);
                }
            }
            else {
                // Guess Remaining
                if (this.bankMoney > 0) {
                    this.statusReport("Bad Luck this time - you have one more guess at the word");
                    this.blockSubmit = true;
                    setTimeout(() => {
                        this.statusReport("");
                        this.blockSubmit = false;
                        document.getElementById("wordGuessDiv").style.display = "none";
                        this.rebidWord();
                    }, 5000);
                }
                else {
                    this.statusReport("Bad Luck - and no money in the bank");
                    wordFuncs.revealWords();
                    this.blockSubmit = true;
                    setTimeout(() => {
                        this.blockSubmit = false;
                        this.statusReport("");
                        document.getElementById("wordGuessDiv").style.display = "none";
                        this.displayBroke();
                    });
                }
            }           
        }
        else {
            // Guess Correct
            wordFuncs.revealWords();
            let paymentAmount = this.potMoney * this.wordGuessOddsPay;
            this.statusReport(`Well Done - Your Guess is Correct - you won ${paymentAmount}`);
            this.bankMoney += paymentAmount;
            this.potMoney = 0;
            this.blockSubmit = true;
            if (this.bankMoney < this.winBank) {
                setTimeout(() => {
                    this.blockSubmit = false;
                    this.statusReport("");
                    document.getElementById("wordGuessDiv").style.display = "none";
                    this.startWord();
                }, 5000);
            }
            else {
                setTimeout(() => {
                    this.blockSubmit = false;
                    this.statusReport("");
                    document.getElementById("wordGuessDiv").style.display = "none";
                    this.displayWin();
                }, 5000);
            }

        }
        this.displayMoney();
        this.wordGuessCount += 1;
    },

    displayBroke() {
        document.getElementById("wordsDiv").style.display = "none";
        document.getElementById("brokeDiv").style.display = "flex";
    },

    displayWin() {
        document.getElementById("wordsDiv").style.display = "none";
        document.getElementById("winGameDiv").style.display = "flex";
    },

    statusReport(message) {
        document.getElementById("statusPara").innerText = message;
    }

}