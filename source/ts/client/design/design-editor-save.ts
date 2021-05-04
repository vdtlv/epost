'use strict';

import { templateData } from '../base/template.js';
import { getCurrent } from './design-editor.js';

const submitButton : HTMLButtonElement = document.querySelector('#submit') as HTMLButtonElement;

export const initSubmit = () => {
  if(localStorage.getItem('userEmail')) {
    const userEmail = JSON.parse(localStorage.getItem('userEmail') as string);
    if(userEmail) {
      if(submitButton) {
        submitButton.addEventListener('click', () => {
          postTemplate(userEmail, getCurrent().templateObject!, getCurrent().isNewTemplate!);
          localStorage.removeItem('userTemplates');
          setTimeout(() => {
            window.location.href = 'design-catalog';
          }, 300)
        });
      }
    }
  }
};

 const postTemplate = (userEmail: string, templateObject: templateData, isNewTemplate: boolean) => {
  const data = JSON.stringify({
      email: userEmail,
      template: templateObject
    });
  const options = {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      'charset': 'utf-8'
    },
    body: data
  };
  if(isNewTemplate) {
    fetch('/design-editor-new', options);
  } else {
    fetch('/design-editor-old', options);
  }
};
