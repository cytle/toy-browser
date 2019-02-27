
// "开始标签"的开始
class StartTagToken {
  constructor() {
    this.name = '';
  }
}

// 属性
class AttributeToken {
  constructor() {
    this.name = '';
    this.value = '';
  }
}

// "开始标签"的结束
class StartTagEndToken {
  constructor() {
    this.isCloseingTagEnd = false
  }
}

// 结束标签
class EndTagToken {
  constructor() {
    this.name = '';
  }
}

// 文本
class TextToken {
  constructor() {
    this.value = '';
  }
}

// 注释
class CommentToken {
  constructor() {
    this.value = '';
  }
}


module.exports = {
  StartTagToken,
  StartTagEndToken,
  AttributeToken,
  EndTagToken,
  TextToken,
  CommentToken,
};
