const fs = require('fs');
const path = require('path');
const { HTMLLexicalParser } = require('./lexicalParser');

const testHTML = fs.readFileSync(path.resolve(__dirname, 'test.html')).toString();

const dummySyntaxer = {
  receiveInput: (token) => {
    if (typeof token === 'string') {
      console.log(`String: '${token.replace(/\n/g, '\\n')}'`)
    } else {
      console.log(token)
    }
  }
}

const lexer = new HTMLLexicalParser(dummySyntaxer)

for (let c of testHTML) {
  lexer.receiveInput(c)
}
