const {
  StartTagToken,
  StartTagEndToken,
  AttributeToken,
  EndTagToken,
  TextToken,
  CommentToken,
} = require('./tokens');

const isWhiteSpaceReg = /[\t \f\n]/
const isWordStartLetterReg = /[0-9a-zA-Z]/
const isWordLetterReg = /[_\-0-9a-zA-Z]/

const isTagNameStartLetterReg = isWordStartLetterReg;
const isTagNameLetterReg = isWordLetterReg;
const isAttributeStartLetterReg = isWordStartLetterReg;
const isAttributeLetterReg = isWordLetterReg;

function HTMLLexicalParser(syntaxer) {
  let state = data;
  let token = null;
  this.receiveInput = (char) => {
    state = state(char);
  };

  this.reset = () => {
    state = data;
  };

  function emitToken() {
    if (!token) {
      throw new Error('token is null');
    }
    syntaxer.receiveInput(token)
    token = null;
  }

  function emitStartTagEndToken(isCloseingTagEnd) {
    token = new StartTagEndToken();
    token.isCloseingTagEnd = isCloseingTagEnd;
    emitToken();
  }

  function error (c) {
    throw new Error(`unexpected char '${c}'`);
  }

  function data(char) {
    if (char === '<') {
      return tagOpen;
    }
    token = new TextToken();
    token.value = char;
    return text;
  }
  function text(char) {
    if (char === '<') {
      emitToken();
      return tagOpen;
    }
    token.value += char;
    return text;
  }

  function tagOpen(char) {
    if (char === '/') {
      return endTagOpen;
    }
    if (char === '!') {

    }
    if (isTagNameStartLetterReg.test(char)) {
      token = new StartTagToken();
      token.name = char;
      return tagName;
    }
    return error(char);
  }

  function tagName(char) {
    if (char === '/') {
      emitToken();
      return selfClosingTag;
    }
    if (char === '>') {
      emitToken();
      emitStartTagEndToken(false);
      return data;
    }
    if (isWhiteSpaceReg.test(char)) {
      emitToken();
      return beforeAttributeName;
    }
    if (isTagNameLetterReg.test(char)) {
      token.name += char;
      return tagName;
    }
    return error(char);
  }

  function endTagOpen(char) {
    if (isTagNameStartLetterReg.test(char)) {
      token = new EndTagToken();
      token.name = char;
      return endTagName;
    }
    return error(char);
  }

  function endTagName(char) {
    if (char === '>') {
      emitToken();
      return data;
    }
    if (isTagNameLetterReg.test(char)) {
      token.name += char;
      return endTagName;
    }
    return error(char);
  }

  function selfClosingTag(char) {
    if (char === '>') {
      emitStartTagEndToken(true);
      return data;
    }
    return error(char)
  }
  function beforeAttributeName(char) {
    if (char === '>') {
      emitStartTagEndToken(false);
      return data;
    }
    if (char === '/') {
      return selfClosingTag;
    }
    if (isWhiteSpaceReg.test(char)) {
      return beforeAttributeName;
    }
    if (isAttributeStartLetterReg.test(char)) {
      token = new AttributeToken();
      token.name = char;
      return attributeName;
    }
    return error(char);
  }

  function attributeName(char) {
    if (char === '>') {
      emitToken();
      emitStartTagEndToken(false);
      return data;
    }
    if (char === '/') {
      emitToken();
      return selfClosingTag;
    }
    if (char === '=') {
      return beforeAttributeValue;
    }
    if (isWhiteSpaceReg.test(char)) {
      emitToken();
      return beforeAttributeName;
    }
    if (isAttributeLetterReg.test(char)) {
      token.name += char;
      return attributeName;
    }
    return error(char);
  }
  function beforeAttributeValue(char) {
    if (char === '"') {
      return attributeValueDoubleQuoted;
    }
    if (char === "'") {
      return attributeValueSingleQuoted;
    }
    if (isWhiteSpaceReg.test(char)) {
      token.value += char;
      return beforeAttributeValue;
    }
    // TODO 有效的value值
    if (/[^/<>=]/.test(char)) {
      token.value += char;
      return attributeValueWithoutQuoted;
    }
    return error(char);
  }
  function attributeValueDoubleQuoted(char) {
    if (char === '"') {
      emitToken();
      return beforeAttributeName;
    }
    token.value += char;
    return attributeValueDoubleQuoted;
  }
 function attributeValueSingleQuoted(char) {
    if (char === "'") {
      emitToken();
      return beforeAttributeName;
    }
    token.value += char;
    return attributeValueSingleQuoted;
  }
 function attributeValueWithoutQuoted(char) {
    if (isWhiteSpaceReg.test(char)) {
      emitToken();
      return beforeAttributeName;
    }
    if (char === '>') {
      emitToken();
      emitStartTagEndToken(false);
      return data;
    }
    if (char === '/') {
      emitToken();
      return selfClosingTag;
    }
    // TODO 有效的value值
    if (/[^/<>=]/.test(char)) {
      token.value += char;
      return attributeValueWithoutQuoted;
    }
    return error(char);
  }
}


module.exports = {
  HTMLLexicalParser
}
