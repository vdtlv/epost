'use strict';

import { generateLayerButton } from '../design/design-layer-buttons.js';

const smmLayerImageTemplate: HTMLTemplateElement = document.querySelector('#template-smm-picture');
const smmLayerTextTemplate: HTMLTemplateElement = document.querySelector('#template-smm-text');
const imageList = document.querySelector('.sub-card__image-list');
const textList = document.querySelector('.sub-card__text-list');

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

let imageCounter = 0;
let textCounter = 0;
let shapeCounter = 0;

export const renderTextLayer = (template, isSMM) => {
  const layerElement = document.createElement('div');
  layerElement.classList.add('card__element');
  layerElement.classList.add('card__element--empty');
  layerElement.id = template.id;
  layerElement.style.fontSize = template.fontSize;
  layerElement.style.textAlign = template.horAlign;
  switch (template.horAlign) {
    case "left":
      layerElement.style.justifyContent = 'flex-start';
      break;

    case "center":
      layerElement.style.justifyContent = 'center';
      break;

    case "right":
      layerElement.style.justifyContent = 'flex-end';
      break;
  };
  layerElement.style.alignItems = template.verAlign;
  layerElement.style.fontSize = template.fontSize + 'px';
  renderCoordinatesSize(template, layerElement);

  if(isSMM) {
    const textLayer = smmLayerTextTemplate.content.querySelector('li').cloneNode(true) as HTMLElement;
    const input: HTMLInputElement = textLayer.querySelector('input') as HTMLInputElement;
    const label = textLayer.querySelector('label');
    textCounter++;
    input.value = 'Sample text #' + textCounter;
    label.textContent = 'Add text to text-field #' + textCounter;
    input.id = template.id;
    label.id = template.id;
    textList.appendChild(textLayer);

    layerElement.textContent = input.value;

    input.addEventListener('input', () => {
      layerElement.textContent = input.value;
      layerElement.classList.remove('card__element--empty');
    });
  } else {
    layerElement.textContent = template.content;
    console.log('imhere');
    generateLayerButton(template);
  }

  console.log(layerElement);
  return layerElement;
};

export const renderImageLayer = (template, isSMM) => {
  const layerElement = document.createElement('div');
  layerElement.classList.add('card__element');
  layerElement.id = template.id;
  layerElement.style.backgroundImage = 'url("img/default.png")';
  renderCoordinatesSize(template, layerElement);

  if(isSMM) {
    const imageLayer = smmLayerImageTemplate.content.querySelector('li').cloneNode(true) as HTMLElement;
    const button: HTMLInputElement = imageLayer.querySelector('input') as HTMLInputElement;
    const label = imageLayer.querySelector('label');
    imageCounter++;
    imageList.appendChild(imageLayer);
    button.setAttribute('id', template.id);
    label.htmlFor = button.id;
    label.addEventListener('click', () => {
      button.click();
    });
    label.textContent = 'Add picture #' + imageCounter;
    uploadImage(button, layerElement, label);
  } else {
    layerElement.textContent = template.content;
    generateLayerButton(template);
  }

  return layerElement;
};

export const renderShapeLayer = (template, isSMM) => {
  const layerElement = document.createElement('div');
  layerElement.classList.add('card__element');
  layerElement.classList.add('card__element--shape');
  renderCoordinatesSize(template, layerElement);
  if(template.borderWidth) {
    layerElement.style.borderWidth = template.borderWidth + 'px';
    layerElement.style.borderStyle = 'solid';
    if(template.borderColor) {
      layerElement.style.borderColor = template.borderColor;
    }
  }
  if(template.borderRadius) {
    layerElement.style.borderRadius = template.borderRadius + '%';
  }
  if(template.backgroundColor) {
    layerElement.style.backgroundColor = template.backgroundColor;
  }
  if(!isSMM) {
    layerElement.id = template.id;
    layerElement.textContent = template.content;
    generateLayerButton(template);
  }
  return layerElement;
};

export const renderCoordinatesSize = (template, target) => {
  console.log(template);
  if(template.x) {
    target.style.left = template.x + '%';
  }
  if(template.y) {
    target.style.top = template.y + '%';
  }
  if(template.width) {
    target.style.width = template.width + '%';
  }
  if(template.height) {
    target.style.height = template.height + '%';
  }
};

const setBackgroundImage = (chooser, preview, reader, label) => {
  reader.addEventListener('load', () => {
    label.textContent = 'Change image';
    preview.style.backgroundImage = 'url(' + reader.result + ')';
  });
};

const uploadImage = (chooser, preview, label) => {
  chooser.addEventListener('change', (evt) => {
    const file = chooser.files[0];
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((it) => {
      return fileName.endsWith(it);
    });
    if (matches) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      if (preview.src) {
        reader.addEventListener('load', () => {
          preview.src = reader.result;
        });
      } else {
        setBackgroundImage(chooser, preview, reader, label);
      }
    } else {
      evt.preventDefault();
    }
  });
};
