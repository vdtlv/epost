'use strict';

import { showTemplates, removeTemplate } from '../base/big-tile.js';
import { closePopup } from '../base/popup.js';

const pageID = document.querySelector('.design-catalog');
const deleteButton = document.querySelector('#delete-button');
const cancelButton = document.querySelector('#cancel-button');

const initCancelButton = () => {
  if(cancelButton) {
    cancelButton.addEventListener('click', closePopup);
  }
};

const initDeleteButton = () => {
  if(deleteButton) {
    deleteButton.addEventListener('click', () => {
      removeTemplate();
      closePopup();
    });
  }
};

export const initDesignCatalog = () => {
  if(pageID) {
    showTemplates();
    initDeleteButton();
    initCancelButton();
  }
};
