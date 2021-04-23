'use strict';
export const generateId = () : string => {
  let tempId : string = '';
  for (let i = 0; i < 7; i++) {
    tempId += (Math.floor(Math.random()*10)).toString();
  }
  return tempId;
};

export const debounce = function (cb: Function) {
  let lastTimeout: ReturnType<typeof setTimeout>;
  return function () {
    const fnCall = () => { cb.apply( arguments) };
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(fnCall, 500);
  };
};

// const onNameChange = function () {
//   if (nameInput) {
//     const currentEmail = JSON.parse(localStorage.getItem('user') as string);
//     const postThisName = function () {
//       postName(currentEmail, nameInput.value);
//       if (localStorage.getItem('personalData')) {
//         localStorage.removeItem('personalData');
//       }
//     };
//     const debouncedPostName = debounce(postThisName);
//     nameInput.addEventListener('input', debouncedPostName);
//   }
// };
