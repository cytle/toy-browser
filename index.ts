import HTMLLexicalParser from './HTMLParser/lexicalParser';
import HTMLSyntaticalParser, { Document } from './HTMLParser/syntaticalParser';
import CSSLexicalParser from './CSSParser/lexicalParser';
import CSSSyntaticalParser, { CSSStyleSheet } from './CSSParser/syntaticalParser';

export function parseHTML(text:string): Document {
  const syntaxer = new HTMLSyntaticalParser();
  const lexer = new HTMLLexicalParser(syntaxer);

  for (const c of text) {
    lexer.receiveInput(c);
  }
  return syntaxer.getOutput();
}

export function parseCSS(text:string): CSSStyleSheet {
  const syntaxer = new CSSSyntaticalParser();
  const lexer = new CSSLexicalParser(syntaxer);

  for (const c of text) {
    lexer.receiveInput(c);
  }
  return syntaxer.getOutput();
}

export default function browse(url: string) {

}
