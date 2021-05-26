'use strict';

import { renderTextLayer, renderImageLayer, renderShapeLayer } from '../base/render-layers.js';
import { templateData } from '../base/template.js';
// import { TextLayer, ImageLayer, ShapeLayer } from '../base/layers.js'

import { initAspectRatio, initAspectRatioChange, getAspectRatio } from '../smm/smm-editor-aspect-ratio.js';


const pageID = document.querySelector('.smm-editor');

const templateElement: HTMLElement = document.querySelector('.card__template') as HTMLElement;
const downloadList: HTMLUListElement = document.querySelector('.sub-card__download-buttons-list') as HTMLUListElement;
const saveButton = document.querySelector('#create');
const nameField = document.querySelector('#smm-name');
const downloadAllButton = document.querySelector('#download-all');
const downloadButtonTemplate: HTMLTemplateElement = document.querySelector('#template-download-button') as HTMLTemplateElement;
// const imageList: HTMLElement = document.querySelector('.sub-card__image-list') as HTMLElement;
// const textList: HTMLElement = document.querySelector('.sub-card__text-list') as HTMLElement;

const setTemplateObject = () => {
  if(localStorage.getItem('currentObject')) {
    const currentTemplate = JSON.parse(localStorage.getItem('currentObject')!);
    initAspectRatio(currentTemplate);
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
  const layers = templateObject.layers;
    layers.forEach((layer) => {
    const layerType = layer.charAt(0);
    switch (layerType) {
      case "t":
        if(templateObject.textLayers) {
          for (let i = 0; i < templateObject.textLayers.length; i++) {
            if(layer === templateObject.textLayers[i]!.id) {
              const layerObject = templateObject.textLayers[i]!;
              const textLayerElement = renderTextLayer(layerObject, true);
              templateElement.appendChild(textLayerElement);
            }
          }
        }
        break;

      case "i":
        if(templateObject.textLayers) {
          for (let i = 0; i < templateObject.imageLayers.length; i++) {
            if(layer === templateObject.imageLayers[i]!.id) {
              const layerObject = templateObject.imageLayers[i]!;
              const imageLayerElement = renderImageLayer(layerObject, true);
              templateElement.appendChild(imageLayerElement);
            }
          }
        }
        break;

      case "s":
        if(templateObject.textLayers) {
          for (let i = 0; i < templateObject.shapeLayers.length; i++) {
            if(layer === templateObject.shapeLayers[i]!.id) {
              const layerObject = templateObject.shapeLayers[i]!;
              const shapeLayerElement = renderShapeLayer(layerObject, true);
              templateElement.appendChild(shapeLayerElement);
            }
          }
        }
        break;
    }
  });
};

const createDownloadButton = (link: string) => {
  if(downloadButtonTemplate.content.querySelector('li')) {
    const buttonItem = downloadButtonTemplate.content.querySelector('li')!.cloneNode(true);
    const button = (buttonItem as HTMLElement).querySelector('a') as HTMLAnchorElement;
    const aspectRatio = getAspectRatio();
    button.textContent = `Download ${aspectRatio}`;
    button.href = link + '.png';
    setTimeout(() => {
      downloadList.appendChild(buttonItem);
      const addedLinks = downloadList.querySelectorAll('.download-link');
      if(addedLinks.length === 2) {
        showDownloadAll();
      }
    }, 500);
  }
};

const onSaveClick = () => {
  if(saveButton) {
    saveButton.addEventListener('click', () => {
      const json = {
        html: (templateElement.parentNode as HTMLElement).innerHTML,
        css: ".card__template{font-family:'Inter','Arial',sans-serif;background-color:#ffffff;position:relative;overflow:hidden;}.card__template--1x1{width:214px;height:214px;}.card__template--2x1{width:214px;height:108px;}.card__template--3x2{width:214px;height:143px;}.card__template--4x3{width:214px;height:162px;}.card__template--9x16{width:120px;height:214px;}.card__template--16x9{width:214px;height:120px;}.card__element{position:absolute;pointer-events:none;line-height:normal;text-align:center;display:flex;align-items:center;justify-content:center;background-repeat:no-repeat;background-size:cover;background-position:center;overflow-wrap:break-word;width:30%;height:30%;box-sizing:border-box}"
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
          createDownloadButton(data.url);
        })
        .catch(err => console.error(err));
    });
  }
};

const showDownloadAll = () => {
  if(downloadAllButton) {
    downloadAllButton.classList.add('download-all--show');
    downloadAllButton.addEventListener('click', () => {
      const downloadLinks = document.querySelectorAll('.download-link') as NodeListOf <HTMLAnchorElement>;
      downloadLinks.forEach((link) => {
        setTimeout(() => {
          link.click();
        }, 0);
      })
    });
  }
};

export const initSMMEditor = () => {
  if(pageID) {
    setTemplateObject();
    onSaveClick();
    initAspectRatioChange();
  }
};
