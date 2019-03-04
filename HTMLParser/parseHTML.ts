import HTMLLexicalParser from './lexicalParser';
import HTMLSyntaticalParser from './syntaticalParser';
import { Document } from './nodes';

export default function parseHTML(text:string): Document {
  const syntaxer = new HTMLSyntaticalParser();
  const lexer = new HTMLLexicalParser(syntaxer);

  for (const c of text) {
    lexer.receiveInput(c);
  }
  return syntaxer.getOutput();
}
