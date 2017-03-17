/* eslint-disable no-mixed-operators, no-bitwise */
/* @flow */
import type { SJColor, SJFill, SJImageDataReference, SJRect } from 'sketchapp-json-flow-types';
import { FillType } from 'sketch-constants';
import normalizeColor from 'normalize-css-color';
import type { Color } from '../types';

// TODO(gold): can we remove this ID generator?
// export const generateID = () => "" + MSModelObjectCommon.generateObjectID();

const lut = [];
for (let i = 0; i < 256; i += 1) {
  lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}
// Hack (http://stackoverflow.com/a/21963136)
function e7() {
  const d0 = Math.random() * 0xffffffff | 0;
  const d1 = Math.random() * 0xffffffff | 0;
  const d2 = Math.random() * 0xffffffff | 0;
  const d3 = Math.random() * 0xffffffff | 0;
  return `${lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff]}-${lut[d1 & 0xff]}${lut[d1 >> 8 & 0xff]}-${lut[d1 >> 16 & 0x0f | 0x40]}${lut[d1 >> 24 & 0xff]}-${lut[d2 & 0x3f | 0x80]}${lut[d2 >> 8 & 0xff]}-${lut[d2 >> 16 & 0xff]}${lut[d2 >> 24 & 0xff]}${lut[d3 & 0xff]}${lut[d3 >> 8 & 0xff]}${lut[d3 >> 16 & 0xff]}${lut[d3 >> 24 & 0xff]}`;
}

export function generateID(): string {
  return e7();
}

// Takes 'white', '#fff', &c
export const makeColorFromCSS = (input: Color): SJColor => {
  const nullableColor: ?number = normalizeColor(input);
  const colorInt: number = nullableColor == null ? 0x00000000 : nullableColor;
  const { r, g, b, a } = normalizeColor.rgba(colorInt);

  return {
    _class: 'color',
    red: r / 255,
    green: g / 255,
    blue: b / 255,
    alpha: a,
  };
};

// Solid color fill
export const makeColorFill = (cssColor: Color): SJFill => ({
  _class: 'fill',
  isEnabled: true,
  color: makeColorFromCSS(cssColor),
  fillType: 0,
  noiseIndex: 0,
  noiseIntensity: 0,
  patternFillType: 1,
  patternTileScale: 1,
});

export const makeImageFill = (
  image: SJImageDataReference,
  patternFillType: 0 | 1 | 2 | 3 = 1,
): SJFill => ({
  _class: 'fill',
  isEnabled: true,
  fillType: FillType.Pattern,
  image,
  noiseIndex: 0,
  noiseIntensity: 0,
  patternFillType,
  patternTileScale: 1,
});

// Used in frames, etc
export const makeRect = (x: number, y: number, width: number, height: number): SJRect => ({
  _class: 'rect',
  constrainProportions: false,
  x,
  y,
  width,
  height,
});
