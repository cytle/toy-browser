import {
  StartTagToken,
  StartTagEndToken,
  AttributeToken,
  EndTagToken,
  TextToken,
} from './tokens';

import {
  Document,
  Element,
  Text,
} from './nodes';

export default class HTMLSyntaticalParser {
  document: Document = new Document();
  stackTop: (Document | Element) = this.document;
  stack: (Document | Element)[] = [this.stackTop];
  getOutput(): Document {
    return this.document;
  }
  stachPush(el: Element) {
    this.stackTop.appendChild(el);
    this.stack.push(el);
    this.stackTop = el;
  }
  statckPop() {
    const el = this.stack.pop();
    this.stackTop = this.stack[this.stack.length - 1];
    if (el instanceof Element) {
      el.mounted();
    }
  }
  receiveInput (token)  {
    if (token instanceof TextToken) {
      this.stackTop.appendChild(new Text(token.value));
      return;
    }
    if (token instanceof StartTagToken) {
      this.stachPush(new Element(token.name));
      return;
    }
    if (token instanceof StartTagEndToken) {
      if (token.isCloseingTagEnd) {
        this.statckPop();
      }
      return;
    }
    if (this.stackTop instanceof Element) {
      if (token instanceof AttributeToken) {
        this.stackTop.setAttribute(token.name, token.value);
        return;
      }
      if (token instanceof EndTagToken) {
        if (this.stackTop.tagName !== token.name.toUpperCase()) {
          // tslint:disable-next-line: max-line-length
          throw new Error(`endTagToken's name (${token.name.toUpperCase()}) does not correspond to the current element which name is (${this.stackTop.tagName})`);
        }
        this.statckPop();
        return;
      }
    }
  }
}
