import {
  CSSStyleSheet, CSSSelector, CSSSelectorCombinator, CSSSelectorType,
} from '../CSSParser/syntaticalParser';
import { Element } from '../HTMLParser/nodes';

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

export default function attach(domTree: Element, styleSheets: CSSStyleSheet[]) {
  const selectors: CSSSelector[] = [];
  styleSheets.forEach((vo) => {
    vo.cssRules.forEach((rule) => {
      selectors.push(...rule.selectors);
    });
  });
  matchDOM(domTree.childNodes, new CSSNode(selectors));

  console.log(styleSheets);
  console.log(domTree);
}

function matchDOM(
  doms: Element[], cssNode: CSSNode,
) {
  let adjacentSiblingSelectors: CSSSelector[] = [];
  const generalSiblingSelectors: CSSSelector[] = [];

  doms.forEach((dom) => {
    const nextAdjacentSiblingSelectorscssNode: CSSSelector[] = [];
    const nextChildRules: CSSSelector[] = [];
    const nextSpacedRules: CSSSelector[] = [];

    function patchSelector(selector: CSSSelector) {
      const isMatched = matchElementAndSelector(dom, selector);
      if (!isMatched) {
        return;
      }
      const nextSelector = selector.next;
      // 如果没有下一个选择条件，说明已经完全匹配
      if (!nextSelector) {
        dom.matchedCSSStyleRules.push(selector.rule);
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
          nextChildRules.push(nextSelector);
          break;
        case CSSSelectorCombinator.SPACE_COMBINATOR:
          nextSpacedRules.push(nextSelector);
          break;
        default:
          break;
      }
    }
    // 兄弟选择器遍历 (~, +)
    generalSiblingSelectors.forEach(patchSelector);
    adjacentSiblingSelectors.forEach(patchSelector);
    // 子选择器遍历 (空格, >)
    cssNode.forEachRule(patchSelector, true);

    adjacentSiblingSelectors = nextAdjacentSiblingSelectorscssNode;

    // 递归子节点
    matchDOM(dom.childNodes, cssNode.createChild(nextSpacedRules, nextChildRules));
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
