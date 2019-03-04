import { CSSStyleSheet } from '../CSSParser/syntaticalParser';
import { Node } from '../HTMLParser/nodes';

export default function attach(domTree: Node, styleSheets: CSSStyleSheet[]) {
  console.log(styleSheets);
  console.log(domTree);
}
