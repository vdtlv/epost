'use strict';

import { generateLayerButton } from './design-layer-buttons.js';
import { renderTextLayer, renderImageLayer, renderShapeLayer } from '../base/render-layers.js';
import { BackgroundLayer, TextLayer, ImageLayer, ShapeLayer } from '../base/layers.js';
import { templateData } from '../base/template.js';

const pageID = document.querySelector('.design-editor');

const overlay : HTMLElement = document.querySelector('.overlay');
const startMenu = document.querySelector('.card__layers-and-add');
const popup = document.querySelector('#template-popup');
const addButton = document.querySelector('#add-layer');
const editorTabs = document.querySelectorAll('.sub-card');
const tabsButtons = document.querySelectorAll('.tab-button');
const templateElement: HTMLElement = document.querySelector('.card__template') as HTMLElement;
const submitButton : HTMLButtonElement = document.querySelector('#submit') as HTMLButtonElement;
const nameInput : HTMLInputElement = document.querySelector('#template-name');

const HEX_REG_EX = new RegExp('^#(?:[0-9a-fA-F]{3}){1,2}$');
const ERROR_MESSAGE_BACKGROUND : string = 'Wrong format!';
const DEFAULT_BACKGROUND : string = '#ffffff';
const DEFAULT_BACKGROUND_SHAPE : string = 'transparent';
const DEFAULT_BORDER_SHAPE : string = '#000000';

const backgroundTab = document.querySelector('#background');
const textTab = document.querySelector('#text-layer');
const imageTab = document.querySelector('#image-layer');
const shapeTab = document.querySelector('#shape-layer');

// const userEmail = JSON.parse(localStorage.getItem('userEmail'));

let templateObject;
let currentBackButton;
let currentDoneButton;
let currentForm;
let isNewTemplate : boolean;

let currentLayerObject;
let currentLayerElement;
let tempLayerObject;
let tempLayerElement;
let isNewLayer : boolean;
let textLayersIterator : number = 0;
let imageLayersIterator : number = 0;
let shapeLayersIterator : number = 0;

export const getTextLayersIterator = () => textLayersIterator;
export const getImageLayersIterator = () => imageLayersIterator;
export const getShapeLayersIterator = () => shapeLayersIterator;
export const getCurrentLayerObject = () => currentLayerObject;
export const getTemplateObject = () => templateObject;

// Создаёт объект, с которым будет вестись работа - или загружает старый из localStorage
const setTemplateObject = () => {
  const currentID = JSON.parse(localStorage.getItem('currentID'));
  localStorage.removeItem('currentID');
  const currentTemplate = JSON.parse(localStorage.getItem('currentObject'));
  localStorage.removeItem('currentObject');
  console.log(currentID);
  console.log(currentTemplate);
  const allBaseTemplates = JSON.parse(localStorage.getItem('templateBase'));
  if(currentID) {
    isNewTemplate = true;
    templateObject = new templateData();
    const firstIDCharacter = currentID.charAt(0);
    if(allBaseTemplates) {
      let neededCategory;
      switch (firstIDCharacter) {
        case "i":
          neededCategory = 'Instagram';
          break;

        case "f":
          neededCategory = 'Facebook';
          break;

        case "v":
          neededCategory = 'VK';
          break;

        case "t":
          neededCategory = 'Twitter';
          break;

        case "y":
          neededCategory = 'YouTube';
          break;
      }
      templateObject.social = neededCategory;
      allBaseTemplates.forEach(baseTemplate => {
        if(baseTemplate.id === neededCategory) {
          baseTemplate.data.forEach(template => {
            if(template.id === currentID) {
              templateObject.name = `${templateObject.social} ${template.type}`;
              templateObject.type = template.type;
              templateObject.width = template.width;
              templateObject.height = template.height;
              templateObject.ratio = template.ratio;
            }
          })
        }
      });
    }
  }
  if(currentTemplate) {
    isNewTemplate = false;
    templateObject = currentTemplate;
  }
};

const setStartingInfo = () => {
  if(templateElement) {
    templateElement.classList.add('card__template--' + templateObject.ratio);
    templateElement.style.backgroundColor = templateObject.background;
  }
  if(nameInput) {
    nameInput.value = templateObject.name;
  }
  const textLayers = templateObject.textLayers;
  textLayers.forEach((textLayer) => {
    textLayersIterator++;
    const textLayerElement = renderTextLayer(textLayer, false);
    templateElement.appendChild(textLayerElement);
  });
  const imageLayers = templateObject.imageLayers;
  imageLayers.forEach((imageLayer) => {
    imageLayersIterator++;
    imageLayer.content = 'Image layer #' + imageLayersIterator;
    const imageLayerElement = renderImageLayer(imageLayer, false);
    templateElement.appendChild(imageLayerElement);
  });
  const shapeLayers = templateObject.shapeLayers;
  shapeLayers.forEach((shapeLayer) => {
    shapeLayersIterator++;
    shapeLayer.content = 'Shape layer #' + shapeLayersIterator;
    const shapeLayerElement = renderShapeLayer(shapeLayer, false);
    templateElement.appendChild(shapeLayerElement);
  });
};

// Все для работы с вкладками меню шаблонов дизайна

const toggleBetweenMenus = (menu1, menu2) => {
  menu1.classList.toggle('hidden');
  menu2.classList.toggle('hidden');
};

const initNameInput = () => {
  if(nameInput) {
    nameInput.addEventListener('input', () => {
      templateObject.name = nameInput.value;
    });
  }
};

const initEditorPopup = () => {
  if(addButton) {
    if(popup) {
       addButton.addEventListener('click', () => {
        overlay.classList.remove('hidden');
        overlay.addEventListener('click', closePopup);
        popup.classList.add('popup');
        popup.classList.remove('hidden');
      });
    }
  }
};

const closePopup = () => {
  const popup : HTMLElement = document.querySelector('.popup');
  if(popup) {
    popup.classList.add('hidden');
    popup.classList.remove('popup');
    overlay.classList.add('hidden');
    overlay.removeEventListener('click', closePopup);
  }
};

const initEditorTabButtons = () => {
  if(tabsButtons) {
    tabsButtons.forEach((tabsButton: HTMLElement) => {
      for (let i = 0; i < editorTabs.length; i++) {
        if (editorTabs[i].id === tabsButton.dataset.tab) {
          tabsButton.addEventListener('click', () => {
            closePopup();
            switch (tabsButton.dataset.tab) {
              case 'background':
                openBackgroundTab();
                break;

              case 'text-layer':
                openTextTab();
                break;

              case 'image-layer':
                openImageTab();
                break;

              case 'shape-layer':
                openShapeTab();
                break;
            }
          });
        }
      }
    });
  }
};

const openEditorTab = (tab) => {
  if(startMenu) {
    if(tab) {
      toggleBetweenMenus(tab, startMenu);
    }
  }
};

const closeEditorTab = () => {
  const tab = document.querySelector('.sub-card:not(.hidden)');
  currentForm.reset();
  currentBackButton.removeEventListener('click', onBackButtonClick);
  const tabID = tab.id;
  switch (tabID) {
    case 'background':
      currentDoneButton.removeEventListener('click', onDoneBackgroundClick);
      break;

    case 'text-layer':
      currentDoneButton.removeEventListener('click', onDoneTextLayerClick);
      break;

    case 'image-layer':
      currentDoneButton.removeEventListener('click', onDoneImageLayerClick);
      break;

    case 'shape-layer':
      currentDoneButton.removeEventListener('click', onDoneShapeLayerClick);
      break;
  };
  openEditorTab(tab);
};

const onBackButtonClick = () => {
  if (isNewLayer) {
    templateElement.lastChild.remove();
  } else {
    const activeLayers = templateElement.querySelectorAll('div');
    for (let i = 0; i < activeLayers.length; i++) {
      if (activeLayers[i].id === currentLayerObject.id) {
        console.log(currentLayerObject);
        console.log(tempLayerObject);
        currentLayerObject = tempLayerObject;
        console.log(currentLayerObject);
        console.log(tempLayerObject);
        currentLayerObject = JSON.parse(JSON.stringify(tempLayerObject));
        console.log(currentLayerObject);
        console.log(tempLayerObject);
        activeLayers[i].replaceWith(tempLayerElement);
      }
    currentForm.reset();
    }
  }
  closeEditorTab();
};

// Все для открытия/закрытия вкладок конкретных слоев

export const openBackgroundTab = (layer? : BackgroundLayer) => {
  if(backgroundTab) {
    currentForm = backgroundTab.querySelector('form');
    currentDoneButton = backgroundTab.querySelector('.sub-card__done-button');
    currentDoneButton.addEventListener('click', onDoneBackgroundClick);
    currentBackButton = backgroundTab.querySelector('.sub-card__back-button');
    currentBackButton.addEventListener('click', onBackButtonClick);
    openEditorTab(backgroundTab);
    if (layer) {
      isNewLayer =  false;
      currentLayerObject = layer;
      const backgroundInput : HTMLInputElement = document.querySelector('#design-background');
      backgroundInput.value = currentLayerObject.color;
    } else {
      isNewLayer = true;
      currentLayerObject = new BackgroundLayer();
    }
  }
};

export const openTextTab = (layer? : TextLayer) => {
  if(textTab) {
    currentForm = textTab.querySelector('form');
    currentDoneButton = textTab.querySelector('.sub-card__done-button');
    currentBackButton = textTab.querySelector('.sub-card__back-button');
    currentBackButton.addEventListener('click', onBackButtonClick);
    openEditorTab(textTab);
    if (layer) {
      isNewLayer =  false;
      const activeLayers = templateElement.querySelectorAll('div');
      for (let i = 0; i < activeLayers.length; i++) {
        if (activeLayers[i].id === layer.id) {
          tempLayerObject = JSON.parse(JSON.stringify(layer));
          tempLayerElement = activeLayers[i].cloneNode(true) as HTMLElement;
        }
      }
      currentLayerObject = layer;
      onEditLayer(textTab, currentLayerObject);
      const fontSizeInput : HTMLInputElement = document.querySelector('#design-text-font-size');
      if (currentLayerObject.fontSize) {
        fontSizeInput.value = currentLayerObject.fontSize;
      }
      // const fontFamilyInput : HTMLInputElement = document.querySelector('#design-text-font-family');
      // if (currentLayerObject.fontFamily) {
      //   fontFamilyInput.value = currentLayerObject.fontFamily;
      // }
    } else {
      isNewLayer = true;
      currentLayerObject = new TextLayer();
      const newTextElement = document.createElement('div');
      newTextElement.classList.add('card__element');
      newTextElement.classList.add('card__element--empty');
      newTextElement.id = currentLayerObject.id;
      currentLayerObject.content += (' #' + (textLayersIterator + 1).toString());
      newTextElement.textContent = currentLayerObject.content;
      currentLayerElement = newTextElement;
    }
    templateElement.appendChild(currentLayerElement);
    currentDoneButton.addEventListener('click', onDoneTextLayerClick);
  }
};

export const openImageTab = (layer? : ImageLayer) => {
  if(imageTab) {
    currentForm = imageTab.querySelector('form');
    currentDoneButton = imageTab.querySelector('.sub-card__done-button');
    currentBackButton = imageTab.querySelector('.sub-card__back-button');
    currentBackButton.addEventListener('click', onBackButtonClick);
    openEditorTab(imageTab);
    if (layer) {
      currentLayerObject = layer;
      onEditLayer(imageTab, currentLayerObject);
    } else {
      isNewLayer = true;
      currentLayerObject = new ImageLayer();
      const newImageElement = document.createElement('div');
      newImageElement.classList.add('card__element');
      newImageElement.id = currentLayerObject.id;
      newImageElement.textContent = currentLayerObject.content + ' #' + (imageLayersIterator + 1).toString();
      newImageElement.style.backgroundImage = 'url("img/default.png")';
      currentLayerElement = newImageElement;
    }
    templateElement.appendChild(currentLayerElement);
    currentDoneButton.addEventListener('click', onDoneImageLayerClick);
  }
};

export const openShapeTab = (layer? : ShapeLayer) => {
  if(shapeTab) {
    currentForm = shapeTab.querySelector('form');
    currentDoneButton = shapeTab.querySelector('.sub-card__done-button');
    currentBackButton = shapeTab.querySelector('.sub-card__back-button');
    currentBackButton.addEventListener('click', onBackButtonClick);
    openEditorTab(shapeTab);
    if (layer) {
      currentLayerObject = layer;
      onEditLayer(shapeTab, currentLayerObject);
    } else {
      isNewLayer = true;
      currentLayerObject = new ShapeLayer();
      const newShapeElement = document.createElement('div');
      newShapeElement.classList.add('card__element');
      newShapeElement.id = currentLayerObject.id;
      newShapeElement.classList.add('card__element--shape');
      newShapeElement.textContent = 'Shape #' + (shapeLayersIterator + 1);
      currentLayerElement = newShapeElement;
    }
    templateElement.appendChild(currentLayerElement);
    currentDoneButton.addEventListener('click', onDoneShapeLayerClick);
  }
};

const onEditLayer = (tab, currentLayerObject) => {
  isNewLayer = false;
  const activeLayers = templateElement.querySelectorAll('div');
  for (let i = 0; i < activeLayers.length; i++) {
    if (activeLayers[i].id === currentLayerObject.id) {
      tempLayerObject = JSON.parse(JSON.stringify(currentLayerObject));
      tempLayerElement = activeLayers[i].cloneNode(true) as HTMLElement;
      currentLayerElement = activeLayers[i];
    }
  }
  const xInput : HTMLInputElement = tab.querySelector('.design-x');
  const yInput : HTMLInputElement = tab.querySelector('.design-y');
  const widthInput : HTMLInputElement = tab.querySelector('.design-width');
  const heightInput : HTMLInputElement = tab.querySelector('.design-height');
  if (currentLayerObject.x) {
    xInput.value = currentLayerObject.x;
  }
  if (currentLayerObject.y) {
    yInput.value = currentLayerObject.y;
  }
  if (currentLayerObject.width) {
    widthInput.value = currentLayerObject.width;
  }
  if (currentLayerObject.height) {
    heightInput.value = currentLayerObject.height;
  }
  if (currentLayerObject.fontSize) {
    const fontSizeInput : HTMLInputElement = tab.querySelector('.design-font-size');
    fontSizeInput.value = currentLayerObject.fontSize;
  }
  if (currentLayerObject.horAlign) {
    const horAlignInputs = tab.querySelectorAll('.design-horizontal-align');
    horAlignInputs.forEach((input) => {
      if(input.value === currentLayerObject.horAlign) {
        input.checked = true;
      }
    });
  }
  if (currentLayerObject.verAlign) {
    const verAlignInputs = tab.querySelectorAll('.design-vertical-align');
    verAlignInputs.forEach((input) => {
      if(input.value === currentLayerObject.verAlign) {
        input.checked = true;
      }
    });
  }
  if (currentLayerObject.backgroundColor) {
    const backgroundColorInput : HTMLInputElement = tab.querySelector('.design-background');
    backgroundColorInput.value = currentLayerObject.backgroundColor;
  }
  if (currentLayerObject.borderColor) {
    const borderColorInput : HTMLInputElement = tab.querySelector('.design-border-color');
    borderColorInput.value = currentLayerObject.borderColor;
  }
  if (currentLayerObject.borderWidth) {
    const borderWidthInput : HTMLInputElement = tab.querySelector('.design-border-width');
    borderWidthInput.value = currentLayerObject.borderWidth;
  }
  if (currentLayerObject.borderRadius) {
    const borderRadiusInput : HTMLInputElement = tab.querySelector('.design-border-radius');
    borderRadiusInput.value = currentLayerObject.borderRadius;
  }
};


const onDoneBackgroundClick = () => {
  if(currentLayerObject.color) {
    if (currentLayerObject.color.match(HEX_REG_EX)) {
      templateObject.background = currentLayerObject.color;
      if (isNewLayer) {
        generateLayerButton(currentLayerObject);
      }
      const backgroundButton: HTMLButtonElement = document.querySelector('#background-button') as HTMLButtonElement;
      if(backgroundButton) {
        backgroundButton.disabled = true;
      }
    }
  }
  currentDoneButton.removeEventListener('click', onDoneBackgroundClick);
  console.log(templateObject);
  closeEditorTab();
};

const onDoneTextLayerClick = () => {
  if (isNewLayer) {
    templateObject.textLayers.push(currentLayerObject);
    templateObject.layers.push(currentLayerObject.id);
    textLayersIterator++;
    generateLayerButton(currentLayerObject);
  } else {
    for (let i = 0; i < templateObject.textLayers.length; i++) {
      if (templateObject.textLayers[i].id === currentLayerObject.id) {
        templateObject.textLayers[i] = currentLayerObject;
      }
    }
  }
  currentDoneButton.removeEventListener('click', onDoneTextLayerClick);
  console.log(templateObject);
  closeEditorTab();
};

const onDoneImageLayerClick = () => {
  if (isNewLayer) {
    templateObject.imageLayers.push(currentLayerObject);
    templateObject.layers.push(currentLayerObject.id);
    imageLayersIterator++;
    generateLayerButton(currentLayerObject);
  } else {
    for (let i = 0; i < templateObject.textLayers.length; i++) {
      if (templateObject.imageLayers[i].id === currentLayerObject.id) {
        templateObject.imageLayers[i] = currentLayerObject;
      }
    }
  }
  currentDoneButton.removeEventListener('click', onDoneImageLayerClick);
  console.log(templateObject);
  closeEditorTab();
};

const onDoneShapeLayerClick = () => {
  if (isNewLayer) {
    console.log(templateObject.shapeLayers);
    templateObject.shapeLayers.push(currentLayerObject);
    console.log(templateObject.shapeLayers);
    templateObject.layers.push(currentLayerObject.id);
    shapeLayersIterator++;
    generateLayerButton(currentLayerObject);
  } else {
    for (let i = 0; i < templateObject.textLayers.length; i++) {
      if (templateObject.shapeLayers[i].id === currentLayerObject.id) {
        templateObject.shapeLayers[i] = currentLayerObject;
      }
    }
  }
  currentDoneButton.removeEventListener('click', onDoneShapeLayerClick);
  console.log(templateObject);
  closeEditorTab();
};

const initEditorTabsInput = () => {
  initBackgroundInput();
  initTextInputs();
  initImageInputs();
  initShapeInputs();
};

// //

// // Вкладка фона
const initBackgroundInput = () => {
  if(backgroundTab) {
    const backgroundInput : HTMLInputElement = backgroundTab.querySelector('#design-background');
    backgroundInput.addEventListener('input', () => {
      if (backgroundInput.value.match(HEX_REG_EX)) {
        backgroundInput.setCustomValidity('');
        currentLayerObject.color = backgroundInput.value;
        templateElement.style.backgroundColor = backgroundInput.value;
      } else {
        currentLayerObject.color = DEFAULT_BACKGROUND;
        templateElement.style.backgroundColor = DEFAULT_BACKGROUND;
        backgroundInput.setCustomValidity(ERROR_MESSAGE_BACKGROUND);
        backgroundInput.reportValidity();
      }
    });
  }
};

// //

// Вкладка текста
const initTextInputs = () => {
  if(textTab) {
    initSizeInputs(textTab);
    initCoordinatesInputs(textTab);
    const fontSizeInput : HTMLInputElement = textTab.querySelector('.design-font-size');
    const hAlignInputs = textTab.querySelectorAll('.design-horizontal-align');
    const vAlignInputs = textTab.querySelectorAll('.design-vertical-align');
    if (fontSizeInput) {
      fontSizeInput.addEventListener('input', () => {
        currentLayerObject.fontSize = fontSizeInput.value;
        currentLayerElement.style.fontSize = fontSizeInput.value + 'px';
      });
    }
    if (hAlignInputs) {
      hAlignInputs.forEach((input: HTMLInputElement) => {
        console.log(111);
        input.addEventListener('change', () => {
          currentLayerObject.horAlign = input.value;
          switch (input.value) {
            case "left":
              currentLayerElement.style.justifyContent = 'flex-start';
              break;

            case "center":
              currentLayerElement.style.justifyContent = 'center';
              break;

            case "right":
              currentLayerElement.style.justifyContent = 'flex-end';
              break;
          }
          currentLayerElement.style.textAlign = input.value;
        });
      });
    }
    if (vAlignInputs) {
      vAlignInputs.forEach((input: HTMLInputElement) => {
        console.log(222);
        input.addEventListener('change', () => {
          currentLayerObject.verAlign = input.value;
          currentLayerElement.style.alignItems = input.value;
        });
      });
    }
    // const fontFamilyInput : HTMLInputElement = textTab.querySelector('#design-text-font-family');
    // if (fontFamilyInput) {
    //   fontFamilyInput.addEventListener('input', () => {
    //     currentLayerObject.fontFamily = fontFamilyInput.value;
    //     currentLayerElement.style.fontFamily = fontFamilyInput.value;
    //   });
    // }
  }
};

// //

// Вкладка изображения
const initImageInputs = () => {
  if(imageTab) {
    initSizeInputs(imageTab);
    initCoordinatesInputs(imageTab);
  }
};
//

const initShapeInputs = () => {
  if(shapeTab) {
    initSizeInputs(shapeTab);
    initCoordinatesInputs(shapeTab);
    const backgroundInput : HTMLInputElement = shapeTab.querySelector('.design-background');
    const borderColorInput : HTMLInputElement = shapeTab.querySelector('.design-border-color');
    const borderWidthInput : HTMLInputElement = shapeTab.querySelector('.design-border-width');
    const borderRadiusInput : HTMLInputElement = shapeTab.querySelector('.design-border-radius');
    if(backgroundInput) {
      initShapeColorsInputs(backgroundInput, false);
    }
    if(borderColorInput) {
      initShapeColorsInputs(borderColorInput, true);
    }
    if(borderWidthInput) {
      borderWidthInput.addEventListener('input', () => {
        if(borderWidthInput.value) {
          if(parseInt(borderWidthInput.value) < 0) {
            borderWidthInput.value = '0';
          }
          currentLayerObject.borderWidth = borderWidthInput.value;
          currentLayerElement.style.borderWidth = borderWidthInput.value + 'px';
          currentLayerElement.style.borderStyle = 'solid';
        } else {
          currentLayerObject.borderWidth = '0';
          currentLayerElement.style.removeProperty('border-width');
          currentLayerElement.style.removeProperty('border-style');
        }
      });
    }
    if(borderRadiusInput) {
      borderRadiusInput.addEventListener('input', () => {
        if(borderRadiusInput.value) {
          if(parseInt(borderRadiusInput.value) < 0) {
            borderRadiusInput.value = '0';
          } else if (parseInt(borderRadiusInput.value) > 50) {
            borderRadiusInput.value = '50';
          }
          currentLayerObject.borderRadius = borderRadiusInput.value;
          currentLayerElement.style.borderRadius = borderRadiusInput.value + '%';
        } else {
          currentLayerObject.x = '0';
          currentLayerElement.style.removeProperty('border-radius');
        }
      });
    }
  }
};

const initShapeColorsInputs = (input, isBorder) => {
  input.addEventListener('input', () => {
    if (input.value.match(HEX_REG_EX)) {
      input.setCustomValidity('');
      if(isBorder) {
        currentLayerObject.borderColor = input.value;
        currentLayerElement.style.borderColor = input.value;
      } else {
        currentLayerObject.backgroundColor = input.value;
        currentLayerElement.style.backgroundColor = input.value;
      }
    } else {
      if(isBorder) {
        currentLayerObject.borderColor = DEFAULT_BORDER_SHAPE;
        currentLayerElement.style.borderColor = DEFAULT_BORDER_SHAPE;
      } else {
        currentLayerObject.backgroundColor = DEFAULT_BACKGROUND_SHAPE;
        currentLayerElement.style.backgroundColor = DEFAULT_BACKGROUND_SHAPE;
      }
      input.setCustomValidity(ERROR_MESSAGE_BACKGROUND);
      input.reportValidity();
    }
  });
}

const initSizeInputs = (tab) => {
  const widthInput : HTMLInputElement = tab.querySelector('.design-width');
  const heightInput : HTMLInputElement = tab.querySelector('.design-height');
  if(widthInput) {
      widthInput.addEventListener('input', () => {
        if(widthInput.value) {
          if(parseInt(widthInput.value) < 1) {
            widthInput.value = '1';
          } else if (parseInt(widthInput.value) > 100) {
            widthInput.value = '100';
          }
          currentLayerObject.width = widthInput.value;
          currentLayerElement.style.width = widthInput.value + '%';
        } else {
          currentLayerObject.width = '30';
          currentLayerElement.style.removeProperty('width');
        }

      });
    }
    if (heightInput) {
      heightInput.addEventListener('input', () => {
        if(heightInput.value) {
          if(parseInt(heightInput.value) < 0) {
            heightInput.value = '0';
          } else if (parseInt(heightInput.value) > 100) {
            heightInput.value = '100';
          }
          currentLayerObject.height = heightInput.value;
          currentLayerElement.style.height = heightInput.value + '%';
        } else {
          currentLayerObject.height = '20';
          currentLayerElement.style.removeProperty('height');
        }
      });
    }
};

const initCoordinatesInputs = (tab) => {
  const xInput : HTMLInputElement = tab.querySelector('.design-x');
  const yInput : HTMLInputElement = tab.querySelector('.design-y');
  if (xInput) {
    xInput.addEventListener('input', () => {
      if(xInput.value) {
        if(parseInt(xInput.value) < 0) {
          xInput.value = '0';
        } else if (parseInt(xInput.value) > 99) {
          xInput.value = '99';
        }
        currentLayerObject.x = xInput.value;
        currentLayerElement.style.left = xInput.value + '%';
      } else {
        currentLayerObject.x = '0';
        currentLayerElement.style.removeProperty('left');
      }
      console.log(currentLayerObject);
    });
  }
  if (yInput) {
    yInput.addEventListener('input', () => {
      if(yInput.value) {
        if(parseInt(yInput.value) < 0) {
          yInput.value = '0';
        } else if (parseInt(yInput.value) > 99) {
          yInput.value = '99';
        }
        currentLayerObject.y = yInput.value;
        currentLayerElement.style.top = yInput.value + '%';
      } else {
        currentLayerObject.y = '0';
        currentLayerElement.style.removeProperty('top');
      }
    });
  }
};

const initSubmit = () => {
  const userEmail = JSON.parse(localStorage.getItem('userEmail'));
  if(userEmail) {
    if(submitButton) {
      submitButton.addEventListener('click', () => {
        postTemplate(userEmail);
        localStorage.removeItem('userTemplates');
        window.location.href = 'design-catalog';
      });
    }
  }
};

// const postTemplate = (userEmail: string) => {

//   const response = fetch('/design-editor', {
//     method: 'post',
//     headers: {
//       'Content-type': 'application/json',
//       'charset': 'utf-8'
//     },
//     body: JSON.stringify({
//       email: userEmail,
//       template: templateObject
//     })
//   });
//   console.log(templateObject);
// };

const postTemplate = (userEmail: string) => {
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
    const response = fetch('/design-editor-new', options);
  } else {
    const response = fetch('/design-editor-old', options);
  }
  console.log(templateObject);
};

const temp = () => {
  localStorage.setItem('userEmail', JSON.stringify('login@login'));
};

export const initDesignEditor = () => {
  if(pageID) {
    setTemplateObject();
    setStartingInfo();
    initNameInput();
    initEditorPopup();
    initEditorTabButtons();
    initEditorTabsInput();
    initBackgroundInput();
    initSubmit();
    temp();
  }
};
