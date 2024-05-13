import { showAlert } from './alerts.js';
export const updateData = async (name, email) => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/users/updateMe', {
      method: 'PATCH',
      body: JSON.stringify({ name, email }),
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Data updated successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.messsage);
  }
};
