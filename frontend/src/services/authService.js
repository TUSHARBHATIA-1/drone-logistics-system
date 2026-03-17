import API from './api';

export const loginUser = async (data) => {
  const res = await API.post('/auth/login', data);
  return res.data;
};

export const registerUser = async (data) => {
  console.log("authService: registerUser called with:", data);
  const res = await API.post('/auth/register', data);
  console.log("authService: registerUser response:", res.data);
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
};
