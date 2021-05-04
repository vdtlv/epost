'use strict';

const popup : HTMLElement = document.querySelector('#template-popup') as HTMLElement;
const addButton : HTMLButtonElement = document.querySelector('#add-layer') as HTMLButtonElement;
const overlay : HTMLElement = document.querySelector('.overlay') as HTMLElement;

export const initEditorPopup = () => {
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

export const closePopup = () => {
  const popup : HTMLElement = document.querySelector('.popup') as HTMLElement;
  if(popup) {
    popup.classList.add('hidden');
    popup.classList.remove('popup');
    overlay.classList.add('hidden');
    overlay.removeEventListener('click', closePopup);
  }
};
