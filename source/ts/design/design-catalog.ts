'use strict';

import { showTemplates } from '../base/big-tile.js';

const pageID = document.querySelector('.design-catalog');

export const initDesignCatalog = () => {
  if(pageID) {
    showTemplates();
  }
};
