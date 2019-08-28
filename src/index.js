/**
 * Export functions you want to work with, see documentation for details:
 * https://github.com/zeplin/zeplin-extension-documentation
 */
import {getResourceContainer} from "zeplin-extension-style-kit/utils";
import {QmlLayerGenerator} from "./generators";
import {OPTION_NAMES} from "./constants";


function layer(context, selectedLayer) {
  const containerType = "styleguide" in context ? "styleguide" : "project";
  const containerAndType = getResourceContainer(context);
  const options = {
    useLinkedStyleguides: context.getOption(OPTION_NAMES.USE_LINKED_STYLEGUIDES),
    resizeFunction: context.getOption(OPTION_NAMES.RESIZE_FUNCTION),
  };
  const generator = new QmlLayerGenerator(containerAndType, selectedLayer, options);

  return {
    code: generator.getCode(),
    language: "qml",
  };
}

function screen(context, selectedVersion, selectedScreen) {

}

function component(context, selectedVersion, selectedComponent) {

}

function colors(context) {

}

function textStyles(context) {

}

function exportColors(context) {

}

function exportTextStyles(context) {

}

/**
 * The following functions will be deprecated. Your extensions can export them to support old versions of Zeplin's macOS app.
 * See Zeplin Extensions migration guide for details:
 * https://zpl.io/shared-styleguides-extensions-migration-guide
 */

function styleguideColors(context, colors) {

}

function styleguideTextStyles(context, textStyles) {

}

function exportStyleguideColors(context, colors) {

}

function exportStyleguideTextStyles(context, textStyles) {

}

function comment(context, text) {

}

export default {
  layer,
  screen,
  component,
  colors,
  textStyles,
  exportColors,
  exportTextStyles,
  styleguideColors,
  styleguideTextStyles,
  exportStyleguideColors,
  exportStyleguideTextStyles,
  comment
};
