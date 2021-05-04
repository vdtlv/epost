'use strict';
import { generateId, DEFAULT_BACKGROUND } from './util.js';

export class BackgroundLayer {
  id: string;
  color: string = DEFAULT_BACKGROUND;

  constructor () {
    this.id = 'b' + generateId();
  };
};

class layer {
  id!: string;  // Инициализируется в конструкторах всех наследников, так что точно будет присутствовать
  x: number = 0;
  y: number = 0;
  width: number = 30;
  height: number = 20;
}

export class TextLayer extends layer {
  content: string = 'Sample Text';
  // fontFamily: string;
  // fontStyle: string;//Ещё нет на макете
  // fontWeight: string;//Ещё нет на макете
  fontSize?: number;
  horAlign?: string;
  verAlign?: string;

  constructor () {
    super();
    this.id = 't' + generateId();
  };
};

export class ImageLayer extends layer {
  content: string = 'Image';
  img: string = 'default.png';

  constructor () {
    super();
    this.id = 'i' + generateId();
  };
};

export  class ShapeLayer extends layer {
  content: string = 'Shape';
  backgroundColor: string = 'transparent';
  borderColor: string = '#000000';
  borderWidth: number = 0;
  borderRadius: number = 0;

  constructor () {
    super();
    this.id = 's' + generateId();
  };
};
