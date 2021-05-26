'use strict';

import { templateData } from '../base/template.js';

const aspectRatioButtons = document.querySelectorAll('.aspect-ratio__button');
const template = document.querySelector('.card__template');
let aspectRatio = '';

export const initAspectRatioChange = () => {
  if(template) {
    if(aspectRatioButtons.length) {
      aspectRatioButtons.forEach((button) => {
        button.addEventListener('click', () => {
          template.classList.remove(template.classList[1]!);
          template.classList.add('card__template--' + (button as HTMLInputElement).value);
          aspectRatio = (button as HTMLInputElement).value;
        });
      })
    }
  }
};

export const initAspectRatio = (template: templateData) => {
  if(template) {
    aspectRatio = template.ratio!;
    if(aspectRatioButtons.length) {
      aspectRatioButtons.forEach((button) => {
        if((button as HTMLInputElement).value === aspectRatio) {
          (button as HTMLInputElement).checked = true;
        }
      });
    }
  }
};

export const getAspectRatio = () => aspectRatio;
