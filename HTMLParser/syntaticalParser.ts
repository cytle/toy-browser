import {
  StartTagToken,
  StartTagEndToken,
  AttributeToken,
  EndTagToken,
  TextToken,
  CommentTagToken,
} from './tokens';

class Node {
  static ELEMENT_NODE = 1;
  static TEXT_NODE = 3;
  static COMMENT_NODE = 8;
  static DOCUMENT_NODE = 9;
  static DOCUMENT_TYPE_NODE = 10;
  childNodes: Node[] = [];

  constructor(public nodeType: number) {}

  appendChild(child: Node) {
    this.childNodes.push(child);
  }
}

class Element extends Node {
  classList: string[] = [];
  id: string = '';
  constructor(public tagName: string) {
    super(Node.ELEMENT_NODE);
  }
}

class Document extends Node {
  constructor() {
    super(Node.DOCUMENT_NODE);
  }
}

class Text extends Node {
  constructor(public data: string) {
    super(Node.TEXT_NODE);
  }
}

class Comment extends Node {
  constructor(public data: string) {
    super(Node.COMMENT_NODE);
  }
}

export default class HTMLSyntaticalParser {
  stackTop: Node = new Document();
  stack: Node[] = [this.stackTop];
  getOutput () {
    return this.stack[0];
  }
  stachPush(node: Node) {
    this.stack.push(node);
    this.stackTop = node;
  }
  stachPop() {
    this.stack.pop();
  }
  receiveInput (token)  {
    if (token instanceof TextToken) {
      this.stackTop.appendChild(new Text(token.value));
      return;
    }
    if (token instanceof CommentTagToken) {
      this.stackTop.appendChild(new Comment(token.value));
      return;
    }
    if (token instanceof StartTagToken) {
      const el = new Element(token.name);
      this.stackTop.appendChild(el);
      this.stachPush(el);
      return;
    }
    if (token instanceof StartTagEndToken) {
      if (token.isCloseingTagEnd) {
        this.stachPop();
      }
      return;
    }
    if (this.stackTop instanceof Element) {
      if (token instanceof AttributeToken) {
        if (token.name === 'class') {
          this.stackTop.classList = token.value.split(' ').filter(vo => vo);
        }
        this.stackTop[token.name] = token.value;
        return;
      }
      if (token instanceof EndTagToken) {
        const node = this.stackTop;
        if (node.tagName !== token.name) {
          throw new Error('endTagToken does not correspond to the current element');
        }
        this.stachPop();
        return;
      }
    }
  }
}
