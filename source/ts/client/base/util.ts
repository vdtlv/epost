'use strict';
import { BackgroundLayer, TextLayer, ImageLayer, ShapeLayer } from './layers.js';
import { templateData } from './template.js';

export const DEFAULT_BACKGROUND : string = '#ffffff';

export const generateId = () : string => {
  let tempId : string = '';
  for (let i = 0; i < 7; i++) {
    tempId += (Math.floor(Math.random()*10)).toString();
  }
  return tempId;
};

export const debounce = function (cb: Function) {
  let lastTimeout: ReturnType<typeof setTimeout>;
  return function () {
    const fnCall = () => { cb.apply( arguments) };
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(fnCall, 500);
  };
};

export const toggleBetweenMenus = (menu1: HTMLElement, menu2: HTMLElement) => {
  menu1.classList.toggle('hidden');
  menu2.classList.toggle('hidden');
};

export class currentClass {
  templateObject?: templateData;
  currentBackButton?: HTMLButtonElement;
  currentDoneButton?: HTMLButtonElement;
  currentForm?: HTMLFormElement;
  isNewTemplate?: boolean;

  currentLayerObject?: BackgroundLayer | TextLayer | ImageLayer | ShapeLayer;
  currentLayerElement?: HTMLElement;

  tempLayerObject?: BackgroundLayer | TextLayer | ImageLayer | ShapeLayer;
  tempLayerElement?: HTMLElement;
  isNewLayer?: boolean;

  textLayersIterator: number = 0;
  imageLayersIterator: number = 0;
  shapeLayersIterator: number = 0;
};
