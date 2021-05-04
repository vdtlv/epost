'use strict';

const pageID = document.querySelector('.login-page');
const loginForm: HTMLFormElement = document.querySelector('#login') as HTMLFormElement;

const onFormSubmit = function () {
  if (loginForm) {
    const emailField: HTMLInputElement = loginForm.querySelector('#login-email') as HTMLInputElement;
    loginForm.addEventListener('submit', function (evt) {
      evt.preventDefault();
      localStorage.clear();
      localStorage.setItem('userEmail', JSON.stringify(emailField.value) as string);
      loginForm.submit();
    });
  }
}

export const initLogin = function () {
  if (pageID) {
    onFormSubmit();
  }
};
