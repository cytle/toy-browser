const { HTMLLexicalParser } = require('./lexicalParser')

const testHTML = `<html maaa=a >
    <head>
        <title>cool</title>
    </head>
    <body>
        <img src="a" />
        <input class="123" foucus/>
        asdsa
        <div fixed>asd</div>
        <div class="123">asd</div>
    </body>
</html>`

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
