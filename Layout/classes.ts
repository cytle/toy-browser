/**
 * 盒子
 */
export class Box {
  constructor(parameters) {

  }
}

/**
 * 块级盒
 */
export class BlockBox extends Box {
}

/**
 * 行内级盒
 */
export class InlineBox extends Box {
}

export class FloatBox extends Box {
}

/**
 * 块容器
 */
export class BlockContainerBox extends Box {
}

/**
 * 格式化上下文
 */
export class FormattingContext {
  boxes: Box[] = [];
  constructor(parameters) {

  }
}

/**
 * 块级格式化上下文
 */
export class BlockFormattingContext extends FormattingContext {
  boxes: BlockBox[] = [];
}

/**
 * 行内格式化上下文
 */
export class InlineFormattingContext extends FormattingContext {
  boxes: InlineBox[] = [];
}
