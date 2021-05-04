'use strict';

import { BackgroundLayer, TextLayer, ImageLayer, ShapeLayer } from '../base/layers.js';
import { insertLayerValues } from './design-editor-insert-values-layer.js';
import { onDoneBackgroundClick, onDoneTextLayerClick, onDoneImageLayerClick, onDoneShapeLayerClick } from './design-editor-done-button.js';
import { onBackButtonClick } from './design-editor-back-button.js';
import { openEditorTab } from './design-editor-util.js';
import { getCurrent } from './design-editor.js';

const templateElement: HTMLElement = document.querySelector('.card__template') as HTMLElement;
const backgroundTab : HTMLElement = document.querySelector('#background') as HTMLElement;
const textTab : HTMLElement = document.querySelector('#text-layer') as HTMLElement;
const imageTab : HTMLElement = document.querySelector('#image-layer') as HTMLElement;
const shapeTab : HTMLElement = document.querySelector('#shape-layer') as HTMLElement;

export const openBackgroundTab = (layer? : BackgroundLayer) => {
  if(backgroundTab) {
    getCurrent().currentForm = backgroundTab.querySelector('form') as HTMLFormElement;
    getCurrent().currentDoneButton = backgroundTab.querySelector('.sub-card__done-button') as HTMLButtonElement;
    getCurrent().currentDoneButton!.addEventListener('click', onDoneBackgroundClick);
    getCurrent().currentBackButton = backgroundTab.querySelector('.sub-card__back-button') as HTMLButtonElement;
    getCurrent().currentBackButton!.addEventListener('click', onBackButtonClick);
    openEditorTab(backgroundTab);
    if (layer) {
      getCurrent().isNewLayer =  false;
      getCurrent().currentLayerObject = layer;
      const backgroundInput : HTMLInputElement = document.querySelector('#design-background') as HTMLInputElement;
      backgroundInput.value = (getCurrent().currentLayerObject as BackgroundLayer).color;
    } else {
      getCurrent().isNewLayer = true;
      getCurrent().currentLayerObject = new BackgroundLayer();
    }
  }
};

export const openTextTab = (layer? : TextLayer) => {
  if(textTab) {
    getCurrent().currentForm = textTab.querySelector('form') as HTMLFormElement;
    getCurrent().currentDoneButton = textTab.querySelector('.sub-card__done-button') as HTMLButtonElement;
    getCurrent().currentBackButton = textTab.querySelector('.sub-card__back-button') as HTMLButtonElement;
    getCurrent().currentBackButton!.addEventListener('click', onBackButtonClick);
    openEditorTab(textTab);
    if (layer) {
      getCurrent().isNewLayer =  false;
      const activeLayers = templateElement.querySelectorAll('div');
      if(activeLayers) {
        for (let i = 0; i < activeLayers.length; i++) {
          if (activeLayers[i]!.id === layer.id) {
            getCurrent().tempLayerObject = JSON.parse(JSON.stringify(layer));
            getCurrent().tempLayerElement = activeLayers[i]!.cloneNode(true) as HTMLElement;
          }
        }
      }
      getCurrent().currentLayerObject = layer;
      getCurrent().isNewLayer = false;
      onEditLayer(textTab, getCurrent().currentLayerObject!);
      const fontSizeInput : HTMLInputElement = document.querySelector('#design-text-font-size') as HTMLInputElement;
      if ((getCurrent().currentLayerObject as TextLayer).fontSize) {
        fontSizeInput.value = (getCurrent().currentLayerObject as TextLayer).fontSize!.toString();
      }
    } else {
      getCurrent().isNewLayer = true;
      getCurrent().currentLayerObject = new TextLayer();
      const newTextElement = document.createElement('div');
      newTextElement.classList.add('card__element');
      newTextElement.classList.add('card__element--empty');
      newTextElement.id = getCurrent().currentLayerObject!.id;
      (getCurrent().currentLayerObject as TextLayer | ImageLayer | ShapeLayer)!.content += (' #' + (getCurrent().textLayersIterator + 1).toString());
      newTextElement.textContent = (getCurrent().currentLayerObject as TextLayer | ImageLayer | ShapeLayer).content;
      getCurrent().currentLayerElement = newTextElement;
    }
    if(getCurrent().currentLayerElement) {
      templateElement.appendChild(getCurrent().currentLayerElement!);
    }
    if(getCurrent().currentDoneButton) {
      getCurrent().currentDoneButton!.addEventListener('click', onDoneTextLayerClick);
    }
  }
};

export const openImageTab = (layer? : ImageLayer) => {
  if(imageTab) {
    getCurrent().currentForm = imageTab.querySelector('form') as HTMLFormElement;
    getCurrent().currentDoneButton = imageTab.querySelector('.sub-card__done-button') as HTMLButtonElement;
    getCurrent().currentBackButton = imageTab.querySelector('.sub-card__back-button') as HTMLButtonElement;
    getCurrent().currentBackButton!.addEventListener('click', onBackButtonClick);
    openEditorTab(imageTab);
    if (layer) {
      getCurrent().currentLayerObject = layer;
      getCurrent().isNewLayer = false;
      onEditLayer(imageTab, getCurrent().currentLayerObject!);
    } else {
      getCurrent().isNewLayer = true;
      getCurrent().currentLayerObject = new ImageLayer();
      const newImageElement = document.createElement('div');
      newImageElement.classList.add('card__element');
      if(getCurrent().currentLayerObject) {
        newImageElement.id = getCurrent().currentLayerObject!.id;
      }
      newImageElement.textContent = (getCurrent().currentLayerObject as TextLayer | ImageLayer | ShapeLayer)!.content + ' #' + (getCurrent().imageLayersIterator + 1).toString();
      newImageElement.style.backgroundImage = 'url("img/default.png")';
      getCurrent().currentLayerElement = newImageElement;
    }
    if(getCurrent().currentLayerElement) {
      templateElement.appendChild(getCurrent().currentLayerElement!);
    }
    if(getCurrent().currentDoneButton) {
      getCurrent().currentDoneButton!.addEventListener('click', onDoneImageLayerClick);
    }
  }
};

export const openShapeTab = (layer? : ShapeLayer) => {
  if(shapeTab) {
    getCurrent().currentForm = shapeTab.querySelector('form') as HTMLFormElement;
    getCurrent().currentDoneButton = shapeTab.querySelector('.sub-card__done-button') as HTMLButtonElement;
    getCurrent().currentBackButton = shapeTab.querySelector('.sub-card__back-button') as HTMLButtonElement;
    getCurrent().currentBackButton!.addEventListener('click', onBackButtonClick);
    openEditorTab(shapeTab);
    if (layer) {
      getCurrent().currentLayerObject = layer;
      getCurrent().isNewLayer = false;
      onEditLayer(shapeTab, getCurrent().currentLayerObject!);
    } else {
      getCurrent().isNewLayer = true;
      getCurrent().currentLayerObject = new ShapeLayer();
      const newShapeElement = document.createElement('div');
      newShapeElement.classList.add('card__element');
      newShapeElement.id = getCurrent().currentLayerObject!.id;
      newShapeElement.classList.add('card__element--shape');
      newShapeElement.textContent = 'Shape #' + (getCurrent().shapeLayersIterator + 1);
      getCurrent().currentLayerElement = newShapeElement;
    }
    if(getCurrent().currentLayerElement) {
      templateElement.appendChild(getCurrent().currentLayerElement!);
    }
    if(getCurrent().currentDoneButton) {
      getCurrent().currentDoneButton!.addEventListener('click', onDoneShapeLayerClick);
    }
  }
};

const onEditLayer = (tab: HTMLElement, currentLayerObject: BackgroundLayer | TextLayer | ImageLayer | ShapeLayer) => {
  const activeLayers = templateElement.querySelectorAll('div');
  if(activeLayers) {
    for (let i = 0; i < activeLayers.length; i++) {
      if (activeLayers[i]!.id === currentLayerObject.id) {
        getCurrent().tempLayerObject = JSON.parse(JSON.stringify(currentLayerObject));
        getCurrent().tempLayerElement = activeLayers[i]!.cloneNode(true) as HTMLElement;
        getCurrent().currentLayerElement = activeLayers[i]!;
      }
    }
  }

  insertLayerValues(tab, currentLayerObject);
};

///////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
