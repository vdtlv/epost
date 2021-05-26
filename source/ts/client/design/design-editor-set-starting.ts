'use strict';

import { DEFAULT_BACKGROUND } from '../base/util.js';
import { renderTextLayer, renderImageLayer, renderShapeLayer, renderBackgroundLayer } from '../base/render-layers.js';
import { getCurrent } from './design-editor.js';

const templateElement: HTMLElement = document.querySelector('.card__template') as HTMLElement;
const nameInput : HTMLInputElement = document.querySelector('#template-name') as HTMLInputElement;

// Прокидывает информацию из текущего объекта шаблона в элементы на странице
export const setStartingInfo = () => {
  const templateObject = getCurrent().templateObject;
  if (templateObject) {
    if(templateElement) {
      templateElement.classList.add('card__template--' + templateObject.ratio);
      templateElement.style.backgroundColor = templateObject.background;
    }
    if(nameInput) {
      if(templateObject.name) {
      nameInput.value = templateObject.name;
      }
    }
    if(templateObject.background !== DEFAULT_BACKGROUND) {
      renderBackgroundLayer(templateObject.background);
    }
    const layers = templateObject.layers;
    layers.forEach((layer) => {
      const layerType = layer.charAt(0);
      switch (layerType) {
        case "t":
          if(templateObject.textLayers) {
            for (let i = 0; i < templateObject.textLayers.length; i++) {
              if(layer === templateObject.textLayers[i]!.id) {
                const layerObject = templateObject.textLayers[i]!;
                getCurrent().textLayersIterator++;
                const textLayerElement = renderTextLayer(layerObject, false);
                templateElement.appendChild(textLayerElement);
              }
            }
          }
          break;

        case "i":
          if(templateObject.textLayers) {
            for (let i = 0; i < templateObject.imageLayers.length; i++) {
              if(layer === templateObject.imageLayers[i]!.id) {
                const layerObject = templateObject.imageLayers[i]!;
                getCurrent().imageLayersIterator++;
                const imageLayerElement = renderImageLayer(layerObject, false);
                templateElement.appendChild(imageLayerElement);
              }
            }
          }
          break;

        case "s":
          if(templateObject.textLayers) {
            for (let i = 0; i < templateObject.shapeLayers.length; i++) {
              if(layer === templateObject.shapeLayers[i]!.id) {
                const layerObject = templateObject.shapeLayers[i]!;
                getCurrent().shapeLayersIterator++;
                const shapeLayerElement = renderShapeLayer(layerObject, false);
                templateElement.appendChild(shapeLayerElement);
              }
            }
          }
          break;
      }
    });
  }
};
