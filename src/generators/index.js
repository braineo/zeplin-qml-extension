import Color from "zeplin-extension-style-kit/values/color";

export const getLayerCode = (containerAndType, layer, options) => {
  debugLog(layer);

  if (!!layer.parent && !!layer.parent.layer) {
    return parseLayers();
  }
  return parseLayer(containerAndType, layer, options);
};

// parse and
const parseLayer = (containerAndType, layer, options) => {
  const {container, type} = containerAndType;
  console.error(JSON.stringify(options, null, 2));
  const { resizeFunction: resizeFunction } = options;
  if (!layer) {
    return '';
  }
  // Parse shape
  if (layer.type === 'shape') {
    const attrs = [];
    attrs.push(`    width: ${resizeWrapper(resizeFunction, layer.rect.width)}`);
    attrs.push(`    height: ${resizeWrapper(resizeFunction, layer.rect.height)}`);
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
      attrs.push(`    radius: ${resizeWrapper(resizeFunction, layer.borderRadius)}`);
    }
    let hasBorder = false;
    const borderAttr = parseBorder(layer.borders, resizeFunction);
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
    attrs = attrs.concat(parseTextStyle(layer.textStyles, resizeFunction));
    return `Text {
${attrs.join('\n')}\n}`
  }

};

const parseColor = (extensionColor) => {
  const color = Color.fromRGBA(extensionColor);
  return color.toStyleValue('hex', {})
};

const parseBorder = (borders, resizeFuction) => {
  if (borders.length === 0) {
    return '';
  }
  const attrs = [];
  const border = borders[0];
  if (border.thickness !== null) {
    attrs.push(`    width: ${resizeWrapper(resizeFuction, border.thickness)}`);
  }
  if (border.fill.type === "color") {
    attrs.push(`    color: "${parseColor(border.fill.color)}"`);
  }
  return `border {
${attrs.join('\n')}\n}`

};

const parseTextStyle = (textStyles, resizeFunction) => {
  const attrs = [];
  if (textStyles.length === 0) {
    return attrs;
  }
  // text style applies to range of text
  const textStyle = textStyles[0].textStyle;
  attrs.push(`    color: "${parseColor(textStyle.color)}"`);
  attrs.push(`    font.pixelSize: ${resizeWrapper(resizeFunction, textStyle.fontSize)}`);
  if (textStyle.fontWeight === 700) {
    attrs.push(`    font.weight: Font.Bold`);
    // 400 is normal do nothing
  }
  attrs.push(`    wrapMode: Text.WordWrap`);
  attrs.push(`    elide: Text.ElideRight`);
  return attrs;
};

const parseLayers = (containerAndType, layers, options) => {
  console.warn('Not implemented')
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
