'use strict';

import { renderTextLayer, renderImageLayer, renderShapeLayer } from '../base/render-layers.js';
import { templateData } from '../base/template.js';
import { TextLayer, ImageLayer, ShapeLayer } from '../base/layers.js'


const pageID = document.querySelector('.smm-editor');

const templateElement: HTMLElement = document.querySelector('.card__template') as HTMLElement;
const createButton = document.querySelector('#create');
const saveButton: HTMLAnchorElement = document.querySelector('#save') as HTMLAnchorElement;
const nameField = document.querySelector('#smm-name');
const imageList: HTMLElement = document.querySelector('.sub-card__image-list') as HTMLElement;
const textList: HTMLElement = document.querySelector('.sub-card__text-list') as HTMLElement;

const setTemplateObject = () => {
  if(localStorage.getItem('currentObject')) {
    const currentTemplate = JSON.parse(localStorage.getItem('currentObject')!);
    localStorage.removeItem('currentObject');
    const templateObject = currentTemplate;
    setStartingInfo(templateObject);
  }
};

const setStartingInfo = (templateObject: templateData) => {
  if(templateElement) {
    templateElement.classList.add('card__template--' + templateObject.ratio);
    templateElement.style.backgroundColor = templateObject.background;
  }
  if(nameField) {
    nameField.textContent = templateObject.name!;
  }
  const shapeLayers = templateObject.shapeLayers;
  shapeLayers.forEach((shapeLayer: ShapeLayer) => {
    const shapeLayerElement = renderShapeLayer(shapeLayer, true);
    templateElement.appendChild(shapeLayerElement);
  });
  const imageLayers = templateObject.imageLayers;
  imageLayers.forEach((imageLayer: ImageLayer) => {
    const imageLayerElement = renderImageLayer(imageLayer, true);
    templateElement.appendChild(imageLayerElement);
  });
  const textLayers = templateObject.textLayers;
  textLayers.forEach((textLayer: TextLayer) => {
    const textLayerElement = renderTextLayer(textLayer, true);
    templateElement.appendChild(textLayerElement);
  });
};

const onCreateClick = () => {
  if(createButton) {
    createButton.addEventListener('click', () => {
      const json = {
        html: (templateElement.parentNode as HTMLElement).innerHTML,
        css: ".card__template{background-color:#ffffff;position:relative;overflow:hidden;}.card__template--1x1{width:215px;height:215px;}.card__template--2x1{width:215px;height:108px;}.card__template--4x3{width:215px;height:162px;}.card__template--9x16{width:120px;height:215px;}.card__template--16x9{width:215px;height:120px;}.card__element{position:absolute;pointer-events:none;line-height:normal;text-align:center;display:flex;align-items:center;justify-content:center;background-repeat:no-repeat;background-size:cover;background-position:center;overflow-wrap:break-word;"
      };

      const username = "83b5ee95-729e-4d21-bd63-62011ebd797d";
      const password = "34acb2ad-1978-49f8-8ad3-6f5b2cd6b897";

      const options = {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(username + ":" + password)
        }
      }

      fetch('https://hcti.io/v1/image', options)
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            return Promise.reject(res.status);
          }
        })
        .then(data => {
          saveButton.href = data.url + '.png';
        })
        .catch(err => console.error(err));
        setTimeout(() => {
          createButton.classList.add('hidden');
          imageList.classList.add('hidden');
          textList.classList.add('hidden');
          saveButton.classList.remove('hidden');
        }, 500)
    });
  }
};

export const initSMMEditor = () => {
  if(pageID) {
    setTemplateObject();
    onCreateClick();
  }
};
