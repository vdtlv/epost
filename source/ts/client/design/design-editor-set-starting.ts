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
    const textLayers = templateObject.textLayers;
    textLayers.forEach((textLayer) => {
      getCurrent().textLayersIterator++;
      const textLayerElement = renderTextLayer(textLayer, false);
      templateElement.appendChild(textLayerElement);
    });
    const imageLayers = templateObject.imageLayers;
    imageLayers.forEach((imageLayer) => {
      getCurrent().imageLayersIterator++;
      imageLayer.content = 'Image layer #' + getCurrent().imageLayersIterator;
      const imageLayerElement = renderImageLayer(imageLayer, false);
      templateElement.appendChild(imageLayerElement);
    });
    const shapeLayers = templateObject.shapeLayers;
    shapeLayers.forEach((shapeLayer) => {
      getCurrent().shapeLayersIterator++;
      shapeLayer.content = 'Shape layer #' + getCurrent().shapeLayersIterator;
      const shapeLayerElement = renderShapeLayer(shapeLayer, false);
      templateElement.appendChild(shapeLayerElement);
    });
  }
};
