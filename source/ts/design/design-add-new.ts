'use strict';

import { templateData } from '../base/template.js';


const pageID = document.querySelector('.design-add-new');
const templatesList = document.querySelector('.template-menu__list');
const groupTemplateElement: HTMLTemplateElement = <HTMLTemplateElement> document.querySelector('#group-template');
const templateTemplateElement: HTMLTemplateElement = <HTMLTemplateElement> document.querySelector('#template-template');

const insertGroup = (group: HTMLElement) => {
  templatesList.appendChild(group as Node);
};

const showTiles = () => {
  const templateBaseData = JSON.parse(localStorage.getItem('templateBase'));
  if(templateBaseData) {
    templateBaseData.forEach(templateBase => {
      generateSiteTemplates(templateBase);
    });
  }
};

const generateSiteTemplates = (templateBase) => {
  const groupTemplate = groupTemplateElement.content.cloneNode(true) as HTMLElement;
  if(groupTemplate) {
    const groupName = groupTemplate.querySelector('h3');
    if(groupName) {
      groupName.textContent = templateBase.id;
    }
    const groupList = groupTemplate.querySelector('ul');
    if(groupList) {
      console.log(groupList);
      const templates = templateBase.data;
      templates.forEach(template => {
        const templateTile = createTile(template);
        groupList.appendChild(templateTile as Node);
      });
    }
    insertGroup(groupTemplate);
  }
};

const createTile = (template) => {
  const tile = templateTemplateElement.content.cloneNode(true) as HTMLElement;
  if (tile) {
    tile.id = template.id;
    const tileName = tile.querySelector('h4');
    if(tileName) {
      tileName.textContent = template.type;
    }
    const tilePreview = tile.querySelector('.mini-tile__preview');
    if(tilePreview) {
      tilePreview.classList.add('mini-tile__preview--' + template.ratio);
      tilePreview.textContent = template.width + ' × ' + template.height;
    }
    onTileClick(tile);
    return tile;
  }
};

const onTileClick = (tile) => {
  const button = tile.querySelector('button');
  button.addEventListener('click', () => {
    localStorage.removeItem('currentObject');
    localStorage.setItem('currentID', JSON.stringify(tile.id));
    window.location.href = 'design-editor';
  });
};

export const initDesignAddNew = () => {
  if(pageID) {
    showTiles();
  }
}
