import api from './api';

export const getAllDrones = async () => {
  const { data } = await api.get('/drones');
  return data.data;
};

export const addDrone = async (droneData) => {
  const { data } = await api.post('/drones', droneData);
  return data.data;
};

export const updateDrone = async (id, droneData) => {
  const { data } = await api.put(`/drones/${id}`, droneData);
  return data.data;
};

export const deleteDrone = async (id) => {
  const { data } = await api.delete(`/drones/${id}`);
  return data;
};
