import { RenderNode } from '../Attachment/attach';

export function layout(renderNode: RenderNode): RenderNode {
  renderNode.childNodes = renderNode.childNodes.filter((node) => {
    if (node instanceof Element && node.style.display === 'none') {
      return false;
    }
  });
  return renderNode;
}

export function layoutNode(params:type) {

}
