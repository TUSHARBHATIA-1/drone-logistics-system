import api from './api';

export const getMarketplaceItems = async () => {
  const { data } = await api.get('/marketplace');
  return data.data;
};

export const checkoutMarketplace = async (cartItems) => {
  const { data } = await api.post('/marketplace/checkout', { cartItems });
  return data;
};

export const sellDrone = async (id) => {
  const { data } = await api.post(`/marketplace/sell/${id}`);
  return data;
};

export const repairDrone = async (id) => {
  const { data } = await api.post(`/marketplace/repair/${id}`);
  return data;
};
