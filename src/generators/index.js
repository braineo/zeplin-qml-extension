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
    attrs.push(`  width: ${layer.rect.width}`);
    attrs.push(`  height: ${layer.rect.height}`);

    return `Rectangle {
${attrs.join('\n')}\n}`
  }

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
