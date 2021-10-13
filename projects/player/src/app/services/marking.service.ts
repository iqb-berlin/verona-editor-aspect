import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MarkingService {
  applySelection(range: Range, selection: Selection, clear: boolean, color: string):void {
    if (range.startContainer === range.endContainer) {
      if (clear) {
        this.clearMarkingFromNode(range);
      } else {
        const markedElement: HTMLElement = this.createMarkedElement(color);
        range.surroundContents(markedElement);
      }
    } else {
      const nodes: Node[] = [];
      this.findNodes(range.commonAncestorContainer.childNodes, nodes, selection);
      if (clear) {
        this.clearMarkingFromNodes(nodes, range);
      } else {
        this.markNodes(nodes, range, color);
      }
    }
  }

  private clearMarkingFromNode(range: Range): void {
    if (range.startContainer.parentElement?.tagName?.toUpperCase() === 'MARKED') {
      const previousText = range.startContainer.nodeValue?.substring(0, range.startOffset) || '';
      const text = range.startContainer.nodeValue?.substring(range.startOffset, range.endOffset) || '';
      const nextText = range.startContainer.nodeValue?.substring(range.endOffset) || '';
      if (text) {
        this.clearMarking(range.startContainer, text, previousText, nextText, range);
      }
    }
  }

  private clearMarkingFromNodes(nodes: Node[], range: Range): void {
    nodes.forEach((node, index) => {
      if (node.parentElement?.tagName === 'MARKED') {
        const nodeValues = this.getNodeValues(node, nodes, index, range);
        if (nodeValues.text) {
          this.clearMarking(node, nodeValues.text, nodeValues.previousText, nodeValues.nextText, range);
        }
      }
    });
  }

  private clearMarking(node: Node, text: string, previousText: string, nextText: string, range: Range) {
    const textElement = document.createTextNode(text as string);
    if (node.parentNode) {
      const color = node.parentElement?.style.backgroundColor || 'none';
      node.parentNode.parentNode?.replaceChild(textElement, node.parentNode);
      if (previousText) {
        const prev = this.createMarkedElement(color);
        prev.append(document.createTextNode(previousText));
        range.startContainer.insertBefore(prev, textElement);
      }
      if (nextText) {
        const end = this.createMarkedElement(color);
        end.append(document.createTextNode(nextText));
        range.endContainer.insertBefore(end, textElement.nextSibling);
      }
    }
  }

  private mark(
    node: Node, text: string, previousText: string, nextText: string, color: string
  ): void {
    const markedElement: HTMLElement = this.createMarkedElement(color);
    markedElement.append(document.createTextNode(text));
    // important!
    const { parentNode } = node;
    parentNode?.replaceChild(markedElement, node);
    if (previousText) {
      const prevDOM = document.createTextNode(previousText);
      parentNode?.insertBefore(prevDOM, markedElement);
    }
    if (nextText) {
      const nextDOM = document.createTextNode(nextText);
      parentNode?.insertBefore(nextDOM, markedElement.nextSibling);
    }
  }

  private getNodeValues = (node: Node, nodes: Node[], index: number, range: Range): {
    text: string, previousText: string, nextText: string
  } => {
    let text: string; let previousText = ''; let nextText = '';
    if (index === 0) {
      previousText = node.nodeValue?.substring(0, range.startOffset) || '';
      text = node.nodeValue?.substring(range.startOffset) || '';
    } else if (index === nodes.length - 1) {
      text = node.nodeValue?.substring(0, range.endOffset) || '';
      nextText = node.nodeValue?.substring(range.endOffset) || '';
    } else {
      text = node.nodeValue || '';
    }
    return { text, previousText, nextText };
  };

  private markNodes(nodes: Node[], range: Range, color: string): void {
    nodes.forEach((node, index) => {
      const nodeValues = this.getNodeValues(node, nodes, index, range);
      if (nodeValues.text && node.parentElement?.tagName.toUpperCase() !== 'MARKED') {
        this.mark(node, nodeValues.text, nodeValues.previousText, nodeValues.nextText, color);
      }
    });
  }

  private createMarkedElement = (color: string): HTMLElement => {
    const markedElement = document.createElement('MARKED');
    markedElement.style.backgroundColor = color;
    return markedElement;
  };

  private findNodes(childList: Node[] | NodeListOf<ChildNode>, nodes: Node[], selection: Selection): void {
    childList.forEach((node: Node) => {
      if (selection.containsNode(node, true)) {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
          nodes.push(node);
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.childNodes) {
            this.findNodes(node.childNodes, nodes, selection);
          }
        }
      }
    });
  }
}
