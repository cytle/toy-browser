const isLetterReg = /[a-zA-Z]/
const isAttributeLetterReg = /[_\-0-9a-zA-Z]/
const isWhiteSpaceReg = /[\t \f\n]/


function HTMLLexicalParser(syntaxer) {
  let state = data;
  let content = '';
  let token = null;
  let attribute = null;
  this.receiveInput = (char) => {
    state = state(char);
  };

  this.reset = () => {
    state = data;
  };


  function emitToken (token) {
    syntaxer.receiveInput(token)
  }

  function error (c) {
    console.log(new Error(`unexpected char '${c}'`));
  }

  function data(char) {
    if (char === '<') {
      emitToken(content);
      content = '';
      return tagOpen;
    }

    content += char;
    return data;
  }

  function tagOpen(char) {
    if (char === '/') {
      return endTagOpen;
    }
    if (isLetterReg.test(char)) {
      token = new StartTagToken();
      token.name = char.toLowerCase();
      return tagName;
    }
    return error(char);
  }

  function endTagOpen(char) {
    if (isLetterReg.test(char)) {
      token = new EndTagToken();
      token.name = char.toLowerCase();
      return tagName;
    }
    return error(char);
  }

  function tagName(char) {
    if (char === '/') {
      return selfClosingStartTag;
    }
    if (char === '>') {
      emitToken(token);
      return data;
    }
    if (isWhiteSpaceReg.test(char)) {
      return beforeAttributeName;
    }
    if (isLetterReg.test(char)) {
      token.name += char.toLowerCase();
      return tagName;
    }
    return error(char);
  }

  function selfClosingStartTag(char) {
    if (char === '>') {
      emitToken(token);
      const endToken = new EndTagToken();
      endToken.name = token.name;
      emitToken(endToken);
      return data;
    }
    return error(char)
  }
  function beforeAttributeName(char) {
    if (char === '>') {
      emitToken(token);
      return data;
    }
    if (char === '/') {
      return selfClosingStartTag;
    }
    if (isWhiteSpaceReg.test(char)) {
      return beforeAttributeName;
    }
    if (isAttributeLetterReg.test(char)) {
      attribute = new Attribute();
      attribute.name = char;
      attribute.value = '';
      return attributeName;
    }
    return error(char);
  }

  function attributeName(char) {
    if (char === '>') {
      token[attribute.name] = attribute.value;
      emitToken(token);
      return data;
    }
    if (char === '/') {
      token[attribute.name] = attribute.value;
      return selfClosingStartTag;
    }
    if (char === '=') {
      return beforeAttributeValue;
    }
    if (isWhiteSpaceReg.test(char)) {
      token[attribute.name] = attribute.value;
      return beforeAttributeName;
    }
    if (isAttributeLetterReg.test(char)) {
      attribute.name += char;
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
      attribute.value += char;
      return beforeAttributeValue;
    }
    // TODO 有效的value值
    if (/[^/<>=]/.test(char)) {
      return attributeValueWithoutQuoted;
    }
    return error(char);
  }
  function attributeValueDoubleQuoted(char) {
    if (char === '"') {
      token[attribute.name] = attribute.value;
      return beforeAttributeName;
    }
    attribute.value += char;
    return attributeValueDoubleQuoted;
  }
 function attributeValueSingleQuoted(char) {
    if (char === '"') {
      token[attribute.name] = attribute.value;
      return beforeAttributeName;
    }
    attribute.value += char;
    return attributeValueSingleQuoted;
  }
 function attributeValueWithoutQuoted(char) {
    if (isWhiteSpaceReg.test(char)) {
      token[attribute.name] = attribute.value;
      return beforeAttributeName;
    }
    if (char === '>') {
      token[attribute.name] = attribute.value;
      return data;
    }
    if (char === '/') {
      token[attribute.name] = attribute.value;
      return selfClosingStartTag;
    }
    // TODO 有效的value值
    if (/[^/<>=]/.test(char)) {
      attribute.value += char;
      return attributeValueWithoutQuoted;
    }
    return error(char);
  }
}

class StartTagToken {}

class EndTagToken {}

class Attribute {}

module.exports = {
  HTMLLexicalParser
}
