'use strict';

const popup : HTMLElement = document.querySelector('#popup') as HTMLElement;
const overlay : HTMLElement = document.querySelector('.overlay') as HTMLElement;

export const openPopup = () => {
  overlay.classList.remove('hidden');
  overlay.addEventListener('click', closePopup);
  popup.classList.add('popup');
  popup.classList.remove('hidden');
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
