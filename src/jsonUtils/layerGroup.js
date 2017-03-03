// Just a generic layer group

import { generateID, makeRect } from './models';

export const layerGroup = (x, y, width, height) => ({
  _class: 'group',
  do_objectID: generateID(),
  exportOptions: {
    _class: 'exportOptions',
    exportFormats: [],
    includedLayerIds: [],
    layerOptions: 0,
    shouldTrim: false
  },
  frame: makeRect(x, y, width, height),
  isFlippedHorizontal: false,
  isFlippedVertical: false,
  isLocked: false,
  isVisible: true,
  // Expand by default?
  layerListExpandedType: 2,
  name: 'Group',
  nameIsFixed: false,
  resizingType: 0,
  rotation: 0,
  shouldBreakMaskChain: false,
  style: {
    _class: 'style',
    endDecorationType: 0,
    miterLimit: 10,
    startDecorationType: 0
  },
  hasClickThrough: false,
  layers: [ /* This to be filled in by the client */]
});