import API from './api';

export const getWarehouses = async () => {
  const res = await API.get('/warehouses');
  return res.data;
};

export const addWarehouse = async (data) => {
  const res = await API.post('/warehouses', data);
  return res.data;
};
