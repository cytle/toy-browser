import {
  CSSStyleSheet,
  CSSSelector,
  CSSSelectorCombinator,
  CSSSelectorType,
  CSSStyleRule,
  CSSStyleDeclaration,
} from '../CSSParser/syntaticalParser';
import { Element, Document, Node } from '../HTMLParser/nodes';

export default function attach(
  document: Document,
  styleSheets: CSSStyleSheet[],
): RenderNode {
  const selectors: CSSSelector[] = [];
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

class RenderNode {
  style: CSSStyleDeclaration = new CSSStyleDeclaration;
  constructor(public node: Node, public childNodes: RenderNode[]) {}
}

class CSSNode {
  inherited: CSSNode|void;
  constructor(public selectors: CSSSelector[] = [], public childSelectors: CSSSelector[] = []) {}
  createChild(selectors: CSSSelector[], childSelectors: CSSSelector[]) {
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
  let adjacentSiblingSelectors: CSSSelector[] = [];
  // 所有兄弟选择器
  const generalSiblingSelectors: CSSSelector[] = [];

  return childNodes.map((childNode) => {
    const nextAdjacentSiblingSelectorscssNode: CSSSelector[] = [];
    const nextChildSelectors: CSSSelector[] = [];
    const nextSpacedSelectors: CSSSelector[] = [];
    const matchedCSSStyleRules: CSSStyleRule[] = [];

    function patchSelector(selector: CSSSelector) {
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
        matchedCSSStyleRules.push(selector.rule);
        return;
      }
      switch (selector.combinator) {
        case CSSSelectorCombinator.AND_COMBINATOR:
          patchSelector(nextSelector);
          break;
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
      .sort((a, b) => a.index - b.index)
      .map(vo => vo.declarations));
    // rules.push(dom.style);
    return renderNode;
  });
}

/**
 * 判断节点和选择器是否匹配
 * @param el 节点
 * @param selector 选择器
 */
function matchElementAndSelector(el: Element, selector: CSSSelector) {
  const { type, name } = selector;
  const { tagName, id, classList } = el;
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
}
