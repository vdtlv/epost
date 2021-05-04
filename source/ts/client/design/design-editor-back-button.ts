'use strict';

const templateElement: HTMLElement = document.querySelector('.card__template') as HTMLElement;

import { getCurrent } from './design-editor.js';
import { closeEditorTab } from './design-editor-tabs.js';

// Удаляет элемент текущего слоя и очищает форму, а если слой не новый - отменяет изменения
export const onBackButtonClick = () => {
  if (getCurrent().isNewLayer) {
    if(templateElement.lastChild) {
      templateElement.lastChild.remove();
    }
  } else {
    const activeLayers = templateElement.querySelectorAll('div');
    if(activeLayers) {
      if(getCurrent().currentLayerObject) {
        if(getCurrent().tempLayerElement) {
          for (let i = 0; i < activeLayers.length; i++) {
            if (activeLayers[i]!.id === getCurrent().currentLayerObject!.id) {
              getCurrent().currentLayerObject = getCurrent().tempLayerObject;
              getCurrent().currentLayerObject = JSON.parse(JSON.stringify(getCurrent().tempLayerObject));
              activeLayers[i]!.replaceWith(getCurrent().tempLayerElement!);
            }
          }
        }
      }
    }
  }
  closeEditorTab();
};
