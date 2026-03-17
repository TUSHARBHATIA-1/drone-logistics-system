import API from './api';

export const getMarketplaceItems = async () => {
  const res = await API.get('/marketplace');
  return res.data;
};

export const checkoutMarketplace = async (cartItems) => {
  const res = await API.post('/marketplace/checkout', { items: cartItems });
  return res.data;
};

export const sellDrone = async (id) => {
  const res = await API.post(`/marketplace/sell/${id}`);
  return res.data;
};

export const repairDrone = async (id) => {
  const res = await API.post(`/marketplace/repair/${id}`);
  return res.data;
};
