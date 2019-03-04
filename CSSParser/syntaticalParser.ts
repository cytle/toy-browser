import {
  SelectorToken,
  DeclarationToken,
  DeclarationsBlockEndToken,
  CombinatorToken,
} from './tokens';

export class CSSStyleRule {
  selectors: CSSSelector[] = [];
  declarations: any = {};
}

export class CSSStyleSheet {
  rules: CSSStyleRule[] = [];
}

class CSSSelector {
  type: string = '';
  name: string = '';
  combinator: (string | null) = null;
  next: (CSSSelector | null) = null;
  static ID_SELECTOR = 'id';
  static ELEMENT_SELECTOR = 'element';
  static CLASS_SELECTOR = 'class';
  constructor(value: string) {
    if (value[0] === '.') {
      this.type = CSSSelector.CLASS_SELECTOR;
      this.name = value.slice(1);
    } else if (value[0] === '#') {
      this.type = CSSSelector.ID_SELECTOR;
      this.name = value.slice(1);
    } else {
      this.type = CSSSelector.ELEMENT_SELECTOR;
      this.name = value;
    }
  }
  setCombinator(combinator) {
    this.combinator = combinator;
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
    this.sheet.rules.push(this.rule);
    this.rule = new CSSStyleRule();
    this.selector = null;
  }
  emitSelector(selector: CSSSelector) {
    this.rule.selectors.push(selector);
  }
  receiveInput(token) {
    if (token instanceof SelectorToken) {
      const selector = new CSSSelector(token.value.trim());
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
      this.rule.declarations[token.property.trim()] = token.value.trim();
      return;
    }
    if (token instanceof DeclarationsBlockEndToken) {
      this.emitRule();
      return;
    }
  }
}
