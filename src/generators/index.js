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

  if (!layer) {
    return '';
  }

  if (layer.type === 'shape') {
    const attrs = [];
    attrs.push(`    width: ${layer.rect.width}`);
    attrs.push(`    height: ${layer.rect.height}`);
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
      attrs.push(`    radius: ${layer.borderRadius}`);
    }
    let hasBorder = false;
    const borderAttr = parseBorder(layer.borders);
    if (!!borderAttr) {
      hasBorder = true;
      attrs.push(borderAttr);
    }
    return `${hasBorder || !isTransparent ? 'Rectangle' : 'Item'} {
${attrs.join('\n')}\n}`
  }
};

const parseColor = (extensionColor) => {
  const color = Color.fromRGBA(extensionColor);
  return color.toStyleValue('hex', {})
};

const parseBorder = (borders) => {
  if (borders.length === 0) {
    return '';
  }
  const attrs = [];
  const border = borders[0];
  if (border.thickness !== null) {
    attrs.push(`    width: ${border.thickness}`);
  }
  if (border.fill.type === "color") {
    attrs.push(`    color: "${parseColor(border.fill.color)}"`);
  }
  return `border {
${attrs.join('\n')}\n}`

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
