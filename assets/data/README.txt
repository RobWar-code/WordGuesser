The WordGuesser Word and PhraseLists

    Contents
        Introduction
        Derivation of the Phrase List
        Derivation of the Word List   
        Remerging the Lists  

<h1>Introduction
    The lists used by the game are javascript objects - phraseList.js and wordList.js.

    These are both derived entities.

<h1>Derivation of the Phrase List 

    The phrase list was originally generated as a set of json files from 
    chatGPT. These are:
        phrasesA.json
        phrasesB.json
        phrasesC.json
        phrasesD.json
    
    These have been compounded by hand into phraseListSrc.js and then
    parsed to sort and deduplicate by processPhrases.js to produce
    phraseList.js (with an edit to make the json into an object definition).

<h1>Derivation of the Word List

    The original word list is wordsOriginal.txt, this contains many words 
    that are either obscure or likely non-existent.

    This has been copied to wordsEdited.txt and words considered useful for 
    the WordGuesser game marked with an asterisk. Some missing words have
    also been added.

    Originally, the wordsEdited.txt file was being worked through in its entirety.
    However, at about the half way mark, it was decided to make a selection of
    about 30,000 words from the wordsEdited.txt file, to reduce the work load.
    A final tally of about 10000 words being considered adequate. The procedure
    to draw-up an interim list of potential and set words from wordsEdited.txt 
    is 
        extractInterimWordList.js sourceFile destFile

    This is used to create interimWordList.txt, which is then edited itself
    to provide a source for the program extractWords.js to produce the final
    wordList.js object.

<h1>Remerging the Lists
    Merge selected words from interimWordList.txt back into the
    wordsEdited.txt word list, for future use.

    Allow for the original marked word list ending at "onloading".

    The purpose of the new marked list WordsEdited2.txt is to serve
    as the source for Khi, in which some words are elided.

    The utility for doing the merge is mergeInterim.js.
