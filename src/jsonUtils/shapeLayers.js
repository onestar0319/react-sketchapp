/* @flow */
import type { SJPath, SJRect, SJShapeGroupLayer } from 'sketchapp-json-flow-types';
import type { Color } from '../types';
import { generateID, makeRect, makeColorFill } from './models';

type Radii = Array<number>;

export const makeHorizontalPath = (): SJPath => ({
  _class: 'path',
  isClosed: false,
  points: [
    {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: '{0, 0}',
      curveMode: 1,
      curveTo: '{0, 0}',
      hasCurveFrom: false,
      hasCurveTo: false,
      point: '{0, 0.5}',
    },
    {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: '{0, 0}',
      curveMode: 1,
      curveTo: '{0, 0}',
      hasCurveFrom: false,
      hasCurveTo: false,
      point: '{1, 0.5}',
    },
  ],
});

export const makeVerticalPath = (): SJPath => ({
  _class: 'path',
  isClosed: false,
  points: [
    {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: '{0, 0}',
      curveMode: 1,
      curveTo: '{0, 0}',
      hasCurveFrom: false,
      hasCurveTo: false,
      point: '{0.5, 0}',
    },
    {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: '{0, 0}',
      curveMode: 1,
      curveTo: '{0, 0}',
      hasCurveFrom: false,
      hasCurveTo: false,
      point: '{0.5, 1}',
    },
  ],
});

// This could be made more consty
export const makeRectPath = (radii: Radii = [0, 0, 0, 0]): SJPath => {
  const [r0, r1, r2, r3] = radii;
  return {
    _class: 'path',
    isClosed: true,
    points: [
      {
        _class: 'curvePoint',
        cornerRadius: r0,
        curveFrom: '{0, 0}',
        curveMode: 1,
        curveTo: '{0, 0}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{0, 0}',
      },
      {
        _class: 'curvePoint',
        cornerRadius: r1,
        curveFrom: '{1, 0}',
        curveMode: 1,
        curveTo: '{1, 0}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{1, 0}',
      },
      {
        _class: 'curvePoint',
        cornerRadius: r2,
        curveFrom: '{1, 1}',
        curveMode: 1,
        curveTo: '{1, 1}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{1, 1}',
      },
      {
        _class: 'curvePoint',
        cornerRadius: r3,
        curveFrom: '{0, 1}',
        curveMode: 1,
        curveTo: '{0, 1}',
        hasCurveFrom: false,
        hasCurveTo: false,
        point: '{0, 1}',
      },
    ],
  };
};

export const makeShapePath = (frame, path) => ({
  _class: 'shapePath',
  frame,
  do_objectID: generateID(),
  isFlippedHorizontal: false,
  isFlippedVertical: false,
  isLocked: false,
  isVisible: true,
  layerListExpandedType: 0,
  name: 'Path',
  nameIsFixed: false,
  resizingType: 0,
  rotation: 0,
  shouldBreakMaskChain: false,
  booleanOperation: -1,
  edited: false,
  path,
});

export const makeRectShapeLayer = (
  x: number,
  y: number,
  width: number,
  height: number,
  radii: Radii = [0, 0, 0, 0],
) => ({
  _class: 'rectangle',
  do_objectID: generateID(),
  // "exportOptions": {
  //   "_class": "exportOptions",
  //   "exportFormats": [],
  //   "includedLayerIds": [],
  //   "layerOptions": 0,
  //   "shouldTrim": false
  // },
  frame: makeRect(0, 0, width, height),
  isFlippedHorizontal: false,
  isFlippedVertical: false,
  isLocked: false,
  isVisible: true,
  layerListExpandedType: 0,
  name: 'Path',
  nameIsFixed: false,
  resizingType: 0,
  rotation: 0,
  shouldBreakMaskChain: false,
  booleanOperation: -1,
  edited: false,
  path: makeRectPath(radii),
  fixedRadius: 8,
  hasConvertedToNewRoundCorners: true,
});

export const makeShapeGroup = (
  frame: SJRect,
  layers: Array<any> = [],
  fills?: Array<SJFill> = [],
): SJShapeGroupLayer => ({
  _class: 'shapeGroup',
  do_objectID: generateID(),
  // "exportOptions": {
  //   "_class": "exportOptions",
  //   "exportFormats": [],
  //   "includedLayerIds": [],
  //   "layerOptions": 0,
  //   "shouldTrim": false
  // },
  frame,
  // "isFlippedHorizontal": false,
  // "isFlippedVertical": false,
  isLocked: false,
  isVisible: true,
  // "layerListExpandedType": 0,
  name: 'ShapeGroup',
  nameIsFixed: false,
  resizingType: 0,
  rotation: 0,
  shouldBreakMaskChain: false,
  style: {
    _class: 'style',
    // "borders": [
    //   {
    //     "_class": "border",
    //     "isEnabled": false,
    //     "color": {
    //       "_class": "color",
    //       "alpha": 1,
    //       "blue": 0,
    //       "green": 0,
    //       "red": 0
    //     },
    //     "fillType": 0,
    //     "position": 1,
    //     "thickness": 1
    //   }
    // ],
    endDecorationType: 0,
    fills,
    miterLimit: 10,
    startDecorationType: 0,
  },
  hasClickThrough: false,
  layers,
  clippingMaskMode: 0,
  hasClippingMask: false,
  windingRule: 1,
});

// export function makeRectShapeGroup(
//   x: number,
//   y: number,
//   width: number,
//   height: number,
//   color: Color,
// ): SJShapeGroupLayer {
//   const rsl = makeRectShapeLayer(x, y, width, height);
//   return makeShapeGroup(makeRect(x, y, width, height), [rsl], [makeColorFill(color)]);
// }
