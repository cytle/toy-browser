
// 选择器token
class SelectorToken {
  value: string = '';
}

// 子选择器token
class SubSelectorToken {
  value: string = '';
}

// 组合器token
class CombinatorToken {
  value: string = '';
}

// 样式token
class DeclarationToken {
  value: string = '';
  property: string = '';
}

// 样式列表结束
class DeclarationsBlockEndToken {
}

export {
    SelectorToken,
    DeclarationToken,
    DeclarationsBlockEndToken,
    CombinatorToken,
    SubSelectorToken,
};
