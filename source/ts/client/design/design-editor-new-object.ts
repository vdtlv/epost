'use strict';

import { templateData, templateGroupsData } from '../base/template.js';

// Создаёт объект, с которым будет вестись работа - или загружает старый из localStorage
export const createNewTemplateObject = (currentID: string) => {
  const templateObject = new templateData();
  if(currentID) {
    if(localStorage.getItem('templateBase')) {
      const allBaseTemplates = JSON.parse(localStorage.getItem('templateBase')!);
      const firstIDCharacter = currentID.charAt(0);
      if(allBaseTemplates) {
        let neededCategory = "";
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
        allBaseTemplates.forEach((baseTemplate: templateGroupsData) => {
          if(baseTemplate.id === neededCategory) {
            baseTemplate.data.forEach((template) => {
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
  }
  return templateObject;
};
