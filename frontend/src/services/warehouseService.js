import api from './api';

export const getWarehouses = async () => {
  const { data } = await api.get('/warehouses');
  return data.data;
};

export const addWarehouse = async (warehouseData) => {
  const { data } = await api.post('/warehouses', warehouseData);
  return data.data;
};
