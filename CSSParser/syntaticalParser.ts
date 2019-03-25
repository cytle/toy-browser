import {
  SelectorToken,
  DeclarationToken,
  DeclarationsBlockEndToken,
  CombinatorToken,
  SubSelectorToken,
} from './tokens';

let ruleIndex = 100;

export class CSSStyleRule {
  selectors: CSSCompoundSelector[] = [];
  declarations: CSSStyleDeclaration = new CSSStyleDeclaration();
  index: number = ruleIndex += 1;
  addSelector(selector: CSSCompoundSelector) {
    this.selectors.push(selector);
  }
}

export class CSSStyleSheet {
  cssRules: CSSStyleRule[] = [];
}

export class CSSStyleDeclaration {
  display: string;
  position: string;
  'box-size': string;
  set(key: string, value: string) {
    this[key.trim()] = value.trim();
  }
}

export enum CSSSelectorCombinator {
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

export class CSSSelectorData {
  specificity: number = 0;
  constructor(public rule: CSSStyleRule) {}
}

export class CSSCompoundSelector {
  subSelectors: CSSSelector[] = [];
  combinator: CSSSelectorCombinator;
  next: CSSCompoundSelector; // 下一个选择器
  pre: CSSCompoundSelector; // 上一个选择器
  constructor(public data: CSSSelectorData) {}
  addSubSelector(value: string) {
    const subSelector = new CSSSelector(value);
    this.data.specificity += subSelector.specificity;
    this.subSelectors.push(subSelector);
  }
  setCombinator(combinator) {
    switch (combinator) {
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
        throw new Error(`"${combinator}" is not allowed combinator`);
    }
  }
  setNext(next: CSSCompoundSelector) {
    this.next = next;
  }
}
export class CSSSelector {
  type: CSSSelectorType;
  name: string = '';
  constructor(value: string) {
    if (value[0] === '.') {
      this.type = CSSSelectorType.CLASS_SELECTOR;
      this.name = value.slice(1);
    } else if (value[0] === '#') {
      this.type = CSSSelectorType.ID_SELECTOR;
      this.name = value.slice(1);
    } else {
      this.type = CSSSelectorType.ELEMENT_SELECTOR;
      this.name = value.toUpperCase();
    }
  }
  get specificity(): number {
    switch (this.type) {
      case CSSSelectorType.ELEMENT_SELECTOR:
        return 1e3;
      case CSSSelectorType.CLASS_SELECTOR:
        return 1e6;
      case CSSSelectorType.ID_SELECTOR:
        return 1e9;
      default:
        return 0;
    }
  }
}

export default class CSSSyntaticalParser {
  sheet: CSSStyleSheet = new CSSStyleSheet();
  rule: CSSStyleRule = new CSSStyleRule();
  selector: (CSSCompoundSelector | null);
  selectorData: CSSSelectorData;
  getOutput() {
    return this.sheet;
  }
  emitRule() {
    this.sheet.cssRules.push(this.rule);
    this.rule = new CSSStyleRule();
    this.selector = null;
  }
  emitSelector(selector: CSSCompoundSelector) {
    this.rule.addSelector(selector);
  }
  receiveInput(token) {
    if (token instanceof SelectorToken) {
      if (!this.selector) {
        this.selectorData = new CSSSelectorData(this.rule);
      }
      const selector = new CSSCompoundSelector(this.selectorData);
      selector.addSubSelector(token.value.trim());
      if (this.selector) {
        this.selector.setNext(selector);
      } else {
        this.emitSelector(selector);
      }
      this.selector = selector;
      return;
    }
    if (token instanceof SubSelectorToken) {
      if (this.selector) {
        this.selector.addSubSelector(token.value.trim());
      } else {
        throw new Error('addSubSelector时没有selector');
      }
    }

    if (token instanceof CombinatorToken) {
      const value = token.value.trim();
      if (value === ',') {
        this.selector = null;
      } else if (this.selector) {
        this.selector.setCombinator(value || token.value);
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
