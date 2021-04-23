'use strict'

import { getTextLayersIterator, getImageLayersIterator, getShapeLayersIterator, openBackgroundTab, openTextTab, openImageTab, openShapeTab, getCurrentLayerObject, getTemplateObject } from './design-editor.js';

const templateElement: HTMLElement = document.querySelector('.card__template') as HTMLElement;
const layerButtonTemplate: HTMLTemplateElement = document.querySelector('#template-layer-button');

const HEX_REG_EX = new RegExp('^#(?:[0-9a-fA-F]{3}){1,2}$');
const ERROR_MESSAGE_BACKGROUND : string = 'Wrong format!';
const DEFAULT_BACKGROUND : string = '#ffffff';
const DEFAULT_BACKGROUND_SHAPE : string = 'transparent';
const DEFAULT_BORDER_SHAPE : string = '#000000';

const layersList : HTMLUListElement = document.querySelector('.card__layers');

export const generateLayerButton = (layer) => {
  const firstIDCharacter = layer.id.charAt(0);
  const button = layerButtonTemplate.content.querySelector('li').cloneNode(true) as HTMLElement;
  const editButton = button.querySelector('.edit');
  const deleteButton = button.querySelector('.delete-layer');
  switch (firstIDCharacter) {
    case 'b':
      if(editButton) {
        editButton.textContent += 'background';
        editButton.addEventListener('click', () => {
          openBackgroundTab(layer);
        });
      }
      if(deleteButton) {
        deleteButton.addEventListener('click', function () {
          button.remove();
          getCurrentLayerObject().color = DEFAULT_BACKGROUND;
          templateElement.style.backgroundColor = DEFAULT_BACKGROUND;
        });
      }
      break;

    case 't':
      if(editButton) {
        editButton.textContent += 'text layer #' + getTextLayersIterator().toString();
        editButton.addEventListener('click', () => {
          openTextTab(layer);
        });
      }
      if(deleteButton) {
        deleteButton.addEventListener('click', function () {
          button.remove();
          const objectTextLayers = getTemplateObject().textLayers;
          if(objectTextLayers) {
            removeLayerObject(objectTextLayers, layer);
          }
          removeLayerElement(layer);
        });
      }
      break;

    case 'i':
      if(editButton) {
        editButton.textContent += 'image layer #' + getImageLayersIterator().toString();
        editButton.addEventListener('click', () => {
          openImageTab(layer);
        });
      }
      if(deleteButton) {
        deleteButton.addEventListener('click', function () {
          button.remove();
          const objectImageLayers = getTemplateObject().imageLayers;
          if(objectImageLayers) {
            removeLayerObject(objectImageLayers, layer);
          }
          removeLayerElement(layer);
        });
      }
      break;

    case 's':
      if(editButton) {
        editButton.textContent += 'shape layer #' + getShapeLayersIterator().toString();
        editButton.addEventListener('click', () => {
          openShapeTab(layer);
        });
      }
      if(deleteButton) {
        deleteButton.addEventListener('click', function () {
          button.remove();
          const objectShapeLayers = getTemplateObject().shapeLayers;
          if(objectShapeLayers) {
            removeLayerObject(objectShapeLayers, layer);
          }
          removeLayerElement(layer);
        });
      }
      break;
  };
  insertLayerButton(button);
};

const removeLayerElement = (layer) => {
  const templateLayerElements = templateElement.querySelectorAll('div');
  templateLayerElements.forEach((element) => {
    if(element.id === layer.id) {
      element.remove();
    }
  });
};

const removeLayerObject = (layersArray, layer) => {
  for (let i = 0; i < layersArray.length; i++) {
    if(layersArray[i].id === layer.id) {
      layersArray.splice(i, 1);
    }
  }
};


const insertLayerButton = (button) => {
  if(layersList) {
    layersList.insertAdjacentElement('beforeend', button);
  }
};
