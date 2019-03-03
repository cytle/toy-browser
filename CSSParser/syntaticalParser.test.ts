import fs from 'fs';
import path from 'path';
import CSSLexicalParser from './lexicalParser';
import CSSSyntaticalParser from './syntaticalParser';

const testCSS = fs.readFileSync(path.resolve(__dirname, 'test.css')).toString();

const syntaxer = new CSSSyntaticalParser();
const lexer = new CSSLexicalParser(syntaxer);

for (const c of testCSS) {
  lexer.receiveInput(c);
}

console.log(JSON.stringify(syntaxer.getOutput(), null, 2));
