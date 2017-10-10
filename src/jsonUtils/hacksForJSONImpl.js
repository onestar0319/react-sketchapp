/* @flow */
// We need native macOS fonts and colors for these hacks so import the old utils
import type { SJTextStyle } from 'sketchapp-json-flow-types';
import { TextAlignment } from 'sketch-constants';
import { toSJSON } from 'sketchapp-json-plugin';
import findFont from '../utils/findFont';
import type { TextNodes, TextNode, TextStyle } from '../types';
import { generateID, makeColorFromCSS } from './models';

export const TEXT_ALIGN = {
  auto: TextAlignment.Left,
  left: TextAlignment.Left,
  right: TextAlignment.Right,
  center: TextAlignment.Center,
  justify: TextAlignment.Justified,
};

export const TEXT_DECORATION_UNDERLINE = {
  none: 0,
  underline: 1,
  double: 9,
};

export const TEXT_DECORATION_LINETHROUGH = {
  none: 0,
  'line-through': 1,
};

// this doesn't exist in constants
export const TEXT_TRANSFORM = {
  uppercase: 1,
  lowercase: 2,
  initial: 0,
  inherit: 0,
  none: 0,
  capitalize: 0,
};

// NOTE(gold): toSJSON doesn't recursively parse JS objects
// https://github.com/airbnb/react-sketchapp/pull/73#discussion_r108529703
function encodeSketchJSON(sketchObj) {
  const encoded = toSJSON(sketchObj);
  return JSON.parse(encoded);
}

function makeParagraphStyle(textStyle) {
  const pStyle = NSMutableParagraphStyle.alloc().init();
  if (textStyle.lineHeight !== undefined) {
    pStyle.minimumLineHeight = textStyle.lineHeight;
    pStyle.lineHeightMultiple = 1.0;
    pStyle.maximumLineHeight = textStyle.lineHeight;
  }

  if (textStyle.textAlign) {
    pStyle.alignment = TEXT_ALIGN[textStyle.textAlign];
  }

  return pStyle;
}

export const makeImageDataFromUrl = (url: string): MSImageData => {
  let fetchedData = NSData.dataWithContentsOfURL(NSURL.URLWithString(url));

  if (fetchedData) {
    const firstByte = fetchedData
      .subdataWithRange(NSMakeRange(0, 1))
      .description();

    // Check for first byte. Must use non-type-exact matching (!=).
    // 0xFF = JPEG, 0x89 = PNG, 0x47 = GIF, 0x49 = TIFF, 0x4D = TIFF
    if (
      /* eslint-disable eqeqeq */
      firstByte != '<ff>' &&
      firstByte != '<89>' &&
      firstByte != '<47>' &&
      firstByte != '<49>' &&
      firstByte != '<4d>'
      /* eslint-enable eqeqeq */
    ) {
      fetchedData = null;
    }
  }

  let image;

  if (!fetchedData) {
    const errorUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8w8DwHwAEOQHNmnaaOAAAAABJRU5ErkJggg==';
    image = NSImage.alloc().initWithContentsOfURL(
      NSURL.URLWithString(errorUrl)
    );
  } else {
    image = NSImage.alloc().initWithData(fetchedData);
  }

  if (MSImageData.alloc().initWithImage_convertColorSpace !== undefined) {
    return MSImageData.alloc().initWithImage_convertColorSpace(image, false);
  }
  return MSImageData.alloc().initWithImage(image);
};

// This shouldn't need to call into Sketch, but it does currently, which is bad for perf :(
function createStringAttributes(textStyles: TextStyle): Object {
  const font = findFont(textStyles);

  const color = makeColorFromCSS(textStyles.color || 'black');

  const attribs: Object = {
    MSAttributedStringFontAttribute: font.fontDescriptor(),
    NSFont: font,
    NSParagraphStyle: makeParagraphStyle(textStyles),
    NSColor: NSColor.colorWithDeviceRed_green_blue_alpha(
      color.red,
      color.green,
      color.blue,
      color.alpha
    ),
    NSUnderline: TEXT_DECORATION_UNDERLINE[textStyles.textDecoration] || 0,
    NSStrikethrough: TEXT_DECORATION_LINETHROUGH[textStyles.textDecoration] || 0,
  };

  if (textStyles.letterSpacing !== undefined) {
    attribs.NSKern = textStyles.letterSpacing;
  }

  if (textStyles.textTransform !== undefined) {
    attribs.MSAttributedStringTextTransformAttribute =
      TEXT_TRANSFORM[textStyles.textTransform] * 1;
  }

  return attribs;
}

export function createAttributedString(textNode: TextNode): NSAttributedString {
  const { content, textStyles } = textNode;

  const attribs = createStringAttributes(textStyles);

  return NSAttributedString.attributedStringWithString_attributes_(
    content,
    attribs
  );
}

export function makeEncodedAttributedString(textNodes: TextNodes) {
  const fullStr = NSMutableAttributedString.alloc().init();

  textNodes.forEach((textNode) => {
    const newString = createAttributedString(textNode);
    fullStr.appendAttributedString(newString);
  });

  const msAttribStr = MSAttributedString.alloc().initWithAttributedString(
    fullStr
  );

  return encodeSketchJSON(msAttribStr);
}

export function makeTextStyle(textStyle: TextStyle) {
  const pStyle = makeParagraphStyle(textStyle);

  const font = findFont(textStyle);

  const color = makeColorFromCSS(textStyle.color || 'black');

  const value: SJTextStyle = {
    _class: 'textStyle',
    encodedAttributes: {
      MSAttributedStringFontAttribute: encodeSketchJSON(font.fontDescriptor()),
      NSFont: font,
      NSColor: encodeSketchJSON(
        NSColor.colorWithDeviceRed_green_blue_alpha(
          color.red,
          color.green,
          color.blue,
          color.alpha
        )
      ),
      NSParagraphStyle: encodeSketchJSON(pStyle),
      NSKern: textStyle.letterSpacing || 0,
      MSAttributedStringTextTransformAttribute:
        TEXT_TRANSFORM[textStyle.textTransform || 'initial'] * 1,
    },
  };

  return {
    _class: 'style',
    sharedObjectID: generateID(),
    miterLimit: 10,
    startDecorationType: 0,
    endDecorationType: 0,
    textStyle: value,
  };
}
