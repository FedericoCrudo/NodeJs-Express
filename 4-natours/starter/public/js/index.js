/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { changeInformation } from './accountOperations';
import { showAlert } from './alerts.js';
// import { updateData } from './updateSettings.js';
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form .form');
const logoutBtn = document.querySelector('.nav__el--logout');
const changeInformationForm = document.querySelector('.form-user-data');
const userPasswordDataForm = document.querySelector('.form-user-password');
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries([...new FormData(e.target)]);
    // eslint-disable-next-line node/no-unsupported-features/es-builtins
    if (!data.email || !data.password) return;
    // eslint-disable-next-line no-use-before-define
    login(data);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (changeInformationForm) {
  changeInformationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(document.getElementById('name').value);
    // if (!data.name || !data.email)
    //   return showAlert('error', 'Please fill one or more field');
    changeInformation(form, 'data');
  });
}

if (userPasswordDataForm) {
  userPasswordDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    // OPERAZIONE FORM
    const data = Object.fromEntries([...new FormData(e.target)]);
    if (!data.passwordConfirm || !data.passwordCurrent || !data.password)
      return showAlert('error', 'Please fill one or more field');
    await changeInformation(data, 'password');
    document.querySelector('.btn--save-password').textContent = 'Save password';

    // OPERAZIONE FORM
    e.target.reset();
  });
}
