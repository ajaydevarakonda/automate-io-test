# Command Line Dictionary Tool

command line npm modules
https://www.npmjs.com/package/yargs
https://www.npmjs.com/package/nopt
https://www.npmjs.com/package/commander

Create a command-line dictionary tool using this api.
This is words api limited to 42 words

apihost = 'https://fourtytwowords.herokuapp.com'

Available APIs
{apihost}/words/randomWord?api_key={api_key}
{apihost}/word/{word}/definitions?api_key={api_key}
{apihost}/word/{word}/examples?api_key={api_key}
{apihost}/word/{word}/relatedWords?api_key={api_key}

The API key for it is included in the email you’ve received.

This has to be programmed in NodeJS


Requirements
The command line tool should have the following functions - 
The output should be nicely formatted on console, and show all relevant information.

1. Word Definitions
	Display definitions of a word. 
	./dict def <word>

2. Word Synonyms
	Display synonyms of a word. 
	./dict syn <word>
3. Word Antonyms
	Display antonyms of a word
	./dic ant <word>

4. Word Examples
	Display examples of a word
	./dict ex <word>

5. Word Full Dict
	Display all above details for a word
	./dict <word> or ./dict dict <word>

6. Word of the Day Full Dict
	Display all above details of word of the day
	./dict

7. Word Game
	./dict play
	The program should display a definition, a synonym or an antonym
	And ask the user to enter the word

	If the correct word is entered, program should tell that the word is correct
	* Other(not displayed) Synonyms of the word should be accepted as correct answer.
	If incorrect word is entered, program should ask for
		- 1. try again
			Lets user enter word again

		- 2. hint
			Display a hint, and let user enter word again
			Hint can be
Display the word randomly jumbled (cat -> atc)
OR Display another definition of the word
OR Display another antonym of the word
OR Display another synonym of the word
		-3 quit
			Display the word, its full dict, and quit
Areas of Focus
	- Code quality
	- Code reuse
	- Code structure
	- Use of high level language features
Git
It is advised to use git, and push code to github. Commit frequently, and I would like to see how the code evolved by looking at your commits. Share the public URL to the repo of the code as your submission.

