const { getRandomWord, getSynonyms, getDefinition } = require("./index")
const util = require('util');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showHint(hints, cursorIndex) {
    if (hints && hints.length) {
        // check if cursorIndex is possible.
        if (cursorIndex >= hints.length)
            cursorIndex = 0;
        
        console.log(`\nhint: ${hints[cursorIndex].text}\n`);

        if (cursorIndex + 1 < hints.length)
            return cursorIndex + 1;
    } else {
        throw new Error("`hints` must be an array of length > 0!");
    }
}

module.exports = async function () {
    const word = await getRandomWord();
    const defins = await getDefinition(word);
    const syns = await getSynonyms(word);
    const acceptableAnswers = syns.concat(word);
    const ptr = { hintIndex: 1, };

    console.log("Guess the word!\n");

    if (defins && defins.length)
        console.log("Definition: ", defins[0].text);

    (function goto__guessAnswer() {
        rl.question('Your guess? ', guess => {
            if (acceptableAnswers.includes(guess)) {
                console.log("\nYay! You guessed it! Merci and adieu!\n");
                process.exit(0);
                rl.close();
            } else {
                console.log("\nYour answer was incorrect!\n")
                rl.question(`Here are your options:\n ` +
                    `\t1. Try again\n` +
                    `\t2. Hint\n` +
                    `\t3. Quit\n` +
                    `> `
            , answer => {
                    const ans = Number(answer);
                    switch (ans) {
                        case 2:
                            ptr.hintIndex = showHint(defins, ptr.hintIndex);
                        case 1:
                            goto__guessAnswer();
                            break;
                        case 3:
                        default:
                            console.log("\nAdieu Monsieur / Mademoiselle!\n")
                            process.exit(0);
                    }
                })
            }
        });
    })();
}