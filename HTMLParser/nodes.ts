import { CSSStyleSheet } from '../CSSParser/syntaticalParser';
import parseCSS from '../CSSParser/parseCSS';
import resourceLoad from '../Network/resourceLoad';

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
    child.mounted();
  }
  getRootNode() {
    return this.parent === this
      ? this
      : this.parent.getRootNode();
  }
}

export class Element extends Node {
  public classList: string[] = [];
  public id: string = '';
  public tagName: string = '';
  public ref: string = '';
  public href: string = '';
  public attributes = {};
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

class TasksQueue extends Set<Promise<any|void>> {
  add(p: Promise<any|void>) {
    p.catch(() => {}).then(() => {
      this.delete(p);
      if (this.size === 0) {
        this.onallfinish();
      }
    });
    return super.add(p);
  }
  onallfinish() {
    console.log('onallfinish');
  }
}

export class Document extends Node {
  styleSheets: CSSStyleSheet[] = [];
  tasksQueue: TasksQueue = new TasksQueue();
  constructor() {
    super(Node.DOCUMENT_NODE);
    this.ownerDocument = this;
    this.parent = this;
  }
  mountedElement(el: Element) {
    if (el.tagName === 'LINK'
    && el.ref.toLowerCase() === 'stylesheet'
    && el.href
    ) {
      const task = resourceLoad(el.href)
        .then(cssText => this.styleSheets.push(parseCSS(cssText)));

      this.tasksQueue.add(task);
    }
  }
}

export class Text extends Node {
  constructor(public data: string) {
    super(Node.TEXT_NODE);
  }
}
