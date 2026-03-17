import API from './api';

export const getNotifications = async () => {
  const token = localStorage.getItem('token');
  if (!token) return { data: [] };

  const res = await API.get('/notifications');
  return res.data;
};

export const markAsRead = async (id) => {
  const res = await API.put(`/notifications/${id}/read`);
  return res.data;
};

export const markAllAsRead = async () => {
  const res = await API.put('/notifications/read-all');
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await API.delete(`/notifications/${id}`);
  return res.data;
};
