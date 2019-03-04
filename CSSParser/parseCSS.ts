import CSSLexicalParser from './lexicalParser';
import CSSSyntaticalParser, { CSSStyleSheet } from './syntaticalParser';

export default function parseCSS(text:string): CSSStyleSheet {
  const syntaxer = new CSSSyntaticalParser();
  const lexer = new CSSLexicalParser(syntaxer);

  for (const c of text) {
    lexer.receiveInput(c);
  }
  return syntaxer.getOutput();
}
