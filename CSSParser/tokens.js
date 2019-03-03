
// 选择器token
class SelectorToken {
  constructor() {
    this.value = '';
  }
}

// 组合器token
class CombinatorToken {
  constructor() {
    this.value = '';
  }
}

// 样式token
class DeclarationToken {
  constructor() {
    this.property = '';
    this.value = '';
  }
}

// 样式列表结束
class DeclarationsBlockEndToken {
}

module.exports = {
  SelectorToken,
  DeclarationToken,
  DeclarationsBlockEndToken,
  CombinatorToken
};
