
// "开始标签"的开始
class StartTagToken {
  name: string = '';
}

// 属性
class AttributeToken {
  name: string = '';
  value: string = '';
}

// "开始标签"的结束
class StartTagEndToken {
  isCloseingTagEnd: boolean = false;
}

// 结束标签
class EndTagToken {
  name: string = '';
}

// 文本
class TextToken {
  value: string = '';
}

// 注释
class CommentTagToken {
  value: string = '';
}

// Doctype标签
class DoctypeTagToken {
  value: string = '';
}

export {
  StartTagToken,
  StartTagEndToken,
  AttributeToken,
  EndTagToken,
  TextToken,
  CommentTagToken,
  DoctypeTagToken,
};
