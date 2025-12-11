const game = {
    startMoney: 200,
    bankMoney: 0,
    potMoney: 0,
    winBank: 5000,
    wordGuessOddsPay: 100,
    wordGuessOddsBet: 1,
    sageMinBid: 40,

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
        if (amount <= 0) {
            this.statusReport("Amount must be greater than 0");
            return;
        }
        if (amount > this.bankMoney) {
            this.statusReport("Amount must not exceed bank");
            return;
        }
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
            document.getElementById("mainOptionsDiv").style.display = "flex";
        }, 5000)
    },

    doPlayerLetterGuessOpt() {
        document.getElementById("mainOptionsDiv").style.display = "none";
        document.getElementById("playerGuessDiv").style.display = "flex";
    },

    statusReport(message) {
        document.getElementById("statusPara").innerText = message;
    }




}