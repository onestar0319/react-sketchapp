import { FileFormat1 as FileFormat } from '@sketch-hq/sketch-file-format-ts';
import { SketchDocumentData, SketchDocument, WrappedSketchDocument, TextStyle } from '../types';
import { getSketchVersion } from '../utils/getSketchVersion';
import hashStyle from '../utils/hashStyle';
import { getDocument } from '../utils/getDocument';
import sharedTextStyles from '../wrappers/sharedTextStyles';
import { makeTextStyle } from '../jsonUtils/textLayers';
import pick from '../utils/pick';
import { INHERITABLE_FONT_STYLES } from '../utils/constants';
import { generateID } from '../jsonUtils/models';

type MurmurHash = string;

type RegisteredStyle = {
  cssStyle: TextStyle;
  name: string;
  sketchStyle: FileFormat.Style;
  sharedObjectID: FileFormat.Uuid;
};

type StyleHash = { [key: string]: RegisteredStyle };

let _styles: StyleHash = {};
const _byName: { [key: string]: MurmurHash } = {};

const sketchVersion = getSketchVersion();

const registerStyle = (name: string, style: TextStyle): void => {
  const safeStyle = pick(style, INHERITABLE_FONT_STYLES);
  const hash = hashStyle(safeStyle);
  const sketchStyle = makeTextStyle(safeStyle);
  let sharedObjectID: string;

  if (sketchVersion !== 'NodeJS') {
    sharedObjectID = sharedTextStyles.addStyle(name, sketchStyle);
  } else {
    sharedObjectID = generateID(`sharedStyle:${name}`, !!name);
  }

  // FIXME(gold): side effect :'(
  _byName[name] = hash;

  _styles[hash] = {
    cssStyle: safeStyle,
    name,
    sketchStyle,
    sharedObjectID,
  };
};

type Options = {
  clearExistingStyles?: boolean;
  document?: SketchDocumentData | SketchDocument | WrappedSketchDocument;
};

const create = (options: Options, styles: { [key: string]: TextStyle }): StyleHash => {
  const { clearExistingStyles, document } = options;

  const doc = getDocument(document);

  if (sketchVersion !== 'NodeJS' && sketchVersion < 50) {
    doc.showMessage('💎 Requires Sketch 50+ 💎');
    return {};
  }

  if (sketchVersion !== 'NodeJS' && doc) {
    sharedTextStyles.setDocument(doc);

    if (clearExistingStyles) {
      _styles = {};
      sharedTextStyles.setStyles([]);
    }
  }

  Object.keys(styles).forEach(name => registerStyle(name, styles[name]));

  return _styles;
};

const resolve = (style: TextStyle): RegisteredStyle | undefined => {
  const safeStyle = pick(style, INHERITABLE_FONT_STYLES);
  const hash = hashStyle(safeStyle);

  return _styles[hash];
};

const get = (
  name: string,
  document?: SketchDocumentData | SketchDocument | WrappedSketchDocument,
): TextStyle | undefined => {
  const hash = _byName[name];
  const style = _styles[hash];

  if (style) {
    return style.cssStyle;
  }

  if (sketchVersion !== 'NodeJS') {
    return sharedTextStyles.getStyle(name, document ? getDocument(document) : undefined);
  }

  return undefined;
};

const clear = () => {
  _styles = {};
  if (sketchVersion !== 'NodeJS') {
    sharedTextStyles.setStyles([]);
  }
};

const toJSON = (): FileFormat.SharedStyle[] =>
  Object.keys(_styles).map(k => ({
    _class: 'sharedStyle',
    do_objectID: _styles[k].sharedObjectID,
    name: _styles[k].name,
    value: _styles[k].sketchStyle,
  }));

const styles = () => _styles;

const TextStyles = {
  create,
  resolve,
  get,
  styles,
  clear,
  toJSON,
};

export default TextStyles;
