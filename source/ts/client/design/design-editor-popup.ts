'use strict';

import { openPopup } from '../base/popup.js';

const addButton : HTMLButtonElement = document.querySelector('#add-layer') as HTMLButtonElement;

export const initEditorPopup = () => {
  if(addButton) {
    addButton.addEventListener('click', openPopup);
  }
};
