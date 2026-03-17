import API from './api';

export const getDrones = async () => {
  const res = await API.get('/drones');
  return res.data;
};

export const addDrone = async (data) => {
  const res = await API.post('/drones', data);
  return res.data;
};

export const updateDrone = async (id, data) => {
  const res = await API.put(`/drones/${id}`, data);
  return res.data;
};

export const deleteDrone = async (id) => {
  const res = await API.delete(`/drones/${id}`);
  return res.data;
};