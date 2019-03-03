const {
  SelectorToken,
  DeclarationToken,
  DeclarationsBlockEndToken,
  CombinatorToken,
} = require('./tokens');

class CSSStyleRule {
  constructor() {
    this.selectors = [];
    this.declarations = {};
  }
}

class CSSStyleSheet {
  constructor() {
    this.rules = [];
  }
}

class CSSSelector {
  constructor(value) {
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
    this.combinator = null;
    this.next = null;
  }
  setCombinator(combinator) {
    this.combinator = combinator;
  }
}

CSSSelector.ID_SELECTOR = 'id'
CSSSelector.ELEMENT_SELECTOR = 'element'
CSSSelector.CLASS_SELECTOR = 'class'

function CSSSyntaticalParser() {
  const sheet = new CSSStyleSheet();
  let rule = new CSSStyleRule();
  let curSelector = null;
  this.getOutput = () => sheet;
  this.receiveInput = (token) => {
    if (token instanceof SelectorToken) {
      if (!rule) {
        rule = new CSSStyleRule();
      }
      const selector = new CSSSelector(token.value.trim());
      if (curSelector) {
        curSelector.next = selector;
      } else {
        rule.selectors.push(selector);
      }
      curSelector = selector;
      return;
    }

    if (token instanceof CombinatorToken) {
      const value = token.value.trim();
      if (value === ',') {
        curSelector = null;
      } else {
        curSelector.setCombinator(value);
      }
      return;
    }
    if (token instanceof DeclarationToken) {
      rule.declarations[token.property.trim()] = token.value.trim();
      return;
    }
    if (token instanceof DeclarationsBlockEndToken) {
      sheet.rules.push(rule);
      rule = null;
      curSelector = null;
      return;
    }
  };
}


module.exports = {
  CSSSyntaticalParser,
};
