import { showAlert } from './alerts.js';
export async function changeInformation(dataInput, type) {
  // type  is password or data
  console.log(dataInput);
  try {
    const url = type === 'password' ? 'updateMyPassword' : 'updateMe';
    const res = await fetch(`http://127.0.0.1:8000/api/v1/users/${url}`, {
      method: 'PATCH',
      body: JSON.stringify(dataInput),
    });
    const data = await res.json();
    if (data.status === 'error') throw new Error(data.message);
    showAlert('success', 'Settings updated');
  } catch (error) {
    showAlert('error', error.message);
  }
}
