/* eslint-disable */
import { showAlert } from './alerts.js';

export async function login(dataInput) {
  try {
    const data = await fetch('http://127.0.0.1:8000/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataInput),
    });
    const response = await data.json();
    if (response.status === 'error') throw new Error(response.message);
    showAlert('success', 'Logged in successfuly');
    // eslint-disable-next-line no-undef
    window.setTimeout(() => {
      // eslint-disable-next-line no-restricted-globals, no-undef
      location.assign('/');
    }, 1500);
  } catch (error) {
    showAlert('error', error.message);
  }
}
export async function logout() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/users/logout');
    const data = await res.json();
    console.log(data);
    //con true forxerà un reload dal server e non dalla cache del browser
    if ((data.status = 'success')) location.reload(true);
  } catch (error) {
    showAlert('error', 'Error logging out! Try again');
  }
}
