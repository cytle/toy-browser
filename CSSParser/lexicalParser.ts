import {
  SelectorToken,
  DeclarationToken,
  DeclarationsBlockEndToken,
  CombinatorToken,
  SubSelectorToken,
}  from './tokens';

// 以下是字符判断的正则, 暂时认为只有ASCII码
const isWhiteSpaceReg = /[\t \f\n]/; // 是否是空格
const isWordStartLetterReg = /[_a-zA-Z]/; // 是否一个词的开始
const isWordLetterReg = /[_\-0-9a-zA-Z]/; // 是否一个词(多了-)

const isSeletorStartLetterReg = isWordStartLetterReg; // 标签名字开始
const isSeletorLetterReg = isWordLetterReg; // 标签名字

export default class CSSLexicalParser {
  state: Function;
  initState: Function;
  receiveInput(char) {
    this.state = this.state(char);
  }
  reset() {
    this.state = this.initState;
  }
  constructor(syntaxer) {
    this.initState = beforeSelector;
    this.reset();

    let token: any = null;

    function emitToken() {
      if (!token) {
        throw new Error('token is null');
      }
      syntaxer.receiveInput(token);
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

    function error(c) {
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
        token.value += char;
        return selector;
      }
      error(char);
    }
    function selector(char) {
      if (/[,>+~]/.test(char)) {
        emitToken();
        emitCombinatorToken(char);
        return beforeSelector;
      }
      if (/[#.]/.test(char)) {
        emitToken();
        token = new SubSelectorToken();
        token.value = char;
        return selectorStart;
      }
      if (isWhiteSpaceReg.test(char)) {
        emitToken();
        return whiteSpaceAfterSelector;
      }
      if (char === '{') {
        emitToken();
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
}
