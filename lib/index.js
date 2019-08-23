const request = require("request-promise");
const util = require("util");
const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');

const fsExists = util.promisify(fs.exists);
const fsReadFile = util.promisify(fs.readFile);
const fsWriteFile = util.promisify(fs.writeFile);

const API_ENDPOINT = `https://fourtytwowords.herokuapp.com`;
const result = dotenv.config()
if (result.error) throw result.error
const { API_KEY } = result.parsed;

const isWord = word => /\w+/.test(word);

async function getDefinition(word) {
    try {
        // {apihost}/word/{word}/definitions?api_key={api_key}
        const res = await request(
            `${API_ENDPOINT}/word/${word}/definitions?api_key=${API_KEY}`
        );
            
        return JSON.parse(res);
    } catch (err) {
        if (err.statusCode === 400 && /word not found/.test(err.message)) {
            console.log(
                "This is words api limited to 42 words. Please try another word!"
            );
            process.exit(1);
        }
    }
}

async function getSynonyms(word) {
    try {
        // {apihost}/word/{word}/relatedWords?api_key={api_key}
        const relatedWords = JSON.parse(
            await request(
                `${API_ENDPOINT}/word/${word}/relatedWords?api_key=${API_KEY}`
            )
        );
        const synonyms = relatedWords.filter(
            relWords => relWords.relationshipType === "synonym"
        )[0].words;
        return synonyms;
    } catch (err) {
        if (err.statusCode === 400 && /word not found/.test(err.message)) {
            console.log(
                "This is words api limited to 42 words. Please try another word!"
            );
            process.exit(1);
        }
    }
}

async function getAntonyms(word) {
    try {
        // {apihost}/word/{word}/relatedWords?api_key={api_key}
        const relatedWords = JSON.parse(
            await request(
                `${API_ENDPOINT}/word/${word}/relatedWords?api_key=${API_KEY}`
            )
        );
        const antonymObjects = relatedWords.filter(
            relWords => relWords.relationshipType === "antonym"
        );
        return antonymObjects && antonymObjects.length ? antonymObjects[0].words : [];
    } catch (err) {
        if (err.statusCode === 400 && /word not found/.test(err.message)) {
            console.log(
                "This is words api limited to 42 words. Please try another word!"
            );
            process.exit(1);
        }
    }
}

async function getExamples(word) {
    try {
        // {apihost}/word/{word}/examples?api_key={api_key}
        const examples = JSON.parse(
            await request(`${API_ENDPOINT}/word/${word}/examples?api_key=${API_KEY}`)
        );
        return examples.examples;
    } catch (err) {
        if (err.statusCode === 400 && /word not found/.test(err.message)) {
            console.log(
                "This is words api limited to 42 words. Please try another word!"
            );
            process.exit(1);
        }
    }
}

async function getDictionaryEntry(word) {
    try {
        const wordEntry = await Promise.all([
            getDefinition(word),
            getSynonyms(word),
            getAntonyms(word),
            getExamples(word)
        ]);
        return wordEntry;
    } catch (err) {
        if (err.statusCode === 400 && /word not found/.test(err.message)) {
            console.log(
                "This is words api limited to 42 words. Please try another word!"
            );
            process.exit(1);
        }
    }
}

async function getRandomWord(word) {
    try {
        // {apihost}/words/randomWord?api_key={api_key}
        const res = await request(
            `${API_ENDPOINT}/words/randomWord?api_key=${API_KEY}`
        );
        return JSON.parse(res).word;
    } catch (err) { }
}

async function getRowsOfCsvFile(csvFilename) {
    const file = await fsReadFile(csvFilename);
    const rows = file
        .toString()
        .split("\n")
        .filter(row => row.length);
    const rowsSplit = rows.map(row => row.split(","));
    return rowsSplit;
}

async function getTodaysWordFromDB(dbFilename) {
    const rows = await getRowsOfCsvFile(dbFilename);
    const rows_filtered = rows.filter(
        row =>
            new Date(row[0]).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)
    );
    return rows && rows.length ? rows_filtered[0][1] : null;
}

async function writeTodaysWordToDB(dbFilename, word) {
    util.log(dbFilename, word)
    return await fsWriteFile(dbFilename, `${new Date().toString()},${word}\n`, {
        flag: "a"
    });
}

async function generateTodaysWord(dbFilename) {
    const randomWord = await getRandomWord();
    await writeTodaysWordToDB(dbFilename, randomWord);
    return randomWord;
}

async function getWordOfTheDay() {
    const dbFilename = path.resolve("db.csv");

    if (! await fsExists(dbFilename)) {
        await generateTodaysWord(dbFilename);
    } else {
        const todaysWord = await getTodaysWordFromDB("db.csv");
        return todaysWord || await generateTodaysWord(dbFilename);
    }
}

module.exports = {
  getAntonyms,
  getDefinition,
  getDictionaryEntry,
  getExamples,
  getRandomWord,
  getSynonyms,
  getWordOfTheDay,
  isWord,
};