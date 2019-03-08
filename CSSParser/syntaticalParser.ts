import {
  SelectorToken,
  DeclarationToken,
  DeclarationsBlockEndToken,
  CombinatorToken,
} from './tokens';

let ruleIndex = 100;

export class CSSStyleRule {
  selectors: CSSSelector[] = [];
  declarations: CSSStyleDeclaration = new CSSStyleDeclaration();
  index: number = ruleIndex += 1;
}

export class CSSStyleSheet {
  cssRules: CSSStyleRule[] = [];
}

export class CSSStyleDeclaration {
  set(key: string, value: string) {
    this[key.trim()] = value.trim();
  }
}

export enum CSSSelectorCombinator {
  AND_COMBINATOR, // 且
  SPACE_COMBINATOR, // 空格: 后代，选中它的子节点和所有子节点的后代节点。
  CHILD_COMBINATOR, // >: 子代，选中它的子节点。
  ADJACENT_SIBLING_COMBINATOR, // +: 直接后继选择器，选中它的下一个相邻节点。
  GENERAL_SIBLING_COMBINATOR, // ~：后继，选中它之后所有的相邻节点。
}
export enum CSSSelectorType {
  ID_SELECTOR,
  ELEMENT_SELECTOR,
  CLASS_SELECTOR,
}
export class CSSSelector {
  type: CSSSelectorType;
  name: string = '';
  combinator: CSSSelectorCombinator;
  next: (CSSSelector | null) = null;
  constructor(value: string, public rule: CSSStyleRule) {
    if (value[0] === '.') {
      this.type = CSSSelectorType.CLASS_SELECTOR;
      this.name = value.slice(1);
    } else if (value[0] === '#') {
      this.type = CSSSelectorType.ID_SELECTOR;
      this.name = value.slice(1);
    } else {
      this.type = CSSSelectorType.ELEMENT_SELECTOR;
      this.name = value;
    }
  }
  setCombinator(combinator) {
    switch (combinator) {
      case '':
        this.combinator = CSSSelectorCombinator.AND_COMBINATOR;
        break;
      case ' ':
        this.combinator = CSSSelectorCombinator.SPACE_COMBINATOR;
        break;
      case '>':
        this.combinator = CSSSelectorCombinator.CHILD_COMBINATOR;
        break;
      case '+':
        this.combinator = CSSSelectorCombinator.ADJACENT_SIBLING_COMBINATOR;
        break;
      case '~':
        this.combinator = CSSSelectorCombinator.GENERAL_SIBLING_COMBINATOR;
        break;
      default:
        throw new Error(`${combinator} is not allowed combinator`);
    }
  }
  setNext(next) {
    this.next = next;
  }
}

export default class CSSSyntaticalParser {
  sheet: CSSStyleSheet = new CSSStyleSheet();
  rule: CSSStyleRule = new CSSStyleRule();
  selector: (CSSSelector | null);
  getOutput() {
    return this.sheet;
  }
  emitRule() {
    this.sheet.cssRules.push(this.rule);
    this.rule = new CSSStyleRule();
    this.selector = null;
  }
  emitSelector(selector: CSSSelector) {
    this.rule.selectors.push(selector);
  }
  receiveInput(token) {
    if (token instanceof SelectorToken) {
      const selector = new CSSSelector(token.value.trim(), this.rule);
      if (this.selector) {
        this.selector.setNext(selector);
      } else {
        this.emitSelector(selector);
      }
      this.selector = selector;
      return;
    }

    if (token instanceof CombinatorToken) {
      const value = token.value.trim();
      if (value === ',') {
        this.selector = null;
      } else if (this.selector) {
        this.selector.setCombinator(value);
      } else {
        throw new Error('setCombinator时没有selector');
      }
      return;
    }
    if (token instanceof DeclarationToken) {
      this.rule.declarations.set(token.property, token.value);
      return;
    }
    if (token instanceof DeclarationsBlockEndToken) {
      this.emitRule();
      return;
    }
  }
}
