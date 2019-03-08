import { CSSStyleRule } from '../CSSParser/syntaticalParser';

export class Node {
  static ELEMENT_NODE = 1;
  static TEXT_NODE = 3;
  static DOCUMENT_NODE = 9;
  public childNodes: Node[] = [];
  public parent: Node;
  public ownerDocument: Document;

  constructor(public nodeType: number) {}

  mounted() {
  }
  appendChild(child: Node) {
    child.parent = this;
    child.ownerDocument = this.ownerDocument;
    this.childNodes.push(child);
  }
}

export class Element extends Node {
  public classList: string[] = [];
  public id: string = '';
  public tagName: string = '';
  public rel: string = '';
  public href: string = '';
  public attributes = {};
  public childNodes: Element[] = [];
  public matchedCSSStyleRules: CSSStyleRule[] = [];
  constructor(tagName: string) {
    super(Node.ELEMENT_NODE);
    this.tagName = tagName.toUpperCase();
  }
  setAttribute(key: string, value: string) {
    switch (key) {
      case 'class':
        this.classList = value.split(' ').filter(vo => vo);
        break;
      default:
        break;
    }
    this[key] = value;
  }
  mounted() {
    this.ownerDocument.mountedElement(this);
  }
}

export class Document extends Node {
  styleSheetNodes: Element[] = [];
  constructor() {
    super(Node.DOCUMENT_NODE);
    this.ownerDocument = this;
    this.parent = this;
  }
  mountedElement(el: Element) {
    if (el.tagName === 'LINK'
    && el.rel.toLowerCase() === 'stylesheet'
    && el.href
    ) {
      this.styleSheetNodes.push(el);
    }
  }
}

export class Text extends Node {
  constructor(public data: string) {
    super(Node.TEXT_NODE);
  }
}
