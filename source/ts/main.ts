'use strict';
import { loadAllTemplates } from './base/template.js';
import { initDesignCatalog } from './design/design-catalog.js';
import { initDesignAddNew } from './design/design-add-new.js';
import { initDesignEditor } from './design/design-editor.js';
import { initSMMCatalog } from './smm/smm-catalog.js';
import { initSMMEditor } from './smm/smm-editor.js';

loadAllTemplates('login@login');
//инициализация логина
//инициализация регистрации
//инициализация забылипароль

initDesignCatalog();
initDesignAddNew();
initDesignEditor();
initSMMCatalog();
initSMMEditor();
//инициализация smm
// console.log(isOnIntroPages());
