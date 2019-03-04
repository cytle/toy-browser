import {
  StartTagToken,
  StartTagEndToken,
  AttributeToken,
  EndTagToken,
  TextToken,
} from './tokens';

import {
  Node,
  Document,
  Element,
  Text,
} from './nodes';

export default class HTMLSyntaticalParser {
  document: Document = new Document();
  stackTop: Node = this.document;
  stack: Node[] = [this.stackTop];
  getOutput(): Document {
    return this.document;
  }
  stachPush(node: Node) {
    this.stack.push(node);
    this.stackTop = node;
  }
  emitElement() {
    const el = this.stack.pop();
    if (el) {
      this.stackTop.appendChild(el);
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
        this.emitElement();
      }
      return;
    }
    if (this.stackTop instanceof Element) {
      if (token instanceof AttributeToken) {
        this.stackTop.setAttribute(token.name, token.value);
        return;
      }
      if (token instanceof EndTagToken) {
        const node = this.stackTop;
        if (node.tagName !== token.name) {
          throw new Error('endTagToken does not correspond to the current element');
        }
        this.emitElement();
        return;
      }
    }
  }
}
