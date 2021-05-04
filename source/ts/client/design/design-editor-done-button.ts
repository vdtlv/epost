'use strict';

import { generateLayerButton } from './design-layer-buttons.js';

import { BackgroundLayer, TextLayer, ImageLayer, ShapeLayer } from '../base/layers.js';
import { closeEditorTab } from './design-editor-tabs.js';
import { getCurrent } from './design-editor.js';

const HEX_REG_EX = new RegExp('^#(?:[0-9a-fA-F]{3}){1,2}$');

export const onDoneBackgroundClick = () => {
  const layerObject = getCurrent().currentLayerObject;
  const templateObject = getCurrent().templateObject;
  if((layerObject as BackgroundLayer).color) {
    if ((layerObject as BackgroundLayer).color.match(HEX_REG_EX)) {
      if (templateObject) {
        templateObject.background = (layerObject as BackgroundLayer).color;
      }
      if (getCurrent().isNewLayer) {
        if(layerObject) {
          generateLayerButton(layerObject);
        }
      }
      const backgroundButton: HTMLButtonElement = document.querySelector('#background-button') as HTMLButtonElement;
      if(backgroundButton) {
        backgroundButton.disabled = true;
      }
    }
  }
  const doneButton = getCurrent().currentDoneButton;
  if(doneButton) {
    doneButton.removeEventListener('click', onDoneBackgroundClick);
  }
  closeEditorTab();
};

export const onDoneTextLayerClick = () => {
  const templateObject = getCurrent().templateObject;
  const layerObject = getCurrent().currentLayerObject;
  if (templateObject) {
    if (layerObject) {
      if (getCurrent().isNewLayer) {
        templateObject.textLayers.push(layerObject as TextLayer);
        templateObject.layers.push(layerObject.id);
        getCurrent().textLayersIterator!++;
        generateLayerButton(layerObject);
      } else {
        if(templateObject.textLayers) {
          for (let i = 0; i < templateObject.textLayers.length; i++) {
            if (templateObject.textLayers[i]!.id === layerObject.id) {
              templateObject.textLayers[i] = (layerObject as TextLayer);
            }
          }
        }
      }
    }
  }

  const doneButton = getCurrent().currentDoneButton;
  if(doneButton) {
    doneButton.removeEventListener('click', onDoneTextLayerClick);
  }
  closeEditorTab();
};

export const onDoneImageLayerClick = () => {
  const templateObject = getCurrent().templateObject;
  const layerObject = getCurrent().currentLayerObject;
  if (templateObject) {
    if (layerObject) {
      if (getCurrent().isNewLayer) {
        templateObject.imageLayers.push(layerObject as ImageLayer);
        templateObject.layers.push(layerObject.id);
        getCurrent().imageLayersIterator++;
        generateLayerButton(layerObject);
      } else {
        if(templateObject.imageLayers) {
          for (let i = 0; i < templateObject.imageLayers.length; i++) {
            if (templateObject.imageLayers[i]!.id === layerObject.id) {
              templateObject.imageLayers[i] = (getCurrent().currentLayerObject as ImageLayer);
            }
          }
        }
      }
    }
  }
  const doneButton = getCurrent().currentDoneButton;
  if(doneButton) {
    doneButton.removeEventListener('click', onDoneImageLayerClick);
  }
  closeEditorTab();
};

export const onDoneShapeLayerClick = () => {
  const templateObject = getCurrent().templateObject;
  const layerObject = getCurrent().currentLayerObject;
  if (templateObject) {
    if (layerObject) {
      if (getCurrent().isNewLayer) {
        templateObject.shapeLayers.push(layerObject as ShapeLayer);
        templateObject.layers.push(layerObject.id);
        getCurrent().shapeLayersIterator++;
        generateLayerButton(layerObject);
      } else {
        if(templateObject.shapeLayers) {
          for (let i = 0; i < templateObject.shapeLayers.length; i++) {
            if (templateObject.shapeLayers[i]!.id === layerObject.id) {
              templateObject.shapeLayers[i] = (layerObject as ShapeLayer);
            }
          }
        }
      }
    }
  }
  const doneButton = getCurrent().currentDoneButton;
  if(doneButton) {
    doneButton.removeEventListener('click', onDoneShapeLayerClick);
  }
  closeEditorTab();
};
