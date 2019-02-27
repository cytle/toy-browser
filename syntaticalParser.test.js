const fs = require('fs');
const path = require('path');
const { HTMLSyntaticalParser } = require('./syntaticalParser')
const { HTMLLexicalParser } = require('./lexicalParser')

const testHTML = fs.readFileSync(path.resolve(__dirname, 'test.html')).toString();

const syntaxer = new HTMLSyntaticalParser()
const lexer = new HTMLLexicalParser(syntaxer)

for (let c of testHTML) {
  lexer.receiveInput(c)
}

console.log(JSON.stringify(syntaxer.getOutput(), null, 2))
