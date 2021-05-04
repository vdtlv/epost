'use strict';

import { currentClass } from '../base/util.js';
import { initEditorInputs } from './design-editor-inputs.js';
import { initEditorPopup } from './design-editor-popup.js';
import { initSubmit } from './design-editor-save.js';
import { setStartingInfo } from './design-editor-set-starting.js';
import { setTemplateObject } from './design-editor-set-template.js';
import { initEditorTabButtons } from './design-editor-tabs.js';

const pageID = document.querySelector('.design-editor');

const current = new currentClass();

export const getCurrent = () => current;

export const initDesignEditor = () => {
  if(pageID) {
    setTemplateObject();
    setStartingInfo();
    initEditorPopup();
    initEditorTabButtons();
    initEditorInputs();
    initSubmit();
  }
};
