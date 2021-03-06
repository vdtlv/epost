'use strict';

const login = document.querySelector('.login');
const register = document.querySelector('.register');

import { generateId } from './../base/util.js';
import { TextLayer, ImageLayer, ShapeLayer } from './../base/layers.js';

const isOnIntroPages = () => register || login;

export class templateBaseData {
  id?: string;
  social?: string;
  type?: string;
  name?: string;
  width?: number;
  height?: number;
  ratio?: string;
   constructor () {
    this.id = generateId();
  }
};

export class templateData extends templateBaseData {
  background: string = '#ffffff';
  textLayers: Array<TextLayer> = [];
  imageLayers: Array<ImageLayer> = [];
  shapeLayers: Array<ShapeLayer> = [];
  layers: Array<string> = [];
};

const getTemplateBaseData = async () => {
  const response = await fetch('/design-add-new', {
    method: 'post'
  });
  const templateData = await response.json();
  return templateData;
};

const getUserTemplateData = async (email: string) => {
  const response = await fetch('/design-catalog', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      'charset': 'utf-8'
    },
    body: JSON.stringify({
      'email': email
    })
  });
  const templateData = await response.json();
  return templateData;
};

export const loadAllTemplates = async (email?: string) => {
  if(!isOnIntroPages()) {
    if(!localStorage.getItem('templateBase')) {
      const templateBaseData = await getTemplateBaseData();
      localStorage.setItem('templateBase', JSON.stringify(templateBaseData));
    }
    if(!localStorage.getItem('userTemplates')) {
      if(email) {
        const userData = await getUserTemplateData(email);
        if(userData) {
          const userTemplatesData = await userData.templates;
          localStorage.setItem('userTemplates', JSON.stringify(userTemplatesData));
        }
      }
    }
  }
};


export class templateGroupsData {
  id: string = "";
  data: Array<templateBaseData> = [];
};
