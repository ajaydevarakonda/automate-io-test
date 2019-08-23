const util = require("util");
const chalk = require('chalk');

const {
    getWordOfTheDay,
    getSynonyms,
    getAntonyms,
    getExamples,
    getDefinition,
    getDictionaryEntry,
    isWord
} = require("../lib");
const playGame = require('../lib/play');

function printUsage() {
    console.log(`Usage: ./dict <verb|word> <word>`);
    console.log(`verb = def|syn|ant|ex|dict|play`);
    console.log(`word = a word of the english language`);
    process.exit(1);
}

function printInColumns(listOfStrings, numColumns) {
    for (let i = 0; i < listOfStrings.length / numColumns; ++i) {
        for (let j = 0; j < numColumns; ++j) {
            const nthString = listOfStrings[numColumns * i + j];
            nthString ? process.stdout.write(nthString.padStart(15)) : null;
        }
        process.stdout.write('\n');
    }
}

function parseArgs(args = process.argv) {
    var verb, word;
    const arguments = process.argv.slice(2);

    if (
        arguments.length === 2 &&
        arguments[0] === "def" &&
        isWord(arguments[1])
    ) {
        verb = "def";
        word = arguments[1];
    } else if (
        arguments.length === 2 &&
        arguments[0] === "syn" &&
        isWord(arguments[1])
    ) {
        verb = "syn";
        word = arguments[1];
    } else if (
        arguments.length === 2 &&
        arguments[0] === "ant" &&
        isWord(arguments[1])
    ) {
        verb = "ant";
        word = arguments[1];
    } else if (
        arguments.length === 2 &&
        arguments[0] === "ex" &&
        isWord(arguments[1])
    ) {
        verb = "ex";
        word = arguments[1];
    } else if (
        arguments.length === 2 &&
        arguments[0] === "dict" &&
        isWord(arguments[1])
    ) {
        verb = "dict";
        word = arguments[1];
    } else if (arguments.length === 1 && arguments[0] === "play") {
        verb = "play";
        word = null;
    } else if (arguments.length === 1 && isWord(arguments[0])) {
        verb = "dict";
        word = arguments[0];
    } else if (arguments.length === 0) {
        verb = "wod";
        word = null;
    } else {
        verb = "puse";
        word = null;
    }

    return { verb, word };
}

(async function () {
    const { verb, word } = parseArgs();

    switch (verb) {
        case "def":
            const definitions = await getDefinition(word);
            console.log(chalk.bold('\n' + word));
            console.log('\t', definitions[0].text, '\n');
            break;
        case "syn":
            const synonyms = await getSynonyms(word);
            console.log(chalk.bold('\n' + word));

            console.log(chalk.inverse('\n' + "Synonyms"));
            if (! synonyms || ! synonyms.length)
                console.log('\t No synonyms found for this word.')
            printInColumns(synonyms, 4);
            break;
        case "ant":
            await getAntonyms(word);
            break;
        case "ex":
            await getExamples(word);
            break;
        case "dict":
            await getDictionaryEntry(word);
            break;
        case "wod":
            const todaysWord = await getWordOfTheDay();
            await getDictionaryEntry(todaysWord);
            break;
        case "play":
            await playGame();
            break;
        case "puse":
        default:
            printUsage();
            break;
    }

    process.exit(0);
})();
