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
    selectorIntervalId: 0,

    initialise() {
        this.bankMoney = this.startMoney;
        this.potMoney = 0;
        this.wordGuessOddsPay = 100;
        this.wordGuessOddsBet = 1;
        wordFuncs.initialise();
    },

    startWord() {
        // Select a word or phrase
        let words;
        let isPhrase = false;
        if (Math.random() < 0) {
            words = wordFuncs.selectWord();
        }
        else {
            isPhrase = true;
            words = wordFuncs.selectPhrase();
        }
        wordFuncs.makeWordArray(words)
        wordFuncs.displayWordBlanks();

        document.getElementById("initialBidDiv").style.display = "flex";

        // Display the bank details
        this.displayMoney();
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
        document.getElementById("mainOptionsDiv").style.display = "flex";
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
        // Clear the sage display after a time delay
        setTimeout(() => {
            document.getElementById("sageDiv").style.display = "none";
            this.displayMainOptions();
        }, 5000)
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
        setTimeout(() => {
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
        setTimeout(() => {
            this.statusReport("");
            document.getElementById("magicSelectorDiv").style.display = "none";
            this.displayMainOptions();
        }, 5000);
    },

    statusReport(message) {
        document.getElementById("statusPara").innerText = message;
    }




}