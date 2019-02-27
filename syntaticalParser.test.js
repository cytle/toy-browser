const { HTMLSyntaticalParser } = require('./syntaticalParser')
const { HTMLLexicalParser } = require('./lexicalParser')

const syntaxer = new HTMLSyntaticalParser()
const lexer = new HTMLLexicalParser(syntaxer)

const testHTML = `<html maaa=a>
    <head>
        <title>cool</title>
    </head>
    <body>
        <img src="a" />
    </body>
</html>`

for (let c of testHTML) {
  lexer.receiveInput(c)
}

console.log(JSON.stringify(syntaxer.getOutput(), null, 2))
