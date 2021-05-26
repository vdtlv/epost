'use strict';

import { TextLayer, ImageLayer, ShapeLayer } from '../base/layers.js';
import { generateLayerButton, generateBackgroundButton } from '../design/design-layer-buttons.js';

const smmLayerImageTemplate: HTMLTemplateElement = document.querySelector('#template-smm-picture') as HTMLTemplateElement;
const smmLayerTextTemplate: HTMLTemplateElement = document.querySelector('#template-smm-text') as HTMLTemplateElement;
const imageList = document.querySelector('.sub-card__image-list');
const textList = document.querySelector('.sub-card__text-list');
// const template = document.querySelector('.card__template');

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const X_TRANSLATE = 'translateX(-50%)';
const Y_TRANSLATE = 'translateY(-50%)';
const CENTER_TRANSLATE = 'translate(-50%, -50%)';

let imageCounter = 0;
let textCounter = 0;

export const renderBackgroundLayer = (color: string) => {
  generateBackgroundButton(color);
};

export const renderTextLayer = (template: TextLayer, isSMM: boolean) => {
  const layerElement = document.createElement('div');
  layerElement.classList.add('card__element');
  layerElement.classList.add('card__element--empty');
  layerElement.id = template.id;
  if(template.fontSize) {
    layerElement.style.fontSize = template.fontSize.toString();
  }
  if(template.fontColor) {
    layerElement.style.color = template.fontColor;
  }
  if(template.horAlign) {
    layerElement.style.textAlign = template.horAlign;
  }
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
  if(template.verAlign) {
    layerElement.style.alignItems = template.verAlign;
  }
  layerElement.style.fontSize = template.fontSize + 'px';
  renderCoordinatesSize(template, layerElement);

  if(isSMM) {
    if(smmLayerTextTemplate.content.querySelector('li')) {
      const textLayer = smmLayerTextTemplate.content.querySelector('li')!.cloneNode(true) as HTMLElement;
      const input: HTMLInputElement = textLayer.querySelector('input') as HTMLInputElement;
      const label: HTMLElement = textLayer.querySelector('label') as HTMLElement;
      textCounter++;
      input.value = 'Sample text #' + textCounter;
      label.textContent = 'Add text to text-field #' + textCounter;
      input.id = template.id;
      label.id = template.id;
      if(textList) {
        textList.appendChild(textLayer);
      }
      layerElement.textContent = input.value;
      input.addEventListener('input', () => {
        layerElement.textContent = input.value;
        layerElement.classList.remove('card__element--empty');
      });
    }
  } else {
    layerElement.textContent = template.content;
    generateLayerButton(template);
  }
  return layerElement;
};

export const renderImageLayer = (template: ImageLayer, isSMM: boolean) => {
  const layerElement = document.createElement('div');
  layerElement.classList.add('card__element');
  layerElement.id = template.id;
  layerElement.style.backgroundImage = 'url("img/default.png")';
  renderCoordinatesSize(template, layerElement);

  if(isSMM) {
    if(smmLayerImageTemplate.content.querySelector('li')) {
      const imageLayer = smmLayerImageTemplate.content.querySelector('li')!.cloneNode(true) as HTMLElement;
      const button: HTMLInputElement = imageLayer.querySelector('input') as HTMLInputElement;
      const label: HTMLLabelElement = imageLayer.querySelector('label') as HTMLLabelElement;
      imageCounter++;
      if(imageList) {
        imageList.appendChild(imageLayer);
      }
      button.setAttribute('id', template.id);
      label.htmlFor = button.id;
      label.addEventListener('click', () => {
        button.click();
      });
      label.textContent = 'Add picture #' + imageCounter;
      uploadImage(button, layerElement, label);
    }
  } else {
    layerElement.textContent = template.content;
    generateLayerButton(template);
  }

  return layerElement;
};

// надо попробовтаь сделать так, чтобы высчитывалось расстояние от середины, а не от края

export const renderShapeLayer = (template: ShapeLayer, isSMM: boolean) => {
  const layerElement = document.createElement('div');
  layerElement.classList.add('card__element');
  renderCoordinatesSize(template, layerElement);
  if(template.backgroundColor) {
    layerElement.style.backgroundColor = template.backgroundColor;
  }
  if(template.borderRadius) {
    layerElement.style.borderRadius = template.borderRadius + '%';
  }
  if(template.borderWidth) {
    layerElement.style.borderWidth = template.borderWidth + 'px';
    layerElement.style.borderStyle = 'solid';
    if(template.borderColor) {
      layerElement.style.borderColor = template.borderColor;
    }
  }
  if(!isSMM) {
    layerElement.id = template.id;
    layerElement.classList.add('card__element--shape');
    layerElement.textContent = template.content;
    generateLayerButton(template);
  } else {
    setTimeout(() => {
      renderCoordinatesSizeSMM(layerElement as thisHTMLElement);
    }, 0);

  }
  return layerElement;
};

export const renderCoordinatesSize = (template: TextLayer | ImageLayer | ShapeLayer, target: HTMLElement) => {
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

interface thisHTMLElement extends HTMLElement {
  getComputedStyle?: Function;
}

const renderCoordinatesSizeSMM = (target: thisHTMLElement) => {
  if(target) {
    const style = window.getComputedStyle(target);
    if(style) {
      const targetHeight = parseInt(target.style.height);
      const targetWidth = parseInt(target.style.width);

      const initTargetTop = parseInt(target.style.top);
      const initTargetLeft = parseInt(target.style.left);

      const toCenterTop = targetHeight/2 + initTargetTop;
      const toCenterLeft = targetWidth/2 + initTargetLeft;

      const furthestY = initTargetTop + targetHeight;
      const furthestX = initTargetLeft + targetWidth;

      if ((toCenterTop === 50) && (toCenterLeft === 50)) {
        target.style.top = '50%';
        target.style.left = '50%';
        target.style.transform = CENTER_TRANSLATE;
      } else {
        if((initTargetTop + targetHeight) > 100) {
          target.style.top = 'auto';
          target.style.bottom = '-' + (furthestY - 100) + '%';
        } else {
          if(toCenterTop === 50) {
            target.style.top = '50%';
            target.style.transform = Y_TRANSLATE;
          } else if (toCenterTop > 50) {
            target.style.top = 'auto';
            target.style.bottom = (100 - furthestY) + '%';
          }
        }

        if((initTargetLeft + targetWidth) > 100) {
          target.style.left = 'auto';
          target.style.right = '-' + (furthestX - 100) + '%';
        } else {
          if(toCenterLeft === 50) {
            target.style.left = '50%';
            target.style.transform = X_TRANSLATE;
          } else if (toCenterLeft > 50) {
            target.style.left = 'auto';
            target.style.right = (100 - furthestX) + '%';
          }
        }
      }
      target.style.width = style.width;
      target.style.height = style.height;
    }
  }
};

const setBackgroundImage = (preview: HTMLElement, reader: FileReader, label: HTMLElement) => {
  reader.addEventListener('load', () => {
    label.textContent = 'Change image';
    preview.style.backgroundImage = 'url(' + reader.result + ')';
  });
};

const uploadImage = (chooser: HTMLInputElement, preview: HTMLElement, label: HTMLElement) => {
  chooser.addEventListener('change', (evt) => {
    const file = chooser.files![0]!;
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((it) => {
      return fileName.endsWith(it);
    });
    if (matches) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      setBackgroundImage(preview, reader, label);
    } else {
      evt.preventDefault();
    }
  });
};
