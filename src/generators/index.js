import { getResources } from "zeplin-extension-style-kit/utils";
import Color from "zeplin-extension-style-kit/values/color";
import {INDENTATION} from "../constants";

export class QmlLayerGenerator {
  constructor(containerAndType, layer, options) {
    this.layer = layer;
    this.options = options;
    this.container = containerAndType.container;
    this.type = containerAndType.type;
    const styleGuideColors = getResources(this.container, this.type, this.options.useLinkedStyleguides, "colors");
    this.colorTable = getColorTable(styleGuideColors);
  }

  getColorValue(extensionColor) {
    const hexColor = parseColor(extensionColor);
    if (!this.options.useLinkedStyleguides || ! (hexColor in this.colorTable)) {
      return `"${hexColor}"`
    }
    if (!!this.options.styleGuideNamespace) {
      return `${this.options.styleGuideNamespace}.${camelize(this.colorTable[hexColor].name)}`
    }
    return camelize(this.colorTable[hexColor].name)
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
      let attrs = [];
      attrs.push(`${INDENTATION}width: ${resizeWrapper(this.options.resizeFunction, layer.rect.width)}`);
      attrs.push(`${INDENTATION}height: ${resizeWrapper(this.options.resizeFunction, layer.rect.height)}`);
      // color
      let isTransparent = false;
      if (layer.fills.length === 0) {
        isTransparent = true;
      } else {
        const fill = layer.fills[0];
        if (fill.type === "color") {
          attrs.push(`${INDENTATION}color: ${this.getColorValue(fill.color)}`);
        }
      }
      // border

      if (layer.borderRadius !== 0) {
        attrs.push(`${INDENTATION}radius: ${resizeWrapper(this.options.resizeFunction, layer.borderRadius)}`);
      }
      if (layer.name.toLowerCase().includes('oval')) {
        // Need to set radius for rectangle as Oval from sketch does not provide this attribute
        attrs.push(`${INDENTATION}radius: ${resizeWrapper(this.options.resizeFunction, layer.rect.width)}`);
      }
      let hasBorder = layer.borders.length > 0;
      attrs = attrs.concat(this.parseBorder(layer.borders).map(attr => `${INDENTATION}${attr}`));
      return `${hasBorder || !isTransparent ? 'Rectangle' : 'Item'} {
${attrs.join('\n')}\n}`
    }

    if (layer.type === 'text') {
      let attrs = [];
      for (const wrappedText of trWrapper(this.options.translationFunction, layer.content)) {
        attrs.push(`${INDENTATION}${wrappedText}`);
      }
      attrs = attrs.concat(this.parseTextStyle(layer.textStyles));
      return `Text {
${attrs.join('\n')}\n}`
    }

  };

  parseBorder (borders) {
    if (borders.length === 0) {
      return [];
    }
    const attrs = [];
    attrs.push(`border {`);
    const border = borders[0];
    if (border.thickness !== null) {
      attrs.push(`${INDENTATION}width: ${resizeWrapper(this.options.resizeFunction, border.thickness)}`);
    }
    if (border.fill.type === "color") {
      attrs.push(`${INDENTATION}color: ${this.getColorValue(border.fill.color)}`);
    }
    attrs.push(`}`);
    return attrs;
  };

  parseTextStyle (textStyles) {
    const attrs = [];
    if (textStyles.length === 0) {
      return attrs;
    }
    // text style applies to range of text
    const textStyle = textStyles[0].textStyle;
    attrs.push(`${INDENTATION}color: ${this.getColorValue(textStyle.color)}`);
    attrs.push(`${INDENTATION}font.pixelSize: ${resizeWrapper(this.options.resizeFunction, textStyle.fontSize)}`);
    if (textStyle.fontWeight === 700) {
      attrs.push(`${INDENTATION}font.weight: Font.Bold`);
      // 400 is normal do nothing
    }
    attrs.push(`${INDENTATION}wrapMode: Text.WordWrap`);
    attrs.push(`${INDENTATION}elide: Text.ElideRight`);
    return attrs;
  };

  parseLayers (layers) {
    console.warn('Not implemented')
  };

}

const parseColor = (extensionColor) => {
  const color = Color.fromRGBA(extensionColor);
  return color.toStyleValue({ colorFormat: 'hex'})
};

const getColorTable = (colorList) => {
  const colorTable = {};
  for (const color of colorList) {
    colorTable[parseColor(color)] = color;
  }
  return colorTable;
};

const camelize = (str) => {
  return str.replace(/[_.\s-](\w|$)/g, (_,x) => {
    return x.toUpperCase();
  });
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

export const debugLog = (obj) => {
  console.log(obj, getCircularReplacer());
};

const resizeWrapper = (functionName, value) => {
  value = Math.round(value);
  if (!!functionName) {
    return `${functionName}(${value})`;
  }
  return `${value}`;
};


/**
 * Create qsTr, qsTrId wrapper for text
 * @param functionName
 * @param {string} value
 */
const trWrapper = (functionName, value) => {
  const ret = [];
  switch (functionName) {
    case 'qsTr':
      ret.push(`text: qsTr('${value}')`);
      break;
    case 'qsTrId':
      ret.push('//: Describe text context');
      ret.push(`//% "${value}"`);
      ret.push('//~ Extra comments for text');
      ret.push(`text: qsTrId('${value.split(' ').filter(elem => !!elem).join('-')}')`);
      break;
    default:
      ret.push(`text: '${value}'`);
  }
  return ret;
};
