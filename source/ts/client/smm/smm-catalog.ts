'use strict';

import { showTemplates } from '../base/big-tile.js';

const pageID = document.querySelector('.smm-catalog');

export const initSMMCatalog = () => {
  if(pageID) {
    showTemplates();
  }
};
