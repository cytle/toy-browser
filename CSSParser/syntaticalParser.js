const {
  SelectorToken,
  DeclarationToken,
  DeclarationsBlockEndToken,
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

function CSSSyntaticalParser() {
  const sheet = new CSSStyleSheet();
  let rule = null;
  this.getOutput = () => sheet;
  this.receiveInput = (token) => {
    if (token instanceof SelectorToken) {
      if (!rule) {
        rule = new CSSStyleRule();
      }
      rule.selectors.push(token.value.trim());
      return;
    }
    if (token instanceof DeclarationToken) {
      rule.declarations[token.property.trim()] = token.value.trim();
      return;
    }
    if (token instanceof DeclarationsBlockEndToken) {
      sheet.rules.push(rule);
      rule = null;
      return;
    }
  };
}


module.exports = {
  CSSSyntaticalParser,
};
