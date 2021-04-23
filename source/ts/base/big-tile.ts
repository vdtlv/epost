'use-strict';

import { templateData, loadAllTemplates } from './template.js';

const templateList = document.querySelector('#template-list');
const tileTemplateElement: HTMLTemplateElement = document.querySelector('#template-tile');
const tileLayerTemplateElement: HTMLTemplateElement = document.querySelector('#template-layer');

const generateTemplateTile = (template: templateData) => {
  const tile = tileTemplateElement.content.querySelector('li').cloneNode(true) as HTMLElement;
  if(tile) {
    const tileTemplate: HTMLElement = tile.querySelector('.tile__template') as HTMLElement;
    if(tileTemplate) {
      tileTemplate.style.background = template.background;
      const ratio = template.ratio;
      tileTemplate.classList.add('tile__template--' + ratio);
    }
    const tileName: HTMLElement = tile.querySelector('.tile__name') as HTMLElement;
    if(tileName) {
      tileName.textContent = template.name.toString();
    }
    const tileType = tile.querySelector('.tile__type');
    console.log(template.type);
    if(tileType) {
      tileType.textContent = `${template.social} ${template.type}`;
    }
    const layersIDs = template.layers;
    console.log(layersIDs);
    layersIDs.forEach((layerID) => {
      const layerElement = tileLayerTemplateElement.content.querySelector('div').cloneNode(true) as HTMLElement;
      let layerObject;
      if(layerElement) {
        const layerType = layerID.charAt(0);
        if(layerType) {
          switch (layerType) {
            case "t":
              for (let i = 0; i < template.textLayers.length; i++) {
                if(layerID === template.textLayers[i].id) {
                  layerObject = template.textLayers[i];
                  layerElement.style.backgroundColor = 'rgba(221, 170, 221, 0.3)';
                }
              }
              break;

            case "i":
              for (let i = 0; i < template.imageLayers.length; i++) {
                if(layerID === template.imageLayers[i].id) {
                  layerObject = template.imageLayers[i];
                  layerElement.style.backgroundImage = "url(img/default.png)";
                }
              }
              break;

            case "s":
              for (let i = 0; i < template.shapeLayers.length; i++) {
                if(layerID === template.shapeLayers[i].id) {
                  layerObject = template.shapeLayers[i];
                }
              }
              break;
          }
          console.log(layerObject);
          layerElement.style.left = layerObject.x + '%';
          layerElement.style.top = layerObject.y + '%';
          layerElement.style.width = (layerObject.width === 0) ? 'auto' : layerObject.width + '%';
          layerElement.style.height = (layerObject.height === 0) ? 'auto' : layerObject.height + '%';
          if(layerObject.content) {
            layerElement.textContent = layerObject.content;
          }
          if(layerObject.fontSize) {
            layerElement.style.fontSize = Math.floor((layerObject.fontSize * 1.7)) + 'px';
          }
          if(layerObject.horAlign) {
            layerElement.style.textAlign = layerObject.horAlign;
            switch(layerObject.horAlign) {
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
          if(layerObject.verAlign) {
            layerElement.style.alignItems = layerObject.verAlign;
          }
          if(layerObject.borderWidth) {
            layerElement.style.borderWidth = Math.floor((layerObject.borderWidth * 1.7)) + 'px';
            layerElement.style.borderStyle = 'solid';
          }
          if(layerObject.borderColor) {
            layerElement.style.borderColor = layerObject.borderColor;
          }
          if(layerObject.borderRadius) {
            layerElement.style.borderRadius = layerObject.borderRadius + '%';
          }
          if(layerObject.backgroundColor) {
            layerElement.style.backgroundColor = layerObject.backgroundColor;
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
  const button = tile.querySelector('.delete-button');
  if(button) {
      button.addEventListener('click', function () {
      tile.parentNode.removeChild(tile);
    });
  }
};

const insertTemplateTile = (tile: HTMLElement) => {
  templateList.insertAdjacentElement('beforeend', tile);
};

const onEditClick = (tile, object) => {
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

const onUseClick = (tile, object) => {
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

export const showTemplates = async () => {
  const userEmail = JSON.parse(localStorage.getItem('userEmail'));
  await loadAllTemplates(userEmail);
  const templates = JSON.parse(localStorage.getItem('userTemplates'));
  if(templates) {
    templates.forEach(template => {
      generateTemplateTile(template);
    });
  }
};
