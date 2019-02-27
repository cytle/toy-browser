const {
  StartTagToken,
  StartTagEndToken,
  AttributeToken,
  EndTagToken,
  TextToken,
  CommentToken,
} = require('./tokens');

class Node {
  constructor(nodeType) {
    this.nodeType = nodeType;
    this.childNodes = [];
  }
  appendChild(child) {
    this.childNodes.push(child);
  }
}
Node.ELEMENT_NODE = 1;
Node.TEXT_NODE = 3;
Node.COMMENT_NODE = 8;
Node.DOCUMENT_NODE = 9;

class Document extends Node {
  constructor() {
    super(Node.DOCUMENT_NODE);
  }
}

class Element extends Node {
  constructor(tagName) {
    super(Node.ELEMENT_NODE);
    this.tagName = tagName;
    this.attributes = {};
  }
}

class Text extends Node {
  constructor(data) {
    super(Node.TEXT_NODE);
    this.data = data;
  }
}

class Comment extends Node {
  constructor(data) {
    super(Node.COMMENT_NODE);
    this.data = data;
  }
}

function HTMLSyntaticalParser() {
  const stack = [new Document()];
  const stackTop = () => {
    return stack[stack.length - 1];
  }
  this.getOutput = () => stack[0];
  this.receiveInput = (token) => {
    if (token instanceof TextToken) {
      stackTop().appendChild(new Text(token.value));
      return;
    }
    if (token instanceof CommentToken) {
      stackTop().appendChild(new Comment(token.value));
      return;
    }
    if (token instanceof AttributeToken) {
      stackTop().attributes[token.name] = token.value;
      return;
    }
    if (token instanceof StartTagToken) {
      const el = new Element(token.name);
      stackTop().appendChild(el);
      stack.push(el);
      return;
    }
    if (token instanceof StartTagEndToken) {
      if (token.isCloseingTagEnd) {
        stack.pop();
      }
      return;
    }
    if (token instanceof EndTagToken) {
      const node = stackTop();
      if (node.tagName !== token.name) {
        throw new Error('endTagToken does not correspond to the current element');
      }
      stack.pop();
      return;
    }
  };
}


module.exports = {
  HTMLSyntaticalParser,
};
