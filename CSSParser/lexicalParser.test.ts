import fs from 'fs';
import path from 'path';
import CSSLexicalParser from './lexicalParser';

const testCSS = fs.readFileSync(path.resolve(__dirname, 'test.css')).toString();

const dummySyntaxer = {
  receiveInput: (token) => {
    if (typeof token === 'string') {
      console.log(`String: '${token.replace(/\n/g, '\\n')}'`);
    } else {
      console.log(token);
    }
  },
};

const lexer = new CSSLexicalParser(dummySyntaxer);

for (const c of testCSS) {
  lexer.receiveInput(c);
}
