'use strict';

const pageID = document.querySelector('.register-page');
const firstPassword : HTMLInputElement = document.querySelector('#register-password') as HTMLInputElement;
const secondPassword : HTMLInputElement = document.querySelector('#register-second-password') as HTMLInputElement;
const form : HTMLFormElement = document.querySelector('#register-form') as HTMLFormElement;

const checkPasswords = () => {
  if (firstPassword && secondPassword && form) {
    form.addEventListener('submit', function (e) {
       e.preventDefault();
       if (firstPassword.value === secondPassword.value) {
         secondPassword.setCustomValidity('')
         form.submit();
       } else {
         secondPassword.setCustomValidity('Passwords mismatch');
         secondPassword.reportValidity();
         secondPassword.addEventListener('input', checkSecondPassword);
       }
    });
  }
};

const checkSecondPassword = () => {
  if (firstPassword && secondPassword) {
    if (firstPassword.value === secondPassword.value) {
      secondPassword.setCustomValidity('')
    } else {
      secondPassword.setCustomValidity('Пароли должны совпадать');
    }
  }
};

export const initRegister = () => {
  if (pageID) {
    checkPasswords();
  }
};
