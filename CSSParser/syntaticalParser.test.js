const fs = require('fs');
const path = require('path');
const { CSSSyntaticalParser } = require('./syntaticalParser')
const { CSSLexicalParser } = require('./lexicalParser')

const testCSS = fs.readFileSync(path.resolve(__dirname, 'test.css')).toString();

const syntaxer = new CSSSyntaticalParser()
const lexer = new CSSLexicalParser(syntaxer)

for (let c of testCSS) {
  lexer.receiveInput(c)
}

console.log(JSON.stringify(syntaxer.getOutput(), null, 2))
