/* @flow */
import invariant from 'invariant';
import type { Dictionary, SketchContext } from './types';
import createLayerFromStyle from './createLayerFromStyle';
import hashStyle from './utils/hashStyle';
import TextStyles from './TextStyles';


// input css style
type Style = Dictionary<string, any>;

// stored styles
type StyleHash = Dictionary<string, any>;

let _styles: StyleHash = {};

let textStyles = null;

const _clearExistingStyles = () =>
  textStyles && textStyles.setStyles([]);

const registerStyle = (key: string, style: Style): StyleHash => {
  invariant(textStyles, 'Please provide a context');
  const layer = createLayerFromStyle(key, style);
  const className = hashStyle(style);

  textStyles.addStyle(key, layer.style());

  _styles = {
    ..._styles,
    [className]: layer.style(),
  };
  return _styles;
};

type Options = {
  clearExistingStyles?: boolean,
  context: SketchContext,
}

const create = (options: Options, styles: Dictionary<string, Style>): StyleHash => {
  invariant(options && options.context, 'Please provide a context');
  const { clearExistingStyles, context } = options;

  textStyles = new TextStyles(context);
  if (clearExistingStyles) { _clearExistingStyles(); }

  return Object
    .keys(styles)
    .reduce((acc, key) =>
      registerStyle(key, styles[key])
    , null);
};

const resolve = (style: Style): ?SketchStyle => {
  invariant(textStyles, 'Please provide a context');
  const hash = hashStyle(style);

  return _styles[hash];
};

const StyleProvider = {
  registerStyle,
  create,
  resolve,
  styles() {
    return _styles;
  },
};

export default StyleProvider;
