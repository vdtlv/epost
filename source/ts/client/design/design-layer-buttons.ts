'use strict'

import { DEFAULT_BACKGROUND } from '../base/util.js'
import { TextLayer, ImageLayer, ShapeLayer, BackgroundLayer } from '../base/layers.js'
import { openBackgroundTab, openTextTab, openImageTab, openShapeTab } from './design-editor-layer-tabs.js';
import { getCurrent } from './design-editor.js';

const templateElement: HTMLElement = document.querySelector('.card__template') as HTMLElement;
const layerButtonTemplate: HTMLTemplateElement = document.querySelector('#template-layer-button') as HTMLTemplateElement;
const layersList : HTMLUListElement = document.querySelector('.card__layers') as HTMLUListElement;

export const generateLayerButton = (layer: TextLayer | ImageLayer | ShapeLayer | BackgroundLayer) => {
  if(layerButtonTemplate) {
    const firstIDCharacter = layer.id.charAt(0);
    const button = layerButtonTemplate.content.querySelector('li')!.cloneNode(true) as HTMLElement;
    const editButton = button.querySelector('.edit');
    const deleteButton = button.querySelector('.delete-layer');
    switch (firstIDCharacter) {
      case 'b':
        if(editButton) {
          editButton.textContent += 'background';
          editButton.addEventListener('click', () => {
            openBackgroundTab(layer as BackgroundLayer);
          });
        }
        if(deleteButton) {
          deleteButton.addEventListener('click', function () {
            button.remove();
            (getCurrent().currentLayerObject as BackgroundLayer).color = DEFAULT_BACKGROUND;
            templateElement.style.backgroundColor = DEFAULT_BACKGROUND;
            const backgroundButton: HTMLButtonElement = document.querySelector('#background-button') as HTMLButtonElement;
            if(backgroundButton) {
              backgroundButton.disabled = false;
            }
          });
        }
        break;

      case 't':
        if(editButton) {
          editButton.textContent += 'text layer #' + getCurrent().textLayersIterator.toString();
          editButton.addEventListener('click', () => {
            openTextTab(layer as TextLayer);
          });
        }
        if(deleteButton) {
          deleteButton.addEventListener('click', function () {
            button.remove();
            if(getCurrent().templateObject) {
              const objectTextLayers = getCurrent().templateObject!.textLayers;
              if(objectTextLayers) {
                removeLayerObject(objectTextLayers, layer);
              }
              removeLayerElement(layer);
            }
          });
        }
        break;

      case 'i':
        if(editButton) {
          editButton.textContent += 'image layer #' + getCurrent().imageLayersIterator.toString();
          editButton.addEventListener('click', () => {
            openImageTab(layer as ImageLayer);
          });
        }
        if(deleteButton) {
          deleteButton.addEventListener('click', function () {
            button.remove();
            if(getCurrent().templateObject) {
              const objectImageLayers = getCurrent().templateObject!.imageLayers;
              if(objectImageLayers) {
                removeLayerObject(objectImageLayers, layer);
              }
              removeLayerElement(layer);
            }
          });
        }
        break;

      case 's':
        if(editButton) {
          editButton.textContent += 'shape layer #' + getCurrent().shapeLayersIterator.toString();
          editButton.addEventListener('click', () => {
            openShapeTab(layer as ShapeLayer);
          });
        }
        if(deleteButton) {
          deleteButton.addEventListener('click', function () {
            button.remove();
            if(getCurrent().templateObject) {
              const objectShapeLayers = getCurrent().templateObject!.shapeLayers;
              if(objectShapeLayers) {
                removeLayerObject(objectShapeLayers, layer);
              }
              removeLayerElement(layer);
            }
          });
        }
        break;
    };
    insertLayerButton(button);
  }
};

export const generateBackgroundButton = (color: string) => {
  if(layerButtonTemplate) {
    const button = layerButtonTemplate.content.querySelector('li')!.cloneNode(true) as HTMLElement;
    const editButton = button.querySelector('.edit');
    const deleteButton = button.querySelector('.delete-layer');
    const layer = new BackgroundLayer();
    layer.color = color;
    if(editButton) {
      editButton.textContent += 'background';
      editButton.addEventListener('click', () => {
        openBackgroundTab(layer);
      });
    }
    if(deleteButton) {
      deleteButton.addEventListener('click', function () {
        button.remove();
        (getCurrent().currentLayerObject as BackgroundLayer).color = DEFAULT_BACKGROUND;
        templateElement.style.backgroundColor = DEFAULT_BACKGROUND;
        const backgroundButton: HTMLButtonElement = document.querySelector('#background-button') as HTMLButtonElement;
        if(backgroundButton) {
          backgroundButton.disabled = false;
        }
      });
    }
    insertLayerButton(button);
    const backgroundButton: HTMLButtonElement = document.querySelector('#background-button') as HTMLButtonElement;
    if(backgroundButton) {
      backgroundButton.disabled;
    }
  }
};

const removeLayerElement = (layer: TextLayer | ImageLayer | ShapeLayer | BackgroundLayer) => {
  const templateLayerElements = templateElement.querySelectorAll('div');
  templateLayerElements.forEach((element) => {
    if(element.id === layer.id) {
      element.remove();
    }
  });
};

const removeLayerObject = (layersArray: Array< TextLayer | ImageLayer | ShapeLayer | BackgroundLayer >, layer: TextLayer | ImageLayer | ShapeLayer | BackgroundLayer) => {
  if(layersArray) {
    if(layer) {
      for (let i = 0; i < layersArray.length; i++) {
        if(layersArray[i]!.id === layer.id) {
          layersArray.splice(i, 1);
        }
      }
    }
  }
};

const insertLayerButton = (button: HTMLElement) => {
  if(layersList) {
    layersList.insertAdjacentElement('beforeend', button);
  }
};
