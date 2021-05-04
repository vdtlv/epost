'use strict';

import { templateData } from '../base/template.js';
import { createNewTemplateObject } from './design-editor-new-object.js';
import { getCurrent } from './design-editor.js';

// Обращается к локалсторедж и, в зависимости от результата, устанавливает объект шаблона
export const setTemplateObject = () => {
  let currentID: string = "";
  if(localStorage.getItem('currentID')) {
    currentID = JSON.parse(localStorage.getItem('currentID')!);
    localStorage.removeItem('currentID');
  }
  let currentTemplate: templateData | undefined = undefined;
  if(localStorage.getItem('currentObject')) {
    currentTemplate = JSON.parse(localStorage.getItem('currentObject')!);
    localStorage.removeItem('currentObject');
  }
  if(currentID) {
    getCurrent().isNewTemplate = true;
    getCurrent().templateObject = createNewTemplateObject(currentID);
  }
  if(currentTemplate) {
    getCurrent().isNewTemplate = false;
    getCurrent().templateObject = currentTemplate;
  }
};
