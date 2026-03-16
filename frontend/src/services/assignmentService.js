import api from './api';

export const createAssignment = async (assignmentData) => {
  const { data } = await api.post('/assignments', assignmentData);
  return data;
};

export const getAssignments = async () => {
  const { data } = await api.get('/assignments');
  return data.data;
};

export const updateAssignment = async (id, updateData) => {
  const { data } = await api.put(`/assignments/${id}`, updateData);
  return data.data;
};

export const cancelAssignment = async (id) => {
  const { data } = await api.delete(`/assignments/${id}`);
  return data;
};
