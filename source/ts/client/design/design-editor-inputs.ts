'use strict';

import { DEFAULT_BACKGROUND } from '../base/util.js';
import { BackgroundLayer, TextLayer, ImageLayer, ShapeLayer } from '../base/layers.js';
import { getCurrent } from './design-editor.js';

const templateElement: HTMLElement = document.querySelector('.card__template') as HTMLElement;
const nameInput : HTMLInputElement = document.querySelector('#template-name') as HTMLInputElement;

const HEX_REG_EX = new RegExp('^#(?:[0-9a-fA-F]{3}){1,2}$');
const ERROR_MESSAGE_COLOR : string = 'Wrong format!';
const DEFAULT_BACKGROUND_SHAPE : string = 'transparent';
const DEFAULT_BORDER_SHAPE : string = '#000000';
const DEFAULT_FONT_COLOR : string = '#000000';

const backgroundTab : HTMLElement = document.querySelector('#background') as HTMLElement;
const textTab : HTMLElement = document.querySelector('#text-layer') as HTMLElement;
const imageTab : HTMLElement = document.querySelector('#image-layer') as HTMLElement;
const shapeTab : HTMLElement = document.querySelector('#shape-layer') as HTMLElement;

// // Вкладка фона
const initBackgroundInput = () => {
  if(backgroundTab) {
    const backgroundInput : HTMLInputElement = backgroundTab.querySelector('#design-background') as HTMLInputElement;
    backgroundInput.addEventListener('input', () => {
      if (backgroundInput.value.match(HEX_REG_EX)) {
        backgroundInput.setCustomValidity('');
        (getCurrent().currentLayerObject as BackgroundLayer).color = backgroundInput.value;
        templateElement.style.backgroundColor = backgroundInput.value;
      } else {
        (getCurrent().currentLayerObject as BackgroundLayer).color = DEFAULT_BACKGROUND;
        templateElement.style.backgroundColor = DEFAULT_BACKGROUND;
        backgroundInput.setCustomValidity(ERROR_MESSAGE_COLOR);
        backgroundInput.reportValidity();
      }
    });
  }
};

// Вкладка текста
const initTextInputs = () => {
  if(textTab) {
    initSizeInputs(textTab);
    initCoordinatesInputs(textTab, false);
    const fontSizeInput : HTMLInputElement = textTab.querySelector('.design-font-size') as HTMLInputElement;
    const fontColorInput : HTMLInputElement = textTab.querySelector('.design-color') as HTMLInputElement;
    const hAlignInputs = textTab.querySelectorAll('.design-horizontal-align');
    const vAlignInputs = textTab.querySelectorAll('.design-vertical-align');
    if (fontSizeInput) {
      fontSizeInput.addEventListener('input', () => {
        (getCurrent().currentLayerObject as TextLayer).fontSize = parseInt(fontSizeInput.value);
        if(getCurrent().currentLayerElement) {
          getCurrent().currentLayerElement!.style.fontSize = fontSizeInput.value + 'px';
        }
      });
    }
    if (fontColorInput) {
      fontColorInput.addEventListener('input', () => {
        const element = getCurrent().currentLayerElement;
        if (element) {
          if (fontColorInput.value.match(HEX_REG_EX)) {
            fontColorInput.setCustomValidity('');
            (getCurrent().currentLayerObject as TextLayer).fontColor = fontColorInput.value;
            element.style.color = fontColorInput.value;
          } else {
            (getCurrent().currentLayerObject as TextLayer).fontColor = DEFAULT_FONT_COLOR;
            element.style.color = DEFAULT_FONT_COLOR;
            fontColorInput.setCustomValidity(ERROR_MESSAGE_COLOR);
            fontColorInput.reportValidity();
          }
        }
      });
    }
    if (hAlignInputs) {
      hAlignInputs.forEach((input: Element) => {
        input.addEventListener('change', () => {
          (getCurrent().currentLayerObject as TextLayer).horAlign = (input as HTMLInputElement).value;
          const element = getCurrent().currentLayerElement;
          if (element) {
            switch ((input as HTMLInputElement).value) {
              case "left":
                element.style.justifyContent = 'flex-start';
                break;

              case "center":
                element.style.justifyContent = 'center';
                break;

              case "right":
                element.style.justifyContent = 'flex-end';
                break;
            }
            element.style.textAlign = (input as HTMLInputElement).value;
          }
        });
      });
    }
    if (vAlignInputs) {
      vAlignInputs.forEach((input) => {
        input.addEventListener('change', () => {
          (getCurrent().currentLayerObject as TextLayer).verAlign = (input as HTMLInputElement).value;
          const element = getCurrent().currentLayerElement;
          if(element) {
            element.style.alignItems = (input as HTMLInputElement).value;
          }
        });
      });
    }
  }
};

// Вкладка изображения
const initImageInputs = () => {
  if(imageTab) {
    initSizeInputs(imageTab);
    initCoordinatesInputs(imageTab, false);
  }
};


// Вкладка декоративного элемента
const initShapeInputs = () => {
  if(shapeTab) {
    initSizeInputs(shapeTab);
    initCoordinatesInputs(shapeTab, true);
    const backgroundInput : HTMLInputElement = shapeTab.querySelector('.design-background') as HTMLInputElement;
    const borderColorInput : HTMLInputElement = shapeTab.querySelector('.design-border-color') as HTMLInputElement;
    const borderWidthInput : HTMLInputElement = shapeTab.querySelector('.design-border-width') as HTMLInputElement;
    const borderRadiusInput : HTMLInputElement = shapeTab.querySelector('.design-border-radius') as HTMLInputElement;
    if(backgroundInput) {
      initShapeColorsInputs(backgroundInput, false);
    }
    if(borderColorInput) {
      initShapeColorsInputs(borderColorInput, true);
    }
    if(borderWidthInput) {
      borderWidthInput.addEventListener('input', () => {
        const element = getCurrent().currentLayerElement;
        if (element) {
          if(borderWidthInput.value) {
            if(parseInt(borderWidthInput.value) < 0) {
              borderWidthInput.value = '0';
            }
            (getCurrent().currentLayerObject as ShapeLayer).borderWidth = parseInt(borderWidthInput.value);
            element.style.borderWidth = borderWidthInput.value + 'px';
            element.style.borderStyle = 'solid';
          } else {
            (getCurrent().currentLayerObject as ShapeLayer).borderWidth = 0;
            element.style.removeProperty('border-width');
            element.style.removeProperty('border-style');
          }
        }
      });
    }
    if(borderRadiusInput) {
      borderRadiusInput.addEventListener('input', () => {
        const element = getCurrent().currentLayerElement;
        if (element) {
          if(borderRadiusInput.value) {
            if(parseInt(borderRadiusInput.value) < 0) {
              borderRadiusInput.value = '0';
            } else if (parseInt(borderRadiusInput.value) > 50) {
              borderRadiusInput.value = '50';
            }
            (getCurrent().currentLayerObject as ShapeLayer).borderRadius = parseInt(borderRadiusInput.value);
            element.style.borderRadius = borderRadiusInput.value + '%';
          } else {
            (getCurrent().currentLayerObject as ShapeLayer).borderRadius = 0;
            element.style.removeProperty('border-radius');
          }
        }
      });
    }
  }
};

// Добавляет проверки на поля ввода цвета
const initShapeColorsInputs = (input: HTMLInputElement, isBorder: boolean) => {
  input.addEventListener('input', () => {
    const element = getCurrent().currentLayerElement;
    if (element) {
      if (input.value.match(HEX_REG_EX)) {
        input.setCustomValidity('');
        if(isBorder) {
          (getCurrent().currentLayerObject as ShapeLayer).borderColor = input.value;
          element.style.borderColor = input.value;
        } else {
          (getCurrent().currentLayerObject as ShapeLayer).backgroundColor = input.value;
          element.style.backgroundColor = input.value;
        }
      } else {
        if(isBorder) {
          (getCurrent().currentLayerObject as ShapeLayer).borderColor = DEFAULT_BORDER_SHAPE;
          element.style.borderColor = DEFAULT_BORDER_SHAPE;
        } else {
          (getCurrent().currentLayerObject as ShapeLayer).backgroundColor = DEFAULT_BACKGROUND_SHAPE;
          element.style.backgroundColor = DEFAULT_BACKGROUND_SHAPE;
        }
        input.setCustomValidity(ERROR_MESSAGE_COLOR);
        input.reportValidity();
      }
    }
  });
}

// Привязывает поля ввода размеров к текущему слою
const initSizeInputs = (tab: HTMLElement) => {
  const widthInput : HTMLInputElement = tab.querySelector('.design-width') as HTMLInputElement;
  const heightInput : HTMLInputElement = tab.querySelector('.design-height') as HTMLInputElement;
  if(widthInput) {
      widthInput.addEventListener('input', () => {
        const element = getCurrent().currentLayerElement;
        if (element) {
          if(widthInput.value) {
            if(parseInt(widthInput.value) < 1) {
              widthInput.value = '1';
            } else if (parseInt(widthInput.value) > 100) {
              widthInput.value = '100';
            }
            (getCurrent().currentLayerObject as TextLayer | ImageLayer | ShapeLayer).width = parseInt(widthInput.value);
            element.style.width = widthInput.value + '%';
          } else {
            (getCurrent().currentLayerObject as TextLayer | ImageLayer | ShapeLayer).width = 30;
            element.style.removeProperty('width');
          }
        }
      });
    }
    if (heightInput) {
      heightInput.addEventListener('input', () => {
        const element = getCurrent().currentLayerElement;
        if (element) {
          if(heightInput.value) {
            if(parseInt(heightInput.value) < 0) {
              heightInput.value = '0';
            } else if (parseInt(heightInput.value) > 100) {
              heightInput.value = '100';
            }
            (getCurrent().currentLayerObject as TextLayer | ImageLayer | ShapeLayer).height = parseInt(heightInput.value);
            element.style.height = heightInput.value + '%';
          } else {
            (getCurrent().currentLayerObject as TextLayer | ImageLayer | ShapeLayer).height = 20;
            element.style.removeProperty('height');
          }
        }
      });
    }
};

// Привязывает поля ввода координат к текущему слою
const initCoordinatesInputs = (tab: HTMLElement, isShape: boolean) => {
  const xInput : HTMLInputElement = tab.querySelector('.design-x') as HTMLInputElement;
  const yInput : HTMLInputElement = tab.querySelector('.design-y') as HTMLInputElement;
  if (xInput) {
    xInput.addEventListener('input', () => {
      const element = getCurrent().currentLayerElement;
      if (element) {
        if(xInput.value) {
          if(isShape) {
            if(parseInt(xInput.value) < -99) {
              xInput.value = '-99';
            } else if (parseInt(xInput.value) > 99) {
              xInput.value = '99';
            }
          } else {
            if(parseInt(xInput.value) < 0) {
              xInput.value = '0';
            } else if (parseInt(xInput.value) > 99) {
              xInput.value = '99';
            }
          }
          (getCurrent().currentLayerObject as TextLayer | ImageLayer | ShapeLayer).x = parseInt(xInput.value);
          element.style.left = xInput.value + '%';
        } else {
          (getCurrent().currentLayerObject as TextLayer | ImageLayer | ShapeLayer).x = 0;
          element.style.removeProperty('left');
        }
      }
    });
  }
  if (yInput) {
    yInput.addEventListener('input', () => {
      const element = getCurrent().currentLayerElement;
      if (element) {
        if(yInput.value) {
          if(isShape) {
            if(parseInt(yInput.value) < -99) {
              yInput.value = '-99';
            } else if (parseInt(yInput.value) > 99) {
              yInput.value = '99';
            }
          } else {
            if(parseInt(yInput.value) < 0) {
              yInput.value = '0';
            } else if (parseInt(yInput.value) > 99) {
              yInput.value = '99';
            }
          }
          (getCurrent().currentLayerObject as TextLayer | ImageLayer | ShapeLayer).y = parseInt(yInput.value);
          element.style.top = yInput.value + '%';
        } else {
          (getCurrent().currentLayerObject as TextLayer | ImageLayer | ShapeLayer).y = 0;
          element.style.removeProperty('top');
        }
      }
    });
  }
};

// Привязывает поле ввода имени к объекту шаблона
const initNameInput = () => {
  if(nameInput) {
    nameInput.addEventListener('input', () => {
      getCurrent().templateObject!.name = nameInput.value;
    });
  }
};

export const initEditorInputs = () => {
  initBackgroundInput();
  initTextInputs();
  initImageInputs();
  initShapeInputs();
  initNameInput();
};
