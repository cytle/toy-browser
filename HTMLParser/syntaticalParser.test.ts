import fs from 'fs';
import path from 'path';
import HTMLSyntaticalParser  from './syntaticalParser';
import HTMLLexicalParser  from './lexicalParser';

const testHTML = fs.readFileSync(path.resolve(__dirname, 'test.html')).toString();

const syntaxer = new HTMLSyntaticalParser();
const lexer = new HTMLLexicalParser(syntaxer);

for (const c of testHTML) {
  lexer.receiveInput(c);
}

console.log(JSON.stringify(syntaxer.getOutput(), null, 2));
