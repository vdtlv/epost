'use-strict';

import { openPopup } from './popup.js';
import { templateData, loadAllTemplates } from './template.js';
import { TextLayer, ShapeLayer } from './layers.js';

const templateList = document.querySelector('#template-list') as HTMLUListElement;
const tileTemplateElement = document.querySelector('#template-tile') as HTMLTemplateElement;
const tileLayerTemplateElement = document.querySelector('#template-layer') as HTMLTemplateElement;
let deletableTemplate: HTMLElement;

const generateTemplateTile = (template: templateData) => {
  const tile = tileTemplateElement.content.querySelector('li')!.cloneNode(true) as HTMLElement;
  if(tile) {
    if(template.id) {
      tile.id = template.id;
    }
    const tileTemplate: HTMLElement = tile.querySelector('.tile__template') as HTMLElement;
    if(tileTemplate) {
      tileTemplate.style.background = template.background;
      const ratio = template.ratio;
      tileTemplate.classList.add('tile__template--' + ratio);
    }
    const tileName: HTMLElement = tile.querySelector('.tile__name') as HTMLElement;
    if(tileName) {
      if(template.name) {
        tileName.textContent = template.name!.toString();
      }
    }
    const tileType = tile.querySelector('.tile__type');
    if(tileType) {
      tileType.textContent = `${template.social} ${template.type}`;
    }
    const layersIDs = template.layers;
    layersIDs.forEach((layerID) => {
      const layerElement = tileLayerTemplateElement.content.querySelector('div')!.cloneNode(true) as HTMLElement;
      let layerObject;
      if(layerElement) {
        const layerType = layerID.charAt(0);
        if(layerType) {
          switch (layerType) {
            case "t":
              if(template.textLayers) {
                for (let i = 0; i < template.textLayers.length; i++) {
                  if(layerID === template.textLayers[i]!.id) {
                    layerObject = template.textLayers[i];
                    layerElement.style.backgroundColor = 'rgba(221, 170, 221, 0.3)';
                  }
                }
              }
              break;

            case "i":
              if(template.imageLayers) {
                for (let i = 0; i < template.imageLayers.length; i++) {
                  if(layerID === template.imageLayers[i]!.id) {
                    layerObject = template.imageLayers[i];
                    layerElement.style.backgroundImage = "url(img/default.png)";
                  }
                }
              }

              break;

            case "s":
              if(template.shapeLayers) {
                for (let i = 0; i < template.shapeLayers.length; i++) {
                  if(layerID === template.shapeLayers[i]!.id) {
                    layerObject = template.shapeLayers[i];
                  }
                }
              }
              break;
          }
          if(layerObject) {
            layerElement.style.left = layerObject.x + '%';
            layerElement.style.top = layerObject.y + '%';
            layerElement.style.width = (layerObject.width === 0) ? 'auto' : layerObject.width + '%';
            layerElement.style.height = (layerObject.height === 0) ? 'auto' : layerObject.height + '%';
            if(layerObject.content) {
              layerElement.textContent = layerObject.content;
            }
            if((layerObject as TextLayer).fontSize) {
              layerElement.style.fontSize = Math.floor(((layerObject as TextLayer).fontSize! * 1.7)) + 'px';
            }
            if((layerObject as TextLayer).fontColor) {
              layerElement.style.color = (layerObject as TextLayer).fontColor!;
            }
            if((layerObject as TextLayer).horAlign) {
              layerElement.style.textAlign = (layerObject as TextLayer).horAlign!;
              switch((layerObject as TextLayer).horAlign) {
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
            }
            if((layerObject as TextLayer).verAlign) {
              layerElement.style.alignItems = (layerObject as TextLayer).verAlign!;
            }
            if((layerObject as ShapeLayer).borderWidth) {
              layerElement.style.borderWidth = Math.floor(((layerObject as ShapeLayer).borderWidth * 1.7)) + 'px';
              layerElement.style.borderStyle = 'solid';
            }
            if((layerObject as ShapeLayer).borderColor) {
              layerElement.style.borderColor = (layerObject as ShapeLayer).borderColor;
            }
            if((layerObject as ShapeLayer).borderRadius) {
              layerElement.style.borderRadius = (layerObject as ShapeLayer).borderRadius + '%';
            }
            if((layerObject as ShapeLayer).backgroundColor) {
              layerElement.style.backgroundColor = (layerObject as ShapeLayer).backgroundColor;
            }
          }
        }
        tileTemplate.appendChild(layerElement);
      }
    });
  }
  addDeleteTemplateTile(tile);
  insertTemplateTile(tile);
  onEditClick(tile, template);
  onUseClick(tile, template);
};

const addDeleteTemplateTile = (tile: HTMLElement) => {
  if(tile) {
    const button = tile.querySelector('.delete-button');
    if(button) {
      button.addEventListener('click', function () {
        openPopup();
        deletableTemplate = tile;
      });
    }
  }
};

const insertTemplateTile = (tile: HTMLElement) => {
  templateList.insertAdjacentElement('beforeend', tile);
};

const onEditClick = (tile: HTMLElement, object: templateData) => {
  if(tile) {
    const editButton = tile.querySelector('.edit');
    if(editButton) {
      editButton.addEventListener('click', () => {
        localStorage.removeItem('currentID');
        localStorage.setItem('currentObject', JSON.stringify(object));
        window.location.href = 'design-editor';
      });
    }
  }
};

const onUseClick = (tile: HTMLElement, object: templateData) => {
  if(tile) {
    const useButton = tile.querySelector('.use');
    if(useButton) {
      useButton.addEventListener('click', () => {
        localStorage.setItem('currentObject', JSON.stringify(object));
        window.location.href = 'smm-editor';
      });
    }
  }
};

export const removeTemplate = () => {
  if(deletableTemplate) {
    deletableTemplate.parentNode!.removeChild(deletableTemplate);
    if(localStorage.getItem('userEmail')) {
      const userEmail = JSON.parse(localStorage.getItem('userEmail') as string);
      const data = JSON.stringify({
        email: userEmail,
        templateID: deletableTemplate.id
      });
      const options = {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
          'charset': 'utf-8'
        },
        body: data
      };
      fetch('/design-catalog-remove', options);
      if(localStorage.getItem('userTemplates')) {
        localStorage.removeItem('userTemplates');
      }
    }
  }
};

export const showTemplates = async () => {
  if(localStorage.getItem('userEmail')) {
    const userEmail = JSON.parse(localStorage.getItem('userEmail') as string);
    await loadAllTemplates(userEmail);
  }

  if(localStorage.getItem('userTemplates')) {
    const templates = JSON.parse(localStorage.getItem('userTemplates')!);
    if(templates) {
      templates.forEach((template: templateData) => {
        generateTemplateTile(template);
      });
    }
  }

};
