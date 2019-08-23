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
        verb = "use";
        word = null;
    }

    return { verb, word };
}

function printDictionaryEntry(word, { definitions, synonyms, antonyms, examples }) {
    console.log(chalk.bold('\n' + word));

    // definition
    if (definitions) {
        console.log('\t', definitions[0].text, '\n');    
    }

    // synonyms
    if (synonyms) {
        console.log(chalk.inverse('\n' + "Synonyms"));

        if (! synonyms || ! synonyms.length)
            console.log('\t No synonyms found for this word.')
    
        printInColumns(synonyms, 4);
    }

    // antonyms
    if (antonyms) {
        console.log(chalk.inverse('\n' + "Antonyms"));

        if (! antonyms || ! antonyms.length)
            console.log('\t No antonyms found for this word.')

        printInColumns(antonyms, 4);
    }

    if (examples) {
        console.log(chalk.inverse('\n' + "Examples"));
        examples.forEach((ex, indx) => console.log(`\t${indx+1}. ${ex.text}`));
    }

    console.log();
}

(async function () {
    const { verb, word } = parseArgs();

    switch (verb) {
        case "def": {
            const definitions = await getDefinition(word);
            printDictionaryEntry(word, { definitions });
            break;
        }
        case "syn": {
            const synonyms = await getSynonyms(word);
            printDictionaryEntry(word, { synonyms });
            break;
        }
        case "ant": {
            const antonyms = await getAntonyms(word);
            printDictionaryEntry(word, { antonyms });
            break;
        }
        case "ex": {
            const examples = await getExamples(word);
            printDictionaryEntry(word, { examples });
            break;
        }
        case "dict": {
            const [
              definitions,
              synonyms,
              antonyms,
              examples
            ] = await getDictionaryEntry(word);
            printDictionaryEntry(word, { definitions, synonyms, antonyms, examples });
            break;
        }
        case "wod": {
            const todaysWord = await getWordOfTheDay();
            const [
                definitions,
                synonyms,
                antonyms,
                examples
              ] = await getDictionaryEntry(todaysWord);
              printDictionaryEntry(todaysWord, { definitions, synonyms, antonyms, examples });
            break;
        }
        case "play":
            await playGame();
            break;
        case "use":
        default:
            printUsage();
            break;
    }

    process.exit(0);
})();
