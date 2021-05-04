'use strict';

import { BackgroundLayer, TextLayer, ImageLayer, ShapeLayer } from '../base/layers.js';

// Прокидывает все значения из объекта слоя в поля вкладки
export const insertLayerValues = (tab: HTMLElement, currentLayerObject: BackgroundLayer | TextLayer | ImageLayer | ShapeLayer) => {
  const xInput : HTMLInputElement = tab.querySelector('.design-x') as HTMLInputElement;
  const yInput : HTMLInputElement = tab.querySelector('.design-y') as HTMLInputElement;
  const widthInput : HTMLInputElement = tab.querySelector('.design-width') as HTMLInputElement;
  const heightInput : HTMLInputElement = tab.querySelector('.design-height') as HTMLInputElement;
  if ((currentLayerObject as TextLayer | ImageLayer | ShapeLayer).x) {
    if((currentLayerObject as TextLayer | ImageLayer | ShapeLayer).x !== 0) {
      xInput.value = (currentLayerObject as TextLayer | ImageLayer | ShapeLayer).x.toString();
    }
  }
  if ((currentLayerObject as TextLayer | ImageLayer | ShapeLayer).y) {
    if((currentLayerObject as TextLayer | ImageLayer | ShapeLayer).y !== 0) {
      yInput.value = (currentLayerObject as TextLayer | ImageLayer | ShapeLayer).y.toString();
    }
  }
  if ((currentLayerObject as TextLayer | ImageLayer | ShapeLayer).width) {
    if((currentLayerObject as TextLayer | ImageLayer | ShapeLayer).width !== 30) {
      widthInput.value = (currentLayerObject as TextLayer | ImageLayer | ShapeLayer).width.toString();
    }
  }
  if ((currentLayerObject as TextLayer | ImageLayer | ShapeLayer).height) {
    if((currentLayerObject as TextLayer | ImageLayer | ShapeLayer).height !== 20) {
      heightInput.value = (currentLayerObject as TextLayer | ImageLayer | ShapeLayer).height.toString();
    }
  }
  if ((currentLayerObject as TextLayer).fontSize) {
    const fontSizeInput : HTMLInputElement = tab.querySelector('.design-font-size') as HTMLInputElement;
    fontSizeInput.value = (currentLayerObject as TextLayer).fontSize!.toString();
  }
  if ((currentLayerObject as TextLayer).horAlign) {
    const horAlignInputs = tab.querySelectorAll('.design-horizontal-align') ;
    horAlignInputs.forEach((input: Element) => {
      if((input as HTMLInputElement).value === (currentLayerObject as TextLayer).horAlign) {
        (input as HTMLInputElement).checked = true;
      }
    });
  }
  if ((currentLayerObject as TextLayer).verAlign) {
    const verAlignInputs = tab.querySelectorAll('.design-vertical-align');
    verAlignInputs.forEach((input: Element) => {
      if((input as HTMLInputElement).value === (currentLayerObject as TextLayer).verAlign) {
        (input as HTMLInputElement).checked = true;
      }
    });
  }
  if ((currentLayerObject as ShapeLayer).backgroundColor) {
    const backgroundColorInput : HTMLInputElement = tab.querySelector('.design-background') as HTMLInputElement;
    backgroundColorInput.value = (currentLayerObject as ShapeLayer).backgroundColor;
  }
  if ((currentLayerObject as ShapeLayer).borderColor) {
    const borderColorInput : HTMLInputElement = tab.querySelector('.design-border-color') as HTMLInputElement;
    borderColorInput.value = (currentLayerObject as ShapeLayer).borderColor;
  }
  if ((currentLayerObject as ShapeLayer).borderWidth) {
    const borderWidthInput : HTMLInputElement = tab.querySelector('.design-border-width') as HTMLInputElement;
    borderWidthInput.value = (currentLayerObject as ShapeLayer).borderWidth.toString();
  }
  if ((currentLayerObject as ShapeLayer).borderRadius) {
    const borderRadiusInput : HTMLInputElement = tab.querySelector('.design-border-radius') as HTMLInputElement;
    borderRadiusInput.value = (currentLayerObject as ShapeLayer).borderRadius.toString();
  }
};
