import {
  CSSStyleSheet,
  CSSSelectorCombinator,
  CSSSelectorType,
  CSSSelectorData,
  CSSStyleDeclaration,
  CSSCompoundSelector,
} from '../CSSParser/syntaticalParser';
import { Element, Document, Node } from '../HTMLParser/nodes';

/**
 * DOM树匹配样式表
 * @param document DOMTree
 * @param styleSheets styleSheets
 */
export default function attach(
  document: Document,
  styleSheets: CSSStyleSheet[],
): RenderNode {
  const selectors: CSSCompoundSelector[] = [];
  styleSheets.forEach((vo) => {
    vo.cssRules.forEach((rule) => {
      selectors.push(...rule.selectors);
    });
  });
  if (document.childNodes.length === 0) {
    const el = new Element('html');
    document.appendChild(el);
    el.mounted();
  }
  const node: Node = document.childNodes[0];
  return new RenderNode(
    node,
    matchDOM(node.childNodes, new CSSNode(selectors)),
  );
}

export class RenderNode {
  style: CSSStyleDeclaration = new CSSStyleDeclaration;
  constructor(public node: Node, public childNodes: RenderNode[]) {}
}

class CSSNode {
  inherited: CSSNode|void;
  constructor(
    public selectors: CSSCompoundSelector[] = [],
    public childSelectors: CSSCompoundSelector[] = [],
  ) {}
  createChild(selectors: CSSCompoundSelector[], childSelectors: CSSCompoundSelector[]) {
    const obj = new CSSNode(selectors, childSelectors);
    obj.inherited = this;
    return obj;
  }
  forEachRule(cb, isChild = true) {
    this.selectors.forEach(cb);
    if (isChild) {
      this.childSelectors.forEach(cb);
    }
    if (this.inherited) {
      this.inherited.forEachRule(cb, false);
    }
  }
}

function matchDOM(
  childNodes: Node[], cssNode: CSSNode,
): RenderNode[] {
  if (childNodes.length === 0) {
    return [];
  }
  // 直接兄弟选择器
  let adjacentSiblingSelectors: CSSCompoundSelector[] = [];
  // 所有兄弟选择器
  const generalSiblingSelectors: CSSCompoundSelector[] = [];

  return childNodes.map((childNode) => {
    const nextAdjacentSiblingSelectorscssNode: CSSCompoundSelector[] = [];
    const nextChildSelectors: CSSCompoundSelector[] = [];
    const nextSpacedSelectors: CSSCompoundSelector[] = [];
    const matchedCSSStyleRules: CSSSelectorData[] = [];

    function patchSelector(selector: CSSCompoundSelector) {
      if (!(childNode instanceof Element)
        || ['HEAD', 'LINK', 'META', 'SCRIPT', 'STYLE'].includes(childNode.tagName)) {
        return;
      }
      const isMatched = matchElementAndSelector(childNode, selector);
      if (!isMatched) {
        return;
      }
      const nextSelector = selector.next;
      // 如果没有下一个选择条件，说明已经完全匹配
      if (!nextSelector) {
        matchedCSSStyleRules.push(selector.data);
        return;
      }
      switch (selector.combinator) {
        case CSSSelectorCombinator.ADJACENT_SIBLING_COMBINATOR:
          nextAdjacentSiblingSelectorscssNode.push(nextSelector);
          break;
        case CSSSelectorCombinator.GENERAL_SIBLING_COMBINATOR:
          generalSiblingSelectors.push(nextSelector);
          break;
        case CSSSelectorCombinator.CHILD_COMBINATOR:
          nextChildSelectors.push(nextSelector);
          break;
        case CSSSelectorCombinator.SPACE_COMBINATOR:
          nextSpacedSelectors.push(nextSelector);
          break;
      }
    }
    // 兄弟选择器遍历 (~, +)
    generalSiblingSelectors.forEach(patchSelector);
    adjacentSiblingSelectors.forEach(patchSelector);
    // 子选择器遍历 (空格, >)
    cssNode.forEachRule(patchSelector, true);

    adjacentSiblingSelectors = nextAdjacentSiblingSelectorscssNode;

    const renderNode = new RenderNode(
      childNode,
      // 递归子节点
      matchDOM(
        childNode.childNodes,
        cssNode.createChild(nextSpacedSelectors, nextChildSelectors),
      ),
    );
    Object.assign(renderNode.style, ...matchedCSSStyleRules
      .sort((a, b) => (a.specificity - b.specificity) + (a.rule.index > b.rule.index ? 1 : -1))
      .map(vo => vo.rule.declarations));
    // rules.push(dom.style);
    return renderNode;
  });
}

/**
 * 判断节点和选择器是否匹配
 * @param el 节点
 * @param selector 选择器
 */
function matchElementAndSelector(el: Element, selector: CSSCompoundSelector) {
  const { subSelectors } = selector;
  const { tagName, id, classList } = el;
  return subSelectors.every(({ name, type }) => {
    switch (type) {
      case CSSSelectorType.CLASS_SELECTOR:
        return classList.includes(name);
      case CSSSelectorType.ELEMENT_SELECTOR:
        return tagName === name;
      case CSSSelectorType.ID_SELECTOR:
        return id === name;
      default:
        throw new Error(`${type} is unkown type of selector`);
    }
  });
}
