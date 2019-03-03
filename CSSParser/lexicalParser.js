const {
  SelectorToken,
  DeclarationToken,
  DeclarationsBlockEndToken,
  CombinatorToken,
} = require('./tokens');

// 以下是字符判断的正则, 暂时认为只有ASCII码
const isWhiteSpaceReg = /[\t \f\n]/; // 是否是空格
const isWordStartLetterReg = /[_a-zA-Z]/; // 是否一个词的开始
const isWordLetterReg = /[_\-0-9a-zA-Z]/; // 是否一个词(多了-)

const isSeletorStartLetterReg = isWordStartLetterReg; // 标签名字开始
const isSeletorLetterReg = isWordLetterReg; // 标签名字
const isAttributeStartLetterReg = isWordStartLetterReg; // 属性名字开始
const isAttributeLetterReg = isWordLetterReg; // // 标签名字


function CSSLexicalParser(syntaxer) {
  let state = beforeSelector;
  let token = null;
  let selectorArr = [];

  this.receiveInput = (char) => {
    state = state(char);
  };

  this.reset = () => {
    state = beforeSelector;
  };

  function emitToken() {
    if (!token) {
      throw new Error('token is null');
    }
    syntaxer.receiveInput(token)
    token = null;
  }

  function emitDeclarationsBlockEndToken() {
    token = new DeclarationsBlockEndToken();
    emitToken();
  }

  function emitCombinatorToken(value) {
    token = new CombinatorToken();
    token.value = value;
    emitToken();
  }

  function error (c) {
    throw new Error(`unexpected char '${c}'`);
  }

  function beforeSelector(char) {
    if (/[.#]/.test(char)) {
      token = new SelectorToken();
      token.value = char;
      return selectorStart;
    }

    if (isSeletorStartLetterReg.test(char)) {
      token = new SelectorToken();
      token.value = char;
      return selector;
    }

    if (isWhiteSpaceReg.test(char)) {
      return beforeSelector;
    }
    error(char);
  }
  function selectorStart(char) {
    if (isSeletorStartLetterReg.test(char)) {
      token = new SelectorToken();
      token.value = char;
      return selector;
    }
    error(char);
  }
  function selector(char) {
    if (/[,>+~]/.test(char)) {
      emitToken(token);
      emitCombinatorToken(char);
      return beforeSelector;
    }
    if (/[#.]/.test(char)) {
      emitToken(token);
    // '且'组合器
      emitCombinatorToken('');
      token = new SelectorToken();
      token.value = char;
      return selectorStart;
    }
    if (isWhiteSpaceReg.test(char)) {
      emitToken(token);
      return whiteSpaceAfterSelector;
    }
    if (char === '{') {
      emitToken(token);
      return beforeDeclaration;
    }
    if (isSeletorLetterReg.test(char)) {
      token.value += char;
      return selector;
    }
    error(char);
  }

  function whiteSpaceAfterSelector(char) {
    if (isWhiteSpaceReg.test(char)) {
      return whiteSpaceAfterSelector;
    }
    if (/[,>+~]/.test(char)) {
      emitCombinatorToken(char);
      return beforeSelector;
    }
    if (char === '{') {
      return beforeDeclaration;
    }
    emitCombinatorToken(' ');
    return beforeSelector(char);
  }

  function beforeDeclaration(char) {
    if (isWhiteSpaceReg.test(char)) {
      return beforeDeclaration;
    }
    if (char === '}') {
      emitDeclarationsBlockEndToken();
      return beforeSelector;
    }
    token = new DeclarationToken();
    token.property = char;
    return declarationProperty;
  }

  function declarationProperty(char) {
    if (isWhiteSpaceReg.test(char)) {
      error(char);
    }
    if (char === ':') {
      return beforeDeclarationValue;
    }
    token.property += char;
    return declarationProperty;
  }
  function beforeDeclarationValue(char) {
    if (isWhiteSpaceReg.test(char)) {
      return beforeDeclarationValue;
    }
    token.value += char;
    return declarationValue;
  }
  function declarationValue(char) {
    if (char === ';') {
      emitToken();
      return beforeDeclaration;
    }
    if (char === '}') {
      emitToken();
      emitDeclarationsBlockEndToken();
      return beforeSelector;
    }
    token.value += char;
    return declarationValue;
  }
}


module.exports = {
  CSSLexicalParser
}
