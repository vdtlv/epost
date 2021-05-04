'use strict';

import { toggleBetweenMenus } from '../base/util.js';

const startMenu : HTMLElement = document.querySelector('.card__layers-and-add') as HTMLElement;

// Сменяет вкладку и изначальное меню
export const openEditorTab = (tab: HTMLElement) => {
  if(startMenu) {
    if(tab) {
      toggleBetweenMenus(tab, startMenu);
    }
  }
};
