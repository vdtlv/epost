'use strict';

import { closePopup } from '../base/popup.js';
import { onBackButtonClick } from './design-editor-back-button.js';
import { openBackgroundTab, openTextTab, openImageTab, openShapeTab } from './design-editor-layer-tabs.js';
import { onDoneBackgroundClick, onDoneTextLayerClick, onDoneImageLayerClick, onDoneShapeLayerClick } from './design-editor-done-button.js';
import { openEditorTab } from './design-editor-util.js';
import { getCurrent } from './design-editor.js';

const editorTabs = document.querySelectorAll('.sub-card');
const tabsButtons = document.querySelectorAll('.tab-button');

// Привязывает каждую кнопку вкладки к соответствующей вкладке
export const initEditorTabButtons = () => {
  if(tabsButtons) {
    if(editorTabs) {
      tabsButtons.forEach((tabsButton: Element) => {
        for (let i = 0; i < editorTabs.length; i++) {
          if (editorTabs[i]!.id === (tabsButton as HTMLElement).dataset.tab) {
            tabsButton.addEventListener('click', () => {
              closePopup();
              switch ((tabsButton as HTMLElement).dataset.tab) {
                case 'background':
                  openBackgroundTab();
                  break;

                case 'text-layer':
                  openTextTab();
                  break;

                case 'image-layer':
                  openImageTab();
                  break;

                case 'shape-layer':
                  openShapeTab();
                  break;
              }
            });
          }
        }
      });
    }
  }
};

// Закрывает вкладку, очищает форму и снимает обработчики
export const closeEditorTab = () => {
  const tab: HTMLElement = document.querySelector('.sub-card:not(.hidden)') as HTMLElement;
  if(tab) {
    const form = getCurrent().currentForm;
    if (form) {
      form.reset();
    }
    const backButton = getCurrent().currentBackButton;
    if (backButton) {
      backButton.removeEventListener('click', onBackButtonClick);
    }
    const doneButton = getCurrent().currentDoneButton;
    if (doneButton) {
      const tabID = tab.id;
      switch (tabID) {
        case 'background':
          doneButton.removeEventListener('click', onDoneBackgroundClick);
          break;

        case 'text-layer':
          doneButton.removeEventListener('click', onDoneTextLayerClick);
          break;

        case 'image-layer':
          doneButton.removeEventListener('click', onDoneImageLayerClick);
          break;

        case 'shape-layer':
          doneButton.removeEventListener('click', onDoneShapeLayerClick);
          break;
      }
    };
    openEditorTab(tab);
  }
};
