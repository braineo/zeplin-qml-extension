import Color from "zeplin-extension-style-kit/values/color";

export const getLayerCode = (containerAndType, layer, options) => {

};

export class QmlLayerGenerator {
  constructor(containerAndType, layer, options) {
    this.layer = layer;
    this.options = options;
    this.container = containerAndType.container;
    this.type = containerAndType.type;
  }
  getCode () {
    debugLog(this.layer);

    if (!!this.layer.parent && !!this.layer.parent.layer) {
      return this.parseLayers();
    }
    return this.parseLayer(this.layer);
  }

  parseLayer (layer) {
    // const {container, type} = containerAndType;
    if (!layer) {
      return '';
    }
    // Parse shape
    if (layer.type === 'shape') {
      const attrs = [];
      attrs.push(`    width: ${resizeWrapper(this.options.resizeFunction, layer.rect.width)}`);
      attrs.push(`    height: ${resizeWrapper(this.options.resizeFunction, layer.rect.height)}`);
      // color
      let isTransparent = false;
      if (layer.fills.length === 0) {
        isTransparent = true;
      } else {
        const fill = layer.fills[0];
        if (fill.type === "color") {
          attrs.push(`    color: "${parseColor(fill.color)}"`);
        }
      }
      // border

      if (layer.borderRadius !== 0) {
        attrs.push(`    radius: ${resizeWrapper(this.options.resizeFunction, layer.borderRadius)}`);
      }
      let hasBorder = false;
      const borderAttr = this.parseBorder(layer.borders);
      if (!!borderAttr) {
        hasBorder = true;
        attrs.push(borderAttr);
      }
      return `${hasBorder || !isTransparent ? 'Rectangle' : 'Item'} {
${attrs.join('\n')}\n}`
    }

    if (layer.type === 'text') {
      let attrs = [];
      attrs.push(`    text: qsTr('${layer.content}')`);
      attrs = attrs.concat(this.parseTextStyle(layer.textStyles));
      return `Text {
${attrs.join('\n')}\n}`
    }

  };

  parseBorder (borders) {
    if (borders.length === 0) {
      return '';
    }
    const attrs = [];
    const border = borders[0];
    if (border.thickness !== null) {
      attrs.push(`    width: ${resizeWrapper(this.options.resizeFunction, border.thickness)}`);
    }
    if (border.fill.type === "color") {
      attrs.push(`    color: "${parseColor(border.fill.color)}"`);
    }
    return `border {
${attrs.join('\n')}\n}`

  };

  parseTextStyle (textStyles) {
    const attrs = [];
    if (textStyles.length === 0) {
      return attrs;
    }
    // text style applies to range of text
    const textStyle = textStyles[0].textStyle;
    attrs.push(`    color: "${parseColor(textStyle.color)}"`);
    attrs.push(`    font.pixelSize: ${resizeWrapper(this.options.resizeFunction, textStyle.fontSize)}`);
    if (textStyle.fontWeight === 700) {
      attrs.push(`    font.weight: Font.Bold`);
      // 400 is normal do nothing
    }
    attrs.push(`    wrapMode: Text.WordWrap`);
    attrs.push(`    elide: Text.ElideRight`);
    return attrs;
  };

  parseLayers (layers) {
    console.warn('Not implemented')
  };

}

const parseColor = (extensionColor) => {
  const color = Color.fromRGBA(extensionColor);
  return color.toStyleValue('hex', {})
};

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

function debugLog(obj) {
  console.log(obj, getCircularReplacer());
}

const resizeWrapper = (functionName, value) => {
  if (!!functionName) {
    return `${functionName}(${value})`;
  }
  return `${value}`;
};
