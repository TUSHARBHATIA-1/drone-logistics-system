import API from './api';

export const createAssignment = async (data) => {
  const res = await API.post('/assignments', data);
  return res.data;
};

export const getAssignments = async () => {
  const res = await API.get('/assignments');
  return res.data;
};

export const updateAssignment = async (id, data) => {
  const res = await API.put(`/assignments/${id}`, data);
  return res.data;
};

export const cancelAssignment = async (id) => {
  const res = await API.delete(`/assignments/${id}`);
  return res.data;
};
